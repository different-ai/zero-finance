import { describe, it, expect, vi } from 'vitest';

// We do NOT mock any API keys – the function hard-codes its own key. Instead, we stub the
// `generateObject` helper from the `ai` SDK so that the test runs deterministically and
// without making network requests.
vi.mock('ai', () => {
  // Build a minimal but valid mock response that matches the AiProcessedDocument schema.
  const mockProcessedDocument = {
    documentType: 'invoice',
    aiRationale: 'Contains the keyword "invoice" and an identifiable amount, due date, and currency.',
    confidence: 95,
    requiresAction: true,
    suggestedActionLabel: 'Pay Invoice',
    invoiceNumber: 'INV-123',
    buyerName: 'Buyer Co',
    sellerName: 'Seller Co',
    amount: 100,
    currency: 'USD',
    dueDate: '2024-09-15',
    issueDate: '2024-09-01',
    items: [],
    extractedTitle: null,
    extractedSummary: null,
  } as const;

  return {
    // `generateObject` resolves to an object shaped like the actual SDK output.
    generateObject: vi.fn().mockResolvedValue({ object: mockProcessedDocument, usage: {} }),
    streamText: vi.fn(),
    generateText: vi.fn(),
  };
});

import { processDocumentFromEmailText } from '@/server/services/ai-service';
import { generateObject } from 'ai';

const SAMPLE_EMAIL_SUBJECT = 'Invoice INV-123 due soon';
const SAMPLE_EMAIL_TEXT = `Hello Buyer Co,

Please find attached invoice INV-123 for the recent services provided. The total amount due is USD 100 and the payment is expected by 15-09-2024.

Best regards,
Seller Co`;

describe('processDocumentFromEmailText', () => {
  it('returns a structured invoice object when given an invoice email', async () => {
    const result = await processDocumentFromEmailText(SAMPLE_EMAIL_TEXT, SAMPLE_EMAIL_SUBJECT);

    // Ensure the processing function invoked the OpenAI wrapper exactly once.
    expect(generateObject).toHaveBeenCalledTimes(1);

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