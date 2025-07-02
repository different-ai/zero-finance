#!/usr/bin/env tsx
/**
 * Direct execution of auto-earn sweep logic
 * Usage: pnpm auto-earn:sweep
 * 
 * This runs the sweep function directly without HTTP
 */

import 'dotenv/config';
import { db } from '../src/db';
import { autoEarnConfigs, allocationStates, userSafes, earnDeposits, incomingDeposits } from '../src/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import {
  createPublicClient,
  createWalletClient,
  http,
  parseAbi,
  decodeEventLog,
  type Address,
  Hex,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import { formatUnits } from 'viem';
import crypto from 'crypto';
import { USDC_ADDRESS, USDC_DECIMALS } from '../src/lib/constants';

// Environment variables
const AUTO_EARN_MODULE_ADDRESS = process.env.AUTO_EARN_MODULE_ADDRESS! as Address;
let RELAYER_PK = process.env.RELAYER_PK! as Hex;
const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
const SAFE_TRANSACTION_SERVICE_URL = process.env.SAFE_TRANSACTION_SERVICE_URL || 'https://safe-transaction-base.safe.global';

// Minimal ABIs
const ERC20_ABI = parseAbi(['function balanceOf(address) view returns (uint256)']);
const AUTO_EARN_ABI = parseAbi(['function autoEarn(address token, uint256 amountToSave, address safe)']);
const FLUIDKEY_EARN_VIEW_ABI = parseAbi([
  'function accountConfig(address) view returns (uint256)',
  'function config(uint256,uint256,address) view returns (address)',
]);
const ERC4626_VAULT_ABI = parseAbi([
  'event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares)',
]);

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
  
  console.log(`[auto-earn-sweep] Fetching incoming transfers from: ${url.toString()}`);
  
  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Safe Transaction Service returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`[auto-earn-sweep] Error fetching transactions for ${safeAddress}:`, error);
    return [];
  }
}

