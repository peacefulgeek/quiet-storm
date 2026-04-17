/**
 * retrofit-articles.mjs — Ensure all articles have 3+ verified Amazon links
 * Usage: node scripts/retrofit-articles.mjs
 */

import { query, close } from '../src/lib/db.mjs';
import { countAmazonLinks, extractAsinsFromText, verifyAsin, buildAmazonUrl } from '../src/lib/amazon-verify.mjs';
import { matchProducts } from '../src/lib/match-products.mjs';

const { rows: articles } = await query('SELECT id, slug, title, body, category, tags FROM articles');
const { rows: catalog } = await query("SELECT asin, title AS name, category, tags FROM verified_asins WHERE status='valid'");

let fixed = 0;
for (const a of articles) {
  const count = countAmazonLinks(a.body);
  const inBody = extractAsinsFromText(a.body);
  const checks = await Promise.all(inBody.map(verifyAsin));
  const dead = checks.filter(c => !c.valid).map(c => c.asin);

  if (count >= 3 && count <= 4 && dead.length === 0) continue;

  let body = a.body;
  for (const d of dead) {
    body = body.replace(new RegExp(`<a[^>]*href="[^"]*\\/dp\\/${d}[^"]*"[^>]*>.*?</a>\\s*(?:\\(paid link\\))?`, 'gi'), '');
  }

  const needed = Math.max(0, 3 - countAmazonLinks(body));
  if (needed > 0) {
    const picks = matchProducts({ articleTitle: a.title, articleTags: a.tags || [], articleCategory: a.category, catalog, minLinks: 3, maxLinks: 4 });
    const existing = new Set(extractAsinsFromText(body));
    const add = picks.filter(p => !existing.has(p.asin)).slice(0, needed);
    body += '\n' + add.map(p => `<p>A helpful option here is <a href="${buildAmazonUrl(p.asin)}" target="_blank" rel="nofollow sponsored noopener">${p.name}</a> (paid link).</p>`).join('\n');
  }

  await query('UPDATE articles SET body = $1, asins_used = $2 WHERE id = $3', [body, extractAsinsFromText(body), a.id]);
  fixed++;
  await new Promise(r => setTimeout(r, 200));
}

console.log(`[retrofit] Done: ${fixed} articles fixed out of ${articles.length}`);
await close();
