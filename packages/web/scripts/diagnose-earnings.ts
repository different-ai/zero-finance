import { db } from '@/db';
import { earnDeposits, earnWithdrawals, userProfilesTable } from '@/db/schema';
import { sql, eq, desc } from 'drizzle-orm';
import {
  BASE_USDC_VAULTS,
  BASE_CHAIN_ID,
  ETHEREUM_CHAIN_ID,
} from '@/server/earn/base-vaults';
import { getBaseRpcUrl } from '@/lib/base-rpc-url';
import { createPublicClient, http, parseAbi, type Address } from 'viem';
import { base, mainnet } from 'viem/chains';

const ERC4626_VAULT_ABI = parseAbi([
  'function convertToAssets(uint256 shares) view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
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

async function getShareBalance(
  vaultAddress: string,
  safeAddress: string,
): Promise<bigint> {
  const chainId = getVaultChainId(vaultAddress);
  const client = getClientForChain(chainId);
  return client.readContract({
    address: vaultAddress as Address,
    abi: ERC4626_VAULT_ABI,
    functionName: 'balanceOf',
    args: [safeAddress as Address],
  });
}

function formatUsd(amount: bigint, decimals = 6) {
  const divided = Number(amount) / 10 ** decimals;
  return `$${divided.toFixed(4)}`;
}

async function diagnoseSafe(safeAddress: string, email?: string) {
  console.log('\n' + '='.repeat(80));
  console.log(`Diagnosing safe: ${safeAddress}`);
  if (email) {
    console.log(`User: ${email}`);
  }
  console.log('='.repeat(80));

  // Get all vaults this safe has interacted with
  const vaultAddresses = new Set<string>();

  const deposits = await db.query.earnDeposits.findMany({
    where: (table, { eq }) => eq(table.safeAddress, safeAddress),
    orderBy: (table, { desc }) => desc(table.timestamp),
  });

  const withdrawals = await db.query.earnWithdrawals.findMany({
    where: (table, { eq }) => eq(table.safeAddress, safeAddress),
  });

  deposits.forEach((d) => vaultAddresses.add(d.vaultAddress));
  withdrawals.forEach((w) => vaultAddresses.add(w.vaultAddress));

  if (vaultAddresses.size === 0) {
    console.log('No vault interactions found for this safe.');
    return;
  }

  for (const vaultAddress of vaultAddresses) {
    const vaultConfig = BASE_USDC_VAULTS.find(
      (v) => v.address.toLowerCase() === vaultAddress.toLowerCase(),
    );

    console.log(`\n📊 Vault: ${vaultConfig?.name || vaultAddress}`);
    console.log('-'.repeat(60));

    // Filter deposits/withdrawals for this vault
    const vaultDeposits = deposits.filter(
      (d) => d.vaultAddress === vaultAddress,
    );
    const vaultWithdrawals = withdrawals.filter(
      (w) => w.vaultAddress === vaultAddress,
    );

    // Calculate totals
    let totalDeposited = 0n;
    let totalWithdrawn = 0n;
    let ledgerShares = 0n;

    console.log('\n📥 Deposits:');
    if (vaultDeposits.length === 0) {
      console.log('  No deposits found');
    } else {
      for (const deposit of vaultDeposits) {
        const depositAmount = BigInt(deposit.assetsDeposited);
        const depositShares = BigInt(deposit.sharesReceived);
        totalDeposited += depositAmount;
        ledgerShares += depositShares;
        console.log(`  • ${new Date(deposit.timestamp).toISOString()}`);
        console.log(`    Assets: ${formatUsd(depositAmount)}`);
        console.log(`    Shares: ${depositShares}`);
        console.log(`    TX: ${deposit.depositTxHash}`);
      }
    }

    console.log('\n📤 Withdrawals:');
    if (vaultWithdrawals.length === 0) {
      console.log('  No withdrawals found');
    } else {
      for (const withdrawal of vaultWithdrawals) {
        const withdrawnAmount = BigInt(withdrawal.assetsWithdrawn);
        const burnedShares = BigInt(withdrawal.sharesBurned);
        totalWithdrawn += withdrawnAmount;
        ledgerShares -= burnedShares;
        console.log(`  • ${new Date(withdrawal.timestamp).toISOString()}`);
        console.log(`    Assets: ${formatUsd(withdrawnAmount)}`);
        console.log(`    Shares: ${burnedShares}`);
        console.log(`    TX: ${withdrawal.withdrawalTxHash}`);
      }
    }

    // Get on-chain data
    console.log('\n🔗 On-chain verification:');
    try {
      const onChainShares = await getShareBalance(vaultAddress, safeAddress);
      const currentAssets = await getCurrentAssets(vaultAddress, onChainShares);
      const ledgerAssets = await getCurrentAssets(vaultAddress, ledgerShares);

      console.log(`  On-chain shares: ${onChainShares}`);
      console.log(`  Ledger shares:   ${ledgerShares}`);
      console.log(`  Share difference: ${onChainShares - ledgerShares}`);

      console.log('\n💰 Financial summary:');
      console.log(`  Total deposited:    ${formatUsd(totalDeposited)}`);
      console.log(`  Total withdrawn:    ${formatUsd(totalWithdrawn)}`);
      console.log(
        `  Ledger principal:   ${formatUsd(totalDeposited - totalWithdrawn)}`,
      );
      console.log(`  Current assets (on-chain): ${formatUsd(currentAssets)}`);
      console.log(`  Current assets (ledger):  ${formatUsd(ledgerAssets)}`);

      const onChainYield = currentAssets - (totalDeposited - totalWithdrawn);
      const ledgerYield = ledgerAssets - (totalDeposited - totalWithdrawn);

      console.log('\n📈 Yield calculation:');
      console.log(
        `  Yield (using on-chain shares): ${formatUsd(onChainYield)}`,
      );
      console.log(`  Yield (using ledger shares):   ${formatUsd(ledgerYield)}`);

      if (onChainYield < 0n) {
        console.log('\n⚠️  WARNING: Negative yield detected!');
        console.log(
          '  This indicates the ledger principal exceeds actual assets.',
        );
        console.log('  Possible causes:');
        console.log('  1. Missing share records in deposits');
        console.log('  2. Duplicate deposit records');
        console.log('  3. Incorrect asset amounts');
      }

      if (ledgerShares !== onChainShares) {
        console.log('\n⚠️  WARNING: Share mismatch!');
        console.log('  The ledger shares do not match on-chain shares.');
        console.log('  This needs investigation and correction.');
      }
    } catch (error) {
      console.error('  Error fetching on-chain data:', error);
    }
  }
}

async function main() {
  const targetEmail = process.argv[2] || 'benjamin.shafii@gmail.com';

  console.log(`🔍 Diagnosing earnings for: ${targetEmail}`);

  // Find user profile
  const userProfile = await db.query.userProfilesTable.findFirst({
    where: (table, { eq }) => eq(table.email, targetEmail),
  });

  if (!userProfile) {
    console.log(`User not found with email: ${targetEmail}`);
    process.exit(1);
  }

  if (!userProfile.primarySafeAddress) {
    console.log('User has no primary safe address');
    process.exit(1);
  }

  await diagnoseSafe(userProfile.primarySafeAddress, targetEmail);

  console.log('\n' + '='.repeat(80));
  console.log('Diagnosis complete.');
  console.log('='.repeat(80));
  process.exit(0);
}

main().catch((err) => {
  console.error('Diagnosis failed:', err);
  process.exit(1);
});
