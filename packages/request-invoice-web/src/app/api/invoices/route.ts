import { NextRequest, NextResponse } from 'next/server';
import { getUserRequests, UserRequest } from '@/lib/request-network';
import { getAuth, currentUser } from '@clerk/nextjs/server';
import { userProfileService } from '@/lib/user-profile-service';

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get authenticated user
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
      return NextResponse.json({ invoices: [] });
    }

    // Get or create user profile if it doesn't exist yet
    let wallet = null;
    let paymentAddress = null;
    
    try {
      // Get or create user profile
      const userProfile = await userProfileService.getOrCreateProfile(userId, userEmail);
      
      // Get user wallet for fetching requests
      try {
        wallet = await userProfileService.getOrCreateWallet(userId);
        console.log('0xHypr', 'Using wallet address for request lookup:', wallet.address);
      } catch (error) {
        console.error('0xHypr', 'Error getting wallet:', error);
      }
      
      // Get payment address (might be different from wallet address)
      try {
        paymentAddress = await userProfileService.getPaymentAddress(userId);
      } catch (error) {
        console.error('0xHypr', 'Error getting payment address:', error);
      }
    } catch (error) {
      console.error('0xHypr', 'Error getting/creating user profile:', error);
      // Continue anyway - we can still get the invoices
    }
    
    // Use wallet address if available, otherwise fall back to email only
    const walletAddress = wallet?.address || '';
    
    // Get user requests using our dedicated service function with both wallet address and email
    const userRequests = await getUserRequests(walletAddress, userEmail);
    
    // The function already returns objects with the correct structure
    // We just need to map them to the final format our UI expects
    const validInvoices = userRequests.map((request: UserRequest) => ({
      requestId: request.requestId,
      creationDate: request.creationDate,
      description: request.description,
      client: request.client,
      amount: request.amount,
      currency: request.currency,
      status: request.status,
      url: request.url,
      role: request.role
    }));
    
    // If no invoices were found and we're in development mode, 
    // don't return samples anymore - we want to test with real data
    
    console.log('0xHypr', `Returning ${validInvoices.length} invoices for user ${userEmail}`);
    
    // Return the invoices along with the user's wallet info
    return NextResponse.json({ 
      invoices: validInvoices,
      walletAddress: wallet?.address || null,
      paymentAddress: paymentAddress,
      userEmail: userEmail 
    });
  } catch (error) {
    console.error('0xHypr', 'Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}