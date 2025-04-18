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
    status: z.enum(['pending', 'approved', 'rejected']),
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
    // Support both naming conventions for backwards compatibility
    beneficiary_name: z.string(),
    beneficiary_address: z.string().optional(),
    account_beneficiary_name: z.string().optional(),
    account_beneficiary_address: z.string().optional(),
    // Payment rails
    payment_rails: z.array(z.string()).optional(),
    // US ACH specific fields - both direct and nested
    account_number: z.string().optional(),
    routing_number: z.string().optional(),
    // Nested US account details
    us: z.object({
      account_number: z.string(),
      routing_number: z.string()
    }).optional(),
    // IBAN specific fields
    iban: z.object({
      iban_number: z.string(),
      bic: z.string().optional()
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
 * Type definition for destination bank account structure in API calls
 */
export type AlignDestinationBankAccount = {
  bank_name: string;
  account_holder_type: 'individual' | 'business';
  account_holder_first_name?: string;
  account_holder_last_name?: string;
  account_holder_business_name?: string;
  account_holder_address: {
    country: string;
    city: string;
    street_line_1: string;
    postal_code: string;
    state?: string;
    street_line_2?: string; 
  };
  account_type: 'us' | 'iban';
  iban?: {
    bic: string;
    iban_number: string;
  };
  us?: {
    account_number: string;
    routing_number: string;
  };
};

/**
 * Zod schema for the response of creating/getting an offramp transfer
 */
export const alignOfframpTransferSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'canceled']),
  amount: z.string(),
  source_token: z.enum(['usdc', 'usdt', 'eurc']),
  source_network: z.enum(['polygon', 'ethereum', 'base', 'tron', 'solana', 'avalanche']), 
  destination_currency: z.enum(['usd', 'eur', 'mxn', 'ars', 'brl', 'cny', 'hkd', 'sgd']),
  destination_payment_rails: z.enum(['ach', 'wire', 'sepa', 'swift', 'instant_sepa']).optional(),
  destination_bank_account: z.object({
    bank_name: z.string(),
    account_holder_type: z.enum(['individual', 'business']),
    account_holder_first_name: z.string().optional(),
    account_holder_last_name: z.string().optional(),
    account_holder_business_name: z.string().optional(),
    account_type: z.enum(['us', 'iban']),
    us: z.object({
      account_number: z.string().optional(), 
      routing_number: z.string().optional()
    }).optional(),
    iban: z.object({
      iban_number: z.string().optional(), 
      bic: z.string().optional()
    }).optional()
  }),
  quote: z.object({
    deposit_network: z.enum(['polygon', 'ethereum', 'base', 'tron', 'solana', 'avalanche']), 
    deposit_token: z.enum(['usdc', 'usdt', 'eurc']),
    deposit_blockchain_address: z.string(),
    deposit_amount: z.string(),
    fee_amount: z.string(),
    expires_at: z.string().datetime().optional(), 
  }),
  deposit_transaction_hash: z.string().optional().nullable(), 
  created_at: z.string().datetime().optional(), 
  updated_at: z.string().datetime().optional(), 
});

