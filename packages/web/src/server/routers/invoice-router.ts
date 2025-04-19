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
    invoiceStatuses, // Assuming the exported enum value is named 'invoiceStatuses'
    type InvoiceRole,
    type InvoiceStatus,
    userRequestsTable 
} from '@/db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';
import { getCurrencyConfig, CurrencyConfig } from '@/lib/currencies';
import { RequestNetwork, Types, Utils } from '@requestnetwork/request-client.js';
import { Wallet, ethers } from 'ethers';
import Decimal from 'decimal.js';

// Define types that explicitly include the 'type' property
// Ensure these match the structure expected by CurrencyTypes.CurrencyDefinition implicitly

// USDC on Base mainnet configuration
const USDC_BASE_CONFIG = {
  type: RequestLogicTypes.CURRENCY.ERC20,
  value: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base USDC
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
    iban: z.string().optional(),
    bic: z.string().optional(),
    bankName: z.string().optional(),
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
  currency: z.string(),
  bankDetails: bankDetailsSchema,
  // primarySafeAddress: z.string().optional(), // Removed - will fetch from DB
});

export const invoiceRouter = router({
  // Example endpoint to list invoices
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(), // Assuming cursor is the 'id' (UUID string) of the last item
        // Add sorting parameters
        sortBy: z.enum(['date', 'amount']).optional().default('date'),
        sortDirection: z.enum(['asc', 'desc']).optional().default('desc'),
      }),
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 50;
      const { sortBy, sortDirection } = input;
      // const cursor = input.cursor; // Cursor logic removed for now
      const userId = ctx.user.id;

      try {
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
          .where(eq(userRequestsTable.userId, userId))
          .orderBy(orderByClause)
          .limit(limit);

        // Map results (adjust if schema changes are needed)
        // Assuming the existing mapping logic is sufficient
        const mappedRequests = requests.map(req => {
          const decimals = req.currencyDecimals ?? getCurrencyConfig(req.currency || '', 'mainnet')?.decimals ?? 2; // Fallback decimals
          const formattedAmount = req.amount !== null && req.amount !== undefined
            ? formatUnits(req.amount, decimals)
            : '0.00';

          // --- Logging Added ---
          // console.log(`0xHypr DEBUG - Mapping invoice ${req.id}. Original amount: ${req.amount}, Decimals: ${decimals}, Formatted: ${formattedAmount}`);
          // --- End Logging ---

          return {
            ...req,
            // Format bigint amount back to string for frontend
            amount: formattedAmount,
            creationDate: req.createdAt?.toISOString(), // Ensure date is stringified
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

  // Create invoice endpoint (Database only)
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
        console.log('0xHypr Starting invoice creation (DB only) for user:', userId);

        const userProfile = await userProfileService.getOrCreateProfile(userId, userEmail);
        const isSeller = invoiceData.sellerInfo.email === userProfile.email;
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
        const selectedConfig = getCurrencyConfig(invoiceData.currency, rnNetwork);
        if (!selectedConfig) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: `Unsupported currency/network combination` });
        }
        const decimals = selectedConfig.decimals;

        // Calculate total amount precisely using Decimal.js
        let totalAmountDecimal = new Decimal(0);
        for (const item of invoiceData.invoiceItems) {
          const itemPrice = new Decimal(item.unitPrice || '0'); // Assume unitPrice is standard unit string
          const quantity = new Decimal(item.quantity || 0);
          const taxPercent = new Decimal(item.tax.amount || '0');

          const itemTotal = itemPrice.times(quantity);
          const taxAmount = itemTotal.times(taxPercent).dividedBy(100);
          totalAmountDecimal = totalAmountDecimal.plus(itemTotal).plus(taxAmount);
        }

        // Convert the precise Decimal total to the smallest unit (bigint)
        const totalAmountBigInt = parseUnits(totalAmountDecimal.toFixed(decimals), decimals);

        const requestDataForDb: NewUserRequest = {
          id: crypto.randomUUID(),
          userId: userId,
          role: role,
          description: description,
          amount: totalAmountBigInt, // Store as bigint
          currency: invoiceData.currency,
          currencyDecimals: decimals, // Store decimals
          status: 'db_pending',
          client: clientName,
          invoiceData: invoiceData, // Store original invoice data structure
        };

        // --- Logging Added ---
        console.log(`0xHypr DEBUG - Saving invoice to DB. Calculated amount (smallest unit): ${totalAmountBigInt}, Decimals: ${decimals}`);
        // --- End Logging ---

        const newDbRecord = await userRequestService.addRequest(requestDataForDb);
        if (!newDbRecord || typeof newDbRecord.id !== 'string') {
          throw new Error('Database service did not return a valid ID');
        }
        dbInvoiceId = newDbRecord.id;
        console.log('0xHypr Successfully saved invoice to database:', dbInvoiceId);

        return {
          success: true,
          invoiceId: dbInvoiceId,
          requestId: null,
        };

      } catch (error) {
        console.error('Error during invoice creation process:', error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create invoice.', cause: error });
      }
    }),

  // New endpoint to commit an existing invoice to Request Network
  commitToRequestNetwork: protectedProcedure
    .input(z.object({ invoiceId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;
      const { invoiceId } = input;

      try {
        console.log(`0xHypr Starting RN commit for invoice: ${invoiceId}`);

        const invoice = await userRequestService.getRequestByPrimaryKey(invoiceId);
        if (!invoice) throw new TRPCError({ code: 'NOT_FOUND' });
        if (invoice.userId !== userId) throw new TRPCError({ code: 'FORBIDDEN' });
        if (invoice.requestId) {
          return { success: true, invoiceId: invoice.id, requestId: invoice.requestId, alreadyCommitted: true };
        }

        const invoiceData = invoice.invoiceData as z.infer<typeof invoiceDataSchema>;
        if (!invoiceData) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invoice data missing.' });

        const userWallet = await userProfileService.getOrCreateWallet(userId);
        if (!userWallet?.privateKey) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'User signing wallet missing.' });

        // We need the user's email to potentially create the profile if it doesn't exist
        const userEmail = ctx.user.email?.address;
        if (!userEmail) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'User email is required to fetch profile.' });
        }
        const userProfile = await userProfileService.getOrCreateProfile(userId, userEmail);
        if (!userProfile?.primarySafeAddress) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'User profile or primary Safe address not found. Please complete onboarding.' });
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
        const selectedConfig = getCurrencyConfig(invoiceData.currency, rnNetwork);
        if (!selectedConfig) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: `Unsupported currency/network combination` });
        }
        // Ensure DB decimals match config decimals (sanity check)
        if (decimals !== selectedConfig.decimals) {
            console.warn(`0xHypr WARN - Mismatch between stored decimals (${decimals}) and config decimals (${selectedConfig.decimals}) for currency ${invoiceData.currency}. Using stored decimals.`);
            // Potentially throw an error or handle discrepancy based on policy
        }

        // expectedAmount is the bigint amount from the DB, converted to string
        const expectedAmount = amountBigInt.toString();

        let paymentNetworkParams: any;
        let paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID;
        if (paymentType === 'fiat') {
          paymentNetworkId = ExtensionTypes.PAYMENT_NETWORK_ID.ANY_DECLARATIVE;
          if (!invoiceData.bankDetails) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Bank details required for fiat invoices.' });
          }
          // Format amount back to standard unit for payment instruction string
          const formattedAmountForInstruction = formatUnits(amountBigInt, decimals);
          paymentNetworkParams = {
            paymentInstruction: `Pay ${invoiceData.currency} ${formattedAmountForInstruction} via Bank Transfer.
Account Holder: ${invoiceData.bankDetails?.accountHolder}
IBAN: ${invoiceData.bankDetails?.iban}
BIC: ${invoiceData.bankDetails?.bic}
Bank: ${invoiceData.bankDetails?.bankName || 'N/A'}
Reference: ${invoiceData.invoiceNumber}`,
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
        }

        // If it's a crypto payment, ensure the paymentAddress in paymentNetwork.parameters is the payee address
        // (In this case, the user's primary Safe address)
        if (paymentType === 'crypto') {
            paymentNetworkParams.paymentAddress = payeeAddress;
            // paymentNetworkParams.network is already set correctly above
        }

        const currencyValue = selectedConfig.type === RequestLogicTypes.CURRENCY.ERC20 ? selectedConfig.value : selectedConfig.value.toUpperCase();
        const rnCurrencyType = selectedConfig.type as RequestLogicTypes.CURRENCY;

        function cleanInvoiceDataForRequestNetwork(data: any, decimals: number): any {
          return {
            meta: data.meta, creationDate: data.creationDate, invoiceNumber: data.invoiceNumber,
            sellerInfo: data.sellerInfo, buyerInfo: data.buyerInfo,
            invoiceItems: data.invoiceItems.map((item: any) => {
              // Convert unitPrice to smallest unit string
              const unitPriceDecimal = new Decimal(item.unitPrice || '0');
              const unitPriceSmallestUnit = parseUnits(unitPriceDecimal.toFixed(decimals), decimals);
              return {
                name: item.name,
                quantity: item.quantity,
                unitPrice: unitPriceSmallestUnit.toString(), // Ensure it's a string
                tax: item.tax,
                currency: data.currency, // Currency here might be redundant as it's defined at the request level
              };
            }),
            paymentTerms: data.paymentTerms, note: data.note, terms: data.terms,
            ...(data.bankDetails && { bankDetails: data.bankDetails }),
          };
        }

        const requestDataForRN = {
          currency: { type: rnCurrencyType, value: currencyValue, network: rnNetwork, decimals: decimals },
          expectedAmount: expectedAmount, // Use the stringified bigint from DB
          payee: { type: IdentityTypes.TYPE.ETHEREUM_ADDRESS, value: payeeAddress }, // Payee is now passed directly to createInvoiceRequest
          // Payer is omitted to allow anyone to pay
          timestamp: Utils.getCurrentTimestampInSecond(),
          contentData: cleanInvoiceDataForRequestNetwork(invoiceData, decimals), // Pass decimals here
          paymentNetwork: { id: paymentNetworkId, parameters: paymentNetworkParams },
        };

        console.log("0xHypr Calling createInvoiceRequest (simplified)...", requestDataForRN);
        const rnResult = await createInvoiceRequest(
          requestDataForRN as any,
          payeeAddress, // Pass the user's primary Safe address as the payee
          userWallet
        );

        if (!rnResult?.requestId) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed Request Network result.' });
        }

        console.log(`0xHypr RN commit successful: RequestID=${rnResult.requestId}`);

        await userRequestService.updateRequest(invoiceId, {
          requestId: rnResult.requestId,
          status: 'pending',
          walletAddress: userWallet.address,
        });

        return {
          success: true,
          invoiceId: invoice.id,
          requestId: rnResult.requestId,
          alreadyCommitted: false
        };

      } catch (error) {
        console.error(`Error committing invoice ${invoiceId} to RN:`, error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to commit invoice.', cause: error });
      }
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
            const decimals = request.currencyDecimals ?? getCurrencyConfig(request.currency || '', 'mainnet')?.decimals ?? 2; // Fallback decimals
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
        const decimals = request.currencyDecimals ?? getCurrencyConfig(request.currency || '', 'mainnet')?.decimals ?? 2; // Fallback decimals
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
  updateStatus: protectedProcedure
    .input(z.object({ 
      id: z.string().min(1), 
      status: z.enum(invoiceStatuses) // Use z.enum with the actual enum values array
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;
      const invoiceId = input.id; 
      const newStatus = input.status;

      try {
        console.log(`0xHypr Attempting status update for invoice: ${invoiceId} to ${newStatus} by user: ${userId}`);

        // Fetch the existing invoice to ensure it belongs to the user before updating
        const existingInvoice = await userRequestService.getRequestByPrimaryKey(invoiceId);
        if (!existingInvoice) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Invoice not found.' });
        }
        if (existingInvoice.userId !== userId) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not have permission to update this invoice.' });
        }

        // Perform the update using validated input types
        const updated = await db
          .update(userRequestsTable)
          .set({ 
            status: newStatus, 
            updatedAt: new Date() 
          })
          .where(and(
            eq(userRequestsTable.id, invoiceId), 
            eq(userRequestsTable.userId, userId) 
          ))
          .returning(); 

        if (!updated || updated.length === 0) {
            console.error(`Failed to update status for invoice ${invoiceId}. Update operation returned no rows.`);
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update invoice status. Invoice might not exist or access denied.' });
        }

        console.log(`0xHypr Successfully updated status for invoice ${invoiceId} to ${newStatus}`);
        
        const updatedInvoice = updated[0];
        const currency = updatedInvoice.currency ?? undefined; 
        const decimals = updatedInvoice.currencyDecimals ?? getCurrencyConfig(currency, 'mainnet')?.decimals ?? 2;
        
        const amountBigInt: bigint | null = typeof updatedInvoice.amount === 'bigint' ? updatedInvoice.amount : null;
        const formattedAmount = amountBigInt !== null
            ? formatUnits(amountBigInt, decimals)
            : '0.00';

        return { ...updatedInvoice, amount: formattedAmount };

      } catch (error) {
        console.error(`Error updating status for invoice ${invoiceId} to ${newStatus}:`, error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update invoice status.', cause: error });
      }
    }),

});

// Helper type for client-side use
export type InvoiceRouter = typeof invoiceRouter;
