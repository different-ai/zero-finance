import { db } from '@/db';
import {
  userProfilesTable,
  userRequestsTable,
  type NewUserRequest,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { parseUnits } from 'viem';
import Decimal from 'decimal.js';

/**
 * Invoice Service for AI Email Agent
 *
 * Provides simplified invoice creation for the AI agent.
 * Unlike the full invoice router, this:
 * - Takes a userId instead of auth context
 * - Accepts simplified input (no full schema required)
 * - Auto-generates invoice metadata
 */

export interface CreateInvoiceParams {
  /** The email of the invoice recipient */
  recipientEmail: string;
  /** Optional name of the recipient */
  recipientName?: string;
  /** Optional company name of the recipient */
  recipientCompany?: string;
  /** Invoice amount (as a number, e.g., 2500.00) */
  amount: number;
  /** Currency code (USD, EUR, USDC, etc.) */
  currency: string;
  /** Description of the invoice / work performed */
  description: string;
  /** Optional billing address */
  billingAddress?: string;
}

export interface CreatedInvoice {
  invoiceId: string;
  publicLink: string;
  amount: number;
  currency: string;
  recipientEmail: string;
  recipientName?: string;
  description: string;
}

/**
 * Get currency decimals for amount formatting.
 */
function getCurrencyDecimals(currency: string): number {
  const upperCurrency = currency.toUpperCase();

  // Crypto currencies
  if (upperCurrency === 'USDC' || upperCurrency === 'USDT') {
    return 6;
  }
  if (upperCurrency === 'ETH' || upperCurrency === 'WETH') {
    return 18;
  }

  // Fiat currencies default to 2 decimals
  return 2;
}

/**
 * Generate a unique invoice number.
 */
function generateInvoiceNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AI-${timestamp}-${random}`;
}

/**
 * Create an invoice for a user via the AI email agent.
 *
 * @param userId - The Privy DID of the user creating the invoice
 * @param workspaceId - The workspace ID for the invoice
 * @param params - Simplified invoice parameters
 * @returns The created invoice with public link
 */
export async function createInvoiceForUser(
  userId: string,
  workspaceId: string,
  params: CreateInvoiceParams,
): Promise<CreatedInvoice> {
  // Get user profile for seller info
  const [userProfile] = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.privyDid, userId))
    .limit(1);

  if (!userProfile) {
    throw new Error(
      `User profile not found for userId: ${userId}. User must have a profile to create invoices.`,
    );
  }

  const decimals = getCurrencyDecimals(params.currency);
  const invoiceNumber = generateInvoiceNumber();
  const creationDate = new Date().toISOString();

  // Build the full invoice data structure
  const invoiceData = {
    meta: {
      format: 'rnf_invoice',
      version: '0.0.3',
    },
    creationDate,
    invoiceNumber,
    sellerInfo: {
      businessName:
        userProfile.businessName || userProfile.email || 'Unknown Seller',
      email: userProfile.email || '',
    },
    buyerInfo: {
      businessName: params.recipientCompany || params.recipientName || '',
      email: params.recipientEmail,
      address: params.billingAddress
        ? {
            'street-address': params.billingAddress,
          }
        : undefined,
    },
    invoiceItems: [
      {
        name: params.description,
        quantity: 1,
        unitPrice: params.amount.toString(),
        currency: params.currency,
        tax: {
          type: 'percentage' as const,
          amount: '0',
        },
      },
    ],
    currency: params.currency,
    paymentType: 'crypto' as const, // Default to crypto for now
  };

  // Calculate amount in smallest units
  const amountDecimal = new Decimal(params.amount);
  const amountBigInt = parseUnits(amountDecimal.toFixed(decimals), decimals);

  // Determine client name for display
  const clientName =
    params.recipientCompany ||
    params.recipientName ||
    params.recipientEmail.split('@')[0];

  // Create the database record
  const requestData: NewUserRequest = {
    id: crypto.randomUUID(),
    userId,
    workspaceId,
    role: 'seller',
    description: params.description,
    amount: amountBigInt,
    currency: params.currency,
    currencyDecimals: decimals,
    status: 'db_pending', // Start as pending in DB
    client: clientName,
    invoiceData,
  };

  const [newInvoice] = await db
    .insert(userRequestsTable)
    .values(requestData)
    .returning();

  if (!newInvoice) {
    throw new Error('Failed to create invoice in database');
  }

  // Generate the public link
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://0.finance';
  const publicLink = `${baseUrl}/invoice/${newInvoice.id}`;

  return {
    invoiceId: newInvoice.id,
    publicLink,
    amount: params.amount,
    currency: params.currency,
    recipientEmail: params.recipientEmail,
    recipientName: params.recipientName,
    description: params.description,
  };
}

/**
 * Get invoice details by ID.
 */
export async function getInvoiceById(
  invoiceId: string,
): Promise<typeof userRequestsTable.$inferSelect | null> {
  const [invoice] = await db
    .select()
    .from(userRequestsTable)
    .where(eq(userRequestsTable.id, invoiceId))
    .limit(1);

  return invoice || null;
}

/**
 * Generate a public link for an invoice.
 */
export function getInvoicePublicLink(invoiceId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://0.finance';
  return `${baseUrl}/invoice/${invoiceId}`;
}
