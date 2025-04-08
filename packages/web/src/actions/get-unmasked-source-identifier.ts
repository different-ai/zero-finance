'use server';

// This is a temporary mock implementation 
// TODO: Replace with actual implementation from bank app during migration

export type UnmaskedSourceIdentifier = {
  identifier: string;
  routingNumber?: string;
  type: 'us_ach' | 'iban' | 'uk_details' | 'other';
};

export async function getUnmaskedSourceIdentifier(sourceId: string): Promise<UnmaskedSourceIdentifier | null> {
  console.log('Getting unmasked source identifier for source:', sourceId);
  
  // Mock data for now - will be replaced with actual DB query during migration
  if (sourceId === 'fs-mock-1') {
    return {
      identifier: '123456789012',
      routingNumber: '021000021',
      type: 'us_ach'
    };
  } else if (sourceId === 'fs-mock-2') {
    // This is a crypto address, so it doesn't have a source identifier
    return null;
  }
  
  // Default mock for other IDs
  return {
    identifier: '9876543210',
    type: 'iban'
  };
} 