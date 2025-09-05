import React from 'react';
import { redirect } from 'next/navigation';
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
  console.log('AuthenticatedLayout');
  console.log('children', children);
  // Get Privy user object
  const privyUser = await getUser();

  if (!privyUser) {
    // If no user found (not authenticated or error), redirect to login
    redirect('/');
    return null;
  }

  // Extract privyDid (user.id) and email
  const privyDid = privyUser.id;
  const email = privyUser.email?.address ?? '';

  // Get user profile (will create if it doesn't exist)
  const userProfile = await userProfileService.getOrCreateProfile(
    privyDid,
    email,
  );

  console.log('userProfile', userProfile);
  // Redirect to onboarding if profile exists but onboarding is not complete
  // AND the user hasn't skipped or completed the stepper
  return (
    <>
      <DashboardClientLayout>{children}</DashboardClientLayout>
      <DemoModeWrapper />
    </>
  );
}
