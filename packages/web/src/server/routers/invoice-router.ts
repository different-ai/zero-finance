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
import { userProfilesTable, NewUserRequest } from '@/db/schema';
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
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 50;
      const cursor = input.cursor;
      const userId = ctx.user.id;

      try {
        // Get user requests from the database
        const requests = await userRequestService.getUserRequests(userId);

        return {
          items: requests,
          nextCursor: null, // Implement cursor-based pagination if needed
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
      try {
        console.log(
          '0xHypr',
          'Received invoice data for DB storage:',
          JSON.stringify(input, null, 2),
        );

        const userId = ctx.user.id; // Privy DID from context
        // Get email from the Privy User object structure
        const userEmail = ctx.user.email?.address; 

        if (!userEmail) {
            // This might happen if the user signed up with wallet only
            // Handle this case - perhaps use a placeholder or throw specific error?
            // For now, throwing error. Consider alternatives.
            console.error(`User ${userId} does not have a linked email in Privy.`);
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'User email is required to determine invoice role.' });
        }

        // --- Minimal preparation for DB storage --- 
        // Get user profile using Privy DID and email
        const userProfile = await userProfileService.getOrCreateProfile(userId, userEmail);
        
        // Determine role based on email stored in profile vs input
        const isSeller = input.sellerInfo.email === userProfile.email;
        const role = isSeller ? 'seller' : 'buyer';

        // Extract client name
        const clientName = isSeller
          ? input.buyerInfo?.businessName || input.buyerInfo?.email || 'Unknown Client'
          : input.sellerInfo?.businessName || input.sellerInfo.email || 'Unknown Seller';

        // Extract description
        const description =
          input.invoiceItems?.[0]?.name ||
          input.invoiceNumber ||
          'Invoice';

        // Calculate total amount (as string for DB)
        const selectedConfig = getCurrencyConfig(input.currency, input.paymentType, input.network);
        const decimals = selectedConfig?.decimals ?? 2; // Default to 2 if config not found (e.g., for fiat)
        const totalAmountRaw = input.invoiceItems
          .reduce((sum, item) => {
            const itemPrice = parseFloat(item.unitPrice) || 0;
            const quantity = item.quantity || 0;
            const taxPercent = parseFloat(item.tax.amount) || 0;
            const itemTotal = itemPrice * quantity;
            const taxAmount = itemTotal * (taxPercent / 100);
            return sum + itemTotal + taxAmount;
          }, 0);
        const totalAmountString = totalAmountRaw.toFixed(decimals); 

        // --- Prepare data for userRequestService.addRequest ---
        // Omit fields handled by DB (id, createdAt, updatedAt)
        // requestId, walletAddress, shareToken are initially null/undefined
        const requestDataForDb: Omit<NewUserRequest, 'id' | 'createdAt' | 'updatedAt'> = {
          userId: userId,
          role: role,
          description: description,
          amount: totalAmountString, // Store calculated total amount as string
          currency: input.currency, // Store the selected currency symbol/code
          status: 'db_pending', // New status: Saved to DB, not yet on RN
          client: clientName,
          invoiceData: input, // Store the full input data as JSON
          // Fields that will be populated after RN commit:
          requestId: null,
          walletAddress: null,
          shareToken: null,
        };

        const newDbRecord = await userRequestService.addRequest(requestDataForDb);

        if (!newDbRecord || typeof newDbRecord.id !== 'string') { // ID is UUID string
          throw new Error('Database service did not return a valid ID for the new invoice.');
        }

        const dbInvoiceId = newDbRecord.id;
        console.log('0xHypr', 'Invoice saved to DB with ID:', dbInvoiceId);

        return {
          success: true,
          invoiceId: dbInvoiceId, // Return the database primary key (UUID string)
        };
      } catch (error) {
        console.error('Error creating invoice in DB:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to save invoice.',
          cause: error,
        });
      }
    }),

  // Get invoice details (adjusted to fetch by primary key)
  getById: publicProcedure // Make public? Or protected with ephemeral key check?
    .input(z.object({ id: z.string() })) // Fetch by primary key (UUID string)
    .query(async ({ input, ctx }) => {
        try {
            const request = await userRequestService.getRequestByPrimaryKey(input.id);
            if (!request) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Invoice not found.' });
            }
            // Add ephemeral key validation here if making public
            // Check if ctx.user owns it if making protected
            return request; 
        } catch (error) {
             console.error(`Failed to fetch invoice by ID ${input.id}:`, error);
             if (error instanceof TRPCError) throw error;
             throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch invoice.'});
        }
    }),

  // --- NEW MUTATION: Commit to Request Network ---
  commitToRequestNetwork: protectedProcedure
    .input(z.object({ id: z.string() })) // Input is the database ID (UUID string)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;
      const dbInvoiceId = input.id; // dbInvoiceId is a string (UUID)

      try {
        console.log(`0xHypr Attempting commit to Request Network for DB invoice ID ${dbInvoiceId} by user ${userId}`);

        // 1. Fetch the invoice from DB using Primary Key and verify ownership & status
        const dbInvoice = await userRequestService.getRequestByPrimaryKey(dbInvoiceId); // Use the correct method

        if (!dbInvoice) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Invoice not found in database.' });
        }
        if (dbInvoice.userId !== userId) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not own this invoice.' });
        }
        // Check if it's already committed (check if requestId is populated)
        if (dbInvoice.requestId) { 
           console.log(`0xHypr Invoice ${dbInvoiceId} already has Request ID: ${dbInvoice.requestId}. Skipping commit.`);
           return { success: true, alreadyCommitted: true, requestId: dbInvoice.requestId };
        }
        // Ensure status is correct for committing
        if (dbInvoice.status !== 'db_pending') {
            console.warn(`0xHypr Invoice ${dbInvoiceId} has status ${dbInvoice.status}, expected 'db_pending'. Proceeding cautiously.`);
            // Potentially throw error: throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invoice not in correct state for committing.' });
        }

        // Ensure invoiceData is parsed (assuming it's stored as JSON)
        let invoiceData: z.infer<typeof invoiceDataSchema>;
        if (typeof dbInvoice.invoiceData === 'string') {
           try {
             invoiceData = JSON.parse(dbInvoice.invoiceData);
           } catch (e) {
              console.error("0xHypr Failed to parse invoiceData JSON from DB", dbInvoice.invoiceData);
              throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to parse stored invoice data.' });
           }
        } else if (typeof dbInvoice.invoiceData === 'object' && dbInvoice.invoiceData !== null) {
           // Assuming the type from DB matches the Zod schema
           invoiceData = invoiceDataSchema.parse(dbInvoice.invoiceData); // Use parse for validation
        } else {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Invalid invoice data format stored in database.' });
        }

        // 2. Get user's wallet
        const userWallet = await userProfileService.getOrCreateWallet(userId);
        if (!userWallet || !userWallet.privateKey || !userWallet.publicKey || !userWallet.address) {
          console.error("0xHypr Failed to retrieve complete wallet information for user", userId);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Could not retrieve user wallet credentials.' });
        }
         console.log(`0xHypr Using wallet address ${userWallet.address} for RN commit`);

        // 3. Generate ephemeral key for the viewer/payer
        const ephemeralKey = await ephemeralKeyService.generateKey();
        if (!ephemeralKey || !ephemeralKey.token || !ephemeralKey.publicKey) {
           console.error("0xHypr Failed to generate ephemeral key");
           throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to generate sharing key.' });
        }
         console.log(`0xHypr Generated ephemeral key for viewer. Token: ${ephemeralKey.token.substring(0,5)}... Public Key: ${ephemeralKey.publicKey.substring(0,10)}...`);

        // 4. Prepare data for createInvoiceRequest
        const paymentType = invoiceData.paymentType || 'crypto';
        // Determine network carefully - Request Network expects 'base', 'xdai', 'mainnet' etc.
        let rnNetwork: 'base' | 'xdai' | 'mainnet';
        if (paymentType === 'fiat') {
             rnNetwork = 'mainnet'; // Defaulting fiat to mainnet for RN
        } else {
             rnNetwork = (invoiceData.network === 'base' || invoiceData.network === 'xdai' || invoiceData.network === 'mainnet') 
                         ? invoiceData.network 
                         : 'base'; // Default crypto to base
        }
        
        const selectedConfig = getCurrencyConfig(
          invoiceData.currency,
          paymentType,
          rnNetwork,
        );

        if (!selectedConfig) {
          console.error(`Unsupported config: currency=${invoiceData.currency}, paymentType=${paymentType}, rnNetwork=${rnNetwork}`);
          throw new TRPCError({ code: 'BAD_REQUEST', message: `Unsupported currency/network combination for Request Network.` });
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
         console.log(`0xHypr Calculated expectedAmount: ${expectedAmount} (raw: ${totalAmountRaw}, decimals: ${decimals})`);

        let paymentNetworkParams: any;
        let paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID;

        if (paymentType === 'fiat') {
          paymentNetworkId = ExtensionTypes.PAYMENT_NETWORK_ID.ANY_DECLARATIVE;
          if (!invoiceData.bankDetails) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Bank details are required for fiat invoices.' });
          }
          paymentNetworkParams = {
            paymentInstruction: `Pay ${invoiceData.currency} ${totalAmountRaw.toFixed(decimals)} via Bank Transfer.\nAccount Holder: ${invoiceData.bankDetails?.accountHolder}\nIBAN: ${invoiceData.bankDetails?.iban}\nBIC: ${invoiceData.bankDetails?.bic}\nBank: ${invoiceData.bankDetails?.bankName || 'N/A'}\nReference: ${invoiceData.invoiceNumber}`,
            // Note: paymentNetworkName might not be needed for ANY_DECLARATIVE
          };
        } else { // crypto
           const cryptoPaymentAddress = userWallet.address;
          if (selectedConfig.type === RequestLogicTypes.CURRENCY.ETH) {
             // Assuming NATIVE_TOKEN is correct for Base ETH (confirm RN docs)
             paymentNetworkId = ExtensionTypes.PAYMENT_NETWORK_ID.NATIVE_TOKEN; 
             paymentNetworkParams = {
               paymentAddress: cryptoPaymentAddress,
               paymentNetworkName: rnNetwork, // e.g., 'base'
             };
          } else if (selectedConfig.type === RequestLogicTypes.CURRENCY.ERC20) {
             // Assuming ERC20_FEE_PROXY is correct for Base/XDAI ERC20 (confirm RN docs)
             paymentNetworkId = ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT; 
             paymentNetworkParams = {
               paymentAddress: cryptoPaymentAddress,
               feeAddress: ethers.constants.AddressZero, // No fee
               feeAmount: '0',
               paymentNetworkName: rnNetwork, // e.g., 'base' or 'xdai'
             };
           } else {
              console.error("Unsupported crypto payment network configuration", {type: selectedConfig.type, network: rnNetwork});
              throw new TRPCError({ code: 'BAD_REQUEST', message: 'Unsupported crypto payment network setup.' });
          }
        }
         console.log(`0xHypr Using Payment Network ID: ${paymentNetworkId} with params:`, paymentNetworkParams);

        // Ensure currency value is correct (address for ERC20, symbol otherwise)
        const currencyValue = selectedConfig.type === RequestLogicTypes.CURRENCY.ERC20 
           ? selectedConfig.value // Should be the contract address
           : selectedConfig.value.toUpperCase(); // Use the symbol like 'ETH', 'EUR' from config
           
        const rnCurrencyType = selectedConfig.type as RequestLogicTypes.CURRENCY; 

        const requestDataForRN = {
          currency: {
            type: rnCurrencyType,
            value: currencyValue, 
            network: rnNetwork, 
            // paymentNetworkId: paymentNetworkId, // Often redundant here
            decimals: decimals,
          },
          expectedAmount: expectedAmount,
          paymentAddress: userWallet.address, // Payee address is the user's wallet
          contentData: invoiceData, // Use the full stored data
          paymentNetwork: {
            id: paymentNetworkId,
            parameters: paymentNetworkParams,
          },
        };

        console.log("0xHypr Prepared data for createInvoiceRequest:", JSON.stringify(requestDataForRN, null, 2));

        // 5. Call createInvoiceRequest
        const rnResult = await createInvoiceRequest(
          requestDataForRN as any, // Use 'as any' carefully if types mismatch slightly
          ephemeralKey, 
          userWallet 
        );

        if (!rnResult || !rnResult.requestId || !rnResult.token) {
           console.error("0xHypr createInvoiceRequest returned invalid data", rnResult);
           throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get valid result from Request Network.' });
        }

        console.log(`0xHypr Request Network commit successful: RequestID=${rnResult.requestId}, Token=${rnResult.token}`);

        // 6. Update DB record with RN details using the primary key
        await userRequestService.updateRequest(dbInvoiceId, { // Use the primary key (UUID string)
          requestId: rnResult.requestId,
          shareToken: rnResult.token,
          status: 'pending', // Update status to RN pending (awaiting payment)
          walletAddress: userWallet.address, // Store the wallet address used for commit
        });

        console.log(`0xHypr DB record ${dbInvoiceId} updated with RN details.`);

        return {
          success: true,
          requestId: rnResult.requestId,
          token: rnResult.token,
        };

      } catch (error) {
        console.error(`Error committing invoice ${dbInvoiceId} to Request Network:`, error);
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

});

// Helper type for client-side use
export type InvoiceRouter = typeof invoiceRouter;
