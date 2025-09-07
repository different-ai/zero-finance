import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/db';
import { users, userProfilesTable } from '@/db/schema';
import { eq, and, isNull, isNotNull, ne } from 'drizzle-orm';
import { loopsApi, LoopsEvent } from '@/server/services/loops-service';
import { alignApi } from '@/server/services/align-api';
import { getPrivyClient } from '@/lib/auth';

// Helper to validate the cron key (to protect endpoint from unauthorized access)
function validateCronKey(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    console.warn('[kyc-notifications-cron] No authorization header provided');
    return false;
  }

  // In production, use a more secure validation method with a strong secret key
  // For development, accept any non-empty key
  return (
    process.env.NODE_ENV === 'development' ||
    authHeader === `Bearer ${process.env.CRON_SECRET}`
  );
}

interface KycProcessingResult {
  userId: string;
  email: string;
  action: 'status_updated' | 'notification_sent' | 'no_change' | 'error';
  oldStatus?: string;
  newStatus?: string;
  success: boolean;
  error?: string;
}

/**
 * Get user email from Privy (fallback) or user profile (preferred)
 */
async function getUserEmail(userId: string): Promise<string | null> {
  try {
    // First try user profile
    const userProfile = await db.query.userProfilesTable.findFirst({
      where: eq(userProfilesTable.privyDid, userId),
    });

    if (userProfile?.email) {
      return userProfile.email;
    }

    // Fallback to Privy
    const privyClient = await getPrivyClient();
    if (!privyClient) {
      console.log(`[kyc-processor] Privy client not initialized`);
      return null;
    }

    const user = await privyClient.getUser(userId);
    const email =
      typeof user.email === 'string' ? user.email : user.email?.address || null;

    return email;
  } catch (error) {
    console.error(
      `[kyc-processor] Error fetching user email for ${userId}:`,
      error,
    );
    return null;
  }
}

/**
 * Check and update KYC status for a single user from Align API
 */
async function checkAndUpdateKycStatus(
  alignCustomerId: string,
  userId: string,
  currentStatus: string,
  currentSubStatus?: string | null,
): Promise<{
  statusChanged: boolean;
  subStatusChanged: boolean;
  oldStatus: string;
  newStatus: string;
  oldSubStatus?: string | null;
  newSubStatus?: string | null;
  kycFlowLink?: string | null;
}> {
  try {
    const customer = await alignApi.getCustomer(alignCustomerId);
    const latestKyc =
      customer.kycs && customer.kycs.length > 0 ? customer.kycs[0] : null;

    if (!latestKyc || !latestKyc.status) {
      console.log(
        `[kyc-processor] No KYC data or status found for user ${userId} - will retry in next run`,
      );
      return {
        statusChanged: false,
        subStatusChanged: false,
        oldStatus: currentStatus,
        newStatus: currentStatus,
        oldSubStatus: currentSubStatus,
        newSubStatus: currentSubStatus,
      };
    }

    // Check if either status or sub_status has changed
    const statusChanged = latestKyc.status !== currentStatus;
    const subStatusChanged = latestKyc.sub_status !== currentSubStatus;

    // Skip if nothing has changed
    if (!statusChanged && !subStatusChanged) {
      return {
        statusChanged: false,
        subStatusChanged: false,
        oldStatus: currentStatus,
        newStatus: currentStatus,
        oldSubStatus: currentSubStatus,
        newSubStatus: currentSubStatus,
      };
    }

    // Update DB with latest status - handle nulls gracefully
    await db
      .update(users)
      .set({
        kycStatus: latestKyc.status,
        kycFlowLink: latestKyc.kyc_flow_link || null,
        kycSubStatus: latestKyc.sub_status || null,
        kycProvider: 'align',
      })
      .where(eq(users.privyDid, userId));

    console.log(
      `[kyc-processor] Updated KYC for user ${userId}: status ${currentStatus} -> ${latestKyc.status}, sub_status ${currentSubStatus} -> ${latestKyc.sub_status}`,
    );

    return {
      statusChanged,
      subStatusChanged,
      oldStatus: currentStatus,
      newStatus: latestKyc.status,
      oldSubStatus: currentSubStatus,
      newSubStatus: latestKyc.sub_status,
      kycFlowLink: latestKyc.kyc_flow_link,
    };
  } catch (error) {
    console.error(
      `[kyc-processor] Error fetching KYC status for user ${userId}:`,
      error,
    );
    throw error;
  }
}

