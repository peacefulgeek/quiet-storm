import { verifyAsin } from '../lib/amazon-verify.mjs';
import { query } from '../lib/db.mjs';

export async function refreshProductCatalog() {
  const { rows } = await query('SELECT asin FROM verified_asins ORDER BY last_checked ASC LIMIT 50');
  if (rows.length === 0) {
    console.log('[refresh-products] No ASINs to refresh');
    return;
  }

  console.log(`[refresh-products] Refreshing ${rows.length} product titles...`);
  let updated = 0;
  for (const { asin } of rows) {
    const r = await verifyAsin(asin);
    if (r.valid) {
      await query('UPDATE verified_asins SET title=$1, last_checked=NOW() WHERE asin=$2', [r.title, asin]);
      updated++;
    }
    await new Promise(res => setTimeout(res, 2500));
  }

  console.log(`[refresh-products] Done: ${updated}/${rows.length} refreshed`);
}
