import type { PaymentInfo as WisePaymentInfo } from './wise';
import type { MercuryPaymentInfo } from './mercury';

export type PaymentMethod = 'wise' | 'mercury';

export interface PaymentDetails {
  method: PaymentMethod;
  wise?: WisePaymentInfo;
  mercury?: MercuryPaymentInfo;
}

export interface TransferDetails {
  id: string;
  status: string;
  trackingUrl: string;
  provider: PaymentMethod;
} 