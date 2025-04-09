import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../create-router';
import { TRPCError } from '@trpc/server';
import { sql } from '@vercel/postgres';
import { createInvoiceRequest } from '@/lib/request-network';
import { RequestLogicTypes, ExtensionTypes } from '@requestnetwork/types';
import { ephemeralKeyService } from '@/lib/ephemeral-key-service';
import { ethers } from 'ethers';
import { userProfileService } from '@/lib/user-profile-service';
import { userRequestService } from '@/lib/user-request-service';
import { addresses } from '@/app/api/wallet/addresses-store';

// Fixed EURe currency configuration
const EURE_CONFIG = {
  type: RequestLogicTypes.CURRENCY.ERC20,
  value: '0xcB444e90D8198415266c6a2724b7900fb12FC56E', // EURe token address on Gnosis Chain
  network: 'xdai' as const,
  paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
  decimals: 18,
};

// USDC on Ethereum mainnet configuration
const USDC_MAINNET_CONFIG = {
  type: RequestLogicTypes.CURRENCY.ERC20,
  value: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC token address on Ethereum Mainnet
  network: 'mainnet' as const,
  paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
  decimals: 6,
};

// Fiat currency configurations
const FIAT_CURRENCIES = {
  EUR: {
    type: RequestLogicTypes.CURRENCY.ISO4217,
    value: 'EUR',
    network: 'mainnet' as const,
    paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID.ANY_DECLARATIVE,
  },
  USD: {
    type: RequestLogicTypes.CURRENCY.ISO4217,
    value: 'USD',
    network: 'mainnet' as const,
    paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID.ANY_DECLARATIVE,
  },
  GBP: {
    type: RequestLogicTypes.CURRENCY.ISO4217,
    value: 'GBP',
    network: 'mainnet' as const,
    paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID.ANY_DECLARATIVE,
  },
};

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
  paymentType: z.enum(['crypto', 'fiat']).optional(),
  currency: z.string(),
  bankDetails: bankDetailsSchema.optional(),
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
        const paymentType = input.paymentType || 'crypto';
        const network = input.network || (paymentType === 'crypto' ? 'gnosis' : 'mainnet');

        // Prepare contentData: clone input and remove fields not part of RN schema
        const contentData: any = { ...input };
        delete contentData.network;
        delete contentData.paymentType;
        delete contentData.currency; // <<< REMOVE TOP-LEVEL CURRENCY FIELD
        if (paymentType === 'crypto') {
          delete contentData.bankDetails;
        }
        console.log('0xHypr', 'Prepared contentData for Request Network:', JSON.stringify(contentData, null, 2));

        let currencyConfig: any; // Use any for simplicity here due to different shapes
        let currencySymbol: string;
        let decimals: number; // Define decimals variable here

        if (paymentType === 'fiat') {
          const currency = input.currency || 'EUR';
          if (!FIAT_CURRENCIES[currency as keyof typeof FIAT_CURRENCIES]) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: `Unsupported fiat currency: ${currency}` });
          }
          currencyConfig = FIAT_CURRENCIES[currency as keyof typeof FIAT_CURRENCIES];
          currencySymbol = currency;
          decimals = 2; // Fiat always uses 2 decimals
          console.log('0xHypr', `Using ${currency} with ANY_DECLARATIVE payment network`);
        } else if (network === 'ethereum') {
          currencyConfig = USDC_MAINNET_CONFIG;
          currencySymbol = 'USDC';
          decimals = currencyConfig.decimals; // Crypto uses config decimals
          console.log('0xHypr', 'Using USDC on Ethereum mainnet');
        } else {
          currencyConfig = EURE_CONFIG;
          currencySymbol = 'EURe';
          decimals = currencyConfig.decimals; // Crypto uses config decimals
          console.log('0xHypr', 'Using EURe on Gnosis Chain (default crypto)');
        }

        // Get user's wallet and payment address
        let userWallet: { address: string; privateKey: string; publicKey: string } | undefined = undefined;
        let paymentAddress = '';
        
        try {
          const wallet = await userProfileService.getOrCreateWallet(userId);
          userWallet = {
            address: wallet.address,
            privateKey: wallet.privateKey,
            publicKey: wallet.publicKey
          };
          
          const networkAddresses = addresses.filter(addr => addr.network === network && addr.isDefault);
          if (networkAddresses.length > 0) {
            paymentAddress = networkAddresses[0].address;
            console.log('0xHypr', `Using configured ${network} payment address for ${currencySymbol}:`, paymentAddress);
          } else {
            paymentAddress = await userProfileService.getPaymentAddress(userId);
            console.log('0xHypr', `Using profile payment address (fallback) for ${network}:`, paymentAddress);
          }
          
          console.log('0xHypr', `Creating invoice on ${network} with ${currencySymbol} currency`);
          console.log('0xHypr', 'Using wallet for signing:', wallet.address);
          console.log('0xHypr', 'Using payment address for receiving:', paymentAddress);
        } catch (error) {
          console.error('0xHypr', 'Error getting wallet/payment address:', error);
          // Use a default payment address if we couldn't get the user's
          // Consider making this configurable or throwing an error
          paymentAddress = "0x58907D99768c34c9da54e5f94d47dDb150b7da82"; // TODO: Replace default fallback
        }
        
        // Calculate total amount from invoice items
        let totalAmount = '100'; // Default minimum amount
        if (contentData.invoiceItems && contentData.invoiceItems.length > 0) {
          const total = contentData.invoiceItems.reduce((sum: number, item: any) => {
            const quantity = Number(item.quantity) || 0;
            const unitPrice = Number(item.unitPrice) || 0;
            const taxRate = item.tax?.amount ? Number(item.tax.amount) / 100 : 0;
            return sum + (quantity * unitPrice * (1 + taxRate));
          }, 0);
          
          const finalTotal = Math.max(Math.round(total), 100); // Ensure minimum amount
          
          // Use the determined decimals value
          const amountInTokenUnits = ethers.utils.parseUnits((finalTotal / 100).toString(), decimals);
          
          totalAmount = amountInTokenUnits.toString();
          
          console.log('0xHypr', 'Amount conversion:', {
            originalTotal: total,
            finalTotal,
            amountInTokenUnits: totalAmount,
            amountIn: (finalTotal / 100).toFixed(2),
            decimalsUsed: decimals
          });
        }
        
        // Generate ephemeral key for the invoice
        const ephemeralKey = await ephemeralKeyService.generateKey();
        
        // Create payment network parameters
        let paymentNetworkParams: any;
        if (paymentType === 'crypto') {
          paymentNetworkParams = {
            id: currencyConfig.paymentNetworkId,
            parameters: {
              paymentNetworkName: currencyConfig.network,
              paymentAddress,
            },
          };
        } else {
          const bankDetails = input.bankDetails; // Use original input for bank details
          // Use 2 decimals for formatting fiat amount in instructions
          const formattedFiatAmount = ethers.utils.formatUnits(totalAmount, 2);
          const paymentInstruction = bankDetails ? 
            `Please pay ${formattedFiatAmount} ${currencyConfig.value} to the following bank account:\nAccount Holder: ${bankDetails.accountHolder}\nIBAN: ${bankDetails.iban}\nBIC/SWIFT: ${bankDetails.bic}${bankDetails.bankName ? `\nBank: ${bankDetails.bankName}` : ''}` 
            : `Please pay ${formattedFiatAmount} ${currencyConfig.value} via bank transfer.`;
          
          paymentNetworkParams = {
            id: currencyConfig.paymentNetworkId,
            parameters: {
              paymentInstruction,
            },
          };
        }
        
        // Prepare parameters for createInvoiceRequest
        const requestParams: any = {
          currency: currencyConfig,
          expectedAmount: totalAmount,
          contentData: contentData, // Use the cleaned contentData
          paymentNetwork: paymentNetworkParams,
        };
        // Conditionally add paymentAddress only for crypto payments
        if (paymentType === 'crypto') {
           requestParams.paymentAddress = paymentAddress;
        }
        
        // Create the invoice request
        const request = await createInvoiceRequest(
          requestParams,
          ephemeralKey,
          userWallet // Include user wallet for signing
        );
        
        // Store the request in our database
        const walletAddress = userWallet?.address || paymentAddress;
        try {
          // Use the determined decimals value for formatting db amount
          const savedRequest = await userRequestService.addRequest({
            requestId: request.requestId,
            userId: userId,
            walletAddress,
            role: 'seller',
            description: contentData.invoiceItems?.[0]?.name || 'Invoice',
            amount: ethers.utils.formatUnits(totalAmount, decimals),
            currency: currencySymbol,
            status: 'pending',
            client: contentData.buyerInfo?.businessName || contentData.buyerInfo?.email || 'Unknown Client',
          });
          console.log('0xHypr', 'Successfully stored request in database:', request.requestId, 'with ID:', savedRequest.id);
        } catch (error) {
          console.error('0xHypr', 'Error storing request in database:', error);
        }
        
        return {
          success: true,
          requestId: request.requestId,
          token: ephemeralKey.token,
        };
      } catch (error) {
        console.error('0xHypr', 'Error creating invoice:', error);
        // Check for specific Request Network errors if possible
        if (error instanceof Error && error.message.includes('additionalProperties')) {
           throw new TRPCError({
             code: 'BAD_REQUEST',
             message: `Invoice data validation failed: ${error.message}`,
             cause: error,
           });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create invoice',
        });
      }
    }),
}); 