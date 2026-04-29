/**
 * Article Publisher Cron — quiet-storm
 * 
 * Phase 1 (published < 60): 5x/day every day
 * Phase 2 (published >= 60): 1x/weekday
 * 
 * Logic: If queue has articles, publish one. If empty, generate a new one.
 * Uses DeepSeek V4-Pro via OpenAI SDK. Bunny CDN image library. No FAL. No Anthropic.
 */

import { query } from "../src/lib/db.mjs";
import { runQualityGate } from "../src/lib/article-quality-gate.mjs";
import { assignHeroImage } from "../src/lib/bunny-image-library.mjs";
import OpenAI from "openai";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const GH_REPO = "peacefulgeek/quiet-storm";
const GH_PAT = process.env.GH_PAT;
const AUTO_GEN_ENABLED = process.env.AUTO_GEN_ENABLED === "true";

// DeepSeek V4-Pro via OpenAI SDK
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://api.deepseek.com",
});

const MODEL = process.env.OPENAI_MODEL || "deepseek-v4-pro";

// ─── CATEGORIES ───
const CATEGORIES = [
  { name: "Understanding Anxiety", slug: "understanding-anxiety" },
  { name: "Body & Nervous System", slug: "body-nervous-system" },
  { name: "Relationships & Social Anxiety", slug: "relationships-social-anxiety" },
  { name: "Work & Performance Anxiety", slug: "work-performance-anxiety" },
  { name: "Sleep & Nighttime Anxiety", slug: "sleep-nighttime-anxiety" },
  { name: "Healing Practices", slug: "healing-practices" },
  { name: "Mindfulness & Meditation", slug: "mindfulness-meditation" },
  { name: "Somatic Experiencing", slug: "somatic-experiencing" },
  { name: "Breathwork & Movement", slug: "breathwork-movement" },
  { name: "Consciousness & Awareness", slug: "consciousness-awareness" },
];

// ─── VERIFIED ASIN POOL (anxiety/wellness niche) ───
const ASIN_POOL = [
  "0143127748", "155643233X", "0393712370", "1623170249", "B004U3Y9FU",
  "B01LP0V1GI", "B07BGZQXNF", "B09BFHH1QM", "1572245379", "1577314808",
  "B0892MWQR3", "B00HD0ELFK", "B08YRXJM1V", "0062457713", "1401957234",
  "B09GFPFQBQ", "0062515675", "1683642643", "0399592520", "B07Q2WBK2Z",
  "1683644808", "0399563520", "1250313570", "B0BX7MFGP7", "0062906437",
  "B07NQBR3PZ", "0735211299", "1401961835", "B09NXLM8ZD", "B000GG0BNE",
];

/**
 * Publish one article from the queue OR generate a new one.
 */
async function generateArticle(opts = {}) {
  if (!AUTO_GEN_ENABLED) {
    console.log("[publisher] AUTO_GEN_ENABLED is false. Skipping.");
    return null;
  }

  // Check queue first
  const { rows: queued } = await query(`
    SELECT id, slug, title, excerpt, body, category, category_slug, hero_alt, faqs,
           opener_type, conclusion_type, backlink_type, named_references, word_count
    FROM articles
    WHERE status = 'queued'
    ORDER BY queued_at ASC
    LIMIT 1
  `);

  if (queued.length > 0) {
    // Publish from queue
    const article = queued[0];
    console.log(`[publisher] Publishing from queue: ${article.title}`);

    // Assign hero image from Bunny CDN library
    const heroImageUrl = await assignHeroImage(article.slug);
    const ogImageUrl = heroImageUrl; // Same image for OG

    await query(`
      UPDATE articles
      SET status = 'published',
          published_at = NOW(),
          hero_image = $1,
          og_image = $2
      WHERE id = $3
    `, [heroImageUrl, ogImageUrl, article.id]);

    console.log(`[publisher] Published: ${article.title} | Hero: ${heroImageUrl}`);
    await syncToStaticFile();
    return article;
  }

  // Queue is empty — generate a new article
  console.log("[publisher] Queue empty. Generating new article...");
  return await generateAndPublish(opts);
}

/**
 * Generate a brand new article and publish it immediately.
 */
