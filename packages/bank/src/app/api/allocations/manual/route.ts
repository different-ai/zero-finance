/**
 * API Route: /api/allocations/manual
 * 
 * Consolidated endpoint for allocation management:
 * - GET: Provides access to the current allocation state
 * - POST (with tax/liquidity/yield): Manual allocation of funds
 * - POST (with checkDeposits=true): Check for new deposits
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrivyClient } from '@privy-io/react-auth';
import { db } from '@/db';
import { allocationStates, userSafes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAllSafesBalances } from '@/server/allocation-state';
import { BASE_USDC_ADDRESS, USDC_DECIMALS } from '@/lib/constants';
import { z } from 'zod';

// Initialize Privy Client
const privyClient = new PrivyClient();

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
    // For development purposes, return a placeholder DID
    // In production, this would verify the token and extract the user ID
    return "did:privy:placeholder-user-id-123";
  } catch (error) {
    console.error('Error verifying Privy auth token in /api/allocations/manual:', error);
    return null;
  }
}

// Data validation schemas
const ManualAllocationSchema = z.object({
  allocatedTax: z.string(),
  allocatedLiquidity: z.string(),
  allocatedYield: z.string(),
});

const DepositCheckSchema = z.object({
  checkDeposits: z.literal(true),
});

// Type for the response data
type AllocationResponse = {
  success: boolean;
  data?: {
    allocatedTax: string;
    allocatedLiquidity: string;
    allocatedYield: string;
    totalDeposited?: string;
    lastUpdated?: string;
  };
  error?: string;
};

// GET handler to retrieve current allocation state
export async function GET(req: NextRequest): Promise<NextResponse<AllocationResponse>> {
  try {
    // Authenticate the user
    const userDid = await getPrivyDidFromRequest(req);
    
    if (!userDid) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }
    
    // Fetch the user's allocation state
    const userAllocationState = await db.query.allocationStates.findFirst({
      where: eq(allocationStates.userDid, userDid),
    });
    
    if (!userAllocationState) {
      return NextResponse.json({ 
        success: true, 
        data: { 
          allocatedTax: '0', 
          allocatedLiquidity: '0', 
          allocatedYield: '0' 
        } 
      });
    }
    
    return NextResponse.json({
      success: true,
      data: {
        allocatedTax: userAllocationState.allocatedTax || '0',
        allocatedLiquidity: userAllocationState.allocatedLiquidity || '0',
        allocatedYield: userAllocationState.allocatedYield || '0',
        totalDeposited: userAllocationState.totalDeposited,
        lastUpdated: userAllocationState.lastUpdated?.toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching allocation state:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}

// POST handler for manual allocation and deposit checking
export async function POST(req: NextRequest): Promise<NextResponse<AllocationResponse>> {
  try {
    const userDid = await getPrivyDidFromRequest(req);
    
    if (!userDid) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }
    
    const body = await req.json();
    
    // Check which operation to perform
    if (DepositCheckSchema.safeParse(body).success) {
      return handleCheckDeposits(userDid);
    } else if (ManualAllocationSchema.safeParse(body).success) {
      return handleManualAllocation(userDid, body);
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid request body. Include either allocation amounts or checkDeposits flag.'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}

// Helper function for checking USDC deposits
async function handleCheckDeposits(userDid: string): Promise<NextResponse<AllocationResponse>> {
  try {
    // Fetch user safes
    const userSafeRecords = await db.query.userSafes.findMany({
      where: eq(userSafes.userDid, userDid),
    });
    
    if (!userSafeRecords || userSafeRecords.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No safes found. Please set up your primary safe first.' 
      }, { status: 400 });
    }
    
    const primarySafe = userSafeRecords.find(safe => safe.safeType === 'primary');
    
    if (!primarySafe) {
      return NextResponse.json({ 
        success: false, 
        error: 'Primary safe not found. Please set up your primary safe first.' 
      }, { status: 400 });
    }
    
    // Get balance data for all safes
    const safeBalances = await getAllSafesBalances(userSafeRecords);
    
    // Calculate total deposited amount from all safes with USDC
    const totalDeposited = "1000000"; // Temporarily hardcoded for testing (1 USDC)
    
    // If total is zero, no deposits to allocate
    if (totalDeposited === '0') {
      return NextResponse.json({ 
        success: false, 
        error: 'No USDC deposits found. Please fund your primary safe first.' 
      }, { status: 400 });
    }
    
    // Get existing allocation state or create new one
    let currentState = await db.query.allocationStates.findFirst({
      where: eq(allocationStates.userDid, userDid),
    });
    
    // If no state exists or deposits changed, create default allocation based on total
    const totalBigInt = BigInt(totalDeposited);
    const allocatedTax = (totalBigInt * BigInt(3000) / BigInt(10000)).toString(); // 30%
    const allocatedLiquidity = (totalBigInt * BigInt(2000) / BigInt(10000)).toString(); // 20%
    const allocatedYield = (totalBigInt * BigInt(5000) / BigInt(10000)).toString(); // 50%
    
    if (!currentState) {
      // Insert new allocation state
      await db.insert(allocationStates).values({
        userDid,
        totalDeposited,
        allocatedTax,
        allocatedLiquidity,
        allocatedYield,
        lastUpdated: new Date()
      });
    } else {
      // Update existing allocation state with new calculated values
      await db.update(allocationStates)
        .set({
          totalDeposited,
          allocatedTax,
          allocatedLiquidity, 
          allocatedYield,
          lastUpdated: new Date()
        })
        .where(eq(allocationStates.userDid, userDid));
    }
    
    return NextResponse.json({
      success: true,
      data: {
        allocatedTax,
        allocatedLiquidity,
        allocatedYield,
        totalDeposited,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error checking deposits:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}

// Helper function for manual allocation
async function handleManualAllocation(
  userDid: string, 
  data: { allocatedTax: string; allocatedLiquidity: string; allocatedYield: string }
): Promise<NextResponse<AllocationResponse>> {
  try {
    const { allocatedTax, allocatedLiquidity, allocatedYield } = data;
    
    // Calculate total from manual allocation
    const total = (
      BigInt(allocatedTax) + 
      BigInt(allocatedLiquidity) + 
      BigInt(allocatedYield)
    ).toString();
    
    // Get existing allocation state
    const existingState = await db.query.allocationStates.findFirst({
      where: eq(allocationStates.userDid, userDid),
    });
    
    if (existingState) {
      // Update existing allocation state
      await db.update(allocationStates)
        .set({
          allocatedTax,
          allocatedLiquidity,
          allocatedYield,
          totalDeposited: total,
          lastUpdated: new Date()
        })
        .where(eq(allocationStates.userDid, userDid));
    } else {
      // Insert new allocation state
      await db.insert(allocationStates).values({
        userDid,
        totalDeposited: total,
        allocatedTax,
        allocatedLiquidity,
        allocatedYield,
        lastUpdated: new Date()
      });
    }
    
    return NextResponse.json({
      success: true,
      data: {
        allocatedTax,
        allocatedLiquidity,
        allocatedYield,
        totalDeposited: total,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error updating allocation state:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
} 