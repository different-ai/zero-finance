import { NextRequest, NextResponse } from 'next/server';
import { createInvoiceRequest } from '@/lib/request-network';
import { RequestLogicTypes, ExtensionTypes } from '@requestnetwork/types';
import { ephemeralKeyService } from '@/lib/ephemeral-key-service';

// Define currency configurations similar to desktop app
const CURRENCY_CONFIG: Record<string, {
  type: RequestLogicTypes.CURRENCY;
  value: string;
  network: 'xdai' | 'mainnet';
  paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID;
  decimals?: number;
}> = {
  EUR: {
    type: RequestLogicTypes.CURRENCY.ISO4217,
    value: 'EUR',
    network: 'xdai',
    paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
  },
  USDC: {
    type: RequestLogicTypes.CURRENCY.ERC20,
    value: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC on Ethereum Mainnet
    network: 'mainnet',
    paymentNetworkId: ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
    decimals: 6,
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();
    console.log('Form data received:', JSON.stringify(formData, null, 2));
    
    if (!formData) {
      return NextResponse.json(
        { error: 'Invalid invoice data' },
        { status: 400 }
      );
    }
    
    // Determine currency and network
    const currencyCode = formData.currency || 'EUR';
    
    // Get currency config
    const currencyConfig = CURRENCY_CONFIG.EUR
    if (!currencyConfig) {
      return NextResponse.json(
        { error: `Unsupported currency: ${currencyCode}` },
        { status: 400 }
      );
    }
    
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
        email: formData.sellerInfo?.email || 'test@example.com',
      },
      invoiceItems: formData.invoiceItems || [{
        name: 'Test Item',
        quantity: 1,
        unitPrice: '100',
        currency: currencyCode,
        tax: { type: 'percentage', amount: '0' },
      }],
      paymentTerms: formData.paymentTerms,
    };
    
    // Create the payment address
    const paymentAddress = "0x58907D99768c34c9da54e5f94d47dDb150b7da82"; // This would be the address for receiving payments
    
    // Calculate total amount
    const totalAmount = '100'; // In a real implementation, calculate from items
    
    // Very explict currency object to match request-network exactly
    
    // Prepare the request data in the exact format needed by the library
    const requestData = {
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
    };
    
    console.log('Prepared request data:', JSON.stringify(requestData, null, 2));
    
    // Create the invoice using Request Network
    const result = await createInvoiceRequest(requestData);
    // generateKey
    const token = await ephemeralKeyService.generateKey();

    
    if (!result.success) {
      throw new Error('Failed to create invoice on Request Network');
    }
    
    // Generate a URL for the invoice
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3050';
    const invoiceUrl = `${baseUrl}/invoice/${result.requestId}?token=${token.token}`;
    
    return NextResponse.json({
      success: true,
      requestId: result.requestId,
      token: result.token,
      url: invoiceUrl,
    });
    
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}