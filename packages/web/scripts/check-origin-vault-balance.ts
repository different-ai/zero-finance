/**
 * Script to check Origin Super OETH vault balance and debug deposits
 *
 * Usage: npx tsx scripts/check-origin-vault-balance.ts <safe-address>
 */

import {
  createPublicClient,
  http,
  parseAbi,
  formatUnits,
  type Address,
} from 'viem';
import { base } from 'viem/chains';

// Origin Super OETH vault addresses on Base
const ORIGIN_VAULT_ADDRESS =
  '0x7FcD174E80f264448ebeE8c88a7C4476AAF58Ea6' as Address; // wsuperOETH (ERC4626)
const ORIGIN_ZAPPER_ADDRESS =
  '0x3b56c09543D3068f8488ED34e6F383c3854d2bC1' as Address;
const WETH_ADDRESS = '0x4200000000000000000000000000000000000006' as Address;
const SUPER_OETH_ADDRESS =
  '0xDBFeFD2e8460a6Ee4955A68582F85708BAEA60A3' as Address; // superOETH token

const client = createPublicClient({
  chain: base,
  transport: http(
    process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
  ),
});

const ERC20_ABI = parseAbi([
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
]);

const ERC4626_ABI = parseAbi([
  'function balanceOf(address) view returns (uint256)',
  'function convertToAssets(uint256 shares) view returns (uint256)',
  'function totalAssets() view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function asset() view returns (address)',
  'function decimals() view returns (uint8)',
]);

async function main() {
  const safeAddress = process.argv[2] as Address;

  if (!safeAddress) {
    console.error(
      'Usage: npx tsx scripts/check-origin-vault-balance.ts <safe-address>',
    );
    process.exit(1);
  }

  console.log('\n=== Origin Super OETH Vault Balance Check ===\n');
  console.log(`Safe Address: ${safeAddress}`);
  console.log(`Vault Address: ${ORIGIN_VAULT_ADDRESS}`);
  console.log(`Zapper Address: ${ORIGIN_ZAPPER_ADDRESS}\n`);

  // 1. Check Safe's native ETH balance
  const ethBalance = await client.getBalance({ address: safeAddress });
  console.log(`1. Safe ETH Balance: ${formatUnits(ethBalance, 18)} ETH`);

  // 2. Check Safe's WETH balance
  const wethBalance = await client.readContract({
    address: WETH_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [safeAddress],
  });
  console.log(`2. Safe WETH Balance: ${formatUnits(wethBalance, 18)} WETH`);

  // 3. Check Safe's superOETH balance (rebasing token)
  try {
    const superOethBalance = await client.readContract({
      address: SUPER_OETH_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [safeAddress],
    });
    console.log(
      `3. Safe superOETH Balance: ${formatUnits(superOethBalance, 18)} superOETH`,
    );
  } catch (e) {
    console.log(`3. Safe superOETH Balance: Error fetching`);
  }

  // 4. Check Safe's vault shares (wsuperOETH)
  const vaultShares = await client.readContract({
    address: ORIGIN_VAULT_ADDRESS,
    abi: ERC4626_ABI,
    functionName: 'balanceOf',
    args: [safeAddress],
  });
  console.log(
    `4. Safe Vault Shares (wsuperOETH): ${formatUnits(vaultShares, 18)}`,
  );

  // 5. Convert shares to underlying assets
  if (vaultShares > 0n) {
    const assetsFromShares = await client.readContract({
      address: ORIGIN_VAULT_ADDRESS,
      abi: ERC4626_ABI,
      functionName: 'convertToAssets',
      args: [vaultShares],
    });
    console.log(
      `5. Shares converted to assets: ${formatUnits(assetsFromShares, 18)} superOETH`,
    );

    // Estimate USD value (rough)
    const ethPrice = 3000; // Placeholder
    const usdValue = parseFloat(formatUnits(assetsFromShares, 18)) * ethPrice;
    console.log(`   Estimated USD value: $${usdValue.toFixed(2)}`);
  } else {
    console.log(`5. No vault shares - nothing deposited yet`);
  }

  // 6. Check vault total assets
  const totalAssets = await client.readContract({
    address: ORIGIN_VAULT_ADDRESS,
    abi: ERC4626_ABI,
    functionName: 'totalAssets',
  });
  console.log(
    `\n6. Vault Total Assets: ${formatUnits(totalAssets, 18)} superOETH`,
  );

  // 7. Check what asset the vault uses
  const underlyingAsset = await client.readContract({
    address: ORIGIN_VAULT_ADDRESS,
    abi: ERC4626_ABI,
    functionName: 'asset',
  });
  console.log(`7. Vault Underlying Asset: ${underlyingAsset}`);

  // 8. Recent transactions check hint
  console.log(`\n=== Debug Info ===`);
  console.log(`Check recent transactions on BaseScan:`);
  console.log(`https://basescan.org/address/${safeAddress}#tokentxns`);
  console.log(`\nLook for:`);
  console.log(`- ETH transfers to Zapper (${ORIGIN_ZAPPER_ADDRESS})`);
  console.log(`- wsuperOETH mints from vault (${ORIGIN_VAULT_ADDRESS})`);
}

main().catch(console.error);
