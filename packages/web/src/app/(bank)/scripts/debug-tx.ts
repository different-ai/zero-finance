#!/usr/bin/env node
/*
 * Transaction debugging script
 * Usage: npx tsx scripts/debug-tx.ts <transaction-hash>
 */

import { logTransactionDebug } from '@/lib/debug-utils';

async function main() {
  // Get transaction hash from command line
  const txHash = process.argv[2];
  
  if (!txHash) {
    console.error('0xHypr Error: Transaction hash required');
    console.error('Usage: npx tsx scripts/debug-tx.ts <transaction-hash>');
    process.exit(1);
  }
  
  // Check if the hash looks valid
  if (!txHash.startsWith('0x') || txHash.length !== 66) {
    console.warn('0xHypr Warning: Transaction hash may be invalid. Should be 0x followed by 64 hex characters.');
  }

  try {
    // Custom RPC URL can be passed as second argument
    const rpcUrl = process.argv[3] || process.env.NEXT_PUBLIC_BASE_RPC_URL;
    
    // Run the debug function
    await logTransactionDebug(txHash, rpcUrl);
  } catch (error) {
    console.error('0xHypr Failed to debug transaction:', error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('0xHypr Unhandled error:', error);
    process.exit(1);
  }); 