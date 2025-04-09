import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userSafes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { initializeAndDeploySafe } from '@/server/safe-deployment-service';
import { PrivyClient } from '@privy-io/server-auth';

// Initialize Privy client (ensure env vars are set)
const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

// Helper to get DID from request using Privy token
async function getPrivyDidFromRequest(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    console.warn('Missing Authorization header in /api/user/safes/create');
    return null;
  }

  const authToken = authHeader.replace(/^Bearer\s+/, '');
  if (!authToken) {
    console.warn('Malformed Authorization header in /api/user/safes/create');
    return null;
  }

  try {
    const claims = await privyClient.verifyAuthToken(authToken);
    // The user's DID is in the `userId` field of the claims
    return claims.userId;
  } catch (error) {
    console.error('Error verifying Privy auth token:', error);
    return null;
  }
}

// Define allowed safe types for creation
const ALLOWED_SECONDARY_SAFE_TYPES: Array<typeof userSafes.$inferInsert.safeType> = ['tax', 'liquidity', 'yield'];

export async function POST(request: NextRequest) {
  let safeType: typeof userSafes.$inferInsert.safeType | undefined;
  try {
    // 1. Authenticate the user (using Privy)
    const privyDid = await getPrivyDidFromRequest(request);
    if (!privyDid) {
      return NextResponse.json({ error: 'Unauthorized - Privy authentication failed' }, { status: 401 });
    }

    // 2. Parse and validate request body
    try {
      const body = await request.json();
      safeType = body.safeType;
      if (!ALLOWED_SECONDARY_SAFE_TYPES.includes(safeType)) {
        return NextResponse.json({ error: 'Invalid safeType provided. Must be one of: tax, liquidity, yield' }, { status: 400 });
      }
    } catch (parseError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // 3. Check for existing primary safe for the user
    const primarySafe = await db.query.userSafes.findFirst({
      where: and(
        eq(userSafes.userDid, privyDid),
        eq(userSafes.safeType, 'primary')
      ),
      columns: { safeAddress: true },
    });

    if (!primarySafe) {
      return NextResponse.json({ error: 'Primary safe not found. Cannot create secondary safe.' }, { status: 400 });
    }

    // 4. Check if a safe of the requested type already exists
    const existingSafe = await db.query.userSafes.findFirst({
      where: and(
        eq(userSafes.userDid, privyDid),
        eq(userSafes.safeType, safeType)
      ),
      columns: { id: true }, // Only need to check for existence
    });

    if (existingSafe) {
      return NextResponse.json({ error: `Safe of type '${safeType}' already exists for this user.` }, { status: 409 }); // 409 Conflict
    }

    // 5. Define Safe configuration
    const owners = [primarySafe.safeAddress]; // Primary safe is the owner
    const threshold = 1;
    // Optional: Generate a deterministic salt based on user DID and safe type
    // const saltNonce = ethers.utils.id(`${privyDid}-${safeType}`);
    const saltNonce = undefined; // Use default for now

    // 6. Call the Safe Deployment Service
    console.log(`Calling Safe Deployment Service for ${safeType} safe...`);
    const newSafeAddress = await initializeAndDeploySafe(owners, threshold, saltNonce);
    console.log(`Safe Deployment Service returned address: ${newSafeAddress}`);

    // 7. Insert the new safe record into the database
    const [insertedSafe] = await db
      .insert(userSafes)
      .values({
        userDid: privyDid,
        safeAddress: newSafeAddress, // Use the address returned by the service
        safeType: safeType,
      })
      .returning();

    // 8. Return success response
    return NextResponse.json({
      message: `${safeType.charAt(0).toUpperCase() + safeType.slice(1)} safe created successfully (using Privy authentication).`,
      data: insertedSafe,
    }, { status: 201 });

  } catch (error) {
    // Use the safeType variable directly (now accessible)
    console.error(`Error creating ${ safeType || 'unknown type' } safe:`, error);
    // Avoid logging potentially sensitive SDK errors directly to client
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error'; 
    // More specific error handling could be added here based on potential Safe SDK errors
    return NextResponse.json({ error: `Failed to create safe. ${errorMessage}` }, { status: 500 });
  }
} 