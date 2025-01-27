import axios from 'axios';
import keytar from 'keytar';
import { app } from 'electron';

const SERVICE_NAME = 'hypr-mercury';
const ACCOUNT_NAME = 'api-key';

export interface CreateMercuryPaymentParams {
  accountId: string;
  amount: number;
  currency: string;
  recipientName: string;
  routingNumber?: string;
  accountNumber?: string;
  reference?: string;
}

export class MercuryService {
  private apiKey: string | null = null;

  async getApiKey(): Promise<string | null> {
    try {
      if (!this.apiKey) {
        this.apiKey = await keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME);
      }
      return this.apiKey;
    } catch (error) {
      console.error('0xHypr', 'Failed to get Mercury API key:', error);
      return null;
    }
  }

  async setApiKey(key: string): Promise<void> {
    try {
      await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, key);
      this.apiKey = key;
    } catch (error) {
      console.error('0xHypr', 'Failed to save Mercury API key:', error);
      throw error;
    }
  }

  async deleteApiKey(): Promise<boolean> {
    try {
      const result = await keytar.deletePassword(SERVICE_NAME, ACCOUNT_NAME);
      this.apiKey = null;
      return result;
    } catch (error) {
      console.error('0xHypr', 'Failed to delete Mercury API key:', error);
      return false;
    }
  }

  async createPayment(params: CreateMercuryPaymentParams) {
    const apiKey = await this.getApiKey();
    if (!apiKey) {
      throw new Error('Mercury API key not found');
    }

    try {
      const result = await axios.post(
        'https://backend.mercury.com/api/v1/account-payments',
        {
          accountId: params.accountId,
          amount: params.amount,
          currency: params.currency,
          recipientName: params.recipientName,
          routingNumber: params.routingNumber,
          accountNumber: params.accountNumber,
          reference: params.reference,
        },
        {
          headers: { 
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return { success: true, data: result.data };
    } catch (error: any) {
      console.error('0xHypr', 'Mercury createPayment error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Unknown error'
      };
    }
  }
} 