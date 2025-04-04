/**
 * API Route: /api/allocations
 * 
 * GET: Provides access to the current confirmed allocation state and any pending deposit for a specific user.
 * POST: Triggers a balance check for the user's primary Safe and updates the pending deposit state if a new deposit is detected.
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  getFullAllocationStateForUser,
  checkDepositAndGetState,
} from '@/server/allocation-state';
import { fetchUSDCBalance } from '@/server/balance-service';
import { formatUnits } from 'viem';

// --- PLACEHOLDER for User Authentication ---
// In a real app, you would get the user's DID from their authenticated session (e.g., Privy)
const PLACEHOLDER_USER_DID = "did:privy:placeholder-user-id-123"; 
// --- End Placeholder ---

/**
 * GET handler for /api/allocations
 * Gets the current allocation state for the authenticated user.
 */
export async function GET() {
  // TODO: Replace placeholder DID with actual authenticated user DID
  const userDid = PLACEHOLDER_USER_DID; 
  
  try {
    // Get the full allocation state for the specific user
    const fullState = await getFullAllocationStateForUser(userDid); 
    
    return NextResponse.json({
      success: true,
      data: fullState 
    });
  } catch (error) {
    console.error('Error getting allocation state:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get allocation state' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for /api/allocations
 * Triggers a balance check for the authenticated user's primary Safe 
 * and updates their pending deposit amount if a new one is found.
 */
export async function POST() {
  // TODO: Replace placeholder DID with actual authenticated user DID
  const userDid = PLACEHOLDER_USER_DID;

  try {
    // Fetch the current USDC balance for the user's primary safe
    // Note: fetchUSDCBalance likely needs updating to accept userDid or safeAddress
    // For now, assuming it fetches the balance for the PRIMARY safe configured in env
    // which corresponds to the initial state for the placeholder user.
    const primarySafeAddress = (await getFullAllocationStateForUser(userDid)).primarySafeAddress;
    const currentBalance = await fetchUSDCBalance(primarySafeAddress); // Pass the user's primary safe address
    
    // Check for new deposits for this user and update their pending state
    const { state, newDepositDetected, depositAmount } = await checkDepositAndGetState(userDid, currentBalance);
    
    // Get the updated full state for the user to return
    const fullState = await getFullAllocationStateForUser(userDid);
    
    return NextResponse.json({
      success: true,
      data: fullState,
      message: newDepositDetected 
               ? `New deposit of ${formatUnits(BigInt(depositAmount), 6)} USDC detected and is pending confirmation.` 
               : 'No new deposit detected since last check.'
    });
  } catch (error) {
    console.error('Error checking for new deposits:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check for new deposits' },
      { status: 500 }
    );
  }
} 