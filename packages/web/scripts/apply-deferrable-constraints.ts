import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error('POSTGRES_URL not set');
}

const pool = new Pool({ connectionString });

async function applyConstraints() {
  console.log('🔧 Applying deferrable constraints...\n');

  const sql = fs.readFileSync(
    path.resolve(
      __dirname,
      '../drizzle/0111_make_workspace_fks_deferrable.sql',
    ),
    'utf-8',
  );

  try {
    await pool.query(sql);
    console.log('✅ Constraints applied successfully!\n');
  } catch (error) {
    console.error('❌ Failed to apply constraints:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

applyConstraints().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
