import { randomUUID } from 'node:crypto';

import { db } from '@/db';
import { earnWithdrawals, users } from '@/db/schema';

/**
 * Reproduces the Postgres "value is out of range for type bigint" error that
 * occurs when recording large withdrawal amounts.
 */
async function main() {
  // Grab any existing user so we satisfy the foreign key constraint.
  const user = await db.query.users.findFirst();

  if (!user) {
    console.error(
      'No users found in the database. Cannot reproduce withdrawal recording failure.',
    );
    process.exit(1);
  }

  const oversizedAssets = BigInt('9657842272157093400'); // > 2^63 - 1

  try {
    await db.insert(earnWithdrawals).values({
      id: randomUUID(),
      userDid: user.privyDid,
      workspaceId: user.primaryWorkspaceId,
      safeAddress: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      vaultAddress: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      tokenAddress: '0xcccccccccccccccccccccccccccccccccccccccc',
      assetsWithdrawn: oversizedAssets.toString(),
      sharesBurned: '1',
      txHash: `0x${randomUUID().replace(/-/g, '')}`,
      status: 'pending',
    });

    console.log('Insert unexpectedly succeeded.');
    process.exit(0);
  } catch (error) {
    console.error('Expected failure when inserting oversized asset amount:');
    console.error(error);
    process.exit(0);
  }
}

main().catch((error) => {
  console.error('Script failed unexpectedly:', error);
  process.exit(1);
});
