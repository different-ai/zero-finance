import { NextRequest, NextResponse } from 'next/server';
import { getAuth, currentUser } from '@clerk/nextjs/server';
import { userProfileService } from '@/lib/user-profile-service';
import { db } from '@/db';
import { userProfilesTable, userWalletsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

    // Get the current user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user email
    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      );
    }

    try {
      // Get or create user profile
      const userProfile = await userProfileService.getOrCreateProfile(userId, userEmail);
      
      // Get wallet count
      const wallets = await db
        .select({ address: userWalletsTable.address, network: userWalletsTable.network })
        .from(userWalletsTable)
        .where(eq(userWalletsTable.userId, userId));
      
      // Get payment address
      const paymentAddress = await userProfileService.getPaymentAddress(userId);
      
      // Return the user profile with sensitive information removed
      return NextResponse.json({
        profile: {
          id: userProfile.id,
          email: userProfile.email,
          businessName: userProfile.businessName,
          paymentAddress,
          createdAt: userProfile.createdAt,
          updatedAt: userProfile.updatedAt,
        },
        wallets: wallets.map(wallet => ({
          address: wallet.address,
          network: wallet.network,
        })),
      });
    } catch (error) {
      // If the profile doesn't exist yet, create it
      if (error instanceof Error && error.message.includes('not found')) {
        const userProfile = await userProfileService.getOrCreateProfile(userId, userEmail);
        
        return NextResponse.json({
          profile: {
            id: userProfile.id,
            email: userProfile.email,
            businessName: userProfile.businessName,
            paymentAddress: userProfile.paymentAddress,
            createdAt: userProfile.createdAt,
            updatedAt: userProfile.updatedAt,
          },
          wallets: [],
        });
      }
      
      throw error;
    }
  } catch (error) {
    console.error('0xHypr', 'Error getting user profile:', error);
    return NextResponse.json(
      { error: 'Failed to get user profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
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
    if (!body) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
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

    // Get user email
    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      );
    }

    // Get or create the user profile
    const userProfile = await userProfileService.getOrCreateProfile(userId, userEmail);

    // Update the fields that were provided
    const updates: any = { updatedAt: new Date() };
    
    if (body.paymentAddress !== undefined) {
      // Validate the payment address if it's provided
      if (body.paymentAddress && !body.paymentAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
        return NextResponse.json(
          { error: 'Invalid payment address format' },
          { status: 400 }
        );
      }
      updates.paymentAddress = body.paymentAddress;
    }
    
    if (body.businessName !== undefined) {
      updates.businessName = body.businessName;
    }

    // Update the profile
    const result = await db
      .update(userProfilesTable)
      .set(updates)
      .where(eq(userProfilesTable.id, userProfile.id))
      .returning();

    return NextResponse.json({
      profile: {
        id: result[0].id,
        email: result[0].email,
        businessName: result[0].businessName,
        paymentAddress: result[0].paymentAddress,
        createdAt: result[0].createdAt,
        updatedAt: result[0].updatedAt,
      }
    });
  } catch (error) {
    console.error('0xHypr', 'Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}