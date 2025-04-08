import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';
import { userProfileService } from '@/lib/user-profile-service';

export async function GET(req: NextRequest) {
  try {
    // Authenticate the user
    const userId = await getUserId();
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
    console.error('Error checking onboarding status:', error);
    return NextResponse.json(
      { error: 'Failed to check onboarding status' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate the user
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Complete onboarding
    await userProfileService.completeOnboarding(userId);
    
    // Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}