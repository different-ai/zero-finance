import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Environment variables
const ALIGN_API_KEY = process.env.ALIGN_API_KEY;
const ALIGN_API_BASE_URL =
  process.env.ALIGN_API_BASE_URL || 'https://sandbox.align.co/api';

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
  first_name: z.string().nullish(),
  last_name: z.string().nullish(),
  company_name: z.string().nullish(),
  beneficiary_type: z.enum(['individual', 'business']).nullish(),
  kycs: z
    .array(
      z.object({
        status: z.enum(['pending', 'approved', 'rejected']).nullable(),
        sub_status: z
          .enum([
            'kyc_form_submission_started',
            'kyc_form_submission_accepted',
            'kyc_form_resubmission_required',
          ])
          .optional()
          .nullable(),
        kyc_flow_link: z.string().url().nullable(),
      }),
    )
    .optional()
    .default([]),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type AlignCustomer = z.infer<typeof alignCustomerSchema>;

const alignVirtualAccountSchema = z.object({
  id: z.string(),
  customer_id: z.string(),
  source_currency: z.enum(['usd', 'eur']).optional(),
  destination_token: z.enum(['usdc', 'usdt']),
  destination_network: z.enum([
    'polygon',
    'ethereum',
    'base',
    'solana',
    'avalanche',
  ]),
  destination_address: z.string(),
  deposit_instructions: z.object({
    currency: z.enum(['usd', 'eur']),
    bank_name: z.string(),
    bank_address: z.string().optional(),
    // Support both naming conventions for backwards compatibility
    beneficiary_name: z.string(),
    beneficiary_address: z.string().optional(),
    account_beneficiary_name: z.string().nullable().optional(),
    account_beneficiary_address: z.string().nullable().optional(),
    // Payment rails
    payment_rails: z.array(z.string()).optional(),
    // US ACH specific fields - both direct and nested
    account_number: z.string().optional(),
    routing_number: z.string().optional(),
    // Nested US account details
    us: z
      .object({
        account_number: z.string(),
        routing_number: z.string(),
      })
      .optional(),
    // IBAN specific fields
    iban: z
      .object({
        iban_number: z.string(),
        bic: z.string().optional(),
      })
      .optional(),
    bic: z
      .object({
        bic_code: z.string(),
      })
      .optional(),
  }),
  status: z.enum(['active', 'inactive', 'pending', 'suspended']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type AlignVirtualAccount = z.infer<typeof alignVirtualAccountSchema>;

/* ---------- KYC session ---------- */
const alignKycSessionSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']).nullable(),
  sub_status: z
    .enum([
      'kyc_form_submission_started',
      'kyc_form_submission_accepted',
      'kyc_form_resubmission_required',
    ])
    .optional()
    .nullable(),
  kyc_flow_link: z.string().url().optional().nullable(),
});
export type AlignKycSession = z.infer<typeof alignKycSessionSchema>;

// wrapper for Align "create KYC session" response
const alignCreateKycSessionResponseSchema = z.object({
  kycs: alignKycSessionSchema,
});

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
const alignOfframpTransferSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'canceled']),
  amount: z.string(),
  source_token: z.enum(['usdc', 'usdt', 'eurc']),
  source_network: z.enum([
    'polygon',
    'ethereum',
    'base',
    'tron',
    'solana',
    'avalanche',
  ]),
  destination_currency: z.enum([
    'usd',
    'eur',
    'mxn',
    'ars',
    'brl',
    'cny',
    'hkd',
    'sgd',
  ]),
  destination_bank_account: z.object({
    bank_name: z.string(),
    account_holder_type: z.enum(['individual', 'business']),
    account_holder_first_name: z.string().optional().nullable(),
    account_holder_last_name: z.string().optional().nullable(),
    account_holder_business_name: z.string().optional().nullable(),
    account_holder_address: z
      .object({
        country: z.string().min(1),
        city: z.string().min(1),
        street_line_1: z.string().min(1),
        postal_code: z.string().min(1),
        state: z.string().optional(),
        street_line_2: z.string().optional(),
      })
      .optional(),
    account_type: z.enum(['us', 'iban']),
    us: z
      .object({
        account_number: z.string().optional(),
        routing_number: z.string().optional(),
      })
      .optional(),
    iban: z
      .object({
        iban_number: z.string().optional(),
        bic: z.string().optional(),
      })
      .optional(),
  }),
  quote: z.object({
    deposit_network: z.enum([
      'polygon',
      'ethereum',
      'base',
      'tron',
      'solana',
      'avalanche',
    ]),
    deposit_token: z.enum(['usdc', 'usdt', 'eurc']),
    deposit_blockchain_address: z.string(),
    deposit_amount: z.string(),
    fee_amount: z.string(),
    expires_at: z.string().datetime().optional(),
  }),
  deposit_transaction_hash: z.string().optional().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
});