export type AlignOfframpTransfer = z.infer<typeof alignOfframpTransferSchema>;

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
   * Search for a customer by email
   * This is used for recovery when a customer exists in Align but not in our db
   */
  async searchCustomerByEmail(email: string): Promise<AlignCustomer | null> {
    try {
      // Using the proper customers endpoint with email query parameter
      const response = await this.fetchWithAuth(`/v0/customers?email=${encodeURIComponent(email)}`, {
        method: 'GET',
      });
      console.log('response searchCustomerByEmail', response);
      
      // Handle new response format with items array
      if (response && response.items && Array.isArray(response.items) && response.items.length > 0) {
        // Get the first matching customer from items array
        const customerData = response.items[0];
        
        // Create a schema-compatible object
        const alignCustomer = {
          customer_id: customerData.customer_id,
          email: customerData.email,
          kycs: [], // Initialize with empty kycs array
          // Include optional fields if they exist in the API response
          created_at: customerData.created_at,
          updated_at: customerData.updated_at
        };
        
        console.log('Found customer by email:', alignCustomer);
        return alignCustomerSchema.parse(alignCustomer);
      } else if (Array.isArray(response) && response.length > 0) {
        // Fallback for older API format (direct array)
        return alignCustomerSchema.parse(response[0]);
      } else if (response && response.customer_id) {
        // Fallback for older API format (direct object)
        return alignCustomerSchema.parse(response);
      }
      
      return null;
    } catch (error) {
      console.error('Error searching for customer by email:', error);
      // Return null instead of throwing to make this recovery-friendly
      return null;
    }
  }

  /**
   * Get customer details from Align
   */
  async getCustomer(customerId: string): Promise<AlignCustomer> {
    const response = await this.fetchWithAuth(`/v0/customers/${customerId}`);
    
    // Handle case where kycs is an object instead of an array
    if (response && response.kycs && !Array.isArray(response.kycs)) {
      // Transform the object into an array with one item
      const transformedResponse = {
        ...response,
        kycs: [response.kycs]
      };
      return alignCustomerSchema.parse(transformedResponse);
    }
    
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

    // Log the raw response for debugging
    console.log('Raw Align API response for createVirtualAccount:', JSON.stringify(response, null, 2));

    // Handle field mapping - the beneficiary_name might be under account_beneficiary_name
    if (!response.deposit_instructions?.beneficiary_name && response.deposit_instructions?.account_beneficiary_name) {
      if (!response.deposit_instructions.beneficiary_name) {
        // Add beneficiary_name field using account_beneficiary_name
        response.deposit_instructions.beneficiary_name = response.deposit_instructions.account_beneficiary_name;
      }
    }

    // Handle BIC - might be inside iban object
    if (response.deposit_instructions?.iban?.bic && !response.deposit_instructions?.bic) {
      // BIC is inside iban object, make it available in both places for backward compatibility
      response.deposit_instructions.bic = {
        bic_code: response.deposit_instructions.iban.bic
      };
    }

    // Add missing required fields with sensible defaults
    response.customer_id = response.customer_id || customerId;
    response.created_at = response.created_at || new Date().toISOString();
    response.updated_at = response.updated_at || new Date().toISOString();
    
    if (!response.deposit_instructions) {
      response.deposit_instructions = {
        currency: data.source_currency,
        bank_name: 'Align Bank',
        beneficiary_name: 'User Account'
      };
    } else {
      response.deposit_instructions.currency = response.deposit_instructions.currency || data.source_currency;
      response.deposit_instructions.bank_name = response.deposit_instructions.bank_name || 'Align Bank';
      response.deposit_instructions.beneficiary_name = response.deposit_instructions.beneficiary_name || 'User Account';
    }
    
    try {
      return alignVirtualAccountSchema.parse(response);
    } catch (error) {
      console.error('Error parsing Align virtual account response:', error);
      // Log error but try to return the data anyway - client code can handle partial data
      console.warn('Continuing with potentially invalid response data');
      return response as AlignVirtualAccount;
    }
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

    console.log('Raw Align API response for getVirtualAccount:', JSON.stringify(response, null, 2));

    // Handle field mapping - the beneficiary_name might be under account_beneficiary_name
    if (!response.deposit_instructions?.beneficiary_name && response.deposit_instructions?.account_beneficiary_name) {
      if (!response.deposit_instructions.beneficiary_name) {
        // Add beneficiary_name field using account_beneficiary_name
        response.deposit_instructions.beneficiary_name = response.deposit_instructions.account_beneficiary_name;
      }
    }

    // Handle BIC - might be inside iban object
    if (response.deposit_instructions?.iban?.bic && !response.deposit_instructions?.bic) {
      // BIC is inside iban object, make it available in both places for backward compatibility
      response.deposit_instructions.bic = {
        bic_code: response.deposit_instructions.iban.bic
      };
    }

    // Add missing required fields with sensible defaults
    response.customer_id = response.customer_id || customerId;
    response.created_at = response.created_at || new Date().toISOString();
    response.updated_at = response.updated_at || new Date().toISOString();
    
    if (!response.deposit_instructions) {
      response.deposit_instructions = {
        currency: response.source_currency || 'usd',
        bank_name: 'Align Bank',
        beneficiary_name: 'User Account'
      };
    } else {
      response.deposit_instructions.currency = response.deposit_instructions.currency || response.source_currency || 'usd';
      response.deposit_instructions.bank_name = response.deposit_instructions.bank_name || 'Align Bank';
      response.deposit_instructions.beneficiary_name = response.deposit_instructions.beneficiary_name || 'User Account';
    }
    
    try {
      return alignVirtualAccountSchema.parse(response);
    } catch (error) {
      console.error('Error parsing Align virtual account response:', error);
      // Log error but try to return the data anyway - client code can handle partial data
      console.warn('Continuing with potentially invalid response data');
      return response as AlignVirtualAccount;
    }
  }

  /**
   * Create a new KYC session for a customer
   * This is used when a customer exists but doesn't have an active KYC flow link
   */
  async createKycSession(customerId: string): Promise<{ status: string; kyc_flow_link: string }> {
    try {
      const response = await this.fetchWithAuth(`/v0/customers/${customerId}/kycs`, {
        method: 'POST',
      });
      
      console.log('KYC session created:', response);
      
      // The API returns { kycs: { status, kyc_flow_link } }
      if (response && response.kycs) {
        return {
          status: response.kycs.status,
          kyc_flow_link: response.kycs.kyc_flow_link
        };
      }
      
      throw new Error('Invalid response format from Align API');
    } catch (error) {
      console.error('Error creating KYC session:', error);
      throw error; // Let the caller handle the error
    }
  }

  // --- METHODS FOR OFFRAMP TRANSFERS ---

  /**
   * Create an offramp transfer request
   */
  async createOfframpTransfer(
    customerId: string,
    params: {
      amount: string;
      source_token: 'usdc' | 'usdt' | 'eurc';
      source_network: 'polygon' | 'ethereum' | 'base' | 'tron' | 'solana' | 'avalanche';
      destination_currency: 'usd' | 'eur' | 'mxn' | 'ars' | 'brl' | 'cny' | 'hkd' | 'sgd';
      destination_payment_rails: 'ach' | 'wire' | 'sepa' | 'swift' | 'instant_sepa';
      destination_bank_account: AlignDestinationBankAccount; // Use defined type
    }
  ): Promise<AlignOfframpTransfer> {
    console.log('params createOfframpTransfer', params);
    const response = await this.fetchWithAuth(
      `/v0/customers/${customerId}/offramp-transfer`,
      {
        method: 'POST',
        body: JSON.stringify({
          amount: params.amount,
          source_token: params.source_token,
          source_network: params.source_network,
          destination_currency: params.destination_currency,
          destination_payment_rails: params.destination_payment_rails,
          destination_bank_account: params.destination_bank_account,
        }),
      }
    );
    console.log('response createOfframpTransfer', response);
    response.created_at = response.created_at || new Date().toISOString();
    response.updated_at = response.updated_at || new Date().toISOString();
    return alignOfframpTransferSchema.parse(response); // Use schema defined outside
  }

  /**
   * Complete an offramp transfer by providing the deposit transaction hash
   */
  async completeOfframpTransfer(
    customerId: string,
    transferId: string,
    depositTransactionHash: string
  ): Promise<AlignOfframpTransfer> {
    const response = await this.fetchWithAuth(
      `/v0/customers/${customerId}/offramp-transfer/${transferId}/complete`,
      {
        method: 'POST',
        body: JSON.stringify({
          deposit_transaction_hash: depositTransactionHash,
        }),
      }
    );
    response.created_at = response.created_at || new Date().toISOString();
    response.updated_at = response.updated_at || new Date().toISOString();
    return alignOfframpTransferSchema.parse(response); // Use schema defined outside
  }

  /**
   * Get details of a specific offramp transfer
   */
  async getOfframpTransfer(
    customerId: string,
    transferId: string
  ): Promise<AlignOfframpTransfer> {
    const response = await this.fetchWithAuth(
      `/v0/customers/${customerId}/offramp-transfer/${transferId}`
    );
    response.created_at = response.created_at || new Date().toISOString();
    response.updated_at = response.updated_at || new Date().toISOString();
    return alignOfframpTransferSchema.parse(response); // Use schema defined outside
  }

}

// Export default instance
export const alignApi = new AlignApiClient(); 
