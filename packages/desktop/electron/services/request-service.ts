import { RequestNetwork } from '@requestnetwork/request-client.js';

export class RequestService {
  private requestClient: RequestNetwork;

  constructor() {
    this.requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: process.env.REQUEST_NETWORK_URL || 'https://goerli.gateway.request.network/api/v2',
      },
    });
  }

  async createInvoiceRequest({
    recipient,
    amount,
    currency,
    description,
    dueDate,
  }: {
    recipient: {
      name: string;
      address?: string;
      email?: string;
    };
    amount: number;
    currency: string;
    description: string;
    dueDate?: string;
  }) {
    try {
      console.log('0xHypr', 'Creating invoice request with details:', {
        recipient,
        amount,
        currency,
        description,
        dueDate
      });

      // TODO: Implement actual RequestNetwork integration
      // For now, return a mock request ID
      const requestId = `REQ-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
      console.log('0xHypr', 'Created request ID:', requestId);
      
      return requestId;
    } catch (error) {
      console.error('0xHypr', 'Failed to create invoice:', error);
      throw error;
    }
  }
} 