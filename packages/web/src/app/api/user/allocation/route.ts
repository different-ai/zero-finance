import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userSafes, allocationStates } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { PrivyClient } from '@privy-io/server-auth';
import { Address } from 'viem';
import { getSafeBalance } from '@/server/services/safe.service';

// Initialize Privy client
const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

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
async function getBalance(safeAddress: Address | undefined | null): Promise<string> {
  const balance = await getSafeBalance({ safeAddress });
  return balance?.raw.toString() ?? '0';
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

    // 4. Fetch balances concurrently for each safe type we care about
    const [
      primaryBalance,
      taxBalance,
      liquidityBalance,
      yieldBalance,
    ] = await Promise.all([
      getBalance(safeAddresses['primary']),
      getBalance(safeAddresses['tax']),
      getBalance(safeAddresses['liquidity']),
      getBalance(safeAddresses['yield']),
    ]);

    // 4b. Compute the live total deposited amount by summing all individual safe balances
    const balancesAsBigInt = [primaryBalance, taxBalance, liquidityBalance, yieldBalance]
      .filter(Boolean)
      .map((b) => BigInt(b));

    const liveTotalDepositedBigInt = balancesAsBigInt.reduce((sum, bal) => sum + bal, 0n);
    const liveTotalDeposited = liveTotalDepositedBigInt.toString();

    console.log('Live balances fetched:', {
      primaryBalance,
      taxBalance,
      liquidityBalance,
      yieldBalance,
      liveTotalDeposited,
      safeAddresses,
    });

    // 5. Construct the final response state with correct per-safe allocations
    const responseState = {
      userSafeId: primarySafeId,
      totalDeposited: liveTotalDeposited,
      allocatedTax: taxBalance,
      allocatedLiquidity: liquidityBalance,
      allocatedYield: yieldBalance,
      lastUpdated: new Date(),
      lastCheckedUSDCBalance: '0', // retained for backward compatibility – consider removing later
      pendingDepositAmount: '0',
    };

    console.log('Final allocation state being returned:', responseState);

    return NextResponse.json({ allocationState: responseState }, { status: 200 });

  } catch (error) {
    console.error('Error processing allocation request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: `Failed to fetch allocation state: ${errorMessage}` }, { status: 500 });
  }
} 