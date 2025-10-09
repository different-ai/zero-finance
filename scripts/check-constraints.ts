import { config } from 'dotenv';
import { resolve } from 'path';
import { Pool } from 'pg';

const envPath = resolve(__dirname, '../packages/web/.env.prod.local');
config({ path: envPath });

const POSTGRES_URL = process.env.POSTGRES_URL;

if (!POSTGRES_URL) {
  console.error('POSTGRES_URL not found');
  process.exit(1);
}

const pool = new Pool({ connectionString: POSTGRES_URL, max: 10 });

async function checkConstraints() {
  console.log('='.repeat(80));
  console.log('DATABASE FOREIGN KEY CONSTRAINTS');
  console.log('='.repeat(80));
  console.log();

  try {
    // Check all FK constraints related to workspaces
    const constraints = await pool.query(`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        tc.constraint_name,
        rc.delete_rule,
        rc.update_rule
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      JOIN information_schema.referential_constraints AS rc
        ON rc.constraint_name = tc.constraint_name
        AND rc.constraint_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND (tc.table_name IN ('users', 'workspace_members', 'workspaces')
             OR ccu.table_name IN ('users', 'workspace_members', 'workspaces'))
      ORDER BY tc.table_name, kcu.column_name;
    `);

    console.log('Workspace-related Foreign Key Constraints:\n');

    constraints.rows.forEach((row, idx) => {
      console.log(`${idx + 1}. ${row.table_name}.${row.column_name}`);
      console.log(`   → ${row.foreign_table_name}.${row.foreign_column_name}`);
      console.log(`   Constraint: ${row.constraint_name}`);
      console.log(`   ON DELETE: ${row.delete_rule}`);
      console.log(`   ON UPDATE: ${row.update_rule}`);
      console.log();
    });

    // Specific check for the problematic constraint
    const usersPrimaryWorkspace = constraints.rows.find(
      r => r.table_name === 'users' && r.column_name === 'primary_workspace_id'
    );

    console.log('='.repeat(80));
    console.log('CRITICAL CONSTRAINT: users.primary_workspace_id');
    console.log('='.repeat(80));
    
    if (usersPrimaryWorkspace) {
      console.log(`Constraint Name: ${usersPrimaryWorkspace.constraint_name}`);
      console.log(`References: ${usersPrimaryWorkspace.foreign_table_name}.${usersPrimaryWorkspace.foreign_column_name}`);
      console.log(`ON DELETE: ${usersPrimaryWorkspace.delete_rule}`);
      console.log(`ON UPDATE: ${usersPrimaryWorkspace.update_rule}`);
      console.log();
      
      if (usersPrimaryWorkspace.delete_rule === 'NO ACTION' || usersPrimaryWorkspace.delete_rule === 'RESTRICT') {
        console.log('⚠️  WARNING: This constraint does NOT have CASCADE delete!');
        console.log('   When a workspace is deleted, user records will prevent deletion');
        console.log('   or become orphaned (depending on the order of operations).');
      } else if (usersPrimaryWorkspace.delete_rule === 'SET NULL') {
        console.log('ℹ️  This constraint uses SET NULL on delete.');
        console.log('   When a workspace is deleted, users.primary_workspace_id → NULL');
      } else if (usersPrimaryWorkspace.delete_rule === 'CASCADE') {
        console.log('⚠️  This constraint uses CASCADE delete!');
        console.log('   When a workspace is deleted, all users with that primary workspace will be DELETED!');
      }
    } else {
      console.log('❌ Constraint not found! This is unexpected.');
    }

  } catch (error) {
    console.error('Error checking constraints:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

checkConstraints().catch(console.error);
