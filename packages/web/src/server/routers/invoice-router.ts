import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../create-router';
import { TRPCError } from '@trpc/server';
import { createInvoiceRequest } from '@/lib/request-network';
import {
  RequestLogicTypes,
  ExtensionTypes,
  CurrencyTypes,
  IdentityTypes,
  PaymentTypes,
} from '@requestnetwork/types';
import { userProfileService } from '@/lib/user-profile-service';
import { userRequestService } from '@/lib/user-request-service';
import { isAddress, parseUnits, formatUnits } from 'viem';
import { db } from '@/db';
import { 
    userProfilesTable, 
    NewUserRequest, 
    type InvoiceRole,
    type InvoiceStatus,
    userRequestsTable
} from '@/db/schema';
import { eq, and, desc, asc, or, ne } from 'drizzle-orm';
import { getCurrencyConfig, CurrencyConfig } from '@/lib/currencies';

// Simple cache for currency configurations to avoid repeated lookups
const currencyConfigCache = new Map<string, CurrencyConfig | null>();

// Cached wrapper for getCurrencyConfig
function getCachedCurrencyConfig(currency: string, network: string): CurrencyConfig | null {
  const cacheKey = `${currency}-${network}`;
  
  if (currencyConfigCache.has(cacheKey)) {
    return currencyConfigCache.get(cacheKey)!;
  }
  
  const config = getCurrencyConfig(currency, network);
  // Convert undefined to null for consistent typing
  const normalizedConfig = config ?? null;
  currencyConfigCache.set(cacheKey, normalizedConfig);
  
  return normalizedConfig;
}
import { RequestNetwork, Types, Utils } from '@requestnetwork/request-client.js';
import { Wallet, ethers } from 'ethers';
import Decimal from 'decimal.js';
import { USDC_ADDRESS } from '@/lib/constants';

// Define types that explicitly include the 'type' property
// Ensure these match the structure expected by CurrencyTypes.CurrencyDefinition implicitly

// USDC on Base mainnet configuration
const USDC_BASE_CONFIG = {
  type: RequestLogicTypes.CURRENCY.ERC20,
  value: USDC_ADDRESS, // Base USDC
  network: 'base' as const,
  // paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT, // Not part of base currency def
  decimals: 6,
};

// ETH on Base mainnet configuration
const ETH_BASE_CONFIG = {
  type: RequestLogicTypes.CURRENCY.ETH,
  value: 'ETH-native',
  symbol: 'ETH',
  network: 'base' as const,
  // paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID.NATIVE_TOKEN, // Not part of base currency def
  decimals: 18,
};

// Fiat currency configurations
const FIAT_CURRENCIES = {
  EUR: {
    type: RequestLogicTypes.CURRENCY.ISO4217,
    value: 'EUR',
    network: 'mainnet' as const,
    // paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID.ANY_DECLARATIVE, // Not part of base currency def
    decimals: 2,
  },
  USD: {
    type: RequestLogicTypes.CURRENCY.ISO4217,
    value: 'USD',
    network: 'mainnet' as const,
    // paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID.ANY_DECLARATIVE,
    decimals: 2,
  },
  GBP: {
    type: RequestLogicTypes.CURRENCY.ISO4217,
    value: 'GBP',
    network: 'mainnet' as const,
    // paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID.ANY_DECLARATIVE,
    decimals: 2,
  },
} as const; // Use const assertion

// Define a helper type for the structure of our config objects
type AppCurrencyConfig =
  | typeof USDC_BASE_CONFIG
  | typeof ETH_BASE_CONFIG
  | (typeof FIAT_CURRENCIES)[keyof typeof FIAT_CURRENCIES];

// Define our Zod schemas for validation
const invoiceItemSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  unitPrice: z.string(),
  currency: z.string(),
  tax: z.object({
    type: z.literal('percentage'),
    amount: z.string(),
  }),
});

const addressSchema = z.object({
  'street-address': z.string().optional(),
  locality: z.string().optional(),
  'postal-code': z.string().optional(),
  'country-name': z.string().optional(),
});

const bankDetailsSchema = z
  .object({
    accountHolder: z.string().optional(),
    accountNumber: z.string().optional(),
    routingNumber: z.string().optional(),
    iban: z.string().optional(),
    bic: z.string().optional(),
    swiftCode: z.string().optional(),
    bankName: z.string().optional(),
    bankAddress: z.string().optional(),
  })
  .optional();

