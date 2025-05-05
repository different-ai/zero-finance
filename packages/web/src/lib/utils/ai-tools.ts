export type ScreenpipeSearchParams = {
  query: string;
  contentType?: string;
  limit?: number;
  offset?: number;
  startTime?: string;
  endTime?: string;
  appName?: string;
  windowName?: string;
  browserUrl?: string;
  includeFrames?: boolean;
  minLength?: number;
  maxLength?: number;
  speakerIds?: number[];
};

export type ScreenpipeSearchResult = {
  type: string;
  content: {
    frame_id?: number;
    text: string;
    timestamp?: string;
    file_path?: string;
    offset_index?: number;
    app_name?: string;
    window_name?: string;
    tags?: string[];
    frame?: string;
  };
};

export type ScreenpipeSearchResponse = {
  data: ScreenpipeSearchResult[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
};

export type InvoiceAnswerParams = {
  context: string[];
  query: string;
  currentInvoiceData?: any;
};

/* export */ type InvoiceAnswerResult = {
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