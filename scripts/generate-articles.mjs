/**
 * Auto-Gen Pipeline — Generate new articles via Anthropic Claude
 * ALL secrets from process.env (Render env vars). NEVER hardcode API keys.
 * Bunny CDN credentials stay in code per spec.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

// ─── FEATURE FLAG (stays in code — not a secret) ───
const AUTO_GEN_ENABLED = false; // Wildman flips to true on GitHub when ready

// ─── FROM RENDER ENV VARS (auto-revoked if found in code) ───
// ANTHROPIC_API_KEY, FAL_KEY, GH_PAT — all from process.env

// ─── HARDCODED (Bunny is safe in code) ───
const BUNNY_STORAGE_ZONE = "quiet-storm";
const BUNNY_STORAGE_HOST = "ny.storage.bunnycdn.com";
const BUNNY_STORAGE_PASSWORD = "4f79f1de-6894-4de4-962e830a70ee-cf58-40a0";
const BUNNY_CDN_HOST = "quiet-storm.b-cdn.net";

const GH_REPO = "peacefulgeek/quiet-storm";
const ARTICLES_FILE = "client/src/data/articles.ts";

const CATEGORIES = [
  { slug: "the-nervous-system", name: "The Nervous System" },
  { slug: "the-body", name: "The Body" },
  { slug: "the-mind", name: "The Mind" },
  { slug: "the-specific", name: "The Specific" },
  { slug: "the-deeper-question", name: "The Deeper Question" },
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

async function generateArticle() {
  if (!AUTO_GEN_ENABLED) {
    console.log("[auto-gen] AUTO_GEN_ENABLED is false. Skipping.");
    return null;
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  const FAL_KEY = process.env.FAL_KEY;
  const GH_PAT = process.env.GH_PAT;

  if (!ANTHROPIC_API_KEY) {
    console.error("[auto-gen] Missing ANTHROPIC_API_KEY");
    return null;
  }
  if (!FAL_KEY) {
    console.error("[auto-gen] Missing FAL_KEY");
    return null;
  }
  if (!GH_PAT) {
    console.error("[auto-gen] Missing GH_PAT");
    return null;
  }

  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

  try {
    // ─── Step 1: Generate article content via Claude ───
    console.log(`[auto-gen] Generating article for category: ${category.name}`);

    const articleResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8192,
        messages: [
          {
            role: "user",
            content: `Write a 2,500-2,800 word article for The Quiet Storm, an anxiety wellness editorial. Category: ${category.name}.

Voice: Kalesh — consciousness teacher and writer. Direct, unflinching, compassionate. Uses somatic and Vedantic frameworks. No toxic positivity. No listicle energy. 30% spiritual/healing threads woven throughout.

Requirements:
- Varied opener (scene-setting, provocation, first-person, question, named-reference, or gut-punch)
- 4-6 H2 sections with id attributes for anchor links
- 1 blockquote (philosophical or from a named researcher)
- 2-4 FAQ questions with answers
- 3-5 internal links to other articles (use realistic slugs like /article/understanding-your-vagus-nerve)
- Named niche-appropriate researchers (Porges, van der Kolk, Levine, Huberman, etc.)
- Varied conclusion (challenge or tender)
- 23% chance: include 1 link to https://kalesh.love with topically descriptive anchor text
- Body HTML: use <h2 id="slug">, <p>, <blockquote>, <a href>. No markdown.

Output ONLY valid JSON with these exact keys:
{
  "title": "Article Title",
  "slug": "article-slug-here",
  "excerpt": "Two sentence excerpt.",
  "body": "<h2 id=\\"section-one\\">...</h2><p>...</p>...",
  "faqs": [{"question": "Q?", "answer": "A."}],
  "heroAlt": "Descriptive alt text for hero image",
  "openerType": "scene-setting",
  "conclusionType": "challenge",
  "backlinkType": "internal",
  "namedReferences": ["Stephen Porges", "Bessel van der Kolk"]
}`,
          },
        ],
      }),
    });

    if (!articleResponse.ok) {
      const errText = await articleResponse.text();
      console.error(`[auto-gen] Claude API error ${articleResponse.status}: ${errText}`);
      return null;
    }

    const articleData = await articleResponse.json();
    const content = articleData.content[0].text;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[auto-gen] Could not parse JSON from Claude response");
      return null;
    }

    const article = JSON.parse(jsonMatch[0]);
    console.log(`[auto-gen] Article generated: ${article.title}`);

    // ─── Step 2: Generate hero image via FAL.ai ───
    console.log("[auto-gen] Generating hero image...");

    const imageResponse = await fetch("https://queue.fal.run/fal-ai/flux-pro/v1.1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${FAL_KEY}`,
      },
      body: JSON.stringify({
        prompt: `Luminous, warm, healing scene: ${article.heroAlt}. Soft natural light, no text, no people in distress, watercolor-inspired, ethereal atmosphere, high quality editorial illustration.`,
        image_size: { width: 1200, height: 675 },
        num_images: 1,
      }),
    });

    let heroImageUrl = `https://${BUNNY_CDN_HOST}/images/default-hero.webp`;
    let ogImageUrl = `https://${BUNNY_CDN_HOST}/og/default-og.png`;

    if (imageResponse.ok) {
      const imageData = await imageResponse.json();
      if (imageData.images && imageData.images[0]) {
        const imgResp = await fetch(imageData.images[0].url);
        const imgBuffer = Buffer.from(await imgResp.arrayBuffer());

        // Upload hero image
        const heroUpload = await fetch(
          `https://${BUNNY_STORAGE_HOST}/${BUNNY_STORAGE_ZONE}/images/${article.slug}.webp`,
          {
            method: "PUT",
            headers: {
              AccessKey: BUNNY_STORAGE_PASSWORD,
              "Content-Type": "image/webp",
            },
            body: imgBuffer,
          }
        );

        if (heroUpload.ok) {
          heroImageUrl = `https://${BUNNY_CDN_HOST}/images/${article.slug}.webp`;
          console.log(`[auto-gen] Hero uploaded: ${heroImageUrl}`);
        }

        // Upload OG image (same image as PNG)
        const ogUpload = await fetch(
          `https://${BUNNY_STORAGE_HOST}/${BUNNY_STORAGE_ZONE}/og/${article.slug}.png`,
          {
            method: "PUT",
            headers: {
              AccessKey: BUNNY_STORAGE_PASSWORD,
              "Content-Type": "image/png",
            },
            body: imgBuffer,
          }
        );

        if (ogUpload.ok) {
          ogImageUrl = `https://${BUNNY_CDN_HOST}/og/${article.slug}.png`;
          console.log(`[auto-gen] OG uploaded: ${ogImageUrl}`);
        }
      }
    } else {
      console.warn("[auto-gen] FAL.ai error, using default hero");
    }

    // ─── Step 3: Build article object ───
    const now = new Date();
    const wordCount = article.body.replace(/<[^>]+>/g, "").split(/\s+/).length;

    const articleObj = {
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      body: article.body,
      category: category.name,
      categorySlug: category.slug,
      dateISO: now.toISOString(),
      dateHuman: now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      readingTime: Math.ceil(wordCount / 250),
      heroImage: heroImageUrl,
      heroAlt: article.heroAlt,
      ogImage: ogImageUrl,
      openerType: article.openerType || "scene-setting",
      faqCount: (article.faqs || []).length,
      faqs: article.faqs || [],
      backlinkType: article.backlinkType || "internal",
      conclusionType: article.conclusionType || "tender",
      namedReferences: article.namedReferences || [],
      voicePhrases: [],
      internalLinks: [],
    };

    // ─── Step 4: Append to articles.ts and push to GitHub ───
    console.log("[auto-gen] Appending to articles.ts...");

    const articlesPath = path.join(ROOT, ARTICLES_FILE);
    let articlesContent = fs.readFileSync(articlesPath, "utf-8");

    // Find the closing bracket of the array
    const lastBracket = articlesContent.lastIndexOf("]");
    if (lastBracket === -1) {
      console.error("[auto-gen] Could not find array end in articles.ts");
      return null;
    }

    // Insert new article before the closing bracket
    const articleJson = JSON.stringify(articleObj, null, 2);
    const newContent =
      articlesContent.slice(0, lastBracket) +
      ",\n" +
      articleJson +
      "\n" +
      articlesContent.slice(lastBracket);

    fs.writeFileSync(articlesPath, newContent, "utf-8");
    console.log("[auto-gen] articles.ts updated");

    // ─── Step 5: Git commit and push ───
    console.log("[auto-gen] Committing and pushing to GitHub...");

    try {
      execSync("git add -A", { cwd: ROOT, stdio: "pipe" });
      execSync(
        `git commit -m "auto-gen: ${article.title}"`,
        { cwd: ROOT, stdio: "pipe" }
      );
      execSync(
        `git push https://${GH_PAT}@github.com/${GH_REPO}.git main`,
        { cwd: ROOT, stdio: "pipe", timeout: 60000 }
      );
      console.log("[auto-gen] Pushed to GitHub successfully");
    } catch (gitErr) {
      console.error("[auto-gen] Git push error:", gitErr.message);
      // Article is still saved locally even if push fails
    }

    console.log(`[auto-gen] Complete: ${articleObj.title}`);
    return articleObj;
  } catch (err) {
    console.error("[auto-gen] Error:", err.message);
    return null;
  }
}

export { generateArticle, AUTO_GEN_ENABLED };
