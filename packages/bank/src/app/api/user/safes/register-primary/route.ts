import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userSafes, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { PrivyClient } from '@privy-io/server-auth';
import { isAddress } from 'viem';

// Initialize Privy client
const privyClient = new PrivyClient(
  process.env.PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

// Helper to get DID from request using Privy token
async function getPrivyDidFromRequest(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    console.warn('Missing Authorization header in /api/user/safes/register-primary');
    return null;
  }
  const authToken = authHeader.replace(/^Bearer\s+/, '');
  if (!authToken) {
    console.warn('Malformed Authorization header in /api/user/safes/register-primary');
    return null;
  }
  try {
    const claims = await privyClient.verifyAuthToken(authToken);
    return claims.userId;
  } catch (error) {
    console.error('Error verifying Privy auth token in /api/user/safes/register-primary:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  let safeAddress: string | undefined;
  try {
    // 1. Authenticate the user
    const privyDid = await getPrivyDidFromRequest(request);
    if (!privyDid) {
      return NextResponse.json({ error: 'Unauthorized - Privy authentication failed' }, { status: 401 });
    }

    // 2. Parse and validate request body
    try {
      const body = await request.json();
      safeAddress = body.safeAddress;
      if (!safeAddress || !isAddress(safeAddress)) {
        return NextResponse.json({ error: 'Invalid or missing safeAddress provided.' }, { status: 400 });
      }
    } catch (parseError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // 3. Check if the user exists (optional, but good practice)
    const userExists = await db.query.users.findFirst({
      where: eq(users.privyDid, privyDid),
      columns: { privyDid: true }
    });
    // If user doesn't exist in our DB yet (e.g., first interaction), 
    // ideally, they should be created during login/auth flow.
    // For now, we proceed, assuming the DID is valid.
    // if (!userExists) { ... handle user creation or error ... }

    // 4. Check if a primary safe ALREADY exists for this user
    const existingPrimary = await db.query.userSafes.findFirst({
      where: and(
        eq(userSafes.userDid, privyDid),
        eq(userSafes.safeType, 'primary')
      ),
      columns: { id: true }
    });

    if (existingPrimary) {
      return NextResponse.json({ error: 'A primary safe is already registered for this user.' }, { status: 409 }); // 409 Conflict
    }

    // 5. TODO (Optional but Recommended): Add on-chain verification
    // - Verify `safeAddress` is a valid Gnosis Safe contract on Base.
    // - Verify the user's Privy wallet address (need to get this from claims or another source)
    //   is listed as an owner/signer of the `safeAddress` on-chain.
    // This requires a library like ethers/viem and interacting with Safe contracts.
    console.warn(`On-chain verification for safe ${safeAddress} and user ${privyDid} is not implemented.`);

    // 6. Insert the new primary safe record
    const [insertedSafe] = await db
      .insert(userSafes)
      .values({
        userDid: privyDid,
        safeAddress: safeAddress, // Use the validated address from input
        safeType: 'primary',
      })
      .returning();

    // 7. Return success response
    return NextResponse.json({
      message: `Primary safe registered successfully.`,
      data: insertedSafe,
    }, { status: 201 });

  } catch (error) {
    console.error('Error registering primary safe:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: `Failed to register primary safe: ${errorMessage}` }, { status: 500 });
  }
} 