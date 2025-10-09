import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/db';
import {
  autoEarnConfigs,
  userSafes,
  earnDeposits,
  incomingDeposits,
} from '@/db/schema';
import { eq, and, isNull, desc } from 'drizzle-orm';
import {
  createPublicClient,
  createWalletClient,
  http,
  parseAbi,
  decodeEventLog,
  getAddress,
  type Address,
  Hex,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import { formatUnits } from 'viem';
import crypto from 'crypto';
import { USDC_ADDRESS, USDC_DECIMALS } from '@/lib/constants';
import { getBaseRpcUrl } from '@/lib/base-rpc-url';
import { ensureUserWorkspace } from '@/server/utils/workspace';
import {
  getVaultApyBasisPoints,
  resolveVaultDecimals,
} from '@/server/earn/vault-apy-service';

// Helper to validate the cron key (to protect endpoint from unauthorized access)
function validateCronKey(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    console.warn('[auto-earn-cron] No authorization header provided');
    return false;
  }
  
  // In production, use a more secure validation method with a strong secret key
  // For development, accept any non-empty key
  return process.env.NODE_ENV === 'development' || authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

// Environment variables
const AUTO_EARN_MODULE_ADDRESS = process.env.AUTO_EARN_MODULE_ADDRESS! as Address;
let RELAYER_PK = process.env.RELAYER_PK! as Hex;
const BASE_RPC_URL = getBaseRpcUrl();
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
  
  console.log(`[auto-earn-cron] Fetching incoming transfers from: ${url.toString()}`);
  
  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Safe Transaction Service returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`[auto-earn-cron] Error fetching transactions for ${safeAddress}:`, error);
    return [];
  }
}

