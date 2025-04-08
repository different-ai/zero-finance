import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';
import { userProfileService } from '@/lib/user-profile-service';
import { userProfilesTable } from '@/db/schema';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

/**
 * Debug endpoint to view wallet information
 */
export async function GET(req: NextRequest) {
  try {
    // Get authenticated user ID
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({
        error: 'Unauthorized'
      }, { status: 401 });
    }

    // Get user profile
    const profile = await db
      .select()
      .from(userProfilesTable)
      .where(eq(userProfilesTable.clerkId, userId));

    if (profile.length === 0) {
      return NextResponse.json({
        error: 'User profile not found'
      }, { status: 404 });
    }

    // Get user wallet
    const wallet = await userProfileService.getOrCreateWallet(userId);

    // Return wallet information (except private key)
    return NextResponse.json({
      wallet: {
        address: wallet.address,
        publicKey: wallet.publicKey,
        // Don't return the private key!
      },
      profile: {
        id: profile[0].id,
        email: profile[0].email,
        businessName: profile[0].businessName,
        clerkId: profile[0].clerkId,
        paymentAddress: profile[0].paymentAddress,
        hasCompletedOnboarding: profile[0].hasCompletedOnboarding,
        createdAt: profile[0].createdAt,
        updatedAt: profile[0].updatedAt,
      }
    });
  } catch (error) {
    console.error('Error getting user wallet:', error);
    return NextResponse.json({
      error: 'Failed to get user wallet'
    }, { status: 500 });
  }
}