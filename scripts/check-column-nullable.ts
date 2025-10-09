import { config } from 'dotenv';
import { resolve } from 'path';
import { Pool } from 'pg';

const envPath = resolve(__dirname, '../packages/web/.env.prod.local');
config({ path: envPath });

const pool = new Pool({ connectionString: process.env.POSTGRES_URL, max: 10 });

async function checkColumn() {
  const result = await pool.query(`
    SELECT 
      table_name,
      column_name,
      is_nullable,
      data_type,
      column_default
    FROM information_schema.columns
    WHERE table_name = 'users' 
      AND column_name = 'primary_workspace_id'
  `);

  console.log('Column: users.primary_workspace_id');
  console.log('='.repeat(50));
  if (result.rows[0]) {
    console.log(`Nullable: ${result.rows[0].is_nullable}`);
    console.log(`Data Type: ${result.rows[0].data_type}`);
    console.log(`Default: ${result.rows[0].column_default || 'NULL'}`);
  }

  await pool.end();
}

checkColumn().catch(console.error);
