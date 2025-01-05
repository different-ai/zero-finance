import { create } from 'zustand';
import { AsyncInvoiceResult } from '@/agents/async-invoice-agent';

interface InvoiceState {
  // Map of recognized item ID to invoice processing result
  pendingInvoices: Record<string, AsyncInvoiceResult | null>;
  // Map of content hash to boolean to track processed content
  processedContent: Record<string, boolean>;
  // Actions
  setPendingInvoice: (id: string, result: AsyncInvoiceResult | null) => void;
  addProcessedContent: (content: string) => void;
  hasProcessedContent: (content: string) => boolean;
  clearProcessedContent: () => void;
}

export const useInvoiceStore = create<InvoiceState>((set, get) => ({
  pendingInvoices: {},
  processedContent: {},

  setPendingInvoice: (id, result) =>
    set((state) => ({
      pendingInvoices: {
        ...state.pendingInvoices,
        [id]: result,
      },
    })),

  addProcessedContent: (content) =>
    set((state) => {
      // Simple hash function for content
      const hash = btoa(content).slice(0, 32);
      return {
        processedContent: {
          ...state.processedContent,
          [hash]: true,
        },
      };
    }),

  hasProcessedContent: (content) => {
    const hash = btoa(content).slice(0, 32);
    return !!get().processedContent[hash];
  },

  clearProcessedContent: () =>
    set({
      processedContent: {},
    }),
})); 