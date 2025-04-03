/**
 * API Route: /api/allocations
 * 
 * GET: Provides access to the current confirmed allocation state and any pending deposit.
 * POST: Triggers a balance check and updates the pending deposit state if a new deposit is detected.
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  getFullAllocationState,
  checkForNewDepositAndUpdateState,
} from '@/server/allocation-state';
import { fetchUSDCBalance } from '@/server/balance-service';
import { formatUnits } from 'viem';

/**
 * GET handler for /api/allocations
 * Gets the current allocation state including any pending deposit (both raw and formatted)
 */
export async function GET() {
  try {
    // Get the full allocation state (raw and formatted)
    const fullState = getFullAllocationState();
    
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
 * Triggers a balance check and updates the pending deposit amount if a new one is found.
 * Note: This does NOT confirm the allocation, it just detects the deposit.
 */
export async function POST() {
  try {
    // Fetch the current USDC balance
    const currentBalance = await fetchUSDCBalance();
    
    // Check for new deposits and update the pending state
    const { state, newDepositDetected, depositAmount } = checkForNewDepositAndUpdateState(currentBalance);
    
    // Get the full state (raw and formatted) to return
    const fullState = getFullAllocationState();
    
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