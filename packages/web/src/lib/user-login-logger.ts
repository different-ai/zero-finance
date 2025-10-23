import { db } from '../db';
import { userLoginLogs } from '../db/schema';
import { headers } from 'next/headers';

interface LoginLogData {
  privyDid: string;
  email?: string | null;
  smartWalletAddress?: string | null;
  embeddedWalletAddress?: string | null;
}

export async function logUserLogin(data: LoginLogData): Promise<void> {
  try {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || undefined;
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIp || undefined;

    await db.insert(userLoginLogs).values({
      privyDid: data.privyDid,
      email: data.email || undefined,
      smartWalletAddress: data.smartWalletAddress || undefined,
      embeddedWalletAddress: data.embeddedWalletAddress || undefined,
      userAgent,
      ipAddress,
    });
  } catch (error) {
    // Log the error but don't fail the login process
    console.error('Failed to log user login:', error);
  }
}
