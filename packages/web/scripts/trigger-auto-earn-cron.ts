#!/usr/bin/env tsx
/**
 * Manual trigger for auto-earn cron job
 * Usage: pnpm auto-earn:cron
 * 
 * This triggers the same endpoint that Vercel cron would call
 */

import 'dotenv/config';

async function triggerAutoEarnCron() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3050';
  const cronSecret = process.env.CRON_SECRET || 'dev-secret';
  
  console.log('🚀 Triggering auto-earn cron job...');
  console.log(`📍 URL: ${baseUrl}/api/cron/auto-earn`);
  
  try {
    const response = await fetch(`${baseUrl}/api/cron/auto-earn`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    
    console.log('✅ Auto-earn cron job completed successfully');
    console.log('📊 Results:', JSON.stringify(result, null, 2));
    
    if (result.results && result.results.length > 0) {
      console.log('\n📈 Summary:');
      result.results.forEach((r: any) => {
        if (r.error) {
          console.log(`  ❌ ${r.safeAddress}: ${r.error}`);
        } else if (r.depositTxHash) {
          console.log(`  ✅ ${r.safeAddress}: Swept ${r.amountSaved} USDC from deposit ${r.depositTxHash}`);
          console.log(`     Original: ${r.originalAmount} USDC → Sweep tx: ${r.sweepTxHash}`);
        } else {
          console.log(`  ✅ ${r.safeAddress}: Saved ${r.amountSaved} USDC (tx: ${r.txHash})`);
        }
      });
    } else {
      console.log('\n📊 No deposits to sweep');
    }
    
  } catch (error) {
    console.error('❌ Failed to trigger auto-earn cron job:', error);
    process.exit(1);
  }
}

// Run the trigger
triggerAutoEarnCron().then(() => {
  console.log('\n✨ Done!');
  process.exit(0);
}).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 