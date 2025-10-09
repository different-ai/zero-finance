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

async function diagnose() {
  console.log('='.repeat(80));
  console.log('DATABASE FOREIGN KEY CONSTRAINT DIAGNOSIS');
  console.log(`Connected to: ${POSTGRES_URL.split('@')[1]?.split('?')[0] || 'database'}`);
  console.log('='.repeat(80));
  console.log();

  try {
    // 1. Find users with invalid primary_workspace_id references
    console.log('1. USERS WITH INVALID primary_workspace_id REFERENCES');
    console.log('-'.repeat(80));
    
    const orphanedUsersQuery = await pool.query(`
      SELECT u.privy_did, u.primary_workspace_id, u.created_at,
             u.first_name, u.last_name, u.company_name
      FROM users u
      LEFT JOIN workspaces w ON u.primary_workspace_id = w.id
      WHERE u.primary_workspace_id IS NOT NULL 
        AND w.id IS NULL
      ORDER BY u.created_at DESC
      LIMIT 50
    `);

    const orphanedUsers = orphanedUsersQuery.rows;

    console.log(`Found ${orphanedUsers.length} users with invalid workspace references:\n`);
    
    orphanedUsers.forEach((user, idx) => {
      console.log(`${idx + 1}. Privy DID: ${user.privy_did}`);
      console.log(`   Name: ${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A');
      console.log(`   Company: ${user.company_name || 'N/A'}`);
      console.log(`   Invalid Workspace ID: ${user.primary_workspace_id}`);
      console.log(`   Created: ${new Date(user.created_at).toISOString()}`);
      console.log();
    });

    // 2. Check if these users have any workspace memberships
    console.log('2. WORKSPACE MEMBERSHIPS FOR AFFECTED USERS');
    console.log('-'.repeat(80));
    
    if (orphanedUsers.length > 0) {
      const userDids = orphanedUsers.map(u => u.privy_did);
      
      const membershipsQuery = await pool.query(`
        SELECT wm.user_id, wm.workspace_id, wm.role, w.name as workspace_name, wm.is_primary
        FROM workspace_members wm
        JOIN workspaces w ON wm.workspace_id = w.id
        WHERE wm.user_id = ANY($1)
        ORDER BY wm.user_id, wm.is_primary DESC, wm.joined_at ASC
      `, [userDids]);

      const memberships = membershipsQuery.rows;

      console.log(`Found ${memberships.length} valid workspace memberships:\n`);
      
      memberships.forEach((membership, idx) => {
        const user = orphanedUsers.find(u => u.privy_did === membership.user_id);
        console.log(`${idx + 1}. User: ${membership.user_id}`);
        console.log(`   Workspace ID: ${membership.workspace_id}`);
        console.log(`   Workspace Name: ${membership.workspace_name}`);
        console.log(`   Role: ${membership.role}`);
        console.log(`   Is Primary: ${membership.is_primary}`);
        console.log();
      });

      // 3. Users without ANY workspace memberships
      const usersWithMemberships = new Set(memberships.map(m => m.user_id));
      const usersWithoutMemberships = orphanedUsers.filter(u => !usersWithMemberships.has(u.privy_did));
      
      console.log('3. USERS WITHOUT ANY WORKSPACE MEMBERSHIPS');
      console.log('-'.repeat(80));
      console.log(`Found ${usersWithoutMemberships.length} users without any workspace:\n`);
      
      if (usersWithoutMemberships.length > 0) {
        usersWithoutMemberships.forEach((user, idx) => {
          console.log(`${idx + 1}. Privy DID: ${user.privy_did}`);
          console.log(`   Name: ${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A');
          console.log(`   Company: ${user.company_name || 'N/A'}`);
          console.log(`   Invalid Workspace ID: ${user.primary_workspace_id}`);
          console.log();
        });
      } else {
        console.log('✅ All affected users have at least one workspace membership\n');
      }

      // 4. Group memberships by user for fix planning
      console.log('4. FIX PLAN PER USER');
      console.log('-'.repeat(80));
      
      const userMembershipMap = new Map<string, any[]>();
      memberships.forEach(m => {
        if (!userMembershipMap.has(m.user_id)) {
          userMembershipMap.set(m.user_id, []);
        }
        userMembershipMap.get(m.user_id)!.push(m);
      });

      orphanedUsers.forEach((user, idx) => {
        const userMemberships = userMembershipMap.get(user.privy_did) || [];
        console.log(`${idx + 1}. User: ${user.privy_did}`);
        
        if (userMemberships.length === 0) {
          console.log(`   ⚠️  No memberships found - will CREATE new workspace`);
        } else {
          const primaryMembership = userMemberships.find(m => m.is_primary);
          const firstMembership = userMemberships[0];
          const targetWorkspace = primaryMembership || firstMembership;
          
          console.log(`   ✓ ${userMemberships.length} membership(s) found`);
          console.log(`   → Will set primary_workspace_id to: ${targetWorkspace.workspace_id}`);
          console.log(`      (${targetWorkspace.workspace_name}, role: ${targetWorkspace.role})`);
        }
        console.log();
      });
    }

    // 5. Summary statistics
    console.log('5. DATABASE SUMMARY STATISTICS');
    console.log('-'.repeat(80));
    
    const statsQuery = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM workspaces) as total_workspaces,
        (SELECT COUNT(*) FROM workspace_members) as total_memberships,
        (SELECT COUNT(*) FROM users WHERE primary_workspace_id IS NULL) as users_without_primary,
        (SELECT COUNT(*) 
         FROM users u
         LEFT JOIN workspaces w ON u.primary_workspace_id = w.id
         WHERE u.primary_workspace_id IS NOT NULL AND w.id IS NULL
        ) as users_with_invalid_primary
    `);

    const stats = statsQuery.rows[0];

    console.log(`Total Users: ${stats.total_users}`);
    console.log(`Total Workspaces: ${stats.total_workspaces}`);
    console.log(`Total Memberships: ${stats.total_memberships}`);
    console.log(`Users without primary_workspace_id: ${stats.users_without_primary}`);
    console.log(`Users with INVALID primary_workspace_id: ${stats.users_with_invalid_primary}`);
    console.log();

    // 6. Recommended fix strategy
    console.log('6. RECOMMENDED FIX STRATEGY');
    console.log('-'.repeat(80));
    console.log();
    
    if (orphanedUsers.length === 0) {
      console.log('✅ No foreign key constraint violations found!');
    } else {
      console.log('The fix will execute in a TRANSACTION with these steps:');
      console.log();
      console.log('For users WITH valid workspace memberships:');
      console.log('  1. Identify their primary workspace (is_primary = true) OR first workspace');
      console.log('  2. UPDATE users SET primary_workspace_id = <valid_workspace_id>');
      console.log();
      console.log('For users WITHOUT any workspace memberships:');
      console.log('  1. CREATE a new personal workspace');
      console.log('  2. INSERT workspace membership with role = "owner", is_primary = true');
      console.log('  3. UPDATE users SET primary_workspace_id = <new_workspace_id>');
      console.log();
      console.log('This will ensure all foreign key constraints are satisfied.');
      console.log();
      console.log('⚠️  SAFETY: The script will use a transaction and can be rolled back if needed.');
    }
    
    console.log();
    console.log('='.repeat(80));
    console.log('DIAGNOSIS COMPLETE');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('Error during diagnosis:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

diagnose().catch(console.error);
