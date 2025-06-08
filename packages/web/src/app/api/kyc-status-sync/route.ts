import { db } from '@/db';
import { users, userProfilesTable } from '@/db/schema';
import { alignApi, alignCustomerSchema } from '@/server/services/align-api';
import { loopsApi, LoopsEvent } from '@/server/services/loops-service';
import { eq, sql, inArray } from 'drizzle-orm';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

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

    if (usersToSync.length === 0) {
      console.log('KYC Sync: No users to sync.');
      return NextResponse.json({ success: true, updated: 0 });
    }

    console.log(`KYC Sync: Found ${usersToSync.length} users with Align Customer IDs to check.`);

    // Fetch emails for all users to sync in a single query
    const userDids = usersToSync.map(u => u.privyDid);
    const profiles = await db.query.userProfilesTable.findMany({
        where: inArray(userProfilesTable.privyDid, userDids),
        columns: { privyDid: true, email: true }
    });
    const emailMap = new Map(profiles.map(p => [p.privyDid, p.email]));

    let updatedCount = 0;
    const errorsEncountered: { userId: string; error: string }[] = [];

    for (const user of usersToSync) {
      try {
        if (!user.alignCustomerId) {
          console.warn(`KYC Sync: User ${user.privyDid} has NULL alignCustomerId in the loop, skipping.`);
          continue;
        }
        console.log(`KYC Sync: Processing user ${user.privyDid} (Align ID: ${user.alignCustomerId})`);
        
        const rawCustomerData = await alignApi.getRawCustomer(user.alignCustomerId);
        const customer = alignCustomerSchema.parse(rawCustomerData);

        const latestKyc = customer.kycs && customer.kycs.length > 0 ? customer.kycs[0] : null;

        if (latestKyc) {
          console.log(`KYC Sync: User ${user.privyDid} - Align KYC status: ${latestKyc.status}. Current DB status: ${user.kycStatus}`);
          if (latestKyc.status === 'approved' && user.kycStatus !== 'approved') {
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
            
            // Send email notification
            const email = emailMap.get(user.privyDid);
            if (email) {
              await loopsApi.sendEvent(email, LoopsEvent.KYC_APPROVED, user.privyDid);
            } else {
              console.warn(`KYC Sync: User ${user.privyDid} has no email in user_profiles, cannot send notification.`);
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
        console.error(`KYC Sync: Error processing user ${user.privyDid}:`, userError);
        
        if (userError instanceof z.ZodError) {
            console.error(`KYC Sync: Zod validation failed for user ${user.privyDid}. Align API data might have changed.`, userError.issues);
        }

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
