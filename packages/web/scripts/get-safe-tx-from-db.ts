#!/usr/bin/env tsx
/**
 * Get Safe transactions from database
 */

import { Pool } from 'pg';

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('Error: POSTGRES_URL environment variable is not set.');
  process.exit(1);
}

async function getSafeTransactionsFromDB(safeAddress: string) {
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log(
      '🔍 Fetching transactions from database for Safe:',
      safeAddress,
    );
    console.log('═'.repeat(70) + '\n');

    // Check raw_transactions table
    console.log('1️⃣  RAW_TRANSACTIONS:');
    const rawTxs = await pool.query(
      `
      SELECT * FROM raw_transactions 
      WHERE from_address = $1 OR to_address = $1
      ORDER BY created_at DESC
      LIMIT 50
    `,
      [safeAddress.toLowerCase()],
    );

    console.log(`   Found ${rawTxs.rows.length} transactions\n`);

    if (rawTxs.rows.length > 0) {
      rawTxs.rows.forEach((tx: any, i: number) => {
        console.log(`${i + 1}. ${tx.created_at}`);
        console.log(`   Hash: ${tx.hash}`);
        console.log(`   From: ${tx.from_address}`);
        console.log(`   To: ${tx.to_address}`);
        console.log(`   Value: ${tx.value}`);
        console.log(`   Status: ${tx.status}`);
        console.log('');
      });
    }

    // Check earn_deposits
    console.log('\n2️⃣  EARN_DEPOSITS:');
    const deposits = await pool.query(
      `
      SELECT * FROM earn_deposits
      WHERE user_safe_address = $1
      ORDER BY created_at DESC
      LIMIT 20
    `,
      [safeAddress.toLowerCase()],
    );

    console.log(`   Found ${deposits.rows.length} deposit records\n`);

    if (deposits.rows.length > 0) {
      deposits.rows.forEach((dep: any, i: number) => {
        console.log(`${i + 1}. ${dep.created_at}`);
        console.log(`   Amount: ${dep.amount_usdc} USDC`);
        console.log(`   Vault: ${dep.vault_id}`);
        console.log(`   Status: ${dep.status}`);
        console.log(`   Tx Hash: ${dep.transaction_hash || '(none)'}`);
        console.log('');
      });
    }

    // Check earn_withdrawals
    console.log('\n3️⃣  EARN_WITHDRAWALS:');
    const withdrawals = await pool.query(
      `
      SELECT * FROM earn_withdrawals
      WHERE user_safe_address = $1
      ORDER BY created_at DESC
      LIMIT 20
    `,
      [safeAddress.toLowerCase()],
    );

    console.log(`   Found ${withdrawals.rows.length} withdrawal records\n`);

    if (withdrawals.rows.length > 0) {
      withdrawals.rows.forEach((w: any, i: number) => {
        console.log(`${i + 1}. ${w.created_at}`);
        console.log(`   Amount: ${w.amount_usdc} USDC`);
        console.log(`   Vault: ${w.vault_id}`);
        console.log(`   Status: ${w.status}`);
        console.log(`   Tx Hash: ${w.transaction_hash || '(none)'}`);
        console.log('');
      });
    }

    // Check incoming_deposits
    console.log('\n4️⃣  INCOMING_DEPOSITS:');
    const incoming = await pool.query(
      `
      SELECT * FROM incoming_deposits
      WHERE destination_address = $1
      ORDER BY created_at DESC
      LIMIT 20
    `,
      [safeAddress.toLowerCase()],
    );

    console.log(`   Found ${incoming.rows.length} incoming deposit records\n`);

    if (incoming.rows.length > 0) {
      incoming.rows.forEach((inc: any, i: number) => {
        console.log(`${i + 1}. ${inc.created_at}`);
        console.log(`   Amount: ${inc.amount}`);
        console.log(`   Currency: ${inc.currency}`);
        console.log(`   Status: ${inc.status}`);
        console.log(`   Tx Hash: ${inc.transaction_hash || '(none)'}`);
        console.log('');
      });
    }

    // Summary
    console.log('═'.repeat(70));
    console.log('📊 SUMMARY\n');
    console.log(`Raw Transactions:    ${rawTxs.rows.length}`);
    console.log(`Earn Deposits:       ${deposits.rows.length}`);
    console.log(`Earn Withdrawals:    ${withdrawals.rows.length}`);
    console.log(`Incoming Deposits:   ${incoming.rows.length}`);
    console.log('');
    console.log('💡 TIP: View on BaseScan:');
    console.log(`   https://basescan.org/address/${safeAddress}\n`);
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

const safeAddress = process.argv[2];

if (!safeAddress?.startsWith('0x')) {
  console.error('Usage: npx tsx scripts/get-safe-tx-from-db.ts <safe-address>');
  process.exit(1);
}

getSafeTransactionsFromDB(safeAddress);