/**
 * Send KYC notification via Loops
 */
async function sendKycNotification(
  userId: string,
  email: string,
  notificationType: 'approved' | 'resubmission_required' = 'approved',
  kycFlowLink?: string | null,
): Promise<{ success: boolean; message?: string }> {
  const eventName =
    notificationType === 'approved'
      ? LoopsEvent.KYC_APPROVED
      : LoopsEvent.KYC_REQUIRES_MORE_DOCUMENTS;

  const eventProperties: Record<string, any> = {
    kycProvider: 'align',
  };

  if (notificationType === 'approved') {
    eventProperties.completedAt = new Date().toISOString();
  } else if (notificationType === 'resubmission_required' && kycFlowLink) {
    eventProperties.url = kycFlowLink;
  }

  const response = await loopsApi.sendEvent(
    email,
    eventName,
    userId,
    eventProperties,
  );

  if (response.success) {
    // Mark as notified in database
    await db
      .update(users)
      .set({
        kycNotificationSent: new Date(),
        kycNotificationStatus: 'sent' as const,
      })
      .where(eq(users.privyDid, userId));
  }

  return response;
}

/**
 * Comprehensive KYC processing: check status updates and send notifications
 */
async function processKycUpdatesAndNotifications(): Promise<
  KycProcessingResult[]
