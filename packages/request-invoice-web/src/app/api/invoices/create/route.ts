import { NextRequest, NextResponse } from 'next/server';
import { addresses } from '../../wallet/addresses-store';

// Mock function for Request Network integration
const createRequestNetworkInvoice = async (invoiceData: any, paymentAddress: string) => {
  // In a real app, this would call the Request Network API
  // For now, we'll simulate a successful response
  const requestId = `req_${Math.random().toString(36).substring(2, 15)}`;
  const token = `tok_${Math.random().toString(36).substring(2, 15)}`;
  
  return {
    success: true,
    requestId,
    token,
  };
};

export async function POST(req: NextRequest) {
  try {
    const invoiceData = await req.json();
    
    if (!invoiceData) {
      return NextResponse.json(
        { error: 'Invalid invoice data' },
        { status: 400 }
      );
    }
    
    // Get the network from the invoice (default to gnosis)
    const network = invoiceData.network || 'gnosis';
    
    // Find the default payment address for this network
    const defaultAddress = addresses.find(a => a.network === network && a.isDefault);
    
    if (!defaultAddress) {
      return NextResponse.json(
        { error: 'No default payment address found for this network' },
        { status: 400 }
      );
    }
    
    // Create the invoice using Request Network
    const result = await createRequestNetworkInvoice(invoiceData, defaultAddress.address);
    
    if (!result.success) {
      throw new Error('Failed to create invoice on Request Network');
    }
    
    // Generate a URL for the invoice
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3050';
    const invoiceUrl = `${baseUrl}/invoice/${result.requestId}?token=${result.token}`;
    
    return NextResponse.json({
      success: true,
      requestId: result.requestId,
      token: result.token,
      url: invoiceUrl,
    });
    
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}