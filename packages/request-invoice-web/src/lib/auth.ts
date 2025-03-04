import { auth, currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

/**
 * Returns the current user's ID or redirects to sign-in if not authenticated
 */
export async function getUserIdOrRedirect() {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  return userId;
}

/**
 * Returns the current user object or redirects to sign-in if not authenticated
 */
export async function getUserOrRedirect() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }
  
  return user;
}

/**
 * Returns the user ID from auth() without redirecting
 * Useful for components that need to conditionally render based on auth state
 */
export function getUserId() {
  const { userId } = auth();
  return userId;
}

/**
 * Checks if the user is authenticated
 */
export function isAuthenticated() {
  return !!auth().userId;
}