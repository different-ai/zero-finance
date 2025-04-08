/**
 * API Route: /api/allocations/manual
 * 
 * Consolidated endpoint for allocation management:
 * - GET: Provides access to the current allocation state
 * - POST (with tax/liquidity/yield): Manual allocation of funds
 * - POST (with checkDeposits=true): Check for new deposits and calculate allocations
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';
import { db } from '@/db';
import { allocationStates, userSafes } from '@/db/schema'; // Import schema tables
import { InferSelectModel } from 'drizzle-orm'; // Import InferSelectModel
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { createPublicClient, http, Address, erc20Abi, formatUnits } from 'viem';
import { base } from 'viem/chains';

// Infer the UserSafe type from the schema
type UserSafe = InferSelectModel<typeof userSafes>;

// USDC token on Base
const BASE_USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // Corrected Base USDC address
const USDC_DECIMALS = 6;

// Initialize Viem public client for Base
const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL || undefined), // Use env var for RPC URL
});

// Initialize Privy Client (Server-side)
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
    // Verify the token using the server-side client
    const claims = await privyClient.verifyAuthToken(authToken);
    return claims.userId;
  } catch (error) {
    console.error('Error verifying Privy auth token in /api/allocations/manual:', error);
    return null;
  }
}

// Function to fetch USDC balance for a single address
async function getUsdcBalance(address: Address): Promise<bigint> {
  try {
    const balance = await publicClient.readContract({
      address: BASE_USDC_ADDRESS,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [address],
    });
    return balance;
  } catch (error) {
    console.error(`Error fetching balance for ${address}:`, error);
    return BigInt(0);
  }
}

// Updated function to get real balances for all safes
async function getAllSafesBalances(safes: UserSafe[]) {
  const balancePromises = safes.map(async (safe) => {
    const balance = await getUsdcBalance(safe.safeAddress as Address);
    return {
      ...safe,
      tokenBalance: balance.toString(),
    };
  });
  return Promise.all(balancePromises);
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
  message?: string;
};

// GET handler to retrieve current allocation state
export async function GET(req: NextRequest): Promise<NextResponse<AllocationResponse>> {
  try {
    // Authenticate the user
    const userDid = await getPrivyDidFromRequest(req);
    
    if (!userDid) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }
    
    // Find user's primary safe
    const primarySafe = await db.query.userSafes.findFirst({
      where: and(
        eq(userSafes.userDid, userDid),
        eq(userSafes.safeType, 'primary')
      )
    });

    if (!primarySafe) {
        return NextResponse.json({ success: false, error: 'Primary safe not found.' }, { status: 404 });
    }
    
    // Fetch the user's allocation state using primary safe ID
    const userAllocationState = await db.query.allocationStates.findFirst({
      where: eq(allocationStates.userSafeId, primarySafe.id),
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
    
    // Get real balance data for all safes
    const safeBalances = await getAllSafesBalances(userSafeRecords);
    
    // Calculate total deposited amount by summing balances
    const totalDepositedBigInt = safeBalances.reduce((sum, safe) => {
      // Ensure tokenBalance exists and is a valid number string before adding
      const balance = safe.tokenBalance ? BigInt(safe.tokenBalance) : BigInt(0);
      return sum + balance;
    }, BigInt(0));
    const totalDeposited = totalDepositedBigInt.toString();

    if (totalDeposited === "0") {
        return NextResponse.json({ 
          success: true, // Not an error, just no balance
          message: 'No USDC deposits found in any safe.',
          data: { allocatedTax: '0', allocatedLiquidity: '0', allocatedYield: '0', totalDeposited: '0' }
        });
      }
    
    // Calculate default allocations based on percentages
    const allocatedTax = (totalDepositedBigInt * BigInt(3000) / BigInt(10000)).toString(); // 30%
    const allocatedLiquidity = (totalDepositedBigInt * BigInt(2000) / BigInt(10000)).toString(); // 20%
    const allocatedYield = (totalDepositedBigInt * BigInt(5000) / BigInt(10000)).toString(); // 50%
    
    // Get existing allocation state for user based on primary safe ID
    const currentState = await db.query.allocationStates.findFirst({
      where: eq(allocationStates.userSafeId, primarySafe.id),
    });
    
    // Define the data structure matching the schema
    const allocationData = {
      userSafeId: primarySafe.id,
      allocatedTax,
      allocatedLiquidity,
      allocatedYield,
      totalDeposited,
      lastUpdated: new Date()
    };

    if (!currentState) {
      // Create a new allocation record
      await db.insert(allocationStates).values(allocationData);
    } else {
      // Update existing allocation record
      await db.update(allocationStates)
        .set(allocationData) // Use the prepared data object
        .where(eq(allocationStates.userSafeId, primarySafe.id));
    }
    
    return NextResponse.json({
      success: true,
      message: `Deposits checked. Total USDC: ${formatUnits(totalDepositedBigInt, USDC_DECIMALS)}. Allocations updated.`,
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
      error: error instanceof Error ? error.message : 'Unknown error occurred during deposit check' 
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
    
    // Validate input amounts
    if (isNaN(Number(allocatedTax)) || isNaN(Number(allocatedLiquidity)) || isNaN(Number(allocatedYield))) {
        return NextResponse.json({ success: false, error: 'Invalid allocation amount(s). Please provide numbers.'}, { status: 400 });
    }

    // Calculate total from manual allocation
    const total = (
      BigInt(allocatedTax) + 
      BigInt(allocatedLiquidity) + 
      BigInt(allocatedYield)
    ).toString();
    
    // Find user's primary safe
    const primarySafe = await db.query.userSafes.findFirst({
      where: and(
        eq(userSafes.userDid, userDid),
        eq(userSafes.safeType, 'primary')
      )
    });
    
    if (!primarySafe) {
      return NextResponse.json({ 
        success: false, 
        error: 'Primary safe not found. Please set up your primary safe first.' 
      }, { status: 400 });
    }
    
    // Get existing allocation state
    const existingState = await db.query.allocationStates.findFirst({
      where: eq(allocationStates.userSafeId, primarySafe.id),
    });
    
    // Define the data structure matching the schema
    const allocationData = {
        userSafeId: primarySafe.id,
        allocatedTax,
        allocatedLiquidity,
        allocatedYield,
        totalDeposited: total, // Update total based on manual input
        lastUpdated: new Date()
      };

    if (existingState) {
      // Update existing allocation state
      await db.update(allocationStates)
        .set(allocationData) // Use the prepared data object
        .where(eq(allocationStates.userSafeId, primarySafe.id));
    } else {
      // Insert new allocation state
      await db.insert(allocationStates).values(allocationData);
    }
    
    return NextResponse.json({
      success: true,
      message: "Allocation updated successfully",
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
      error: error instanceof Error ? error.message : 'Unknown error occurred during manual allocation' 
    }, { status: 500 });
  }
} 