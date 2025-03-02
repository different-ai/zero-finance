import { create } from 'zustand';

// Define the interface for the invoice data
export interface InvoiceData {
  // Basic invoice properties
  invoiceNumber?: string;
  issuedAt?: string;
  dueDate?: string;
  fromName?: string;
  fromIdentity?: string;
  fromEmail?: string;
  toName?: string;
  toIdentity?: string;
  toEmail?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: string;
    total: string;
  }>;
  currency?: string;
  subtotal?: string;
  tax?: string;
  discount?: string;
  total?: string;
  additionalNotes?: string;
  
  // Support for the invoice generation model data structure 
  sellerInfo?: {
    businessName?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: {
      'country-name'?: string;
      'extended-address'?: string;
      locality?: string;
      'post-office-box'?: string;
      'postal-code'?: string;
      region?: string;
      'street-address'?: string;
    };
  };
  
  buyerInfo?: {
    businessName?: string;
    email?: string; 
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: {
      'country-name'?: string;
      'extended-address'?: string;
      locality?: string;
      'post-office-box'?: string;
      'postal-code'?: string;
      region?: string;
      'street-address'?: string;
    };
  };
  
  invoiceItems?: Array<{
    name?: string;
    quantity?: number;
    unitPrice?: string;
    total?: string;
  }>;
  
  paymentTerms?: string | {
    dueDate?: string;
  };
}

// Define the interface for the invoice store
interface InvoiceStore {
  // The detected invoice data from the chatbot
  detectedInvoiceData: InvoiceData | null;
  
  // Function to set the detected invoice data
  setDetectedInvoiceData: (data: InvoiceData | null) => void;
  
  // Flag to indicate if invoice data is available to use
  hasInvoiceData: boolean;
  
  // Function to clear the detected invoice data
  clearDetectedInvoiceData: () => void;
}

// Create the Zustand store
export const useInvoiceStore = create<InvoiceStore>((set) => ({
  detectedInvoiceData: null,
  hasInvoiceData: false,
  
  setDetectedInvoiceData: (data: InvoiceData | null) => set({ 
    detectedInvoiceData: data,
    hasInvoiceData: data !== null
  }),
  
  clearDetectedInvoiceData: () => set({
    detectedInvoiceData: null,
    hasInvoiceData: false
  })
})); 