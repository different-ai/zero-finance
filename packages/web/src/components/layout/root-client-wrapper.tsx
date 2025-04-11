'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';

export function RootClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, authenticated } = usePrivy();

  // Ensure pathname is not null before using startsWith
  const isOnboarding = typeof pathname === 'string' && pathname.startsWith('/onboarding/');

  const handleSignOut = async () => {
    try {
      await logout();
      console.log('User logged out successfully via Privy, redirecting...');
      window.location.href = '/'; // Redirect to homepage
    } catch (error) {
      console.error('Error logging out via Privy:', error);
    }
  };

  return (
    <>
      {isOnboarding && authenticated && (
        <div className="bg-gray-100 border-b border-gray-300 py-2 px-4 flex justify-end sticky top-0 z-50">
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Log Out
          </Button>
        </div>
      )}
      {children}
    </>
  );
} 