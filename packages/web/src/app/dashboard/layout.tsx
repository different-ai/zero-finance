import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { redirect } from 'next/navigation';
import { userProfileService } from '@/lib/user-profile-service';
import { getUser } from '@/lib/auth';

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
  if (userProfile && !userProfile.hasCompletedOnboarding) {
    redirect('/onboarding/welcome');
  }
  // or if some reason no primary safe is created, redirect to onboarding
  if (!userProfile?.primarySafeAddress) {
    redirect('/onboarding/welcome');
  }

  // If onboarding is complete, render the layout
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 border-r border-gray-200 flex-shrink-0 h-full overflow-y-auto">
        <Sidebar />
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
