import { tool } from 'ai';
import { z } from 'zod';

const demoToolSchema = z.object({
  query: z.string().optional(),
  type: z.enum(['invoice', 'client', 'payment']).default('invoice'),
});

const mockInvoiceData = {
  invoice: {
    meta: {
      format: 'rnf_invoice',
      version: '0.0.3',
    },
    creationDate: new Date().toISOString(),
    invoiceNumber: `INV-${Date.now()}`,
    sellerInfo: {
      businessName: 'HyprSqurl Technologies',
      email: 'billing@hyprsqrl.com',
      firstName: 'Alex',
      lastName: 'Smith',
      phone: '+1 (555) 123-4567',
      address: {
        'street-address': '789 Innovation Drive',
        locality: 'San Francisco',
        region: 'CA',
        'postal-code': '94105',
        'country-name': 'USA',
      },
      taxRegistration: 'US987654321',
      companyRegistration: 'C12345678',
      miscellaneous: {
        website: 'https://hyprsqrl.com',
        timezone: 'America/Los_Angeles',
      },
    },
    buyerInfo: {
      businessName: 'Company Inc',
      email: 'billing@company.com',
      address: {
        'street-address': '123 Tech Avenue',
        locality: 'San Francisco',
        region: 'CA',
        'postal-code': '94105',
        'country-name': 'USA',
      },
      taxRegistration: 'US123456789',
    },
    defaultCurrency: 'USD',
    invoiceItems: [
      {
        name: 'AWS EC2 Instances - t3.large',
        quantity: 4,
        unitPrice: '186.99',
        currency: 'USD',
        tax: {
          type: 'percentage',
          amount: '8.5',
        },
        reference: 'AWS-EC2-T3L',
      },
      {
        name: 'AWS S3 Storage (500GB)',
        quantity: 1,
        unitPrice: '245.00',
        currency: 'USD',
        tax: {
          type: 'percentage',
          amount: '8.5',
        },
        reference: 'AWS-S3-500',
      },
      {
        name: 'AWS Lambda Functions (1M requests)',
        quantity: 1,
        unitPrice: '207.02',
        currency: 'USD',
        tax: {
          type: 'percentage',
          amount: '8.5',
        },
        reference: 'AWS-LAMBDA-1M',
      },
    ],
    paymentTerms: {
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      lateFeesPercent: 2.5,
    },
    note: 'Please process payment within the next 7 days. For any billing inquiries, contact aws-billing@amazon.com',
    terms:
      'Payment is due within 7 days of invoice date. Late payments will incur a 2.5% fee.',
    purchaseOrderId: 'PO-AWS-2024-03',
  },
};

const mockClientData = {
  name: 'Company Inc',
  contact: {
    email: 'billing@company.com',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Tech Avenue',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA',
    },
  },
  paymentHistory: {
    lastPayment: '2024-02-15',
    averagePaymentTime: '6 days',
    preferredPaymentMethod: 'Credit Card',
  },
};

const mockPaymentData = {
  methods: [
    {
      type: 'Credit Card',
      last4: '4567',
      expiryDate: '12/25',
    },
    {
      type: 'ACH',
      accountLast4: '9876',
      routingNumber: '123456789',
    },
    {
      type: 'Crypto',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    },
  ],
  terms: {
    net: 7,
    earlyPaymentDiscount: '2%',
    lateFee: '2.5%',
  },
};

export const demoTool = tool({
  description:
    'Use me when demo is on Returns mock data for testing invoice processing',
  parameters: demoToolSchema,
  execute: async ({ query, type }) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    switch (type) {
      case 'invoice':
        return mockInvoiceData;
      case 'client':
        return mockClientData;
      case 'payment':
        return mockPaymentData;
      default:
        return mockInvoiceData;
    }
  },
});
