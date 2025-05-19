import { db } from '@/db';
import { users } from '@/db/schema';
import { alignApi } from '@/server/services/align-api';
import { eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

function validateCronKey(req: Request): boolean {
  const cronKey = req.headers.get('x-cron-key');
  if (!cronKey) {
    console.warn('No cron key provided');
    return false;
  }
  return process.env.NODE_ENV === 'development' || cronKey === process.env.CRON_SECRET_KEY;
}

export async function GET(req: Request) {
  if (process.env.NODE_ENV !== 'development' && !validateCronKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const usersWithCustomer = await db
      .select()
      .from(users)
      .where(sql`${users.alignCustomerId} IS NOT NULL`);

    let updated = 0;

    for (const user of usersWithCustomer) {
      if (!user.alignCustomerId) continue;
      const customer = await alignApi.getCustomer(user.alignCustomerId);
      const latestKyc = customer.kycs && customer.kycs.length > 0 ? customer.kycs[0] : null;

      if (latestKyc && latestKyc.status === 'approved' && user.kycStatus !== 'approved') {
        await db
          .update(users)
          .set({ kycStatus: 'approved' })
          .where(eq(users.privyDid, user.privyDid));
        updated++;
      }
    }

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error('KYC sync failed:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