> {
  const results: KycProcessingResult[] = [];

  console.log('[kyc-processor] Starting comprehensive KYC processing...');

  try {
    // PHASE 1: Check for KYC status updates from Align API
    console.log('[kyc-processor] Phase 1: Checking for KYC status updates...');

    const usersToCheck = await db.query.users.findMany({
      where: and(
        isNotNull(users.alignCustomerId), // Has Align customer ID
        ne(users.alignCustomerId, ''), // Not empty
        // Remove status filter - check ALL users with customer IDs for eventual consistency
      ),
      limit: 50, // Increased limit since we're checking all users now
    });

    console.log(
      `[kyc-processor] Found ${usersToCheck.length} users needing status check`,
    );

    for (const user of usersToCheck) {
      if (!user.alignCustomerId) continue;

      try {
        const email = await getUserEmail(user.privyDid);
        if (!email) {
          results.push({
            userId: user.privyDid,
            email: 'no-email',
            action: 'error',
            success: false,
            error: 'No email address found',
          });
          continue;
        }

        const statusUpdate = await checkAndUpdateKycStatus(
          user.alignCustomerId,
          user.privyDid,
          user.kycStatus || 'none',
          user.kycSubStatus,
        );

        if (statusUpdate.statusChanged || statusUpdate.subStatusChanged) {
          console.log(
            `[kyc-processor] Status changed for ${user.privyDid}: status ${statusUpdate.oldStatus} -> ${statusUpdate.newStatus}, sub_status ${statusUpdate.oldSubStatus} -> ${statusUpdate.newSubStatus}`,
          );

          results.push({
            userId: user.privyDid,
            email,
            action: 'status_updated',
            oldStatus: statusUpdate.oldStatus,
            newStatus: statusUpdate.newStatus,
            success: true,
          });

          // If newly approved, send approval notification
          if (
            statusUpdate.oldStatus !== 'approved' &&
            statusUpdate.newStatus === 'approved'
          ) {
            const notificationResult = await sendKycNotification(
              user.privyDid,
              email,
              'approved',
            );

            results.push({
              userId: user.privyDid,
              email,
              action: 'notification_sent',
              success: notificationResult.success,
              error: notificationResult.message,
            });

            console.log(
              `[kyc-processor] ${notificationResult.success ? '✅' : '❌'} Approval notification for user ${user.privyDid}`,
            );
          }

          // If sub_status changed to resubmission_required, send resubmission notification
          if (
            statusUpdate.newStatus === 'pending' &&
            statusUpdate.newSubStatus === 'kyc_form_resubmission_required' &&
            statusUpdate.oldSubStatus !== 'kyc_form_resubmission_required'
          ) {
            const notificationResult = await sendKycNotification(
              user.privyDid,
              email,
              'resubmission_required',
              statusUpdate.kycFlowLink,
            );

            results.push({
              userId: user.privyDid,
              email,
              action: 'notification_sent',
              success: notificationResult.success,
              error: notificationResult.message,
            });

            console.log(
              `[kyc-processor] ${notificationResult.success ? '✅' : '❌'} Resubmission notification for user ${user.privyDid}`,
            );
          }
        } else {
          results.push({
            userId: user.privyDid,
            email,
            action: 'no_change',
            success: true,
          });
        }

        // Rate limiting delay
        await new Promise((resolve) => setTimeout(resolve, 150));
      } catch (error) {
        console.error(
          `[kyc-processor] Error processing status update for user ${user.privyDid}:`,
          error,
        );
        results.push({
          userId: user.privyDid,
          email: 'unknown',
          action: 'error',
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // PHASE 2: Send notifications to already-approved users who haven't been notified
    console.log(
      '[kyc-processor] Phase 2: Sending notifications to approved users...',
    );

    const usersToNotify = await db.query.users.findMany({
      where: and(
        eq(users.kycStatus, 'approved' as const),
        isNull(users.kycNotificationSent),
      ),
      limit: 20, // Process up to 20 notifications per run
    });

    console.log(
      `[kyc-processor] Found ${usersToNotify.length} approved users needing notification`,
    );

    for (const user of usersToNotify) {
      try {
        const email = await getUserEmail(user.privyDid);
        if (!email) {
          results.push({
            userId: user.privyDid,
            email: 'no-email',
            action: 'error',
            success: false,
            error: 'No email address found',
          });
          continue;
        }

        const notificationResult = await sendKycNotification(
          user.privyDid,
          email,
          'approved',
        );

        results.push({
          userId: user.privyDid,
          email,
          action: 'notification_sent',
          success: notificationResult.success,
          error: notificationResult.message,
        });

        console.log(
          `[kyc-processor] ${notificationResult.success ? '✅' : '❌'} Notification sent to ${email}`,
        );

        // Rate limiting delay
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(
          `[kyc-processor] Error sending notification to user ${user.privyDid}:`,
          error,
        );
        results.push({
          userId: user.privyDid,
          email: 'unknown',
          action: 'error',
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  } catch (error) {
    console.error(
      '[kyc-processor] Error in comprehensive KYC processing:',
      error,
    );
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
    console.log('[kyc-processor] Starting comprehensive KYC processing...');

    const results = await processKycUpdatesAndNotifications();

    const successCount = results.filter(
      (r: KycProcessingResult) => r.success,
    ).length;
    const failureCount = results.filter(
      (r: KycProcessingResult) => !r.success,
    ).length;

    const statusUpdatesCount = results.filter(
      (r: KycProcessingResult) => r.action === 'status_updated',
    ).length;
    const notificationsSentCount = results.filter(
      (r: KycProcessingResult) => r.action === 'notification_sent',
    ).length;
    const noChangeCount = results.filter(
      (r: KycProcessingResult) => r.action === 'no_change',
    ).length;

    console.log(
      `[kyc-processor] KYC processing completed: ${successCount} success, ${failureCount} failures`,
    );
    console.log(
      `[kyc-processor] Summary: ${statusUpdatesCount} status updates, ${notificationsSentCount} notifications sent, ${noChangeCount} no changes`,
    );

    return NextResponse.json({
      success: true,
      message: 'Comprehensive KYC processing completed',
      summary: {
        totalProcessed: results.length,
        successCount,
        failureCount,
        statusUpdatesCount,
        notificationsSentCount,
        noChangeCount,
      },
      results,
    });
  } catch (error) {
    console.error(
      '[kyc-processor] Failed to execute comprehensive KYC processing:',
      error,
    );
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to execute comprehensive KYC processing',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
