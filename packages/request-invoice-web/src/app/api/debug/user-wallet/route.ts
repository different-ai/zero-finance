import { NextRequest, NextResponse } from 'next/server';
import { getAuth, currentUser } from '@clerk/nextjs/server';
import { userProfileService } from '@/lib/user-profile-service';
import { db } from '@/db';
import { userProfilesTable, userWalletsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Debug endpoint to view wallet information
 */
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
    
    // Get detailed profile data
    const profiles = await db
      .select()
      .from(userProfilesTable)
      .where(eq(userProfilesTable.clerkId, userId));
    
    const profile = profiles.length > 0 ? profiles[0] : null;
    
    // Get all user wallets with complete details
    const wallets = await db
      .select()
      .from(userWalletsTable)
      .where(eq(userWalletsTable.userId, userId));
    
    // Get current payment address
    let paymentAddress = null;
    try {
      paymentAddress = await userProfileService.getPaymentAddress(userId);
    } catch (error) {
      console.error('Error getting payment address:', error);
    }
    
    // Log request network config for debugging
    const requestNetworkModule = await import('@/lib/request-network');
    const requestNetworkTypesModule = await import('@requestnetwork/request-client.js');
    const config = {
      nodeURL: 'https://xdai.gateway.request.network/', // This is the config we use
      requestClient: !!requestNetworkModule.default,
      hasUserRequests: !!requestNetworkModule.getUserRequests,
      requestNetworkAvailable: !!requestNetworkTypesModule.RequestNetwork,
      typesAvailable: !!requestNetworkTypesModule.Types,
    };
    
    console.log('0xHypr DEBUG', {
      userId,
      userEmail,
      profile: !!profile,
      walletCount: wallets.length,
      requestNetworkConfig: config
    });
    
    // Return the debug information
    return NextResponse.json({
      user: {
        id: userId,
        email: userEmail,
      },
      profile: profile ? {
        id: profile.id,
        clerkId: profile.clerkId,
        paymentAddress: profile.paymentAddress,
        email: profile.email,
        defaultWalletId: profile.defaultWalletId,
        createdAt: profile.createdAt,
      } : null,
      wallets: wallets.map(wallet => ({
        id: wallet.id,
        address: wallet.address,
        publicKey: wallet.publicKey,
        network: wallet.network,
        isDefault: wallet.isDefault,
        createdAt: wallet.createdAt,
        // Include full private key for debug only
        privateKey: wallet.privateKey,
      })),
      currentPaymentAddress: paymentAddress,
      requestNetworkConfig: config,
    });
  } catch (error) {
    console.error('0xHypr DEBUG - Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}