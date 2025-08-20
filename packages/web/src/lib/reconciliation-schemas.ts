import { z } from 'zod';
import { aiDocumentProcessSchema } from './ai-schemas';

// Match adjustment schema for handling fees, FX, partial payments
export const matchAdjustmentSchema = z.object({
  type: z.enum(['fee', 'fx', 'partial']),
  amount: z.number(),
  currency: z.string().optional(),
});

// Match proposal schema for AI-generated matches
export const matchProposalSchema = z.object({
  matches: z.array(
    z.object({
      invoice_id: z.string(),
      transaction_id: z.string(),
      score: z.number().min(0).max(100),
      rationale: z.string().nullable().optional(),
      adjustments: z.array(matchAdjustmentSchema).optional(),
    }),
  ),
  unmatched_invoices: z.array(z.string()).default([]),
});

// CSV transaction import schema
export const csvTransactionSchema = z.object({
  date: z.string(), // Will be parsed to date
  amount: z.string(), // Will be parsed to number
  description: z.string().optional(),
  counterparty: z.string().optional(),
  reference: z.string().optional(),
  currency: z.string().default('USD'),
});

// Invoice upload response schema
export const invoiceUploadResponseSchema = z.object({
  invoice: z.object({
    id: z.string(),
    invoiceNumber: z.string().nullable(),
    vendor: z.string().nullable(),
    issueDate: z.string().nullable(),
    dueDate: z.string().nullable(),
    currency: z.string(),
    totalAmount: z.number(),
    parsedConfidence: z.number(),
    docUrl: z.string().nullable(),
  }),
});

// Bulk transaction import schema
export const bulkTransactionImportSchema = z.object({
  transactions: z.array(csvTransactionSchema),
  source: z.string().default('csv_import'),
});

// Match decision schema
export const matchDecisionSchema = z.object({
  matchId: z.string(),
  decision: z.enum(['confirmed', 'rejected']),
  decidedBy: z.string(),
  notes: z.string().optional(),
});

// Export types
export type MatchProposal = z.infer<typeof matchProposalSchema>;
export type MatchAdjustment = z.infer<typeof matchAdjustmentSchema>;
export type CSVTransaction = z.infer<typeof csvTransactionSchema>;
export type InvoiceUploadResponse = z.infer<typeof invoiceUploadResponseSchema>;
export type BulkTransactionImport = z.infer<typeof bulkTransactionImportSchema>;
export type MatchDecision = z.infer<typeof matchDecisionSchema>;