async function syncIncomingDeposits(
  userDid: string,
  safeAddress: string,
  workspaceId: string | null,
): Promise<void> {
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
  
  // Get all vault addresses for this user to filter out withdrawals
  const userVaults = await db.query.earnDeposits.findMany({
    where: and(
      eq(earnDeposits.userDid, userDid),
      eq(earnDeposits.safeAddress, safeAddress),
      workspaceId
        ? eq(earnDeposits.workspaceId, workspaceId)
        : isNull(earnDeposits.workspaceId),
    ),
    columns: { vaultAddress: true },
  });
  
  const vaultAddresses = new Set(userVaults.map(v => v.vaultAddress.toLowerCase()));
  console.log(`[auto-earn-cron] Found ${vaultAddresses.size} vault addresses for user ${userDid}: ${Array.from(vaultAddresses).join(', ')}`);
  
  // Filter for USDC transfers that are NOT from vault addresses (i.e., real deposits)
  const usdcTransfers = transactions.filter(tx => {
    const isUsdcTransfer = tx.type === 'ERC20_TRANSFER' && 
      tx.tokenAddress?.toLowerCase() === USDC_ADDRESS.toLowerCase() &&
      tx.to.toLowerCase() === safeAddress.toLowerCase();
    
    const isFromVault = vaultAddresses.has(tx.from.toLowerCase());
    
    if (isUsdcTransfer && isFromVault) {
      console.log(`[auto-earn-cron] Filtering out vault withdrawal: ${formatUnits(BigInt(tx.value), USDC_DECIMALS)} USDC from vault ${tx.from} (tx: ${tx.transactionHash})`);
      return false;
    }
    
    return isUsdcTransfer;
  });
  
  console.log(`[auto-earn-cron] Found ${usdcTransfers.length} new USDC deposits for ${safeAddress} (filtered out vault withdrawals)`);
  
  // Store new deposits in database
  for (const transfer of usdcTransfers) {
    try {
      // Check if we already have this transaction
      const existing = await db.query.incomingDeposits.findFirst({
        where: eq(incomingDeposits.txHash, transfer.transactionHash),
      });
      
      if (existing) {
        console.log(`[auto-earn-cron] Transaction ${transfer.transactionHash} already exists, skipping`);
        continue;
      }
      
      await db.insert(incomingDeposits).values({
        userDid,
        workspaceId: workspaceId ?? null,
        safeAddress: safeAddress as `0x${string}`,
        txHash: transfer.transactionHash as `0x${string}`,
        fromAddress: transfer.from as `0x${string}`,
        tokenAddress: USDC_ADDRESS as `0x${string}`,
        amount: BigInt(transfer.value).toString(),
        blockNumber: BigInt(transfer.blockNumber),
        timestamp: new Date(transfer.executionDate),
        swept: false,
        metadata: {
          tokenInfo: transfer.tokenInfo,
          source: 'safe-transaction-service',
          isVaultWithdrawal: false, // Explicitly mark as not a vault withdrawal
        },
      });
      
        console.log(
          `[auto-earn-cron] Stored new deposit: ${formatUnits(
            BigInt(transfer.value),
            USDC_DECIMALS,
          )} USDC from ${transfer.from} (workspace: ${workspaceId ?? 'none'})`,
        );
    } catch (error) {
      console.error(`[auto-earn-cron] Error storing deposit ${transfer.transactionHash}:`, error);
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
  console.log(`[auto-earn-cron] found ${configs.length} auto-earn configs`);

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
        console.log(`[auto-earn-cron] Safe ${safeAddr} for ${userDid} does not have module enabled; skipping.`);
        continue;
      }

      let workspaceId = safeRec.workspaceId ?? null;
      if (!workspaceId) {
        try {
          const { workspaceId: ensuredWorkspaceId } = await ensureUserWorkspace(db, userDid);
          workspaceId = ensuredWorkspaceId;
          await db
            .update(userSafes)
            .set({ workspaceId })
            .where(eq(userSafes.id, safeRec.id));
          console.log(
            `[auto-earn-cron] Attached workspace ${workspaceId} to safe ${safeAddr} for user ${userDid}`,
          );
        } catch (workspaceError) {
          console.warn(
            `[auto-earn-cron] Failed to resolve workspace for ${userDid}; continuing without workspace context`,
            workspaceError,
          );
        }
      }

      console.log(`[auto-earn-cron] 📊 Processing Safe ${safeAddr}`);
      
      // Step 1: Sync incoming deposits from blockchain
      await syncIncomingDeposits(userDid, safeAddr, workspaceId);
      
      // Step 2: Get unswept deposits
      const unsweptDeposits = await db.query.incomingDeposits.findMany({
        where: and(
          eq(incomingDeposits.safeAddress, safeAddr),
          eq(incomingDeposits.tokenAddress, USDC_ADDRESS),
          eq(incomingDeposits.swept, false),
          workspaceId
            ? eq(incomingDeposits.workspaceId, workspaceId)
            : isNull(incomingDeposits.workspaceId),
        ),
        orderBy: [desc(incomingDeposits.timestamp)],
      });
      
      console.log(`[auto-earn-cron] Found ${unsweptDeposits.length} unswept deposits`);
      
      if (unsweptDeposits.length === 0) {
        console.log(`[auto-earn-cron] No unswept deposits for ${safeAddr}`);
        continue;
      }
      
      // Step 3: Process each unswept deposit
      for (const deposit of unsweptDeposits) {
        const depositAmount = BigInt(deposit.amount);
        const amountToSave = (depositAmount * BigInt(pct)) / 100n;
        
        console.log(`[auto-earn-cron] Processing deposit ${deposit.txHash}:`);
        console.log(`  💰 Original amount: ${formatUnits(depositAmount, USDC_DECIMALS)} USDC`);
        console.log(`  📊 Percentage to save: ${pct}%`);
        console.log(`  💡 Amount to save: ${formatUnits(amountToSave, USDC_DECIMALS)} USDC`);
        
        if (amountToSave === 0n) {
          console.log(`  ⚠️  Amount too small to save (rounds to 0) - marking as swept`);
          await db
            .update(incomingDeposits)
            .set({
              swept: true,
              sweptAmount: '0',
              sweptPercentage: pct,
              sweptAt: new Date(),
              workspaceId: workspaceId ?? null,
            })
            .where(eq(incomingDeposits.id, deposit.id));
          continue;
        }

        console.log(`[auto-earn-cron] 🚀 Executing auto-earn transfer...`);

        // Prepare and send tx
        const { request } = await publicClient.simulateContract({
          address: AUTO_EARN_MODULE_ADDRESS,
          abi: AUTO_EARN_ABI,
          functionName: 'autoEarn',
          args: [USDC_ADDRESS, amountToSave, safeAddr],
          account,
        });
        const txHash = await walletClient.writeContract(request);
        console.log(`[auto-earn-cron] tx sent: ${txHash}`);

        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 1 });
        if (receipt.status !== 'success') {
          console.error(`[auto-earn-cron] ❌ Transaction ${txHash} failed with status: ${receipt.status}`);
          continue;
        }

        console.log(`[auto-earn-cron] ✅ Transaction confirmed: ${txHash}`);

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

          console.log(`[auto-earn-cron] 🏦 Vault Address: ${vaultAddress}`);

          for (const log of receipt.logs) {
            if (log.address.toLowerCase() === vaultAddress.toLowerCase()) {
              const ev = decodeEventLog({ abi: ERC4626_VAULT_ABI, data: log.data, topics: log.topics });
              if (ev.eventName === 'Deposit') {
                const depositArgs = ev.args as any;
                actualAmountDeposited = depositArgs.assets as bigint;
                sharesReceived = depositArgs.shares as bigint;
                console.log(`[auto-earn-cron] 📋 Deposit Event Details:`);
                console.log(`  💰 Assets Deposited: ${formatUnits(actualAmountDeposited, USDC_DECIMALS)} USDC`);
                console.log(`  🎯 Shares Received: ${formatUnits(sharesReceived, 18)} shares`);
                break;
              }
            }
          }
        } catch (err) {
          console.warn(`[auto-earn-cron] ⚠️  Could not parse Deposit event:`, err);
          // Fallback: use the planned amount as actual
          actualAmountDeposited = amountToSave;
        }

        const resolvedVaultAddress =
          vaultAddress ?? '0x0000000000000000000000000000000000000000';
        const { apyBasisPoints } = await getVaultApyBasisPoints(
          resolvedVaultAddress,
        );
        const assetDecimals = resolveVaultDecimals(resolvedVaultAddress);

        // Record deposit in earnDeposits table
        await db.insert(earnDeposits).values({
          id: crypto.randomUUID(),
          userDid,
          workspaceId: workspaceId ?? null,
          safeAddress: safeAddr,
          vaultAddress: resolvedVaultAddress,
          tokenAddress: USDC_ADDRESS,
          assetsDeposited: actualAmountDeposited.toString(),
          sharesReceived: sharesReceived.toString(),
          txHash,
          timestamp: new Date(),
          depositPercentage: pct,
          apyBasisPoints,
          assetDecimals,
        });

        // Update incoming deposit as swept
        await db
          .update(incomingDeposits)
          .set({
            swept: true,
            sweptAmount: actualAmountDeposited.toString(),
            sweptPercentage: pct,
            sweptTxHash: txHash,
            sweptAt: new Date(),
            workspaceId: workspaceId ?? null,
          })
          .where(eq(incomingDeposits.id, deposit.id));

        await db
          .update(autoEarnConfigs)
          .set({ lastTrigger: new Date(), workspaceId: workspaceId ?? null })
          .where(
            and(
              eq(autoEarnConfigs.userDid, userDid),
              eq(autoEarnConfigs.safeAddress, safeAddr),
            ),
          );

        console.log(`[auto-earn-cron] 📊 SUMMARY for deposit ${deposit.txHash}:`);
        console.log(`  🔍 Original deposit: ${formatUnits(depositAmount, USDC_DECIMALS)} USDC`);
        console.log(`  💡 Saved: ${formatUnits(actualAmountDeposited, USDC_DECIMALS)} USDC (${pct}%)`);
        console.log(`  🎯 Shares Received: ${formatUnits(sharesReceived, 18)} vault shares`);
        
        results.push({
          safeAddress: safeAddr,
          depositTxHash: deposit.txHash,
          originalAmount: formatUnits(depositAmount, USDC_DECIMALS),
          amountSaved: formatUnits(actualAmountDeposited, USDC_DECIMALS),
          sweepTxHash: txHash,
        });
      }
    } catch (err) {
      console.error('[auto-earn-cron] error processing config', cfg, err);
      results.push({
        safeAddress: cfg.safeAddress,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
  
  return results;
}

export async function GET(req: NextRequest) {
  // Validate cron key for security (except in development)
  if (process.env.NODE_ENV !== 'development' && !validateCronKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[auto-earn-cron] Starting auto-earn worker execution...');
    
    // Execute the sweep function directly
    const results = await sweep();
    
    console.log('[auto-earn-cron] Auto-earn sweep completed successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Auto-earn worker executed successfully',
      results,
    });
  } catch (error) {
    console.error('[auto-earn-cron] Failed to execute auto-earn worker:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to execute auto-earn worker',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 
