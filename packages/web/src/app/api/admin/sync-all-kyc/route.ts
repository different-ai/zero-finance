import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/db';
import { users, userProfilesTable } from '@/db/schema';
import { eq, and, isNotNull, ne, or, isNull } from 'drizzle-orm';
import { alignApi } from '@/server/services/align-api';
import { featureConfig } from '@/lib/feature-config';

interface SyncResult {
  userId: string;
  email: string;
  alignCustomerId: string;
  action: 'updated' | 'no_change' | 'error';
  oldStatus?: string | null;
  newStatus?: string | null;
  oldSubStatus?: string | null;
  newSubStatus?: string | null;
  details?: string;
}

async function getUserEmail(userId: string): Promise<string> {
  const profile = await db.query.userProfilesTable.findFirst({
    where: eq(userProfilesTable.privyDid, userId),
  });
  return profile?.email || 'unknown';
}

/**
 * Comprehensive KYC sync that updates ALL users with Align customer IDs
 * This ensures eventual consistency and fixes any mismatched states
 */
async function syncAllKycStatuses(adminToken: string): Promise<SyncResult[]> {
  const results: SyncResult[] = [];

  // Validate admin token
  if (adminToken !== process.env.ADMIN_TOKEN) {
    throw new Error('Invalid admin token');
  }

  console.log('[sync-all-kyc] Starting comprehensive KYC sync...');

  try {
    // Get ALL users with Align customer IDs - no status filter
    // This ensures we catch any users whose status might be out of sync
    const usersToSync = await db.query.users.findMany({
      where: and(
        isNotNull(users.alignCustomerId),
        ne(users.alignCustomerId, ''),
      ),
    });

    console.log(`[sync-all-kyc] Found ${usersToSync.length} users to sync`);

    for (const user of usersToSync) {
      if (!user.alignCustomerId) continue;

      try {
        // Fetch latest data from Align
        const customer = await alignApi.getCustomer(user.alignCustomerId);

        // Get the latest KYC data
        const latestKyc =
          customer.kycs && customer.kycs.length > 0 ? customer.kycs[0] : null;

        // Determine the new status and sub-status
        const newStatus = latestKyc?.status || 'none';
        const newSubStatus = latestKyc?.sub_status || null;
        const newKycFlowLink = latestKyc?.kyc_flow_link || null;

        // Check if anything changed
        const statusChanged = user.kycStatus !== newStatus;
        const subStatusChanged = user.kycSubStatus !== newSubStatus;
        const flowLinkChanged = user.kycFlowLink !== newKycFlowLink;

        if (statusChanged || subStatusChanged || flowLinkChanged) {
          // Update the database
          await db
            .update(users)
            .set({
              kycStatus: newStatus as
                | 'none'
                | 'pending'
                | 'approved'
                | 'rejected',
              kycSubStatus: newSubStatus,
              kycFlowLink: newKycFlowLink,
              kycProvider: 'align',
            })
            .where(eq(users.privyDid, user.privyDid));

          console.log(
            `[sync-all-kyc] Updated user ${user.privyDid}: ` +
              `status ${user.kycStatus} -> ${newStatus}, ` +
              `sub_status ${user.kycSubStatus} -> ${newSubStatus}`,
          );

          const email = await getUserEmail(user.privyDid);
          results.push({
            userId: user.privyDid,
            email,
            alignCustomerId: user.alignCustomerId,
            action: 'updated',
            oldStatus: user.kycStatus,
            newStatus,
            oldSubStatus: user.kycSubStatus,
            newSubStatus,
            details: `Status: ${user.kycStatus} -> ${newStatus}, SubStatus: ${user.kycSubStatus} -> ${newSubStatus}`,
          });
        } else {
          const email = await getUserEmail(user.privyDid);
          results.push({
            userId: user.privyDid,
            email,
            alignCustomerId: user.alignCustomerId,
            action: 'no_change',
            oldStatus: user.kycStatus,
            newStatus: user.kycStatus,
            oldSubStatus: user.kycSubStatus,
            newSubStatus: user.kycSubStatus,
          });
        }

        // Rate limiting to avoid API throttling
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(
          `[sync-all-kyc] Error syncing user ${user.privyDid}:`,
          error,
        );
        const email = await getUserEmail(user.privyDid);
        results.push({
          userId: user.privyDid,
          email,
          alignCustomerId: user.alignCustomerId || '',
          action: 'error',
          details: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Also check for users who might have KYC status but no Align customer ID
    // This helps identify data inconsistencies
    const orphanedKycUsers = await db.query.users.findMany({
      where: and(
        or(isNull(users.alignCustomerId), eq(users.alignCustomerId, '')),
        ne(users.kycStatus, 'none'),
      ),
    });

    if (orphanedKycUsers.length > 0) {
      console.log(
        `[sync-all-kyc] Found ${orphanedKycUsers.length} users with KYC status but no Align customer ID`,
      );

      // Reset their KYC status since they don't have a valid Align customer
      for (const user of orphanedKycUsers) {
        await db
          .update(users)
          .set({
            kycStatus: 'none',
            kycSubStatus: null,
            kycFlowLink: null,
          })
          .where(eq(users.privyDid, user.privyDid));

        const email = await getUserEmail(user.privyDid);
        results.push({
          userId: user.privyDid,
          email,
          alignCustomerId: 'none',
          action: 'updated',
          oldStatus: user.kycStatus,
          newStatus: 'none',
          details: 'Reset KYC status - no Align customer ID',
        });
      }
    }

    const updatedCount = results.filter((r) => r.action === 'updated').length;
    const errorCount = results.filter((r) => r.action === 'error').length;

    console.log(
      `[sync-all-kyc] Sync completed: ${updatedCount} updated, ${errorCount} errors, ${results.length - updatedCount - errorCount} unchanged`,
    );
  } catch (error) {
    console.error('[sync-all-kyc] Failed to sync KYC statuses:', error);
    throw error;
  }

  return results;
}

export async function POST(req: NextRequest) {
  // Skip if Align is not configured
  if (!featureConfig.align.enabled) {
    return NextResponse.json({
      message: 'KYC sync skipped - Align not configured',
      skipped: true,
    });
  }

  try {
    const body = await req.json();
    const { adminToken } = body;

    if (!adminToken) {
      return NextResponse.json(
        { error: 'Admin token required' },
        { status: 401 },
      );
    }

    const results = await syncAllKycStatuses(adminToken);

    const summary = {
      total: results.length,
      updated: results.filter((r) => r.action === 'updated').length,
      unchanged: results.filter((r) => r.action === 'no_change').length,
      errors: results.filter((r) => r.action === 'error').length,
    };

    return NextResponse.json({
      success: true,
      message: 'KYC sync completed successfully',
      summary,
      results,
    });
  } catch (error) {
    console.error('[sync-all-kyc] API error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to sync KYC statuses',
      },
      { status: 500 },
    );
  }
}

// Also support GET for cron jobs
export async function GET(req: NextRequest) {
  // Skip if Align is not configured
  if (!featureConfig.align.enabled) {
    return NextResponse.json({
      message: 'KYC sync skipped - Align not configured',
      skipped: true,
    });
  }

  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // For cron jobs, use bearer token
  if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Use admin token from environment for cron jobs
    const results = await syncAllKycStatuses(process.env.ADMIN_TOKEN || '');

    const summary = {
      total: results.length,
      updated: results.filter((r) => r.action === 'updated').length,
      unchanged: results.filter((r) => r.action === 'no_change').length,
      errors: results.filter((r) => r.action === 'error').length,
    };

    return NextResponse.json({
      success: true,
      message: 'KYC sync completed successfully',
      summary,
      results,
    });
  } catch (error) {
    console.error('[sync-all-kyc] Cron error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to sync KYC statuses',
      },
      { status: 500 },
    );
  }
}
