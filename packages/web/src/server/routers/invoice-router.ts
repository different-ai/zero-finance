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
import { userProfilesTable, NewUserRequest, InvoiceStatus, InvoiceRole, userRequestsTable } from '@/db/schema';
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

// Helper function for background commitment
async function _commitToRequestNetworkInBackground(invoiceId: string, ctx: any) {
  console.log(`0xHypr DEBUG - Starting background commit for invoice ID: ${invoiceId}`);
  try {
    const userId = ctx.user.id;
    const userEmail = ctx.user.email?.address;

    if (!userEmail) {
      console.error('Background commit failed: User email missing for invoice', invoiceId);
      // Optionally update DB status to error here
      await db.update(userRequestsTable)
          .set({ status: InvoiceStatus.Error })
          .where(and(eq(userRequestsTable.id, invoiceId), eq(userRequestsTable.userId, userId)));
      return;
    }

    // Fetch the created invoice data from DB
    const invoiceRecord = await db
      .select()
      .from(userRequestsTable)
      .where(and(eq(userRequestsTable.id, invoiceId), eq(userRequestsTable.userId, userId)))
      .limit(1)
      .then(res => res[0]);

    if (!invoiceRecord) {
      console.error(`Background commit failed: Invoice record not found for ID: ${invoiceId}`);
      return; // Or update status to error
    }

    // Access paymentType from contentData as it's not a direct column in the initial select example
    const contentDataForCheck = invoiceRecord.contentData as any; 
    if (contentDataForCheck?.paymentType !== 'crypto') { 
        console.log(`0xHypr DEBUG - Skipping background commit for non-crypto invoice: ${invoiceId}`);
        return;
    }
    
    if (invoiceRecord.requestId) {
        console.log(`0xHypr DEBUG - Invoice ${invoiceId} already has a requestId (${invoiceRecord.requestId}). Skipping background commit.`);
        return;
    }


    // --- Begin original commit logic (adapted) ---
    const userProfile = await userProfileService.getOrCreateProfile(userId, userEmail);
    const wallet = await userProfileService.getOrCreateWallet(userId);
    const signerIdentity = {
      type: IdentityTypes.TYPE.ETHEREUM_ADDRESS,
      value: wallet.address,
    };

    // Assume invoiceData is stored in the `contentData` field of the invoiceRecord
    const invoiceData = invoiceRecord.contentData as any; // Keep cast
    if (!invoiceData) {
        console.error(`Background commit failed: contentData missing for invoice: ${invoiceId}`);
        await db.update(userRequestsTable)
            .set({ status: InvoiceStatus.Error })
            .where(and(eq(userRequestsTable.id, invoiceId), eq(userRequestsTable.userId, userId)));
        return;
    }
    
    const currencyConfig = getCurrencyConfig(invoiceData.currency, invoiceData.network);
    if (!currencyConfig) {
      console.error(`Background commit failed: Unsupported currency/network combination: ${invoiceData.currency} on ${invoiceData.network} for invoice ${invoiceId}`);
      await db.update(userRequestsTable)
          .set({ status: InvoiceStatus.Error })
          .where(and(eq(userRequestsTable.id, invoiceId), eq(userRequestsTable.userId, userId)));
      return;
    }

    const payeeIdentity = {
      type: IdentityTypes.TYPE.ETHEREUM_ADDRESS,
      value: wallet.address, // Payee is the user creating the invoice
    };

    // Payer can be omitted
    const payerIdentity = undefined;


    // Calculate total amount
    const totalAmount = invoiceData.invoiceItems.reduce((sum: Decimal, item: any) => {
        const itemPrice = new Decimal(item.unitPrice);
        const itemQuantity = new Decimal(item.quantity);
        const itemTotal = itemPrice.times(itemQuantity);
        // Assuming tax is percentage for now
        const taxRate = new Decimal(item.tax?.amount || '0').dividedBy(100);
        const itemTax = itemTotal.times(taxRate);
        return sum.plus(itemTotal).plus(itemTax);
      }, new Decimal(0));

    const expectedAmount = parseUnits(totalAmount.toFixed(currencyConfig.decimals), currencyConfig.decimals);


    const requestInfo = {
      currency: {
        type: currencyConfig.type,
        value: currencyConfig.value,
        network: currencyConfig.network,
      },
      expectedAmount: expectedAmount.toString(), // RN expects string
      payee: payeeIdentity,
      payer: payerIdentity, // Allow anyone to pay
      timestamp: Utils.getCurrentTimestampInSecond(),
    };

    // Determine Payment Network based on currency config
    let paymentNetwork: PaymentTypes.PaymentNetworkCreateParameters | undefined = undefined;

    if (currencyConfig.type === RequestLogicTypes.CURRENCY.ERC20) {
      paymentNetwork = {
        id: ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
        parameters: {
          paymentNetworkName: currencyConfig.network, // e.g., 'base'
          paymentAddress: wallet.address, // Receiving address
          feeAddress: ethers.constants.AddressZero, // No fee
          feeAmount: '0', // No fee
        },
      };
    } else if (currencyConfig.type === RequestLogicTypes.CURRENCY.ETH) {
       paymentNetwork = {
          id: ExtensionTypes.PAYMENT_NETWORK_ID.NATIVE_TOKEN,
          parameters: {
              paymentNetworkName: currencyConfig.network, // e.g., 'base'
              paymentAddress: wallet.address, // Receiving address
              feeAddress: ethers.constants.AddressZero, // No fee
              feeAmount: '0', // No fee
          },
      };
    } else {
        // Handle other types or throw error if unsupported for crypto payment
        console.error(`Background commit failed: Unsupported currency type for crypto payment: ${currencyConfig.type} for invoice ${invoiceId}`);
        await db.update(userRequestsTable)
            .set({ status: InvoiceStatus.Error })
            .where(and(eq(userRequestsTable.id, invoiceId), eq(userRequestsTable.userId, userId)));
        return;
    }


    // Use the library function
    const requestNetwork = new RequestNetwork({
        nodeConnectionConfig: {
            baseURL: 'https://xdai.gateway.request.network/', // Use xdai gateway
        },
         // Use ethers v5 provider
        signatureProvider: new ethers.providers.JsonRpcProvider(process.env.GNOSIS_RPC_URL || 'https://rpc.gnosischain.com'), // TODO: Improve provider handling maybe?
    });

    const ethersWallet = new Wallet(wallet.privateKey); // Ethers v5 Wallet

    console.log(`0xHypr DEBUG - Attempting to create RN request for invoice ${invoiceId} with signer ${wallet.address} on network ${currencyConfig.network}`);

    // Update DB status to Processing before creating request
    await db.update(userRequestsTable)
      .set({ status: InvoiceStatus.Processing })
      .where(and(eq(userRequestsTable.id, invoiceId), eq(userRequestsTable.userId, userId)));


    const request = await requestNetwork.createRequest({
      requestInfo,
      paymentNetwork,
      contentData: cleanInvoiceDataForRequestNetwork(invoiceData, currencyConfig.decimals),
      signer: signerIdentity,
      topics: [userId, invoiceId], // Add user/invoice IDs as topics
    }, ethersWallet); // Pass ethers v5 Wallet


    console.log(`0xHypr DEBUG - RN request created for invoice ${invoiceId}, awaiting confirmation... Request ID: ${request.requestId}`);
    
    // Await confirmation (might take time)
    const confirmedRequest = await request.waitForConfirmation();
    const requestId = confirmedRequest.requestId;

    console.log(`0xHypr DEBUG - RN request confirmed for invoice ${invoiceId}. Request ID: ${requestId}`);

    // Update the invoice record in the database with the requestId and status
    await db.update(userRequestsTable)
      .set({
        requestId: requestId,
        status: InvoiceStatus.Committed, // Update status to Committed
        network: currencyConfig.network // Store the network used for commitment
      })
      .where(and(eq(userRequestsTable.id, invoiceId), eq(userRequestsTable.userId, userId)));

    console.log(`0xHypr DEBUG - Successfully committed invoice ${invoiceId} to Request Network and updated DB.`);

    // --- End original commit logic ---

  } catch (error: any) {
    console.error(`Background commit failed catastrophically for invoice ${invoiceId}:`, error);
    // Update DB status to Error
     try {
        await db.update(userRequestsTable)
          .set({ status: InvoiceStatus.Error })
          .where(eq(userRequestsTable.id, invoiceId)); // Update regardless of user ID in case of weird errors
      } catch (dbError) {
        console.error(`Failed to update invoice ${invoiceId} status to Error after commit failure:`, dbError);
      }
  }
}

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

  // Create invoice endpoint
  create: protectedProcedure
    .input(invoiceDataSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;
      const userEmail = ctx.user.email?.address;
      const invoiceData = input;

      if (!userEmail) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'User email is required.' });
      }

      let dbInvoiceId: string | null = null; // Initialize here

      try {
        console.log('0xHypr Starting invoice creation for user:', userId);

        const userProfile = await userProfileService.getOrCreateProfile(userId, userEmail);
        const isSeller = invoiceData.sellerInfo.email === userProfile.email;
        const role: InvoiceRole = isSeller ? 'seller' : 'buyer';

        const clientName = isSeller
          ? invoiceData.buyerInfo?.businessName || invoiceData.buyerInfo?.email || 'Unknown Client'
          : invoiceData.sellerInfo?.businessName || invoiceData.sellerInfo.email || 'Unknown Seller';

        const description =
          invoiceData.invoiceItems?.[0]?.name ||
          invoiceData.invoiceNumber ||
          `Invoice to ${clientName}`;

        const currencyConfig = getCurrencyConfig(invoiceData.currency, invoiceData.network);
        if (!currencyConfig) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Unsupported currency/network: ${invoiceData.currency}/${invoiceData.network}`,
          });
        }

        // --- Calculate total amount using Decimal.js ---
        const totalAmountDecimal = invoiceData.invoiceItems.reduce((sum, item) => {
          try {
            const itemPrice = new Decimal(item.unitPrice);
            const itemQuantity = new Decimal(item.quantity);
            const itemTotal = itemPrice.times(itemQuantity);

            // Handle tax - assuming percentage for now
            let itemTax = new Decimal(0);
            if (item.tax && item.tax.type === 'percentage' && item.tax.amount) {
              const taxRate = new Decimal(item.tax.amount).dividedBy(100);
              itemTax = itemTotal.times(taxRate);
            }
            // Add other tax types if needed

            return sum.plus(itemTotal).plus(itemTax);
          } catch (e) {
            console.error("Error calculating item amount:", item, e);
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid item amount or quantity.' });
          }
        }, new Decimal(0));
        // --- End amount calculation ---


        // Convert total amount to BigInt string in smallest unit
        const totalAmountSmallestUnit = parseUnits(
          totalAmountDecimal.toFixed(currencyConfig.decimals),
          currencyConfig.decimals
        );


        // Prepare data for DB insertion
        const newRequest: NewUserRequest = {
          userId: userId,
          role: role,
          clientName: clientName,
          description: description,
          amount: totalAmountSmallestUnit.toString(), // Store as string
          currency: invoiceData.currency,
          currencyDecimals: currencyConfig.decimals, // Store decimals
          status: InvoiceStatus.Draft, // Initial status
          paymentType: invoiceData.paymentType,
          contentData: invoiceData as any, // Store full invoice data as JSON
          invoiceNumber: invoiceData.invoiceNumber,
          // requestId will be added by the background job if applicable
        };

        // Insert into DB
        const inserted = await db.insert(userRequestsTable).values(newRequest).returning({ id: userRequestsTable.id });
        
        if (!inserted || inserted.length === 0 || !inserted[0].id) {
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to save invoice to database.' });
        }
        
        dbInvoiceId = inserted[0].id; // Assign the ID here
        console.log(`0xHypr DEBUG - Invoice ${dbInvoiceId} saved to DB with status ${InvoiceStatus.Draft}`);


        // --- Trigger background commit if crypto ---
        if (invoiceData.paymentType === 'crypto' && dbInvoiceId) {
          console.log(`0xHypr DEBUG - Triggering background commit for crypto invoice: ${dbInvoiceId}`);
          // Don't await - let it run in the background
          _commitToRequestNetworkInBackground(dbInvoiceId, ctx).catch(err => {
            // Log the error, but don't let it crash the main flow
            console.error(`FATAL: Unhandled error in background commit for invoice ${dbInvoiceId}:`, err);
             // Optionally update DB status again here as a last resort if the function didn't catch it
          });
        }
        // --- End background commit trigger ---

        // Return the ID of the created invoice immediately
        return { invoiceId: dbInvoiceId };

      } catch (error) {
        console.error('Failed to create invoice:', error);
        // Clean up potential partial state if needed (though transaction might handle this)
        if (error instanceof TRPCError) {
            throw error; // Re-throw TRPC errors
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create invoice.',
          cause: error,
        });
      }
    }),

  // Get single invoice details
  get: protectedProcedure
    .input(z.object({ invoiceId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { invoiceId } = input;
      const userId = ctx.user.id;

      try {
        console.log(`0xHypr DEBUG - Fetching invoice details for ID: ${invoiceId}, User: ${userId}`);
        const result = await db
          .select()
          .from(userRequestsTable)
          .where(and(eq(userRequestsTable.id, invoiceId), eq(userRequestsTable.userId, userId)))
          .limit(1);

        const invoice = result[0];

        if (!invoice) {
          console.warn(`0xHypr DEBUG - Invoice not found or access denied for ID: ${invoiceId}, User: ${userId}`);
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Invoice not found or access denied.' });
        }

        // Format amount back for frontend display
         const decimals = invoice.currencyDecimals ?? getCurrencyConfig(invoice.currency || '', invoice.network)?.decimals ?? 2; // Fallback decimals
         const formattedAmount = invoice.amount !== null && invoice.amount !== undefined
           ? formatUnits(invoice.amount, decimals)
           : '0.00';

        console.log(`0xHypr DEBUG - Found invoice ${invoiceId}. Status: ${invoice.status}, RequestID: ${invoice.requestId}`);
        
        // Return necessary fields, including contentData and formatted amount
        return {
          ...invoice,
          amount: formattedAmount, // Return formatted amount
          contentData: invoice.contentData as any, // Assuming it's stored as JSON/JSONB
        };
      } catch (error) {
         if (error instanceof TRPCError) throw error;
        console.error(`Failed to fetch invoice ${invoiceId}:`, error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch invoice details.',
        });
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

});

// Helper function to clean data (ensure amounts are strings, etc.) - MUST match RNF Invoice format
function cleanInvoiceDataForRequestNetwork(data: any, decimals: number): any {
    // Basic cleaning, adapt as needed to match RNF Invoice format strictly
    const cleanedItems = data.invoiceItems.map((item: any) => ({
      ...item,
      unitPrice: parseUnits(new Decimal(item.unitPrice).toFixed(decimals), decimals).toString(),
      quantity: Number(item.quantity), // Ensure quantity is number
      tax: {
         ...item.tax,
         amount: item.tax.type === 'percentage' ? new Decimal(item.tax.amount).toString() : parseUnits(new Decimal(item.tax.amount).toFixed(decimals), decimals).toString(),
      }
    }));

    // TODO: Add more robust cleaning and validation against RNF schema
    return {
        ...data,
        invoiceItems: cleanedItems,
        // Remove fields not part of RNF Invoice format if necessary
        sellerInfo: data.sellerInfo ? {
            businessName: data.sellerInfo.businessName,
            email: data.sellerInfo.email,
            // Add address cleaning if needed
        } : undefined,
        buyerInfo: data.buyerInfo ? {
             businessName: data.buyerInfo.businessName,
            email: data.buyerInfo.email,
             // Add address cleaning if needed
        } : undefined,
        // Ensure other fields match RNF spec (creationDate, paymentTerms, note, terms etc.)
        meta: { format: 'rnf_invoice', version: '0.0.3'}, // Ensure correct meta
        // Remove non-RNF fields like paymentType, bankDetails unless handled elsewhere
        paymentType: undefined, 
        bankDetails: undefined,
        network: undefined, // network is part of currency obj, not top-level in RNF
    };
}

// Export the router type
export type InvoiceRouter = typeof invoiceRouter;
