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

  // Get user profile (will create if it doesn't exist)
  const userProfile = await userProfileService.getOrCreateProfile(
    privyDid,
    email,
  );

  console.log('userProfile', userProfile);

  // Render the dashboard for authenticated users only
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
