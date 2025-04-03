/**
 * API Route: /api/check-deposits
 * 
 * Manually triggers a check for new deposits.
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchUSDCBalance } from '@/server/balance-service';
import { checkAndUpdateBalance, calculateAndTrackAllocation } from '@/server/allocation-state';

/**
 * POST handler for /api/check-deposits
 * Manually triggers a check for new deposits
 */
export async function POST() {
  try {
    // Fetch current USDC balance
    const currentBalance = await fetchUSDCBalance();
    
    // Check if there's a new deposit
    const { newDeposit, depositAmount } = checkAndUpdateBalance(currentBalance);
    
    if (newDeposit) {
      // Calculate and track allocations for the new deposit
      const allocations = calculateAndTrackAllocation(depositAmount);
      
      return NextResponse.json({
        success: true,
        message: 'New deposit detected and allocations updated',
        data: {
          newDeposit,
          depositAmount,
          allocations
        }
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'No new deposits detected',
        data: {
          newDeposit,
          currentBalance
        }
      });
    }
  } catch (error) {
    console.error('Error checking for new deposits:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to check for new deposits' 
      },
      { status: 500 }
    );
  }
} 