import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userSafes, allocationStates } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { PrivyClient } from '@privy-io/server-auth';

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

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate the user (using Privy)
    const privyDid = await getPrivyDidFromRequest(request);
    if (!privyDid) {
      return NextResponse.json({ error: 'Unauthorized - Privy authentication failed' }, { status: 401 });
    }

    // 2. Find the user's primary safe
    const primarySafe = await db.query.userSafes.findFirst({
      where: and(
        eq(userSafes.userDid, privyDid),
        eq(userSafes.safeType, 'primary')
      ),
      columns: { id: true }, // We only need the ID to link to allocation state
    });

    if (!primarySafe) {
      // It's possible the user is authenticated but hasn't had a primary safe registered yet
      return NextResponse.json({ allocationState: null, message: 'Primary safe not found.' }, { status: 200 });
    }

    // 3. Fetch the allocation state using the primary safe's ID
    const state = await db.query.allocationStates.findFirst({
      where: eq(allocationStates.userSafeId, primarySafe.id),
    });

    // 4. Return the allocation state (or null if not found)
    return NextResponse.json({ allocationState: state || null }, { status: 200 });

  } catch (error) {
    console.error('Error fetching allocation state:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: `Failed to fetch allocation state: ${errorMessage}` }, { status: 500 });
  }
} 