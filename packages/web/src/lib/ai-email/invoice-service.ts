import { db } from '@/db';
import {
  userProfilesTable,
  userRequestsTable,
  workspaces,
  userFundingSources,
  type NewUserRequest,
} from '@/db/schema';
import { eq, and } from 'drizzle-orm';
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
 * - Uses workspace company info for seller details
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
  /** Email of the person creating the invoice (sender's email from forwarded email) */
  senderEmail?: string;
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
  // Get workspace info for seller details (company name, etc.)
  const [workspace] = await db
    .select({
      companyName: workspaces.companyName,
      firstName: workspaces.firstName,
      lastName: workspaces.lastName,
      workspaceType: workspaces.workspaceType,
      name: workspaces.name,
    })
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .limit(1);

  // Get user profile for email fallback
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

  // Get workspace's US bank account for payment details (prefer 'full' tier accounts)
  const [fundingSource] = await db
    .select({
      accountType: userFundingSources.sourceAccountType,
      bankName: userFundingSources.sourceBankName,
      beneficiaryName: userFundingSources.sourceBankBeneficiaryName,
      accountNumber: userFundingSources.sourceAccountNumber,
      routingNumber: userFundingSources.sourceRoutingNumber,
      iban: userFundingSources.sourceIban,
      bic: userFundingSources.sourceBicSwift,
    })
    .from(userFundingSources)
    .where(
      and(
        eq(userFundingSources.workspaceId, workspaceId),
        eq(userFundingSources.sourceAccountType, 'us_ach'),
      ),
    )
    .limit(1);

  const decimals = getCurrencyDecimals(params.currency);
  const invoiceNumber = generateInvoiceNumber();
  const creationDate = new Date().toISOString();

  // Determine seller business name from workspace info
  // Priority: workspace.companyName > workspace firstName+lastName > userProfile.businessName > workspace.name > email
  let sellerBusinessName: string;
  if (workspace?.companyName) {
    sellerBusinessName = workspace.companyName;
  } else if (workspace?.firstName && workspace?.lastName) {
    sellerBusinessName = `${workspace.firstName} ${workspace.lastName}`;
  } else if (workspace?.firstName) {
    sellerBusinessName = workspace.firstName;
  } else if (userProfile.businessName) {
    sellerBusinessName = userProfile.businessName;
  } else if (workspace?.name) {
    sellerBusinessName = workspace.name;
  } else {
    sellerBusinessName = userProfile.email || 'Unknown Seller';
  }

  // Build the full invoice data structure
  // Use the sender's email (from forwarded email) if provided, otherwise fall back to user profile email
  const sellerEmail = params.senderEmail || userProfile.email || '';

  // Build bank details if we have a US bank account
  const bankDetails = fundingSource
    ? {
        accountHolder: fundingSource.beneficiaryName || sellerBusinessName,
        bankName: fundingSource.bankName || '',
        accountNumber: fundingSource.accountNumber || '',
        routingNumber: fundingSource.routingNumber || '',
        iban: fundingSource.iban || undefined,
        bic: fundingSource.bic || undefined,
      }
    : null;

  // Use fiat payment type if we have bank details, otherwise crypto
  const paymentType = bankDetails ? ('fiat' as const) : ('crypto' as const);

  const invoiceData = {
    meta: {
      format: 'rnf_invoice',
      version: '0.0.3',
    },
    creationDate,
    invoiceNumber,
    sellerInfo: {
      businessName: sellerBusinessName,
      email: sellerEmail,
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
    paymentType,
    bankDetails,
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
