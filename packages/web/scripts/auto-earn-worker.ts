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

// Environment variables
const AUTO_EARN_MODULE_ADDRESS = process.env.AUTO_EARN_MODULE_ADDRESS as Hex | undefined;
const RELAYER_PK = process.env.RELAYER_PK as Hex | undefined;
const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';

if (!AUTO_EARN_MODULE_ADDRESS || !RELAYER_PK) {
  console.error('AUTO_EARN_MODULE_ADDRESS or RELAYER_PK missing in environment.');
  process.exit(1);
}

const publicClient = createPublicClient({ chain: base, transport: http(BASE_RPC_URL) });

const account = privateKeyToAccount(RELAYER_PK);
const walletClient = createWalletClient({ account, chain: base, transport: http(BASE_RPC_URL) });

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
  const configs = await db.select().from(autoEarnConfigs);
  console.log(`[auto-earn-worker] found ${configs.length} auto-earn configs`);

  for (const cfg of configs) {
    try {
      const { userDid, safeAddress, pct } = cfg;
      const safeAddr = safeAddress as Address;

      // Verify module enabled flag in DB; skip otherwise
      const safeRec = await db.query.userSafes.findFirst({
        where: (tbl, { and, eq }) => and(eq(tbl.userDid, userDid), eq(tbl.safeAddress, safeAddr)),
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
      if (balance <= lastBal) {
        // No increase
        await db.update(allocationStates).set({ lastCheckedUSDCBalance: balance.toString() }).where(eq(allocationStates.userSafeId, safeRec.id));
        continue;
      }

      const delta = balance - lastBal; // amount of new USDC
      const amountToSave = (delta * BigInt(pct)) / 100n;
      if (amountToSave === 0n) {
        await db.update(allocationStates).set({ lastCheckedUSDCBalance: balance.toString() }).where(eq(allocationStates.userSafeId, safeRec.id));
        continue;
      }

      console.log(`[auto-earn-worker] Sweeping ${formatUnits(amountToSave, USDC_DECIMALS)} USDC (${pct}%) from Safe ${safeAddr}`);

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
        console.error(`[auto-earn-worker] tx ${txHash} failed`);
        continue;
      }

      // Parse Deposit event to get shares (optional)
      let sharesReceived = 0n;
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

        for (const log of receipt.logs) {
          if (log.address.toLowerCase() === vaultAddress.toLowerCase()) {
            const ev = decodeEventLog({ abi: ERC4626_VAULT_ABI, data: log.data, topics: log.topics });
            if (ev.eventName === 'Deposit') {
              sharesReceived = (ev.args as any).shares as bigint;
              break;
            }
          }
        }
      } catch (err) {
        console.warn(`[auto-earn-worker] could not parse Deposit event`, err);
      }

      // Record deposit
      await db.insert(earnDeposits).values({
        id: crypto.randomUUID(),
        userDid,
        safeAddress: safeAddr,
        vaultAddress: vaultAddress ?? '0x0000000000000000000000000000000000000000',
        tokenAddress: USDC_ADDRESS,
        assetsDeposited: amountToSave,
        sharesReceived,
        txHash,
        timestamp: new Date(),
      });

      // Update state tables
      await db.update(allocationStates).set({
        lastCheckedUSDCBalance: balance.toString(),
        totalDeposited: (BigInt(allocState.totalDeposited || '0') + amountToSave).toString(),
        lastUpdated: new Date(),
      }).where(eq(allocationStates.userSafeId, safeRec.id));

      await db.update(autoEarnConfigs).set({ lastTrigger: new Date() }).where(
        and(eq(autoEarnConfigs.userDid, userDid), eq(autoEarnConfigs.safeAddress, safeAddr)),
      );
    } catch (err) {
      console.error('[auto-earn-worker] error processing config', cfg, err);
    }
  }
}

sweep().then(() => {
  console.log('[auto-earn-worker] sweep completed');
  process.exit(0);
}); 