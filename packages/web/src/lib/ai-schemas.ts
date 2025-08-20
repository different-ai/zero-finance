import { z } from 'zod';

// Schema for AI document processing (invoices, receipts, etc.)
export const aiDocumentProcessSchema = z.object({
  documentType: z
    .enum(['invoice', 'receipt', 'bill', 'statement', 'other_document'])
    .optional(),

  // Invoice specific fields
  invoiceNumber: z.string().nullable().optional(),
  invoiceDate: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  issueDate: z.string().nullable().optional(),

  // Vendor/Seller information
  sellerName: z.string().nullable().optional(),
  sellerAddress: z.string().nullable().optional(),
  sellerTaxId: z.string().nullable().optional(),

  // Buyer information
  buyerName: z.string().nullable().optional(),
  buyerAddress: z.string().nullable().optional(),

  // Financial details
  amount: z.number().nullable().optional(),
  subtotal: z.number().nullable().optional(),
  tax: z.number().nullable().optional(),
  taxRate: z.number().nullable().optional(),
  discount: z.number().nullable().optional(),
  shipping: z.number().nullable().optional(),
  currency: z.string().default('USD').optional(),

  // Payment information
  paymentMethod: z.string().nullable().optional(),
  paymentTerms: z.string().nullable().optional(),
  bankAccount: z.string().nullable().optional(),

  // Line items - all fields must be optional for OpenAI structured output
  lineItems: z
    .array(
      z.object({
        description: z.string().nullable().optional(),
        quantity: z.number().nullable().optional(),
        unitPrice: z.number().nullable().optional(),
        amount: z.number().nullable().optional(),
        tax: z.number().nullable().optional(),
      }),
    )
    .nullable()
    .optional(),

  // Additional metadata
  extractedTitle: z.string().nullable().optional(),
  extractedText: z.string().nullable().optional(),
  confidence: z.number().min(0).max(100).nullable().optional(),
  notes: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
});

export type AIDocumentProcessData = z.infer<typeof aiDocumentProcessSchema>;