async function generateAndPublish(opts = {}) {
  const category = opts.type === "product-spotlight"
    ? { name: "Product Spotlight", slug: "product-spotlight" }
    : CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

  const asinSample = ASIN_POOL.sort(() => Math.random() - 0.5).slice(0, 6).join(", ");

  let article = null;
  for (let attempt = 1; attempt <= 4; attempt++) {
    console.log(`[publisher] Generation attempt ${attempt}/4...`);

    try {
      const response = await client.chat.completions.create({
        model: MODEL,
        temperature: 0.72,
        messages: [{
          role: "user",
          content: `Write a 1400-2200 word article for The Quiet Storm, an anxiety wellness editorial. Category: ${category.name}.

Voice: Kalesh - consciousness teacher and writer. Direct, unflinching, compassionate. Uses somatic and Vedantic frameworks. No toxic positivity. No listicle energy. 30% spiritual/healing threads woven throughout. Conversational and truly connective - like talking to a wise friend who's been through it.

HARD RULES:
- 1,600 to 2,200 words (strict; under 1,200 or over 2,500 = fail)
- Zero em-dashes. Use commas, periods, colons, or parentheses.
- Never use these words: utilize, delve, tapestry, landscape, paradigm, synergy, leverage, unlock, empower, pivotal, embark, underscore, paramount, seamlessly, robust, beacon, foster, elevate, curate, curated, bespoke, resonate, harness, intricate, plethora, myriad, groundbreaking, innovative, cutting-edge, state-of-the-art, game-changer, ever-evolving, rapidly-evolving, stakeholders, navigate, ecosystem, framework, comprehensive, transformative, holistic, nuanced, multifaceted, profound, furthermore
- Never use these phrases: "it's important to note that", "it's worth noting that", "in conclusion", "in summary", "a holistic approach", "in the realm of", "dive deep into", "at the end of the day", "in today's fast-paced world", "plays a crucial role"
- Contractions everywhere. You're. Don't. It's. That's. I've. Can't.
- Vary sentence length aggressively. Some fragments. Some long. Some three-word sentences.
- Direct address ("you") throughout.
- Include 2-3 conversational dialogue markers: "Right?!", "Know what I mean?", "Does that land?", "How does that make you feel?", "Here's the thing," "Honestly," "Look," "Truth is,"
- Concrete specifics over abstractions. A name. A number. A moment.
- No em-dashes. No em-dashes. No em-dashes.
- No corporate speak. No self-help cliches.

AMAZON AFFILIATE LINKS (MANDATORY - exactly 3 or 4):
- Include exactly 3 or 4 Amazon product links naturally embedded in the body text.
- Format: <a href="https://www.amazon.com/dp/ASIN?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored">Product Name (paid link)</a>
- Spread evenly through the article at 25%, 45%, 65%, 85%.
- Use ONLY these verified ASINs: ${asinSample}
- Each recommendation should be conversational: "Something that pairs well with this is [LINK]."

Requirements:
- Varied opener (scene-setting, provocation, first-person, question, gut-punch)
- 4-6 H2 sections with id attributes for anchor links
- 1 blockquote (philosophical or from a named researcher)
- 2-4 FAQ questions with answers
- 3-5 internal links to other articles (use realistic slugs like /article/understanding-your-vagus-nerve)
- Named niche-appropriate researchers (Porges, van der Kolk, Levine, Huberman, etc.)
- Varied conclusion (challenge or tender)
- Body HTML: use <h2 id="slug">, <p>, <blockquote>, <a href>. No markdown.

Output ONLY valid JSON:
{
  "title": "Article Title",
  "slug": "article-slug-here",
  "excerpt": "Two sentence excerpt.",
  "body": "<h2 id=\\"section-one\\">...</h2><p>...</p>...",
  "faqs": [{"question": "Q?", "answer": "A."}],
  "heroAlt": "Descriptive alt text for hero image",
  "openerType": "scene-setting",
  "conclusionType": "challenge",
  "namedReferences": ["Stephen Porges", "Bessel van der Kolk"]
}`,
        }],
      });

      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error(`[publisher] Attempt ${attempt}: Could not parse JSON`);
        continue;
      }

      article = JSON.parse(jsonMatch[0]);

      // Auto-replace em-dashes before gate
      article.body = article.body.replace(/\u2014/g, " - ").replace(/\u2013/g, " - ");
      if (article.excerpt) article.excerpt = article.excerpt.replace(/\u2014/g, " - ").replace(/\u2013/g, " - ");

      // Run quality gate
      const gate = runQualityGate(article.body);
      if (gate.passed) {
        console.log(`[publisher] Quality gate PASSED on attempt ${attempt}`);
        break;
      } else {
        console.warn(`[publisher] Attempt ${attempt} FAILED gate:`, gate.failures.join(" | "));
        article = null;
      }
    } catch (err) {
      console.error(`[publisher] Attempt ${attempt} error:`, err.message);
      article = null;
    }
  }

  if (!article) {
    console.error("[publisher] All 4 attempts failed. Skipping this cycle.");
    return null;
  }

  // Assign hero image from Bunny CDN library
  const heroImageUrl = await assignHeroImage(article.slug);

  // Count words
  const wordCount = article.body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

  // Insert as published
  await query(`
    INSERT INTO articles (slug, title, excerpt, body, category, category_slug, hero_image, og_image,
      hero_alt, faqs, opener_type, conclusion_type, backlink_type, named_references, word_count,
      status, queued_at, published_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'published',NOW(),NOW())
    ON CONFLICT (slug) DO UPDATE SET body=$4, status='published', published_at=NOW(), hero_image=$7, og_image=$8
  `, [
    article.slug, article.title, article.excerpt, article.body,
    category.name, category.slug, heroImageUrl, heroImageUrl,
    article.heroAlt, JSON.stringify(article.faqs || []),
    article.openerType || "scene-setting", article.conclusionType || "challenge",
    "internal", JSON.stringify(article.namedReferences || []), wordCount,
  ]);

  console.log(`[publisher] Published new article: ${article.title}`);
  await syncToStaticFile();
  return article;
}

