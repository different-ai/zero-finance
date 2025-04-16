import { z } from 'zod';

// Environment variables
const ALIGN_API_KEY = process.env.ALIGN_API_KEY;
const ALIGN_API_BASE_URL = process.env.ALIGN_API_BASE_URL || 'https://sandbox.align.co/api';

// Error handling
class AlignApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'AlignApiError';
    this.statusCode = statusCode;
  }
}

// Response types
export const alignCustomerSchema = z.object({
  customer_id: z.string(),
  email: z.string().email(),
  kycs: z.array(z.object({
    status: z.enum(['pending', 'verified', 'failed', 'action_required']),
    kyc_flow_link: z.string().url().optional()
  })).optional().default([]),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional()
});

export type AlignCustomer = z.infer<typeof alignCustomerSchema>;

export const alignVirtualAccountSchema = z.object({
  id: z.string(),
  customer_id: z.string(),
  source_currency: z.enum(['usd', 'eur']),
  destination_token: z.enum(['usdc', 'usdt']),
  destination_network: z.enum(['polygon', 'ethereum', 'base', 'solana', 'avalanche']),
  destination_address: z.string(),
  deposit_instructions: z.object({
    currency: z.enum(['usd', 'eur']),
    bank_name: z.string(),
    bank_address: z.string().optional(),
    beneficiary_name: z.string(),
    beneficiary_address: z.string().optional(),
    // US ACH specific fields
    account_number: z.string().optional(),
    routing_number: z.string().optional(),
    // IBAN specific fields
    iban: z.object({
      iban_number: z.string()
    }).optional(),
    bic: z.object({
      bic_code: z.string()
    }).optional()
  }),
  status: z.enum(['active', 'inactive', 'pending', 'suspended']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export type AlignVirtualAccount = z.infer<typeof alignVirtualAccountSchema>;

/**
 * Client for interacting with the Align API
 */
export class AlignApiClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(apiKey = ALIGN_API_KEY, baseUrl = ALIGN_API_BASE_URL) {
    if (!apiKey) {
      throw new Error('ALIGN_API_KEY environment variable is required');
    }
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  private async fetchWithAuth(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('Align API request:', { url, method: options.method || 'GET' });
    console.log('this.apiKey', this.apiKey);
    const headers = {
      'Authorization': `${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Check if the response is OK before trying to parse JSON
      if (!response.ok) {
        // Try to get more specific error message from response body
        let errorBody = 'Unknown error';
        try {
          const textResponse = await response.text();
          errorBody = textResponse; // Log the raw text
          // Attempt to parse JSON only if it looks like JSON, otherwise use raw text
          try {
            const jsonData = JSON.parse(textResponse);
            errorBody = jsonData.message || JSON.stringify(jsonData);
          } catch (jsonError) {
             // Keep the raw text as the error body if JSON parsing fails
             console.log("Align API response was not valid JSON:", textResponse)
          }
        } catch (textError) {
          // Fallback if reading text fails
          errorBody = `Status ${response.status}: ${response.statusText}`;
        }
        throw new AlignApiError(
          `Align API Error: ${errorBody}`,
          response.status
        );
      }

      // If response is OK, try to parse JSON
      const data = await response.json();
      return data;

    } catch (error) {
      if (error instanceof AlignApiError) {
        // Re-throw AlignApiError to be handled upstream
        throw error;
      }
      // Handle network errors or JSON parsing errors for OK responses (less likely but possible)
      console.error('Error fetching from Align API:', error);
      // Include more context if possible
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to process response from Align API: ${errorMessage}`);
    }
  }

  /**
   * Create a new customer in Align
   */
  async createCustomer(
    email: string,
    firstName?: string,
    lastName?: string,
    companyName?: string,
    beneficiaryType: 'individual' | 'corporate' = 'individual'
  ): Promise<AlignCustomer> {
    const payload = {
      email,
      first_name: firstName,
      last_name: lastName,
      company_name: companyName,
      beneficiary_type: beneficiaryType
    };
    console.log('payload', payload);

    const response = await this.fetchWithAuth('/v0/customers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return alignCustomerSchema.parse(response);
  }

  /**
   * Get customer details from Align
   */
  async getCustomer(customerId: string): Promise<AlignCustomer> {
    const response = await this.fetchWithAuth(`/v0/customers/${customerId}`);
    return alignCustomerSchema.parse(response);
  }

  /**
   * Create a virtual account for a customer
   */
  async createVirtualAccount(
    customerId: string,
    data: {
      source_currency: 'usd' | 'eur',
      destination_token: 'usdc' | 'usdt',
      destination_network: 'polygon' | 'ethereum' | 'base' | 'solana' | 'avalanche',
      destination_address: string
    }
  ): Promise<AlignVirtualAccount> {
    const response = await this.fetchWithAuth(`/v0/customers/${customerId}/virtual-account`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return alignVirtualAccountSchema.parse(response);
  }

  /**
   * Get virtual account details
   */
  async getVirtualAccount(
    customerId: string,
    virtualAccountId: string
  ): Promise<AlignVirtualAccount> {
    const response = await this.fetchWithAuth(
      `/v0/customers/${customerId}/virtual-account/${virtualAccountId}`
    );

    return alignVirtualAccountSchema.parse(response);
  }
}

// Export default instance
export const alignApi = new AlignApiClient(); 
