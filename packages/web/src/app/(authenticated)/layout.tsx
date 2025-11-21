import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { userProfileService } from '@/lib/user-profile-service';
import { getUser } from '@/lib/auth';
import DashboardClientLayout from './dashboard/dashboard-client-layout';

// Force dynamic rendering since this layout uses cookies for authentication
export const dynamic = 'force-dynamic';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get Privy user object
  const privyUser = await getUser();

  // If no user, redirect to signin
  if (!privyUser) {
    redirect('/signin');
  }

  // Extract privyDid (user.id) and email
  const privyDid = privyUser.id;
  const email = privyUser.email?.address ?? '';

  // Get wallet addresses from Privy user
  const embeddedWalletAddress = (privyUser as any).wallet?.address;
  const smartWalletAccount = (privyUser as any).linkedAccounts?.find(
    (account: any) =>
      account.type === 'smart_wallet' || account.walletClientType === 'privy',
  );
  const smartWalletAddress = smartWalletAccount?.address;

  // Get user profile (will create if it doesn't exist, and update email/wallet addresses)
  // Get user profile (will create if it doesn't exist, and update email/wallet addresses)
  let userProfile;
  try {
    userProfile = await userProfileService.getOrCreateProfile(
      privyDid,
      email,
      embeddedWalletAddress,
      smartWalletAddress,
    );
  } catch (error) {
    console.error('Failed to get or create user profile:', error);
    // If we can't get a profile, we can't proceed. Redirect to signin or show error.
    // For now, let's redirect to signin to avoid the crash loop.
    redirect('/signin?error=profile_creation_failed');
  }

  console.log('userProfile', userProfile);

  // Render the dashboard for authenticated users only
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
