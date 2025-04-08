'use client'

import React from 'react';
import { redirect } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, authenticated } = usePrivy();

  // Show loading state if Privy is not ready yet
  if (!ready) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // If the user is not authenticated, redirect to the sign-in page
  if (ready && !authenticated) {
    window.location.href = '/'; // Using window.location since client component can't use redirect
    return null;
  }
  
  return (
    <div className="flex min-h-screen bg-[#f8faff]">
      <div className="hidden md:block md:w-64">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 gap-5 md:gap-6 mt-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}