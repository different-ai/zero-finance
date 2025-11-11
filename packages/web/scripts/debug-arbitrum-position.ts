#!/usr/bin/env tsx
/**
 * Debug Arbitrum Vault Position
 *
 * Checks where your funds are in the cross-chain deposit flow.
 *
 * Usage:
 *   pnpm tsx scripts/debug-arbitrum-position.ts <safe-address>
 *
 * Example:
 *   pnpm tsx scripts/debug-arbitrum-position.ts 0x341Eb50366F22161C90EDD4505d2916Ae275595e
 */

import { createPublicClient, http, formatUnits, type Address } from 'viem';
import { base, arbitrum } from 'viem/chains';

const MORPHO_VAULT_ARBITRUM = '0x7e97fa6893871A2751B5fE961978DCCb2c201E65';
const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const USDC_ARBITRUM = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';
const ACROSS_SPOKE_POOL_BASE = '0x09aea4b2242abc8bb4bb78d537a67a245a7bec64';
const MORPHO_API = 'https://api.morpho.org/graphql';

const VAULT_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'convertToAssets',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'shares', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

async function queryMorphoAPI(safeAddress: string) {
  console.log('\n📊 Querying Morpho GraphQL API...\n');

  const query = `
    query GetUserVaultPosition($address: String!, $chainId: Int!) {
      vaultByAddress(address: "${MORPHO_VAULT_ARBITRUM}", chainId: $chainId) {
        address
        name
        symbol
        state {
          totalAssets
          totalAssetsUsd
          apy
          netApy
        }
      }
      
      # Query user position (if available)
      user(address: $address) {
        vaultPositions(where: { vaultAddress: "${MORPHO_VAULT_ARBITRUM}", chainId: $chainId }) {
          vault {
            address
            name
          }
          shares
          assets
          assetsUsd
        }
      }
    }
  `;

  try {
    const response = await fetch(MORPHO_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          address: safeAddress.toLowerCase(),
          chainId: 42161,
        },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error('❌ GraphQL Errors:', data.errors);
      return null;
    }

    return data.data;
  } catch (error) {
    console.error('❌ Error querying Morpho API:', error);
    return null;
  }
}