// Export the schema for use in client code
export const invoiceDataSchema = z.object({
  meta: z.object({
    format: z.string(),
    version: z.string(),
  }),
  network: z.string().optional(),
  creationDate: z.string(),
  invoiceNumber: z.string(),
  companyId: z.string().optional(), // Add company ID
  recipientCompanyId: z.string().optional(), // Add recipient company ID
  sellerInfo: z.object({
    businessName: z.string(),
    email: z.string().email(),
    address: addressSchema.optional(),
  }),
  buyerInfo: z.object({
    businessName: z.string().optional(),
    email: z.string().email(),
    address: addressSchema.optional(),
  }),
  invoiceItems: z.array(invoiceItemSchema),
  paymentTerms: z
    .object({
      dueDate: z.string().optional(),
    })
    .optional(),
  note: z.string().optional(),
  terms: z.string().optional(),
  paymentType: z.enum(['crypto', 'fiat']).default('crypto'),
  paymentMethod: z.enum(['ach', 'sepa', 'crypto']).optional(), // Added: specific payment method
  paymentAddress: z.string().optional(), // Added: crypto wallet address
  currency: z.string(),
  bankDetails: bankDetailsSchema,
  // primarySafeAddress: z.string().optional(), // Removed - will fetch from DB
});

// Define the array of valid statuses manually from the type
const validInvoiceStatuses: [InvoiceStatus, ...InvoiceStatus[]] = [
  'pending',
  'paid',
  'db_pending',
  'committing',
  'failed',
  'canceled',
];

