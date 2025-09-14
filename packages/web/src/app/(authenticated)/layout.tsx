import React from 'react';
import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import { userProfileService } from '@/lib/user-profile-service';
import { getUser } from '@/lib/auth';
import DashboardClientLayout from './dashboard/dashboard-client-layout';
import { DemoModeWrapper } from '@/components/demo-mode-wrapper';

// Force dynamic rendering since this layout uses cookies for authentication
export const dynamic = 'force-dynamic';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check for demo mode cookie (set by middleware when ?demo=true)
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.has('zero-finance-demo-mode');

  // Get Privy user object
  const privyUser = await getUser();

  // If no user AND not in demo mode, redirect
  if (!privyUser && !isDemoMode) {
    redirect('/signin');
    return null;
  }

  // If we have a real user, get their profile
  if (privyUser) {
    // Extract privyDid (user.id) and email
    const privyDid = privyUser.id;
    const email = privyUser.email?.address ?? '';

    // Get user profile (will create if it doesn't exist)
    const userProfile = await userProfileService.getOrCreateProfile(
      privyDid,
      email,
    );

    console.log('userProfile', userProfile);
  }

  // Render the dashboard for both demo and authenticated users
  // DemoModeWrapper will detect ?demo=true and show the sidebar
  return (
    <>
      <DashboardClientLayout>{children}</DashboardClientLayout>
      <DemoModeWrapper />
    </>
  );
}
