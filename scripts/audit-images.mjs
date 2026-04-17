/**
 * audit-images.mjs — Find broken image URLs in articles
 * Usage: node scripts/audit-images.mjs > broken-images.json
 */

import { query, close } from '../src/lib/db.mjs';

const { rows } = await query('SELECT id, slug, body, hero_image_url FROM articles');
const broken = [];

for (const a of rows) {
  const urls = [a.hero_image_url, ...[...a.body.matchAll(/<img[^>]+src="([^"]+)"/gi)].map(m => m[1])].filter(Boolean);
  for (const url of urls) {
    if (url.startsWith('data:')) continue;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.status !== 200) broken.push({ id: a.id, slug: a.slug, url, status: res.status });
    } catch (e) { broken.push({ id: a.id, slug: a.slug, url, error: e.message }); }
    await new Promise(r => setTimeout(r, 100));
  }
}

console.log(JSON.stringify(broken, null, 2));
await close();
