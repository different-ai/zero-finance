import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userSafes, allocationStates } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { PrivyClient } from '@privy-io/server-auth';
import { createPublicClient, http, Address, formatUnits, isAddress } from 'viem';
import { baseSepolia } from 'viem/chains';

// Initialize Privy client
const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

// --- Viem/Blockchain Setup ---
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

const USDC_ADDRESS_BASE_SEPOLIA = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS_BASE_SEPOLIA as Address || '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as Address; // Default if env var is missing

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

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate the user (using Privy)
    const privyDid = await getPrivyDidFromRequest(request);
    if (!privyDid) {
      return NextResponse.json({ error: 'Unauthorized - Privy authentication failed' }, { status: 401 });
    }

    // 2. Find the user's primary safe address
    const primarySafe = await db.query.userSafes.findFirst({
      where: and(
        eq(userSafes.userDid, privyDid),
        eq(userSafes.safeType, 'primary')
      ),
      columns: { id: true, safeAddress: true }, // Also fetch the safeAddress
    });

    if (!primarySafe) {
      return NextResponse.json({ allocationState: null, message: 'Primary safe not found.' }, { status: 200 });
    }

    // 3. Fetch the allocation state from DB (still useful for other fields)
    const dbState = await db.query.allocationStates.findFirst({
      where: eq(allocationStates.userSafeId, primarySafe.id),
    });

    let liveTotalDeposited: string | null = null;

    // 4. Fetch live USDC balance from blockchain if safe address exists
    if (primarySafe.safeAddress && isAddress(primarySafe.safeAddress)) {
      try {
        console.log(`Fetching USDC balance for safe: ${primarySafe.safeAddress} on Base Sepolia`);
        const balance = await publicClient.readContract({
          address: USDC_ADDRESS_BASE_SEPOLIA,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [primarySafe.safeAddress as Address],
        });
        liveTotalDeposited = balance.toString(); // Keep it as string (uint256)
        console.log(`Live balance fetched: ${liveTotalDeposited}`);
      } catch (blockchainError) {
        console.error(`Error fetching balance for safe ${primarySafe.safeAddress}:`, blockchainError);
        // Do not fail the request, fallback to DB value if available
      }
    } else {
        console.warn(`Primary safe found (ID: ${primarySafe.id}) but has no valid safeAddress.`);
    }


    // 5. Construct the response, prioritizing live balance
    let responseState = dbState ? { ...dbState } : null; // Start with DB state if it exists

    if (liveTotalDeposited !== null) {
        // If we got a live balance, create the state object if it doesn't exist
        // and always override totalDeposited
         if (!responseState) {
            // Create a minimal state if none exists in DB
             responseState = {
                // id: -1, // Placeholder ID removed - not part of schema
                userSafeId: primarySafe.id,
                totalDeposited: liveTotalDeposited,
                allocatedTax: '0', // Default values
                allocatedLiquidity: '0',
                allocatedYield: '0',
                lastUpdated: new Date(), // Use current time as Date object
                // Add other fields from allocationStates schema with default/null values if needed
                lastCheckedUSDCBalance: '0', // Added default for potentially missing fields
                pendingDepositAmount: '0'   // Added default for potentially missing fields
             };
        } else {
            responseState.totalDeposited = liveTotalDeposited;
        }
    } else if (!responseState) {
         // If no DB state AND live balance fetch failed (or no address), return null
         console.log('No DB state found and live balance fetch failed or not possible.');
         // We already returned earlier if primarySafe wasn't found.
         // This case means primary safe exists, but no allocation record AND no live balance.
         // Returning null might be appropriate, matching the case where DB state is null and live fetch fails.
         // Alternatively, could return a zeroed-out state based on primarySafe.id. Let's return null for now.
         return NextResponse.json({ allocationState: null, message: 'Allocation state not found and live balance unavailable.' }, { status: 200 });
    }

    console.log('Final allocation state being returned:', responseState);
    return NextResponse.json({ allocationState: responseState }, { status: 200 });

  } catch (error) {
    console.error('Error processing allocation request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: `Failed to fetch allocation state: ${errorMessage}` }, { status: 500 });
  }
} 