// --- Internal Commit Function --- 
// Refactored logic from the mutation to be callable internally
async function _internalCommitToRequestNetwork(invoiceId: string, userId: string) {
  try {
    console.log(`0xHypr INTERNAL Starting RN commit for invoice: ${invoiceId} by user ${userId}`);

    // Update status to 'committing'
    try {
      await userRequestService.updateRequest(invoiceId, { status: 'committing' });
    } catch (updateError) {
      console.warn(`0xHypr Could not update status to 'committing' for ${invoiceId}, proceeding anyway:`, updateError);
    }

    const invoice = await userRequestService.getRequestByPrimaryKey(invoiceId);
    // Basic checks before proceeding
    if (!invoice) throw new TRPCError({ code: 'NOT_FOUND', message: `Invoice ${invoiceId} not found.` });
    if (invoice.userId !== userId) throw new TRPCError({ code: 'FORBIDDEN', message: `User ${userId} forbidden from committing invoice ${invoiceId}.` });
    if (invoice.requestId) {
       console.log(`0xHypr INTERNAL Invoice ${invoiceId} already has requestId: ${invoice.requestId}. Skipping commit.`);
       // Optionally reset status if needed, or just return success
       // await userRequestService.updateRequest(invoiceId, { status: 'pending' }); 
       return { success: true, invoiceId: invoice.id, requestId: invoice.requestId, alreadyCommitted: true };
    }
    
    const invoiceData = invoice.invoiceData as z.infer<typeof invoiceDataSchema>;
    if (!invoiceData) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invoice data missing.' });

    // Fetch necessary user data (wallet, profile) in parallel
    const [userWallet, userProfile] = await Promise.all([
      userProfileService.getOrCreateWallet(userId),
      userProfileService.getOrCreateProfile(userId, '') // Email isn't strictly needed if profile exists
    ]);
    
    if (!userWallet?.privateKey) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'User signing wallet missing.' });
    if (!userProfile?.primarySafeAddress) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'User profile or primary Safe address not found.' });
    }
    const payeeAddress = userProfile.primarySafeAddress;

    // Retrieve amount and decimals directly from DB
    const amountBigInt = invoice.amount;
    const decimals = invoice.currencyDecimals;

    if (amountBigInt === null || amountBigInt === undefined || decimals === null || decimals === undefined) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Invoice amount or decimals missing from database record.' });
    }

    const paymentType = invoiceData.paymentType || 'crypto';
    let rnNetwork: 'base' | 'xdai' | 'mainnet';
    if (paymentType === 'fiat') {
      rnNetwork = 'mainnet';
    } else {
      rnNetwork = (invoiceData.network === 'base' || invoiceData.network === 'xdai' || invoiceData.network === 'mainnet')
                  ? invoiceData.network
                  : 'base';
    }
    const selectedConfig = getCachedCurrencyConfig(invoiceData.currency, rnNetwork);
    if (!selectedConfig) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: `Unsupported currency/network combination` });
    }
    if (decimals !== selectedConfig.decimals) {
      console.warn(`0xHypr WARN - Mismatch between stored decimals (${decimals}) and config decimals (${selectedConfig.decimals}) for currency ${invoiceData.currency}. Using stored decimals.`);
    }

    const expectedAmount = amountBigInt.toString();

    let paymentNetworkParams: any;
    let paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID;
    if (paymentType === 'fiat') {
      paymentNetworkId = ExtensionTypes.PAYMENT_NETWORK_ID.ANY_DECLARATIVE;
      if (!invoiceData.bankDetails) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Bank details required for fiat invoices.' });
      }
      const formattedAmountForInstruction = formatUnits(amountBigInt, decimals);
      const bankDetails = invoiceData.bankDetails;
      let paymentInstructionDetails = `Pay ${invoiceData.currency} ${formattedAmountForInstruction} via Bank Transfer.\n`;
      paymentInstructionDetails += `Account Holder: ${bankDetails?.accountHolder || 'N/A'}\n`;
      
      // Include either IBAN or US account details
      if (bankDetails?.iban) {
        paymentInstructionDetails += `IBAN: ${bankDetails.iban}\n`;
        if (bankDetails?.bic) paymentInstructionDetails += `BIC/SWIFT: ${bankDetails.bic}\n`;
      } else if (bankDetails?.accountNumber || bankDetails?.routingNumber) {
        if (bankDetails?.accountNumber) paymentInstructionDetails += `Account Number: ${bankDetails.accountNumber}\n`;
        if (bankDetails?.routingNumber) paymentInstructionDetails += `Routing Number: ${bankDetails.routingNumber}\n`;
      }
      
      paymentInstructionDetails += `Bank: ${bankDetails?.bankName || 'N/A'}\n`;
      paymentInstructionDetails += `Reference: ${invoiceData.invoiceNumber}`;
      
      paymentNetworkParams = {
        paymentInstruction: paymentInstructionDetails,
      };
    } else { // crypto
      const cryptoPaymentAddress = userWallet.address;
      if (selectedConfig.type === RequestLogicTypes.CURRENCY.ETH) {
        paymentNetworkId = ExtensionTypes.PAYMENT_NETWORK_ID.NATIVE_TOKEN;
        paymentNetworkParams = { paymentAddress: cryptoPaymentAddress, network: rnNetwork };
      } else if (selectedConfig.type === RequestLogicTypes.CURRENCY.ERC20) {
        paymentNetworkId = ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT;
        paymentNetworkParams = { paymentAddress: cryptoPaymentAddress, feeAddress: ethers.constants.AddressZero, feeAmount: '0', network: rnNetwork };
      } else {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Unsupported crypto setup.' });
      }
      // Ensure payee address is set correctly for crypto
      paymentNetworkParams.paymentAddress = payeeAddress;
    }

    const currencyValue = selectedConfig.type === RequestLogicTypes.CURRENCY.ERC20 ? selectedConfig.value : selectedConfig.value.toUpperCase();
    const rnCurrencyType = selectedConfig.type as RequestLogicTypes.CURRENCY;

    // Use the same cleaning function as before
    // function cleanInvoiceDataForRequestNetwork(data: any, decimals: number): any {
    //   return {
    //     meta: data.meta, creationDate: data.creationDate, invoiceNumber: data.invoiceNumber,
    //     sellerInfo: data.sellerInfo, buyerInfo: data.buyerInfo,
    //     invoiceItems: data.invoiceItems.map((item: any) => {
    //       const unitPriceDecimal = new Decimal(item.unitPrice || '0');
    //       const unitPriceSmallestUnit = parseUnits(unitPriceDecimal.toFixed(decimals), decimals);
    //       return {
    //         name: item.name,
    //         quantity: item.quantity,
    //         unitPrice: unitPriceSmallestUnit.toString(),
    //         tax: item.tax,
    //         currency: data.currency,
    //       };
    //     }),
    //     paymentTerms: data.paymentTerms, note: data.note, terms: data.terms,
    //     ...(data.bankDetails && { bankDetails: data.bankDetails }),
    //   };
    // }

    const requestDataForRN = {
      currency: { type: rnCurrencyType, value: currencyValue, network: rnNetwork, decimals: decimals },
      expectedAmount: expectedAmount,
      payee: { type: IdentityTypes.TYPE.ETHEREUM_ADDRESS, value: payeeAddress },
      timestamp: Utils.getCurrentTimestampInSecond(),
      // contentData: cleanInvoiceDataForRequestNetwork(invoiceData, decimals),
      paymentNetwork: { id: paymentNetworkId, parameters: paymentNetworkParams },
    };

    console.log("0xHypr INTERNAL Calling createInvoiceRequest...", requestDataForRN);
    const rnResult = await createInvoiceRequest(
      requestDataForRN as any,
      payeeAddress,
      userWallet
    );

    if (!rnResult?.requestId) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed Request Network result.' });
    }

    console.log(`0xHypr INTERNAL RN commit successful: RequestID=${rnResult.requestId}`);

    // Update status to 'pending' on successful commit
    await userRequestService.updateRequest(invoiceId, {
      requestId: rnResult.requestId,
      status: 'pending',
      walletAddress: userWallet.address, // Assuming address is guaranteed if private key exists
    });

    return {
      success: true,
      invoiceId: invoice.id,
      requestId: rnResult.requestId,
      alreadyCommitted: false
    };

  } catch (error) {
    console.error(`Error committing invoice ${invoiceId} to RN (internal):`, error);
    // Update status to 'failed' if commit fails
    try {
      await userRequestService.updateRequest(invoiceId, { status: 'failed' });
    } catch (updateError) {
      console.error(`0xHypr Failed to update status to 'failed' after commit error for ${invoiceId}:`, updateError);
    }
    // Re-throw the original error to be caught by the caller (background task or mutation)
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to commit invoice.', cause: error });
  }
}
// --- End Internal Commit Function ---

