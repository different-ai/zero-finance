import { NextRequest, NextResponse } from 'next/server';
import { getAuth, currentUser } from '@clerk/nextjs/server';
import { userProfileService } from '@/lib/user-profile-service';
import { ethers } from 'ethers';

export async function GET(req: NextRequest) {
  try {
    // Authenticate the user
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get the payment address
    const paymentAddress = await userProfileService.getPaymentAddress(userId);
    
    return NextResponse.json({ paymentAddress });
  } catch (error) {
    console.error('0xHypr', 'Error getting payment address:', error);
    return NextResponse.json(
      { error: 'Failed to get payment address' },
      { status: 500 }
    );
  }
}

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

    // Get the request body
    const body = await req.json();
    if (!body || !body.paymentAddress) {
      return NextResponse.json(
        { error: 'Payment address is required' },
        { status: 400 }
      );
    }

    const { paymentAddress } = body;

    // Validate the address is a valid Ethereum address
    if (!ethers.utils.isAddress(paymentAddress)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address' },
        { status: 400 }
      );
    }

    // Update the payment address
    await userProfileService.updatePaymentAddress(userId, paymentAddress);
    
    return NextResponse.json({ success: true, paymentAddress });
  } catch (error) {
    console.error('0xHypr', 'Error updating payment address:', error);
    return NextResponse.json(
      { error: 'Failed to update payment address' },
      { status: 500 }
    );
  }
}