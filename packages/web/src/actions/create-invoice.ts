'use server';

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

// USDC on Base mainnet configuration
const USDC_BASE_CONFIG = {
  type: RequestLogicTypes.CURRENCY.ERC20,
  value: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base USDC
  network: 'base' as const,
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
interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: string;
  currency: string;
  tax: {
    type: "percentage";
    amount: string;
  };
}

interface InvoiceData {
  meta: {
    format: string;
    version: string;
  };
  network?: string; // Optional, will be removed before sending to Request Network
  creationDate: string;
  invoiceNumber: string;
  sellerInfo: {
    businessName: string;
    email: string;
    address?: {
      'street-address'?: string;
      locality?: string;
      'postal-code'?: string;
      'country-name'?: string;
    };
  };
  buyerInfo: {
    businessName?: string;
    email: string;
    address?: {
      'street-address'?: string;
      locality?: string;
      'postal-code'?: string;
      'country-name'?: string;
    };
  };
  invoiceItems: InvoiceItem[];
  paymentTerms?: {
    dueDate?: string;
  };
  note?: string;
  terms?: string;
  paymentType?: 'crypto' | 'fiat';
  currency: string;
  bankDetails?: BankDetails;
  primarySafeAddress?: string; // ADDED: Expected from client for crypto
}

interface BankDetails {
  accountHolder: string;
  iban: string;
  bic: string;
  bankName?: string;
}

