// Shared types for static invoice display components

export type TaxField = number | { type: 'percentage'; amount: string };

export type ParsedInvoiceItem = {
  name?: string;
  unitPrice?: string;
  quantity?: number;
  tax?: TaxField;
};

export type AddressField =
  | string
  | {
      'street-address'?: string;
      locality?: string;
      'postal-code'?: string;
      'country-name'?: string;
    };

export type PartyInfo = {
  businessName?: string;
  email?: string;
  address?: AddressField;
  city?: string;
  postalCode?: string;
  country?: string;
};

export type ParsedInvoiceDetails = {
  paymentType?: 'crypto' | 'fiat';
  paymentMethod?: string;
  paymentAddress?: string;
  currency?: string;
  network?: string;
  bankDetails?: {
    accountHolder?: string;
    iban?: string;
    bic?: string;
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
    bankAddress?: string;
  } | null;
  invoiceNumber?: string;
  invoiceItems?: Array<ParsedInvoiceItem>;
  sellerInfo?: PartyInfo;
  buyerInfo?: PartyInfo;
  issueDate?: string;
  dueDate?: string;
  note?: string;
  terms?: string;
};

export type BasicUserRequest = {
  id: string;
  requestId?: string | null;
  invoiceData: any;
  currency?: string | null;
  amount?: string | null;
  status?: string | null;
};

// Helper functions for tax calculations
export const getTaxPercent = (tax: TaxField | undefined): number => {
  if (!tax) return 0;
  if (typeof tax === 'object') {
    return parseFloat(tax.amount || '0');
  }
  return tax;
};

export const calculateItemTotal = (item: ParsedInvoiceItem): number => {
  const quantity = item.quantity || 1;
  const unitPrice = parseFloat(item.unitPrice || '0');
  const taxRate = getTaxPercent(item.tax) / 100;
  const subtotal = quantity * unitPrice;
  const taxAmount = subtotal * taxRate;
  return subtotal + taxAmount;
};

// Helper to extract address string from AddressField
export const extractAddress = (
  addressRaw: AddressField | undefined,
): string | undefined => {
  if (!addressRaw) return undefined;
  return typeof addressRaw === 'string'
    ? addressRaw
    : addressRaw?.['street-address'];
};
