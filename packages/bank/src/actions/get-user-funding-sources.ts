import { cache } from 'react';
import { eq } from 'drizzle-orm';
import { db, userFundingSources } from '../db';

// Update the return type to include new fields
export type UserFundingSourceDisplayData = {
  id: string;
  sourceAccountType: 'us_ach' | 'iban' | 'uk_details' | 'other';
  sourceBankName?: string | null;
  // Store potentially masked identifiers based on type
  sourceIdentifier?: string | null; // e.g., ****6603 or DE89 **** **** **** 1234
  sourcePaymentRail?: string | null;
  destinationCurrency?: string | null;
  destinationAddress?: string | null;
  destinationPaymentRail?: string | null;
};

export const getUserFundingSources = cache(
  async (privyDid: string): Promise<UserFundingSourceDisplayData[]> => {
    // ... null check ...

    try {
      const sources = await db
        .select({
          // Select all relevant fields
          id: userFundingSources.id,
          sourceAccountType: userFundingSources.sourceAccountType,
          sourceBankName: userFundingSources.sourceBankName,
          sourceAccountNumber: userFundingSources.sourceAccountNumber,
          sourceIban: userFundingSources.sourceIban,
          // Add other type-specific fields if needed (e.g., sortCode)
          sourcePaymentRail: userFundingSources.sourcePaymentRail,
          destinationCurrency: userFundingSources.destinationCurrency,
          destinationAddress: userFundingSources.destinationAddress,
          destinationPaymentRail: userFundingSources.destinationPaymentRail,
        })
        .from(userFundingSources)
        .where(eq(userFundingSources.userPrivyDid, privyDid));
      
      // Process to create a unified masked identifier
      return sources.map(source => {
        let maskedIdentifier: string | null = null;
        if (source.sourceAccountType === 'us_ach' && source.sourceAccountNumber) {
          maskedIdentifier = `****${source.sourceAccountNumber.slice(-4)}`;
        } else if (source.sourceAccountType === 'iban' && source.sourceIban) {
          // Mask IBAN (example: keep first 4 and last 4)
          maskedIdentifier = `${source.sourceIban.substring(0, 4)} **** **** **** ${source.sourceIban.slice(-4)}`; 
        } // Add more masking rules for uk_details, other as needed

        return {
          id: source.id,
          sourceAccountType: source.sourceAccountType,
          sourceBankName: source.sourceBankName,
          sourceIdentifier: maskedIdentifier, // Use the unified masked field
          sourcePaymentRail: source.sourcePaymentRail,
          destinationCurrency: source.destinationCurrency,
          destinationAddress: source.destinationAddress,
          destinationPaymentRail: source.destinationPaymentRail,
          // Omit raw account numbers/IBAN from the returned data
        };
      });

    } catch (error) {
      // ... error handling ...
    }
  },
  ['user-funding-sources'], 
  { revalidate: 60 * 5 }
);
