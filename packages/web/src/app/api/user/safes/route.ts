import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userSafes } from '@/db/schema';
import { eq } from 'drizzle-orm';
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
    console.warn('Missing Authorization header in /api/user/safes');
    return null;
  }

  const authToken = authHeader.replace(/^Bearer\s+/, '');
  if (!authToken) {
    console.warn('Malformed Authorization header in /api/user/safes');
    return null;
  }

  try {
    const claims = await privyClient.verifyAuthToken(authToken);
    return claims.userId;
  } catch (error) {
    console.error('Error verifying Privy auth token in /api/user/safes:', error);
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

    // 2. Fetch all safes associated with the user's DID
    const safes = await db.query.userSafes.findMany({
      where: eq(userSafes.userDid, privyDid),
      orderBy: (safes, { asc }) => [asc(safes.createdAt)], // Optional: Order by creation time
    });

    // 3. Return the list of safes
    // Note: Returns an empty array if the user has no safes yet, which is valid.
    return NextResponse.json(safes, { status: 200 });

  } catch (error) {
    console.error('Error fetching user safes:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: `Failed to fetch user safes: ${errorMessage}` }, { status: 500 });
  }
} 