export type AlignOfframpTransfer = z.infer<typeof alignOfframpTransferSchema>;

// --- LIST OFFRAMP TRANSFERS SCHEMA -----------------------------------------
// Schema for individual items in the list response (simplified structure)
const alignOfframpTransferListItemSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'canceled']),
  amount: z.string(),
  source_token: z.enum(['usdc', 'usdt', 'eurc']),
  source_network: z.enum([
    'polygon',
    'ethereum',
    'base',
    'tron',
    'solana',
    'avalanche',
  ]),
  destination_currency: z.enum([
    'usd',
    'eur',
    'mxn',
    'ars',
    'brl',
    'cny',
    'hkd',
    'sgd',
  ]),
  destination_bank_account: z.object({
    bank_name: z.string(),
    account_holder_type: z.enum(['individual', 'business']),
    account_holder_first_name: z.string().optional().nullable(),
    account_holder_last_name: z.string().optional().nullable(),
    account_holder_business_name: z.string().optional().nullable(),
    account_holder_address: z
      .object({
        country: z.string().min(1),
        city: z.string().min(1),
        street_line_1: z.string().min(1),
        postal_code: z.string().min(1),
        state: z.string().optional(),
        street_line_2: z.string().optional(),
      })
      .optional(),
    account_type: z.enum(['us', 'iban']),
    us: z
      .object({
        account_number: z.string().optional(),
        routing_number: z.string().optional(),
      })
      .optional(),
    iban: z
      .object({
        iban_number: z.string().optional(),
        bic: z.string().optional(),
      })
      .optional(),
  }),
});

const alignOfframpTransferListSchema = z.object({
  items: z.array(alignOfframpTransferListItemSchema),
});

export type AlignOfframpTransferListItem = z.infer<
  typeof alignOfframpTransferListItemSchema
>;
export type AlignOfframpTransferList = z.infer<
  typeof alignOfframpTransferListSchema
>;

// --- LIST ONRAMP TRANSFERS SCHEMA -----------------------------------------
const alignOnrampTransferListItemSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'processing', 'completed']),
  amount: z.string(),
  source_currency: z.enum(['usd', 'eur']),
  source_rails: z.enum(['ach', 'sepa', 'wire']),
  destination_network: z.enum(['polygon', 'ethereum', 'solana']),
  destination_token: z.enum(['usdc', 'usdt']),
  destination_address: z.string(),
  quote: z.object({
    deposit_rails: z.enum(['ach', 'sepa', 'wire']),
    deposit_currency: z.enum(['usd', 'eur']),
    deposit_bank_account: z.any().optional(),
    deposit_amount: z.string(),
    deposit_message: z.string(),
    fee_amount: z.string(),
  }),
});

const alignOnrampTransferListSchema = z.object({
  items: z.array(alignOnrampTransferListItemSchema),
});

export type AlignOnrampTransferListItem = z.infer<
  typeof alignOnrampTransferListItemSchema
>;
export type AlignOnrampTransferList = z.infer<
  typeof alignOnrampTransferListSchema
>;

/**
 * Client for interacting with the Align API
 */
class AlignApiClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly liteMode: boolean;

  constructor(apiKey = ALIGN_API_KEY, baseUrl = ALIGN_API_BASE_URL) {
    if (!apiKey) {
      console.warn('[Align] Running in Lite mode - banking features disabled');
      this.liteMode = true;
    } else {
      this.liteMode = false;
    }
    this.apiKey = apiKey || '';
    this.baseUrl = baseUrl;
  }

  private async fetchWithAuth(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<any> {
    // Check if running in lite mode
    if (this.liteMode) {
      throw new Error(
        'Align services not available in Lite mode. Please configure Align credentials to enable banking features.',
      );
    }

    const url = `${this.baseUrl}${endpoint}`;
    const method = options.method || 'GET';
    const body = options.body ? String(options.body) : ''; // Ensure body is string for hashing

    // Log request details
    console.log('[Align API Request]', {
      method,
      endpoint,
      url,
      body: body ? JSON.parse(body) : undefined,
      timestamp: new Date().toISOString(),
    });

    // --- Record/Replay Logic ---
    const fixturesDir = path.join(__dirname, '__fixtures__/align-api');
    const requestHash = crypto
      .createHash('sha256')
      .update(method + endpoint + body)
      .digest('hex');
    const fixturePath = path.join(fixturesDir, `${requestHash}.json`);

    if (process.env.ALIGN_REPLAY === 'true') {
      console.log(
        `[Align API REPLAY] Reading fixture for ${method} ${endpoint}: ${requestHash}.json`,
      );
      if (fs.existsSync(fixturePath)) {
        try {
          const fixtureData = fs.readFileSync(fixturePath, 'utf-8');
          return JSON.parse(fixtureData);
        } catch (err) {
          console.error(
            `[Align API REPLAY] Error reading or parsing fixture ${fixturePath}:`,
            err,
          );
          throw new Error(`Failed to read/parse fixture: ${fixturePath}`);
        }
      } else {
        console.warn(`[Align API REPLAY] Fixture not found: ${fixturePath}`);
        throw new Error(`Fixture not found for request: ${method} ${endpoint}`);
      }
    }
    // --- End Record/Replay Logic ---

    console.log('Align API request:', { url, method });
    const headers = {
      Authorization: `${this.apiKey}`,
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
            console.log('Align API response was not valid JSON:', textResponse);
          }
        } catch (textError) {
          // Fallback if reading text fails
          errorBody = `Status ${response.status}: ${response.statusText}`;
        }
        throw new AlignApiError(
          `Align API Error: ${errorBody}`,
          response.status,
        );
      }

      // If response is OK, try to parse JSON
      const data = await response.json();

      // Log successful response
      console.log('[Align API Response]', {
        method,
        endpoint,
        status: response.status,
        data: JSON.stringify(data, null, 2),
        timestamp: new Date().toISOString(),
      });

      // --- Record Logic ---
      if (process.env.ALIGN_RECORD === 'true') {
        console.log(
          `[Align API RECORD] Saving fixture for ${method} ${endpoint}: ${requestHash}.json`,
        );
        try {
          if (!fs.existsSync(fixturesDir)) {
            fs.mkdirSync(fixturesDir, { recursive: true });
          }
          fs.writeFileSync(fixturePath, JSON.stringify(data, null, 2));
        } catch (err) {
          console.error(
            `[Align API RECORD] Error writing fixture ${fixturePath}:`,
            err,
          );
          // Don't throw here, recording failure shouldn't break the app
        }
      }
      // --- End Record Logic ---

      return data;
    } catch (error) {
      if (error instanceof AlignApiError) {
        // Re-throw AlignApiError to be handled upstream
        throw error;
      }
      // Handle network errors or JSON parsing errors for OK responses (less likely but possible)
      console.error('Error fetching from Align API:', error);
      // Include more context if possible
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `Failed to process response from Align API: ${errorMessage}`,
      );
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
    beneficiaryType: 'individual' | 'corporate' = 'individual',
  ): Promise<AlignCustomer> {
    console.log('[createCustomer] Input params:', {
      email,
      firstName,
      lastName,
      companyName,
      beneficiaryType,
    });

    const payload = {
      email,
      ...(firstName && { first_name: firstName }),
      ...(lastName && { last_name: lastName }),
      ...(companyName && { company_name: companyName }),
      beneficiary_type: beneficiaryType,
    };
    console.log(
      '[createCustomer] Payload to send:',
      JSON.stringify(payload, null, 2),
    );

    const response = await this.fetchWithAuth('/v0/customers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    console.log(
      '[createCustomer] Response received:',
      JSON.stringify(response, null, 2),
    );

    try {
      const parsed = alignCustomerSchema.parse(response);
      console.log('[createCustomer] Successfully parsed customer data');
      return parsed;
    } catch (error) {
      console.error('[createCustomer] Zod parsing error:', error);
      throw error;
    }
  }

  /**
   * Search for a customer by email
   * This is used for recovery when a customer exists in Align but not in our db
   */
  async searchCustomerByEmail(email: string): Promise<AlignCustomer | null> {
    console.log('[searchCustomerByEmail] Searching for email:', email);
    try {
      // Using the proper customers endpoint with email query parameter
      const response = await this.fetchWithAuth(
        `/v0/customers?email=${encodeURIComponent(email)}`,
        {
          method: 'GET',
        },
      );
      console.log(
        '[searchCustomerByEmail] Raw response:',
        JSON.stringify(response, null, 2),
      );

      // Handle new response format with items array
      if (
        response &&
        response.items &&
        Array.isArray(response.items) &&
        response.items.length > 0
      ) {
        // Get the first matching customer from items array
        const customerData = response.items[0];

        // Create a schema-compatible object, excluding null values
        const alignCustomer: any = {
          customer_id: customerData.customer_id || customerData.id,
          email: customerData.email,
          kycs: customerData.kycs || [], // Initialize with empty kycs array if null
        };

        // Only add optional fields if they have non-null values
        if (customerData.first_name)
          alignCustomer.first_name = customerData.first_name;
        if (customerData.last_name)
          alignCustomer.last_name = customerData.last_name;
        if (customerData.company_name)
          alignCustomer.company_name = customerData.company_name;
        if (customerData.beneficiary_type)
          alignCustomer.beneficiary_type = customerData.beneficiary_type;
        if (customerData.created_at)
          alignCustomer.created_at = customerData.created_at;
        if (customerData.updated_at)
          alignCustomer.updated_at = customerData.updated_at;

        console.log(
          '[searchCustomerByEmail] Constructed customer object:',
          JSON.stringify(alignCustomer, null, 2),
        );

        try {
          const parsed = alignCustomerSchema.parse(alignCustomer);
          console.log(
            '[searchCustomerByEmail] Successfully parsed customer data',
          );
          return parsed;
        } catch (error) {
          console.error('[searchCustomerByEmail] Zod parsing error:', error);
          throw error;
        }
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
    console.log('[getCustomer] Fetching customer:', customerId);
    const response = await this.fetchWithAuth(`/v0/customers/${customerId}`);

    console.log(
      '[getCustomer] Raw response:',
      JSON.stringify(response, null, 2),
    );

    // Handle case where kycs is an object instead of an array
    if (response && response.kycs && !Array.isArray(response.kycs)) {
      console.log('[getCustomer] Converting kycs object to array');
      // Transform the object into an array with one item
      const transformedResponse = {
        ...response,
        kycs: [response.kycs],
      };

      console.log(
        '[getCustomer] Before parsing:',
        JSON.stringify(transformedResponse, null, 2),
      );
      try {
        const parsed = alignCustomerSchema.parse(transformedResponse);
        console.log('[getCustomer] Successfully parsed customer data');
        return parsed;
      } catch (error) {
        console.error('[getCustomer] Zod parsing error:', error);
        throw error;
      }
    }

    console.log(
      '[getCustomer] Before parsing (no transformation):',
      JSON.stringify(response, null, 2),
    );
    try {
      const parsed = alignCustomerSchema.parse(response);
      console.log('[getCustomer] Successfully parsed customer data');
      return parsed;
    } catch (error) {
      console.error('[getCustomer] Zod parsing error:', error);
      throw error;
    }
  }

  /**
   * Get raw customer details from Align without Zod parsing
   */
  async getRawCustomer(customerId: string): Promise<any> {
    const response = await this.fetchWithAuth(`/v0/customers/${customerId}`);

    // Handle case where kycs is an object instead of an array
    if (response && response.kycs && !Array.isArray(response.kycs)) {
      // Transform the object into an array with one item
      const transformedResponse = {
        ...response,
        kycs: [response.kycs],
      };
      return transformedResponse;
    }

    return response;
  }

  /**
   * Explicitly create / restart a KYC session for a customer.
   * Align's endpoint is POST /v0/customers/{id}/kycs (note the plural).
   * It returns `{ kycs: { status, kyc_flow_link } }`.
   */
  async createKycSession(customerId: string): Promise<AlignKycSession> {
    const response = await this.fetchWithAuth(
      `/v0/customers/${customerId}/kycs`,
      { method: 'POST' },
    );

    const parsed = alignCreateKycSessionResponseSchema.parse(response);
    return parsed.kycs; // unwrap so callers get {status, kyc_flow_link}
  }

  /**
   * Create a virtual account for a customer
   */
  async createVirtualAccount(
    customerId: string,
    data: {
      source_currency: 'usd' | 'eur';
      destination_token: 'usdc' | 'usdt';
      destination_network:
        | 'polygon'
        | 'ethereum'
        | 'base'
        | 'solana'
        | 'avalanche';
      destination_address: string;
    },
  ): Promise<AlignVirtualAccount> {
    const response = await this.fetchWithAuth(
      `/v0/customers/${customerId}/virtual-account`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    );

    // Log the raw response for debugging
    console.log(
      'Raw Align API response for createVirtualAccount:',
      JSON.stringify(response, null, 2),
    );

    // Handle field mapping - the beneficiary_name might be under account_beneficiary_name
    if (
      !response.deposit_instructions?.beneficiary_name &&
      response.deposit_instructions?.account_beneficiary_name
    ) {
      if (!response.deposit_instructions.beneficiary_name) {
        // Add beneficiary_name field using account_beneficiary_name
        response.deposit_instructions.beneficiary_name =
          response.deposit_instructions.account_beneficiary_name;
      }
    }

    // Handle BIC - might be inside iban object
    if (
      response.deposit_instructions?.iban?.bic &&
      !response.deposit_instructions?.bic
    ) {
      // BIC is inside iban object, make it available in both places for backward compatibility
      response.deposit_instructions.bic = {
        bic_code: response.deposit_instructions.iban.bic,
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
        beneficiary_name: 'User Account',
      };
    } else {
      response.deposit_instructions.currency =
        response.deposit_instructions.currency || data.source_currency;
      response.deposit_instructions.bank_name =
        response.deposit_instructions.bank_name || 'Align Bank';
      response.deposit_instructions.beneficiary_name =
        response.deposit_instructions.beneficiary_name || 'User Account';
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
    virtualAccountId: string,
  ): Promise<AlignVirtualAccount> {
    const response = await this.fetchWithAuth(
      `/v0/customers/${customerId}/virtual-account/${virtualAccountId}`,
    );

    console.log(
      'Raw Align API response for getVirtualAccount:',
      JSON.stringify(response, null, 2),
    );

    // Handle field mapping - the beneficiary_name might be under account_beneficiary_name
    if (
      !response.deposit_instructions?.beneficiary_name &&
      response.deposit_instructions?.account_beneficiary_name
    ) {
      if (!response.deposit_instructions.beneficiary_name) {
        // Add beneficiary_name field using account_beneficiary_name
        response.deposit_instructions.beneficiary_name =
          response.deposit_instructions.account_beneficiary_name;
      }
    }

    // Handle BIC - might be inside iban object
    if (
      response.deposit_instructions?.iban?.bic &&
      !response.deposit_instructions?.bic
    ) {
      // BIC is inside iban object, make it available in both places for backward compatibility
      response.deposit_instructions.bic = {
        bic_code: response.deposit_instructions.iban.bic,
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
        beneficiary_name: 'User Account',
      };
    } else {
      response.deposit_instructions.currency =
        response.deposit_instructions.currency ||
        response.source_currency ||
        'usd';
      response.deposit_instructions.bank_name =
        response.deposit_instructions.bank_name || 'Align Bank';
      response.deposit_instructions.beneficiary_name =
        response.deposit_instructions.beneficiary_name || 'User Account';
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
   * List all virtual accounts for a customer
   */
  async listVirtualAccounts(
    customerId: string,
  ): Promise<{ items: AlignVirtualAccount[] }> {
    const response = await this.fetchWithAuth(
      `/v0/customers/${customerId}/virtual-account`,
    );

    console.log(
      'Raw Align API response for listVirtualAccounts:',
      JSON.stringify(response, null, 2),
    );

    return response;
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
      source_network:
        | 'polygon'
        | 'ethereum'
        | 'base'
        | 'tron'
        | 'solana'
        | 'avalanche';
      destination_currency:
        | 'usd'
        | 'eur'
        | 'mxn'
        | 'ars'
        | 'brl'
        | 'cny'
        | 'hkd'
        | 'sgd';
      destination_payment_rails:
        | 'ach'
        | 'wire'
        | 'sepa'
        | 'swift'
        | 'instant_sepa';
      destination_bank_account: AlignDestinationBankAccount; // Use defined type
    },
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
      },
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
    depositTransactionHash: string,
  ): Promise<AlignOfframpTransfer> {
    const response = await this.fetchWithAuth(
      `/v0/customers/${customerId}/offramp-transfer/${transferId}/complete`,
      {
        method: 'POST',
        body: JSON.stringify({
          deposit_transaction_hash: depositTransactionHash,
        }),
      },
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
    transferId: string,
  ): Promise<AlignOfframpTransfer> {
    const response = await this.fetchWithAuth(
      `/v0/customers/${customerId}/offramp-transfer/${transferId}`,
    );
    response.created_at = response.created_at || new Date().toISOString();
    response.updated_at = response.updated_at || new Date().toISOString();
    return alignOfframpTransferSchema.parse(response); // Use schema defined outside
  }

  /**
   * Get all offramp transfers for a customer – supports limit & skip params.
   * Docs: GET /v0/customers/{customer_id}/offramp-transfer
   */
  async getAllOfframpTransfers(
    customerId: string,
    params?: { limit?: number; skip?: number },
  ): Promise<AlignOfframpTransferListItem[]> {
    const query = [];
    if (params?.limit !== undefined) query.push(`limit=${params.limit}`);
    if (params?.skip !== undefined) query.push(`skip=${params.skip}`);
    const qs = query.length ? `?${query.join('&')}` : '';

    const response = await this.fetchWithAuth(
      `/v0/customers/${customerId}/offramp-transfer${qs}`,
    );

    const parsed = alignOfframpTransferListSchema.parse(response);
    return parsed.items;
  }

  /**
   * Create an onramp transfer request
   */
  async createOnrampTransfer(
    customerId: string,
    params: {
      amount: string;
      source_currency: 'usd' | 'eur';
      source_rails: 'swift' | 'ach' | 'sepa' | 'wire';
      destination_network: 'polygon' | 'ethereum' | 'tron' | 'solana';
      destination_token: 'usdc' | 'usdt';
      destination_address: string;
    },
  ): Promise<any> {
    const response = await this.fetchWithAuth(
      `/v0/customers/${customerId}/onramp-transfer`,
      {
        method: 'POST',
        body: JSON.stringify(params),
      },
    );
    return response;
  }

  /**
   * Get all onramp transfers for a customer – supports limit & skip params.
   * Docs: GET /v0/customers/{customer_id}/onramp-transfer
   */
  async getAllOnrampTransfers(
    customerId: string,
    params?: { limit?: number; skip?: number },
  ): Promise<AlignOnrampTransferListItem[]> {
    const query: string[] = [];
    if (params?.limit !== undefined) query.push(`limit=${params.limit}`);
    if (params?.skip !== undefined) query.push(`skip=${params.skip}`);
    const qs = query.length ? `?${query.join('&')}` : '';

    const response = await this.fetchWithAuth(
      `/v0/customers/${customerId}/onramp-transfer${qs}`,
    );

    const parsed = alignOnrampTransferListSchema.parse(response);
    return parsed.items;
  }
}

// Export default instance
export const alignApi = new AlignApiClient();
