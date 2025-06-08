import { db } from '@/db';
import { users } from '@/db/schema';
import { alignApi } from '@/server/services/align-api';
import { eq, sql } from 'drizzle-orm';
import { NextResponse, type NextRequest } from 'next/server';
import { retryWithBackoff, getCachedResponse, setCachedResponse } from '@/server/services/retry-service';

function validateCronKey(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    console.warn('KYC Sync: No authorization header provided');
    return false;
  }
  return process.env.NODE_ENV === 'development' || authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development' && !validateCronKey(req)) {
    console.log('KYC Sync: Unauthorized attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('KYC Sync: Starting KYC status synchronization.');

  try {
    const usersToSync = await db
      .select()
      .from(users)
      .where(sql`${users.alignCustomerId} IS NOT NULL`);

    console.log(`KYC Sync: Found ${usersToSync.length} users with Align Customer IDs to check.`);

    let updatedCount = 0;
    const errorsEncountered: { userId: string; error: string }[] = [];

    for (const user of usersToSync) {
      try {
        if (!user.alignCustomerId) {
          console.warn(`KYC Sync: User ${user.privyDid} has NULL alignCustomerId in the loop, skipping.`);
          continue;
        }
        console.log(`KYC Sync: Processing user ${user.privyDid} (Align ID: ${user.alignCustomerId})`);
        
        const cacheKey = `align_customer_${user.alignCustomerId}`;
        let customer = getCachedResponse(cacheKey);
        
        if (!customer) {
          customer = await retryWithBackoff(
            () => alignApi.getCustomer(user.alignCustomerId!),
            {
              maxRetries: 3,
              baseDelay: 1000,
              shouldRetry: (error) => {
                if (error?.response?.status === 401 || error?.response?.status === 403) {
                  console.error(`KYC Sync: Auth error for user ${user.privyDid}, skipping retries`);
                  return false;
                }
                if (error?.name === 'ZodError' || error?.message?.includes('validation')) {
                  console.error(`KYC Sync: Validation error for user ${user.privyDid}, skipping retries`);
                  return false;
                }
                return true;
              }
            }
          );
          setCachedResponse(cacheKey, customer, 300000);
        }
        
        const latestKyc = (customer as any).kycs && (customer as any).kycs.length > 0 ? (customer as any).kycs[0] : null;

        if (latestKyc) {
          console.log(`KYC Sync: User ${user.privyDid} - Align KYC status: ${latestKyc.status}. Current DB status: ${user.kycStatus}`);
          
          const wasApproved = latestKyc.status === 'approved' && user.kycStatus !== 'approved';
          
          if (wasApproved) {
            console.log(`KYC Sync: Updating user ${user.privyDid} KYC status to 'approved'.`);
            await db
              .update(users)
              .set({ 
                kycStatus: 'approved',
                kycSubStatus: latestKyc.sub_status 
              })
              .where(eq(users.privyDid, user.privyDid));
            updatedCount++;
            console.log(`KYC Sync: Successfully updated user ${user.privyDid}.`);
            
            try {
              const { sendKycApprovedEmail } = await import('@/server/services/email-service');
              sendKycApprovedEmail(user.privyDid).catch(error => {
                console.error('Background KYC approved email failed:', error);
              });
            } catch (emailError) {
              console.error('Failed to send KYC approved email:', emailError);
            }
          } else if (latestKyc.status !== user.kycStatus || latestKyc.sub_status !== user.kycSubStatus) {
            console.log(`KYC Sync: Updating user ${user.privyDid} KYC status from '${user.kycStatus}' to '${latestKyc.status}' and sub_status to '${latestKyc.sub_status}'.`);
            await db
              .update(users)
              .set({ 
                kycStatus: latestKyc.status,
                kycFlowLink: latestKyc.kyc_flow_link,
                kycSubStatus: latestKyc.sub_status 
              })
              .where(eq(users.privyDid, user.privyDid));
            updatedCount++;
            console.log(`KYC Sync: Successfully updated user ${user.privyDid}.`);
          } else {
            console.log(`KYC Sync: No update needed for user ${user.privyDid}.`);
          }
        } else {
          console.log(`KYC Sync: No KYC information found in Align for user ${user.privyDid}.`);
        }
      } catch (userError) {
        const errorMessage = userError instanceof Error ? userError.message : 'Unknown error';
        const errorType = userError instanceof Error && userError.name === 'ZodError' ? 'validation' : 
                         userError instanceof Error && userError.message?.includes('network') ? 'network' : 'unknown';
        console.error(`KYC Sync: Error processing user ${user.privyDid} (type: ${errorType}):`, userError);
        errorsEncountered.push({ userId: user.privyDid, error: `${errorType}: ${errorMessage}` });
      }
    }

    console.log(`KYC Sync: Synchronization finished. Updated ${updatedCount} users.`);
    if (errorsEncountered.length > 0) {
      console.warn('KYC Sync: Errors encountered during sync:', errorsEncountered);
      return NextResponse.json({ success: true, updated: updatedCount, errors: errorsEncountered });
    }

    return NextResponse.json({ success: true, updated: updatedCount });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('KYC Sync: Critical failure during KYC synchronization process:', error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
