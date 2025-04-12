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
import { ephemeralKeyService } from '@/lib/ephemeral-key-service';
import { userProfileService } from '@/lib/user-profile-service';
import { userRequestService } from '@/lib/user-request-service';
import { isAddress, parseUnits, formatUnits } from 'viem';
import { db } from '@/db';
import { userProfilesTable, NewUserRequest, InvoiceStatus, InvoiceRole } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrencyConfig, CurrencyConfig } from '@/lib/currencies';
import { RequestNetwork, Types, Utils } from '@requestnetwork/request-client.js';
import { Wallet, ethers } from 'ethers';

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
    accountHolder: z.string(),
    iban: z.string(),
    bic: z.string(),
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
      }),
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 50;
      // const cursor = input.cursor; // Cursor logic removed for now
      const userId = ctx.user.id;

      try {
        // Revert to original method - getUserRequestsPaginated doesn't exist
        const requests = await userRequestService.getUserRequests(userId);

        // Simple pagination logic (if needed, implement fully in service)
        const limitedRequests = requests.slice(0, limit);

        // Placeholder cursor logic - needs proper implementation if pagination required
        let nextCursor: string | undefined = undefined;
        // if (requests.length > limit) { 
        //   nextCursor = limitedRequests[limitedRequests.length - 1]?.id; 
        // }

        return {
          items: limitedRequests,
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
      const userId = ctx.user.id; // Privy DID from context
      const userEmail = ctx.user.email?.address;
      const invoiceData = input; // Use input directly

      if (!userEmail) {
        console.error(`User ${userId} does not have a linked email in Privy.`);
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'User email is required to determine invoice role.' });
      }

      let dbInvoiceId: string | null = null; // To store the DB ID

      try {
        console.log('0xHypr Starting invoice creation for user:', userId);

        // --- Database Save Only ---
        console.log('0xHypr Saving invoice data to database');

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

        // Calculate total amount
        const paymentType = invoiceData.paymentType || 'crypto';
        let rnNetwork: 'base' | 'xdai' | 'mainnet';
        if (paymentType === 'fiat') {
             rnNetwork = 'mainnet';
        } else {
             rnNetwork = (invoiceData.network === 'base' || invoiceData.network === 'xdai' || invoiceData.network === 'mainnet')
                         ? invoiceData.network
                         : 'base';
        }
        const selectedConfig = getCurrencyConfig(invoiceData.currency, paymentType, rnNetwork);
        if (!selectedConfig) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: `Unsupported currency/network combination: ${invoiceData.currency}/${rnNetwork}/${paymentType}` });
        }
        const decimals = selectedConfig.decimals;
        const totalAmountRaw = invoiceData.invoiceItems
          .reduce((sum, item) => {
            const itemPrice = parseFloat(item.unitPrice) || 0;
            const quantity = item.quantity || 0;
            const taxPercent = parseFloat(item.tax.amount) || 0;
            const itemTotal = itemPrice * quantity;
            const taxAmount = itemTotal * (taxPercent / 100);
            return sum + itemTotal + taxAmount;
          }, 0);
        const totalAmountString = totalAmountRaw.toFixed(decimals);

        // Generate an ephemeral key for sharing even without Request Network
        const ephemeralKey = await ephemeralKeyService.generateKey();
        if (!ephemeralKey || !ephemeralKey.token) {
           throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to generate sharing key.' });
        }

        // Create database record with explicit UUID to ensure uniqueness
        const requestDataForDb: NewUserRequest = {
          id: crypto.randomUUID(), // Explicitly generate a random UUID here
          userId: userId,
          role: role,
          description: description,
          amount: totalAmountString,
          currency: invoiceData.currency,
          status: 'db_pending', // Status is 'db_pending' since it's only in the database
          client: clientName,
          invoiceData: invoiceData, // Store full input
          shareToken: ephemeralKey.token, // Store share token for viewing
        };

        // Perform the database insert
        const newDbRecord = await userRequestService.addRequest(requestDataForDb);
        if (!newDbRecord || typeof newDbRecord.id !== 'string') {
          throw new Error('Database service did not return a valid ID after initial save.');
        }
        dbInvoiceId = newDbRecord.id; // Store the ID
        console.log('0xHypr Database save complete. Invoice ID:', dbInvoiceId);

        // Return success with database ID and share token
        return {
          success: true,
          invoiceId: dbInvoiceId,
          requestId: null, // No Request Network ID yet
          token: ephemeralKey.token, // Return share token for viewing
        };

      } catch (error) {
        console.error('Error during invoice creation process:', error);

        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create invoice.',
          cause: error,
        });
      }
    }),

  // New endpoint to commit an existing invoice to Request Network
  commitToRequestNetwork: protectedProcedure
    .input(z.object({
      invoiceId: z.string().min(1, "Invoice ID is required")
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;
      const { invoiceId } = input;

      try {
        console.log(`0xHypr Starting Request Network commitment for invoice: ${invoiceId}`);
        
        // Get the invoice from the database
        const invoice = await userRequestService.getRequestByPrimaryKey(invoiceId);
        if (!invoice) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Invoice not found.' });
        }
        
        // Check if this invoice belongs to the user
        if (invoice.userId !== userId) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not have permission to commit this invoice.' });
        }
        
        // Check if already committed to Request Network
        if (invoice.requestId) {
          return {
            success: true,
            invoiceId: invoice.id,
            requestId: invoice.requestId,
            token: invoice.shareToken || null,
            alreadyCommitted: true
          };
        }
        
        // Get the invoice data from the record
        const invoiceData = invoice.invoiceData as z.infer<typeof invoiceDataSchema>;
        if (!invoiceData) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invoice data is missing or invalid.' });
        }
        
        // Get the user's wallet
        const userWallet = await userProfileService.getOrCreateWallet(userId);
        if (!userWallet || !userWallet.privateKey || !userWallet.publicKey || !userWallet.address) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Could not retrieve user wallet credentials.' });
        }
        console.log(`0xHypr Using wallet address ${userWallet.address} for RN commit`);
        
        // Generate/use ephemeral key for decryption 
        const ephemeralKey = invoice.shareToken 
          ? await ephemeralKeyService.getKeyFromToken(invoice.shareToken)
          : await ephemeralKeyService.generateKey();
          
        if (!ephemeralKey || !ephemeralKey.publicKey) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to retrieve or generate sharing key.' });
        }
        
        // Prepare Request Network parameters
        const paymentType = invoiceData.paymentType || 'crypto';
        let rnNetwork: 'base' | 'xdai' | 'mainnet';
        if (paymentType === 'fiat') {
          rnNetwork = 'mainnet';
        } else {
          rnNetwork = (invoiceData.network === 'base' || invoiceData.network === 'xdai' || invoiceData.network === 'mainnet')
                      ? invoiceData.network
                      : 'base';
        }
        
        const selectedConfig = getCurrencyConfig(invoiceData.currency, paymentType, rnNetwork);
        if (!selectedConfig) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: `Unsupported currency/network combination: ${invoiceData.currency}/${rnNetwork}/${paymentType}` });
        }
        
        const decimals = selectedConfig.decimals;
        const totalAmountRaw = invoiceData.invoiceItems
          .reduce((sum, item) => {
            const itemPrice = parseFloat(item.unitPrice) || 0;
            const quantity = item.quantity || 0;
            const taxPercent = parseFloat(item.tax.amount) || 0;
            const itemTotal = itemPrice * quantity;
            const taxAmount = itemTotal * (taxPercent / 100);
            return sum + itemTotal + taxAmount;
          }, 0);
        
        const expectedAmount = parseUnits(totalAmountRaw.toFixed(decimals), decimals).toString();
        
        // Prepare payment network details
        let paymentNetworkParams: any;
        let paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID;
        
        if (paymentType === 'fiat') {
          paymentNetworkId = ExtensionTypes.PAYMENT_NETWORK_ID.ANY_DECLARATIVE;
          if (!invoiceData.bankDetails) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Bank details are required for fiat invoices.' });
          }
          paymentNetworkParams = {
            paymentInstruction: `Pay ${invoiceData.currency} ${totalAmountRaw.toFixed(decimals)} via Bank Transfer.
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
            paymentNetworkParams = { 
              paymentAddress: cryptoPaymentAddress, 
              paymentNetworkName: rnNetwork,
              network: rnNetwork, // Add explicit network parameter
            };
          } else if (selectedConfig.type === RequestLogicTypes.CURRENCY.ERC20) {
            paymentNetworkId = ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT;
            paymentNetworkParams = {
              paymentAddress: cryptoPaymentAddress,
              feeAddress: ethers.constants.AddressZero, // No fee
              feeAmount: '0',
              paymentNetworkName: rnNetwork,
              network: rnNetwork, // Add explicit network parameter
            };
          } else {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Unsupported crypto payment network setup.' });
          }
        }
        
        const currencyValue = selectedConfig.type === RequestLogicTypes.CURRENCY.ERC20
          ? selectedConfig.value
          : selectedConfig.value.toUpperCase();
        const rnCurrencyType = selectedConfig.type as RequestLogicTypes.CURRENCY;
        
        // Helper function to clean invoice data for Request Network
        function cleanInvoiceDataForRequestNetwork(data: any): any {
          // Create a new object with only the properties required for RNF format
          return {
            meta: data.meta,
            creationDate: data.creationDate,
            invoiceNumber: data.invoiceNumber,
            sellerInfo: data.sellerInfo,
            buyerInfo: data.buyerInfo,
            invoiceItems: data.invoiceItems.map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              tax: item.tax,
              currency: data.currency, // Include the invoice currency for each item
            })),
            paymentTerms: data.paymentTerms,
            note: data.note,
            terms: data.terms,
            // Omit: network, currency, paymentType
            ...(data.bankDetails && { bankDetails: data.bankDetails }),
          };
        }

        const requestDataForRN = {
          currency: {
            type: rnCurrencyType,
            value: currencyValue,
            network: rnNetwork, // Explicit network in currency
            decimals: decimals,
          },
          expectedAmount: expectedAmount,
          paymentAddress: userWallet.address,
          contentData: cleanInvoiceDataForRequestNetwork(invoiceData),
          paymentNetwork: {
            id: paymentNetworkId,
            parameters: paymentNetworkParams,
          },
        };
        
        // Create the Request Network request
        console.log("0xHypr Calling createInvoiceRequest with prepared data...");
        const rnResult = await createInvoiceRequest(
          requestDataForRN as any,
          ephemeralKey,
          userWallet
        );
        
        if (!rnResult || !rnResult.requestId) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get valid result from Request Network.' });
        }
        
        console.log(`0xHypr Request Network commit successful: RequestID=${rnResult.requestId}`);
        
        // Update the database record with Request Network details
        await userRequestService.updateRequest(invoiceId, {
          requestId: rnResult.requestId,
          status: 'pending', // Status is now 'pending' in Request Network
          walletAddress: userWallet.address,
          shareToken: rnResult.token || invoice.shareToken, // Use new token if provided, otherwise keep existing
        });
        
        // Return success with both database ID and Request Network ID
        return {
          success: true,
          invoiceId: invoice.id,
          requestId: rnResult.requestId,
          token: rnResult.token || invoice.shareToken || null,
          alreadyCommitted: false
        };
        
      } catch (error) {
        console.error(`Error committing invoice ${invoiceId} to Request Network:`, error);
        
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to commit invoice to Request Network.',
          cause: error,
        });
      }
    }),

  // Get invoice details (adjusted to fetch by primary key)
  getById: publicProcedure // Keep public for shareable links
    .input(z.object({ 
        id: z.string(), // Fetch by primary key (UUID string)
        token: z.string().optional(), // Ephemeral token for auth
    })) 
    .query(async ({ input, ctx }) => {
        // Explicitly cast ctx to potentially include user for type checking
        const currentCtx = ctx as { user?: { id: string } };
        try {
            const request = await userRequestService.getRequestByPrimaryKey(input.id);
            if (!request) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Invoice not found.' });
            }

            // Authorization Check:
            // 1. If a token is provided, verify it against the stored shareToken
            if (input.token) {
                if (request.shareToken && input.token === request.shareToken) {
                    // Token is valid, allow access
                    return request;
                } else {
                    // Invalid or missing token
                    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid or missing share token.' });
                }
            }
            // 2. If no token, check if the logged-in user (if any) owns the invoice
            // Use the cast context type
            else if (currentCtx.user?.id && request.userId === currentCtx.user.id) {
                 // Logged-in user owns the invoice
                 return request;
            }
            // 3. If no token and either no logged-in user OR logged-in user doesn't own it
            else {
                 // Determine specific error based on whether user is logged in using cast context
                 const errorCode = currentCtx.user?.id ? 'FORBIDDEN' : 'UNAUTHORIZED';
                 const errorMessage = currentCtx.user?.id 
                    ? 'You do not have permission to view this invoice.'
                    : 'Authentication required to view this invoice.';
                 throw new TRPCError({ code: errorCode, message: errorMessage });
            }

        } catch (error) {
             console.error(`Failed to fetch invoice by ID ${input.id}:`, error);
             if (error instanceof TRPCError) throw error;
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch invoice.'});
        }
    }),

});

// Helper type for client-side use
export type InvoiceRouter = typeof invoiceRouter;
