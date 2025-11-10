/**
 * Audit Script: Check which users need Safe deployed on Arbitrum
 *
 * This script:
 * 1. Queries all Safes with deposits to Arbitrum vaults
 * 2. Checks if each Safe exists on Arbitrum
 * 3. Reports which Safes need deployment
 */

import { db } from '../src/db';
import { earnDeposits } from '../src/db/schema';
import { checkSafeExists } from '../src/lib/safe-multi-chain';
import {
  ARBITRUM_MORPHO_VAULTS,
  ARBITRUM_CHAIN_ID,
} from '../src/server/earn/cross-chain-vaults';
import { getAddress, formatUnits } from 'viem';

async function main() {
  console.log('=== Arbitrum Safe Deployment Audit ===\n');

  // 1. Get Arbitrum vault addresses
  const arbitrumVaultAddresses = ARBITRUM_MORPHO_VAULTS.map((v) =>
    v.address.toLowerCase()
  );

  console.log('Arbitrum vaults:', arbitrumVaultAddresses);
  console.log('');

  // 2. Get all deposits to Arbitrum vaults
  console.log('Querying database for Safes with Arbitrum deposits...');

  const allDeposits = await db.select().from(earnDeposits);

  const deposits = allDeposits.filter((d) =>
    arbitrumVaultAddresses.includes(d.vaultAddress.toLowerCase())
  );

  if (deposits.length === 0) {
    console.log('✅ No deposits to Arbitrum vaults found.');
    return;
  }

  console.log(`Found ${deposits.length} deposit(s) to Arbitrum vaults\n`);

  // 3. Get unique Safe addresses
  const uniqueSafes = Array.from(
    new Set(deposits.map((d) => d.safeAddress.toLowerCase()))
  ).map((addr) => getAddress(addr as `0x${string}`));

  console.log(`Unique Safe addresses: ${uniqueSafes.length}\n`);

  // 4. Check each Safe
  const results = [];

  for (const safeAddress of uniqueSafes) {
    console.log(`Checking Safe: ${safeAddress}...`);

    const exists = await checkSafeExists(safeAddress, ARBITRUM_CHAIN_ID);

    const safeDeposits = deposits.filter(
      (d) => d.safeAddress.toLowerCase() === safeAddress.toLowerCase()
    );

    const totalDeposited = safeDeposits.reduce((sum, d) => {
      const assets = formatUnits(BigInt(d.assetsDeposited), d.assetDecimals);
      return sum + parseFloat(assets);
    }, 0);

    results.push({
      safeAddress,
      exists,
      depositCount: safeDeposits.length,
      totalDeposited,
    });

    console.log(
      exists
        ? `  ✅ Exists on Arbitrum`
        : `  ❌ Does NOT exist on Arbitrum`
    );
    console.log(`  Deposits: ${safeDeposits.length}`);
    console.log(`  Total deposited: $${totalDeposited.toFixed(2)}\n`);
  }

  // 4. Summary
  console.log('=== Summary ===\n');

  const needsDeployment = results.filter((r) => !r.exists);
  const alreadyDeployed = results.filter((r) => r.exists);

  console.log(`Total Safes checked: ${results.length}`);
  console.log(`Already deployed on Arbitrum: ${alreadyDeployed.length}`);
  console.log(`Need deployment: ${needsDeployment.length}\n`);

  if (needsDeployment.length > 0) {
    console.log('Safes that need deployment:');
    for (const safe of needsDeployment) {
      console.log(
        `  - ${safe.safeAddress} (${safe.depositCount} deposits, $${safe.totalDeposited.toFixed(2)})`
      );
    }
    console.log('');

    const totalNeedingDeployment = needsDeployment.length;
    const estimatedCost = totalNeedingDeployment * 1.0; // $1 per Safe
    console.log(`Estimated deployment cost: $${estimatedCost.toFixed(2)} USD`);
  } else {
    console.log('✅ All Safes are already deployed on Arbitrum!');
  }

  console.log('\n=== Audit Complete ===');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error running audit:', error);
    process.exit(1);
  });
