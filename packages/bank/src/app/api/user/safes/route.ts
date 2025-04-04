import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userSafes } from '@/db/schema';
import { eq } from 'drizzle-orm';

// TODO: Replace this placeholder with actual Privy authentication logic
async function getPrivyDidFromRequest(request: NextRequest): Promise<string | null> {
  console.warn('Using placeholder Privy DID in /api/user/safes');
  // Replace with your actual authentication logic
  // const session = await getServerSession(authOptions);
  // return session?.user?.privyDid || null;
  return "did:privy:placeholder-user-id-123"; 
}

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate the user (using placeholder)
    const privyDid = await getPrivyDidFromRequest(request);
    if (!privyDid) {
      return NextResponse.json({ error: 'Unauthorized - Privy DID missing' }, { status: 401 });
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