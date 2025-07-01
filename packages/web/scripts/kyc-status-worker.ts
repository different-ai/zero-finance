import { db } from '../src/db';
import { users } from '../src/db/schema';
import { eq, and, or, isNotNull, ne } from 'drizzle-orm';
import { alignApi } from '../src/server/services/align-api';
import { loopsApi, LoopsEvent } from '../src/server/services/loops-service';
import { getPrivyClient } from '../src/lib/auth';

/**
 * KYC Status Worker
 * 
 * This worker periodically checks for users with pending KYC status
 * and updates their status from Align API. If the status changes to
 * approved, it sends a notification email via Loops.
 */

interface KycStatusChange {
  userId: string;
  email: string;
  oldStatus: string;
  newStatus: string;
}

/**
 * Get user email from Privy
 */
async function getUserEmail(userId: string): Promise<string | null> {
  try {
    const privyClient = await getPrivyClient();
    if (!privyClient) {
      console.log(`[kyc-status-worker] Privy client not initialized`);
      return null;
    }

    const user = await privyClient.getUser(userId);
    const email = typeof user.email === 'string' 
      ? user.email 
      : user.email?.address || null;
    
    return email;
  } catch (error) {
    console.error(`[kyc-status-worker] Error fetching user email for ${userId}:`, error);
    return null;
  }
}

/**
 * Fetch and update KYC status for a single user
 * Returns the status change if it changed to approved, null otherwise
 */
async function checkAndUpdateKycStatus(
  alignCustomerId: string,
  userId: string,
  currentStatus: string
): Promise<KycStatusChange | null> {
  try {
    const customer = await alignApi.getCustomer(alignCustomerId);
    const latestKyc = customer.kycs && customer.kycs.length > 0 ? customer.kycs[0] : null;

    if (!latestKyc) {
      console.log(`[kyc-status-worker] No KYC data found for user ${userId}`);
      return null;
    }

    // Skip if status hasn't changed
    if (latestKyc.status === currentStatus) {
      return null;
    }

    // Update DB with latest status
    await db
      .update(users)
      .set({
        kycStatus: latestKyc.status,
        kycFlowLink: latestKyc.kyc_flow_link,
        kycSubStatus: latestKyc.sub_status,
        kycProvider: 'align',
      })
      .where(eq(users.privyDid, userId));

    console.log(`[kyc-status-worker] Updated KYC status for user ${userId}: ${currentStatus} -> ${latestKyc.status}`);

    // Check if status changed to approved
    if (currentStatus !== 'approved' && latestKyc.status === 'approved') {
      // Get email from Privy
      const email = await getUserEmail(userId);
      if (email) {
        return {
          userId,
          email,
          oldStatus: currentStatus,
          newStatus: latestKyc.status,
        };
      }
    }

    return null;
  } catch (error) {
    console.error(`[kyc-status-worker] Error fetching KYC status for user ${userId}:`, error);
    return null;
  }
}

async function processKycStatusChanges() {
  console.log('[kyc-status-worker] Starting KYC status check...');
  
  try {
    // Get all users with alignCustomerId and non-approved KYC status
    const usersToCheck = await db
      .select({
        privyDid: users.privyDid,
        alignCustomerId: users.alignCustomerId,
        kycStatus: users.kycStatus,
      })
      .from(users)
      .where(
        and(
          // Has alignCustomerId (not null and not empty)
          isNotNull(users.alignCustomerId),
          ne(users.alignCustomerId, ''),
          // KYC status is not approved
          or(
            eq(users.kycStatus, 'none'),
            eq(users.kycStatus, 'pending'),
            eq(users.kycStatus, 'rejected')
          )
        )
      );

    console.log(`[kyc-status-worker] Found ${usersToCheck.length} users to check`);

    const statusChanges: KycStatusChange[] = [];

    // Check each user's KYC status
    for (const user of usersToCheck) {
      if (!user.alignCustomerId) continue;

      const change = await checkAndUpdateKycStatus(
        user.alignCustomerId,
        user.privyDid,
        user.kycStatus || 'none'
      );

      if (change) {
        statusChanges.push(change);
      }

      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Send notifications for approved KYCs
    console.log(`[kyc-status-worker] Found ${statusChanges.length} users with approved KYC`);
    
    for (const change of statusChanges) {
      try {
        await loopsApi.sendEvent(
          change.email,
          LoopsEvent.KYC_APPROVED,
          change.userId
        );
        console.log(`[kyc-status-worker] Sent KYC approved notification to ${change.email}`);
      } catch (error) {
        console.error(`[kyc-status-worker] Failed to send notification to ${change.email}:`, error);
      }
    }

    console.log(`[kyc-status-worker] Completed. Processed ${usersToCheck.length} users, sent ${statusChanges.length} notifications`);
    
    return {
      checked: usersToCheck.length,
      approved: statusChanges.length,
      changes: statusChanges,
    };
  } catch (error) {
    console.error('[kyc-status-worker] Error in processKycStatusChanges:', error);
    throw error;
  }
}

// Run the worker
if (require.main === module) {
  processKycStatusChanges()
    .then((result) => {
      console.log('[kyc-status-worker] Worker completed successfully:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('[kyc-status-worker] Worker failed:', error);
      process.exit(1);
    });
}

// Export for testing
export { processKycStatusChanges, checkAndUpdateKycStatus, getUserEmail }; 