'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePrivy } from '@privy-io/react-auth';
import { UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function DashboardNav() {
  const { authenticated, user, logout } = usePrivy();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="nostalgic-container p-6 flex flex-col gap-5 w-full md:w-60 border border-primary/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="">
            <Image
              src="/request-req-logo.png"
              alt="hyprsqrl Logo"
              width={24}
              height={24}
              className="blue-overlay"
              priority
            />
          </div>
          <span className="logo-text font-medium text-lg tracking-tight">Dashboard</span>
        </div>
        
        {/* User avatar/profile button */}
        {authenticated && (
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center rounded-full w-8 h-8 bg-gray-100 hover:bg-gray-200"
          >
            {/* Privy doesn't have the same user.avatar structure as Clerk */}
            {/* Display a user circle for all users */}
            <UserCircle className="h-6 w-6 text-gray-600" />
          </button>
        )}
      </div>
      
      <nav className="flex flex-col gap-2">
        <Link
          href="/dashboard/invoices"
          className="nostalgic-button-secondary px-4 py-2 text-sm font-medium w-full text-center"
        >
          Invoices
        </Link>
        <Link
          href="/dashboard/bank"
          className="nostalgic-button-secondary px-4 py-2 text-sm font-medium w-full text-center"
        >
          Banking
        </Link>
        <Link
          href="/dashboard/settings"
          className="nostalgic-button-secondary px-4 py-2 text-sm font-medium w-full text-center"
        >
          Settings
        </Link>
        <Link
          href="/create-invoice"
          className="nostalgic-button mt-4 px-4 py-2 text-sm font-medium w-full text-center text-white"
        >
          + New Invoice
        </Link>
      </nav>
    </div>
  );
} 