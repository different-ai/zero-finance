import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { redirect } from 'next/navigation';
import { userProfileService } from '@/lib/user-profile-service';
import { getSessionUser } from '@/lib/auth';

export default async function AuthenticatedLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Get current user session
  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.privyDid) {
    // Should not happen in authenticated layout, but handle defensively
    // Redirect to login or show an error page
    redirect('/'); // Redirect to home/login
    return null; // Stop rendering
  }

  // Get user profile (will create if it doesn't exist)
  const userProfile = await userProfileService.getOrCreateProfile(
    sessionUser.privyDid,
    sessionUser.email ?? '' // Provide email, default to empty string if null/undefined
  );

  // Redirect to onboarding if profile exists but onboarding is not complete
  if (userProfile && !userProfile.hasCompletedOnboarding) {
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