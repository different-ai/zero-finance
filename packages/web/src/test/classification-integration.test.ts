import { describe, it, expect, beforeEach, vi } from 'vitest';
import { processDocumentFromEmailText } from '@/server/services/ai-service';
import { applyClassificationRules, applyClassificationToCard } from '@/server/services/classification-service';
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

describe('AI Classification Integration Tests', () => {
  const mockUserId = 'test-user-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('End-to-End Classification Flow', () => {
    it('should process an invoice email and auto-approve based on rules', async () => {
      const { generateObject } = await import('ai');
      
      // Email content
      const emailText = `
        Invoice #INV-2024-001
        
        From: Acme Software Corp
        To: Test Company Inc
        
        Date: January 15, 2024
        Due Date: February 15, 2024
        
        Description: Monthly SaaS subscription
        Amount: $99.00
        
        Please remit payment by the due date.
      `;
      const emailSubject = 'Invoice from Acme Software - January 2024';

      // Mock AI processing of email
      vi.mocked(generateObject).mockResolvedValueOnce({
        object: {
          documentType: 'invoice',
          cardTitle: 'Acme Software Invoice #INV-2024-001 - $99.00',
          extractedTitle: 'Invoice #INV-2024-001',
          extractedSummary: 'Monthly SaaS subscription invoice from Acme Software',
          amount: 99.00,
          currency: 'USD',
          sellerName: 'Acme Software Corp',
          buyerName: 'Test Company Inc',
          issueDate: '2024-01-15',
          dueDate: '2024-02-15',
          invoiceNumber: 'INV-2024-001',
          aiRationale: 'Standard monthly subscription invoice from a software vendor',
          confidence: 95,
          requiresAction: true,
          suggestedActionLabel: 'Pay Invoice',
          items: [{
            name: 'Monthly SaaS subscription',
            quantity: 1,
            unitPrice: 99.00,
            total: 99.00
          }],
          triggeredClassifications: null,
          shouldAutoApprove: false,
        }
      } as any);

      // Process the email
      const processedDoc = await processDocumentFromEmailText(emailText, emailSubject);
      expect(processedDoc).toBeTruthy();
      expect(processedDoc?.documentType).toBe('invoice');
      expect(processedDoc?.amount).toBe(99.00);

      // Mock classification rules
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            orderBy: vi.fn(() => Promise.resolve([
              {
                id: 'rule-1',
                name: 'Auto-approve Acme invoices under $200',
                prompt: 'Automatically approve all invoices from Acme Software Corp that are under $200',
                enabled: true,
                priority: 1,
              }
            ]))
          }))
        }))
      } as any);

      // Mock classification result
      vi.mocked(generateObject).mockResolvedValueOnce({
        object: {
          matchedRules: [{
            ruleName: 'Auto-approve Acme invoices under $200',
            ruleId: 'rule-1',
            confidence: 98,
            actions: [
              { type: 'approve', value: undefined },
              { type: 'add_category', value: 'software' },
              { type: 'set_expense_category', value: 'IT' }
            ]
          }],
          suggestedCategories: ['software', 'subscription', 'saas'],
          shouldAutoApprove: true,
          shouldMarkPaid: false,
          expenseCategory: 'IT',
          additionalNotes: 'Trusted vendor invoice under threshold - auto-approved',
          overallConfidence: 98
        }
      } as any);

      // Apply classification rules
      const classification = await applyClassificationRules(processedDoc!, mockUserId);
      expect(classification.shouldAutoApprove).toBe(true);
      expect(classification.matchedRules).toHaveLength(1);
      expect(classification.expenseCategory).toBe('IT');

      // Create inbox card
      const mockCard = {
        id: 'card-123',
        status: 'pending',
        requiresAction: true,
        categories: [],
        ...processedDoc
      };

      // Apply classification to card
      const finalCard = applyClassificationToCard(classification, mockCard);
      
      expect(finalCard.status).toBe('auto');
      expect(finalCard.requiresAction).toBe(false);
      expect(finalCard.suggestedActionLabel).toBe('Auto-approved');
      expect(finalCard.categories).toContain('software');
      expect(finalCard.categories).toContain('subscription');
      expect(finalCard.expenseCategory).toBe('IT');
      expect(finalCard.addedToExpenses).toBe(true);
    });

    it('should process and auto-dismiss promotional emails', async () => {
      const { generateObject } = await import('ai');
      
      const emailText = `
        LIMITED TIME OFFER - 50% OFF ALL PRODUCTS!
        
        Don't miss out on our biggest sale of the year!
        Use code SAVE50 at checkout.
        
        Shop now at www.example-store.com
      `;
      const emailSubject = '🎉 Flash Sale - 50% Off Everything!';

      // Mock AI processing
      vi.mocked(generateObject).mockResolvedValueOnce({
        object: {
          documentType: 'other_document',
          cardTitle: 'Promotional Email - Flash Sale',
          extractedTitle: 'LIMITED TIME OFFER - 50% OFF',
          extractedSummary: 'Promotional email advertising 50% discount',
          amount: null,
          currency: null,
          sellerName: 'Example Store',
          buyerName: null,
          issueDate: null,
          dueDate: null,
          invoiceNumber: null,
          aiRationale: 'This is a promotional/marketing email, not a financial document',
          confidence: 95,
          requiresAction: false,
          suggestedActionLabel: null,
          items: null,
          triggeredClassifications: null,
          shouldAutoApprove: false,
        }
      } as any);

      const processedDoc = await processDocumentFromEmailText(emailText, emailSubject);
      expect(processedDoc?.documentType).toBe('other_document');

      // Mock auto-dismiss rule
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            orderBy: vi.fn(() => Promise.resolve([
              {
                id: 'rule-2',
                name: 'Auto-dismiss promotional emails',
                prompt: 'Automatically dismiss all promotional emails, marketing messages, and spam',
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
            ruleName: 'Auto-dismiss promotional emails',
            ruleId: 'rule-2',
            confidence: 99,
            actions: [
              { type: 'dismiss', value: undefined },
              { type: 'add_category', value: 'spam' }
            ]
          }],
          suggestedCategories: ['promotional', 'marketing'],
          shouldAutoApprove: false,
          shouldMarkPaid: false,
          expenseCategory: null,
          additionalNotes: 'Promotional content - auto-dismissed',
          overallConfidence: 99
        }
      } as any);

      const classification = await applyClassificationRules(processedDoc!, mockUserId);
      
      const mockCard = {
        id: 'card-124',
        status: 'pending',
        requiresAction: false,
        categories: [],
        ...processedDoc
      };

      const finalCard = applyClassificationToCard(classification, mockCard);
      
      expect(finalCard.status).toBe('dismissed');
      expect(finalCard.requiresAction).toBe(false);
      expect(finalCard.suggestedActionLabel).toBe('Auto-dismissed');
      expect(finalCard.categories).toContain('spam');
      expect(finalCard.categories).toContain('promotional');
    });

    it('should process receipts and auto-mark as seen for small amounts', async () => {
      const { generateObject } = await import('ai');
      
      const emailText = `
        Receipt
        
        Local Coffee Shop
        123 Main St
        
        Date: 2024-01-15
        
        Cappuccino    $4.50
        
        Total: $4.50
        
        Thank you for your business!
      `;
      const emailSubject = 'Your receipt from Local Coffee Shop';

      // Mock AI processing
      vi.mocked(generateObject).mockResolvedValueOnce({
        object: {
          documentType: 'receipt',
          cardTitle: 'Local Coffee Shop Receipt - $4.50',
          extractedTitle: 'Receipt',
          extractedSummary: 'Coffee purchase receipt',
          amount: 4.50,
          currency: 'USD',
          sellerName: 'Local Coffee Shop',
          buyerName: null,
          issueDate: '2024-01-15',
          dueDate: null,
          invoiceNumber: null,
          aiRationale: 'Small purchase receipt from a coffee shop',
          confidence: 98,
          requiresAction: false,
          suggestedActionLabel: 'Archive Receipt',
          items: [{
            name: 'Cappuccino',
            quantity: 1,
            unitPrice: 4.50,
            total: 4.50
          }],
          triggeredClassifications: null,
          shouldAutoApprove: false,
        }
      } as any);

      const processedDoc = await processDocumentFromEmailText(emailText, emailSubject);

      // Mock auto-mark as seen rule
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            orderBy: vi.fn(() => Promise.resolve([
              {
                id: 'rule-3',
                name: 'Auto-process small receipts',
                prompt: 'Automatically mark as seen all receipts under $10 and categorize them appropriately',
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
            confidence: 100,
            actions: [
              { type: 'mark_seen', value: undefined },
              { type: 'add_category', value: 'food-beverage' },
              { type: 'set_expense_category', value: 'Meals & Entertainment' }
            ]
          }],
          suggestedCategories: ['coffee', 'dining'],
          shouldAutoApprove: false,
          shouldMarkPaid: false,
          expenseCategory: 'Meals & Entertainment',
          additionalNotes: 'Small receipt - auto-marked as seen',
          overallConfidence: 100
        }
      } as any);

      const classification = await applyClassificationRules(processedDoc!, mockUserId);
      
      const mockCard = {
        id: 'card-125',
        status: 'pending',
        requiresAction: false,
        categories: [],
        ...processedDoc
      };

      const finalCard = applyClassificationToCard(classification, mockCard);
      
      expect(finalCard.status).toBe('seen');
      expect(finalCard.requiresAction).toBe(false);
      expect(finalCard.suggestedActionLabel).toBe('Auto-marked as seen');
      expect(finalCard.categories).toContain('food-beverage');
      expect(finalCard.categories).toContain('coffee');
      expect(finalCard.expenseCategory).toBe('Meals & Entertainment');
      expect(finalCard.addedToExpenses).toBe(true);
    });
  });

  describe('Complex Rule Scenarios', () => {
    it('should handle conflicting rules with priority', async () => {
      const { generateObject } = await import('ai');
      
      const mockDocument = {
        documentType: 'invoice' as const,
        cardTitle: 'Vendor X Invoice - $150',
        amount: 150,
        sellerName: 'Vendor X',
        confidence: 95,
        requiresAction: true,
        suggestedActionLabel: 'Review',
        extractedTitle: null,
        extractedSummary: null,
        currency: 'USD',
        buyerName: null,
        issueDate: null,
        dueDate: null,
        invoiceNumber: null,
        aiRationale: 'Standard invoice',
        items: null,
        triggeredClassifications: null,
        shouldAutoApprove: false,
      };

      // Mock multiple rules with different priorities
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            orderBy: vi.fn(() => Promise.resolve([
              {
                id: 'rule-1',
                name: 'Dismiss Vendor X',
                prompt: 'Dismiss all documents from Vendor X',
                enabled: true,
                priority: 1, // Higher priority
              },
              {
                id: 'rule-2',
                name: 'Auto-approve mid-range invoices',
                prompt: 'Auto-approve invoices between $100-$200',
                enabled: true,
                priority: 2, // Lower priority
              }
            ]))
          }))
        }))
      } as any);

      vi.mocked(generateObject).mockResolvedValueOnce({
        object: {
          matchedRules: [{
            ruleName: 'Dismiss Vendor X',
            ruleId: 'rule-1',
            confidence: 100,
            actions: [{ type: 'dismiss', value: undefined }]
          }],
          suggestedCategories: [],
          shouldAutoApprove: false,
          shouldMarkPaid: false,
          expenseCategory: null,
          additionalNotes: 'Higher priority rule applied - dismissed',
          overallConfidence: 100
        }
      } as any);

      const classification = await applyClassificationRules(mockDocument, mockUserId);
      const mockCard = { status: 'pending', requiresAction: true, categories: [] };
      const finalCard = applyClassificationToCard(classification, mockCard);
      
      // Should apply the dismiss action from the higher priority rule
      expect(finalCard.status).toBe('dismissed');
      expect(finalCard.suggestedActionLabel).toBe('Auto-dismissed');
    });

    it('should handle multiple actions from a single rule', async () => {
      const { generateObject } = await import('ai');
      
      const mockDocument = {
        documentType: 'invoice' as const,
        cardTitle: 'Monthly Hosting Invoice',
        amount: 50,
        sellerName: 'Cloud Provider Inc',
        confidence: 95,
        requiresAction: true,
        suggestedActionLabel: 'Review',
        extractedTitle: null,
        extractedSummary: null,
        currency: 'USD',
        buyerName: null,
        issueDate: null,
        dueDate: null,
        invoiceNumber: null,
        aiRationale: 'Recurring hosting invoice',
        items: null,
        triggeredClassifications: null,
        shouldAutoApprove: false,
      };

      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            orderBy: vi.fn(() => Promise.resolve([
              {
                id: 'rule-1',
                name: 'Process recurring IT expenses',
                prompt: 'Auto-approve, mark as paid, and categorize all recurring IT infrastructure expenses under $100',
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
            ruleName: 'Process recurring IT expenses',
            ruleId: 'rule-1',
            confidence: 95,
            actions: [
              { type: 'approve', value: undefined },
              { type: 'mark_paid', value: undefined },
              { type: 'add_category', value: 'infrastructure' },
              { type: 'add_category', value: 'recurring' },
              { type: 'set_expense_category', value: 'IT Infrastructure' }
            ]
          }],
          suggestedCategories: ['hosting', 'cloud'],
          shouldAutoApprove: true,
          shouldMarkPaid: true,
          expenseCategory: 'IT Infrastructure',
          additionalNotes: 'Recurring IT expense - fully processed',
          overallConfidence: 95
        }
      } as any);

      const classification = await applyClassificationRules(mockDocument, mockUserId);
      const mockCard = {
        status: 'pending',
        requiresAction: true,
        categories: [],
        paymentStatus: 'unpaid',
        paidAt: null,
        expenseCategory: null,
        addedToExpenses: false,
      };
      
      const finalCard = applyClassificationToCard(classification, mockCard);
      
      // Should apply all actions
      expect(finalCard.status).toBe('auto');
      expect(finalCard.paymentStatus).toBe('paid');
      expect(finalCard.paidAt).toBeInstanceOf(Date);
      expect(finalCard.categories).toContain('infrastructure');
      expect(finalCard.categories).toContain('recurring');
      expect(finalCard.categories).toContain('hosting');
      expect(finalCard.expenseCategory).toBe('IT Infrastructure');
      expect(finalCard.addedToExpenses).toBe(true);
    });
  });
}); 