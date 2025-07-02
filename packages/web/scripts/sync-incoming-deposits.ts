#!/usr/bin/env tsx
/**
 * Sync incoming deposits from blockchain without sweeping
 * Usage: pnpm auto-earn:sync
 * 
 * This only syncs deposits to the database, doesn't sweep them
 */

import 'dotenv/config';
import { db } from '../src/db';
import { userSafes, incomingDeposits } from '../src/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { USDC_ADDRESS, USDC_DECIMALS } from '../src/lib/constants';
import { formatUnits } from 'viem';

const SAFE_TRANSACTION_SERVICE_URL = process.env.SAFE_TRANSACTION_SERVICE_URL || 'https://safe-transaction-base.safe.global';

// Types for Safe Transaction Service API
interface SafeTransactionServiceTransfer {
  type: 'ERC20_TRANSFER' | 'ETHER_TRANSFER' | 'ERC721_TRANSFER';
  executionDate: string;
  blockNumber: number;
  transactionHash: string;
  to: string;
  from: string;
  value: string;
  tokenId?: string;
  tokenAddress?: string;
  tokenInfo?: {
    address: string;
    symbol: string;
    decimals: number;
    name: string;
  };
}

async function fetchIncomingTransactions(safeAddress: string, fromTimestamp?: Date): Promise<SafeTransactionServiceTransfer[]> {
  const url = new URL(`${SAFE_TRANSACTION_SERVICE_URL}/api/v1/safes/${safeAddress}/incoming-transfers/`);
  
  // Add query parameters
  url.searchParams.append('limit', '100');
  if (fromTimestamp) {
    url.searchParams.append('execution_date__gte', fromTimestamp.toISOString());
  }
  
  console.log(`[sync-deposits] Fetching incoming transfers from: ${url.toString()}`);
  
  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Safe Transaction Service returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`[sync-deposits] Error fetching transactions for ${safeAddress}:`, error);
    return [];
  }
}

async function syncIncomingDeposits(userDid: string, safeAddress: string): Promise<number> {
  // Get the latest synced transaction timestamp
  const latestDeposit = await db.query.incomingDeposits.findFirst({
    where: and(
      eq(incomingDeposits.safeAddress, safeAddress),
      eq(incomingDeposits.tokenAddress, USDC_ADDRESS)
    ),
    orderBy: [desc(incomingDeposits.timestamp)],
  });
  
  const fromTimestamp = latestDeposit ? new Date(latestDeposit.timestamp) : undefined;
  
  // Fetch transactions from Safe Transaction Service
  const transactions = await fetchIncomingTransactions(safeAddress, fromTimestamp);
  
  // Filter for USDC transfers
  const usdcTransfers = transactions.filter(tx => 
    tx.type === 'ERC20_TRANSFER' && 
    tx.tokenAddress?.toLowerCase() === USDC_ADDRESS.toLowerCase() &&
    tx.to.toLowerCase() === safeAddress.toLowerCase()
  );
  
  console.log(`[sync-deposits] Found ${usdcTransfers.length} USDC transfers for ${safeAddress}`);
  
  let newDeposits = 0;
  
  // Store new deposits in database
  for (const transfer of usdcTransfers) {
    try {
      // Check if we already have this transaction
      const existing = await db.query.incomingDeposits.findFirst({
        where: eq(incomingDeposits.txHash, transfer.transactionHash),
      });
      
      if (existing) {
        console.log(`[sync-deposits] Transaction ${transfer.transactionHash} already exists, skipping`);
        continue;
      }
      
      await db.insert(incomingDeposits).values({
        userDid,
        safeAddress: safeAddress as `0x${string}`,
        txHash: transfer.transactionHash as `0x${string}`,
        fromAddress: transfer.from as `0x${string}`,
        tokenAddress: USDC_ADDRESS as `0x${string}`,
        amount: BigInt(transfer.value),
        blockNumber: BigInt(transfer.blockNumber),
        timestamp: new Date(transfer.executionDate),
        swept: false,
        metadata: {
          tokenInfo: transfer.tokenInfo,
          source: 'safe-transaction-service',
        },
      });
      
      console.log(`[sync-deposits] ✅ Stored new deposit: ${formatUnits(BigInt(transfer.value), USDC_DECIMALS)} USDC from ${transfer.from}`);
      newDeposits++;
    } catch (error) {
      console.error(`[sync-deposits] Error storing deposit ${transfer.transactionHash}:`, error);
    }
  }
  
  return newDeposits;
}

async function syncAllSafes() {
  console.log('🚀 Starting incoming deposit sync...\n');
  
  // Get all safes with earn module enabled
  const safes = await db.query.userSafes.findMany({
    where: eq(userSafes.isEarnModuleEnabled, true),
  });
  
  console.log(`[sync-deposits] Found ${safes.length} safes with earn module enabled\n`);
  
  let totalNewDeposits = 0;
  
  for (const safe of safes) {
    console.log(`\n📊 Syncing deposits for Safe ${safe.safeAddress}...`);
    try {
      const newDeposits = await syncIncomingDeposits(safe.userDid, safe.safeAddress);
      totalNewDeposits += newDeposits;
      
      if (newDeposits > 0) {
        console.log(`✅ Synced ${newDeposits} new deposits for ${safe.safeAddress}`);
      } else {
        console.log(`✅ No new deposits for ${safe.safeAddress}`);
      }
    } catch (error) {
      console.error(`❌ Error syncing deposits for ${safe.safeAddress}:`, error);
    }
  }
  
  console.log(`\n✨ Sync complete! Total new deposits: ${totalNewDeposits}`);
  
  // Show unswept deposits summary
  const unsweptDeposits = await db.query.incomingDeposits.findMany({
    where: eq(incomingDeposits.swept, false),
  });
  
  if (unsweptDeposits.length > 0) {
    console.log(`\n📋 Unswept deposits summary:`);
    const depositsBySafe = unsweptDeposits.reduce((acc, deposit) => {
      if (!acc[deposit.safeAddress]) {
        acc[deposit.safeAddress] = {
          count: 0,
          total: 0n,
        };
      }
      acc[deposit.safeAddress].count++;
      acc[deposit.safeAddress].total += deposit.amount;
      return acc;
    }, {} as Record<string, { count: number; total: bigint }>);
    
    Object.entries(depositsBySafe).forEach(([safeAddress, data]) => {
      console.log(`  ${safeAddress}: ${data.count} deposits, ${formatUnits(data.total, USDC_DECIMALS)} USDC total`);
    });
    
    console.log(`\n💡 Run 'pnpm auto-earn:sweep' to process these deposits`);
  } else {
    console.log(`\n✅ All deposits have been swept!`);
  }
}

// Run the sync
syncAllSafes().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
}); 