/**
 * audit-quality.mjs — Run quality gate on all articles in the database
 * Usage: node scripts/audit-quality.mjs > quality-audit.json
 */

import { query, close } from '../src/lib/db.mjs';
import { runQualityGate } from '../src/lib/article-quality-gate.mjs';

const { rows } = await query('SELECT id, slug, body FROM articles');
const report = { total: rows.length, failed: [], passed: 0 };

for (const a of rows) {
  const g = runQualityGate(a.body);
  if (g.passed) report.passed++;
  else report.failed.push({ slug: a.slug, failures: g.failures, wordCount: g.wordCount });
}

console.log(JSON.stringify(report, null, 2));
await close();
