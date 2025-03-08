'use server';

import { createInvoiceRequest } from '@/lib/request-network';
import { RequestLogicTypes, ExtensionTypes } from '@requestnetwork/types';
import { ephemeralKeyService } from '@/lib/ephemeral-key-service';
import { ethers } from 'ethers';
import { auth } from '@clerk/nextjs/server';
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
}

export async function createInvoice(invoiceData: InvoiceData) {
  try {
    console.log('0xHypr', 'Creating invoice with data:', JSON.stringify(invoiceData, null, 2));
    
    // Get authenticated user
    const { userId } = await auth();
    if (!userId) {
      throw new Error('Authentication required');
    }
    
    // Always use EURe on Gnosis Chain
    const currencyConfig = EURE_CONFIG;
    
    // Extract network from form data if present, but don't include it in content data
    const network = invoiceData.network ? invoiceData.network : 'gnosis';
    delete invoiceData.network; // Remove network from content data
    
    // Get user's wallet and payment address
    let userWallet: { address: string; privateKey: string; publicKey: string } | undefined = undefined;
    let paymentAddress = '';
    
    try {
      // Get or create user wallet for signing
      const wallet = await userProfileService.getOrCreateWallet(userId);
      userWallet = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        publicKey: wallet.publicKey
      };
      
      // Get payment address from the wallet addresses store
      // First try to get the default payment address for Gnosis Chain
      const gnosisAddresses = addresses.filter(addr => addr.network === 'gnosis' && addr.isDefault);
      if (gnosisAddresses.length > 0) {
        paymentAddress = gnosisAddresses[0].address;
        console.log('0xHypr', 'Using configured Gnosis payment address:', paymentAddress);
      } else {
        // Fall back to the user profile's payment address
        paymentAddress = await userProfileService.getPaymentAddress(userId);
        console.log('0xHypr', 'Using wallet payment address (fallback):', paymentAddress);
      }
      
      console.log('0xHypr', 'Using wallet for signing:', wallet.address);
      console.log('0xHypr', 'Using payment address for receiving:', paymentAddress);
    } catch (error) {
      console.error('0xHypr', 'Error getting wallet/payment address:', error);
      // Use a default payment address if we couldn't get the user's
      paymentAddress = "0x58907D99768c34c9da54e5f94d47dDb150b7da82";
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
      
      // Ensure the amount is positive and at least 100 cents (1 EUR)
      const finalTotal = Math.max(Math.round(total), 100);
      
      // Convert from cents to wei (1 EUR = 100 cents = 1e18 wei)
      // First convert cents to EUR (divide by 100)
      // Then convert EUR to wei (multiply by 1e18)
      const amountInWei = ethers.utils.parseUnits((finalTotal / 100).toString(), 18);
      totalAmount = amountInWei.toString();
      
      console.log('0xHypr', 'Amount conversion:', {
        originalTotal: total,
        finalTotal,
        amountInWei: totalAmount,
        amountInEUR: (finalTotal / 100).toFixed(2)
      });
    }
    
    // Generate ephemeral key for the invoice
    const ephemeralKey = await ephemeralKeyService.generateKey();
    
    // Create the invoice request
    const request = await createInvoiceRequest(
      {
        currency: currencyConfig,
        expectedAmount: totalAmount,
        paymentAddress,
        contentData: invoiceData,
        paymentNetwork: {
          id: currencyConfig.paymentNetworkId,
          parameters: {
            paymentNetworkName: currencyConfig.network,
            paymentAddress,
          },
        },
      },
      ephemeralKey,
      userWallet // Include user wallet for signing
    );
    
    // Store the request in our database for easy retrieval
    const walletAddress = userWallet?.address || paymentAddress;
    
    // Enhanced debugging for request storage
    console.log('0xHypr DEBUG - About to store request in database:', {
      requestId: request.requestId,
      userId,
      walletAddress,
      invoiceData: {
        description: invoiceData.invoiceItems?.[0]?.name || 'Invoice',
        amount: ethers.utils.formatUnits(totalAmount, 18),
        currency: 'EURe',
        client: invoiceData.buyerInfo?.businessName || invoiceData.buyerInfo?.email || 'Unknown Client',
      }
    });
    
    try {
      const savedRequest = await userRequestService.addRequest({
        requestId: request.requestId,
        userId: userId,
        walletAddress,
        role: 'seller', // The creator is always the seller
        description: invoiceData.invoiceItems?.[0]?.name || 'Invoice',
        amount: ethers.utils.formatUnits(totalAmount, 18),
        currency: 'EURe',
        status: 'pending',
        client: invoiceData.buyerInfo?.businessName || invoiceData.buyerInfo?.email || 'Unknown Client',
      });
      console.log('0xHypr', 'Successfully stored request in database:', request.requestId, 'with ID:', savedRequest.id);
    } catch (error) {
      console.error('0xHypr', 'Error storing request in database:', error);
      // Log the details of what we tried to store for debugging
      if (error instanceof Error) {
        console.error('0xHypr DEBUG - Error details:', {
          errorName: error.name,
          errorMessage: error.message,
          errorStack: error.stack,
        });
      }
      // Continue anyway, as the request was created successfully
    }
    
    return {
      success: true,
      requestId: request.requestId,
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