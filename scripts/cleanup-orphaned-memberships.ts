import { config } from 'dotenv';
import { resolve } from 'path';
import { Pool } from 'pg';

const envPath = process.env.ENV_FILE || resolve(__dirname, '../packages/web/.env.prod.local');
config({ path: envPath });

const POSTGRES_URL = process.env.POSTGRES_URL;

if (!POSTGRES_URL) {
  console.error('POSTGRES_URL not found in environment');
  process.exit(1);
}

const pool = new Pool({
  connectionString: POSTGRES_URL,
  max: 10,
});

async function cleanupOrphanedMemberships(dryRun: boolean = true) {
  console.log('='.repeat(80));
  console.log('CLEANUP ORPHANED WORKSPACE MEMBERSHIPS');
  console.log(`Mode: ${dryRun ? 'DRY RUN (no changes)' : 'LIVE (will delete)'}`);
  console.log('='.repeat(80));
  console.log();

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const orphanedQuery = await client.query(`
      SELECT wm.id, wm.user_id, wm.workspace_id, wm.role, wm.is_primary, wm.joined_at
      FROM workspace_members wm
      LEFT JOIN workspaces w ON wm.workspace_id = w.id
      WHERE w.id IS NULL
      ORDER BY wm.joined_at DESC
    `);

    const orphanedMemberships = orphanedQuery.rows;

    console.log(`Found ${orphanedMemberships.length} orphaned workspace memberships:\n`);

    if (orphanedMemberships.length > 0) {
      orphanedMemberships.forEach((membership, idx) => {
        console.log(`${idx + 1}. Membership ID: ${membership.id}`);
        console.log(`   User ID: ${membership.user_id}`);
        console.log(`   Non-existent Workspace ID: ${membership.workspace_id}`);
        console.log(`   Role: ${membership.role}`);
        console.log(`   Is Primary: ${membership.is_primary}`);
        console.log(`   Joined At: ${new Date(membership.joined_at).toISOString()}`);
        console.log();
      });

      if (!dryRun) {
        console.log('Deleting orphaned memberships...');
        const deleteResult = await client.query(`
          DELETE FROM workspace_members wm
          WHERE NOT EXISTS (
            SELECT 1 FROM workspaces w WHERE w.id = wm.workspace_id
          )
          RETURNING id
        `);

        console.log(`✅ Deleted ${deleteResult.rowCount} orphaned memberships`);
        await client.query('COMMIT');
        console.log('✅ Transaction committed');
      } else {
        console.log('⚠️  DRY RUN: No changes made');
        console.log('   Run with --live flag to actually delete orphaned memberships');
        await client.query('ROLLBACK');
      }
    } else {
      console.log('✅ No orphaned workspace memberships found!');
      await client.query('ROLLBACK');
    }

    console.log();
    console.log('='.repeat(80));

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error during cleanup:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

const isDryRun = !process.argv.includes('--live');
cleanupOrphanedMemberships(isDryRun).catch(console.error);