export const invoiceRouter = router({
  // Update invoice status (for company owners only)
  updateStatus: protectedProcedure
    .input(z.object({
      id: z.string(), // Changed from invoiceId to id to match the expected input
      status: z.enum(['pending', 'paid', 'canceled']),
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;
      const { id: invoiceId, status } = input;

      // Get the invoice
      const invoice = await db
        .select()
        .from(userRequestsTable)
        .where(eq(userRequestsTable.id, invoiceId))
        .limit(1);

      if (!invoice[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invoice not found',
        });
      }

      // Check if user owns the recipient company
      const { companies } = await import('@/db/schema');
      const recipientCompanyId = invoice[0].recipientCompanyId;
      
      if (!recipientCompanyId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'This invoice is not directed to a company',
        });
      }

      // Verify user owns the recipient company
      const [company] = await db
        .select()
        .from(companies)
        .where(and(
          eq(companies.id, recipientCompanyId),
          eq(companies.ownerPrivyDid, userId)
        ))
        .limit(1);

      if (!company) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not own the company this invoice is directed to',
        });
      }

      // Update the invoice status
      await db
        .update(userRequestsTable)
        .set({ 
          status: status as InvoiceStatus,
          updatedAt: new Date()
        })
        .where(eq(userRequestsTable.id, invoiceId));

      console.log(`Invoice ${invoiceId} status updated to ${status} by company owner ${userId}`);

      return { success: true, invoiceId, newStatus: status };
    }),
  // Example endpoint to list invoices
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(), // Assuming cursor is the 'id' (UUID string) of the last item
        // Add sorting parameters
        sortBy: z.enum(['date', 'amount']).optional().default('date'),
        sortDirection: z.enum(['asc', 'desc']).optional().default('desc'),
        filter: z.enum(['all', 'sent', 'received']).optional().default('all'),
      }),
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 50;
      const { sortBy, sortDirection, filter } = input;
      // const cursor = input.cursor; // Cursor logic removed for now
      const userId = ctx.user.id;

      try {
        // Import necessary schema items
        const { companies } = await import('@/db/schema');
        const { inArray, isNull } = await import('drizzle-orm');
        
        // Get ONLY companies the user OWNS (not just member of)
        const ownedCompanies = await db
          .select({ id: companies.id })
          .from(companies)
          .where(and(
            eq(companies.ownerPrivyDid, userId),
            isNull(companies.deletedAt)
          ));
        
        const ownedCompanyIds = ownedCompanies.map(c => c.id);

        // Build query conditions based on filter
        let queryConditions;
        
        if (filter === 'sent') {
          // OUTGOING: Always show invoices I created, regardless of company ownership
          queryConditions = eq(userRequestsTable.userId, userId);
        } else if (filter === 'received') {
          // INCOMING: Show invoices directed to my owned companies (created by others)
          if (ownedCompanyIds.length === 0) {
            // No companies = no incoming invoices
            queryConditions = eq(userRequestsTable.id, 'no-match'); // Never matches
          } else {
            // Invoices to my companies that I didn't create
            queryConditions = and(
              inArray(userRequestsTable.recipientCompanyId, ownedCompanyIds),
              ne(userRequestsTable.userId, userId)
            );
          }
        } else {
          // ALL: Show all invoices I created OR involving my owned companies
          const conditions = [eq(userRequestsTable.userId, userId)]; // Always include user's invoices
          
          if (ownedCompanyIds.length > 0) {
            // Also include invoices involving my companies
            const companyCondition = or(
              inArray(userRequestsTable.senderCompanyId, ownedCompanyIds),
              inArray(userRequestsTable.recipientCompanyId, ownedCompanyIds)
            );
            if (companyCondition) {
              conditions.push(companyCondition);
            }
          }
          
          queryConditions = conditions.length > 1 ? or(...conditions) : conditions[0];
        }

        // Define sorting column and direction
        let orderByClause;
        if (sortBy === 'date') {
          orderByClause = sortDirection === 'asc' ? asc(userRequestsTable.createdAt) : desc(userRequestsTable.createdAt);
        } else { // sortBy === 'amount'
          // Note: Amount is stored as string, direct sorting might be lexicographical.
          // For accurate numeric sorting, casting or fetching all and sorting in code might be needed if DB doesn't support casting well.
          // Drizzle doesn't have a built-in cast for orderBy, so we rely on DB's implicit casting or accept potential inaccuracy for now.
          // A better solution would be to store amount as a numeric type (e.g., decimal or bigint).
          orderByClause = sortDirection === 'asc' ? asc(userRequestsTable.amount) : desc(userRequestsTable.amount);
        }

        // Use db.select directly with orderBy
        const requests = await db
          .select()
          .from(userRequestsTable)
          .where(queryConditions)
          .orderBy(orderByClause)
          .limit(limit);

        // Map results (adjust if schema changes are needed)
        // Assuming the existing mapping logic is sufficient
        const mappedRequests = requests.map(req => {
          const decimals = req.currencyDecimals ?? getCachedCurrencyConfig(req.currency || '', 'mainnet')?.decimals ?? 2; // Fallback decimals
          const formattedAmount = req.amount !== null && req.amount !== undefined
            ? formatUnits(req.amount, decimals)
            : '0.00';

          // --- Logging Added ---
          // console.log(`0xHypr DEBUG - Mapping invoice ${req.id}. Original amount: ${req.amount}, Decimals: ${decimals}, Formatted: ${formattedAmount}`);
          // --- End Logging ---

          // Determine invoice direction based on who created it
          // INCOMING: someone else created it
          // OUTGOING: I created it
          const direction: 'sent' | 'received' = req.userId === userId ? 'sent' : 'received';

          return {
            ...req,
            // Format bigint amount back to string for frontend
            amount: formattedAmount,
            creationDate: req.createdAt?.toISOString(), // Ensure date is stringified
            direction, // Add direction indicator
            // Add other transformations if needed
          };
        });

        // --- Logging Added ---
        console.log('0xHypr DEBUG - Returning invoices from list endpoint. Sample formatted amounts:', mappedRequests.slice(0, 5).map(r => r.amount));
        // --- End Logging ---

        // Simple pagination logic (if needed, implement fully in service)
        // const limitedRequests = requests.slice(0, limit); // Limit is now handled by the DB query

        // Placeholder cursor logic - needs proper implementation if pagination required
        let nextCursor: string | undefined = undefined;
        // if (requests.length > limit) { // This logic needs adjustment if using DB limit
        //   nextCursor = mappedRequests[mappedRequests.length - 1]?.id;
        // }

        return {
          items: mappedRequests,
          nextCursor: nextCursor, // Or null if not implementing pagination
        };
      } catch (error) {
        console.error('Failed to fetch invoices:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch invoices',
        });
      }
    }),

  // Create invoice endpoint (Database only + background commit)
  create: protectedProcedure
    .input(invoiceDataSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;
      const userEmail = ctx.user.email?.address;
      const invoiceData = input;

      if (!userEmail) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'User email is required.' });
      }

      let dbInvoiceId: string | null = null;

      try {
        const startTime = performance.now();
        console.log('0xHypr Starting invoice creation (DB only) for user:', userId);

        // Parallelize user profile operations
        const [userProfile] = await Promise.all([
          userProfileService.getOrCreateProfile(userId, userEmail),
          // Pre-fetch wallet for future use (optional optimization)
          userProfileService.getOrCreateWallet(userId).catch(err => {
            console.warn('0xHypr Failed to pre-fetch wallet (non-critical):', err);
            return null;
          })
        ]);
        // Determine role based on which company the user is acting on behalf of
        // If companyId is provided and matches the sender, user is acting as seller
        // Otherwise, user is acting as buyer (receiving the invoice)
        const isSeller = invoiceData.companyId ? true : false; // If user selected a company to send from, they're the seller
        const role: InvoiceRole = isSeller ? 'seller' : 'buyer';

        const clientName = isSeller
          ? invoiceData.buyerInfo?.businessName || invoiceData.buyerInfo?.email || 'Unknown Client'
          : invoiceData.sellerInfo?.businessName || invoiceData.sellerInfo.email || 'Unknown Seller';

        const description =
          invoiceData.invoiceItems?.[0]?.name ||
          invoiceData.invoiceNumber ||
          'Invoice';

        const paymentType = invoiceData.paymentType || 'crypto';
        let rnNetwork: 'base' | 'xdai' | 'mainnet';
        if (paymentType === 'fiat') {
             rnNetwork = 'mainnet';
        } else {
             rnNetwork = (invoiceData.network === 'base' || invoiceData.network === 'xdai' || invoiceData.network === 'mainnet')
                         ? invoiceData.network
                         : 'base';
        }
        const selectedConfig = getCachedCurrencyConfig(invoiceData.currency, rnNetwork);
        if (!selectedConfig) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: `Unsupported currency/network combination` });
        }
        const decimals = selectedConfig.decimals;

        // Optimize Decimal calculations by pre-creating common instances
        const ZERO = new Decimal(0);
        const HUNDRED = new Decimal(100);
        let totalAmountDecimal = ZERO;
        
        for (const item of invoiceData.invoiceItems) {
          const itemPrice = new Decimal(item.unitPrice || '0');
          const quantity = item.quantity || 0;
          const taxPercent = new Decimal(item.tax.amount || '0');
          
          // Calculate item total and tax more efficiently
          const itemTotal = itemPrice.mul(quantity);
          const taxAmount = itemTotal.mul(taxPercent).div(HUNDRED);
          totalAmountDecimal = totalAmountDecimal.plus(itemTotal.plus(taxAmount));
        }
        const totalAmountBigInt = parseUnits(totalAmountDecimal.toFixed(decimals), decimals);

        const requestDataForDb: NewUserRequest = {
          id: crypto.randomUUID(),
          userId: userId,
          companyId: invoiceData.companyId || null, // The company the user is acting on behalf of
          senderCompanyId: invoiceData.companyId || null, // Company sending the invoice (if user selected one)
          recipientCompanyId: invoiceData.recipientCompanyId || null, // Company receiving the invoice
          role: role,
          description: description,
          amount: totalAmountBigInt,
          currency: invoiceData.currency,
          currencyDecimals: decimals,
          status: 'db_pending', // Start as db_pending
          client: clientName,
          invoiceData: invoiceData,
        };

        const dbStartTime = performance.now();
        const newDbRecord = await userRequestService.addRequest(requestDataForDb);
        const dbEndTime = performance.now();
        
        if (!newDbRecord || typeof newDbRecord.id !== 'string') {
          throw new Error('Database service did not return a valid ID');
        }
        dbInvoiceId = newDbRecord.id;
        console.log(`0xHypr Successfully saved invoice to database (${(dbEndTime - dbStartTime).toFixed(2)}ms):`, dbInvoiceId);

        // --- Start Background Commit Task ---
        // Update status to 'pending' immediately AFTER db save
        const statusUpdateStartTime = performance.now();
        await userRequestService.updateRequest(dbInvoiceId, { status: 'pending' });
        const statusUpdateEndTime = performance.now();
        
        console.log(`0xHypr Status update completed (${(statusUpdateEndTime - statusUpdateStartTime).toFixed(2)}ms)`);

        // Use arrow function for background task wrapper
        // const commitInvoiceInBackground = async (id: string, uid: string) => {
        //   console.log(`0xHypr Background task started for invoice: ${id}`);
        //   try {
        //     // Call the refactored internal function
        //     const result = await _internalCommitToRequestNetwork(id, uid);
        //     console.log(`0xHypr Background commit success for invoice ${id}:`, result);
        //     // Status updates (pending/failed) are handled within _internalCommitToRequestNetwork
        //   } catch (commitError: any) {
        //     // Error logging and status update to 'failed' is handled within _internalCommitToRequestNetwork
        //     console.error(`0xHypr Background commit failed for invoice ${id} (handled internally). Error: ${commitError.message}`);
        //   }
        // };

        // // Fire and forget (don't await)
        // // Pass userId to the background task
        // commitInvoiceInBackground(dbInvoiceId, userId).catch((err) => {
        //   console.error("0xHypr Unhandled error in background commit task wrapper:", err);
        // });
        // // --- End Background Commit Task ---

        const endTime = performance.now();
        console.log(`0xHypr Invoice creation completed in ${(endTime - startTime).toFixed(2)}ms`);

        return {
          success: true,
          invoiceId: dbInvoiceId,
          requestId: null, // Request ID is not available yet
        };

      } catch (error) {
        console.error('Error during invoice creation process:', error);
        // If DB save failed, dbInvoiceId might be null. If background start failed, status might be stuck
        if (dbInvoiceId && !(error instanceof TRPCError && error.code === 'FORBIDDEN')) { // Avoid setting to failed if it was an auth issue before save
            try {
                await userRequestService.updateRequest(dbInvoiceId, { status: 'failed' });
            } catch (updateErr) { console.error('Failed to mark invoice as failed after creation error'); }
        }
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create invoice.', cause: error });
      }
    }),

  // Endpoint to commit an existing invoice to Request Network
  // This is kept for potential manual retries or other scenarios, but now calls the internal func
  commitToRequestNetwork: protectedProcedure
    .input(z.object({ invoiceId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      // Call the refactored internal function, passing userId from context
      return await _internalCommitToRequestNetwork(input.invoiceId, ctx.user.id);
    }),

  // Get invoice details (adjusted to fetch by primary key)
  getById: publicProcedure // Keep public for shareable links
    .input(z.object({ 
        id: z.string(), // Fetch by primary key (UUID string)
    })) 
    .query(async ({ input, ctx }) => {
        // Context should now contain userId if available
        // const currentCtx = ctx as { user?: { id: string } }; // No longer need complex casting
        try {
            const request = await userRequestService.getRequestByPrimaryKey(input.id);
            if (!request) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Invoice not found.' });
            }

            // Format amount before returning
            const decimals = request.currencyDecimals ?? getCachedCurrencyConfig(request.currency || '', 'mainnet')?.decimals ?? 2; // Fallback decimals
            const formattedAmount = request.amount !== null && request.amount !== undefined
              ? formatUnits(request.amount, decimals)
              : '0.00';

            // Simplified Authorization: Allow public access by ID for now
            // If stricter rules needed later, check ctx.userId against request.userId
            console.log(`Public access granted for invoice ${input.id}`);
            return { ...request, amount: formattedAmount };

        } catch (error) {
             console.error(`Failed to fetch invoice by ID ${input.id}:`, error);
             if (error instanceof TRPCError) throw error;
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch invoice.'});
        }
    }),

  // NEW Public endpoint to get by ID and share token (no auth needed)
  getByPublicIdAndToken: publicProcedure
    .input(z.object({ id: z.string() })) // Removed token from input
    .query(async ({ input }) => {
      // This now essentially duplicates getById.
      // We can deprecate/remove this or keep it for semantic clarity.
      // For now, just call the same logic as getById.
       try {
        const request = await userRequestService.getRequestByPrimaryKey(input.id);
        if (!request) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Invoice not found.' });
        }
        console.log(`Public access successful for invoice ${input.id} (via getByPublicIdAndToken)`);

        // Format amount before returning
        const decimals = request.currencyDecimals ?? getCachedCurrencyConfig(request.currency || '', 'mainnet')?.decimals ?? 2; // Fallback decimals
        const formattedAmount = request.amount !== null && request.amount !== undefined
          ? formatUnits(request.amount, decimals)
          : '0.00';

        return { ...request, amount: formattedAmount };
      } catch (error) {
         if (error instanceof TRPCError) throw error;
         console.error(`Error fetching public invoice ${input.id}:`, error);
         throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to retrieve invoice.' });
      }
    }),

  // Update invoice status endpoint


  /**
   * AI-powered helper: convert free-form invoice text into structured data that
   * largely matches `invoiceDataSchema`.  We keep the schema loose on the AI
   * side (users don't always give every field) and let the client decide what
   * to use.  The main goal is to extract at least:
   *   – seller / buyer names & emails
   *   – an item list (name, quantity, unitPrice)
   *   – currency, payment terms, due-date etc.
   */
  prefillFromRaw: protectedProcedure
    .input(z.object({ rawText: z.string().min(10) }))
    .mutation(async ({ input }) => {
      try {
        const { rawText } = input;
        console.log('[AI Prefill] Starting invoice extraction from raw text:', rawText.substring(0, 100) + '...');
        
        // Lazily import to avoid bundling openai in edge runtimes if unused.
        const { myProvider } = await import('@/lib/ai/providers');
        const { generateObject } = await import('ai');

        // Create a more comprehensive schema that matches the invoice store expectations
        // IMPORTANT: For AI SDK with o3-2025-04-16, all fields must be required with nullable() instead of optional()
        const aiInvoiceSchema = z.object({
          // Seller info (the company sending the invoice)
          sellerInfo: z.object({
            businessName: z.string().nullable(),
            email: z.string().nullable(), // Relaxed email validation for extraction
            address: z.string().nullable(), // Full street address
            city: z.string().nullable(),
            postalCode: z.string().nullable(),
            country: z.string().nullable(),
            phone: z.string().nullable(),
            taxId: z.string().nullable(),
          }).nullable(),
          
          // Buyer info (the company receiving/paying the invoice)
          buyerInfo: z.object({
            businessName: z.string().nullable(),
            email: z.string().nullable(), // Relaxed email validation
            address: z.string().nullable(), // Full street address
            city: z.string().nullable(),
            postalCode: z.string().nullable(),
            country: z.string().nullable(),
            contactName: z.string().nullable(),
            phone: z.string().nullable(),
            taxId: z.string().nullable(),
          }).nullable(),
          
          // Invoice details
          invoiceNumber: z.string().nullable(),
          issuedAt: z.string().nullable(), // ISO date
          dueDate: z.string().nullable(), // ISO date
          
          // Items - comprehensive extraction
          invoiceItems: z.array(z.object({
            name: z.string(), // Service/product name
            description: z.string().nullable(), // Full description
            quantity: z.number(),
            unitPrice: z.string(), // As string to preserve precision
            tax: z.number().nullable(), // Tax percentage
            total: z.string().nullable(), // Line total if available
          })).nullable(),
          
          // Financial summary
          currency: z.string(),
          subtotal: z.string().nullable(),
          taxAmount: z.string().nullable(),
          totalAmount: z.string().nullable(),
          amount: z.number().nullable(), // Legacy field for total
          paymentType: z.enum(['crypto', 'fiat']).nullable(),
          
          // Additional
          note: z.string().nullable(),
          terms: z.string().nullable(),
          paymentInstructions: z.string().nullable(),
          
          // Bank details for fiat payments (comprehensive)
          bankDetails: z.object({
            accountHolder: z.string().nullable(),
            accountNumber: z.string().nullable(),
            routingNumber: z.string().nullable(),
            iban: z.string().nullable(),
            bic: z.string().nullable(),
            swiftCode: z.string().nullable(),
            bankName: z.string().nullable(),
            bankAddress: z.string().nullable(),
          }).nullable(),
        });

        // Craft a more detailed system prompt
        const systemPrompt = `You are an expert invoice data extraction AI. Extract ALL available structured invoice information from unstructured text. Be thorough and comprehensive.

EXTRACTION RULES:
1. **SELLER vs BUYER identification**:
   - SELLER = The service provider/contractor who is billing (sends the invoice)
   - BUYER = The client/company who needs to pay (receives the invoice)
   - Look for labels like "From:", "Bill To:", "Seller:", "Vendor:", "Provider:"
   - Bank details and payment instructions usually belong to the SELLER
   
2. **Complete Data Extraction**:
   - Extract EVERY piece of information available
   - Parse ALL line items with their quantities, prices, and descriptions
   - Extract complete addresses including street, city, postal codes, countries
   - Extract ALL contact information (emails, phones, tax IDs)
   - Extract ALL payment details (bank names, account numbers, routing numbers, IBAN, BIC, SWIFT)
   
3. **Financial Data**:
   - Extract numeric values without currency symbols (e.g., "220.00" not "€220.00")
   - For line items: Extract exact quantities and unit prices
   - Calculate totals if not explicitly stated
   - Extract tax rates and amounts
   
4. **Date Handling**:
   - Convert to ISO format (YYYY-MM-DD)
   - For relative dates like "Net 30", calculate from issue date
   - Extract both issue date and due date
   
5. **Address Parsing**:
   - Split full addresses into components: street, city, postal code, country
   - Handle formats like "850 Mission St, 5th Floor, San Francisco, CA 94103"
   
6. **Payment Information**:
   - Extract complete bank details including bank names
   - Look for account holder names
   - Extract routing numbers, account numbers, IBAN, BIC, SWIFT codes
   - Detect payment type: "fiat" for EUR/USD/GBP, "crypto" for USDC/ETH
   
7. **Line Items**:
   - Extract ALL services/products listed
   - Parse descriptions, quantities, unit prices, taxes
   - Handle various formats and layouts

EXAMPLES OF WHAT TO EXTRACT:
- Company names: "Orion Web Infrastructure Ltd." 
- Addresses: Street "850 Mission St, 5th Floor", City "San Francisco", Postal "94103", Country "CA"
- Bank details: Bank "First Horizon Bank", Routing "121000358", Account "0987654321"
- Line items: "Dedicated VPS (8 cores, 32 GB RAM)" qty=1, price="220.00"

IMPORTANT:
- Be extremely thorough - extract every piece of data visible
- Business names exactly as written
- All monetary values as strings without symbols  
- Addresses split into components when possible
- Default currency to "USD" if not specified, but look for € € symbols for EUR

Current date for reference: ${new Date().toISOString().split('T')[0]}`;

        const chatModel = myProvider('gpt-4.1'); // Use gpt-4.1 as specified in CLAUDE.md for extraction

        console.log('[AI Prefill] Calling AI model for extraction...');
        
        let aiObject: any;
        try {
          // Try with the comprehensive schema
          const result = await generateObject({
            model: chatModel,
            schema: aiInvoiceSchema,
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              {
                role: 'user',
                content: `Please extract ALL available invoice information from the following text. Be extremely thorough and extract every piece of data you can find including:

1. Complete seller/vendor information (name, address, email, phone, tax ID)
2. Complete buyer/client information (name, address, email, contact person)  
3. All invoice details (number, dates, terms)
4. Every line item with exact descriptions, quantities, and prices
5. All financial totals (subtotal, tax, total)
6. Complete payment/banking information (bank name, account details, routing numbers)
7. Any additional notes or payment instructions

INVOICE TEXT TO EXTRACT FROM:
${rawText}

Extract everything comprehensively - leave no data behind!`
              }
            ],
          });
          
          aiObject = result.object;
          console.log('[AI Prefill] Successfully extracted data:', JSON.stringify(aiObject, null, 2));
          
        } catch (validationErr: any) {
          console.error('[AI Prefill] Validation error:', validationErr);
          
          // Fallback: try to extract basic info with a simpler approach
          try {
            const simpleSchema = z.object({
              sellerInfo: z.object({
                businessName: z.string().nullable(),
                email: z.string().nullable(),
              }).nullable(),
              buyerInfo: z.object({
                businessName: z.string().nullable(),
                email: z.string().nullable(),
              }).nullable(),
              amount: z.number().nullable(),
              currency: z.string().nullable(),
              dueDate: z.string().nullable(),
              note: z.string().nullable(),
            });
            
            const fallbackResult = await generateObject({
              model: myProvider('gpt-4.1'), // Use gpt-4.1 for fallback too
              schema: simpleSchema,
              messages: [
                {
                  role: 'system',
                  content: 'Extract basic invoice information: seller name/email, buyer name/email, amount, currency, due date.'
                },
                {
                  role: 'user',
                  content: rawText
                }
              ],
            });
            
            aiObject = fallbackResult.object;
            console.warn('[AI Prefill] Using fallback extraction:', aiObject);
            
          } catch (fallbackErr) {
            console.error('[AI Prefill] Fallback also failed:', fallbackErr);
            throw validationErr;
          }
        }

        // Log what we're returning
        console.log('[AI Prefill] Final extracted data being returned:', {
          hasSellerInfo: !!aiObject.sellerInfo,
          hasBuyerInfo: !!aiObject.buyerInfo,
          itemCount: aiObject.invoiceItems?.length || 0,
          amount: aiObject.amount,
          currency: aiObject.currency,
        });

        return aiObject;
        
      } catch (error) {
        console.error('[AI Prefill] Error in prefillFromRaw:', error);
        throw new TRPCError({ 
          code: 'INTERNAL_SERVER_ERROR', 
          message: 'Failed to prefill invoice from raw text.', 
          cause: error 
        });
      }
    }),



});
