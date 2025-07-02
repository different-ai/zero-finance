import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/db';
import { autoEarnConfigs, allocationStates, userSafes, earnDeposits } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
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
const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';

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
  console.log(`[auto-earn-worker] found ${configs.length} auto-earn configs`);

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
        console.log(`[auto-earn-worker] Safe ${safeAddr} for ${userDid} does not have module enabled; skipping.`);
        continue;
      }

      // Fetch USDC balance
      const balance: bigint = await publicClient.readContract({
        address: USDC_ADDRESS as Address,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [safeAddr],
      });

      // Fetch allocation state (create if not exists)
      let allocState = await db.query.allocationStates.findFirst({
        where: eq(allocationStates.userSafeId, safeRec.id),
      });
      if (!allocState) {
        await db.insert(allocationStates).values({ userSafeId: safeRec.id, lastCheckedUSDCBalance: balance.toString() });
        console.log(`[auto-earn-worker] baseline set for safe ${safeAddr}: ${formatUnits(balance, USDC_DECIMALS)} USDC`);
        continue; // first run – do not sweep
      }

      const lastBal = BigInt(allocState.lastCheckedUSDCBalance ?? '0');
      
      console.log(`[auto-earn-worker] 📊 Safe ${safeAddr} Analysis:`);
      console.log(`  💰 Current USDC Balance: ${formatUnits(balance, USDC_DECIMALS)} USDC`);
      console.log(`  📈 Previous Balance: ${formatUnits(lastBal, USDC_DECIMALS)} USDC`);
      
      if (balance <= lastBal) {
        // No increase
        console.log(`  ⏸️  No increase detected - skipping sweep`);
        await db.update(allocationStates).set({ lastCheckedUSDCBalance: balance.toString() }).where(eq(allocationStates.userSafeId, safeRec.id));
        continue;
      }

      const delta = balance - lastBal; // amount of new USDC
      const amountToSave = (delta * BigInt(pct)) / 100n;
      
      console.log(`  🔍 New Deposit Detected: +${formatUnits(delta, USDC_DECIMALS)} USDC`);
      console.log(`  ⚙️  Auto-earn Rule: ${pct}% allocation`);
      console.log(`  💡 Planned to Save: ${formatUnits(amountToSave, USDC_DECIMALS)} USDC`);
      
      if (amountToSave === 0n) {
        console.log(`  ⚠️  Amount too small to save (rounds to 0) - updating balance only`);
        await db.update(allocationStates).set({ lastCheckedUSDCBalance: balance.toString() }).where(eq(allocationStates.userSafeId, safeRec.id));
        continue;
      }

      console.log(`[auto-earn-worker] 🚀 Executing auto-earn transfer...`);

      // Prepare and send tx
      const { request } = await publicClient.simulateContract({
        address: AUTO_EARN_MODULE_ADDRESS,
        abi: AUTO_EARN_ABI,
        functionName: 'autoEarn',
        args: [USDC_ADDRESS, amountToSave, safeAddr],
        account,
      });
      const txHash = await walletClient.writeContract(request);
      console.log(`[auto-earn-worker] tx sent: ${txHash}`);

      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 1 });
      if (receipt.status !== 'success') {
        console.error(`[auto-earn-worker] ❌ Transaction ${txHash} failed with status: ${receipt.status}`);
        continue;
      }

      console.log(`[auto-earn-worker] ✅ Transaction confirmed: ${txHash}`);

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

        console.log(`[auto-earn-worker] 🏦 Vault Address: ${vaultAddress}`);

        for (const log of receipt.logs) {
          if (log.address.toLowerCase() === vaultAddress.toLowerCase()) {
            const ev = decodeEventLog({ abi: ERC4626_VAULT_ABI, data: log.data, topics: log.topics });
            if (ev.eventName === 'Deposit') {
              const depositArgs = ev.args as any;
              actualAmountDeposited = depositArgs.assets as bigint;
              sharesReceived = depositArgs.shares as bigint;
              console.log(`[auto-earn-worker] 📋 Deposit Event Details:`);
              console.log(`  💰 Assets Deposited: ${formatUnits(actualAmountDeposited, USDC_DECIMALS)} USDC`);
              console.log(`  🎯 Shares Received: ${formatUnits(sharesReceived, 18)} shares`);
              console.log(`  👤 Depositor: ${depositArgs.caller}`);
              console.log(`  🏠 Owner: ${depositArgs.owner}`);
              break;
            }
          }
        }

        // Verify the actual amount matches what we planned
        if (actualAmountDeposited === amountToSave) {
          console.log(`[auto-earn-worker] ✅ SUCCESS: Planned amount matches actual deposit!`);
        } else {
          console.log(`[auto-earn-worker] ⚠️  MISMATCH: Planned ${formatUnits(amountToSave, USDC_DECIMALS)} USDC but deposited ${formatUnits(actualAmountDeposited, USDC_DECIMALS)} USDC`);
        }
      } catch (err) {
        console.warn(`[auto-earn-worker] ⚠️  Could not parse Deposit event:`, err);
        // Fallback: use the planned amount as actual
        actualAmountDeposited = amountToSave;
      }

      // Record deposit with the percentage used
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
        depositPercentage: pct, // Store the percentage used at deposit time
      });

      // Update state tables
      await db.update(allocationStates).set({
        lastCheckedUSDCBalance: balance.toString(),
        totalDeposited: (BigInt(allocState.totalDeposited || '0') + actualAmountDeposited).toString(),
        lastUpdated: new Date(),
      }).where(eq(allocationStates.userSafeId, safeRec.id));

      await db.update(autoEarnConfigs).set({ lastTrigger: new Date() }).where(
        and(eq(autoEarnConfigs.userDid, userDid), eq(autoEarnConfigs.safeAddress, safeAddr)),
      );

      console.log(`[auto-earn-worker] 📊 SUMMARY for Safe ${safeAddr}:`);
      console.log(`  🔍 Found: +${formatUnits(delta, USDC_DECIMALS)} USDC new deposit`);
      console.log(`  💡 Planned: ${formatUnits(amountToSave, USDC_DECIMALS)} USDC (${pct}%)`);
      console.log(`  ✅ Actually Saved: ${formatUnits(actualAmountDeposited, USDC_DECIMALS)} USDC`);
      console.log(`  🎯 Shares Received: ${formatUnits(sharesReceived, 18)} vault shares`);
      console.log(`  💰 New Balance: ${formatUnits(balance, USDC_DECIMALS)} USDC`);
      console.log(`  📈 Total Saved to Date: ${formatUnits(BigInt(allocState.totalDeposited || '0') + actualAmountDeposited, USDC_DECIMALS)} USDC`);
      console.log(``);
      
      results.push({
        safeAddress: safeAddr,
        amountSaved: formatUnits(actualAmountDeposited, USDC_DECIMALS),
        txHash,
      });
    } catch (err) {
      console.error('[auto-earn-worker] error processing config', cfg, err);
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