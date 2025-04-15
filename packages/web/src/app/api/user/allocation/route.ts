import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userSafes, allocationStates } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { PrivyClient } from '@privy-io/server-auth';
import { createPublicClient, http, Address, isAddress } from 'viem';
import { base } from 'viem/chains';

// Initialize Privy client
const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

// --- Viem/Blockchain Setup ---
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

// Base Mainnet USDC Contract Address
const USDC_ADDRESS_BASE = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS_BASE as Address || '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address; // Default if env var is missing

const erc20Abi = [
  {
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
// --- End Viem Setup ---

// Helper to get DID from request using Privy token
async function getPrivyDidFromRequest(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    console.warn('Missing Authorization header in /api/user/allocation');
    return null;
  }

  const authToken = authHeader.replace(/^Bearer\s+/, '');
  if (!authToken) {
    console.warn('Malformed Authorization header in /api/user/allocation');
    return null;
  }

  try {
    const claims = await privyClient.verifyAuthToken(authToken);
    return claims.userId;
  } catch (error) {
    console.error('Error verifying Privy auth token in /api/user/allocation:', error);
    return null;
  }
}

// Helper to fetch USDC balance for a given safe address
async function getSafeBalance(safeAddress: Address | undefined | null): Promise<string> {
  if (!safeAddress || !isAddress(safeAddress)) {
    console.log(`Skipping balance fetch for invalid/missing address: ${safeAddress}`);
    return '0'; // Return '0' if address is invalid or missing
  }
  try {
    console.log(`Fetching USDC balance for safe: ${safeAddress} on Base mainnet`);
    const balance = await publicClient.readContract({
      address: USDC_ADDRESS_BASE,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [safeAddress],
    });
    const balanceString = balance.toString();
    console.log(`Live balance fetched for ${safeAddress}: ${balanceString}`);
    return balanceString;
  } catch (blockchainError) {
    console.error(`Error fetching balance for safe ${safeAddress} on Base mainnet:`, blockchainError);
    return '0'; // Return '0' on blockchain error
  }
}

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate the user
    const privyDid = await getPrivyDidFromRequest(request);
    if (!privyDid) {
      return NextResponse.json({ error: 'Unauthorized - Privy authentication failed' }, { status: 401 });
    }

    // 2. Find all safes for the user
    const allUserSafes = await db.query.userSafes.findMany({
      where: eq(userSafes.userDid, privyDid),
      columns: { id: true, safeAddress: true, safeType: true },
    });

    // 3. Identify primary safe and map addresses
    const primarySafe = allUserSafes.find(safe => safe.safeType === 'primary');
    if (!primarySafe) {
      console.log(`Primary safe not found for user DID: ${privyDid}`);
      return NextResponse.json({ allocationState: null, message: 'Primary safe not found.' }, { status: 200 });
    }
    const primarySafeId = primarySafe.id; // Store the primary safe ID

    const safeAddresses: { [key: string]: Address | undefined } = {};
    allUserSafes.forEach(safe => {
      if (safe.safeAddress) {
        safeAddresses[safe.safeType] = safe.safeAddress as Address;
      }
    });

    console.log('Safe addresses found:', safeAddresses);


    // 4. Fetch balances concurrently
    const balancePromises = [
      getSafeBalance(safeAddresses['primary']),   // Corresponds to totalDeposited
      getSafeBalance(safeAddresses['tax']),       // Corresponds to allocatedTax
      getSafeBalance(safeAddresses['liquidity']), // Corresponds to allocatedLiquidity
      getSafeBalance(safeAddresses['yield']),     // Corresponds to allocatedYield
    ];

    const [
      liveTotalDeposited,
      liveAllocatedTax,
      liveAllocatedLiquidity,
      liveAllocatedYield,
    ] = await Promise.all(balancePromises);

    console.log('Live balances fetched:', {
        liveTotalDeposited,
        liveAllocatedTax,
        liveAllocatedLiquidity,
        liveAllocatedYield,
        safeAddresses,
    });

    // Adding a debug log to diagnose issue with safe addresses
    console.log('Safe mapping diagnosis:', {
      safeAddresses,
      primarySafe: safeAddresses['primary'],
      liquiditySafe: safeAddresses['liquidity'], 
      // These should be different addresses if properly set up
      // There might be confusion in safeType mapping causing primarySafe address to be used wrong
    });

    // FIX: The issue is that primarySafe and liquiditySafe have reversed roles in the UI
    // In the schema, 'primary' is the main safe, but in the UI 'primary' is displayed as totalDeposits
    // and 'liquidity' is displayed as the primary safe
    
    // 5. Construct the final response state
    // Mimic the structure of allocationStates schema but populate with live data
    const responseState = {
      userSafeId: primarySafeId,
      totalDeposited: liveTotalDeposited, // This stays as primary safe balance
      allocatedTax: liveAllocatedTax,
      allocatedLiquidity: liveTotalDeposited, // Use primarySafe balance as liquidity (this matches the UI expectations)
      allocatedYield: liveAllocatedYield,
      lastUpdated: new Date(), // Always use current time for live data
      // Default other potential fields from schema if necessary
      lastCheckedUSDCBalance: '0', // Consider if this field is still relevant or should be removed/updated
      pendingDepositAmount: '0',   // This likely needs separate logic if it represents something other than balance
    };

    console.log('Final allocation state being returned:', responseState);
    return NextResponse.json({ allocationState: responseState }, { status: 200 });

  } catch (error) {
    console.error('Error processing allocation request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: `Failed to fetch allocation state: ${errorMessage}` }, { status: 500 });
  }
} 