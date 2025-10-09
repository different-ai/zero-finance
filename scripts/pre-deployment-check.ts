import { config } from 'dotenv';
import { resolve } from 'path';
import { Pool } from 'pg';

const envPath = process.env.ENV_FILE || resolve(__dirname, '../packages/web/.env.prod.local');
config({ path: envPath });

const pool = new Pool({ connectionString: process.env.POSTGRES_URL, max: 10 });

async function preDeploymentCheck() {
  console.log('='.repeat(80));
  console.log('PRE-DEPLOYMENT SAFETY CHECK');
  console.log('='.repeat(80));
  console.log();

  let allChecksPassed = true;

  try {
    // Check 1: Orphaned memberships
    console.log('✓ Check 1: Orphaned Workspace Memberships');
    const orphanedMemberships = await pool.query(`
      SELECT COUNT(*) as count
      FROM workspace_members wm
      LEFT JOIN workspaces w ON wm.workspace_id = w.id
      WHERE w.id IS NULL
    `);
    
    if (orphanedMemberships.rows[0].count === '0') {
      console.log('  ✅ PASS: No orphaned memberships found');
    } else {
      console.log(`  ⚠️  WARNING: ${orphanedMemberships.rows[0].count} orphaned memberships found`);
      console.log('  → Run: npx tsx scripts/cleanup-orphaned-memberships.ts --live');
      allChecksPassed = false;
    }
    console.log();

    // Check 2: FK Constraint
    console.log('✓ Check 2: Foreign Key Constraint Configuration');
    const constraint = await pool.query(`
      SELECT rc.delete_rule, rc.update_rule
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.referential_constraints AS rc
        ON rc.constraint_name = tc.constraint_name
      WHERE tc.table_name = 'users'
        AND tc.constraint_name = 'users_primary_workspace_id_workspaces_id_fk'
    `);
    
    if (constraint.rows[0]) {
      console.log(`  Current: ON DELETE ${constraint.rows[0].delete_rule}, ON UPDATE ${constraint.rows[0].update_rule}`);
      if (constraint.rows[0].delete_rule === 'SET NULL') {
        console.log('  ⚠️  WARNING: Constraint uses SET NULL but column is NOT NULL');
        console.log('  → This is the issue - migration will fix this');
      } else {
        console.log('  ✅ PASS: Constraint properly configured');
      }
    }
    console.log();

    // Check 3: Column Nullability
    console.log('✓ Check 3: Column Nullability');
    const column = await pool.query(`
      SELECT is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users' 
        AND column_name = 'primary_workspace_id'
    `);
    
    if (column.rows[0].is_nullable === 'NO') {
      console.log('  ✅ PASS: Column is NOT NULL (as designed)');
    } else {
      console.log('  ⚠️  UNEXPECTED: Column allows NULL');
    }
    console.log();

    // Check 4: Data Integrity
    console.log('✓ Check 4: Data Integrity Checks');
    
    const invalidPrimaryWorkspaces = await pool.query(`
      SELECT COUNT(*) as count
      FROM users u
      LEFT JOIN workspaces w ON u.primary_workspace_id = w.id
      WHERE u.primary_workspace_id IS NOT NULL AND w.id IS NULL
    `);
    
    if (invalidPrimaryWorkspaces.rows[0].count === '0') {
      console.log('  ✅ PASS: All users have valid primary_workspace_id references');
    } else {
      console.log(`  ❌ FAIL: ${invalidPrimaryWorkspaces.rows[0].count} users with invalid workspace references`);
      console.log('  → This should not happen! Investigate immediately.');
      allChecksPassed = false;
    }
    console.log();

    // Check 5: Statistics
    console.log('✓ Check 5: Database Statistics');
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM workspaces) as total_workspaces,
        (SELECT COUNT(*) FROM workspace_members) as total_memberships
    `);
    
    console.log(`  Users: ${stats.rows[0].total_users}`);
    console.log(`  Workspaces: ${stats.rows[0].total_workspaces}`);
    console.log(`  Memberships: ${stats.rows[0].total_memberships}`);
    console.log();

    // Final Summary
    console.log('='.repeat(80));
    console.log('SUMMARY');
    console.log('='.repeat(80));
    
    if (allChecksPassed) {
      console.log('✅ ALL CHECKS PASSED - Safe to deploy code fix');
      console.log();
      console.log('Next Steps:');
      console.log('1. Deploy code fix to production');
      console.log('2. Monitor logs for 24-48 hours');
      console.log('3. Schedule database migration');
    } else {
      console.log('⚠️  SOME CHECKS FAILED - Review warnings above');
      console.log();
      console.log('Recommended Actions:');
      console.log('1. Run cleanup scripts as indicated');
      console.log('2. Investigate any data integrity issues');
      console.log('3. Re-run this check before deployment');
    }
    
    console.log();
    console.log('='.repeat(80));

  } catch (error) {
    console.error('Error during pre-deployment check:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

preDeploymentCheck().catch(console.error);
