import type { PaymentInfo } from './wise';

export interface MercuryPaymentRequest {
  amount: string;
  recipientAccountId?: string;
  recipientEmail?: string;
  memo?: string;
  counterpartyName: string;
  paymentMethod: 'ach';
}

export interface MercuryPaymentResponse {
  accountId: string;
  requestId: string;
  recipientId: string;
  memo?: string;
  paymentMethod: 'ach';
  amount: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'failed';
}

export interface MercuryPaymentInfo {
  amount: string;
  currency: string;
  recipient: {
    accountId: string;
    memo?: string;
  };
  description?: string;
}

export interface MercuryPaymentResponse {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'failed';
  mercuryUrl: string;
  amount: string;
  currency: string;
  recipient: {
    accountId: string;
    memo?: string;
  };
  description?: string;
  createdAt: string;
}

export interface MercuryError {
  error: string;
  message: string;
  details?: unknown;
}

// Convert PaymentInfo to MercuryPaymentRequest
export function toMercuryPaymentRequest(paymentInfo: PaymentInfo): MercuryPaymentRequest {
  if (!paymentInfo.amount || !paymentInfo.recipientName) {
    throw new Error('Amount and recipient name are required for Mercury payments');
  }

  return {
    amount: paymentInfo.amount,
    recipientEmail: paymentInfo.recipientEmail,
    counterpartyName: paymentInfo.recipientName,
    memo: paymentInfo.reference,
    paymentMethod: 'ach',
    ...(paymentInfo.accountNumber && {
      recipientAccountId: paymentInfo.accountNumber
    })
  };
}
