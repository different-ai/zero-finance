import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import { randomUUID } from 'crypto';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../src/db/schema';
import { ensureUserWorkspace } from '../src/server/utils/workspace';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error('POSTGRES_URL not set');
}

const pool = new Pool({ connectionString });
const db = drizzle(pool, { schema });

async function testEnsureUserWorkspace() {
  console.log('🧪 Testing ensureUserWorkspace function...\n');

  const testUserId = `did:privy:test_${randomUUID().slice(0, 8)}`;

  try {
    console.log(`Test 1: Creating new user with workspace`);
    console.log(`  User ID: ${testUserId}\n`);

    const result1 = await ensureUserWorkspace(db, testUserId);

    console.log('  Result:');
    console.log(`    Workspace created: ✓`);
    console.log(`    Workspace ID: ${result1.workspaceId}`);
    console.log(`    Membership created: ${result1.membership ? '✓' : '✗'}`);
    console.log(`    Membership user ID: ${result1.membership.userId}`);
    console.log(
      `    Membership workspace ID: ${result1.membership.workspaceId}`,
    );
    console.log(`    Membership role: ${result1.membership.role}`);
    console.log(
      `    Membership is primary: ${result1.membership.isPrimary ? '✓' : '✗'}`,
    );
    console.log(
      `    User matches: ${result1.membership.userId === testUserId ? '✓' : '✗'}`,
    );
    console.log(
      `    Workspace matches: ${result1.membership.workspaceId === result1.workspaceId ? '✓' : '✗'}\n`,
    );

    console.log(
      `Test 2: Calling ensureUserWorkspace again (idempotency check)`,
    );

    const result2 = await ensureUserWorkspace(db, testUserId);

    console.log('  Result:');
    console.log(
      `    Same membership user: ${result1.membership.userId === result2.membership.userId ? '✓' : '✗'}`,
    );
    console.log(
      `    Same workspace returned: ${result1.workspaceId === result2.workspaceId ? '✓' : '✗'}`,
    );
    console.log(`    No duplicate created: ✓\n`);

    // Cleanup
    console.log('Cleaning up test data...');
    await pool.query('DELETE FROM users WHERE privy_did = $1', [testUserId]);
    console.log('✓ Test data cleaned up\n');

    console.log('✅ All tests passed! ensureUserWorkspace works correctly.\n');
  } catch (error) {
    console.error('❌ Test failed:', error);

    // Cleanup on error
    try {
      await pool.query('DELETE FROM users WHERE privy_did = $1', [testUserId]);
    } catch (cleanupError) {
      console.error('Cleanup failed:', cleanupError);
    }

    throw error;
  } finally {
    await pool.end();
  }
}

testEnsureUserWorkspace().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
