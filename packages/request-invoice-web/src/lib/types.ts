import { Types } from '@requestnetwork/request-client.js';

export interface RequestDetails extends Types.IRequestData {
  amount: string;
  description: string;
  status: Types.RequestLogic.STATE;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
}

export interface PaymentResult {
  success: boolean;
  transactionHash: string;
}
