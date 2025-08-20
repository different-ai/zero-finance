import { z } from 'zod';

// All fields must be required for OpenAI structured output
export const matchAdjustmentSchema = z.object({
  type: z.enum(['fee', 'fx', 'partial']),
  amount: z.number(),
  currency: z.string(), // Made required (will default to 'USD' in usage)
});

// Simplified schema for OpenAI compatibility
export const matchProposalSchema = z.object({
  matches: z.array(
    z.object({
      invoice_id: z.string(),
      transaction_id: z.string(),
      score: z.number().min(0).max(100),
      rationale: z.string(), // Made required (use empty string if none)
      adjustments: z.array(matchAdjustmentSchema), // Made required (use empty array if none)
    }),
  ),
  unmatched_invoices: z.array(z.string()), // Made required (use empty array if none)
});

export type MatchProposal = z.infer<typeof matchProposalSchema>;
export type MatchAdjustment = z.infer<typeof matchAdjustmentSchema>;
