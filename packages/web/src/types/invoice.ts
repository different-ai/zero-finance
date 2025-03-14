import { Address } from './address';

export interface Invoice {
  meta: {
    format: 'rnf_invoice';
    version: string;
  };
  buyerInfo?: ActorInfo;
  sellerInfo?: ActorInfo;
  creationDate: string;
  invoiceItems: InvoiceItem[];
  invoiceNumber: string;
  miscellaneous?: unknown;
  note?: string;
  paymentTerms?: PaymentTerms;
  purchaseOrderId?: string;
  terms?: string;
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: string;
  currency: string;
  tax?: {
    type: 'percentage' | 'fixed';
    amount: string;
  };
  reference?: string;
  deliveryDate?: string;
  deliveryPeriod?: string;
}

export interface ActorInfo {
  address?: Address;
  businessName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  miscellaneous?: unknown;
  phone?: string;
  taxRegistration?: string;
  companyRegistration?: string;
}

export interface PaymentTerms {
  dueDate?: string;
  lateFeesFix?: string;
  lateFeesPercent?: number;
  miscellaneous?: unknown;
} 