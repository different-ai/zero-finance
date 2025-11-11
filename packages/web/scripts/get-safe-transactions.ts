#!/usr/bin/env tsx
/**
 * Get all transactions for a Safe address from BaseScan
 */

import { createPublicClient, http, type Address } from 'viem';
import { base } from 'viem/chains';

const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY || 'YourApiKeyToken';

async function getSafeTransactions(safeAddress: string) {
  console.log('🔍 Fetching transactions for Safe:', safeAddress);
  console.log('═'.repeat(70) + '\n');

  // Use BaseScan API
  const url = `https://api.basescan.org/api?module=account&action=txlist&address=${safeAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${BASESCAN_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== '1') {
      console.log('❌ Error from BaseScan:', data.message);
      console.log('   Try using BaseScan UI instead:');
      console.log(`   https://basescan.org/address/${safeAddress}\n`);
      return;
    }

    const txs = data.result;
    console.log(`Found ${txs.length} transactions\n`);

    if (txs.length === 0) {
      console.log('No transactions found for this Safe');
      return;
    }

    // Show recent transactions
    const recentTxs = txs.slice(0, 20);

    console.log('📋 Recent Transactions (last 20):\n');

    recentTxs.forEach((tx: any, i: number) => {
      const date = new Date(parseInt(tx.timeStamp) * 1000);
      const isError = tx.isError === '1';
      const value = (parseInt(tx.value) / 1e18).toFixed(4);

      console.log(`${i + 1}. ${date.toISOString()}`);
      console.log(`   Hash: ${tx.hash}`);
      console.log(`   From: ${tx.from}`);
      console.log(`   To: ${tx.to || '(contract creation)'}`);
      console.log(`   Value: ${value} ETH`);
      console.log(`   Status: ${isError ? '❌ FAILED' : '✅ SUCCESS'}`);
      console.log(`   Gas Used: ${tx.gasUsed}`);

      if (tx.functionName) {
        console.log(`   Function: ${tx.functionName}`);
      }

      if (tx.input && tx.input.length > 10) {
        console.log(`   Input: ${tx.input.substring(0, 66)}...`);
      }

      console.log('');
    });

    // Look for USDC transfers specifically
    console.log('═'.repeat(70));
    console.log('🔍 Looking for USDC-related transactions...\n');

    const usdcRelated = txs.filter(
      (tx: any) =>
        tx.to?.toLowerCase() === '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' || // USDC Base
        tx.input?.includes('a9059cbb') || // transfer()
        tx.input?.includes('23b872dd'), // transferFrom()
    );

    if (usdcRelated.length > 0) {
      console.log(`Found ${usdcRelated.length} USDC-related transaction(s):\n`);

      usdcRelated.forEach((tx: any, i: number) => {
        const date = new Date(parseInt(tx.timeStamp) * 1000);
        const isError = tx.isError === '1';

        console.log(`${i + 1}. ${date.toISOString()}`);
        console.log(`   Hash: ${tx.hash}`);
        console.log(`   Status: ${isError ? '❌ FAILED' : '✅ SUCCESS'}`);
        console.log(`   View: https://basescan.org/tx/${tx.hash}`);
        console.log('');
      });
    } else {
      console.log('No USDC transfers found in transaction history');
    }

    // Look for Across bridge transactions
    console.log('═'.repeat(70));
    console.log('🔍 Looking for Across bridge transactions...\n');

    const acrossRelated = txs.filter(
      (tx: any) =>
        tx.to?.toLowerCase() === '0x09aea4b2242abc8bb4bb78d537a67a245a7bec64' || // Across SpokePool
        tx.input?.includes('3af32abf'), // depositV3()
    );

    if (acrossRelated.length > 0) {
      console.log(
        `Found ${acrossRelated.length} Across bridge transaction(s):\n`,
      );

      acrossRelated.forEach((tx: any, i: number) => {
        const date = new Date(parseInt(tx.timeStamp) * 1000);
        const isError = tx.isError === '1';

        console.log(`${i + 1}. ${date.toISOString()}`);
        console.log(`   Hash: ${tx.hash}`);
        console.log(`   Status: ${isError ? '❌ FAILED' : '✅ SUCCESS'}`);
        console.log(`   View: https://basescan.org/tx/${tx.hash}`);
        console.log('');
      });
    } else {
      console.log('No Across bridge transactions found');
    }
  } catch (err: any) {
    console.error('Error fetching transactions:', err.message);
    console.log('\nTry viewing transactions on BaseScan directly:');
    console.log(`https://basescan.org/address/${safeAddress}\n`);
  }
}

const safeAddress = process.argv[2];

if (!safeAddress?.startsWith('0x')) {
  console.error(
    '❌ Usage: npx tsx scripts/get-safe-transactions.ts <safe-address>',
  );
  console.error('\nExample:');
  console.error(
    '  npx tsx scripts/get-safe-transactions.ts 0x341Eb50366F22161C90EDD4505d2916Ae275595e\n',
  );
  process.exit(1);
}

getSafeTransactions(safeAddress);
