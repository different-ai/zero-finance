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
import { createPublicClient, http, Address, erc20Abi, formatUnits, encodeFunctionData, isAddress } from 'viem';
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

// Define structure for a Safe transaction
type SafeTransaction = {
  to: Address;
  value: string;
  data: `0x${string}`;
};

// Type for the response when preparing transactions
type PrepareAllocationResponse = {
  success: boolean;
  transactions?: SafeTransaction[];
  error?: string;
  message?: string;
};

// Type for the GET response (can remain similar, but might simplify later)
type AllocationGetResponse = {
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
export async function GET(req: NextRequest): Promise<NextResponse<AllocationGetResponse>> {
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
export async function POST(req: NextRequest): Promise<NextResponse> {
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
      return handlePrepareAllocation(userDid, body);
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid request body. Include either allocation amounts or checkDeposits=true.' 
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
async function handleCheckDeposits(userDid: string): Promise<NextResponse> {
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

// Helper function for preparing manual allocation transactions
async function handlePrepareAllocation(
  userDid: string, 
  data: { allocatedTax: string; allocatedLiquidity: string; allocatedYield: string }
): Promise<NextResponse<PrepareAllocationResponse>> {
  try {
    const { allocatedTax, allocatedLiquidity, allocatedYield } = data;

    // 1. Fetch all safes for the user
    const allUserSafes = await db.query.userSafes.findMany({
      where: eq(userSafes.userDid, userDid),
      columns: { safeAddress: true, safeType: true },
    });

    // 2. Map addresses and check for required safes
    const safeAddresses: { [key: string]: Address | undefined } = {};
    allUserSafes.forEach(safe => {
      if (safe.safeAddress && isAddress(safe.safeAddress)) {
        safeAddresses[safe.safeType] = safe.safeAddress;
      }
    });

    const primaryAddress = safeAddresses['primary'];
    const taxAddress = safeAddresses['tax'];
    const liquidityAddress = safeAddresses['liquidity'];
    const yieldAddress = safeAddresses['yield'];

    if (!primaryAddress) {
        return NextResponse.json({ success: false, error: 'Primary safe address not found.' }, { status: 400 });
    }
    if (!taxAddress || !liquidityAddress || !yieldAddress) {
        return NextResponse.json({ 
            success: false, 
            error: 'Missing one or more destination safe addresses (tax, liquidity, yield).' 
        }, { status: 400 });
    }

    // 3. Parse input amounts
    let taxAmount: bigint;
    let liquidityAmount: bigint;
    let yieldAmount: bigint;
    try {
      taxAmount = BigInt(allocatedTax);
      liquidityAmount = BigInt(allocatedLiquidity);
      yieldAmount = BigInt(allocatedYield);
      if (taxAmount < 0n || liquidityAmount < 0n || yieldAmount < 0n) {
        throw new Error("Allocation amounts cannot be negative.");
      }
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Invalid allocation amount(s). Please provide valid non-negative numbers.'}, { status: 400 });
    }

    const totalToAllocate = taxAmount + liquidityAmount + yieldAmount;

    if (totalToAllocate <= 0n) {
      return NextResponse.json({ success: false, error: 'Total allocation amount must be greater than zero.'}, { status: 400 });
    }

    // 4. Check primary safe balance
    const primaryBalance = await getUsdcBalance(primaryAddress);

    if (primaryBalance < totalToAllocate) {
      return NextResponse.json({ 
        success: false, 
        error: `Insufficient funds in primary safe. Required: ${totalToAllocate}, Available: ${primaryBalance}` 
      }, { status: 400 });
    }

    // 5. Prepare transfer transactions
    const preparedTransactions: SafeTransaction[] = [];
    
    // Define the transfer function ABI for encoding
    const transferAbi = {
        inputs: [
            { name: 'recipient', type: 'address' },
            { name: 'amount', type: 'uint256' }
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
    } as const; // Ensure type safety

    // Tax Transfer
    if (taxAmount > 0n) {
      const taxData = encodeFunctionData({
        abi: [transferAbi],
        functionName: 'transfer',
        args: [taxAddress, taxAmount],
      });
      preparedTransactions.push({ to: BASE_USDC_ADDRESS, value: '0', data: taxData });
    }

    // Liquidity Transfer
    if (liquidityAmount > 0n) {
      const liquidityData = encodeFunctionData({
        abi: [transferAbi],
        functionName: 'transfer',
        args: [liquidityAddress, liquidityAmount],
      });
      preparedTransactions.push({ to: BASE_USDC_ADDRESS, value: '0', data: liquidityData });
    }

    // Yield Transfer
    if (yieldAmount > 0n) {
      const yieldData = encodeFunctionData({
        abi: [transferAbi],
        functionName: 'transfer',
        args: [yieldAddress, yieldAmount],
      });
      preparedTransactions.push({ to: BASE_USDC_ADDRESS, value: '0', data: yieldData });
    }

    // 6. Return prepared transactions
    return NextResponse.json({ 
        success: true, 
        transactions: preparedTransactions, 
        message: `Ready to allocate ${totalToAllocate} USDC.`
    });

  } catch (error) {
    console.error('Error preparing allocation transactions:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred during allocation preparation' 
    }, { status: 500 });
  }
} 