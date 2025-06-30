#!/usr/bin/env tsx
import { db } from '../src/db';
import { autoEarnConfigs, userSafes, allocationStates, earnDeposits } from '../src/db/schema';
import { eq, and } from 'drizzle-orm';
import { formatUnits } from 'viem';

// Test script to check auto-earn setup and simulate deposits
async function testAutoEarn() {
  console.log('🔍 Auto-Earn Test Script\n');
  
  // 1. Check all auto-earn configs
  console.log('📋 Active Auto-Earn Configurations:');
  const configs = await db.select().from(autoEarnConfigs);
  
  if (configs.length === 0) {
    console.log('❌ No auto-earn configs found. Set one up at /dashboard/savings');
    return;
  }
  
  for (const config of configs) {
    console.log(`\n👤 User: ${config.userDid}`);
    console.log(`   Safe: ${config.safeAddress}`);
    console.log(`   Percentage: ${config.pct}%`);
    console.log(`   Last Trigger: ${config.lastTrigger || 'Never'}`);
    
    // Check if module is enabled
    const safe = await db.query.userSafes.findFirst({
      where: and(
        eq(userSafes.userDid, config.userDid),
        eq(userSafes.safeAddress, config.safeAddress)
      )
    });
    
    console.log(`   Module Enabled: ${safe?.isEarnModuleEnabled ? '✅' : '❌'}`);
    
    // Check allocation state
    if (safe) {
      const allocState = await db.query.allocationStates.findFirst({
        where: eq(allocationStates.userSafeId, safe.id)
      });
      
      if (allocState) {
        const balance = BigInt(allocState.lastCheckedUSDCBalance || '0');
        console.log(`   Last USDC Balance: $${formatUnits(balance, 6)}`);
        console.log(`   Total Deposited: $${formatUnits(BigInt(allocState.totalDeposited || '0'), 6)}`);
      }
    }
  }
  
  // 2. Show recent deposits
  console.log('\n\n💰 Recent Auto-Earn Deposits:');
  const deposits = await db.select()
    .from(earnDeposits)
    .orderBy(earnDeposits.timestamp)
    .limit(10);
  
  if (deposits.length === 0) {
    console.log('No deposits yet');
  } else {
    for (const deposit of deposits) {
      console.log(`\n📅 ${deposit.timestamp.toLocaleString()}`);
      console.log(`   Amount: $${formatUnits(deposit.assetsDeposited, 6)} USDC`);
      console.log(`   Safe: ${deposit.safeAddress}`);
      console.log(`   Vault: ${deposit.vaultAddress}`);
      console.log(`   Tx: ${deposit.txHash}`);
    }
  }
  
  // 3. Simulate what would happen with a deposit
  console.log('\n\n🧪 Deposit Simulation:');
  const testDepositAmount = 100; // $100 USDC
  
  for (const config of configs) {
    const saveAmount = (testDepositAmount * config.pct) / 100;
    console.log(`\nIf ${config.safeAddress} receives $${testDepositAmount}:`);
    console.log(`   → $${saveAmount.toFixed(2)} would go to savings (${config.pct}%)`);
    console.log(`   → $${(testDepositAmount - saveAmount).toFixed(2)} would stay in main balance`);
  }
}

// Run the test
testAutoEarn()
  .then(() => {
    console.log('\n✅ Test complete');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  }); 