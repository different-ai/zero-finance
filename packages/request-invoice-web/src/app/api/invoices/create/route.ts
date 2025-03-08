import { NextRequest, NextResponse } from 'next/server';
import { createInvoiceRequest } from '@/lib/request-network';
import { RequestLogicTypes, ExtensionTypes } from '@requestnetwork/types';
import { ephemeralKeyService } from '@/lib/ephemeral-key-service';
import { ethers } from 'ethers';
import { getAuth, currentUser } from '@clerk/nextjs/server';
import { userProfileService } from '@/lib/user-profile-service';

interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: string;
  currency: string;
  tax?: {
    type: string;
    amount: string;
  };
}

// Fixed EURe currency configuration
const EURE_CONFIG = {
  type: RequestLogicTypes.CURRENCY.ERC20,
  value: '0xcB444e90D8198415266c6a2724b7900fb12FC56E', // EURe token address on Gnosis Chain
  network: 'xdai' as const,
  paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
  decimals: 18,
};

export async function POST(req: NextRequest) {
  try {
    // Authenticate the user
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get the current user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const formData = await req.json();
    console.log('Form data received:', JSON.stringify(formData, null, 2));
    
    if (!formData) {
      return NextResponse.json(
        { error: 'Invalid invoice data' },
        { status: 400 }
      );
    }
    
    // Always use EURe on Gnosis Chain
    const currencyConfig = EURE_CONFIG;
    
    // Get user email
    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      );
    }

    // Get or create user profile
    const userProfile = await userProfileService.getOrCreateProfile(userId, userEmail);
    
    // Get user wallet for signing the request
    let userWallet: { address: string; privateKey: string; publicKey: string } | undefined = undefined;
    if (userProfile.defaultWalletId) {
      try {
        const wallet = await userProfileService.getOrCreateWallet(userId);
        
        // Log detailed wallet information for debugging
        console.log('0xHypr DEBUG - Wallet details:', {
          address: wallet.address,
          publicKey: wallet.publicKey.substring(0, 20) + '...',
          hasPrivateKey: !!wallet.privateKey,
          privateKeyStart: wallet.privateKey.substring(0, 10) + '...',
          id: wallet.id,
          isDefault: wallet.isDefault,
        });
        
        userWallet = {
          address: wallet.address,
          privateKey: wallet.privateKey,
          publicKey: wallet.publicKey
        };
        console.log('0xHypr', 'Using existing wallet:', wallet.address);
      } catch (error) {
        console.error('0xHypr DEBUG - Error getting wallet:', error);
        console.error('0xHypr', 'Error getting wallet, will create a new one:', error);
      }
    } else {
      console.log('0xHypr DEBUG - No default wallet ID found in profile, will create a new wallet');
    }
    
    // Get the payment address for receiving payments
    const paymentAddress = await userProfileService.getPaymentAddress(userId);
    console.log('0xHypr', 'Using payment address:', paymentAddress);

    // Create invoice content data object
    const invoiceContent = formData.contentData || {
      meta: {
        format: 'rnf_invoice',
        version: '0.0.3',
      },
      creationDate: new Date().toISOString(),
      invoiceNumber: `INV-${Date.now()}`,
      sellerInfo: {
        businessName: formData.sellerInfo?.businessName || 'Default Business',
        email: userEmail, // Use the authenticated user's email
      },
      invoiceItems: formData.invoiceItems || [{
        name: 'Test Item',
        quantity: 1,
        unitPrice: '100',
        currency: 'EURe',
        tax: { type: 'percentage', amount: '0' },
      }],
      paymentTerms: formData.paymentTerms,
    };
    
    // Calculate total amount from invoice items
    let totalAmount = '100'; // Default minimum amount to ensure it's always positive
    if (invoiceContent.invoiceItems && invoiceContent.invoiceItems.length > 0) {
      const total = invoiceContent.invoiceItems.reduce((sum: number, item: InvoiceItem) => {
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
    
    // Create the invoice request, using the user's wallet if available
    const request = await createInvoiceRequest(
      {
        currency: currencyConfig,
        expectedAmount: totalAmount,
        paymentAddress,
        contentData: invoiceContent,
        paymentNetwork: {
          id: currencyConfig.paymentNetworkId,
          parameters: {
            paymentNetworkName: currencyConfig.network,
            paymentAddress,
          },
        },
      },
      ephemeralKey,
      userWallet // Pass the user wallet (will be null if not available)
    );
    
    return NextResponse.json({
      requestId: request.requestId,
      token: ephemeralKey.token,
    });
  } catch (error) {
    console.error('0xHypr', 'Error creating invoice:', error);
    
    // Provide more specific error messages based on the error type
    let errorMessage = 'Failed to create invoice';
    let statusCode = 500;
    
    if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes('database') || error.message.includes('db')) {
        errorMessage = 'Database error occurred while creating invoice';
      } else if (error.message.includes('wallet')) {
        errorMessage = 'Error with user wallet while creating invoice';
      } else if (error.message.includes('authentication') || error.message.includes('auth')) {
        errorMessage = 'Authentication error';
        statusCode = 401;
      } else if (error.message.includes('request network') || error.message.includes('timeout')) {
        errorMessage = 'Error connecting to Request Network';
      }
      // Include original error message in development
      if (process.env.NODE_ENV === 'development') {
        errorMessage += `: ${error.message}`;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}