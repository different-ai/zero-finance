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
    address?: string | {
      'country-name'?: string;
      'extended-address'?: string;
      locality?: string;
      'post-office-box'?: string;
      'postal-code'?: string;
      region?: string;
      'street-address'?: string;
    };
    city?: string;
    postalCode?: string;
    country?: string;
  };
  
  buyerInfo?: {
    businessName?: string;
    email?: string; 
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string | {
      'country-name'?: string;
      'extended-address'?: string;
      locality?: string;
      'post-office-box'?: string;
      'postal-code'?: string;
      region?: string;
      'street-address'?: string;
    };
    city?: string;
    postalCode?: string;
    country?: string;
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
  
  note?: string;
  
  bankDetails?: {
    accountHolder?: string;
    iban?: string;
    bic?: string;
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
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
  bankDetails?: {  // Bank details are optional overall
    accountHolder?: string; // Fields within can also be optional depending on UI state
    iban?: string;
    bic?: string;
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
  } | null; // Allow null explicitly
  
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
  
  // Payment details - default to Base network and USDC for crypto
  network: 'base', // Default to Base network
  currency: 'USDC', // Default crypto currency to USDC
  paymentType: 'crypto', // Default to crypto payments
  bankDetails: null, // Default bank details to null
  
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
  applyDataToForm: async () => {
    const { detectedInvoiceData, formData: existingFormData } = get();
    
    // Get the updated form data after loading company profile
    const currentFormData = get().formData;
    
    if (!detectedInvoiceData) {
      console.log('[InvoiceStore] No detected invoice data to apply');
      return;
    }
    
    console.log('[InvoiceStore] Applying detected invoice data:', detectedInvoiceData);
    console.log('[InvoiceStore] Current form data:', currentFormData);
    
    // Determine default currency based on payment type preference (if not detected)
    // For crypto, default to USDC on Base. For Fiat, default to EUR.
    let defaultCurrency = 'EUR'; // Default for Fiat
    let defaultNetwork = 'base'; // Default network is base for crypto
    if (currentFormData.paymentType === 'crypto') {
       // Check detected currency - prioritize ETH if explicitly mentioned, otherwise USDC
       if (detectedInvoiceData.currency?.toUpperCase() === 'ETH') {
         defaultCurrency = 'ETH';
       } else {
         defaultCurrency = 'USDC'; // Default crypto to USDC
       }
    } else if (detectedInvoiceData.currency) {
       // Use detected fiat currency if available
       const upperCurrency = detectedInvoiceData.currency.toUpperCase();
       if (['EUR', 'USD', 'GBP'].includes(upperCurrency)) {
         defaultCurrency = upperCurrency;
       }
    }

    console.log('[InvoiceStore] Determined currency:', defaultCurrency, 'network:', defaultNetwork);

    // Format data for the form - preserving existing seller info
    // Only populate empty fields to allow manual overrides
    const formattedData: Partial<InvoiceFormData> = {
      // Apply seller info from AI data or keep existing
      sellerBusinessName: detectedInvoiceData.sellerInfo?.businessName || 
                         currentFormData.sellerBusinessName || '',
      sellerEmail: detectedInvoiceData.sellerInfo?.email || 
                   currentFormData.sellerEmail || '',
      sellerAddress: (typeof detectedInvoiceData.sellerInfo?.address === 'string' 
                      ? detectedInvoiceData.sellerInfo.address 
                      : detectedInvoiceData.sellerInfo?.address?.['street-address']) || 
                     currentFormData.sellerAddress || '',
      sellerCity: detectedInvoiceData.sellerInfo?.city || 
                  (typeof detectedInvoiceData.sellerInfo?.address === 'object' 
                   ? detectedInvoiceData.sellerInfo.address?.locality 
                   : undefined) ||
                  currentFormData.sellerCity || '',
      sellerPostalCode: detectedInvoiceData.sellerInfo?.postalCode || 
                        (typeof detectedInvoiceData.sellerInfo?.address === 'object' 
                         ? detectedInvoiceData.sellerInfo.address?.['postal-code'] 
                         : undefined) ||
                        currentFormData.sellerPostalCode || '',
      sellerCountry: detectedInvoiceData.sellerInfo?.country || 
                     (typeof detectedInvoiceData.sellerInfo?.address === 'object' 
                      ? detectedInvoiceData.sellerInfo.address?.['country-name'] 
                      : undefined) ||
                     currentFormData.sellerCountry || '',
      
      // Apply buyer info from AI data
      buyerBusinessName: detectedInvoiceData.buyerInfo?.businessName || 
                         detectedInvoiceData.toName || 
                         currentFormData.buyerBusinessName || '',
      buyerEmail: detectedInvoiceData.buyerInfo?.email || 
                  detectedInvoiceData.toEmail || 
                  currentFormData.buyerEmail || '',
      buyerAddress: (typeof detectedInvoiceData.buyerInfo?.address === 'string' 
                     ? detectedInvoiceData.buyerInfo.address 
                     : detectedInvoiceData.buyerInfo?.address?.['street-address']) || 
                    currentFormData.buyerAddress || '',
      buyerCity: detectedInvoiceData.buyerInfo?.city || 
                 (typeof detectedInvoiceData.buyerInfo?.address === 'object' 
                  ? detectedInvoiceData.buyerInfo.address?.locality 
                  : undefined) || 
                 currentFormData.buyerCity || '',
      buyerPostalCode: detectedInvoiceData.buyerInfo?.postalCode || 
                       (typeof detectedInvoiceData.buyerInfo?.address === 'object' 
                        ? detectedInvoiceData.buyerInfo.address?.['postal-code'] 
                        : undefined) || 
                       currentFormData.buyerPostalCode || '',
      buyerCountry: detectedInvoiceData.buyerInfo?.country || 
                    (typeof detectedInvoiceData.buyerInfo?.address === 'object' 
                     ? detectedInvoiceData.buyerInfo.address?.['country-name'] 
                     : undefined) || 
                    currentFormData.buyerCountry || '',
      
      // Invoice details - preserve user data if already entered
      invoiceNumber: currentFormData.invoiceNumber || detectedInvoiceData.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`, // Ensure default if missing
      issueDate: currentFormData.issueDate || 
                 (detectedInvoiceData.issuedAt ? 
                  new Date(detectedInvoiceData.issuedAt).toISOString().slice(0, 10) :
                  new Date().toISOString().slice(0, 10)),
      
      // Payment details - Apply detected or default values, preserving user input
      // Infer payment type if possible, otherwise use current form setting
      paymentType: currentFormData.paymentType ||
                   (detectedInvoiceData.currency?.toUpperCase() === 'ETH' || detectedInvoiceData.currency?.toUpperCase() === 'USDC' ? 'crypto' :
                   ['EUR', 'USD', 'GBP'].includes(detectedInvoiceData.currency?.toUpperCase() || '') ? 'fiat' :
                   currentFormData.paymentType), // fallback to current if ambiguous

      network: currentFormData.network || defaultNetwork, // Always default network to base for crypto now
      currency: currentFormData.currency || defaultCurrency,

      dueDate: currentFormData.dueDate ||
               (detectedInvoiceData.dueDate ?
                new Date(detectedInvoiceData.dueDate).toISOString().slice(0, 10) :
                (detectedInvoiceData.paymentTerms && typeof detectedInvoiceData.paymentTerms === 'object' && detectedInvoiceData.paymentTerms.dueDate) ?
                 new Date(detectedInvoiceData.paymentTerms.dueDate).toISOString().slice(0, 10) :
                 new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)), // Default due date
      
      // Notes & Terms
      note: currentFormData.note || detectedInvoiceData.additionalNotes || detectedInvoiceData.note || '',
      terms: currentFormData.terms ||
             (typeof detectedInvoiceData.paymentTerms === 'string' ? detectedInvoiceData.paymentTerms : '') || // Use paymentTerms as string if available
             'Payment due within 30 days',
      
      // Bank details if present in AI data
      ...(detectedInvoiceData.bankDetails && {
        bankDetails: {
          accountHolder: detectedInvoiceData.bankDetails.accountHolder || '',
          iban: detectedInvoiceData.bankDetails.iban || '',
          bic: detectedInvoiceData.bankDetails.bic || '',
          bankName: detectedInvoiceData.bankDetails.bankName || '',
          accountNumber: detectedInvoiceData.bankDetails.accountNumber || '',
          routingNumber: detectedInvoiceData.bankDetails.routingNumber || '',
        }
      }),
    };
    
    // Log the extracted data for debugging
    console.log('[InvoiceStore] Extracted critical info:', {
      buyer: detectedInvoiceData.buyerInfo?.businessName || detectedInvoiceData.toName,
      email: detectedInvoiceData.buyerInfo?.email || detectedInvoiceData.toEmail,
      amount: detectedInvoiceData.amount,
      currency: detectedInvoiceData.currency,
      dueDate: detectedInvoiceData.dueDate,
      itemsCount: detectedInvoiceData.invoiceItems?.length || 0
    });
    
    console.log('[InvoiceStore] Formatted data to apply:', formattedData);
    
    // Update the form data
    set(state => ({
      formData: {
        ...state.formData,
        ...formattedData
      }
    }));
    
    // Process invoice items - only if no items exist or user hasn't modified items
    const shouldSetItems = invoiceItemsAreEmpty(get().invoiceItems);
    
    console.log('[InvoiceStore] Should set items:', shouldSetItems, 'Current items:', get().invoiceItems);
    
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
      console.log('[InvoiceStore] Processed invoice items:', invoiceItems);
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
      console.log('[InvoiceStore] Created single item based on amount:', detectedInvoiceData.amount);
    }
    
    console.log('[InvoiceStore] Final form state after applying data:', get().formData);
    console.log('[InvoiceStore] Final items state after applying data:', get().invoiceItems);
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
