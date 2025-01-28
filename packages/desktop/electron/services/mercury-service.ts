import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { promises as fs } from 'fs';
import { join } from 'path';
import { app } from 'electron';

const ENCRYPTION_KEY = randomBytes(32);
const ENCRYPTION_IV = randomBytes(16);
const STORAGE_FILE = join(app.getPath('userData'), '.mercury-credentials');

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

  private async encrypt(text: string): Promise<string> {
    const cipher = createCipheriv('aes-256-cbc', ENCRYPTION_KEY, ENCRYPTION_IV);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  private async decrypt(encrypted: string): Promise<string> {
    const decipher = createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, ENCRYPTION_IV);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  async getApiKey(): Promise<string | null> {
    try {
      if (!this.apiKey) {
        const fileContent = await fs.readFile(STORAGE_FILE, 'utf8');
        this.apiKey = await this.decrypt(fileContent);
      }
      return this.apiKey;
    } catch (error) {
      console.error('0xHypr', 'Failed to get Mercury API key:', error);
      return null;
    }
  }

  async setApiKey(key: string): Promise<void> {
    try {
      const encrypted = await this.encrypt(key);
      await fs.writeFile(STORAGE_FILE, encrypted);
      this.apiKey = key;
    } catch (error) {
      console.error('0xHypr', 'Failed to save Mercury API key:', error);
      throw error;
    }
  }

  async deleteApiKey(): Promise<boolean> {
    try {
      await fs.unlink(STORAGE_FILE);
      this.apiKey = null;
      return true;
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
      const response = await fetch(
        'https://backend.mercury.com/api/v1/account-payments',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accountId: params.accountId,
            amount: params.amount,
            currency: params.currency,
            recipientName: params.recipientName,
            routingNumber: params.routingNumber,
            accountNumber: params.accountNumber,
            reference: params.reference,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return { success: true, data };
    } catch (error: any) {
      console.error('0xHypr', 'Mercury createPayment error:', error);
      return {
        success: false,
        error: error.message || 'Unknown error',
      };
    }
  }
}