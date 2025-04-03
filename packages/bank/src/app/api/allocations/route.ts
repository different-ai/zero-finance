/**
 * API Route: /api/allocations
 * 
 * Provides access to the current allocation state and optionally triggers a 
 * balance check to detect new deposits.
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  getFormattedAllocationState,
  checkAndUpdateBalance,
  calculateAndTrackAllocation
} from '@/server/allocation-state';
import { fetchUSDCBalance } from '@/server/balance-service';

/**
 * GET handler for /api/allocations
 * Gets the current allocation state without triggering balance checks
 */
export async function GET() {
  try {
    // Get the formatted allocation state
    const allocationState = getFormattedAllocationState();
    
    return NextResponse.json({
      success: true,
      data: allocationState
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
 * Triggers a balance check and updates allocations if new deposits are detected
 */
export async function POST() {
  try {
    // Fetch the current USDC balance
    const currentBalance = await fetchUSDCBalance();
    
    // Check for new deposits
    const { newDeposit, depositAmount } = checkAndUpdateBalance(currentBalance);
    
    // If there's a new deposit, calculate and track allocations
    if (newDeposit && depositAmount !== '0') {
      calculateAndTrackAllocation(depositAmount);
    }
    
    // Get the updated allocation state
    const allocationState = getFormattedAllocationState();
    
    return NextResponse.json({
      success: true,
      data: {
        ...allocationState,
        newDeposit,
        depositAmount
      }
    });
  } catch (error) {
    console.error('Error updating allocation state:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update allocation state' },
      { status: 500 }
    );
  }
} 