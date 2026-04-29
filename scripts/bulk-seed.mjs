/**
 * Bulk Seed — quiet-storm
 * 
 * Generates 500 unique anxiety/wellness article topics and queues them in the DB.
 * Uses DeepSeek V4-Pro via OpenAI SDK for topic generation.
 * Each topic gets queued with status='queued'. The publisher cron picks them up.
 * 
 * Run: node scripts/bulk-seed.mjs
 */

import { query } from "../src/lib/db.mjs";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://api.deepseek.com",
});
const MODEL = process.env.OPENAI_MODEL || "deepseek-v4-pro";

const CATEGORIES = [
  "Understanding Anxiety",
  "Body & Nervous System",
  "Relationships & Social Anxiety",
  "Work & Performance Anxiety",
  "Sleep & Nighttime Anxiety",
  "Healing Practices",
  "Mindfulness & Meditation",
  "Somatic Experiencing",
  "Breathwork & Movement",
  "Consciousness & Awareness",
];

/**
 * Generate a batch of unique topics from DeepSeek
 */
async function generateTopicBatch(batchNum, existingSlugs) {
  const category = CATEGORIES[batchNum % CATEGORIES.length];
  
  const response = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.9,
    messages: [{
      role: "user",
      content: `Generate 25 unique article topics for an anxiety wellness editorial called "The Quiet Storm". Category: ${category}.

Requirements:
- Each topic must be specific and searchable (long-tail SEO)
- No generic titles like "Understanding Anxiety" — be specific
- Mix of how-to, explanatory, personal exploration, and practice-based
- Include somatic, Vedantic, breathwork, nervous system, and consciousness angles
- Each title should be compelling and click-worthy without being clickbait
- Topics should be things real people Google when struggling with anxiety

Avoid these existing slugs (don't duplicate): ${existingSlugs.slice(0, 50).join(", ")}

Return ONLY a JSON array of objects:
[{"title": "Article Title Here", "slug": "article-slug-here", "excerpt": "Two sentence excerpt.", "category": "${category}"}]

Return exactly 25 items.`,
    }],
  });

  const content = response.choices[0].message.content;
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("Could not parse JSON array from response");
  return JSON.parse(jsonMatch[0]);
}

/**
 * Main: Generate and queue 500 topics
 */
async function main() {
  console.log("[bulk-seed] Starting 500-topic generation...");

  // Get existing slugs to avoid duplicates
  const { rows: existing } = await query("SELECT slug FROM articles");
  const existingSlugs = existing.map(r => r.slug);
  console.log(`[bulk-seed] ${existingSlugs.length} existing articles in DB`);

  let totalQueued = 0;
  const targetCount = 500;
  const batchSize = 25;
  const batches = Math.ceil(targetCount / batchSize);

  for (let i = 0; i < batches && totalQueued < targetCount; i++) {
    try {
      console.log(`[bulk-seed] Batch ${i + 1}/${batches}...`);
      const topics = await generateTopicBatch(i, existingSlugs);

      for (const topic of topics) {
        if (totalQueued >= targetCount) break;
        if (!topic.slug || !topic.title) continue;
        if (existingSlugs.includes(topic.slug)) continue;

        const categorySlug = topic.category
          ? topic.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
          : CATEGORIES[i % CATEGORIES.length].toLowerCase().replace(/[^a-z0-9]+/g, "-");

        try {
          await query(`
            INSERT INTO articles (slug, title, excerpt, body, category, category_slug, status, queued_at)
            VALUES ($1, $2, $3, '', $4, $5, 'queued', NOW())
            ON CONFLICT (slug) DO NOTHING
          `, [topic.slug, topic.title, topic.excerpt || "", topic.category || CATEGORIES[i % CATEGORIES.length], categorySlug]);

          existingSlugs.push(topic.slug);
          totalQueued++;
        } catch (insertErr) {
          // Duplicate slug, skip
          console.log(`[bulk-seed] Skipped duplicate: ${topic.slug}`);
        }
      }

      console.log(`[bulk-seed] Queued so far: ${totalQueued}`);

      // Rate limit between batches
      await new Promise(r => setTimeout(r, 2000));
    } catch (batchErr) {
      console.error(`[bulk-seed] Batch ${i + 1} failed:`, batchErr.message);
      await new Promise(r => setTimeout(r, 5000));
    }
  }

  console.log(`[bulk-seed] Done. Total queued: ${totalQueued}`);
  process.exit(0);
}

main().catch(err => {
  console.error("[bulk-seed] Fatal:", err);
  process.exit(1);
});
