import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/db';
import { users, userProfilesTable } from '@/db/schema';
import { eq, and, isNull, isNotNull } from 'drizzle-orm';
import { loopsApi, LoopsEvent } from '@/server/services/loops-service';

// Helper to validate the cron key (to protect endpoint from unauthorized access)
function validateCronKey(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    console.warn('[kyc-notifications-cron] No authorization header provided');
    return false;
  }
  
  // In production, use a more secure validation method with a strong secret key
  // For development, accept any non-empty key
  return process.env.NODE_ENV === 'development' || authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

async function sendKycNotifications(): Promise<Array<{ userId: string; email: string; success: boolean; error?: string }>> {
  const results = [];
  
  try {
    // Find users who have completed KYC but haven't been sent the notification email
    // Using kycStatus='approved', kycMarkedDone=true, and loopsContactSynced=false
    const usersToNotify = await db.query.users.findMany({
      where: and(
        eq(users.kycStatus, 'approved'), // KYC is approved
        eq(users.kycMarkedDone, true), // User marked KYC as done
        eq(users.loopsContactSynced, false) // Haven't sent notification yet
      ),
      limit: 50, // Process up to 50 users per cron run
    });
    
    console.log(`[kyc-notifications-cron] Found ${usersToNotify.length} users to notify`);
    
    for (const user of usersToNotify) {
      try {
        // Get user profile to access email
        const userProfile = await db.query.userProfilesTable.findFirst({
          where: eq(userProfilesTable.privyDid, user.privyDid)
        });
        
        if (!userProfile?.email) {
          console.warn(`[kyc-notifications-cron] User ${user.privyDid} has no email address, skipping`);
          results.push({
            userId: user.privyDid,
            email: 'no-email',
            success: false,
            error: 'No email address'
          });
          continue;
        }
        
        console.log(`[kyc-notifications-cron] Sending KYC approved email to ${userProfile.email}`);
        
        // Send the KYC approved email via Loops
        const loopsResponse = await loopsApi.sendEvent(
          userProfile.email,
          LoopsEvent.KYC_APPROVED,
          user.privyDid,
          {
            kycStatus: user.kycStatus,
            kycProvider: user.kycProvider || 'unknown',
            businessName: userProfile.businessName || 'User',
            completedAt: new Date().toISOString(),
          }
        );
        
        if (loopsResponse.success) {
          // Mark as notified in database
          await db.update(users)
            .set({ 
              loopsContactSynced: true
            })
            .where(eq(users.privyDid, user.privyDid));
          
          console.log(`[kyc-notifications-cron] ✅ Successfully sent KYC notification to ${userProfile.email}`);
          results.push({
            userId: user.privyDid,
            email: userProfile.email,
            success: true
          });
        } else {
          console.error(`[kyc-notifications-cron] ❌ Failed to send KYC notification to ${userProfile.email}:`, loopsResponse.message);
          results.push({
            userId: user.privyDid,
            email: userProfile.email,
            success: false,
            error: loopsResponse.message || 'Unknown error'
          });
        }
        
        // Small delay between sends to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`[kyc-notifications-cron] Error processing user ${user.privyDid}:`, error);
        results.push({
          userId: user.privyDid,
          email: 'unknown',
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
  } catch (error) {
    console.error('[kyc-notifications-cron] Error querying users:', error);
    throw error;
  }
  
  return results;
}

export async function GET(req: NextRequest) {
  // Validate cron key for security (except in development)
  if (process.env.NODE_ENV !== 'development' && !validateCronKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[kyc-notifications-cron] Starting KYC notifications cron job...');
    
    const results = await sendKycNotifications();
    
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    
    console.log(`[kyc-notifications-cron] KYC notifications completed: ${successCount} success, ${failureCount} failures`);
    
    return NextResponse.json({
      success: true,
      message: 'KYC notifications cron job completed',
      summary: {
        totalProcessed: results.length,
        successCount,
        failureCount,
      },
      results,
    });
    
  } catch (error) {
    console.error('[kyc-notifications-cron] Failed to execute KYC notifications cron job:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to execute KYC notifications cron job',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 