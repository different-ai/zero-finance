import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../create-router';
import { TRPCError } from '@trpc/server';
import { createInvoiceRequest } from '@/lib/request-network';
import { RequestLogicTypes, ExtensionTypes, CurrencyTypes, IdentityTypes } from '@requestnetwork/types';
import { ephemeralKeyService } from '@/lib/ephemeral-key-service';
import { userProfileService } from '@/lib/user-profile-service';
import { userRequestService } from '@/lib/user-request-service';
import { isAddress, parseUnits, formatUnits } from 'viem';
import { db } from '@/db';
import { userProfilesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

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
type AppCurrencyConfig = typeof USDC_BASE_CONFIG | typeof ETH_BASE_CONFIG | typeof FIAT_CURRENCIES[keyof typeof FIAT_CURRENCIES];

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

const bankDetailsSchema = z.object({
  accountHolder: z.string(),
  iban: z.string(),
  bic: z.string(),
  bankName: z.string().optional(),
});

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
  paymentTerms: z.object({
    dueDate: z.string().optional(),
  }).optional(),
  note: z.string().optional(),
  terms: z.string().optional(),
  paymentType: z.enum(['crypto', 'fiat']),
  currency: z.string(),
  bankDetails: bankDetailsSchema.optional(),
  // primarySafeAddress: z.string().optional(), // Removed - will fetch from DB
});

