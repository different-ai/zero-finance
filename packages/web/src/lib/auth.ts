'use server';

import { cookies } from 'next/headers';
import { PrivyClient } from '@privy-io/server-auth';

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

/**
 * Gets the user ID from Privy authentication token
 * @returns The user ID or null if not authenticated
 */
export async function getUserId(): Promise<string | null> {
  try {
    // In Next.js 14, cookies() returns a Promise
    const cookieStore = await cookies();
    const authorizationToken = cookieStore.get('privy-token')?.value;
    
    if (!authorizationToken) {
      return null;
    }
    
    // Verify the token and get the user
    const { userId } = await privyClient.verifyAuthToken(authorizationToken);
    return userId;
  } catch (error) {
    console.error('Error verifying Privy token:', error);
    return null;
  }
}

/**
 * Similar to the old auth() function, gets userId without redirecting
 * Use this in server actions
 */
export async function getAuthUserId(): Promise<string | null> {
  return getUserId();
}

/**
 * Checks if a user is authenticated
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const userId = await getUserId();
  return !!userId;
}

/**
 * Gets user data from Privy
 */
export async function getUser() {
  const userId = await getUserId();
  
  if (!userId) {
    return null;
  }
  
  try {
    const user = await privyClient.getUser(userId);
    return user;
  } catch (error) {
    console.error('Error fetching Privy user:', error);
    return null;
  }
}