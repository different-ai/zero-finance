import { db } from '@/db';
import { autoEarnConfigs } from '@/db/schema';
import { createPublicClient, getAddress, http } from 'viem';
import { base } from 'viem/chains';
import { NextResponse } from 'next/server';
import { eq, and, gte, sql } from 'drizzle-orm';

// Constants
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const USDC_DECIMALS = 6;
const MIN_PROCESSING_AMOUNT = 5_000_000n; // 5 USDC in base units (minimum to process)
const RATE_LIMIT_HOURS = 24; // Only process once per 24 hours per safe

// ABI for reading USDC balance
const SAFE_ABI = [
  {
    constant: true,
    inputs: [{ name: 'token', type: 'address' }],
    name: 'getBalance',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
] as const;

// Create public client
const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL || 'https://mainnet.base.org'),
});

// Helper to validate the cron key (to protect endpoint from unauthorized access)
function validateCronKey(req: Request): boolean {
  const cronKey = req.headers.get('x-cron-key');
  if (!cronKey) {
    console.warn('No cron key provided');
    return false;
  }
  
  // In production, use a more secure validation method with a strong secret key
  // For development, accept any non-empty key
  return process.env.NODE_ENV === 'development' || cronKey === process.env.CRON_SECRET_KEY;
}

// Create our API route handler
export async function GET(req: Request) {
  // Validate cron key for security (except in development)
  if (process.env.NODE_ENV !== 'development' && !validateCronKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('🔄 Running auto-earn tick...');
    
    // Get all auto-earn configs, excluding those triggered in the last RATE_LIMIT_HOURS
    const now = new Date();
    const rateWindow = new Date(now.getTime() - RATE_LIMIT_HOURS * 60 * 60 * 1000);
    
    const configs = await db
      .select()
      .from(autoEarnConfigs)
      .where(
        sql`${autoEarnConfigs.lastTrigger} IS NULL OR ${autoEarnConfigs.lastTrigger} < ${rateWindow}`
      );

    console.log(`Found ${configs.length} configs eligible for processing`);
    
    // Process each config
    let processed = 0;
    let skipped = 0;
    let errors = 0;
    const errorDetails: Record<string, string> = {};

    for (const config of configs) {
      try {
        const { safeAddress, pct, userDid } = config;
        console.log(`Processing safe ${safeAddress} with pct ${pct}`);
        
        // Skip if percentage is 0 (auto-earn disabled)
        if (pct === 0) {
          console.log(`Skipping ${safeAddress} as pct is 0`);
          skipped++;
          continue;
        }
        
        // Get safe balance
        const balance = await publicClient.readContract({
          address: getAddress(safeAddress),
          abi: SAFE_ABI,
          functionName: 'getBalance',
          args: [getAddress(USDC_ADDRESS)],
        }) as bigint;
        
        console.log(`Safe ${safeAddress} USDC balance: ${balance}`);
        
        // Get earn stats from API
        // In production, construct an authenticated call to the API
        // For development, we directly fetch the data
        const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3050');
        
        // Call the stats API with proper authentication headers
        const stats = await fetch(`${baseUrl}/api/trpc/earn.stats?batch=1&input={"0":{"json":{"safeAddress":"${safeAddress}"}}}`, {
          headers: {
            'x-trpc-source': 'server',
            'Authorization': `Bearer ${process.env.INTERNAL_API_KEY || ''}`,
          },
        }).then(res => res.json());
        
        // Extract stats result
        const statsResult = stats?.[0]?.result?.data?.json;
        
        // Calculate total assets in vault
        let vaultAssets = 0n;
        if (statsResult && Array.isArray(statsResult)) {
          vaultAssets = statsResult.reduce(
            (sum, stat) => sum + BigInt(stat.currentAssets.toString()),
            0n
          );
        }
        
        console.log(`Safe ${safeAddress} vault assets: ${vaultAssets}`);
        
        // Calculate total and target
        const totalAssets = balance + vaultAssets;
        const targetVaultAssets = totalAssets > 0n ? (totalAssets * BigInt(pct)) / 100n : 0n;
        
        // Calculate delta (amount to move)
        let deltaToTarget = targetVaultAssets > vaultAssets ? targetVaultAssets - vaultAssets : 0n;
        
        // Only process if delta is greater than minimum and safe has sufficient funds
        if (deltaToTarget < MIN_PROCESSING_AMOUNT) {
          console.log(`Skipping ${safeAddress} as delta ${deltaToTarget} is below minimum ${MIN_PROCESSING_AMOUNT}`);
          skipped++;
          continue;
        }
        
        // Ensure we don't try to move more than the safe balance
        if (deltaToTarget > balance) {
          console.log(`Adjusting delta ${deltaToTarget} to match safe balance ${balance}`);
          deltaToTarget = balance;
        }
        
        console.log(`Safe ${safeAddress} needs to move ${deltaToTarget} to vault`);
        
        // Call triggerAutoEarn API
        const triggerResponse = await fetch(`${baseUrl}/api/trpc/earn.triggerAutoEarn`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-trpc-source': 'server', 
            'Authorization': `Bearer ${process.env.INTERNAL_API_KEY || ''}`,
          },
          body: JSON.stringify({
            json: {
              tokenAddress: USDC_ADDRESS,
              amount: deltaToTarget.toString(),
              safeAddress,
              ctxUser: userDid, // Pass userDid to authenticate the call
            },
          }),
        });
        
        if (!triggerResponse.ok) {
          throw new Error(`triggerAutoEarn API returned ${triggerResponse.status}: ${await triggerResponse.text()}`);
        }
        
        const triggerResult = await triggerResponse.json();
        
        // Check if successful
        if (triggerResult?.result?.data?.json?.success) {
          // Update lastTrigger timestamp
          await db
            .update(autoEarnConfigs)
            .set({ lastTrigger: new Date() })
            .where(and(
              eq(autoEarnConfigs.userDid, userDid),
              eq(autoEarnConfigs.safeAddress, safeAddress),
            ));
            
          console.log(`Successfully triggered auto-earn for ${safeAddress}`);
          processed++;
        } else {
          const errorMsg = triggerResult?.error?.message || 'Unknown error';
          console.error(`Failed to trigger auto-earn for ${safeAddress}: ${errorMsg}`);
          errorDetails[safeAddress] = errorMsg;
          errors++;
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`Error processing config for ${config.safeAddress}:`, errorMsg);
        errorDetails[config.safeAddress] = errorMsg;
        errors++;
      }
    }
    
    return NextResponse.json({
      success: true,
      processed,
      skipped,
      errors,
      errorDetails,
      message: `Auto-earn tick completed. Processed: ${processed}, Skipped: ${skipped}, Errors: ${errors}`,
    });
  } catch (error) {
    console.error('Auto-earn tick failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Auto-earn tick failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 