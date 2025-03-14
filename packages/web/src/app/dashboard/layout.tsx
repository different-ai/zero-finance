import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { OnboardingBanner } from '@/components/onboarding-banner';
import { OnboardingFlow } from '@/components/onboarding-flow';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  
  // If the user is not authenticated, redirect to the sign-in page
  if (!userId) {
    redirect("/sign-in");
  }
  
  return (
    <>
      <OnboardingFlow />
      <OnboardingBanner />
      <div className="container mx-auto px-4 md:px-8 pt-4 pb-12">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 mb-8">
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
                />
              </div>
              <span className="logo-text font-medium text-lg tracking-tight">Dashboard</span>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
          
          <nav className="flex flex-col gap-2">
            <Link
              href="/dashboard/invoices"
              className="nostalgic-button-secondary px-4 py-2 text-sm font-medium w-full text-center"
            >
              Invoices
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
        
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
    </>
  );
}