import { db } from '@/db';
import { earnDeposits, earnWithdrawals } from '@/db/schema';
import { sql, eq, desc } from 'drizzle-orm';
import { BASE_USDC_VAULTS, BASE_CHAIN_ID, ETHEREUM_CHAIN_ID } from '@/server/earn/base-vaults';
import { getBaseRpcUrl } from '@/lib/base-rpc-url';
import {
  createPublicClient,
  http,
  parseAbi,
  type Address,
} from 'viem';
import { base, mainnet } from 'viem/chains';

const ERC4626_VAULT_ABI = parseAbi([
  'function convertToAssets(uint256 shares) view returns (uint256)',
]);

const baseClient = createPublicClient({
  chain: base,
  transport: http(getBaseRpcUrl()),
});

let ethereumClient: ReturnType<typeof createPublicClient> | null = null;

function getVaultChainId(address: string): number {
  const config = BASE_USDC_VAULTS.find(
    (vault) => vault.address.toLowerCase() === address.toLowerCase(),
  );
  return config?.chainId ?? BASE_CHAIN_ID;
}

function getClientForChain(chainId: number) {
  if (chainId === BASE_CHAIN_ID) {
    return baseClient;
  }

  if (chainId === ETHEREUM_CHAIN_ID) {
    if (!ethereumClient) {
      const rpcUrl =
        process.env.ETHEREUM_RPC_URL ??
        process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL;
      if (!rpcUrl) {
        throw new Error(
          'Missing ETHEREUM_RPC_URL or NEXT_PUBLIC_ETHEREUM_RPC_URL for Ethereum vaults',
        );
      }
      ethereumClient = createPublicClient({
        chain: mainnet,
        transport: http(rpcUrl),
      });
    }
    return ethereumClient;
  }

  throw new Error(`Unsupported chain ${chainId}`);
}

async function getCurrentAssets(
  vaultAddress: string,
  shares: bigint,
): Promise<bigint> {
  if (shares === 0n) return 0n;
  const chainId = getVaultChainId(vaultAddress);
  const client = getClientForChain(chainId);
  return client.readContract({
    address: vaultAddress as Address,
    abi: ERC4626_VAULT_ABI,
    functionName: 'convertToAssets',
    args: [shares],
  });
}

function formatUsd(amount: bigint, decimals = 6) {
  const divided = Number(amount) / 10 ** decimals;
  return `$${divided.toFixed(2)}`;
}

async function correctLedger(
  safeAddress: string,
  vaultAddress: string,
) {
  const deposits = await db.query.earnDeposits.findMany({
    where: (table, { and, eq }) =>
      and(
        eq(table.safeAddress, safeAddress),
        eq(table.vaultAddress, vaultAddress),
      ),
    orderBy: (table, { desc }) => desc(table.timestamp),
  });

  const withdrawals = await db.query.earnWithdrawals.findMany({
    where: (table, { and, eq }) =>
      and(
        eq(table.safeAddress, safeAddress),
        eq(table.vaultAddress, vaultAddress),
      ),
  });

  if (deposits.length === 0 && withdrawals.length === 0) {
    return;
  }

  let totalDeposited = 0n;
  let totalWithdrawn = 0n;
  let shares = 0n;

  for (const deposit of deposits) {
    const depositAmount = BigInt(deposit.assetsDeposited);
    const depositShares = BigInt(deposit.sharesReceived);
    totalDeposited += depositAmount;
    shares += depositShares;
  }

  for (const withdrawal of withdrawals) {
    const withdrawnAmount = BigInt(withdrawal.assetsWithdrawn);
    const burnedShares = BigInt(withdrawal.sharesBurned);
    totalWithdrawn += withdrawnAmount;
    shares -= burnedShares;
  }

  const ledgerPrincipal = totalDeposited - totalWithdrawn;
  const currentAssets = await getCurrentAssets(vaultAddress, shares);
  const shortfall = ledgerPrincipal - currentAssets;
  const tolerance = 1000n; // $0.001

  if (shortfall <= tolerance) {
    return;
  }

  console.log(
    `Detected ledger shortfall for ${safeAddress} -> ${vaultAddress}: ledger ${formatUsd(ledgerPrincipal)}, assets ${formatUsd(currentAssets)}, shortfall ${formatUsd(shortfall)}`,
  );

  let remaining = shortfall;

  await db.transaction(async (tx) => {
    for (const deposit of deposits) {
      if (remaining <= 0n) break;
      const currentAmount = BigInt(deposit.assetsDeposited);
      if (currentAmount === 0n) continue;

      const newAmount = currentAmount > remaining ? currentAmount - remaining : 0n;
      const adjusted = currentAmount - newAmount;

      if (adjusted > 0n) {
        await tx
          .update(earnDeposits)
          .set({ assetsDeposited: newAmount.toString() })
          .where(eq(earnDeposits.id, deposit.id));

        console.log(
          `  • Adjusted deposit ${deposit.id} from ${formatUsd(currentAmount)} to ${formatUsd(newAmount)} (diff ${formatUsd(adjusted)})`,
        );

        remaining -= adjusted;
      }
    }

    if (remaining > 0n) {
      throw new Error(
        `Unable to reconcile full shortfall for ${safeAddress} -> ${vaultAddress}. Remaining ${formatUsd(remaining)} after adjustments.`,
      );
    }
  });

  const updatedDeposits = await db.query.earnDeposits.findMany({
    where: (table, { and, eq }) =>
      and(
        eq(table.safeAddress, safeAddress),
        eq(table.vaultAddress, vaultAddress),
      ),
  });

  const updatedTotal = updatedDeposits.reduce(
    (sum, dep) => sum + dep.assetsDeposited,
    0n,
  );

  console.log(
    `  → Updated total deposits ${formatUsd(updatedTotal)}; ledger is now ${formatUsd(updatedTotal - totalWithdrawn)}`,
  );
}

async function main() {
  const combos = await db.execute<{ safe_address: string; vault_address: string }>(
    sql`
      SELECT DISTINCT safe_address, vault_address
      FROM (
        SELECT safe_address, vault_address FROM ${earnDeposits}
        UNION
        SELECT safe_address, vault_address FROM ${earnWithdrawals}
      ) AS combos
    `,
  );

  console.log(`Found ${combos.rows.length} safe/vault combinations to audit.`);

  for (const row of combos.rows) {
    await correctLedger(row.safe_address, row.vault_address);
  }

  console.log('Ledger correction completed.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Ledger correction failed:', err);
  process.exit(1);
});
