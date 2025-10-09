import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error('POSTGRES_URL not set');
}

const pool = new Pool({ connectionString });

async function verifyConstraints() {
  console.log('🔍 Checking foreign key constraints...\n');

  const result = await pool.query(`
    SELECT 
      tc.table_name, 
      tc.constraint_name, 
      tc.constraint_type,
      kcu.column_name,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name,
      rc.update_rule,
      rc.delete_rule,
      con.condeferrable AS is_deferrable,
      con.condeferred AS is_initially_deferred
    FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    LEFT JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    LEFT JOIN information_schema.referential_constraints AS rc
      ON tc.constraint_name = rc.constraint_name
    LEFT JOIN pg_constraint AS con
      ON con.conname = tc.constraint_name
    WHERE tc.table_schema = 'public'
      AND tc.constraint_type = 'FOREIGN KEY'
      AND (
        tc.constraint_name = 'users_primary_workspace_id_workspaces_id_fk'
        OR tc.constraint_name = 'workspaces_created_by_users_privy_did_fk'
      )
    ORDER BY tc.table_name, tc.constraint_name;
  `);

  const constraints = result.rows;

  console.log('Foreign Key Constraints:\n');
  for (const constraint of constraints) {
    console.log(`Table: ${constraint.table_name}`);
    console.log(`  Constraint: ${constraint.constraint_name}`);
    console.log(
      `  Column: ${constraint.column_name} -> ${constraint.foreign_table_name}.${constraint.foreign_column_name}`,
    );
    console.log(`  Deferrable: ${constraint.is_deferrable ? 'YES' : 'NO'}`);
    console.log(
      `  Initially Deferred: ${constraint.is_initially_deferred ? 'YES' : 'NO'}`,
    );
    console.log(`  On Delete: ${constraint.delete_rule}`);
    console.log(`  On Update: ${constraint.update_rule}`);
    console.log('');
  }

  if (constraints.length === 0) {
    console.log(
      '❌ No matching constraints found! Migration may not have been applied.\n',
    );
  } else if (constraints.length === 2) {
    const allDeferrable = constraints.every((c) => c.is_deferrable);
    const allInitiallyDeferred = constraints.every(
      (c) => c.is_initially_deferred,
    );

    if (allDeferrable && allInitiallyDeferred) {
      console.log(
        '✅ All constraints are DEFERRABLE INITIALLY DEFERRED - Circular dependency resolved!\n',
      );
    } else {
      console.log('⚠️  Constraints exist but are not properly configured:');
      console.log(
        `   Deferrable: ${allDeferrable ? 'YES' : 'NO (SHOULD BE YES)'}`,
      );
      console.log(
        `   Initially Deferred: ${allInitiallyDeferred ? 'YES' : 'NO (SHOULD BE YES)'}\n`,
      );
    }
  } else {
    console.log(`⚠️  Expected 2 constraints but found ${constraints.length}\n`);
  }

  await pool.end();
}

verifyConstraints().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
