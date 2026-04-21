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

HARD RULES for this article:
- 1,600 to 2,000 words (strict; under 1,200 or over 2,500 = regenerate)
- Zero em-dashes. Use commas, periods, colons, or parentheses.
- Never use these words: delve, tapestry, paradigm, synergy, leverage, unlock, empower, utilize, pivotal, embark, underscore, paramount, seamlessly, robust, beacon, foster, elevate, curate, curated, bespoke, resonate, harness, intricate, plethora, myriad, comprehensive, transformative, groundbreaking, innovative, cutting-edge, revolutionary, state-of-the-art, ever-evolving, profound, holistic, nuanced, multifaceted, stakeholders, ecosystem, furthermore, moreover, additionally, consequently, subsequently, thereby, streamline, optimize, facilitate, amplify, catalyze.
- Never use these phrases: "it's important to note," "in conclusion," "in summary," "in the realm of," "dive deep into," "at the end of the day," "in today's fast-paced world," "plays a crucial role," "a testament to," "when it comes to," "cannot be overstated."
- Contractions throughout. You're. Don't. It's. That's. I've.
- Vary sentence length aggressively. Some fragments. Some long. Some three-word sentences.
- Direct address ("you") throughout OR first-person ("I / my") throughout. Pick one.
- Include at least 2 conversational openers: "Here's the thing," "Honestly," "Look," "Truth is," "But here's what's interesting," "That said."
- Concrete specifics over abstractions. A name. A number. A moment.
- 3 to 4 Amazon product links embedded naturally in prose, each followed by "(paid link)" in plain text. Use only ASINs from the provided catalog.
- No em-dashes. No em-dashes. No em-dashes.
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
