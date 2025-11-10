#!/usr/bin/env tsx
/**
 * Debug script to check Arbitrum Morpho vault positions
 * 
 * Usage:
 *   cd packages/web
 *   npx tsx scripts/check-arbitrum-position.ts 0xYourSafeAddress
 */

import { createPublicClient, http, formatUnits, parseAbi } from 'viem';
import { arbitrum } from 'viem/chains';

const VAULT_ADDRESS = '0x7e97fa6893871A2751B5fE961978DCCb2c201E65' as const;
const VAULT_NAME = 'Morpho Gauntlet USDC Core (Arbitrum)';

const ERC4626_ABI = parseAbi([
  'function balanceOf(address owner) external view returns (uint256)',
  'function convertToAssets(uint256 shares) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
  'function asset() external view returns (address)',
  'function name() external view returns (string)',
]);

async function checkPosition(safeAddress: string) {
  console.log('='.repeat(60));
  console.log('ARBITRUM MORPHO VAULT POSITION CHECKER');
  console.log('='.repeat(60));
  console.log(`Vault: ${VAULT_NAME}`);
  console.log(`Vault Address: ${VAULT_ADDRESS}`);
  console.log(`Safe Address: ${safeAddress}`);
  console.log('='.repeat(60));

  const rpcUrl = process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || 
                 process.env.ARBITRUM_RPC_URL || 
                 'https://arb1.arbitrum.io/rpc';

  console.log(`RPC URL: ${rpcUrl}`);
  console.log('');

  const client = createPublicClient({
    chain: arbitrum,
    transport: http(rpcUrl),
  });

  try {
    // Get vault name to verify contract is working
    console.log('📡 Checking vault contract...');
    const vaultName = await client.readContract({
      address: VAULT_ADDRESS,
      abi: ERC4626_ABI,
      functionName: 'name',
    });
    console.log(`✅ Vault name: ${vaultName}`);
    console.log('');

    // Get underlying asset
    console.log('📡 Checking underlying asset...');
    const assetAddress = await client.readContract({
      address: VAULT_ADDRESS,
      abi: ERC4626_ABI,
      functionName: 'asset',
    });
    console.log(`✅ Asset: ${assetAddress} (should be USDC)`);
    console.log('');

    // Get decimals
    console.log('📡 Checking decimals...');
    const decimals = await client.readContract({
      address: VAULT_ADDRESS,
      abi: ERC4626_ABI,
      functionName: 'decimals',
    });
    console.log(`✅ Decimals: ${decimals} (should be 6 for USDC)`);
    console.log('');

    // Get shares balance
    console.log('📡 Checking your shares balance...');
    const shares = await client.readContract({
      address: VAULT_ADDRESS,
      abi: ERC4626_ABI,
      functionName: 'balanceOf',
      args: [safeAddress as `0x${string}`],
    });
    console.log(`✅ Shares: ${shares.toString()}`);
    
    if (shares === 0n) {
      console.log('');
      console.log('⚠️  WARNING: Your Safe has ZERO shares in this vault!');
      console.log('');
      console.log('This means either:');
      console.log('1. You haven\'t deposited yet');
      console.log('2. You deposited from a different Safe address');
      console.log('3. Your transaction is still pending');
      console.log('');
      console.log('Check on Arbiscan: https://arbiscan.io/address/' + safeAddress);
      console.log('');
      process.exit(0);
    }

    console.log('');

    // Convert shares to assets
    console.log('📡 Converting shares to assets...');
    const assets = await client.readContract({
      address: VAULT_ADDRESS,
      abi: ERC4626_ABI,
      functionName: 'convertToAssets',
      args: [shares],
    });
    console.log(`✅ Assets: ${assets.toString()} (raw)`);
    console.log('');

    // Calculate USD value
    const balanceUsd = Number(formatUnits(assets, decimals));
    console.log('='.repeat(60));
    console.log('POSITION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Shares: ${formatUnits(shares, decimals)}`);
    console.log(`Assets: ${formatUnits(assets, decimals)} USDC`);
    console.log(`Value: $${balanceUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`);
    console.log('='.repeat(60));
    console.log('');
    console.log('✅ SUCCESS! Your position is on-chain.');
    console.log('');
    console.log('If this doesn\'t show in the UI:');
    console.log('1. Check browser console for errors');
    console.log('2. Hard refresh the page (Cmd+Shift+R)');
    console.log('3. Wait 30 seconds for auto-refresh');
    console.log('4. Check server logs for tRPC errors');
    console.log('');
    console.log('See CROSS_CHAIN_BALANCE_DEBUG_GUIDE.md for more help.');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ ERROR:', error);
    console.error('');
    console.error('Possible causes:');
    console.error('1. RPC endpoint is down or rate-limited');
    console.error('2. Invalid Safe address format');
    console.error('3. Network connectivity issues');
    console.error('');
    console.error('Try:');
    console.error('- Setting ARBITRUM_RPC_URL in .env.local');
    console.error('- Using Alchemy/Infura RPC endpoint');
    console.error('- Checking internet connection');
    console.error('');
    process.exit(1);
  }
}

const safeAddress = process.argv[2];

if (!safeAddress) {
  console.error('Usage: npx tsx scripts/check-arbitrum-position.ts 0xYourSafeAddress');
  process.exit(1);
}

if (!safeAddress.startsWith('0x') || safeAddress.length !== 42) {
  console.error('Error: Invalid Safe address format. Must be 0x... (42 characters)');
  process.exit(1);
}

checkPosition(safeAddress);
