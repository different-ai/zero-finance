/**
 * Cleanup Vault Redemptions from incomingDeposits
 *
 * This script removes vault redemption transactions from the incomingDeposits table.
 * These are transfers FROM known vault addresses, which are actually withdrawals
 * from yield vaults - not regular "Received" transactions.
 *
 * Usage:
 *   pnpm tsx scripts/cleanup-vault-redemptions.ts --dry-run  # Preview only (uses dev DB)
 *   pnpm tsx scripts/cleanup-vault-redemptions.ts            # Execute (uses dev DB)
 *   pnpm tsx scripts/cleanup-vault-redemptions.ts --prod --dry-run  # Preview on PROD
 *   pnpm tsx scripts/cleanup-vault-redemptions.ts --prod     # Execute on PROD
 */

import * as dotenv from 'dotenv';
import path from 'path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { inArray, sql } from 'drizzle-orm';

// Load environment BEFORE anything else
const isProd = process.argv.includes('--prod');
const isDryRun = process.argv.includes('--dry-run');

if (isProd) {
  console.log('🔴 PRODUCTION MODE - Loading .env.production.local\n');
  const result = dotenv.config({
    path: path.resolve(__dirname, '../.env.production.local'),
    override: true,
  });
  if (result.error) {
    console.error('Failed to load .env.production.local:', result.error);
    process.exit(1);
  }
} else {
  console.log('🟢 DEVELOPMENT MODE - Using default .env.local\n');
  dotenv.config({
    path: path.resolve(__dirname, '../.env.local'),
    override: true,
  });
}

// Verify we have the right database URL
const dbHost = process.env.POSTGRES_URL?.match(/@([^/]+)\//)?.[1] || 'unknown';
console.log(`[DB] Will connect to database host: ${dbHost}\n`);

async function main() {
  // Import schema dynamically to avoid db module's auto-initialization
  const { incomingDeposits } = await import('../src/db/schema');
  const { getAllVaultAddresses } = await import(
    '../src/server/earn/all-vault-addresses'
  );

  // Create our own DB connection with the correct env
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  const db = drizzle(pool, {
    schema: { incomingDeposits },
  });

  console.log('=== Cleanup Vault Redemptions from incomingDeposits ===\n');

  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
  }

  // Get all vault addresses
  const vaultAddresses = getAllVaultAddresses();
  console.log(`Found ${vaultAddresses.length} known vault addresses:\n`);
  vaultAddresses.forEach((addr) => console.log(`  - ${addr}`));
  console.log('');

  // Query for deposits from vault addresses (case-insensitive)
  // Need to use SQL for case-insensitive comparison since addresses in DB may have mixed case
  const vaultRedemptions = await db
    .select()
    .from(incomingDeposits)
    .where(
      sql`lower(${incomingDeposits.fromAddress}) IN (${sql.join(
        vaultAddresses.map((addr) => sql`${addr.toLowerCase()}`),
        sql`, `,
      )})`,
    );

  console.log(
    `Found ${vaultRedemptions.length} vault redemption(s) in incomingDeposits:\n`,
  );

  if (vaultRedemptions.length === 0) {
    console.log('✅ No vault redemptions found. Database is clean!');
    await pool.end();
    return;
  }

  // Show details
  let totalAmount = 0n;
  for (const tx of vaultRedemptions) {
    const amount = BigInt(tx.amount || '0');
    totalAmount += amount;
    const amountFormatted = (Number(amount) / 1e6).toFixed(2);
    console.log(`  TX: ${tx.txHash}`);
    console.log(`    From: ${tx.fromAddress}`);
    console.log(`    Amount: $${amountFormatted} USDC`);
    console.log(`    Date: ${tx.timestamp}`);
    console.log(`    Safe: ${tx.safeAddress}`);
    console.log('');
  }

  const totalFormatted = (Number(totalAmount) / 1e6).toFixed(2);
  console.log(`Total value of vault redemptions: $${totalFormatted} USDC\n`);

  if (isDryRun) {
    console.log(
      '🔍 DRY RUN - Would delete these records. Run without --dry-run to actually delete.',
    );
    await pool.end();
    return;
  }

  // Delete the records (case-insensitive)
  console.log('🗑️  Deleting vault redemption records...\n');

  const result = await db
    .delete(incomingDeposits)
    .where(
      sql`lower(${incomingDeposits.fromAddress}) IN (${sql.join(
        vaultAddresses.map((addr) => sql`${addr.toLowerCase()}`),
        sql`, `,
      )})`,
    )
    .returning({ id: incomingDeposits.id });

  console.log(
    `✅ Deleted ${result.length} vault redemption record(s) from incomingDeposits.`,
  );
  console.log(
    '\nThe activity feed should now only show actual incoming transfers.',
  );

  await pool.end();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
