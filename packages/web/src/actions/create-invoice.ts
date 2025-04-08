'use server';

import { userWalletsTable, userProfilesTable } from "@/db/schema";
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { getUserId } from '@/lib/auth';
import { userRequestService } from '@/lib/user-request-service';
import { RequestNetwork, Types } from '@requestnetwork/request-client.js';
import { Web3SignatureProvider } from '@requestnetwork/web3-signature';
import { PaymentNetwork, PaymentNetworkFactory } from '@requestnetwork/payment-processor';
import { ethers } from 'ethers';
import type { RequestCreateParameters, Currency } from '@/lib/request-network';
import { z } from 'zod';

// Schema for CreateInvoiceParams
const CreateInvoiceSchema = z.object({
  // Basic Request Info
  contentType: z.string().default('invoice'), // Default 'invoice' so it's optional
  description: z.string().min(1, 'Description required').max(255),
  amount: z.string().min(1, 'Amount required'),
  currency: z.string().default('EURe'), // EURe by default
  // Client Info
  clientName: z.string().default(''), 
  clientEmail: z.string().default(''), 
  clientAddress: z.string().default(''),
  // Extra metadata
  dueDate: z.string().optional(),
  invoiceNumber: z.string().optional(),
  paymentTerms: z.string().optional(),
  taxAmount: z.string().optional(),
  taxRate: z.string().optional(),
  memo: z.string().optional(),
});

export type CreateInvoiceParams = z.infer<typeof CreateInvoiceSchema>;

/**
 * Creates a Request Network invoice
 */
export async function createInvoice(params: CreateInvoiceParams) {
  try {
    // Parse and validate params
    const validParams = CreateInvoiceSchema.parse(params);
    
    // Get user ID from auth
    const userId = await getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Get user profile (we need the email)
    const userProfile = await db
      .select()
      .from(userProfilesTable)
      .where(eq(userProfilesTable.clerkId, userId))
      .limit(1);

    if (userProfile.length === 0) {
      throw new Error('User profile not found');
    }

    const profile = userProfile[0];
    const email = profile.email;

    if (!email) {
      throw new Error('User email not found');
    }

    // Get user wallet
    const wallet = await db
      .select()
      .from(userWalletsTable)
      .where(eq(userWalletsTable.userId, userId))
      .limit(1);

    if (wallet.length === 0) {
      throw new Error('User wallet not found');
    }

    const privateKey = wallet[0].privateKey;
    
    // Create wallet provider for signing
    const provider = new ethers.providers.JsonRpcProvider(
      // Base Sepolia testnet
      "https://sepolia.base.org"
    );
    
    const signer = new ethers.Wallet(privateKey, provider);
    const signatureProvider = new Web3SignatureProvider(signer);
    
    // Set up RequestNetwork client
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: 'https://sigma-ethereum-api.request.network/api/v1',
      },
      signatureProvider,
    });
    
    // Convert amount to a valid amount with decimals
    const decimalAmount = parseFloat(validParams.amount);
    if (isNaN(decimalAmount)) {
      throw new Error('Invalid amount');
    }
    
    // Format the amount for Request Network
    // Convert to smallest unit (EURe 2 decimals, others 18)
    const decimals = validParams.currency === 'EURe' ? 2 : 18;
    const amountInSmallestUnit = Math.round(decimalAmount * (10 ** decimals)).toString();
    
    // Compose the currency object
    const currency: Currency = {
      type: 'ERC20',
      value: validParams.currency === 'EURe' 
        ? '0x9C1C23E60B72Bc88a043bf64aFdb16A02540Ae8f' // EURe on Base
        : '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
      network: 'base'
    };

    // Construct the payment details
    const requestCreateParameters: RequestCreateParameters = {
      requestInfo: {
        currency,
        expectedAmount: amountInSmallestUnit,
        payee: {
          type: 'ethereumAddress',
          value: wallet[0].address,
        },
        payer: {
          type: validParams.clientEmail ? 'email' : 'ethereumAddress',
          value: validParams.clientEmail || validParams.clientAddress, // Use email or address
        },
        timestamp: Math.floor(Date.now() / 1000),
      },
      paymentNetwork: {
        id: validParams.currency === 'EURe' 
          ? PaymentNetwork.ANY_TO_ERC20_PROXY
          : PaymentNetwork.ANY_TO_ERC20_PROXY,
        parameters: {
          paymentNetworkName: validParams.currency === 'EURe' 
            ? PaymentNetwork.ANY_TO_ERC20_PROXY
            : PaymentNetwork.ANY_TO_ERC20_PROXY,
          paymentAddress: wallet[0].address,
        }
      } as unknown as Types.IPaymentNetworkCreateParameters, // Type issue in the library
      contentData: {
        // Basic invoice details
        creationDate: new Date().toISOString(),
        invoiceNumber: validParams.invoiceNumber || `INV-${Date.now()}`,
        dueDate: validParams.dueDate,
        note: validParams.memo,
        amount: amountInSmallestUnit,
        currency: {
          type: 'ERC20',
          value: validParams.currency === 'EURe' 
            ? '0x9C1C23E60B72Bc88a043bf64aFdb16A02540Ae8f' // EURe on Base
            : '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
          network: 'base'
        },
        // Invoice details
        paymentTerms: validParams.paymentTerms || 'Due on receipt',
        tax: {
          amount: validParams.taxAmount,
          rate: validParams.taxRate,
        },
        // Roles
        sellerInfo: {
          name: profile.businessName || email,
          firstName: '',
          lastName: '',
          email: email,
          address: {
            streetAddress: '',
            extendedAddress: '',
            locality: '',
            region: '',
            postalCode: '',
            country: '',
          },
          taxRegistration: '',
          businessName: profile.businessName,
        },
        buyerInfo: {
          name: validParams.clientName,
          email: validParams.clientEmail,
          address: {
            streetAddress: validParams.clientAddress,
            extendedAddress: '',
            locality: '',
            region: '',
            postalCode: '',
            country: '',
          },
          businessName: validParams.clientName,
        },
        // Additional metadata
        invoiceItems: [
          {
            name: validParams.description,
            quantity: 1,
            unitPrice: amountInSmallestUnit,
            taxPercent: validParams.taxRate ? parseFloat(validParams.taxRate) : 0,
          }
        ],
        miscellaneous: {
          clientNote: validParams.memo,
        },
      },
      topics: [],
      contentType: validParams.contentType,
      meta: {
        format: 'rnf_invoice',
        version: '0.0.3',
      },
    };
    
    // Create the request
    const requestCreateResult = await requestClient.createRequest(requestCreateParameters);
    await requestCreateResult.waitForConfirmation();

    // Get request data
    const request = await requestClient.fromRequestId(requestCreateResult.requestId);
    
    // Store in our database too
    try {
      await userRequestService.addRequest({
        requestId: requestCreateResult.requestId,
        userId: userId,
        walletAddress: wallet[0].address,
        role: 'seller', // User is creating the request, so they're the seller
        description: validParams.description,
        amount: validParams.amount,
        currency: validParams.currency,
        status: 'pending',
        client: validParams.clientName,
      });
    } catch (dbError) {
      console.error('Error storing request in database:', dbError);
      // Don't throw error here, as the request was already created in Request Network
    }
    
    return {
      requestId: requestCreateResult.requestId,
      url: `/invoice/${requestCreateResult.requestId}`,
      request: request.getData(),
    };
  } catch (error) {
    console.error('Error creating invoice:', error);
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw new Error(`Validation error: ${firstError.path.join('.')} - ${firstError.message}`);
    }
    throw error;
  }
}                