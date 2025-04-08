'use server';

// This is a temporary mock implementation 
// TODO: Replace with actual implementation from bank app during migration

export type UserFundingSourceDisplayData = {
  id: string;
  sourceBankName?: string | null;
  sourceIdentifier?: string;
  sourceAccountType: 'us_ach' | 'iban' | 'uk_details' | 'other';
  sourcePaymentRail?: string;
  destinationPaymentRail?: string;
  destinationAddress?: string;
  destinationCurrency?: string;
};

export async function getUserFundingSources(userId: string): Promise<UserFundingSourceDisplayData[]> {
  console.log('Getting funding sources for user:', userId);
  
  // Mock data for now - will be replaced with actual DB query during migration
  return [
    {
      id: 'fs-mock-1',
      sourceBankName: 'Mock Bank',
      sourceIdentifier: '****4321',
      sourceAccountType: 'us_ach',
      sourcePaymentRail: 'ach_push',
      destinationAddress: undefined,
      destinationCurrency: undefined
    },
    {
      id: 'fs-mock-2',
      sourceBankName: null,
      sourceIdentifier: undefined,
      sourceAccountType: 'other',
      sourcePaymentRail: undefined,
      destinationPaymentRail: 'erc20',
      destinationAddress: '0x1234567890abcdef1234567890abcdef12345678', 
      destinationCurrency: 'usdc'
    }
  ];
} 