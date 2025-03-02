export type ScreenpipeSearchParams = {
  query: string;
};

export type ScreenpipeSearchResult = {
  content: string;
  source: string;
  confidence: number;
};

export type InvoiceAnswerParams = {
  context: string[];
  query: string;
  currentInvoiceData?: any;
};

export type InvoiceAnswerResult = {
  invoiceData: {
    sellerInfo?: {
      businessName?: string;
      email?: string;
      address?: {
        'street-address'?: string;
        locality?: string;
        'postal-code'?: string;
        'country-name'?: string;
      };
    };
    buyerInfo?: {
      businessName?: string;
      email?: string;
      address?: {
        'street-address'?: string;
        locality?: string;
        'postal-code'?: string;
        'country-name'?: string;
      };
    };
    invoiceItems?: Array<{
      name: string;
      quantity: number;
      unitPrice: string;
      currency?: string;
      tax?: {
        type: string;
        amount: string;
      };
    }>;
    paymentTerms?: {
      dueDate: string;
    };
    network?: string;
    currency?: string;
    note?: string;
    terms?: string;
  };
  explanation: string;
  missingFields?: string[];
};