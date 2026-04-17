import { verifyAsinBatch } from '../lib/amazon-verify.mjs';
import { query } from '../lib/db.mjs';

export async function verifyAffiliateLinks() {
  const { rows } = await query('SELECT asin FROM verified_asins');
  if (rows.length === 0) {
    console.log('[verify-affiliates] No ASINs in verified_asins table');
    return;
  }

  console.log(`[verify-affiliates] Checking ${rows.length} ASINs...`);
  const results = await verifyAsinBatch(rows.map(r => r.asin));
  const now = new Date();

  let valid = 0, invalid = 0;
  for (const r of results) {
    if (r.valid) {
      await query('UPDATE verified_asins SET last_checked=$1, title=$2 WHERE asin=$3', [now, r.title, r.asin]);
      valid++;
    } else {
      await query('DELETE FROM verified_asins WHERE asin=$1', [r.asin]);
      await query(`INSERT INTO failed_asins (asin, reason, last_attempted_at) VALUES ($1,$2,$3)
        ON CONFLICT (asin) DO UPDATE SET reason=EXCLUDED.reason, last_attempted_at=EXCLUDED.last_attempted_at, attempts=failed_asins.attempts+1`,
        [r.asin, r.reason, now]);
      invalid++;
    }
  }

  console.log(`[verify-affiliates] Done: ${valid} valid, ${invalid} removed`);
}
