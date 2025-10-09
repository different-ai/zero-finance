import { config } from 'dotenv';
import { resolve } from 'path';
import { Pool } from 'pg';
import { readFileSync } from 'fs';

const envPath = resolve(__dirname, '../packages/web/.env.prod.local');
config({ path: envPath });

const POSTGRES_URL = process.env.POSTGRES_URL;

if (!POSTGRES_URL) {
  console.error('POSTGRES_URL not found');
  process.exit(1);
}

const pool = new Pool({
  connectionString: POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
});

async function applyMigration() {
  try {
    const migrationSQL = readFileSync(
      resolve(
        __dirname,
        '../packages/web/drizzle/0112_fix_workspace_fk_constraint.sql',
      ),
      'utf-8',
    );

    console.log('🎯 Applying to PRODUCTION database...\n');
    console.log(migrationSQL);
    console.log('\n🔄 Executing...\n');

    await pool.query(migrationSQL);

    console.log('✅ Migration applied successfully!\n');

    const result = await pool.query(`
      SELECT 
        tc.constraint_name,
        rc.delete_rule,
        rc.update_rule
      FROM information_schema.table_constraints tc
      JOIN information_schema.referential_constraints rc 
        ON tc.constraint_name = rc.constraint_name
      WHERE tc.table_name = 'users'
        AND tc.constraint_name = 'users_primary_workspace_id_workspaces_id_fk'
    `);

    if (result.rows.length > 0) {
      console.log('🔍 Verified constraint:', result.rows[0]);
      console.log('\n🎉 PRODUCTION database updated successfully!');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

applyMigration().catch(console.error);
