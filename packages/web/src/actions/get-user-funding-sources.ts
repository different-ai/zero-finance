'use server';
import { unstable_cache as cache } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { userFundingSources } from '@/db/schema';

// Update the return type to include new fields
export type UserFundingSourceDisplayData = {
  id: string;
  sourceAccountType: 'us_ach' | 'iban' | 'uk_details' | 'other';
  sourceBankName?: string | null;
  // Store full identifiers without masking
  sourceIdentifier?: string | null; // Full account number or IBAN
  sourceAccountNumber?: string | null;
  sourceIban?: string | null;
  sourceRoutingNumber?: string | null; // US routing number
  sourceBicSwift?: string | null; // IBAN BIC/SWIFT code
  sourcePaymentRail?: string | null;
  destinationCurrency?: string | null;
  destinationAddress?: string | null;
  destinationPaymentRail?: string | null;
};

export const getUserFundingSources = cache(
  async (privyDid: string): Promise<UserFundingSourceDisplayData[]> => {
    // Add null/undefined check for privyDid
    if (!privyDid) {
      console.error('Attempted to fetch funding sources without privyDid');
      return []; 
    }

    try {
      const sources = await db
        .select({
          // Select all relevant fields
          id: userFundingSources.id,
          sourceAccountType: userFundingSources.sourceAccountType,
          sourceBankName: userFundingSources.sourceBankName,
          sourceAccountNumber: userFundingSources.sourceAccountNumber,
          sourceIban: userFundingSources.sourceIban,
          sourceRoutingNumber: userFundingSources.sourceRoutingNumber,
          sourceBicSwift: userFundingSources.sourceBicSwift,
          // Add other type-specific fields if needed (e.g., sortCode)
          sourcePaymentRail: userFundingSources.sourcePaymentRail,
          destinationCurrency: userFundingSources.destinationCurrency,
          destinationAddress: userFundingSources.destinationAddress,
          destinationPaymentRail: userFundingSources.destinationPaymentRail,
        })
        .from(userFundingSources)
        .where(eq(userFundingSources.userPrivyDid, privyDid));
      
      // Return full account details without masking
      return sources.map(source => {
        let fullIdentifier: string | null = null;
        if (source.sourceAccountType === 'us_ach' && source.sourceAccountNumber) {
          fullIdentifier = source.sourceAccountNumber;
        } else if (source.sourceAccountType === 'iban' && source.sourceIban) {
          fullIdentifier = source.sourceIban;
        } // Add more rules for uk_details, other as needed

        return {
          id: source.id,
          sourceAccountType: source.sourceAccountType,
          sourceBankName: source.sourceBankName,
          sourceIdentifier: fullIdentifier, // Return full identifier without masking
          sourceAccountNumber: source.sourceAccountNumber,
          sourceIban: source.sourceIban,
          sourceRoutingNumber: source.sourceRoutingNumber,
          sourceBicSwift: source.sourceBicSwift,
          sourcePaymentRail: source.sourcePaymentRail,
          destinationCurrency: source.destinationCurrency,
          destinationAddress: source.destinationAddress,
          destinationPaymentRail: source.destinationPaymentRail,
        };
      });

    } catch (error) {
      console.error(`Error fetching funding sources for user ${privyDid}:`, error);
      return []; // Explicitly return empty array on error
    }
  },
  ['user-funding-sources'], 
  { revalidate: 60 * 5 }
);
