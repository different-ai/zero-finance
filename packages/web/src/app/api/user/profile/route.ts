import { NextRequest, NextResponse } from 'next/server';
import { getUserId, getUser } from '@/lib/auth';
import { userProfileService } from '@/lib/user-profile-service';
import { db } from '@/db';
import { userProfilesTable, userWalletsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    // Authenticate the user with Privy
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // We should check if the user profile exists - we may need to create it
    // This is different from Clerk flow since we don't have email addresses from Privy directly
    try {
      // Try to get existing profile first
      const userProfile = await db
        .select()
        .from(userProfilesTable)
        .where(eq(userProfilesTable.clerkId, userId))
        .limit(1);
      
      if (userProfile.length === 0) {
        // Get Privy user to extract email if possible
        const privyUser = await getUser();
        const email = privyUser?.email?.address || "";
        
        // Create a new profile
        if (email) {
          const newProfile = await userProfileService.getOrCreateProfile(userId, email);
          
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
              id: newProfile.id,
              email: newProfile.email,
              businessName: newProfile.businessName,
              paymentAddress,
              createdAt: newProfile.createdAt,
              updatedAt: newProfile.updatedAt,
            },
            wallets: wallets.map(wallet => ({
              address: wallet.address,
              network: wallet.network,
            })),
          });
        } else {
          return NextResponse.json(
            { error: 'User email not found' },
            { status: 400 }
          );
        }
      }
      
      // User profile exists, let's return it
      const existingProfile = userProfile[0];
      
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
          id: existingProfile.id,
          email: existingProfile.email,
          businessName: existingProfile.businessName,
          paymentAddress,
          createdAt: existingProfile.createdAt,
          updatedAt: existingProfile.updatedAt,
        },
        wallets: wallets.map(wallet => ({
          address: wallet.address,
          network: wallet.network,
        })),
      });
    } catch (error) {
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
    // Authenticate the user with Privy
    const userId = await getUserId();
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

    // Try to get the user profile - we may need to create it
    let userProfile = await db
      .select()
      .from(userProfilesTable)
      .where(eq(userProfilesTable.clerkId, userId))
      .limit(1);
    
    if (userProfile.length === 0) {
      // Get Privy user to extract email if possible
      const privyUser = await getUser();
      const email = privyUser?.email?.address || "";
      
      if (!email) {
        return NextResponse.json(
          { error: 'User email not found' },
          { status: 400 }
        );
      }
      
      // Create a new profile
      const newProfile = await userProfileService.getOrCreateProfile(userId, email);
      userProfile = [newProfile];
    }

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
      .where(eq(userProfilesTable.id, userProfile[0].id))
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