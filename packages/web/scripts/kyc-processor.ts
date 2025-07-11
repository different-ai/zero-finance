import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
const envPath = process.env.NODE_ENV === 'production' 
  ? '.env.prod.local' 
  : '.env.local';
dotenv.config({ path: path.resolve(process.cwd(), envPath) });

/**
 * Manual KYC Processing Script
 * 
 * This script calls the comprehensive KYC processing API endpoint.
 * It can be used for:
 * - Manual testing in development
 * - Manual execution in production
 * - Debugging KYC processing issues
 * 
 * Usage:
 * - Development: pnpm --filter web exec tsx scripts/kyc-processor.ts
 * - Production: NODE_ENV=production pnpm --filter web exec tsx scripts/kyc-processor.ts
 */

async function runKycProcessor(): Promise<void> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3050';
  const endpoint = `${baseUrl}/api/cron/kyc-notifications`;
  
  console.log('🚀 Starting manual KYC processing...');
  console.log(`📍 Endpoint: ${endpoint}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('─'.repeat(50));

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add auth header for production
        ...(process.env.NODE_ENV === 'production' && process.env.CRON_SECRET && {
          'Authorization': `Bearer ${process.env.CRON_SECRET}`
        })
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    const result = await response.json();
    
    console.log('✅ KYC processing completed successfully!');
    console.log('─'.repeat(50));
    console.log('📊 Summary:');
    console.log(`   Total processed: ${result.summary.totalProcessed}`);
    console.log(`   Successful: ${result.summary.successCount}`);
    console.log(`   Failed: ${result.summary.failureCount}`);
    console.log(`   Status updates: ${result.summary.statusUpdatesCount}`);
    console.log(`   Notifications sent: ${result.summary.notificationsSentCount}`);
    console.log(`   No changes: ${result.summary.noChangeCount}`);
    
    if (result.results && result.results.length > 0) {
      console.log('─'.repeat(50));
      console.log('📋 Detailed Results:');
      
      result.results.forEach((r: any, i: number) => {
        const icon = r.success ? '✅' : '❌';
        const status = r.oldStatus && r.newStatus ? ` (${r.oldStatus} → ${r.newStatus})` : '';
        console.log(`   ${i + 1}. ${icon} ${r.action} - ${r.email}${status}`);
        if (r.error) {
          console.log(`      Error: ${r.error}`);
        }
      });
    }
    
    console.log('─'.repeat(50));
    console.log('🎉 Processing completed!');
    
  } catch (error) {
    console.error('❌ KYC processing failed:');
    console.error(error instanceof Error ? error.message : String(error));
    console.log('─'.repeat(50));
    
    if (error instanceof Error && error.message.includes('HTTP 401')) {
      console.log('💡 Tip: Make sure CRON_SECRET is set correctly for production');
    } else if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      console.log('💡 Tip: Make sure the Next.js server is running on the expected port');
    }
    
    process.exit(1);
  }
}

// Allow both direct execution and importing
if (require.main === module) {
  runKycProcessor()
    .then(() => {
      console.log('🏁 Script execution completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script execution failed:', error);
      process.exit(1);
    });
}

export { runKycProcessor }; 