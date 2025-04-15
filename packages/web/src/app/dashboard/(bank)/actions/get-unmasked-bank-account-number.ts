'use server';

import { db } from '@/db';
import { userFundingSources } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { PrivyClient } from '@privy-io/server-auth';
import { cookies } from 'next/headers';

// Initialize PrivyClient - use correct env var and ensure PRIVY_APP_SECRET is set
const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID || '', // Corrected env variable name
  process.env.PRIVY_APP_SECRET || '',
);

// Define the return type for the unmasked identifier
export type UnmaskedSourceIdentifier = {
  identifier: string;
  type: 'us_ach' | 'iban' | 'uk_details' | 'other';
} | null;

// Rename function and update return type
export async function getUnmaskedSourceIdentifier(fundingSourceId: string): Promise<UnmaskedSourceIdentifier> {
  // Correctly await cookies()
  const cookieStore = await cookies(); // Added await
  const token = cookieStore.get('privy-token')?.value; // Adjust cookie name if needed

  if (!token) {
    console.error('Unauthenticated attempt: No privy-token cookie found');
    return null;
  }

  let verifiedClaims;
  try {
    // Use privyClient instance to verify
    verifiedClaims = await privy.verifyAuthToken(token);
  } catch (error) {
    console.error('Auth token verification failed:', error);
    return null;
  }

  // Assuming the DID is in userId field of the verified claims
  const privyDid = verifiedClaims.userId; 

  if (!privyDid) {
    console.error('Could not extract privyDid (userId) from verified token claims');
    return null;
  }

  if (!fundingSourceId) {
    console.error('Funding source ID is required');
    return null;
  }

  try {
    // Select the type and necessary identifier fields
    const result = await db
      .select({
        accountType: userFundingSources.sourceAccountType,
        accountNumber: userFundingSources.sourceAccountNumber,
        iban: userFundingSources.sourceIban,
        // Add other relevant fields (bicSwift, sortCode) if needed for other types
      })
      .from(userFundingSources)
      .where(
        and(
          eq(userFundingSources.id, fundingSourceId),
          eq(userFundingSources.userPrivyDid, privyDid)
        )
      )
      .limit(1);

    if (result.length > 0) {
      const source = result[0];
      let identifier: string | null = null;

      // Return the correct identifier based on type
      if (source.accountType === 'us_ach' && source.accountNumber) {
        identifier = source.accountNumber;
      } else if (source.accountType === 'iban' && source.iban) {
        identifier = source.iban;
      } // Add cases for uk_details, etc.

      if (identifier) {
        return { identifier: identifier, type: source.accountType };
      } else {
        console.warn(`Could not determine unmasked identifier for source ${fundingSourceId} of type ${source.accountType}`);
        return null;
      }
    } else {
      console.warn(`No source found for id ${fundingSourceId} owned by user ${privyDid}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching unmasked identifier for source ${fundingSourceId}:`, error);
    return null; 
  }
} 