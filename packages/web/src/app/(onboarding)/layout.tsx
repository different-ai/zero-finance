'use client';

import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, ready, authenticated } = usePrivy();
  const router = useRouter();
  const userEmail = user?.email?.address || user?.google?.email || '';

  useEffect(() => {
    // Redirect to signin if not authenticated
    if (ready && !authenticated) {
      router.push('/signin');
    }
  }, [ready, authenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/signin');
  };

  if (!ready || !authenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#1B29FF] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F5EF] relative">
      {/* Simple header with user info */}
      <header className="absolute top-0 left-0 right-0 z-10 px-4 sm:px-6 py-4 bg-[#F7F7F2]">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/new-logo-bluer.png"
              alt="Zero Finance"
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
            />
            <span className="ml-1 font-bold text-[13px] sm:text-[14px] tracking-tight text-[#0050ff]">
              finance
            </span>
          </div>
          
          {/* User info and logout */}
          <div className="flex items-center gap-4">
            <span className="text-[14px] text-[#101010]/60 hidden sm:block">
              {userEmail}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-[14px] text-[#101010]/60 hover:text-[#101010] transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      {children}
    </div>
  );
}
