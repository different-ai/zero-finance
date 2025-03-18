import { z } from 'zod';

// Invoice parser schema definition
export const invoiceParserSchema = z.object({
  invoice: z
    .object({
      creationDate: z.string().nullable(),
      invoiceNumber: z.string().nullable(),
      sellerInfo: z
        .object({
          businessName: z.string().nullable(),
          email: z.string().nullable(),
          firstName: z.string().nullable(),
          lastName: z.string().nullable(),
          phone: z.string().nullable(),
          address: z
            .object({
              'country-name': z.string().nullable(),
              'extended-address': z.string().nullable(),
              locality: z.string().nullable(),
              'post-office-box': z.string().nullable(),
              'postal-code': z.string().nullable(),
              region: z.string().nullable(),
              'street-address': z.string().nullable(),
            })
            .nullable(),
          taxRegistration: z.string().nullable(),
          companyRegistration: z.string().nullable(),
          miscellaneous: z.record(z.string(), z.string()).nullable(),
        })
        .required(),
      buyerInfo: z
        .object({
          businessName: z.string().nullable(),
          email: z.string().nullable(),
          firstName: z.string().nullable(),
          lastName: z.string().nullable(),
          phone: z.string().nullable(),
          address: z
            .object({
              'country-name': z.string().nullable(),
              'extended-address': z.string().nullable(),
              locality: z.string().nullable(),
              'post-office-box': z.string().nullable(),
              'postal-code': z.string().nullable(),
              region: z.string().nullable(),
              'street-address': z.string().nullable(),
            })
            .nullable(),
          taxRegistration: z.string().nullable(),
        })
        .required(),
      defaultCurrency: z.string().nullable(),
      invoiceItems: z
        .array(
          z.object({
            name: z.string().nullable(),
            quantity: z.number().nullable(),
            unitPrice: z.string().nullable(),
            currency: z.string().nullable(),
            tax: z
              .object({
                type: z.enum(['percentage', 'fixed']).nullable(),
                amount: z.string().nullable(),
              })
              .nullable(),
            reference: z.string().nullable(),
            deliveryDate: z.string().nullable(),
            deliveryPeriod: z.string().nullable(),
          })
        )
        .nullable(),
      paymentTerms: z
        .object({
          dueDate: z.string().nullable(),
          lateFeesPercent: z.number().nullable(),
          lateFeesFix: z.string().nullable(),
        })
        .nullable(),
      note: z.string().nullable(),
      terms: z.string().nullable(),
      purchaseOrderId: z.string().nullable(),
    })
    .required(),
});

// Simple validation function for invoices
export function validateInvoice(invoice: any) {
  // Perform basic validation checks
  const errors = [];

  // Check for required fields
  if (!invoice) {
    return { valid: false, errors: ['Invoice data is missing'] };
  }

  if (!invoice.sellerInfo) {
    errors.push('Seller information is missing');
  }

  if (!invoice.buyerInfo) {
    errors.push('Buyer information is missing');
  }

  // Return validation result
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

// Invoice answer tool implementation
export const invoiceAnswerTool = {
  description: 'Returns the final invoice object that was parsed/refined',
  parameters: invoiceParserSchema,
  execute: async (args: z.infer<typeof invoiceParserSchema>) => {
    // Validate the invoice format using our simple validator
    const validationResult = validateInvoice(args.invoice);
    if (!validationResult.valid) {
      return {
        error: 'Invalid invoice format',
        details: validationResult.errors,
      };
    }

    // Extract invoice details for human-readable explanation
    const { invoice } = args;
    const seller = invoice.sellerInfo.businessName || 'Unknown Seller';
    const buyer = invoice.buyerInfo.businessName || 'Unknown Buyer';
    const itemCount = invoice.invoiceItems?.length || 0;

    // Identify missing fields
    const missingFields: string[] = [];
    if (!invoice.sellerInfo.businessName)
      missingFields.push('Seller Business Name');
    if (!invoice.sellerInfo.email) missingFields.push('Seller Email');
    if (!invoice.buyerInfo.businessName)
      missingFields.push('Buyer Business Name');
    if (!invoice.buyerInfo.email) missingFields.push('Buyer Email');
    if (!invoice.invoiceItems || invoice.invoiceItems.length === 0)
      missingFields.push('Invoice Items');

    return {
      invoiceData: invoice,
      explanation: `Invoice data has been processed for ${seller} to ${buyer} with ${itemCount} item(s). ${
        missingFields.length > 0
          ? 'Some fields are missing.'
          : 'All required fields are present.'
      }`,
      missingFields: missingFields.length > 0 ? missingFields : undefined,
    };
  },
};
