import { Agent, RecognizedInvoiceItem } from './base-agent';
import { generateObject } from 'ai';
import { z } from 'zod';
import { getApiKey } from '@/stores/api-key-store';
import { create } from 'zustand';

interface InvoiceModalState {
  isOpen: boolean;
  currentInvoice: RecognizedInvoiceItem | null;
  openModal: (invoice: RecognizedInvoiceItem) => void;
  closeModal: () => void;
}

export const useInvoiceModalStore = create<InvoiceModalState>((set) => ({
  isOpen: false,
  currentInvoice: null,
  openModal: (invoice) => set({ isOpen: true, currentInvoice: invoice }),
  closeModal: () => set({ isOpen: false, currentInvoice: null }),
}));

export const invoiceAgent: Agent = {
  id: 'invoice',
  name: 'Invoice Agent',
  description: 'Recognizes invoices from text',
  type: 'invoice',
  isActive: true,

  process: async (content: string) => {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('Please set your OpenAI API key in settings');
    }

    const { object } = await generateObject({
      model: {
        provider: 'openai',
        model: 'gpt-4',
        apiKey
      },
      schema: z.object({
        invoice: z.object({
          title: z.string(),
          amount: z.number(),
          currency: z.string(),
          dueDate: z.string().datetime().optional(),
          paymentDetails: z.object({
            recipient: z.string(),
            accountNumber: z.string().optional(),
            bankDetails: z.string().optional(),
          }).optional(),
        })
      }),
      prompt: content
    });

    return {
      type: 'invoice',
      data: object.invoice
    };
  },

  action: async (item: RecognizedInvoiceItem) => {
    // Open the modal with the invoice details
    useInvoiceModalStore.getState().openModal(item);

    // Return a promise that will be resolved when the modal is closed
    return new Promise<void>((resolve, reject) => {
      // You can add any additional processing logic here
      // For now, we'll just log the invoice
      console.log('0xHypr', 'Processing invoice:', {
        title: item.data.title,
        amount: item.data.amount,
        currency: item.data.currency,
        dueDate: item.data.dueDate,
        paymentDetails: item.data.paymentDetails
      });

      // TODO: Integrate with your preferred payment system
      // For example: Request Network, Stripe, etc.
      resolve();
    });
  }
}; 