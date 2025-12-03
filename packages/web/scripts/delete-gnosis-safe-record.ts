/**
 * Script to delete a wrong Gnosis Safe record from the database
 * This allows re-deployment with the correct salt nonce
 *
 * Usage: cd packages/web && npx tsx scripts/delete-gnosis-safe-record.ts <userDid>
 */

import { db } from '@/db';
import { userSafes } from '@/db/schema/user-safes';
import { eq } from 'drizzle-orm';

const GNOSIS_CHAIN_ID = 100;

async function main() {
  const userDid = process.argv[2];

  if (!userDid) {
    console.error(
      'Usage: npx tsx scripts/delete-gnosis-safe-record.ts <userDid>',
    );
    console.error(
      'Example: npx tsx scripts/delete-gnosis-safe-record.ts did:privy:abc123',
    );
    process.exit(1);
  }

  console.log(`Looking for Gnosis Safe records for user: ${userDid}`);

  // Find existing Gnosis Safe records
  const safes = await db.query.userSafes.findMany({
    where: (tbl, { eq, and }) =>
      and(eq(tbl.userDid, userDid), eq(tbl.chainId, GNOSIS_CHAIN_ID)),
  });

  if (safes.length === 0) {
    console.log('No Gnosis Safe records found for this user.');
    process.exit(0);
  }

  console.log(`Found ${safes.length} Gnosis Safe record(s):`);
  for (const safe of safes) {
    console.log(`  - ID: ${safe.id}`);
    console.log(`    Address: ${safe.safeAddress}`);
    console.log(`    Type: ${safe.safeType}`);
    console.log(`    Created: ${safe.createdAt}`);
  }

  // Delete the records
  console.log('\nDeleting records...');
  for (const safe of safes) {
    await db.delete(userSafes).where(eq(userSafes.id, safe.id));
    console.log(`  Deleted: ${safe.safeAddress}`);
  }

  console.log(
    '\nDone! You can now re-deploy the Gnosis Safe with the correct address.',
  );
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
