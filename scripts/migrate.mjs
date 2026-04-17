/**
 * migrate.mjs — Run schema.sql against the database
 * Usage: node scripts/migrate.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, close } from '../src/lib/db.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  const schemaPath = path.resolve(__dirname, '..', 'src', 'db', 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  console.log('[migrate] Running schema.sql...');
  await query(sql);
  console.log('[migrate] Schema applied successfully');

  // Verify tables exist
  const { rows } = await query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);
  console.log('[migrate] Tables:', rows.map(r => r.table_name).join(', '));

  await close();
}

migrate().catch(err => {
  console.error('[migrate] Failed:', err.message);
  process.exit(1);
});
