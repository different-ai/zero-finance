/**
 * Script to investigate duplicate transactions in virtual_account_history
 *
 * Run with: npx tsx scripts/check-duplicate-transactions.ts
 *
 * Uses .env.production.local for database connection
 */

import 'dotenv/config';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';

// Load production env
config({ path: '.env.production.local' });

const DATABASE_URL = process.env.POSTGRES_URL;

if (!DATABASE_URL) {
  console.error('ERROR: POSTGRES_URL not found in .env.production.local');
  process.exit(1);
}

async function main() {
  console.log('Connecting to database...\n');

  const sqlClient = neon(DATABASE_URL!);
  const db = drizzle(sqlClient);

  // 1. Check for duplicates based on (va_id, event_type, timestamp, amount)
  console.log('=== CHECKING FOR DUPLICATES ===\n');

  const duplicates = await db.execute(sql`
    SELECT 
      align_virtual_account_id,
      event_type,
      event_timestamp,
      source_amount,
      COUNT(*) as count
    FROM virtual_account_history
    GROUP BY align_virtual_account_id, event_type, event_timestamp, source_amount
    HAVING COUNT(*) > 1
    ORDER BY count DESC
    LIMIT 20
  `);

  console.log(
    'Duplicate groups (same va_id + event_type + timestamp + amount):',
  );
  console.log(JSON.stringify(duplicates.rows, null, 2));
  console.log(`\nTotal duplicate groups: ${duplicates.rows.length}\n`);

  // 2. Check for NULL timestamps
  console.log('=== CHECKING FOR NULL TIMESTAMPS ===\n');

  const nullTimestamps = await db.execute(sql`
    SELECT 
      id,
      align_virtual_account_id,
      event_type,
      source_amount,
      created_at
    FROM virtual_account_history
    WHERE event_timestamp IS NULL
    LIMIT 20
  `);

  console.log('Rows with NULL event_timestamp:');
  console.log(JSON.stringify(nullTimestamps.rows, null, 2));
  console.log(
    `\nTotal rows with NULL timestamp: ${nullTimestamps.rows.length}\n`,
  );

  // 3. Check rawEventData for any 'id' field from Align API
  console.log('=== CHECKING RAW EVENT DATA FOR ID FIELDS ===\n');

  const rawDataSample = await db.execute(sql`
    SELECT 
      id,
      raw_event_data
    FROM virtual_account_history
    WHERE raw_event_data IS NOT NULL
    LIMIT 5
  `);

  console.log('Sample raw_event_data (checking for id/event_id fields):');
  for (const row of rawDataSample.rows) {
    const rawData = row.raw_event_data as any;
    console.log('\n--- Row ID:', row.id, '---');
    console.log('Keys in raw_event_data:', Object.keys(rawData || {}));
    if (rawData?.id) console.log('  -> Found id:', rawData.id);
    if (rawData?.event_id)
      console.log('  -> Found event_id:', rawData.event_id);
    if (rawData?.transaction_id)
      console.log('  -> Found transaction_id:', rawData.transaction_id);
    console.log('Full raw_event_data:', JSON.stringify(rawData, null, 2));
  }

  // 4. Count total transactions
  console.log('\n=== TOTAL COUNTS ===\n');

  const totalCount = await db.execute(sql`
    SELECT COUNT(*) as total FROM virtual_account_history
  `);
  console.log(
    'Total rows in virtual_account_history:',
    totalCount.rows[0]?.total,
  );

  const uniqueByTxHash = await db.execute(sql`
    SELECT COUNT(DISTINCT transaction_hash) as unique_tx_hashes
    FROM virtual_account_history
    WHERE transaction_hash IS NOT NULL
  `);
  console.log(
    'Unique transaction hashes:',
    uniqueByTxHash.rows[0]?.unique_tx_hashes,
  );

  // 5. Check for same transaction_hash appearing multiple times
  console.log('\n=== DUPLICATE TRANSACTION HASHES ===\n');

  const duplicateTxHashes = await db.execute(sql`
    SELECT 
      transaction_hash,
      COUNT(*) as count
    FROM virtual_account_history
    WHERE transaction_hash IS NOT NULL
    GROUP BY transaction_hash
    HAVING COUNT(*) > 1
    ORDER BY count DESC
    LIMIT 10
  `);

  console.log('Transaction hashes appearing multiple times:');
  console.log(JSON.stringify(duplicateTxHashes.rows, null, 2));

  // 6. Show some actual duplicate rows
  if (duplicates.rows.length > 0) {
    const firstDup = duplicates.rows[0] as any;
    console.log('\n=== EXAMPLE DUPLICATE ROWS ===\n');

    const exampleDuplicates = await db.execute(sql`
      SELECT *
      FROM virtual_account_history
      WHERE align_virtual_account_id = ${firstDup.align_virtual_account_id}
        AND event_type = ${firstDup.event_type}
        AND source_amount = ${firstDup.source_amount}
        AND (event_timestamp = ${firstDup.event_timestamp} OR (event_timestamp IS NULL AND ${firstDup.event_timestamp} IS NULL))
      ORDER BY created_at
    `);

    console.log('Duplicate rows for first group:');
    for (const row of exampleDuplicates.rows) {
      console.log('\n---');
      console.log('  id:', (row as any).id);
      console.log('  created_at (our DB):', (row as any).created_at);
      console.log(
        '  event_timestamp (from Align):',
        (row as any).event_timestamp,
      );
      console.log('  transaction_hash:', (row as any).transaction_hash);
    }
  }

  console.log('\n=== DONE ===\n');
}

main().catch(console.error);
