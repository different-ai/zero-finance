import { z } from 'zod';
import { tool } from 'ai';
import * as dataFormat from '@requestnetwork/data-format';

// Reuse the same schema from invoice-form.tsx
export const invoiceParserSchema = z.object({
  invoice: z.object({
    meta: z.object({
      format: z.literal('rnf_invoice'),
      version: z.string(),
    }),
    creationDate: z.string(),
    invoiceNumber: z.string(),
    sellerInfo: z.object({
      businessName: z.string().default('HyprSqurl Technologies'),
      email: z.string().email().default('billing@hyprsqrl.com'),
      firstName: z.string().default('Alex'),
      lastName: z.string().default('Smith'),
      phone: z.string().default('+1 (555) 123-4567'),
      address: z.object({
        'country-name': z.string().default('USA'),
        'extended-address': z.string().optional(),
        locality: z.string().default('San Francisco'),
        'post-office-box': z.string().optional(),
        'postal-code': z.string().default('94105'),
        region: z.string().default('CA'),
        'street-address': z.string().default('789 Innovation Drive'),
      }),
      taxRegistration: z.string().default('US987654321'),
      companyRegistration: z.string().default('C12345678'),
      miscellaneous: z.record(z.unknown()).default({
        website: 'https://hyprsqrl.com',
        timezone: 'America/Los_Angeles',
      }),
    }).default({}),
    buyerInfo: z.object({
      businessName: z.string().optional(),
      email: z.string().email().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      address: z.object({
        'country-name': z.string().optional(),
        'extended-address': z.string().optional(),
        locality: z.string().optional(),
        'post-office-box': z.string().optional(),
        'postal-code': z.string().optional(),
        region: z.string().optional(),
        'street-address': z.string().optional(),
      }).optional(),
      taxRegistration: z.string().optional(),
    }).optional(),
    defaultCurrency: z.string().optional(),
    invoiceItems: z.array(z.object({
      name: z.string().optional(),
      quantity: z.number().optional(),
      unitPrice: z.string().optional(),
      currency: z.string().optional(),
      tax: z.object({
        type: z.enum(['percentage', 'fixed']).optional(),
        amount: z.string().optional(),
      }).optional(),
      reference: z.string().optional(),
      deliveryDate: z.string().optional(),
      deliveryPeriod: z.string().optional(),
    })).optional().default([{
      name: 'Default Item',
      quantity: 1,
      unitPrice: '0',
      currency: 'ETH',
      tax: { type: 'percentage', amount: '0' }
    }]),
    paymentTerms: z.object({
      dueDate: z.string().optional(),
      lateFeesPercent: z.number().optional(),
      lateFeesFix: z.string().optional(),
    }).optional(),
    note: z.string().optional(),
    terms: z.string().optional(),
    purchaseOrderId: z.string().optional(),
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