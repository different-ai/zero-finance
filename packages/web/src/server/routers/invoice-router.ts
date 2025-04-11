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
import { userProfilesTable } from '@/db/schema';
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
  paymentType: z.enum(['crypto', 'fiat']),
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

        const userId = ctx.user.id;

        // --- Minimal preparation for DB storage --- 
        // Get user email for role determination
        const userProfile = await userProfileService.getUserProfile(userId);
        const userEmail = userProfile?.email;
        const isSeller = input.sellerInfo.email === userEmail;
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
        // Note: This might need refinement if tax/precise calculation is critical here
        // Keeping it simple for DB storage, detailed calculation happens during RN commit.
        const totalAmount = input.invoiceItems
          .reduce((sum, item) => {
            const itemPrice = parseFloat(item.unitPrice) || 0;
            const quantity = item.quantity || 0;
            const taxPercent = parseFloat(item.tax.amount) || 0;
            const itemTotal = itemPrice * quantity;
            const taxAmount = itemTotal * (taxPercent / 100);
            return sum + itemTotal + taxAmount;
          }, 0)
          .toFixed(2); 

        // --- Save to Database using Service ---
        // Note: Assuming userRequestService.addRequest exists and handles this structure
        const newDbRecord = await userRequestService.addRequest({
          // requestId will be null initially
          userId: userId,
          // walletAddress might be added later or during commit
          role: role,
          description: description,
          amount: totalAmount, // Store calculated total amount as string
          currency: input.currency, // Store the selected currency symbol/code
          status: 'db_pending', // New status: Saved to DB, not yet on RN
          client: clientName,
          invoiceData: input, // Store the full input data as JSON
          // shareToken will be null initially
        });

        // Assuming addRequest returns the created record with its ID
        if (!newDbRecord || typeof newDbRecord.id !== 'number') {
          throw new Error('Database service did not return a valid ID for the new invoice.');
        }

        const dbInvoiceId = newDbRecord.id;
        console.log('0xHypr', 'Invoice saved to DB with ID:', dbInvoiceId);

        return {
          success: true,
          invoiceId: dbInvoiceId, // Return the database ID
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

  // Get invoice details (Remains largely the same, might need adjustments later)
  getById: publicProcedure
    // ... existing code ...

  // --- NEW MUTATION: Commit to Request Network ---
  commitToRequestNetwork: protectedProcedure
    .input(z.object({ id: z.number() })) // Input is the database ID
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;
      const dbInvoiceId = input.id;

      try {
        console.log(`0xHypr Attempting commit to Request Network for DB invoice ID ${dbInvoiceId} by user ${userId}`);

        // 1. Fetch the invoice from DB and verify ownership & status
        const dbInvoice = await userRequestService.getRequestById(dbInvoiceId);

        if (!dbInvoice) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Invoice not found in database.' });
        }
        if (dbInvoice.userId !== userId) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not own this invoice.' });
        }
        // Check if it's already committed
        if (dbInvoice.requestId && dbInvoice.requestId.startsWith('0x')) { // Basic check if requestId looks valid
           console.log(`0xHypr Invoice ${dbInvoiceId} already has Request ID: ${dbInvoice.requestId}. Skipping commit.`);
           // Optionally return success if already committed, or a specific status code
           return { success: true, alreadyCommitted: true, requestId: dbInvoice.requestId };
           // OR throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invoice already committed to Request Network.' });
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
           invoiceData = dbInvoice.invoiceData as z.infer<typeof invoiceDataSchema>;
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
        // Use the *database ID* to associate the key
        // Assuming ephemeralKeyService.generateKey() is the correct method now
        const ephemeralKey = await ephemeralKeyService.generateKey();
        if (!ephemeralKey || !ephemeralKey.token || !ephemeralKey.publicKey) {
           console.error("0xHypr Failed to generate ephemeral key");
           throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to generate sharing key.' });
        }
         console.log(`0xHypr Generated ephemeral key for viewer. Token: ${ephemeralKey.token.substring(0,5)}... Public Key: ${ephemeralKey.publicKey.substring(0,10)}...`);

        // 4. Prepare data for createInvoiceRequest
        const paymentType = invoiceData.paymentType || 'crypto';
        // Determine network carefully - Request Network expects 'base', 'xdai', 'mainnet' etc.
        // Map our internal 'fiat' to a suitable RN network like 'mainnet' or 'xdai' if needed
        let rnNetwork: 'base' | 'xdai' | 'mainnet';
        if (paymentType === 'fiat') {
             rnNetwork = 'mainnet'; // Defaulting fiat to mainnet for RN
        } else {
             // Assuming crypto defaults to 'base' if not specified in invoiceData
             rnNetwork = (invoiceData.network === 'base' || invoiceData.network === 'xdai' || invoiceData.network === 'mainnet') 
                         ? invoiceData.network 
                         : 'base'; 
        }
        
        const selectedConfig = getCurrencyConfig(
          invoiceData.currency,
          paymentType,
          rnNetwork, // Use the determined RN-compatible network
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
          // Ensure bankDetails exist for fiat
          if (!invoiceData.bankDetails) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Bank details are required for fiat invoices.' });
          }
          paymentNetworkParams = {
            paymentInstruction: `Pay ${invoiceData.currency} ${totalAmountRaw.toFixed(decimals)} via Bank Transfer.\nAccount Holder: ${invoiceData.bankDetails?.accountHolder}\nIBAN: ${invoiceData.bankDetails?.iban}\nBIC: ${invoiceData.bankDetails?.bic}\nBank: ${invoiceData.bankDetails?.bankName || 'N/A'}\nReference: ${invoiceData.invoiceNumber}`,
          };
        } else { // crypto
           // Use user's wallet as the payment address for crypto
           const cryptoPaymentAddress = userWallet.address;
          // Determine Payment Network based on currency type and network
          if (selectedConfig.type === RequestLogicTypes.CURRENCY.ETH && rnNetwork === 'base') {
             paymentNetworkId = ExtensionTypes.PAYMENT_NETWORK_ID.NATIVE_TOKEN; // Example for Base ETH
             paymentNetworkParams = {
               paymentAddress: cryptoPaymentAddress,
               paymentNetworkName: rnNetwork, 
             };
          } else if (selectedConfig.type === RequestLogicTypes.CURRENCY.ERC20 && rnNetwork === 'base') {
             paymentNetworkId = ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT; // Example for Base ERC20
             paymentNetworkParams = {
               paymentAddress: cryptoPaymentAddress,
               feeAddress: ethers.constants.AddressZero, // No fee
               feeAmount: '0',
               paymentNetworkName: rnNetwork,
             };
           } else if (rnNetwork === 'xdai' && selectedConfig.type === RequestLogicTypes.CURRENCY.ERC20) {
             // Example config for xdai ERC20 (adjust ID if needed)
             paymentNetworkId = ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT; 
             paymentNetworkParams = {
               paymentAddress: cryptoPaymentAddress,
               feeAddress: ethers.constants.AddressZero, 
               feeAmount: '0',
               paymentNetworkName: rnNetwork,
             };
          } else {
              // Fallback or error for unsupported crypto networks/types
              console.error("Unsupported crypto payment network configuration", {type: selectedConfig.type, network: rnNetwork});
              throw new TRPCError({ code: 'BAD_REQUEST', message: 'Unsupported crypto payment network setup.' });
          }
        }
         console.log(`0xHypr Using Payment Network ID: ${paymentNetworkId} with params:`, paymentNetworkParams);

        // Ensure currency value is correct (address for ERC20, symbol otherwise)
        const currencyValue = selectedConfig.type === RequestLogicTypes.CURRENCY.ERC20 
           ? selectedConfig.value // Should be the contract address
           : invoiceData.currency.toUpperCase(); // Use the symbol like 'ETH', 'EUR'
           
        // Type assertion needed for RN library compatibility sometimes
        const rnCurrencyType = selectedConfig.type as RequestLogicTypes.CURRENCY; 

        const requestDataForRN = {
          currency: {
            type: rnCurrencyType,
            value: currencyValue, 
            network: rnNetwork, 
            paymentNetworkId: paymentNetworkId, // This might be redundant if defined below, check RN docs
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

        // Validate RN result
        if (!rnResult || !rnResult.requestId || !rnResult.token) {
           console.error("0xHypr createInvoiceRequest returned invalid data", rnResult);
           throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get valid result from Request Network.' });
        }

        console.log(`0xHypr Request Network commit successful: RequestID=${rnResult.requestId}, Token=${rnResult.token}`);

        // 6. Update DB record with RN details
        // Assuming userRequestService.updateRequest exists and takes ID and update payload
        await userRequestService.updateRequest(dbInvoiceId, {
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
