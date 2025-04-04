/**
 * API Route: /api/allocations/confirm
 * 
 * Confirms the allocation of the currently pending deposit amount for a specific user.
 * NOTE: Execution of Safe transactions is temporarily disabled due to issues.
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  confirmAllocationForUser,      // Updated import
  getFullAllocationStateForUser  // Updated import
} from '@/server/allocation-state';
import { executeAllocationTransactions } from '@/server/safe-tx-service'; // Keep import for now, but call is commented out

// --- PLACEHOLDER for User Authentication ---
const PLACEHOLDER_USER_DID = "did:privy:placeholder-user-id-123"; 
// --- End Placeholder ---

/**
 * POST handler for /api/allocations/confirm
 * Confirms the pending deposit and updates allocations in the database for the user.
 */
export async function POST() {
  // TODO: Replace placeholder DID with actual authenticated user DID
  const userDid = PLACEHOLDER_USER_DID;
  
  let allocatedAmounts;
  try {
    // 1. Confirm the pending deposit allocation for the user
    const confirmationResult = await confirmAllocationForUser(userDid);
    allocatedAmounts = confirmationResult.allocatedAmounts;

    if (!allocatedAmounts || 
        (allocatedAmounts.taxAmount === '0' && 
         allocatedAmounts.liquidityAmount === '0' && 
         allocatedAmounts.yieldAmount === '0')) {
      
      console.log(`User ${userDid}: No pending allocation amounts to execute after confirmation.`);
      const currentState = await getFullAllocationStateForUser(userDid);
      return NextResponse.json({
        success: true,
        message: 'No pending deposit amount was found to allocate.',
        data: currentState
      });
    }

    // 2. Execute the Safe transactions (TEMPORARILY DISABLED)
    console.log(`User ${userDid}: Allocation confirmed for amounts:`, allocatedAmounts);
    console.warn('executeAllocationTransactions call is temporarily disabled.');
    /*
    try {
      const txHash = await executeAllocationTransactions(allocatedAmounts, userDid);
      console.log(`User ${userDid}: Safe execution potentially completed with task ID:`, txHash);
      // Success message will be updated below if execution was attempted
    } catch (txError) {
       console.error(`User ${userDid}: executeAllocationTransactions failed:`, txError);
       // Decide how to handle partial success (confirmation ok, tx fail)
       // For now, we'll let the main catch block handle it, returning the state after confirmation.
       throw txError; // Re-throw to be caught by the main try-catch
    }
    */
    const txHash = 'tx_execution_disabled'; // Placeholder

    // 3. Get the final state after confirmation 
    const finalState = await getFullAllocationStateForUser(userDid);
    
    return NextResponse.json({
      success: true,
      // Modify message based on whether execution was attempted/disabled
      message: `Pending deposit allocated successfully. Transaction execution is currently disabled.`, // Updated message
      // message: `Pending deposit allocated and transfers executed. Tx Hash: ${txHash}`, 
      data: finalState
    });

  } catch (error) {
    console.error(`User ${userDid}: Error during allocation confirmation:`, error);
    // Get the current state even if confirmation failed
    const currentState = await getFullAllocationStateForUser(userDid); 
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to confirm allocation',
        data: currentState // Return current state even on error
      },
      { status: 500 }
    );
  }
} 