export async function createInvoice(invoiceData: InvoiceData, userId: string): Promise<{ success: boolean; error?: string; requestId?: string; token?: string }> {
  // Validate userId
  if (!userId) {
    console.error("0xHypr - createInvoice called without userId.");
    return { success: false, error: 'User ID is required.' };
  }

  try {
    console.log('0xHypr', `Creating invoice for user ${userId} with data:`, JSON.stringify(invoiceData, null, 2));

    // Determine payment type and currency configuration
    const paymentType = invoiceData.paymentType || 'crypto';
    let currencyConfig;
    let currencySymbol;
    
    // Extract network from form data if present, but don't include it in content data
    const network = invoiceData.network ? invoiceData.network : 'gnosis';
    delete invoiceData.network; // Remove network from content data
    
    // Set currency config based on selected network/currency and payment type
    if (paymentType === 'fiat') {
      // Use fiat currency with ANY_DECLARATIVE payment network
      const currency = invoiceData.currency || 'EUR';
      if (!FIAT_CURRENCIES[currency as keyof typeof FIAT_CURRENCIES]) {
        throw new Error(`Unsupported fiat currency: ${currency}`);
      }
      currencyConfig = FIAT_CURRENCIES[currency as keyof typeof FIAT_CURRENCIES];
      currencySymbol = currency;
      console.log('0xHypr', `Using ${currency} with ANY_DECLARATIVE payment network`);
    } else if (network === 'ethereum') {
      currencyConfig = USDC_MAINNET_CONFIG;
      currencySymbol = 'USDC';
      console.log('0xHypr', 'Using USDC on Ethereum mainnet');
    } else if (network === 'base') {
      currencyConfig = USDC_BASE_CONFIG;
      currencySymbol = 'USDC';
      console.log('0xHypr', 'Using USDC on Base mainnet');
    } else {
      // Default to EURe on Gnosis for crypto payments
      currencyConfig = EURE_CONFIG;
      currencySymbol = 'EURe';
      console.log('0xHypr', 'Using EURe on Gnosis Chain');
    }
    
    // Get user's wallet (for signing) using the passed userId
    let userWallet: { address: string; privateKey: string; publicKey: string } | undefined = undefined;
    let paymentAddress = '';
    
    try {
      // Get user wallet for signing
      const wallet = await userProfileService.getOrCreateWallet(userId);
      userWallet = { address: wallet.address, privateKey: wallet.privateKey, publicKey: wallet.publicKey };
      console.log('0xHypr', 'Using wallet for signing:', wallet.address);

      // --- MODIFIED: Validate client-provided primary Safe address --- 
      if (paymentType === 'crypto') {
        if (!invoiceData.primarySafeAddress || !ethers.utils.isAddress(invoiceData.primarySafeAddress)) {
          throw new Error('Missing or invalid primary Safe address provided for crypto payment.');
        }
        paymentAddress = invoiceData.primarySafeAddress;
        console.log('0xHypr', `Using provided primary Safe address for ${network} ${currencySymbol} payment:`, paymentAddress);
      } else {
         console.log('0xHypr', 'Fiat payment selected, payment address not needed.');
      }
      // --- END MODIFICATION ---

    } catch (error) {
      console.error('0xHypr', 'Error getting wallet or validating Safe address:', error);
      throw new Error(`Setup error: ${error instanceof Error ? error.message : error}`);
    }
    
    // Calculate total amount from invoice items
    let totalAmount = '100'; // Default minimum amount to ensure it's always positive
    if (invoiceData.invoiceItems && invoiceData.invoiceItems.length > 0) {
      const total = invoiceData.invoiceItems.reduce((sum: number, item: InvoiceItem) => {
        const quantity = Number(item.quantity) || 0;
        const unitPrice = Number(item.unitPrice) || 0;
        const taxRate = item.tax?.amount ? Number(item.tax.amount) / 100 : 0;
        return sum + (quantity * unitPrice * (1 + taxRate));
      }, 0);
      
      // Ensure the amount is positive and at least 100 cents (1 EUR/USD)
      const finalTotal = Math.max(Math.round(total), 100);
      
      // Convert to appropriate units based on currency decimals
      const amountInTokenUnits = network === 'ethereum' || network === 'base'
        ? ethers.utils.parseUnits((finalTotal / 100).toString(), 6) // USDC has 6 decimals
        : ethers.utils.parseUnits((finalTotal / 100).toString(), 18); // EURe has 18 decimals
      
      totalAmount = amountInTokenUnits.toString();
      
      console.log('0xHypr', 'Amount conversion:', {
        originalTotal: total,
        finalTotal,
        amountInTokenUnits: totalAmount,
        amountIn: (finalTotal / 100).toFixed(2)
      });
    }
    
    // Generate ephemeral key for the invoice
    const ephemeralKey = await ephemeralKeyService.generateKey();
    
    // --- RE-ADDED: Create paymentNetworkParams --- 
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
      const bankDetails = invoiceData.bankDetails;
      const formattedFiatAmount = ethers.utils.formatUnits(totalAmount, 2); // Fiat uses 2 decimals for display
      const paymentInstruction = bankDetails ? 
        `Please pay ${formattedFiatAmount} ${currencyConfig.value} to:\nAccount Holder: ${bankDetails.accountHolder}\nIBAN: ${bankDetails.iban}\nBIC/SWIFT: ${bankDetails.bic}${bankDetails.bankName ? `\nBank: ${bankDetails.bankName}` : ''}` 
        : `Please pay ${formattedFiatAmount} ${currencyConfig.value} via bank transfer.`;
      
      paymentNetworkParams = {
        id: currencyConfig.paymentNetworkId,
        parameters: {
          paymentInstruction,
        },
      };
    }
    // --- END RE-ADDED SECTION ---
    
    // Create the invoice request parameters conditionally
    const requestParams: any = {
        currency: currencyConfig,
        expectedAmount: totalAmount,
        contentData: invoiceData,
        paymentNetwork: paymentNetworkParams,
      };

    if (paymentType === 'crypto') {
        requestParams.paymentAddress = paymentAddress; // Add only if crypto
    }

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
       // ... (Save to DB using dbWalletAddress)
        try {
          await userRequestService.addRequest({
            requestId: createResult.requestId,
            userId: userId,
            walletAddress: dbWalletAddress, // Now guaranteed to be string here
            role: 'seller', 
            description: invoiceData.invoiceItems?.[0]?.name || 'Invoice',
            amount: network === 'ethereum' || network === 'base'
              ? ethers.utils.formatUnits(totalAmount, 6)
              : ethers.utils.formatUnits(totalAmount, 18),
            currency: currencySymbol,
            status: 'pending',
            client: invoiceData.buyerInfo?.businessName || invoiceData.buyerInfo?.email || 'Unknown Client',
          });
          console.log('0xHypr', 'Successfully stored request in DB');
        } catch (dbError) {
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
    console.error('0xHypr', 'Error creating invoice:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create invoice',
    };
  }
}                