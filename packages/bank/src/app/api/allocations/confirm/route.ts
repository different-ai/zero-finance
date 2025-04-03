/**
 * API Route: /api/allocations/confirm
 * 
 * Confirms the allocation of the currently pending deposit amount and triggers
 * the execution of the corresponding Safe transactions.
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  confirmPendingDepositAllocation, 
  getFullAllocationState 
} from '@/server/allocation-state';
import { executeAllocationTransactions } from '@/server/safe-tx-service';

/**
 * POST handler for /api/allocations/confirm
 * Confirms the pending deposit, updates allocations, and executes Safe transactions.
 */
export async function POST() {
  let allocatedAmounts;
  try {
    // 1. Confirm the pending deposit allocation and get the amounts for this step
    const confirmationResult = confirmPendingDepositAllocation();
    allocatedAmounts = confirmationResult.allocatedAmounts;

    if (!allocatedAmounts || 
        (allocatedAmounts.taxAmount === '0' && 
         allocatedAmounts.liquidityAmount === '0' && 
         allocatedAmounts.yieldAmount === '0')) {
      
      console.log('No pending allocation amounts to execute after confirmation.');
      const currentState = getFullAllocationState();
      return NextResponse.json({
        success: true,
        message: 'No pending deposit amount was found to allocate.',
        data: currentState
      });
    }

    // 2. Execute the Safe transactions for the allocated amounts
    console.log('Triggering Safe transaction execution for amounts:', allocatedAmounts);
    const txHash = await executeAllocationTransactions(allocatedAmounts);
    console.log('Safe execution completed with hash:', txHash);

    // 3. Get the final state after confirmation and execution
    const finalState = getFullAllocationState();
    
    return NextResponse.json({
      success: true,
      message: `Pending deposit allocated and transfers executed. Tx Hash: ${txHash}`,
      data: finalState
    });

  } catch (error) {
    console.error('Error during allocation confirmation or execution:', error);
    // Get the current state even if execution failed, to return it
    const currentState = getFullAllocationState(); 
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to confirm allocation or execute transactions',
        data: currentState // Return current state even on error
      },
      { status: 500 }
    );
  }
} 