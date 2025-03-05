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

// Define the interface for the invoice form data
export interface InvoiceFormData {
  // Seller info
  sellerBusinessName: string;
  sellerEmail: string;
  sellerAddress: string;
  sellerCity: string;
  sellerPostalCode: string;
  sellerCountry: string;
  
  // Buyer info
  buyerBusinessName: string;
  buyerEmail: string;
  buyerAddress: string;
  buyerCity: string;
  buyerPostalCode: string;
  buyerCountry: string;
  
  // Invoice details
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  
  // Payment details
  network: string;
  currency: string;
  
  // Notes
  note: string;
  terms: string;
}

// Define interface for invoice items
export interface InvoiceItemData {
  id: number;
  name: string;
  quantity: number;
  unitPrice: string;
  tax: number;
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
  
  // Current form data
  formData: InvoiceFormData;
  
  // Current invoice items
  invoiceItems: InvoiceItemData[];
  
  // Function to update form data
  updateFormData: (data: Partial<InvoiceFormData>) => void;
  
  // Function to update invoice items
  updateInvoiceItems: (items: InvoiceItemData[]) => void;
  
  // Function to apply detected data to form
  applyDataToForm: () => void;
}

// Default form values
const defaultFormData: InvoiceFormData = {
  // Seller info
  sellerBusinessName: '',
  sellerEmail: '',
  sellerAddress: '',
  sellerCity: '',
  sellerPostalCode: '',
  sellerCountry: '',
  
  // Buyer info
  buyerBusinessName: '',
  buyerEmail: '',
  buyerAddress: '',
  buyerCity: '',
  buyerPostalCode: '',
  buyerCountry: '',
  
  // Invoice details
  invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
  issueDate: new Date().toISOString().slice(0, 10),
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  
  // Payment details
  network: 'gnosis',
  currency: 'EUR',
  
  // Notes
  note: '',
  terms: 'Payment due within 30 days',
};

// Default invoice item
const defaultInvoiceItems: InvoiceItemData[] = [
  {
    id: Date.now(),
    name: '',
    quantity: 1,
    unitPrice: '',
    tax: 0,
  }
];

// Create the Zustand store
export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  detectedInvoiceData: null,
  hasInvoiceData: false,
  formData: defaultFormData,
  invoiceItems: defaultInvoiceItems,
  
  setDetectedInvoiceData: (data: InvoiceData | null) => set({ 
    detectedInvoiceData: data,
    hasInvoiceData: data !== null
  }),
  
  clearDetectedInvoiceData: () => set({
    detectedInvoiceData: null,
    hasInvoiceData: false
  }),
  
  updateFormData: (data: Partial<InvoiceFormData>) => set(state => ({
    formData: {
      ...state.formData,
      ...data
    }
  })),
  
  updateInvoiceItems: (items: InvoiceItemData[]) => set({
    invoiceItems: items
  }),
  
  // Function to apply detected data to the form
  applyDataToForm: () => {
    const { detectedInvoiceData } = get();
    
    if (!detectedInvoiceData) return;
    
    // Format data for the form
    const formattedData: Partial<InvoiceFormData> = {
      // Seller info
      sellerBusinessName: detectedInvoiceData.sellerInfo?.businessName || '',
      sellerEmail: detectedInvoiceData.sellerInfo?.email || '',
      sellerAddress: detectedInvoiceData.sellerInfo?.address?.['street-address'] || '',
      sellerCity: detectedInvoiceData.sellerInfo?.address?.locality || '',
      sellerPostalCode: detectedInvoiceData.sellerInfo?.address?.['postal-code'] || '',
      sellerCountry: detectedInvoiceData.sellerInfo?.address?.['country-name'] || '',
      
      // Buyer info
      buyerBusinessName: detectedInvoiceData.buyerInfo?.businessName || '',
      buyerEmail: detectedInvoiceData.buyerInfo?.email || '',
      buyerAddress: detectedInvoiceData.buyerInfo?.address?.['street-address'] || '',
      buyerCity: detectedInvoiceData.buyerInfo?.address?.locality || '',
      buyerPostalCode: detectedInvoiceData.buyerInfo?.address?.['postal-code'] || '',
      buyerCountry: detectedInvoiceData.buyerInfo?.address?.['country-name'] || '',
      
      // Payment details
      network: 'gnosis', // Default to gnosis as network is not in InvoiceData
      currency: detectedInvoiceData.currency || 'EUR',
      
      // Due date
      dueDate: typeof detectedInvoiceData.paymentTerms === 'object' && detectedInvoiceData.paymentTerms?.dueDate
        ? new Date(detectedInvoiceData.paymentTerms.dueDate).toISOString().slice(0, 10)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      
      // Notes and terms
      note: detectedInvoiceData.additionalNotes || '',
      terms: 'Payment due within 30 days',
    };
    
    // Update the form data
    set(state => ({
      formData: {
        ...state.formData,
        ...formattedData
      }
    }));
    
    // Get invoice items from detected data
    const invoiceItems = detectedInvoiceData.invoiceItems?.map((item) => ({
      id: Date.now() + Math.random(),
      name: item.name || '',
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice || '',
      tax: 0, // Default tax to 0
    })) || [];
    
    // Only update items if there are any
    if (invoiceItems.length > 0) {
      set({ invoiceItems });
    }
  }
})); 