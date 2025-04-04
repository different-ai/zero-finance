import { NextRequest, NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs/server'; // Removed Clerk
import { db } from '@/db'; // Adjust import path as needed
import { userSafes } from '@/db/schema';
import { eq } from 'drizzle-orm';

// TODO: Replace this placeholder with actual Privy authentication logic
// This might involve middleware, request headers, or a dedicated auth library
async function getPrivyDidFromRequest(request: NextRequest): Promise<string | null> {
  // Example: Reading from a custom header (adjust as needed)
  // const did = request.headers.get('X-Privy-DID');
  // For now, using a placeholder for development
  console.warn('Using placeholder Privy DID in /api/user/safes');
  return "did:privy:placeholder-user-id-123"; 
}

export async function GET(request: NextRequest) { // Changed type to NextRequest
  try {
    // 1. Authenticate the user (using placeholder)
    const privyDid = await getPrivyDidFromRequest(request);

    if (!privyDid) {
      return NextResponse.json({ error: 'Unauthorized - Privy DID missing' }, { status: 401 });
    }

    // 2. Fetch safes from the database
    const safes = await db
      .select()
      .from(userSafes)
      .where(eq(userSafes.userDid, privyDid));

    // 3. Return the safes
    return NextResponse.json(safes);
  } catch (error) {
    console.error('Error fetching user safes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 