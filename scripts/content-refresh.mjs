/**
 * Content Refresh Cron — quiet-storm
 * 
 * Monthly (1st of month 03:00 UTC): Refresh 10 oldest articles
 * Quarterly (1st of Jan/Apr/Jul/Oct 04:00 UTC): Deep refresh 20 oldest articles
 * 
 * Uses DeepSeek V4-Pro via OpenAI SDK. No Anthropic.
 */

import { query } from "../src/lib/db.mjs";
import { runQualityGate } from "../src/lib/article-quality-gate.mjs";
import OpenAI from "openai";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const GH_REPO = "peacefulgeek/quiet-storm";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://api.deepseek.com",
});
const MODEL = process.env.OPENAI_MODEL || "deepseek-v4-pro";

const BANNED_WORDS = "utilize, delve, tapestry, landscape, paradigm, synergy, leverage, unlock, empower, pivotal, embark, underscore, paramount, seamlessly, robust, beacon, foster, elevate, curate, curated, bespoke, resonate, harness, intricate, plethora, myriad, groundbreaking, innovative, cutting-edge, state-of-the-art, game-changer, ever-evolving, rapidly-evolving, stakeholders, navigate, ecosystem, framework, comprehensive, transformative, holistic, nuanced, multifaceted, profound, furthermore";

const HARD_RULES = `HARD RULES:
- 1,600 to 2,200 words (strict; under 1,200 or over 2,500 = fail)
- Zero em-dashes. Use commas, periods, colons, or parentheses.
- Never use these words: ${BANNED_WORDS}
- Never use these phrases: "it's important to note that", "it's worth noting that", "in conclusion", "in summary", "a holistic approach", "in the realm of", "dive deep into", "at the end of the day", "in today's fast-paced world", "plays a crucial role"
- Contractions everywhere. You're. Don't. It's. That's. I've. Can't.
- Vary sentence length aggressively. Some fragments. Some long.
- Direct address ("you") throughout.
- 2-3 conversational markers: "Right?!", "Know what I mean?", "Does that land?", "Here's the thing," "Honestly," "Look,"
- Keep all existing Amazon affiliate links exactly as they are. Must have 3-4 total.
- No em-dashes. No em-dashes. No em-dashes.`;

/**
 * Monthly refresh: expand 1 paragraph + humanization edits
 */
async function refreshArticle(article, type = "monthly") {
  const instruction = type === "monthly"
    ? "Refresh this article for freshness. Pick ONE paragraph in the middle third and expand it by 2-3 sentences. Add a personal observation or practical tip. Fix any stale language."
    : "Do a deep refresh of this article. Rewrite sections that feel stale, update references, improve flow. Keep the same structure and all Amazon links.";

  const response = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.72,
    messages: [{
      role: "user",
      content: `${instruction}

Voice: Kalesh - consciousness teacher and writer. Direct, unflinching, compassionate. Conversational and warm.

${HARD_RULES}

Article title: ${article.title}
Article body:
${article.body}

Return ONLY the revised body HTML. No explanation. No wrapper. Just the HTML.`,
    }],
  });

  let revised = response.choices[0].message.content;

  // Auto-replace em-dashes
  revised = revised.replace(/\u2014/g, " - ").replace(/\u2013/g, " - ");

  // Strip any markdown code fences
  revised = revised.replace(/^```html?\n?/i, "").replace(/\n?```$/i, "").trim();

  return revised;
}

/**
 * Run monthly content refresh (10 articles)
 */
async function runContentRefresh(refreshType = "30day") {
  const GH_PAT = process.env.GH_PAT;
  if (!process.env.OPENAI_API_KEY || !GH_PAT) {
    console.error("[content-refresh] Missing OPENAI_API_KEY or GH_PAT");
    return;
  }

  const column = refreshType === "30day" ? "last_refreshed_30d" : "last_refreshed_90d";
  const limit = refreshType === "30day" ? 10 : 20;
  const type = refreshType === "30day" ? "monthly" : "quarterly";

  const { rows } = await query(`
    SELECT id, slug, title, body FROM articles
    WHERE status = 'published'
      AND (${column} IS NULL OR ${column} < NOW() - INTERVAL '${refreshType === "30day" ? "30" : "90"} days')
    ORDER BY COALESCE(${column}, created_at) ASC
    LIMIT ${limit}
  `);

  console.log(`[content-refresh] ${type}: Refreshing ${rows.length} articles`);

  let updated = 0;
  for (const article of rows) {
    try {
      let revised = null;
      let passed = false;

      for (let attempt = 1; attempt <= 3; attempt++) {
        revised = await refreshArticle(article, type);
        const gate = runQualityGate(revised);
        if (gate.passed) {
          passed = true;
          break;
        }
        console.warn(`[content-refresh] ${article.slug} attempt ${attempt}:`, gate.failures.join(" | "));
      }

      if (passed && revised) {
        await query(`UPDATE articles SET body = $1, ${column} = NOW() WHERE id = $2`, [revised, article.id]);
        updated++;
        console.log(`[content-refresh] Updated: ${article.title}`);
      } else {
        console.error(`[content-refresh] ${article.slug} FAILED gate 3x - keeping original`);
        await query(`UPDATE articles SET ${column} = NOW() WHERE id = $1`, [article.id]);
      }

      // Rate limit
      await new Promise(r => setTimeout(r, 2000));
    } catch (err) {
      console.error(`[content-refresh] Error refreshing ${article.slug}:`, err.message);
    }
  }

  if (updated > 0) {
    console.log(`[content-refresh] ${updated} articles updated. Syncing to static file...`);
    // Sync DB to static file
    try {
      const { rows: allPublished } = await query(`
        SELECT slug, title, excerpt, body, category, category_slug, hero_image, og_image,
          hero_alt, faqs, opener_type, conclusion_type, backlink_type, named_references, word_count,
          published_at, created_at
        FROM articles WHERE status = 'published' ORDER BY published_at DESC
      `);

      const articlesPath = path.join(ROOT, "client/src/data/articles.ts");
      const articles = allPublished.map(r => ({
        slug: r.slug, title: r.title, excerpt: r.excerpt, body: r.body,
        category: r.category, categorySlug: r.category_slug,
        dateISO: (r.published_at || r.created_at).toISOString(),
        dateHuman: new Date(r.published_at || r.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        readingTime: Math.ceil((r.word_count || 1500) / 250),
        heroImage: r.hero_image, heroAlt: r.hero_alt || "", ogImage: r.og_image || r.hero_image,
        openerType: r.opener_type || "scene-setting", faqCount: Array.isArray(r.faqs) ? r.faqs.length : 0,
        faqs: r.faqs || [], backlinkType: r.backlink_type || "internal",
        conclusionType: r.conclusion_type || "tender", namedReferences: r.named_references || [],
        voicePhrases: [], internalLinks: [],
      }));

      const content = `import { Article } from "../lib/types";\n\nexport const articles: Article[] = ${JSON.stringify(articles, null, 2)};\n`;
      fs.writeFileSync(articlesPath, content, "utf-8");

      execSync("git add -A", { cwd: ROOT, stdio: "pipe" });
      execSync(`git commit -m "content-refresh: ${type} - ${updated} articles" --allow-empty`, { cwd: ROOT, stdio: "pipe" });
      execSync(`git push https://${GH_PAT}@github.com/${GH_REPO}.git main`, { cwd: ROOT, stdio: "pipe", timeout: 120000 });
      console.log("[content-refresh] Pushed to GitHub");
    } catch (pushErr) {
      console.error("[content-refresh] Git push error:", pushErr.message);
    }
  }
}

export { runContentRefresh };
