import { db } from '@/db';
import { users } from '@/db/schema';
import { alignApi } from '@/server/services/align-api';
import { eq, sql } from 'drizzle-orm';
import { NextResponse, type NextRequest } from 'next/server';

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
        const customer = await alignApi.getCustomer(user.alignCustomerId);
        const latestKyc = customer.kycs && customer.kycs.length > 0 ? customer.kycs[0] : null;

        if (latestKyc) {
          console.log(`KYC Sync: User ${user.privyDid} - Align KYC status: ${latestKyc.status}. Current DB status: ${user.kycStatus}`);
          if (latestKyc.status === 'approved' && user.kycStatus !== 'approved') {
            console.log(`KYC Sync: Updating user ${user.privyDid} KYC status to 'approved'.`);
            await db
              .update(users)
              .set({ kycStatus: 'approved' })
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
        console.error(`KYC Sync: Error processing user ${user.privyDid}:`, userError);
        errorsEncountered.push({ userId: user.privyDid, error: errorMessage });
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
