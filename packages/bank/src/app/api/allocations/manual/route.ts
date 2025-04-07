/**
 * API Route: /api/allocations/manual
 * 
 * Allows manual allocation of funds to specific safe types,
 * bypassing the automatic percentage-based allocation.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userSafes, allocationStates } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { PrivyClient } from '@privy-io/server-auth';
import { loadAllocationStateForUser, saveAllocationStateForUser } from '@/server/allocation-state';
import { formatUnits, parseUnits } from 'viem';

// Initialize Privy client
const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

// Helper to get DID from request using Privy token
async function getPrivyDidFromRequest(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    console.warn('Missing Authorization header in /api/allocations/manual');
    return null;
  }

  const authToken = authHeader.replace(/^Bearer\s+/, '');
  if (!authToken) {
    console.warn('Malformed Authorization header in /api/allocations/manual');
    return null;
  }

  try {
    const claims = await privyClient.verifyAuthToken(authToken);
    return claims.userId;
  } catch (error) {
    console.error('Error verifying Privy auth token in /api/allocations/manual:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate the user
    const privyDid = await getPrivyDidFromRequest(request);
    if (!privyDid) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized - Privy authentication failed' 
      }, { status: 401 });
    }

    // 2. Parse the request body
    const body = await request.json();
    const { tax, liquidity, yield: yieldAmount } = body;

    // 3. Validate the request
    if (!tax && !liquidity && !yieldAmount) {
      return NextResponse.json({ 
        success: false, 
        error: 'At least one allocation amount must be provided' 
      }, { status: 400 });
    }

    // Check if amounts are valid
    for (const amount of [tax, liquidity, yieldAmount]) {
      if (amount && (isNaN(Number(amount)) || Number(amount) < 0)) {
        return NextResponse.json({ 
          success: false, 
          error: 'All provided amounts must be valid non-negative numbers' 
        }, { status: 400 });
      }
    }

    // 4. Load current allocation state
    const state = await loadAllocationStateForUser(privyDid);
    
    // 5. Calculate amount changes in wei (6 decimals for USDC)
    const updates: Record<string, string> = {};
    
    if (tax !== undefined) {
      const taxWei = parseUnits(tax.toString(), 6).toString();
      updates.allocatedTax = taxWei;
    }
    
    if (liquidity !== undefined) {
      const liquidityWei = parseUnits(liquidity.toString(), 6).toString();
      updates.allocatedLiquidity = liquidityWei;
    }
    
    if (yieldAmount !== undefined) {
      const yieldWei = parseUnits(yieldAmount.toString(), 6).toString();
      updates.allocatedYield = yieldWei;
    }
    
    // 6. Calculate new total deposited (sum of all allocations)
    const taxBigInt = BigInt(updates.allocatedTax || state.allocatedTax);
    const liquidityBigInt = BigInt(updates.allocatedLiquidity || state.allocatedLiquidity);
    const yieldBigInt = BigInt(updates.allocatedYield || state.allocatedYield);
    const totalDepositedBigInt = taxBigInt + liquidityBigInt + yieldBigInt;
    
    updates.totalDeposited = totalDepositedBigInt.toString();
    
    // 7. Update the allocation state
    await saveAllocationStateForUser(privyDid, updates);
    
    // 8. Return the updated state
    const updatedState = await loadAllocationStateForUser(privyDid);
    
    return NextResponse.json({
      success: true,
      message: 'Manual allocation completed successfully',
      data: {
        allocatedTax: formatUnits(BigInt(updatedState.allocatedTax), 6),
        allocatedLiquidity: formatUnits(BigInt(updatedState.allocatedLiquidity), 6),
        allocatedYield: formatUnits(BigInt(updatedState.allocatedYield), 6),
        totalDeposited: formatUnits(BigInt(updatedState.totalDeposited), 6),
        lastUpdated: updatedState.lastUpdated
      }
    });
    
  } catch (error) {
    console.error('Error during manual allocation:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    }, { status: 500 });
  }
} 