import { z } from 'zod';
import { tool } from 'ai';
import * as dataFormat from '@requestnetwork/data-format';

// Reuse the same schema from invoice-form.tsx
export const invoiceParserSchema = z.object({
  invoice: z.object({
   creationDate: z.string(),
    invoiceNumber: z.string(),
    sellerInfo: z.object({
      businessName: z.string(),
      email: z.string().email(),
      firstName: z.string(),
      lastName: z.string(),
      phone: z.string(),
      address: z.object({
        'country-name': z.string(),
        'extended-address': z.string(),
        locality: z.string(),
        'post-office-box': z.string(),
        'postal-code': z.string(),
        region: z.string(),
        'street-address': z.string(),
      }),
      taxRegistration: z.string(),
      companyRegistration: z.string(),
      miscellaneous: z.record(z.unknown()),
    }),
    buyerInfo: z.object({
      businessName: z.string(),
      email: z.string().email(),
      firstName: z.string(),
      lastName: z.string(),
      phone: z.string(),
      address: z.object({
        'country-name': z.string(),
        'extended-address': z.string(),
        locality: z.string(),
        'post-office-box': z.string(),
        'postal-code': z.string(),
        region: z.string(),
        'street-address': z.string(),
      }),
      taxRegistration: z.string(),
    }),
    defaultCurrency: z.string(),
    invoiceItems: z.array(z.object({
      name: z.string(),
      quantity: z.number(),
      unitPrice: z.string(),
      currency: z.string(),
      tax: z.object({
        type: z.enum(['percentage', 'fixed']),
        amount: z.string(),
      }),
      reference: z.string(),
      deliveryDate: z.string(),
      deliveryPeriod: z.string(),
    })),
    paymentTerms: z.object({
      dueDate: z.string(),
      lateFeesPercent: z.number(),
      lateFeesFix: z.string(),
    }),
    note: z.string(),
    terms: z.string(),
    purchaseOrderId: z.string(),
  }),
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