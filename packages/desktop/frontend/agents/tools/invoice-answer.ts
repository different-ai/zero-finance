import { z } from 'zod';
import { tool } from 'ai';
import * as dataFormat from '@requestnetwork/data-format';

// Reuse the same schema from invoice-form.tsx
export const invoiceParserSchema = z.object({
  invoice: z.object({
    creationDate: z.string().nullable(),
    invoiceNumber: z.string().nullable(),
    sellerInfo: z.object({
      businessName: z.string().nullable(),
      email: z.string().nullable(),
      firstName: z.string().nullable(),
      lastName: z.string().nullable(),
      phone: z.string().nullable(),
      address: z.object({
        'country-name': z.string().nullable(),
        'extended-address': z.string().nullable(),
        locality: z.string().nullable(),
        'post-office-box': z.string().nullable(),
        'postal-code': z.string().nullable(),
        region: z.string().nullable(),
        'street-address': z.string().nullable(),
      }).nullable(),
      taxRegistration: z.string().nullable(),
      companyRegistration: z.string().nullable(),
      miscellaneous: z.record(z.string(), z.string()).nullable(),
    }).required(),
    buyerInfo: z.object({
      businessName: z.string().nullable(),
      email: z.string().nullable(),
      firstName: z.string().nullable(),
      lastName: z.string().nullable(),
      phone: z.string().nullable(),
      address: z.object({
        'country-name': z.string().nullable(),
        'extended-address': z.string().nullable(),
        locality: z.string().nullable(),
        'post-office-box': z.string().nullable(),
        'postal-code': z.string().nullable(),
        region: z.string().nullable(),
        'street-address': z.string().nullable(),
      }).nullable(),
      taxRegistration: z.string().nullable(),
    }).required(),
    defaultCurrency: z.string().nullable(),
    invoiceItems: z.array(z.object({
      name: z.string().nullable(),
      quantity: z.number().nullable(),
      unitPrice: z.string().nullable(),
      currency: z.string().nullable(),
      tax: z.object({
        type: z.enum(['percentage', 'fixed']).nullable(),
        amount: z.string().nullable(),
      }).nullable(),
      reference: z.string().nullable(),
      deliveryDate: z.string().nullable(),
      deliveryPeriod: z.string().nullable(),
    })).nullable(),
    paymentTerms: z.object({
      dueDate: z.string().nullable(),
      lateFeesPercent: z.number().nullable(),
      lateFeesFix: z.string().nullable(),
    }).nullable(),
    note: z.string().nullable(),
    terms: z.string().nullable(),
    purchaseOrderId: z.string().nullable(),
  }).required(),
});

export type InvoiceParserResult = z.infer<typeof invoiceParserSchema>;

export const invoiceAnswer = tool({
  description: 'Returns the final invoice object that was parsed/refined',
  parameters: invoiceParserSchema,
  execute: async (args: InvoiceParserResult) => {
    // Validate the invoice format using Request Network's validator
    const validationResult = dataFormat.validate(args.invoice);
    if (!validationResult.valid) {
      return {
        error: 'Invalid invoice format',
        details: validationResult.errors,
      };
    }
    return args;
  },
}); 