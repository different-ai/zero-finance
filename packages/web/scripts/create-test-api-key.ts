import { db } from '../src/db';
import { workspaceApiKeys, workspaces, users } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

async function main() {
  console.log('Creating test API key...');

  // 1. Find or create a user
  let user = await db.query.users.findFirst();
  let workspaceId: string;

  if (!user) {
    console.log('No user found, creating one...');
    workspaceId = crypto.randomUUID();
    const [newUser] = await db
      .insert(users)
      .values({
        privyDid: 'did:privy:test-user',
        email: 'test@example.com',
        primaryWorkspaceId: workspaceId,
      })
      .returning();
    user = newUser;

    // Create the workspace now
    await db.insert(workspaces).values({
      id: workspaceId,
      name: 'Test Workspace',
      createdBy: user.privyDid,
      workspaceType: 'business',
    });
  } else {
    console.log('User found:', user.privyDid);
    workspaceId = user.primaryWorkspaceId;

    // Ensure workspace exists
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    });

    if (!workspace) {
      await db.insert(workspaces).values({
        id: workspaceId,
        name: 'Test Workspace',
        createdBy: user.privyDid,
        workspaceType: 'business',
      });
    }
  }

  console.log('Workspace:', workspaceId);

  // 3. Create API Key
  const KEY_PREFIX_TEST = 'zf_test_';
  const randomPart = crypto.randomBytes(32).toString('hex');
  const rawKey = `${KEY_PREFIX_TEST}${randomPart}`;
  const keyPrefix = rawKey.slice(0, 12);
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

  await db.insert(workspaceApiKeys).values({
    workspaceId: workspaceId,
    name: 'MCP Test Key',
    keyPrefix: keyPrefix,
    keyHash: keyHash,
    createdBy: user.privyDid,
  });

  console.log('\n✅ API Key Created:');
  console.log(rawKey);
  console.log('\nUse this in your Authorization header: Bearer ' + rawKey);
  process.exit(0);
}

main().catch(console.error);
