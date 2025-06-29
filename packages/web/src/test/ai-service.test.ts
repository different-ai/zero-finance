import { describe, it, expect } from 'vitest';

/* Removing the mock – this test now exercises the real `ai` SDK and will make a network
   request. If the API key in `ai-service.ts` is invalid or rate-limited, this test may fail. */

/* eslint-disable no-console */

import { processDocumentFromEmailText } from '@/server/services/ai-service';

const SAMPLE_EMAIL_SUBJECT = 'Invoice INV-123 due soon';
const SAMPLE_EMAIL_TEXT = `Hello Buyer Co,

Please find attached invoice INV-123 for the recent services provided. The total amount due is USD 100 and the payment is expected by 15-09-2024.

Best regards,
Seller Co`;

describe('processDocumentFromEmailText', () => {
  it('returns a structured invoice object when given an invoice email', async () => {
    const result = await processDocumentFromEmailText(SAMPLE_EMAIL_TEXT, SAMPLE_EMAIL_SUBJECT);

    console.log('result', result);

    // Validate a few key fields on the returned document.
    expect(result).not.toBeNull();
    if (!result) return; // Type narrowing for the next assertions.

    expect(result.documentType).toBe('invoice');
    expect(result.invoiceNumber).toBe('INV-123');
    expect(result.amount).toBe(100);
    expect(result.currency).toBe('USD');
    expect(result.requiresAction).toBe(true);
  });
}); 