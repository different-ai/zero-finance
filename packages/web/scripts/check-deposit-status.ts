#!/usr/bin/env tsx
/**
 * Quick Deposit Status Checker
 *
 * Checks your Safe's USDC balance and vault position on both chains.
 *
 * Usage:
 *   pnpm --filter @zero-finance/web tsx scripts/check-deposit-status.ts <safe-address>
 *
 * Example:
 *   pnpm --filter @zero-finance/web tsx scripts/check-deposit-status.ts 0x341Eb50366F22161C90EDD4505d2916Ae275595e
 */

import { createPublicClient, http, formatUnits, type Address } from 'viem';
import { base, arbitrum } from 'viem/chains';

const MORPHO_VAULT = '0x7e97fa6893871A2751B5fE961978DCCb2c201E65';
const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const USDC_ARBITRUM = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';

async function checkStatus(safeAddress: string) {
  console.log('🔍 Cross-Chain Deposit Status Check\n');
  console.log('Safe:', safeAddress);
  console.log('═'.repeat(70) + '\n');

  const baseClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  const arbitrumClient = createPublicClient({
    chain: arbitrum,
    transport: http(),
  });

  // Check Base USDC
  console.log('📍 BASE CHAIN');
  console.log('─'.repeat(70));

  const usdcBase = await baseClient.readContract({
    address: USDC_BASE,
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'balanceOf',
    args: [safeAddress as Address],
  });

  const usdcBaseFormatted = formatUnits(usdcBase, 6);
  console.log(`USDC in Safe: $${usdcBaseFormatted}`);

  if (Number(usdcBaseFormatted) > 0) {
    console.log('⚠️  WARNING: USDC still on Base - deposit may have failed!\n');
  } else {
    console.log('✅ No USDC on Base (expected after deposit)\n');
  }

  // Check Arbitrum
  console.log('📍 ARBITRUM CHAIN');
  console.log('─'.repeat(70));

  // USDC balance
  const usdcArbitrum = await arbitrumClient.readContract({
    address: USDC_ARBITRUM,
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'balanceOf',
    args: [safeAddress as Address],
  });

  const usdcArbFormatted = formatUnits(usdcArbitrum, 6);
  console.log(`USDC in Safe: $${usdcArbFormatted}`);

  if (Number(usdcArbFormatted) > 0) {
    console.log(
      '⚠️  USDC on Arbitrum but NOT in vault - multicall may have failed!\n',
    );
  }

  // Vault shares
  const shares = await arbitrumClient.readContract({
    address: MORPHO_VAULT,
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'balanceOf',
    args: [safeAddress as Address],
  });

  console.log(`Vault Shares: ${shares.toString()}`);

  if (shares > 0n) {
    // Convert to assets
    const assets = await arbitrumClient.readContract({
      address: MORPHO_VAULT,
      abi: [
        {
          name: 'convertToAssets',
          type: 'function',
          stateMutability: 'view',
          inputs: [{ name: 'shares', type: 'uint256' }],
          outputs: [{ name: '', type: 'uint256' }],
        },
      ],
      functionName: 'convertToAssets',
      args: [shares],
    });

    const assetsFormatted = formatUnits(assets, 6);
    console.log(`Vault Balance: $${assetsFormatted} USDC`);
    console.log('\n🎉 SUCCESS! Funds are in the vault earning yield!\n');
  } else {
    console.log('Vault Balance: $0.00');
    console.log('\n❌ No funds in vault yet\n');
  }

  // Summary
  console.log('═'.repeat(70));
  console.log('📊 SUMMARY\n');

  const totalBase = Number(usdcBaseFormatted);
  const totalArb =
    Number(usdcArbFormatted) +
    Number(
      shares > 0n
        ? formatUnits(
            await arbitrumClient.readContract({
              address: MORPHO_VAULT,
              abi: [
                {
                  name: 'convertToAssets',
                  type: 'function',
                  stateMutability: 'view',
                  inputs: [{ name: 'shares', type: 'uint256' }],
                  outputs: [{ name: '', type: 'uint256' }],
                },
              ],
              functionName: 'convertToAssets',
              args: [shares],
            }),
            6,
          )
        : '0',
    );

  console.log(`Total on Base:     $${totalBase.toFixed(2)}`);
  console.log(`Total on Arbitrum: $${totalArb.toFixed(2)}`);
  console.log(`─────────────────────────────`);
  console.log(`Grand Total:       $${(totalBase + totalArb).toFixed(2)}\n`);

  if (shares === 0n && totalBase === 0 && totalArb === 0) {
    console.log('🤔 No funds found on either chain!');
    console.log('   Possible reasons:');
    console.log('   1. Deposit still processing (wait 60 seconds)');
    console.log('   2. Deposit transaction failed');
    console.log('   3. Wrong Safe address');
    console.log('\n   Next steps:');
    console.log('   → Check Base transaction on BaseScan');
    console.log(`   → https://basescan.org/address/${safeAddress}`);
    console.log(`   → https://arbiscan.io/address/${safeAddress}\n`);
  } else if (shares === 0n && totalArb > 0) {
    console.log('⚠️  USDC arrived on Arbitrum but not deposited to vault!');
    console.log('   → Check Arbiscan for failed transactions');
    console.log(`   → https://arbiscan.io/address/${safeAddress}\n`);
  } else if (shares > 0n) {
    console.log('✅ Everything looks good!');
    console.log(
      `   → View on Morpho: https://app.morpho.org/vault?vault=${MORPHO_VAULT}&network=arbitrum\n`,
    );
  }
}

const safeAddress = process.argv[2];

if (!safeAddress?.startsWith('0x')) {
  console.error(
    '❌ Usage: pnpm --filter @zero-finance/web tsx scripts/check-deposit-status.ts <safe-address>',
  );
  process.exit(1);
}

checkStatus(safeAddress).catch((err) => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
