import { tool } from 'ai';
import { z } from 'zod';

// Simplified schema with required fields
const demoToolSchema = z.object({
  query: z.string(),
  type: z.enum(['invoice', 'payment']).default('invoice')
});

// Simplified invoice scenarios
const invoiceScenarios = {
  consultingInvoice: {
    invoice: {
      meta: {
        format: 'rnf_invoice',
        version: '0.0.3',
      },
      creationDate: new Date().toISOString(),
      invoiceNumber: 'INV-2024-001',
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
      },
      buyerInfo: {
        businessName: 'TechCorp Solutions',
        email: 'accounts@techcorp.com',
        address: {
          'street-address': '456 Enterprise Ave',
          locality: 'San Francisco',
          region: 'CA',
          'postal-code': '94108',
          'country-name': 'USA',
        },
      },
      invoiceItems: [
        {
          name: 'Technical Consulting Services',
          quantity: 40,
          unitPrice: '150.00',
          currency: 'USD',
          tax: {
            type: 'percentage',
            amount: '8.5',
          },
          reference: 'PROJ-2024-TC1',
        }
      ],
      paymentTerms: {
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        lateFeesPercent: 2.0,
      },
      note: 'Please process payment within 14 days. For any billing inquiries, contact billing@hyprsqrl.com',
    },
    context: {
      type: 'invoice',
      source: 'email',
      content: 'Hi Alex, Please send us an invoice for the 40 hours of technical consulting work completed last week at $150/hr. We\'ll process payment upon receipt. Thanks, TechCorp Team'
    }
  },

  milestoneInvoice: {
    invoice: {
      meta: {
        format: 'rnf_invoice',
        version: '0.0.3',
      },
      creationDate: new Date().toISOString(),
      invoiceNumber: 'INV-2024-002',
      sellerInfo: {
        businessName: 'HyprSqurl Technologies',
        email: 'billing@hyprsqrl.com',
      },
      buyerInfo: {
        businessName: 'StartupX',
        email: 'finance@startupx.com',
      },
      invoiceItems: [
        {
          name: 'Project Phase 1 Completion',
          quantity: 1,
          unitPrice: '5000.00',
          currency: 'USD',
          tax: {
            type: 'percentage',
            amount: '8.5',
          },
          reference: 'PROJ-PH1',
        }
      ],
      paymentTerms: {
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    context: {
      type: 'invoice',
      source: 'chat',
      content: 'Phase 1 is complete! Please send us your invoice for $5,000 and we\'ll process payment right away.'
    }
  }
};

const paymentScenarios = {
  vendorPayment: {
    payment: {
      vendor: 'CloudHost Services',
      amount: 2499.99,
      currency: 'USD',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      invoiceNumber: 'CH-2024-0123',
      paymentMethod: 'bank_transfer',
      accountDetails: {
        routingNumber: '021000021',
        accountNumber: 'XXXX4567',
      },
      reference: 'March Cloud Services',
    },
    context: {
      type: 'payment',
      source: 'email',
      content: 'Your CloudHost invoice #CH-2024-0123 for $2,499.99 is due in 5 days. Please process payment to avoid service interruption.'
    }
  },

  contractorPayment: {
    payment: {
      vendor: 'Jane Smith Design',
      amount: 1200.00,
      currency: 'USD',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      invoiceNumber: 'JSD-2024-45',
      paymentMethod: 'bank_transfer',
      accountDetails: {
        name: 'Jane Smith',
        routingNumber: '026009593',
        accountNumber: 'XXXX8901',
      },
    },
    context: {
      type: 'payment',
      source: 'invoice',
      content: 'Invoice from Jane Smith Design for UI/UX work. Amount: $1,200.00. Due within 3 days.'
    }
  }
};

// Export the demo tool with proper schema and implementation
export const demoTool = tool('demoTool', {
  description: 'Returns mock invoice or payment data for demo purposes',
  schema: demoToolSchema,
  execute: async ({ query, type }) => {
    // Simple matching logic
    if (type === 'invoice') {
      if (query.toLowerCase().includes('consulting')) {
        return invoiceScenarios.consultingInvoice;
      }
      return invoiceScenarios.milestoneInvoice;
    } else {
      if (query.toLowerCase().includes('cloud')) {
        return paymentScenarios.vendorPayment;
      }
      return paymentScenarios.contractorPayment;
    }
  }
});
