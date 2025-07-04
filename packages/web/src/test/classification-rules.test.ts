import { describe, it, expect, beforeEach, vi } from 'vitest';
import { applyClassificationRules, applyClassificationToCard } from '@/server/services/classification-service';
import type { AiProcessedDocument } from '@/server/services/ai-service';
import { db } from '@/db';

// Mock the database
vi.mock('@/db', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          orderBy: vi.fn(() => Promise.resolve([]))
        }))
      }))
    }))
  }
}));

// Mock the AI SDK
vi.mock('ai', () => ({
  generateObject: vi.fn()
}));

describe('AI Classification Rules', () => {
  const mockUserId = 'test-user-123';
  
  const mockDocument: AiProcessedDocument = {
    documentType: 'invoice',
    cardTitle: 'Invoice from Acme Corp',
    extractedTitle: 'Invoice #INV-001',
    extractedSummary: 'Monthly software subscription',
    amount: 99.99,
    currency: 'USD',
    sellerName: 'Acme Corp',
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    aiRationale: 'This is a recurring software subscription invoice',
    buyerName: 'Test Company',
    items: [],
    invoiceNumber: 'INV-001',
    confidence: 95,
    requiresAction: true,
    suggestedActionLabel: 'Review invoice',
    triggeredClassifications: null,
    shouldAutoApprove: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Auto-Approve Rules', () => {
    it('should auto-approve invoices from trusted vendors', async () => {
      const { generateObject } = await import('ai');
      
      // Mock classification settings
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            orderBy: vi.fn(() => Promise.resolve([
              {
                id: 'rule-1',
                name: 'Auto-approve Acme Corp',
                prompt: 'Auto-approve all invoices from Acme Corp under $200',
                enabled: true,
                priority: 1,
              }
            ]))
          }))
        }))
      } as any);

      // Mock AI response
      vi.mocked(generateObject).mockResolvedValueOnce({
        object: {
          matchedRules: [{
            ruleName: 'Auto-approve Acme Corp',
            ruleId: 'rule-1',
            confidence: 98,
            actions: [{ type: 'approve', value: undefined }]
          }],
          suggestedCategories: ['software', 'subscription'],
          shouldAutoApprove: true,
          shouldMarkPaid: false,
          expenseCategory: 'Software',
          additionalNotes: 'Trusted vendor - auto-approved',
          overallConfidence: 98
        }
      } as any);

      const result = await applyClassificationRules(mockDocument, mockUserId);

      expect(result.shouldAutoApprove).toBe(true);
      expect(result.matchedRules).toHaveLength(1);
      expect(result.matchedRules[0].ruleName).toBe('Auto-approve Acme Corp');
      expect(result.matchedRules[0].confidence).toBe(98);
    });

    it('should not auto-approve when amount exceeds threshold', async () => {
      const { generateObject } = await import('ai');
      
      const highAmountDocument = {
        ...mockDocument,
        amount: 500.00,
      };

      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            orderBy: vi.fn(() => Promise.resolve([
              {
                id: 'rule-1',
                name: 'Auto-approve small amounts',
                prompt: 'Auto-approve invoices under $100',
                enabled: true,
                priority: 1,
              }
            ]))
          }))
        }))
      } as any);

      vi.mocked(generateObject).mockResolvedValueOnce({
        object: {
          matchedRules: [],
          suggestedCategories: [],
          shouldAutoApprove: false,
          shouldMarkPaid: false,
          expenseCategory: null,
          additionalNotes: 'Amount exceeds auto-approval threshold',
          overallConfidence: 95
        }
      } as any);

      const result = await applyClassificationRules(highAmountDocument, mockUserId);

      expect(result.shouldAutoApprove).toBe(false);
      expect(result.matchedRules).toHaveLength(0);
    });
  });

  describe('Auto-Ignore Rules', () => {
    it('should auto-dismiss other documents marked as promotional', async () => {
      const { generateObject } = await import('ai');
      
      const promoDocument: AiProcessedDocument = {
        ...mockDocument,
        documentType: 'other_document',
        cardTitle: 'Special Offer - 50% Off!',
        extractedSummary: 'Limited time promotional offer',
        sellerName: 'Marketing Company',
        aiRationale: 'This appears to be a promotional email',
        invoiceNumber: null,
        buyerName: null,
        dueDate: null,
        items: null,
      };

      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            orderBy: vi.fn(() => Promise.resolve([
              {
                id: 'rule-2',
                name: 'Ignore promotional emails',
                prompt: 'Auto-dismiss promotional emails, marketing offers, and spam',
                enabled: true,
                priority: 1,
              }
            ]))
          }))
        }))
      } as any);

      vi.mocked(generateObject).mockResolvedValueOnce({
        object: {
          matchedRules: [{
            ruleName: 'Ignore promotional emails',
            ruleId: 'rule-2',
            confidence: 95,
            actions: [{ type: 'dismiss', value: undefined }]
          }],
          suggestedCategories: ['spam', 'promotional'],
          shouldAutoApprove: false,
          shouldMarkPaid: false,
          expenseCategory: null,
          additionalNotes: 'Promotional content - auto-dismissed',
          overallConfidence: 95
        }
      } as any);

      const result = await applyClassificationRules(promoDocument, mockUserId);
      
      // Create a mock card and apply classification
      const mockCard = {
        status: 'pending',
        requiresAction: true,
      };
      
      // For auto-dismiss, we need to handle this in the card application
      const updatedCard = applyClassificationToCard(result, mockCard);
      
      expect(result.matchedRules).toHaveLength(1);
      expect(result.matchedRules[0].actions[0].type).toBe('dismiss');
    });
  });

  describe('Auto Mark as Seen Rules', () => {
    it('should auto-mark receipts as seen', async () => {
      const { generateObject } = await import('ai');
      
      const receiptDocument: AiProcessedDocument = {
        ...mockDocument,
        documentType: 'receipt',
        cardTitle: 'Receipt from Coffee Shop',
        amount: 4.50,
        sellerName: 'Local Coffee Shop',
      };

      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            orderBy: vi.fn(() => Promise.resolve([
              {
                id: 'rule-3',
                name: 'Auto-process small receipts',
                prompt: 'Auto-mark as seen all receipts under $10',
                enabled: true,
                priority: 1,
              }
            ]))
          }))
        }))
      } as any);

      vi.mocked(generateObject).mockResolvedValueOnce({
        object: {
          matchedRules: [{
            ruleName: 'Auto-process small receipts',
            ruleId: 'rule-3',
            confidence: 99,
            actions: [{ type: 'mark_seen', value: undefined }]
          }],
          suggestedCategories: ['food', 'beverage'],
          shouldAutoApprove: false,
          shouldMarkPaid: false,
          expenseCategory: 'Food & Beverage',
          additionalNotes: 'Small receipt - auto-marked as seen',
          overallConfidence: 99
        }
      } as any);

      const result = await applyClassificationRules(receiptDocument, mockUserId);
      
      expect(result.matchedRules).toHaveLength(1);
      expect(result.matchedRules[0].actions[0].type).toBe('mark_seen');
      expect(result.expenseCategory).toBe('Food & Beverage');
    });
  });

  describe('Multiple Rule Matching', () => {
    it('should apply multiple matching rules with different actions', async () => {
      const { generateObject } = await import('ai');
      
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            orderBy: vi.fn(() => Promise.resolve([
              {
                id: 'rule-1',
                name: 'Software subscriptions',
                prompt: 'Categorize software subscriptions and add to IT expenses',
                enabled: true,
                priority: 1,
              },
              {
                id: 'rule-2',
                name: 'Recurring payments',
                prompt: 'Auto-approve recurring payments under $100',
                enabled: true,
                priority: 2,
              }
            ]))
          }))
        }))
      } as any);

      vi.mocked(generateObject).mockResolvedValueOnce({
        object: {
          matchedRules: [
            {
              ruleName: 'Software subscriptions',
              ruleId: 'rule-1',
              confidence: 95,
              actions: [
                { type: 'add_category', value: 'software' },
                { type: 'set_expense_category', value: 'IT' }
              ]
            },
            {
              ruleName: 'Recurring payments',
              ruleId: 'rule-2',
              confidence: 90,
              actions: [{ type: 'approve', value: undefined }]
            }
          ],
          suggestedCategories: ['software', 'subscription', 'recurring'],
          shouldAutoApprove: true,
          shouldMarkPaid: false,
          expenseCategory: 'IT',
          additionalNotes: 'Multiple rules matched',
          overallConfidence: 92
        }
      } as any);

      const result = await applyClassificationRules(mockDocument, mockUserId);
      
      expect(result.matchedRules).toHaveLength(2);
      expect(result.shouldAutoApprove).toBe(true);
      expect(result.expenseCategory).toBe('IT');
      expect(result.suggestedCategories).toContain('software');
    });
  });

  describe('Card Status Updates', () => {
    it('should correctly update card status for auto-approval', () => {
      const mockCard = {
        status: 'pending',
        requiresAction: true,
        suggestedActionLabel: null,
        categories: [],
      };

      const classificationResult = {
        matchedRules: [{
          ruleName: 'Auto-approve',
          ruleId: 'rule-1',
          confidence: 95,
          actions: [{ type: 'approve' as const, value: undefined }]
        }],
        suggestedCategories: ['approved'],
        shouldAutoApprove: true,
        shouldMarkPaid: false,
        expenseCategory: null,
        additionalNotes: null,
        overallConfidence: 95
      };

      const updatedCard = applyClassificationToCard(classificationResult, mockCard);

      expect(updatedCard.status).toBe('auto');
      expect(updatedCard.requiresAction).toBe(false);
      expect(updatedCard.suggestedActionLabel).toBe('Auto-approved');
      expect(updatedCard.autoApproved).toBe(true);
    });

    it('should mark card as paid when specified', () => {
      const mockCard = {
        paymentStatus: 'unpaid',
        paidAt: null,
      };

      const classificationResult = {
        matchedRules: [{
          ruleName: 'Mark paid',
          ruleId: 'rule-1',
          confidence: 95,
          actions: [{ type: 'mark_paid' as const, value: undefined }]
        }],
        suggestedCategories: [],
        shouldAutoApprove: false,
        shouldMarkPaid: true,
        expenseCategory: null,
        additionalNotes: null,
        overallConfidence: 95
      };

      const updatedCard = applyClassificationToCard(classificationResult, mockCard);

      expect(updatedCard.paymentStatus).toBe('paid');
      expect(updatedCard.paidAt).toBeInstanceOf(Date);
    });

    it('should add categories and expense tracking', () => {
      const mockCard = {
        categories: [],
        expenseCategory: null,
        addedToExpenses: false,
        expenseAddedAt: null,
      };

      const classificationResult = {
        matchedRules: [{
          ruleName: 'Categorize expense',
          ruleId: 'rule-1',
          confidence: 95,
          actions: [
            { type: 'add_category' as const, value: 'office-supplies' },
            { type: 'set_expense_category' as const, value: 'Office' }
          ]
        }],
        suggestedCategories: ['supplies', 'business'],
        shouldAutoApprove: false,
        shouldMarkPaid: false,
        expenseCategory: 'Office',
        additionalNotes: null,
        overallConfidence: 95
      };

      const updatedCard = applyClassificationToCard(classificationResult, mockCard);

      expect(updatedCard.categories).toContain('office-supplies');
      expect(updatedCard.categories).toContain('supplies');
      expect(updatedCard.categories).toContain('business');
      expect(updatedCard.expenseCategory).toBe('Office');
      expect(updatedCard.addedToExpenses).toBe(true);
      expect(updatedCard.expenseAddedAt).toBeInstanceOf(Date);
    });
  });

  describe('Error Handling', () => {
    it('should return empty result when no rules are configured', async () => {
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            orderBy: vi.fn(() => Promise.resolve([]))
          }))
        }))
      } as any);

      const result = await applyClassificationRules(mockDocument, mockUserId);

      expect(result.matchedRules).toHaveLength(0);
      expect(result.shouldAutoApprove).toBe(false);
      expect(result.overallConfidence).toBe(0);
    });

    it('should handle AI service errors gracefully', async () => {
      const { generateObject } = await import('ai');
      
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            orderBy: vi.fn(() => Promise.resolve([
              {
                id: 'rule-1',
                name: 'Test rule',
                prompt: 'Test prompt',
                enabled: true,
                priority: 1,
              }
            ]))
          }))
        }))
      } as any);

      vi.mocked(generateObject).mockRejectedValueOnce(new Error('AI service error'));

      const result = await applyClassificationRules(mockDocument, mockUserId);

      expect(result.matchedRules).toHaveLength(0);
      expect(result.shouldAutoApprove).toBe(false);
      expect(result.overallConfidence).toBe(0);
    });
  });
}); 