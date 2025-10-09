import { config } from 'dotenv';
import { resolve } from 'path';
import { Pool } from 'pg';

const envPath = resolve(__dirname, '../packages/web/.env.prod.local');
config({ path: envPath });

const POSTGRES_URL = process.env.POSTGRES_URL;

if (!POSTGRES_URL) {
  console.error('POSTGRES_URL not found in .env.prod.local');
  process.exit(1);
}

const pool = new Pool({
  connectionString: POSTGRES_URL,
  max: 10,
});

async function checkOrphanedMemberships() {
  console.log('='.repeat(80));
  console.log('CHECKING FOR ORPHANED WORKSPACE MEMBERSHIPS');
  console.log('='.repeat(80));
  console.log();

  try {
    // Find workspace memberships that reference non-existent workspaces
    const orphanedQuery = await pool.query(`
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

      // Check if any of these users exist
      const userIds = orphanedMemberships.map(m => m.user_id);
      const usersQuery = await pool.query(`
        SELECT privy_did, first_name, last_name, company_name, created_at
        FROM users
        WHERE privy_did = ANY($1)
      `, [userIds]);

      const existingUsers = usersQuery.rows;

      console.log('USERS AFFECTED BY ORPHANED MEMBERSHIPS:');
      console.log('-'.repeat(80));
      console.log(`${existingUsers.length} of ${userIds.length} users with orphaned memberships have accounts:\n`);

      existingUsers.forEach((user, idx) => {
        console.log(`${idx + 1}. User: ${user.privy_did}`);
        console.log(`   Name: ${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A');
        console.log(`   Company: ${user.company_name || 'N/A'}`);
        console.log(`   Created: ${new Date(user.created_at).toISOString()}`);
        console.log();
      });

      // Users without accounts (these are the ones that will fail on login)
      const existingUserIds = new Set(existingUsers.map(u => u.privy_did));
      const usersWithoutAccounts = userIds.filter(id => !existingUserIds.has(id));

      if (usersWithoutAccounts.length > 0) {
        console.log('USERS WITHOUT ACCOUNTS (WILL FAIL ON LOGIN):');
        console.log('-'.repeat(80));
        console.log(`${usersWithoutAccounts.length} user(s) have orphaned memberships but no user accounts:\n`);

        usersWithoutAccounts.forEach((userId, idx) => {
          const membership = orphanedMemberships.find(m => m.user_id === userId);
          console.log(`${idx + 1}. User ID: ${userId}`);
          console.log(`   Orphaned Workspace: ${membership?.workspace_id}`);
          console.log(`   ⚠️  This user will get 500 error on first login`);
          console.log();
        });
      }
    } else {
      console.log('✅ No orphaned workspace memberships found!');
    }

    console.log();
    console.log('='.repeat(80));

  } catch (error) {
    console.error('Error checking orphaned memberships:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

checkOrphanedMemberships().catch(console.error);
