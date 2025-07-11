#!/usr/bin/env tsx

/**
 * Cleanup script to identify and fix deposits that were incorrectly swept from vault withdrawals
 * 
 * This script:
 * 1. Finds all incoming deposits that have vault addresses as the fromAddress
 * 2. Marks them as swept to prevent future auto-sweeping
 * 3. Optionally removes them from the database if they haven't been swept yet
 */

import { db } from '@/db';
import { incomingDeposits, earnDeposits } from '@/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { formatUnits } from 'viem';
import { USDC_DECIMALS } from '@/lib/constants';

async function cleanupVaultWithdrawalSweeps() {
  console.log('🔍 Starting cleanup of vault withdrawal sweeps...');
  
  // Step 1: Get all vault addresses from earnDeposits
  const allVaultAddresses = await db.query.earnDeposits.findMany({
    columns: { vaultAddress: true },
  });
  
  const uniqueVaultAddresses = [...new Set(allVaultAddresses.map(v => v.vaultAddress.toLowerCase()))];
  console.log(`📊 Found ${uniqueVaultAddresses.length} unique vault addresses`);
  
  // Step 2: Find all incoming deposits that have vault addresses as fromAddress
  const problematicDeposits = await db.query.incomingDeposits.findMany({
    where: inArray(incomingDeposits.fromAddress, uniqueVaultAddresses as any),
  });
  
  console.log(`🚨 Found ${problematicDeposits.length} problematic deposits from vault addresses`);
  
  if (problematicDeposits.length === 0) {
    console.log('✅ No problematic deposits found. Database is clean!');
    return;
  }
  
  // Step 3: Categorize the problematic deposits
  const unsweptDeposits = problematicDeposits.filter(d => !d.swept);
  const sweptDeposits = problematicDeposits.filter(d => d.swept);
  
  console.log(`📋 Breakdown:`);
  console.log(`  - Unswept deposits (will be marked as swept): ${unsweptDeposits.length}`);
  console.log(`  - Already swept deposits (will be logged): ${sweptDeposits.length}`);
  
  // Step 4: Mark unswept deposits as swept to prevent future auto-sweeping
  if (unsweptDeposits.length > 0) {
    console.log('\n🔧 Marking unswept vault withdrawals as swept...');
    
    for (const deposit of unsweptDeposits) {
      console.log(`  - Marking ${formatUnits(deposit.amount, USDC_DECIMALS)} USDC from ${deposit.fromAddress} (tx: ${deposit.txHash})`);
      
      await db.update(incomingDeposits)
        .set({ 
          swept: true,
          sweptAmount: 0n, // No amount was actually swept
          sweptPercentage: 0,
          sweptAt: new Date(),
          metadata: {
            ...deposit.metadata,
            isVaultWithdrawal: true,
            cleanupAction: 'marked_as_swept_vault_withdrawal',
            cleanupDate: new Date().toISOString(),
          },
        })
        .where(eq(incomingDeposits.id, deposit.id));
    }
    
    console.log(`✅ Successfully marked ${unsweptDeposits.length} deposits as swept`);
  }
  
  // Step 5: Log already swept deposits for review
  if (sweptDeposits.length > 0) {
    console.log('\n⚠️  Already swept deposits from vault withdrawals:');
    
    for (const deposit of sweptDeposits) {
      console.log(`  - ${formatUnits(deposit.amount, USDC_DECIMALS)} USDC from ${deposit.fromAddress}`);
      console.log(`    Original: ${formatUnits(deposit.amount, USDC_DECIMALS)} USDC`);
      console.log(`    Swept: ${deposit.sweptAmount ? formatUnits(deposit.sweptAmount, USDC_DECIMALS) : '0'} USDC`);
      console.log(`    Tx: ${deposit.txHash}`);
      console.log(`    Sweep Tx: ${deposit.sweptTxHash || 'N/A'}`);
      console.log('');
    }
    
    console.log(`📊 Total incorrectly swept amount: ${formatUnits(
      sweptDeposits.reduce((sum, d) => sum + (d.sweptAmount || 0n), 0n),
      USDC_DECIMALS
    )} USDC`);
  }
  
  // Step 6: Summary
  console.log('\n📊 Cleanup Summary:');
  console.log(`  - Total problematic deposits found: ${problematicDeposits.length}`);
  console.log(`  - Unswept deposits marked as swept: ${unsweptDeposits.length}`);
  console.log(`  - Already swept deposits (review needed): ${sweptDeposits.length}`);
  console.log('');
  console.log('✅ Cleanup completed successfully!');
  console.log('');
  console.log('🔮 Future auto-sweep runs will now correctly filter out vault withdrawals.');
}

// Run the cleanup
cleanupVaultWithdrawalSweeps()
  .then(() => {
    console.log('🎉 Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }); 