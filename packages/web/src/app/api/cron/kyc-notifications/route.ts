import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/db';
import {
  users,
  userProfilesTable,
  userFundingSources,
  userSafes,
  workspaces,
} from '@/db/schema';
import { eq, and, isNull, isNotNull, ne } from 'drizzle-orm';
import { loopsApi, LoopsEvent } from '@/server/services/loops-service';
import { alignApi } from '@/server/services/align-api';
import { getPrivyClient } from '@/lib/auth';
import { featureConfig } from '@/lib/feature-config';
import type { Address } from 'viem';

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
  action:
    | 'status_updated'
    | 'notification_sent'
    | 'virtual_accounts_created'
    | 'no_change'
    | 'error';
  oldStatus?: string;
  newStatus?: string;
  success: boolean;
  error?: string;
  details?: string;
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
  workspaceId: string,
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
      .update(workspaces)
      .set({
        kycStatus: latestKyc.status,
        kycFlowLink: latestKyc.kyc_flow_link || null,
        kycSubStatus: latestKyc.sub_status || null,
        kycProvider: 'align',
      })
      .where(eq(workspaces.id, workspaceId));

    // Optional: keep legacy user column in sync while it still exists
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
 * Create virtual accounts for an approved user
 * Returns success status and details about created accounts
 */
