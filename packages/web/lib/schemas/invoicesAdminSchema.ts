import { z } from 'zod';

export const InvoiceSchema = z.object({
  invoiceNumber: z.string(),
  vendor: z.string(),
  amount: z.number(),
  invoiceDate: z.string(), // ISO date string
  dueDate: z.string(),     // ISO date string
});

export const AdminObligationSchema = z.object({
  obligation: z.string(),
  dueDate: z.string(),     // ISO date string
  notes: z.string().optional(),
});

export const InvoicesAndAdminSchema = z.object({
  invoices: z.array(InvoiceSchema),
  adminObligations: z.array(AdminObligationSchema),
});

export type Invoice = z.infer<typeof InvoiceSchema>;
export type AdminObligation = z.infer<typeof AdminObligationSchema>;
export type InvoicesAndAdmin = z.infer<typeof InvoicesAndAdminSchema>;