async function checkPosition(safeAddress: string) {
  console.log('🔍 Debugging Cross-Chain Deposit Position\n');
  console.log('Safe Address:', safeAddress);
  console.log('Morpho Vault:', MORPHO_VAULT_ARBITRUM);
  console.log('─'.repeat(60));

  // Create clients
  const baseClient = createPublicClient({
    chain: base,
    transport: http(
      process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
    ),
  });

  const arbitrumClient = createPublicClient({
    chain: arbitrum,
    transport: http(
      process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL ||
        'https://arb1.arbitrum.io/rpc',
    ),
  });

  console.log('\n1️⃣  Checking USDC Balance on Base (Source Chain)...\n');

  try {
    const usdcBalanceBase = await baseClient.readContract({
      address: USDC_BASE,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [safeAddress as Address],
    });

    console.log(
      '   USDC in Safe on Base:',
      `$${formatUnits(usdcBalanceBase, 6)}`,
    );

    if (usdcBalanceBase > 0n) {
      console.log(
        '   ⚠️  You have USDC on Base - did the deposit transaction succeed?',
      );
    }
  } catch (error) {
    console.error('   ❌ Error reading Base USDC:', error);
  }

  console.log(
    '\n2️⃣  Checking USDC Balance on Arbitrum (Destination Chain)...\n',
  );

  try {
    const usdcBalanceArbitrum = await arbitrumClient.readContract({
      address: USDC_ARBITRUM,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [safeAddress as Address],
    });

    console.log(
      '   USDC in Safe on Arbitrum:',
      `$${formatUnits(usdcBalanceArbitrum, 6)}`,
    );

    if (usdcBalanceArbitrum > 0n) {
      console.log('   ⚠️  USDC is on Arbitrum but NOT in the vault!');
      console.log('   → The multicall deposit might have failed.');
      console.log('   → Check Arbiscan for failed transactions.');
    }
  } catch (error) {
    console.error('   ❌ Error reading Arbitrum USDC:', error);
  }

  console.log('\n3️⃣  Checking Morpho Vault Position on Arbitrum...\n');

  try {
    // Get vault shares
    const shares = await arbitrumClient.readContract({
      address: MORPHO_VAULT_ARBITRUM,
      abi: VAULT_ABI,
      functionName: 'balanceOf',
      args: [safeAddress as Address],
    });

    console.log('   Vault Shares:', shares.toString());

    if (shares > 0n) {
      // Convert to assets (USDC)
      const assets = await arbitrumClient.readContract({
        address: MORPHO_VAULT_ARBITRUM,
        abi: VAULT_ABI,
        functionName: 'convertToAssets',
        args: [shares],
      });

      console.log('   Vault Balance:', `$${formatUnits(assets, 6)} USDC`);
      console.log(
        '   ✅ SUCCESS! Your funds are in the vault and earning yield!',
      );
    } else {
      console.log('   ❌ No shares found - funds are NOT in the vault yet');
    }
  } catch (error) {
    console.error('   ❌ Error reading vault position:', error);
  }

  // Query Morpho GraphQL API
  const morphoData = await queryMorphoAPI(safeAddress);

  if (morphoData) {
    console.log('\n4️⃣  Morpho API Data...\n');

    if (morphoData.vaultByAddress) {
      const vault = morphoData.vaultByAddress;
      console.log('   Vault Info:');
      console.log('   - Name:', vault.name);
      console.log('   - Symbol:', vault.symbol);
      console.log(
        '   - Total Assets:',
        `$${vault.state.totalAssetsUsd.toLocaleString()}`,
      );
      console.log('   - APY:', `${(vault.state.netApy * 100).toFixed(2)}%`);
    }

    if (morphoData.user?.vaultPositions?.length > 0) {
      const position = morphoData.user.vaultPositions[0];
      console.log('\n   Your Position (from API):');
      console.log('   - Shares:', position.shares);
      console.log('   - Assets:', `$${position.assetsUsd.toFixed(2)}`);
      console.log('   ✅ Position confirmed via Morpho API!');
    } else {
      console.log('\n   ⚠️  No position found in Morpho API');
      console.log('   → API might be indexing (can take 1-2 minutes)');
    }
  }

  console.log('\n' + '─'.repeat(60));
  console.log('\n📝 Summary & Next Steps:\n');

  console.log('If funds are NOT in the vault after 2+ minutes:');
  console.log('1. Check Base transaction on BaseScan');
  console.log('2. Check Arbitrum transactions on Arbiscan');
  console.log('3. Look for failed transactions or reverts');
  console.log('4. Check if USDC is stuck in Safe on Arbitrum (not deposited)');
  console.log('5. Contact support with transaction hashes\n');

  console.log('Useful Links:');
  console.log(`• Base Safe: https://basescan.org/address/${safeAddress}`);
  console.log(`• Arbitrum Safe: https://arbiscan.io/address/${safeAddress}`);
  console.log(
    `• Morpho Vault: https://app.morpho.org/vault?vault=${MORPHO_VAULT_ARBITRUM}&network=arbitrum`,
  );
  console.log(`• Morpho API Playground: https://api.morpho.org/graphql\n`);
}

// CLI entry point
const safeAddress = process.argv[2];

if (!safeAddress || !safeAddress.startsWith('0x')) {
  console.error(
    '❌ Usage: pnpm tsx scripts/debug-arbitrum-position.ts <safe-address>',
  );
  console.error(
    '   Example: pnpm tsx scripts/debug-arbitrum-position.ts 0x341Eb50366F22161C90EDD4505d2916Ae275595e',
  );
  process.exit(1);
}

checkPosition(safeAddress).catch(console.error);
