import { db } from '@/db';
import { users, userProfilesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface LoopsContactData {
  email: string;
  userId: string;
  firstName?: string;
  kycStatus?: string;
  kycStatusUpdatedAt?: string;
  source: string;
}

async function sendLoopsContact(contactData: LoopsContactData): Promise<boolean> {
  const loopsApiKey = process.env.LOOPS_API_KEY;
  
  if (!loopsApiKey) {
    console.error('LOOPS_API_KEY is not set. Cannot send email notification.');
    return false;
  }

  try {
    const response = await fetch('https://app.loops.so/api/v1/contacts/update', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${loopsApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Loops API Error (${response.status}): ${errorBody}`);
      return false;
    }

    console.log(`Successfully sent Loops notification for user ${contactData.userId}`);
    return true;
  } catch (error: any) {
    console.error(`Error sending Loops notification:`, error);
    return false;
  }
}

export async function sendKycPendingEmail(privyUserId: string): Promise<boolean> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.privyDid, privyUserId),
      columns: {
        privyDid: true,
      },
    });

    if (!user) {
      console.warn(`Cannot send KYC pending email: user ${privyUserId} not found`);
      return false;
    }

    const userProfile = await db.query.userProfilesTable.findFirst({
      where: eq((db.query.userProfilesTable as any).privyDid, privyUserId),
      columns: {
        email: true,
        businessName: true,
      },
    });

    if (!userProfile?.email) {
      console.warn(`Cannot send KYC pending email: no email found for user ${privyUserId}`);
      return false;
    }

    return await sendLoopsContact({
      email: userProfile.email,
      userId: privyUserId,
      firstName: userProfile.businessName || '',
      kycStatus: 'pending',
      kycStatusUpdatedAt: new Date().toISOString(),
      source: 'kyc_marked_done - KYC submission completed, verification pending',
    });
  } catch (error) {
    console.error(`Error sending KYC pending email for user ${privyUserId}:`, error);
    return false;
  }
}

export async function sendKycApprovedEmail(privyUserId: string): Promise<boolean> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.privyDid, privyUserId),
      columns: {
        privyDid: true,
      },
    });

    if (!user) {
      console.warn(`Cannot send KYC approved email: user ${privyUserId} not found`);
      return false;
    }

    const userProfile = await db.query.userProfilesTable.findFirst({
      where: eq((db.query.userProfilesTable as any).privyDid, privyUserId),
      columns: {
        email: true,
        businessName: true,
      },
    });

    if (!userProfile?.email) {
      console.warn(`Cannot send KYC approved email: no email found for user ${privyUserId}`);
      return false;
    }

    return await sendLoopsContact({
      email: userProfile.email,
      userId: privyUserId,
      firstName: userProfile.businessName || '',
      kycStatus: 'approved',
      kycStatusUpdatedAt: new Date().toISOString(),
      source: 'kyc_approved - KYC verified, check 0.finance/dashboard to use the app',
    });
  } catch (error) {
    console.error(`Error sending KYC approved email for user ${privyUserId}:`, error);
    return false;
  }
}
