import { create } from 'zustand';
import { getDefaultCompanyProfile } from '@/actions/get-company-profile';

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
  // Add new property for streamlined extraction
  amount?: number;
  totalAmount?: number;
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
    description?: string;
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
  paymentType: 'crypto' | 'fiat'; // New field for payment type
  bankDetails?: {  // New field for bank details (for fiat payments)
    accountHolder: string;
    iban: string;
    bic: string;
    bankName?: string;
  };
  
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
  
  // Function to load company profile data
  loadCompanyProfile: () => Promise<boolean>;
  
  // Function to apply detected data to form
  applyDataToForm: () => Promise<void>;
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
  
  // Payment details - default to gnosis and EURe, but can be changed
  network: 'gnosis',
  currency: 'EURe',
  paymentType: 'crypto', // Default to crypto payments
  bankDetails: {
    accountHolder: '',
    iban: '',
    bic: '',
    bankName: '',
  },
  
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
  
  // Function to load company profile data into the form using server action
  loadCompanyProfile: async () => {
    try {
      // Get the default company profile using server action
      const defaultProfile = await getDefaultCompanyProfile();
      
      if (defaultProfile) {
        console.log('0xHypr', 'Loaded default company profile:', defaultProfile.businessName);
        
        // Update the form with company profile data
        set(state => ({
          formData: {
            ...state.formData,
            sellerBusinessName: defaultProfile.businessName || state.formData.sellerBusinessName,
            sellerEmail: defaultProfile.email || state.formData.sellerEmail,
            sellerAddress: defaultProfile.streetAddress || state.formData.sellerAddress,
            sellerCity: defaultProfile.city || state.formData.sellerCity,
            sellerPostalCode: defaultProfile.postalCode || state.formData.sellerPostalCode,
            sellerCountry: defaultProfile.country || state.formData.sellerCountry,
          }
        }));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('0xHypr', 'Failed to load company profile:', error);
      return false;
    }
  },
  
  // Function to apply detected data to the form
  applyDataToForm: async () => {
    const { detectedInvoiceData, formData: existingFormData, loadCompanyProfile } = get();
    
    // Try to load company profile data first
    await loadCompanyProfile();
    
    // Get the updated form data after loading company profile
    const currentFormData = get().formData;
    
    if (!detectedInvoiceData) return;
    
    console.log('0xHypr', 'Applying detected invoice data:', detectedInvoiceData);
    
    // Format data for the form - preserving existing seller info
    // Only populate empty fields to allow manual overrides
    const formattedData: Partial<InvoiceFormData> = {
      // Keep existing seller info if already set by user or company profile
      sellerBusinessName: currentFormData.sellerBusinessName || '',
      sellerEmail: currentFormData.sellerEmail || '',
      sellerAddress: currentFormData.sellerAddress || '',
      sellerCity: currentFormData.sellerCity || '',
      sellerPostalCode: currentFormData.sellerPostalCode || '',
      sellerCountry: currentFormData.sellerCountry || '',
      
      // Apply buyer info only if not already populated by user
      buyerBusinessName: currentFormData.buyerBusinessName || 
                         detectedInvoiceData.buyerInfo?.businessName || 
                         detectedInvoiceData.toName || '',
      buyerEmail: currentFormData.buyerEmail || 
                  detectedInvoiceData.buyerInfo?.email || 
                  detectedInvoiceData.toEmail || '',
      buyerAddress: currentFormData.buyerAddress || 
                    detectedInvoiceData.buyerInfo?.address?.['street-address'] || '',
      buyerCity: currentFormData.buyerCity || 
                 detectedInvoiceData.buyerInfo?.address?.locality || '',
      buyerPostalCode: currentFormData.buyerPostalCode || 
                       detectedInvoiceData.buyerInfo?.address?.['postal-code'] || '',
      buyerCountry: currentFormData.buyerCountry || 
                    detectedInvoiceData.buyerInfo?.address?.['country-name'] || '',
      
      // Invoice details - preserve user data if already entered
      invoiceNumber: currentFormData.invoiceNumber || detectedInvoiceData.invoiceNumber || '',
      issueDate: currentFormData.issueDate || 
                 (detectedInvoiceData.issuedAt ? 
                  new Date(detectedInvoiceData.issuedAt).toISOString().slice(0, 10) :
                  new Date().toISOString().slice(0, 10)),
      
      // Payment details
      network: currentFormData.network || 'gnosis',
      currency: currentFormData.currency || detectedInvoiceData.currency || 'EURe',
      dueDate: currentFormData.dueDate || 
               (detectedInvoiceData.dueDate ? 
                new Date(detectedInvoiceData.dueDate).toISOString().slice(0, 10) :
                ''),
      
      // Notes
      note: currentFormData.note || detectedInvoiceData.additionalNotes || '',
      terms: currentFormData.terms || 'Payment due within 30 days',
    };
    
    // Log the extracted data for debugging
    console.log('0xHypr', 'Extracted critical info:', {
      buyer: detectedInvoiceData.buyerInfo?.businessName || detectedInvoiceData.toName,
      email: detectedInvoiceData.buyerInfo?.email || detectedInvoiceData.toEmail,
      amount: detectedInvoiceData.amount,
      currency: detectedInvoiceData.currency,
      dueDate: detectedInvoiceData.dueDate,
      itemsCount: detectedInvoiceData.invoiceItems?.length || 0
    });
    
    // Update the form data
    set(state => ({
      formData: {
        ...state.formData,
        ...formattedData
      }
    }));
    
    // Process invoice items - only if no items exist or user hasn't modified items
    const shouldSetItems = invoiceItemsAreEmpty(get().invoiceItems);
    
    if (shouldSetItems && detectedInvoiceData.invoiceItems && detectedInvoiceData.invoiceItems.length > 0) {
      // Convert extracted invoice items to the format expected by the form
      const invoiceItems = detectedInvoiceData.invoiceItems.map(item => {
        return {
          id: Date.now() + Math.random(),
          name: item.name || 'Item',
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || '0',
          tax: 0, // Default tax to 0
        } as InvoiceItemData;
      });
      
      set({ invoiceItems });
      console.log('0xHypr', 'Processed invoice items:', invoiceItems.length);
    } else if (shouldSetItems && detectedInvoiceData.amount) {
      // If no items but we have an amount, create a single line item
      const singleItem: InvoiceItemData = {
        id: Date.now(),
        name: 'Services',
        quantity: 1,
        unitPrice: detectedInvoiceData.amount.toString(),
        tax: 0,
      };
      
      set({ invoiceItems: [singleItem] });
      console.log('0xHypr', 'Created single item based on amount:', detectedInvoiceData.amount);
    }
  }
}));

// Helper function to check if invoice items are empty or default
const invoiceItemsAreEmpty = (items: InvoiceItemData[]): boolean => {
  if (!items || items.length === 0) return true;
  
  // Check if there's only one default item with no data
  if (items.length === 1) {
    const item = items[0];
    return (!item.name || item.name === '') && 
           (item.quantity === 1) && 
           (!item.unitPrice || item.unitPrice === '' || item.unitPrice === '0');
  }
  
  return false;
};
