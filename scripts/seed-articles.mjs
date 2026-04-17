/**
 * seed-articles.mjs — Migrate all articles from client/src/data/articles.ts to PostgreSQL
 *
 * Usage: node scripts/seed-articles.mjs
 *
 * This reads the compiled articles from the client data file, parses them,
 * and inserts them into the articles table. Safe to run multiple times
 * (uses ON CONFLICT DO UPDATE on slug).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, close } from '../src/lib/db.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function countWords(text) {
  const stripped = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return stripped ? stripped.split(/\s+/).length : 0;
}

function extractAsins(text) {
  const re = /https:\/\/www\.amazon\.com\/dp\/([A-Z0-9]{10})/g;
  const asins = new Set();
  let m;
  while ((m = re.exec(text)) !== null) asins.add(m[1]);
  return [...asins];
}

async function seed() {
  // Read the raw articles.ts file and extract article objects
  const articlesPath = path.resolve(__dirname, '..', 'client', 'src', 'data', 'articles.ts');
  const raw = fs.readFileSync(articlesPath, 'utf8');

  // Extract articles using regex — each article is an object in the array
  // We'll use a different approach: compile the TS to extract the data
  // Since articles.ts exports `articles`, we parse the array manually

  // Find the articles array
  const arrayStart = raw.indexOf('export const articles');
  if (arrayStart === -1) throw new Error('Could not find "export const articles" in articles.ts');

  // Extract just the data portion — find the opening bracket
  const bracketStart = raw.indexOf('[', arrayStart);
  if (bracketStart === -1) throw new Error('Could not find opening bracket');

  // We need to find the matching closing bracket
  let depth = 0;
  let bracketEnd = -1;
  for (let i = bracketStart; i < raw.length; i++) {
    if (raw[i] === '[') depth++;
    if (raw[i] === ']') {
      depth--;
      if (depth === 0) { bracketEnd = i; break; }
    }
  }
  if (bracketEnd === -1) throw new Error('Could not find closing bracket');

  const arrayStr = raw.slice(bracketStart, bracketEnd + 1);

  // Parse individual article objects
  // Each article starts with { and has specific fields
  const articles = [];
  let pos = 1; // skip opening [

  while (pos < arrayStr.length - 1) {
    // Find next {
    const objStart = arrayStr.indexOf('{', pos);
    if (objStart === -1) break;

    // Find matching }
    let d = 0;
    let objEnd = -1;
    for (let i = objStart; i < arrayStr.length; i++) {
      if (arrayStr[i] === '{') d++;
      if (arrayStr[i] === '}') {
        d--;
        if (d === 0) { objEnd = i; break; }
      }
    }
    if (objEnd === -1) break;

    const objStr = arrayStr.slice(objStart, objEnd + 1);

    // Parse fields using regex
    const getString = (key) => {
      // Handle both single-line and multi-line string values
      const re = new RegExp(`${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`);
      const m = objStr.match(re);
      if (m) return m[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\\\/g, '\\');

      // Try backtick strings
      const reBt = new RegExp(`${key}:\\s*\`([^\`]*)\``);
      const mBt = objStr.match(reBt);
      if (mBt) return mBt[1];

      return '';
    };

    const getNumber = (key) => {
      const re = new RegExp(`${key}:\\s*(\\d+)`);
      const m = objStr.match(re);
      return m ? parseInt(m[1]) : 0;
    };

    const getBool = (key) => {
      const re = new RegExp(`${key}:\\s*(true|false)`);
      const m = objStr.match(re);
      return m ? m[1] === 'true' : false;
    };

    const getArray = (key) => {
      const re = new RegExp(`${key}:\\s*\\[([^\\]]*?)\\]`);
      const m = objStr.match(re);
      if (!m) return [];
      return m[1].split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    };

    // Extract FAQs (JSONB)
    let faqs = [];
    const faqMatch = objStr.match(/faqs:\s*\[([\s\S]*?)\]\s*(?:,|\})/);
    if (faqMatch) {
      const faqStr = faqMatch[1];
      const faqItems = [];
      const faqRe = /\{\s*q:\s*"((?:[^"\\]|\\.)*)"\s*,\s*a:\s*"((?:[^"\\]|\\.)*)"\s*\}/g;
      let fm;
      while ((fm = faqRe.exec(faqStr)) !== null) {
        faqItems.push({
          q: fm[1].replace(/\\"/g, '"').replace(/\\n/g, '\n'),
          a: fm[2].replace(/\\"/g, '"').replace(/\\n/g, '\n')
        });
      }
      faqs = faqItems;
    }

    const slug = getString('slug');
    const body = getString('body');

    if (slug && body) {
      articles.push({
        slug,
        title: getString('title'),
        excerpt: getString('excerpt'),
        body,
        category: getString('category'),
        categorySlug: getString('categorySlug'),
        tags: getArray('tags'),
        dateISO: getString('dateISO'),
        dateHuman: getString('dateHuman'),
        readingTime: getString('readingTime'),
        heroImage: getString('heroImage'),
        heroAlt: getString('heroAlt'),
        ogImage: getString('ogImage'),
        openerType: getString('openerType'),
        faqCount: getNumber('faqCount'),
        faqs,
        backlinkType: getString('backlinkType'),
        conclusionType: getString('conclusionType'),
        namedReferences: getArray('namedReferences'),
        voicePhrases: getArray('voicePhrases'),
        internalLinks: getArray('internalLinks'),
        hasAffiliateLinks: getBool('hasAffiliateLinks'),
        wordCount: countWords(body),
        asins: extractAsins(body)
      });
    }

    pos = objEnd + 1;
  }

  console.log(`[seed] Parsed ${articles.length} articles from articles.ts`);

  // Insert into DB
  let inserted = 0;
  for (const a of articles) {
    try {
      await query(`
        INSERT INTO articles (slug, title, excerpt, body, category, category_slug, tags, date_iso, date_human,
          reading_time, hero_image_url, hero_alt, og_image, opener_type, faq_count, faqs, backlink_type,
          conclusion_type, named_references, voice_phrases, internal_links, has_affiliate_links, asins_used, word_count)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)
        ON CONFLICT (slug) DO UPDATE SET
          title=EXCLUDED.title, excerpt=EXCLUDED.excerpt, body=EXCLUDED.body, category=EXCLUDED.category,
          category_slug=EXCLUDED.category_slug, tags=EXCLUDED.tags, hero_image_url=EXCLUDED.hero_image_url,
          hero_alt=EXCLUDED.hero_alt, og_image=EXCLUDED.og_image, faqs=EXCLUDED.faqs,
          has_affiliate_links=EXCLUDED.has_affiliate_links, asins_used=EXCLUDED.asins_used, word_count=EXCLUDED.word_count
      `, [
        a.slug, a.title, a.excerpt, a.body, a.category, a.categorySlug,
        a.tags, a.dateISO, a.dateHuman, a.readingTime, a.heroImage, a.heroAlt,
        a.ogImage, a.openerType, a.faqCount, JSON.stringify(a.faqs), a.backlinkType,
        a.conclusionType, a.namedReferences, a.voicePhrases, a.internalLinks,
        a.hasAffiliateLinks, a.asins, a.wordCount
      ]);
      inserted++;
    } catch (err) {
      console.error(`[seed] Failed to insert ${a.slug}:`, err.message);
    }
  }

  console.log(`[seed] Inserted/updated ${inserted}/${articles.length} articles`);
  await close();
}

seed().catch(err => {
  console.error('[seed] Fatal:', err.message);
  process.exit(1);
});
