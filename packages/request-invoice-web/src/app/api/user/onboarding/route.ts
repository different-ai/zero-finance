import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
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

    // Check if the user has completed onboarding
    const hasCompletedOnboarding = await userProfileService.hasCompletedOnboarding(userId);
    
    return NextResponse.json({ hasCompletedOnboarding });
  } catch (error) {
    console.error('0xHypr', 'Error checking onboarding status:', error);
    return NextResponse.json(
      { error: 'Failed to check onboarding status' },
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

    const body = await req.json();
    
    // If a payment address is provided, update it
    if (body.paymentAddress) {
      // Validate the address is a valid Ethereum address
      if (!ethers.utils.isAddress(body.paymentAddress)) {
        return NextResponse.json(
          { error: 'Invalid Ethereum address' },
          { status: 400 }
        );
      }
      
      await userProfileService.updatePaymentAddress(userId, body.paymentAddress);
    }
    
    // Mark onboarding as complete
    await userProfileService.completeOnboarding(userId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('0xHypr', 'Error completing onboarding:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}