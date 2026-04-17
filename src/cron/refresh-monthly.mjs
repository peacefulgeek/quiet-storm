import { runQualityGate } from '../lib/article-quality-gate.mjs';
import { query } from '../lib/db.mjs';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function refreshFromAnthropic(article) {
  const msg = await anthropic.messages.create({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 4000,
    messages: [{
      role: 'user',
      content: `Refresh this article for freshness. Keep the same structure, voice (Kalesh - conversational, warm, first-person), and all Amazon links intact. Update any dated references. Keep between 1200-1800 words.

HARD RULES:
- Never use these words: delve, tapestry, paradigm, synergy, leverage, unlock, empower, utilize, pivotal, embark, underscore, paramount, seamlessly, robust, beacon, foster, elevate, curate, bespoke, resonate, harness, intricate, plethora, myriad, comprehensive, transformative, groundbreaking, innovative, cutting-edge, revolutionary, profound, holistic, nuanced, multifaceted, furthermore, moreover, additionally, consequently, subsequently
- Never use em-dashes
- Use contractions naturally (you're, don't, it's, can't, won't, I'm, I've)
- Include at least 2 conversational interjections (e.g., "Look,", "Here's the thing", "Honestly,", "Truth is,")
- Vary sentence length. Mix short punchy sentences with longer flowing ones.
- Keep all existing <a href="amazon.com..."> links exactly as they are

Article title: ${article.title}
Article body:
${article.body}`
    }]
  });
  return msg.content[0].text;
}

export async function refreshMonthly() {
  const { rows } = await query(`
    SELECT id, slug, title, body, category, tags FROM articles
    WHERE last_refreshed_30d IS NULL OR last_refreshed_30d < NOW() - INTERVAL '30 days'
    ORDER BY COALESCE(last_refreshed_30d, created_at) ASC
    LIMIT 10
  `);

  for (const a of rows) {
    const original = a.body;
    let refreshed = original;
    let passed = false;

    for (let attempt = 1; attempt <= 3; attempt++) {
      refreshed = await refreshFromAnthropic(a);
      const gate = runQualityGate(refreshed);
      if (gate.passed) {
        passed = true;
        break;
      }
      console.warn(`[refresh-monthly] ${a.slug} attempt ${attempt}:`, gate.failures.join(' | '));
    }

    if (passed) {
      await query('UPDATE articles SET body = $1, last_refreshed_30d = NOW() WHERE id = $2', [refreshed, a.id]);
      console.log(`[refresh-monthly] refreshed ${a.slug}`);
    } else {
      console.error(`[refresh-monthly] ${a.slug} FAILED gate 3x - keeping original`);
      await query('UPDATE articles SET last_refreshed_30d = NOW() WHERE id = $1', [a.id]);
    }

    await new Promise(r => setTimeout(r, 2000));
  }
}
