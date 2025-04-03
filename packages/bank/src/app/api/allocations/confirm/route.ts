/**
 * API Route: /api/allocations/confirm
 * 
 * Confirms the allocation of the currently pending deposit amount.
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  confirmPendingDepositAllocation, 
  getFullAllocationState
} from '@/server/allocation-state';

/**
 * POST handler for /api/allocations/confirm
 * Confirms the pending deposit and updates the main allocations.
 */
export async function POST() {
  try {
    // Confirm the pending deposit allocation
    confirmPendingDepositAllocation();
    
    // Get the newly updated full state
    const fullState = getFullAllocationState();
    
    return NextResponse.json({
      success: true,
      message: 'Pending deposit allocated successfully.',
      data: fullState
    });
  } catch (error) {
    console.error('Error confirming allocation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to confirm allocation' },
      { status: 500 }
    );
  }
} 