async function syncIncomingDeposits(userDid: string, safeAddress: string): Promise<void> {
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
  
  console.log(`[auto-earn-sweep] Found ${usdcTransfers.length} new USDC deposits for ${safeAddress}`);
  
  // Store new deposits in database
  for (const transfer of usdcTransfers) {
    try {
      // Check if we already have this transaction
      const existing = await db.query.incomingDeposits.findFirst({
        where: eq(incomingDeposits.txHash, transfer.transactionHash),
      });
      
      if (existing) {
        console.log(`[auto-earn-sweep] Transaction ${transfer.transactionHash} already exists, skipping`);
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
      
      console.log(`[auto-earn-sweep] Stored new deposit: ${formatUnits(BigInt(transfer.value), USDC_DECIMALS)} USDC from ${transfer.from}`);
    } catch (error) {
      console.error(`[auto-earn-sweep] Error storing deposit ${transfer.transactionHash}:`, error);
    }
  }
}

async function sweep() {
  if (!AUTO_EARN_MODULE_ADDRESS || !RELAYER_PK) {
    throw new Error('AUTO_EARN_MODULE_ADDRESS or RELAYER_PK missing in environment.');
  }
  
  // make sure 0x is prefixed to RELAYER_PK
  if (!RELAYER_PK.startsWith('0x')) {
    RELAYER_PK = ('0x' + RELAYER_PK) as Hex;
  }

  const publicClient = createPublicClient({ chain: base, transport: http(BASE_RPC_URL) });
  const account = privateKeyToAccount(RELAYER_PK as Hex);
  const walletClient = createWalletClient({ account, chain: base, transport: http(BASE_RPC_URL) });

  const configs = await db.select().from(autoEarnConfigs);
  console.log(`[auto-earn-sweep] found ${configs.length} auto-earn configs`);

  const results = [];

  for (const cfg of configs) {
    try {
      const { userDid, safeAddress, pct } = cfg;
      const safeAddr = safeAddress as Address;

      // Verify module enabled flag in DB; skip otherwise
      const safeRec = await db.query.userSafes.findFirst({
        where: and(eq(userSafes.userDid, userDid), eq(userSafes.safeAddress, safeAddr)),
      });
      if (!safeRec?.isEarnModuleEnabled) {
        console.log(`[auto-earn-sweep] Safe ${safeAddr} for ${userDid} does not have module enabled; skipping.`);
        continue;
      }

      console.log(`[auto-earn-sweep] 📊 Processing Safe ${safeAddr}`);
      
      // Step 1: Sync incoming deposits from blockchain
      await syncIncomingDeposits(userDid, safeAddr);
      
      // Step 2: Get unswept deposits
      const unsweptDeposits = await db.query.incomingDeposits.findMany({
        where: and(
          eq(incomingDeposits.safeAddress, safeAddr),
          eq(incomingDeposits.tokenAddress, USDC_ADDRESS),
          eq(incomingDeposits.swept, false)
        ),
        orderBy: [desc(incomingDeposits.timestamp)],
      });
      
      console.log(`[auto-earn-sweep] Found ${unsweptDeposits.length} unswept deposits`);
      
      if (unsweptDeposits.length === 0) {
        console.log(`[auto-earn-sweep] No unswept deposits for ${safeAddr}`);
        continue;
      }
      
      // Step 3: Process each unswept deposit
      for (const deposit of unsweptDeposits) {
        const amountToSave = (deposit.amount * BigInt(pct)) / 100n;
        
        console.log(`[auto-earn-sweep] Processing deposit ${deposit.txHash}:`);
        console.log(`  💰 Original amount: ${formatUnits(deposit.amount, USDC_DECIMALS)} USDC`);
        console.log(`  📊 Percentage to save: ${pct}%`);
        console.log(`  💡 Amount to save: ${formatUnits(amountToSave, USDC_DECIMALS)} USDC`);
        
        if (amountToSave === 0n) {
          console.log(`  ⚠️  Amount too small to save (rounds to 0) - marking as swept`);
          await db.update(incomingDeposits)
            .set({ 
              swept: true, 
              sweptAmount: 0n,
              sweptPercentage: pct,
              sweptAt: new Date()
            })
            .where(eq(incomingDeposits.id, deposit.id));
          continue;
        }

        console.log(`[auto-earn-sweep] 🚀 Executing auto-earn transfer...`);

        // Prepare and send tx
        const { request } = await publicClient.simulateContract({
          address: AUTO_EARN_MODULE_ADDRESS,
          abi: AUTO_EARN_ABI,
          functionName: 'autoEarn',
          args: [USDC_ADDRESS, amountToSave, safeAddr],
          account,
        });
        const txHash = await walletClient.writeContract(request);
        console.log(`[auto-earn-sweep] tx sent: ${txHash}`);

        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 1 });
        if (receipt.status !== 'success') {
          console.error(`[auto-earn-sweep] ❌ Transaction ${txHash} failed with status: ${receipt.status}`);
          continue;
        }

        console.log(`[auto-earn-sweep] ✅ Transaction confirmed: ${txHash}`);

        // Parse Deposit event to get shares and actual amount transferred
        let sharesReceived = 0n;
        let actualAmountDeposited = 0n;
        let vaultAddress: Address | undefined = undefined;
        try {
          // Determine configHash
          const cfgHash: bigint = await publicClient.readContract({
            address: AUTO_EARN_MODULE_ADDRESS,
            abi: FLUIDKEY_EARN_VIEW_ABI,
            functionName: 'accountConfig',
            args: [safeAddr],
          });
          const chainId = BigInt(base.id);
          vaultAddress = (await publicClient.readContract({
            address: AUTO_EARN_MODULE_ADDRESS,
            abi: FLUIDKEY_EARN_VIEW_ABI,
            functionName: 'config',
            args: [cfgHash, chainId, USDC_ADDRESS],
          })) as Address;

          console.log(`[auto-earn-sweep] 🏦 Vault Address: ${vaultAddress}`);

          for (const log of receipt.logs) {
            if (log.address.toLowerCase() === vaultAddress.toLowerCase()) {
              const ev = decodeEventLog({ abi: ERC4626_VAULT_ABI, data: log.data, topics: log.topics });
              if (ev.eventName === 'Deposit') {
                const depositArgs = ev.args as any;
                actualAmountDeposited = depositArgs.assets as bigint;
                sharesReceived = depositArgs.shares as bigint;
                console.log(`[auto-earn-sweep] 📋 Deposit Event Details:`);
                console.log(`  💰 Assets Deposited: ${formatUnits(actualAmountDeposited, USDC_DECIMALS)} USDC`);
                console.log(`  🎯 Shares Received: ${formatUnits(sharesReceived, 18)} shares`);
                break;
              }
            }
          }
        } catch (err) {
          console.warn(`[auto-earn-sweep] ⚠️  Could not parse Deposit event:`, err);
          // Fallback: use the planned amount as actual
          actualAmountDeposited = amountToSave;
        }

        // Record deposit in earnDeposits table
        await db.insert(earnDeposits).values({
          id: crypto.randomUUID(),
          userDid,
          safeAddress: safeAddr,
          vaultAddress: vaultAddress ?? '0x0000000000000000000000000000000000000000',
          tokenAddress: USDC_ADDRESS,
          assetsDeposited: actualAmountDeposited,
          sharesReceived,
          txHash,
          timestamp: new Date(),
          depositPercentage: pct,
        });

        // Update incoming deposit as swept
        await db.update(incomingDeposits)
          .set({
            swept: true,
            sweptAmount: actualAmountDeposited,
            sweptPercentage: pct,
            sweptTxHash: txHash,
            sweptAt: new Date(),
          })
          .where(eq(incomingDeposits.id, deposit.id));

        // Update allocation state for compatibility
        const allocState = await db.query.allocationStates.findFirst({
          where: eq(allocationStates.userSafeId, safeRec.id),
        });
        
        if (allocState) {
          await db.update(allocationStates).set({
            totalDeposited: (BigInt(allocState.totalDeposited || '0') + actualAmountDeposited).toString(),
            lastUpdated: new Date(),
          }).where(eq(allocationStates.userSafeId, safeRec.id));
        }

        await db.update(autoEarnConfigs).set({ lastTrigger: new Date() }).where(
          and(eq(autoEarnConfigs.userDid, userDid), eq(autoEarnConfigs.safeAddress, safeAddr)),
        );

        console.log(`[auto-earn-sweep] 📊 SUMMARY for deposit ${deposit.txHash}:`);
        console.log(`  🔍 Original deposit: ${formatUnits(deposit.amount, USDC_DECIMALS)} USDC`);
        console.log(`  💡 Saved: ${formatUnits(actualAmountDeposited, USDC_DECIMALS)} USDC (${pct}%)`);
        console.log(`  🎯 Shares Received: ${formatUnits(sharesReceived, 18)} vault shares`);
        
        results.push({
          safeAddress: safeAddr,
          depositTxHash: deposit.txHash,
          originalAmount: formatUnits(deposit.amount, USDC_DECIMALS),
          amountSaved: formatUnits(actualAmountDeposited, USDC_DECIMALS),
          sweepTxHash: txHash,
        });
      }
    } catch (err) {
      console.error('[auto-earn-sweep] error processing config', cfg, err);
      results.push({
        safeAddress: cfg.safeAddress,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
  
  return results;
}

// Run the sweep
console.log('🚀 Starting auto-earn sweep...\n');

sweep().then((results) => {
  console.log('\n✅ Auto-earn sweep completed successfully');
  console.log('📊 Results:', JSON.stringify(results, null, 2));
  
  if (results.length > 0) {
    console.log('\n📈 Summary:');
    results.forEach((r: any) => {
      if (r.error) {
        console.log(`  ❌ ${r.safeAddress}: ${r.error}`);
      } else if (r.depositTxHash) {
        console.log(`  ✅ ${r.safeAddress}: Swept ${r.amountSaved} USDC from deposit ${r.depositTxHash}`);
        console.log(`     Original: ${r.originalAmount} USDC → Sweep tx: ${r.sweepTxHash}`);
      }
    });
  } else {
    console.log('\n📊 No deposits to sweep');
  }
  
  process.exit(0);
}).catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
}); 