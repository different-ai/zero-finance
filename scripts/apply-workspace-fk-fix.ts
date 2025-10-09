import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../packages/web/.env.local') });

async function applyMigration() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: process.env.POSTGRES_URL?.includes('sslmode=require')
      ? { rejectUnauthorized: false }
      : undefined,
  });

  try {
    const migrationPath = path.join(
      __dirname,
      '../packages/web/drizzle/0112_fix_workspace_fk_constraint.sql',
    );
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    console.log('📋 Migration SQL:');
    console.log(migrationSQL);
    console.log('\n🔄 Applying migration...\n');

    await pool.query(migrationSQL);

    console.log('✅ Migration applied successfully!\n');
    console.log('🔍 Verifying constraint...');

    const result = await pool.query(`
      SELECT 
        tc.constraint_name,
        rc.delete_rule as on_delete,
        rc.update_rule as on_update
      FROM information_schema.table_constraints tc
      JOIN information_schema.referential_constraints rc 
        ON tc.constraint_name = rc.constraint_name
      WHERE tc.table_name = 'users'
        AND tc.constraint_name = 'users_primary_workspace_id_workspaces_id_fk';
    `);

    if (result.rows.length > 0) {
      const constraint = result.rows[0];
      console.log('\n✅ Constraint verified:');
      console.log(`   Constraint: ${constraint.constraint_name}`);
      console.log(`   ON DELETE: ${constraint.on_delete}`);
      console.log(`   ON UPDATE: ${constraint.on_update}\n`);

      if (constraint.on_delete === 'NO ACTION') {
        console.log('🎉 SUCCESS! FK constraint now uses ON DELETE NO ACTION');
      } else {
        console.log(
          `⚠️  WARNING: Expected ON DELETE NO ACTION, got ${constraint.on_delete}`,
        );
      }
    } else {
      console.log('⚠️  WARNING: Could not find constraint after migration');
    }
  } catch (error) {
    console.error('❌ Error applying migration:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

applyMigration().catch((error) => {
  console.error(error);
  process.exit(1);
});