async function createVirtualAccountsForUser(
  userId: string,
  alignCustomerId: string,
): Promise<{ success: boolean; details: string; error?: string }> {
  try {
    console.log(`[kyc-processor] Creating virtual accounts for user ${userId}`);

    // Check if user already has virtual accounts
    const existingAccounts = await db.query.userFundingSources.findMany({
      where: eq(userFundingSources.userPrivyDid, userId),
    });

    if (existingAccounts.length > 0) {
      console.log(
        `[kyc-processor] User ${userId} already has ${existingAccounts.length} funding source(s)`,
      );
      return {
        success: true,
        details: `Already has ${existingAccounts.length} funding source(s)`,
      };
    }

    // Get user's primary workspace
    const user = await db.query.users.findFirst({
      where: eq(users.privyDid, userId),
    });

    if (!user?.primaryWorkspaceId) {
      return {
        success: false,
        details: 'No primary workspace found',
        error: 'User has no primary workspace',
      };
    }

    // Get primary safe address for the workspace
    const primarySafe = await db.query.userSafes.findFirst({
      where: and(
        eq(userSafes.userDid, userId),
        eq(userSafes.safeType, 'primary'),
        eq(userSafes.workspaceId, user.primaryWorkspaceId),
      ),
    });

    if (!primarySafe?.safeAddress) {
      return {
        success: false,
        details: 'No primary safe address found',
        error: 'User has no primary safe address',
      };
    }

    const destinationAddress = primarySafe.safeAddress as Address;
    const results = [];
    const errors = [];

    // Create USD (ACH) account
    try {
      console.log(`[kyc-processor] Creating USD account for ${userId}`);
      const usdAccount = await alignApi.createVirtualAccount(alignCustomerId, {
        source_currency: 'usd',
        destination_token: 'usdc',
        destination_network: 'base',
        destination_address: destinationAddress,
      });

      await db.insert(userFundingSources).values({
        userPrivyDid: userId,
        workspaceId: user.primaryWorkspaceId,
        sourceProvider: 'align',
        alignVirtualAccountIdRef: usdAccount.id,
        sourceAccountType: 'us_ach',
        sourceCurrency: 'usd',
        sourceBankName: usdAccount.deposit_instructions.bank_name,
        sourceBankAddress: usdAccount.deposit_instructions.bank_address,
        sourceBankBeneficiaryName:
          usdAccount.deposit_instructions.beneficiary_name ||
          usdAccount.deposit_instructions.account_beneficiary_name,
        sourceBankBeneficiaryAddress:
          usdAccount.deposit_instructions.beneficiary_address ||
          usdAccount.deposit_instructions.account_beneficiary_address,
        sourceAccountNumber:
          usdAccount.deposit_instructions.us?.account_number ||
          usdAccount.deposit_instructions.account_number,
        sourceRoutingNumber:
          usdAccount.deposit_instructions.us?.routing_number ||
          usdAccount.deposit_instructions.routing_number,
        sourcePaymentRails: usdAccount.deposit_instructions.payment_rails,
        destinationCurrency: 'usdc',
        destinationPaymentRail: 'base',
        destinationAddress: destinationAddress,
      });

      results.push({ currency: 'USD', id: usdAccount.id });
      console.log(`[kyc-processor] ✅ Created USD account: ${usdAccount.id}`);
    } catch (error) {
      console.error(`[kyc-processor] Error creating USD account:`, error);
      errors.push({
        currency: 'USD',
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Create EUR (IBAN) account
    try {
      console.log(`[kyc-processor] Creating EUR account for ${userId}`);
      const eurAccount = await alignApi.createVirtualAccount(alignCustomerId, {
        source_currency: 'eur',
        destination_token: 'usdc',
        destination_network: 'base',
        destination_address: destinationAddress,
      });

      await db.insert(userFundingSources).values({
        userPrivyDid: userId,
        workspaceId: user.primaryWorkspaceId,
        sourceProvider: 'align',
        alignVirtualAccountIdRef: eurAccount.id,
        sourceAccountType: 'iban',
        sourceCurrency: 'eur',
        sourceBankName: eurAccount.deposit_instructions.bank_name,
        sourceBankAddress: eurAccount.deposit_instructions.bank_address,
        sourceBankBeneficiaryName:
          eurAccount.deposit_instructions.beneficiary_name ||
          eurAccount.deposit_instructions.account_beneficiary_name,
        sourceBankBeneficiaryAddress:
          eurAccount.deposit_instructions.beneficiary_address ||
          eurAccount.deposit_instructions.account_beneficiary_address,
        sourceIban: eurAccount.deposit_instructions.iban?.iban_number,
        sourceBicSwift:
          eurAccount.deposit_instructions.iban?.bic ||
          eurAccount.deposit_instructions.bic?.bic_code,
        sourcePaymentRails: eurAccount.deposit_instructions.payment_rails,
        destinationCurrency: 'usdc',
        destinationPaymentRail: 'base',
        destinationAddress: destinationAddress,
      });

      results.push({ currency: 'EUR', id: eurAccount.id });
      console.log(`[kyc-processor] ✅ Created EUR account: ${eurAccount.id}`);
    } catch (error) {
      console.error(`[kyc-processor] Error creating EUR account:`, error);
      errors.push({
        currency: 'EUR',
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Update workspace with first account ID if any were created
    if (results.length > 0 && user.primaryWorkspaceId) {
      await db
        .update(workspaces)
        .set({
          alignVirtualAccountId: results[0].id,
        })
        .where(eq(workspaces.id, user.primaryWorkspaceId));

      // Optional: keep legacy user column in sync while it still exists
      await db
        .update(users)
        .set({
          alignVirtualAccountId: results[0].id,
        })
        .where(eq(users.privyDid, userId));
    }

    if (results.length === 2) {
      return {
        success: true,
        details: `Created USD and EUR accounts (${results[0].id}, ${results[1].id})`,
      };
    } else if (results.length === 1) {
      return {
        success: true,
        details: `Created ${results[0].currency} account (${results[0].id}), ${errors[0]?.currency} failed`,
        error: errors[0]?.error,
      };
    } else {
      return {
        success: false,
        details: 'Failed to create any accounts',
        error: errors.map((e) => `${e.currency}: ${e.error}`).join('; '),
      };
    }
  } catch (error) {
    console.error(
      `[kyc-processor] Error in createVirtualAccountsForUser for ${userId}:`,
      error,
    );
    return {
      success: false,
      details: 'Exception during account creation',
      error: error instanceof Error ? error.message : String(error),
    };
  }
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
        // Get workspace for this user
        if (!user.primaryWorkspaceId) {
          results.push({
            userId: user.privyDid,
            email: 'no-workspace',
            action: 'error',
            success: false,
            error: 'User has no primary workspace',
          });
          continue;
        }

        const workspace = await db.query.workspaces.findFirst({
          where: eq(workspaces.id, user.primaryWorkspaceId),
        });

        if (!workspace) {
          results.push({
            userId: user.privyDid,
            email: 'no-workspace',
            action: 'error',
            success: false,
            error: 'Workspace not found',
          });
          continue;
        }

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
          workspace.id,
          workspace.kycStatus || user.kycStatus || 'none',
          workspace.kycSubStatus || user.kycSubStatus,
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

    // PHASE 3: Create virtual accounts for approved users who don't have them
    console.log(
      '[kyc-processor] Phase 3: Creating virtual accounts for approved users...',
    );

    const approvedUsersWithoutAccounts = await db.query.users.findMany({
      where: and(
        eq(users.kycStatus, 'approved' as const),
        isNotNull(users.alignCustomerId),
        ne(users.alignCustomerId, ''),
      ),
      limit: 10, // Process up to 10 account creations per run
    });

    console.log(
      `[kyc-processor] Found ${approvedUsersWithoutAccounts.length} approved users to check for virtual accounts`,
    );

    for (const user of approvedUsersWithoutAccounts) {
      if (!user.alignCustomerId) continue;

      try {
        // Check if they already have funding sources
        const existingAccounts = await db.query.userFundingSources.findMany({
          where: eq(userFundingSources.userPrivyDid, user.privyDid),
        });

        if (existingAccounts.length > 0) {
          // Already has accounts, skip
          continue;
        }

        const email = await getUserEmail(user.privyDid);
        if (!email) {
          results.push({
            userId: user.privyDid,
            email: 'no-email',
            action: 'error',
            success: false,
            error: 'No email address found for virtual account creation',
          });
          continue;
        }

        // Create virtual accounts
        const accountResult = await createVirtualAccountsForUser(
          user.privyDid,
          user.alignCustomerId,
        );

        results.push({
          userId: user.privyDid,
          email,
          action: accountResult.success ? 'virtual_accounts_created' : 'error',
          success: accountResult.success,
          details: accountResult.details,
          error: accountResult.error,
        });

        console.log(
          `[kyc-processor] ${accountResult.success ? '✅' : '❌'} Virtual accounts for ${email}: ${accountResult.details}`,
        );

        // Rate limiting delay (virtual account creation is API-intensive)
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(
          `[kyc-processor] Error creating virtual accounts for user ${user.privyDid}:`,
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
  // Skip if Align is not configured
  if (!featureConfig.align.enabled) {
    return NextResponse.json({
      message: 'KYC processing skipped - Align not configured',
      skipped: true,
    });
  }

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
    const virtualAccountsCreatedCount = results.filter(
      (r: KycProcessingResult) => r.action === 'virtual_accounts_created',
    ).length;
    const noChangeCount = results.filter(
      (r: KycProcessingResult) => r.action === 'no_change',
    ).length;

    console.log(
      `[kyc-processor] KYC processing completed: ${successCount} success, ${failureCount} failures`,
    );
    console.log(
      `[kyc-processor] Summary: ${statusUpdatesCount} status updates, ${notificationsSentCount} notifications sent, ${virtualAccountsCreatedCount} virtual accounts created, ${noChangeCount} no changes`,
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
        virtualAccountsCreatedCount,
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
