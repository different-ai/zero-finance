import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { processEmailsToInboxCards } from '../services/email-processor';
import type { SimplifiedEmail } from '../services/gmail-service';
import { db } from '@/db';
import { actionLedger } from '@/db/schema';

export const processSampleEmailInputSchema = z.object({
  type: z.enum(['invoice', 'receipt', 'bank-transaction']).default('invoice'),
});

export async function processSampleEmail(userId: string, type: 'invoice' | 'receipt' | 'bank-transaction') {
  const timestamp = new Date();
  
  // Create sample email objects
  const sampleEmails: Record<string, SimplifiedEmail> = {
    'invoice': {
      id: `sample-invoice-${Date.now()}`,
      threadId: `thread-${Date.now()}`,
      from: 'billing@cloudservices.com',
      subject: 'Invoice #INV-2024-001 - Cloud Services Subscription',
      snippet: 'Please find attached your invoice for this month\'s cloud services subscription.',
      textBody: `Hi there,

Please find attached your invoice for this month's cloud services subscription. The total amount due is $1,250.00 with payment due by ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}.

This invoice covers:
- Premium hosting plan - $850.00
- Additional storage (500GB) - $200.00
- SSL certificates - $100.00
- Domain management - $100.00

Please remit payment via wire transfer or credit card through our payment portal.

Best regards,
Cloud Services Billing Team`,
      date: timestamp.toISOString(),
      attachments: [],
    },
    'receipt': {
      id: `sample-receipt-${Date.now()}`,
      threadId: `thread-${Date.now()}`,
      from: 'receipts@amazon.com',
      subject: 'Your order has been delivered - Order #123-4567890',
      snippet: 'Your order has been delivered! Here\'s your receipt for your records.',
      textBody: `Hello,

Your order has been delivered! Here's your receipt for your records.

Order Details:
Order Number: #123-4567890
Order Date: ${timestamp.toLocaleDateString()}
Total Amount: $347.92

Items Purchased:
- Laptop Stand (Ergonomic) - $89.99
- Wireless Mouse & Keyboard Set - $129.99
- USB-C Hub (7-in-1) - $79.99
- HDMI Cable (6ft, 2-pack) - $19.99

Subtotal: $319.96
Tax: $27.96
Total: $347.92

Thank you for your business!

Amazon Business Team`,
      date: timestamp.toISOString(),
      attachments: [],
    },
    'bank-transaction': {
      id: `sample-transaction-${Date.now()}`,
      threadId: `thread-${Date.now()}`,
      from: 'notifications@chase.com',
      subject: 'Wire Transfer Confirmation - QuickBooks Payroll',
      snippet: 'This email confirms your recent wire transfer has been completed.',
      textBody: `Dear Business Account Holder,

This email confirms your recent wire transfer has been completed.

Transaction Details:
Transaction ID: WT-2024-78901234
Date: ${timestamp.toLocaleDateString()}
Amount: $8,457.23

Transfer Details:
From: Your Business Checking (****1234)
To: QuickBooks Payroll Services
Reference: Payroll Period 01/15 - 01/31

Vendor Information:
Vendor: QuickBooks Payroll
Category: Payroll Services
Tax ID: 77-0123456

This transfer covered payroll for 12 employees including:
- Base salaries: $6,500.00
- Payroll taxes: $1,457.23
- Processing fee: $500.00

If you have any questions about this transaction, please contact us.

Chase Business Banking`,
      date: timestamp.toISOString(),
      attachments: [],
    }
  };

  const sampleEmail = sampleEmails[type];
  if (!sampleEmail) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid sample type',
    });
  }

  // Process the sample email through the real AI pipeline
  console.log('0xHypr', 'Processing sample email through AI pipeline:', type);
  const cards = await processEmailsToInboxCards(
    [sampleEmail],
    userId
  );

  if (cards.length === 0) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to process sample email through AI pipeline',
    });
  }

  // Log the action for the first card
  const firstCard = cards[0];
  await db.insert(actionLedger).values({
    approvedBy: userId,
    inboxCardId: firstCard.id,
    actionTitle: `Sample ${type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Processed`,
    actionSubtitle: `Demo ${type === 'bank-transaction' ? 'transaction' : type} processed through AI pipeline`,
    actionType: 'demo',
    sourceType: 'email',
    sourceDetails: {
      isDemoEmail: true,
      sampleType: type,
      subject: sampleEmail.subject,
      aiProcessed: true,
      modelUsed: 'o3-2025-04-16'
    },
    originalCardData: firstCard,
    status: 'executed' as const,
    executedAt: timestamp,
    note: `Sample ${type} processed through real AI pipeline for demonstration`,
  });

  return { 
    success: true, 
    message: `Sample ${type === 'bank-transaction' ? 'transaction' : type} processed through AI successfully`,
    cardId: firstCard.id
  };
}