/**
 * Sync published articles from DB to static articles.ts file, then push to GitHub.
 */
async function syncToStaticFile() {
  try {
    const { rows } = await query(`
      SELECT slug, title, excerpt, body, category, category_slug, hero_image, og_image,
        hero_alt, faqs, opener_type, conclusion_type, backlink_type, named_references, word_count,
        published_at, created_at
      FROM articles
      WHERE status = 'published'
      ORDER BY published_at DESC
    `);

    const articlesPath = path.join(ROOT, "client/src/data/articles.ts");

    const articles = rows.map(r => ({
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      body: r.body,
      category: r.category,
      categorySlug: r.category_slug,
      dateISO: (r.published_at || r.created_at).toISOString(),
      dateHuman: new Date(r.published_at || r.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      readingTime: Math.ceil((r.word_count || 1500) / 250),
      heroImage: r.hero_image,
      heroAlt: r.hero_alt || "",
      ogImage: r.og_image || r.hero_image,
      openerType: r.opener_type || "scene-setting",
      faqCount: Array.isArray(r.faqs) ? r.faqs.length : 0,
      faqs: r.faqs || [],
      backlinkType: r.backlink_type || "internal",
      conclusionType: r.conclusion_type || "tender",
      namedReferences: r.named_references || [],
      voicePhrases: [],
      internalLinks: [],
    }));

    const content = `import { Article } from "../lib/types";\n\nexport const articles: Article[] = ${JSON.stringify(articles, null, 2)};\n`;
    fs.writeFileSync(articlesPath, content, "utf-8");

    execSync("git add -A", { cwd: ROOT, stdio: "pipe" });
    execSync(`git commit -m "auto-publish: sync articles from DB" --allow-empty`, { cwd: ROOT, stdio: "pipe" });
    execSync(`git push https://${GH_PAT}@github.com/${GH_REPO}.git main`, { cwd: ROOT, stdio: "pipe", timeout: 120000 });
    console.log("[publisher] Synced to static file and pushed to GitHub");
  } catch (err) {
    console.error("[publisher] Sync/push error:", err.message);
  }
}

export { generateArticle, AUTO_GEN_ENABLED };