export const invoiceRouter = router({
  // Example endpoint to list invoices
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
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

  // Create invoice endpoint
  create: protectedProcedure
    .input(invoiceDataSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        console.log('0xHypr', 'Received invoice data:', JSON.stringify(input, null, 2));

        const userId = ctx.user.id;
        
        // --- Fetch primarySafeAddress directly from DB ---
        let fetchedPrimarySafeAddress: string | null | undefined = undefined;
        try {
          const profileResult = await db
            .select({ primarySafeAddress: userProfilesTable.primarySafeAddress })
            .from(userProfilesTable)
            .where(eq(userProfilesTable.clerkId, userId))
            .limit(1);
            
          if (profileResult.length > 0) {
            fetchedPrimarySafeAddress = profileResult[0].primarySafeAddress;
            console.log('0xHypr', 'Fetched primarySafeAddress from DB:', fetchedPrimarySafeAddress);
          } else {
            console.warn('0xHypr', `No user profile found for userId: ${userId}`);
             // Throw an error or handle as appropriate if profile MUST exist
             throw new TRPCError({ code: 'NOT_FOUND', message: 'User profile not found.' });
          }
        } catch (dbError) {
          console.error('0xHypr', 'Error fetching primarySafeAddress from DB:', dbError);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch user profile data.' });
        }
        // --- End Fetch primarySafeAddress ---
        
        const paymentType = input.paymentType || 'crypto';
        const network = input.network || (paymentType === 'crypto' ? 'gnosis' : 'mainnet');

        // Prepare contentData: clone input and remove fields not part of RN schema
        const contentData: any = { ...input };
        delete contentData.network;
        delete contentData.paymentType;
        delete contentData.currency;
        delete contentData.primarySafeAddress;
        if (paymentType === 'crypto') {
          delete contentData.bankDetails;
        }
        console.log('0xHypr', 'Prepared contentData for Request Network:', JSON.stringify(contentData, null, 2));

        let selectedConfig: AppCurrencyConfig; // Use our helper type first
        let currencySymbol: string;
        let decimals: number; // Define decimals variable here

        if (paymentType === 'fiat') {
          const currency = input.currency.toUpperCase();
          if (!(currency in FIAT_CURRENCIES)) { 
            throw new TRPCError({ code: 'BAD_REQUEST', message: `Unsupported fiat currency: ${currency}` });
          }
          selectedConfig = FIAT_CURRENCIES[currency as keyof typeof FIAT_CURRENCIES];
          currencySymbol = currency;
          decimals = selectedConfig.decimals;
          console.log('0xHypr', `Using ${currency} with ANY_DECLARATIVE payment network`);
        } else { // Crypto Payment (must be 'base' network)
          if (network !== 'base') {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Only Base network is supported for crypto payments.' });
          }
          
          const cryptoCurrency = input.currency.toUpperCase();
          if (cryptoCurrency === 'USDC') {
            selectedConfig = USDC_BASE_CONFIG;
            currencySymbol = 'USDC';
            decimals = selectedConfig.decimals;
            console.log('0xHypr', 'Using USDC on Base mainnet');
          } else if (cryptoCurrency === 'ETH') {
            selectedConfig = ETH_BASE_CONFIG;
            currencySymbol = 'ETH';
            decimals = selectedConfig.decimals;
            console.log('0xHypr', 'Using ETH on Base mainnet');
          } else {
            throw new TRPCError({ code: 'BAD_REQUEST', message: `Unsupported crypto currency on Base: ${input.currency}` });
          }
        }

        // Get user's wallet (signing) and validate fetched Safe Address
        let userWallet: { address: string; privateKey: string; publicKey: string } | undefined = undefined;
        let paymentAddress = '';
        
        try {
          const wallet = await userProfileService.getOrCreateWallet(userId);
          userWallet = { address: wallet.address, privateKey: wallet.privateKey, publicKey: wallet.publicKey };
          console.log('0xHypr', 'Using wallet for signing:', wallet.address);

          if (paymentType === 'crypto') {
            // Use the address fetched directly from DB
            if (!fetchedPrimarySafeAddress || !isAddress(fetchedPrimarySafeAddress)) {
               throw new TRPCError({ code: 'BAD_REQUEST', message: 'Missing or invalid primary Safe address in user profile.' }); 
            }
            paymentAddress = fetchedPrimarySafeAddress;
            console.log('0xHypr', `Using primary Safe address from profile for ${network} ${currencySymbol} payment:`, paymentAddress);
          } else {
            console.log('0xHypr', 'Fiat payment selected, payment address not needed.');
          }
        } catch (error) {
          console.error('0xHypr', 'Error getting wallet or validating Safe address:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Setup error: ${error instanceof Error ? error.message : 'Unknown error'}`, 
          });
        }
        
        // Calculate total amount from invoice items
        let totalAmount = '100'; // Default minimum amount
        if (contentData.invoiceItems && contentData.invoiceItems.length > 0) {
          // Amount is received in CENTS (e.g., 1000 for $10.00) from the form
          // We need to convert this form-amount (in cents) to the token's smallest unit (wei for ETH, 6 decimals for USDC, cents for fiat)
          const totalInCents = contentData.invoiceItems.reduce((sum: number, item: any) => {
            const quantity = Number(item.quantity) || 0;
            const unitPriceInCents = Number(item.unitPrice) || 0; // Assume unitPrice from form is in cents
            const taxRate = item.tax?.amount ? Number(item.tax.amount) / 100 : 0;
            return sum + (quantity * unitPriceInCents * (1 + taxRate));
          }, 0);
          
          const finalTotalInCents = Math.max(Math.round(totalInCents), 1); // Minimum 1 cent
          
          // Convert cents to the target currency's smallest unit (e.g., wei for ETH)
          // For fiat (decimals=2), finalTotalInCents IS the smallest unit amount.
          // For USDC (decimals=6), multiply cents by 10^(6-2) = 10^4.
          // For ETH (decimals=18), multiply cents by 10^(18-2) = 10^16.
          let amountInSmallestUnit: bigint;
          if (decimals === 2) { // Fiat
            amountInSmallestUnit = BigInt(finalTotalInCents);
          } else {
            const exponent = decimals - 2;
            amountInSmallestUnit = BigInt(finalTotalInCents) * (BigInt(10) ** BigInt(exponent));
          }
          
          totalAmount = amountInSmallestUnit.toString();
          
          console.log('0xHypr', 'Amount conversion:', {
            totalInCents: totalInCents,
            finalTotalInCents: finalTotalInCents,
            amountInTokenUnits: totalAmount,
            equivalentInDollars: (finalTotalInCents / 100).toFixed(2), // For reference
            decimalsUsed: decimals
          });
        }
        
        // Generate ephemeral key for the invoice
        const ephemeralKey = await ephemeralKeyService.generateKey();
        
        // Create payment network parameters
        let paymentNetworkParams: any;
        // Determine Payment Network ID based on the selected currency type
        let paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID | undefined = undefined;
        if (selectedConfig.type === RequestLogicTypes.CURRENCY.ISO4217) {
          paymentNetworkId = ExtensionTypes.PAYMENT_NETWORK_ID.ANY_DECLARATIVE;
        } else if (selectedConfig.type === RequestLogicTypes.CURRENCY.ERC20) {
          paymentNetworkId = ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT;
        } else if (selectedConfig.type === RequestLogicTypes.CURRENCY.ETH) {
          paymentNetworkId = ExtensionTypes.PAYMENT_NETWORK_ID.NATIVE_TOKEN;
        }

        if (!paymentNetworkId) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Could not determine payment network ID.' });
        }

        // Build parameters based on the payment network ID
        if (paymentNetworkId === ExtensionTypes.PAYMENT_NETWORK_ID.ANY_DECLARATIVE) {
          // Fiat Parameters
          paymentNetworkParams = {
            id: ExtensionTypes.PAYMENT_NETWORK_ID.ANY_DECLARATIVE,
            parameters: {
              paymentInfo: input.bankDetails ?
                `Account Holder: ${input.bankDetails.accountHolder}\nIBAN: ${input.bankDetails.iban}\nBIC: ${input.bankDetails.bic}${input.bankDetails.bankName ? '\nBank: ' + input.bankDetails.bankName : ''}`
                : 'Bank details provided separately',
              refundInfo: '',
            },
          };
        } else if (paymentNetworkId === ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT) {
          // ERC20 Parameters
          paymentNetworkParams = {
            id: ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT, // Common for ERC20s
            parameters: {
              paymentNetworkName: selectedConfig.network,
              paymentAddress: paymentAddress,
              feeAddress: undefined, // Optional fee address
              feeAmount: undefined, // Optional fee amount
            },
          };
        } else if (paymentNetworkId === ExtensionTypes.PAYMENT_NETWORK_ID.NATIVE_TOKEN) {
          // Native Token Parameters
          paymentNetworkParams = {
            id: ExtensionTypes.PAYMENT_NETWORK_ID.NATIVE_TOKEN,
            parameters: {
              paymentNetworkName: selectedConfig.network,
              paymentAddress: paymentAddress,
            },
          };
        } else {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unsupported currency type for payment network parameters.' });
        }
        
        // Prepare parameters for createInvoiceRequest, adding paymentAddress conditionally
        const requestParams: any = {
          currency: selectedConfig,
          expectedAmount: totalAmount,
          contentData: contentData,
          paymentNetwork: paymentNetworkParams,
        };
        // Payment address is now part of paymentNetwork parameters for ERC20
        // Payer identity is inferred for Native ETH
        // Signer identity is used for Fiat
        requestParams.payer = {
          type: IdentityTypes.TYPE.ETHEREUM_ADDRESS,
          value: input.buyerInfo?.email ? input.buyerInfo.email : undefined, // Tentative: use buyer email if available
        };
        requestParams.payee = {
          type: IdentityTypes.TYPE.ETHEREUM_ADDRESS,
          value: paymentType === 'crypto' ? paymentAddress : userWallet.address, // Payee is Safe for Crypto, user's wallet for Fiat instructions
        };
        
        // Create the invoice request
        const requestResult = await createInvoiceRequest(
          requestParams,
          ephemeralKey,
          userWallet
        );

        const createResult = requestResult;
        
        // Store the request in our database
        const dbWalletAddress = paymentType === 'crypto' ? paymentAddress : userWallet?.address;
        if (dbWalletAddress) {
             try {
                console.log('0xHypr DEBUG - About to store request in database:', { // DEBUG logging
                  requestId: createResult.requestId, 
                  userId: userId, 
                  walletAddress: dbWalletAddress 
                  // ... other relevant debug info 
                 });
                 const savedRequest = await userRequestService.addRequest({
                    requestId: createResult.requestId,
                    userId: userId,
                    walletAddress: dbWalletAddress, // Use correct variable
                    role: 'seller',
                    description: contentData.invoiceItems?.[0]?.name || 'Invoice',
                    amount: formatUnits(BigInt(totalAmount), decimals), // Replaced ethers.utils.formatUnits, assuming totalAmount is a bigint string
                    currency: currencySymbol,
                    status: 'pending',
                    client: contentData.buyerInfo?.businessName || contentData.buyerInfo?.email || 'Unknown Client',
                  });
                // Use createResult and savedRequest correctly for logging
                console.log('0xHypr', 'Successfully stored request in database:', createResult.requestId, 'with ID:', savedRequest.id);
             } catch (dbError: any) { // Add type annotation for catch
                 console.error('0xHypr', 'Error storing request in database:', dbError);
             }
        } else {
            console.warn("0xHypr - Could not determine wallet address for DB storage. Skipping DB save.");
        }
        
        return {
          success: true,
          requestId: createResult.requestId,
          token: ephemeralKey.token,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error('0xHypr', 'Generic error creating invoice:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create invoice',
        });
      }
    }),
}); 