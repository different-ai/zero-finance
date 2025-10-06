'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  LogIn,
  LogOut,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Calendar,
} from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { api } from '@/trpc/react';
import { steps } from './constants';
import { KybHelpSidebar } from '@/components/kyb-help-sidebar';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout, login, ready, authenticated } = usePrivy();

  const { data: customerStatus } = api.align.getCustomerStatus.useQuery(
    undefined,
    { enabled: ready && authenticated },
  );

  const isOnboardingComplete =
    customerStatus?.kycStatus === 'approved' ||
    customerStatus?.kycStatus === 'not_required';

  const currentStepIndex = steps.findIndex((step) =>
    pathname.startsWith(step.path),
  );

  const progressPercentage =
    currentStepIndex >= 0
      ? Math.round(((currentStepIndex + 1) / steps.length) * 100)
      : 0;

  const prevStep = currentStepIndex > 0 ? steps[currentStepIndex - 1] : null;
  const nextStep =
    currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1] : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F2]">
      <div className="bg-white border-b border-[#101010]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <div>
            <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
              ONBOARDING
            </p>
            <h1 className="mt-1 font-serif text-[24px] sm:text-[28px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
              Account Setup
            </h1>
          </div>
          {ready && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                if (authenticated) {
                  try {
                    await logout();
                    window.location.href = '/';
                  } catch (error) {
                    console.error('Logout error:', error);
                    window.location.href = '/';
                  }
                } else {
                  login();
                }
              }}
              className="mt-1 sm:mt-0"
            >
              {authenticated ? (
                <>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </>
              )}
            </Button>
          )}
        </div>

        <Progress value={progressPercentage} className="h-1 rounded-none" />
      </div>

      <div className="md:hidden bg-white border-b border-[#101010]/10 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium">
              {currentStepIndex + 1}
            </span>
            <span className="ml-2 text-sm font-medium">
              {steps[currentStepIndex]?.name}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 pb-1">
          {prevStep ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 px-2"
              asChild
            >
              <Link href={prevStep.path}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                {prevStep.name}
              </Link>
            </Button>
          ) : (
            <div></div>
          )}

          {nextStep && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 px-2"
              asChild
            >
              <Link href={nextStep.path}>
                {nextStep.name}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10 gap-6 lg:gap-8 flex-col lg:flex-row items-start">
        <main className="flex-1 flex flex-col items-start w-full order-2 lg:order-1">
          {isOnboardingComplete && (
            <Alert className="mb-4 sm:mb-6 w-full bg-green-100 border-green-400 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300">
              <CheckCircle className="h-4 w-4 text-green-700 dark:text-green-300" />
              <AlertTitle className="text-green-800 dark:text-green-200">
                Onboarding Completed!
              </AlertTitle>
              <AlertDescription>
                You&apos;ve successfully set up your account. You can now access
                your{' '}
                <Link
                  href="/dashboard"
                  className="font-medium text-green-800 dark:text-green-200 underline hover:no-underline"
                >
                  dashboard
                </Link>
                .
              </AlertDescription>
            </Alert>
          )}

          {children}
        </main>

        <aside className="hidden lg:flex w-full lg:w-[360px] flex-col gap-4 sticky top-24 self-start order-1 lg:order-2 flex-shrink-0">
          {(pathname === '/onboarding/info' ||
            pathname === '/onboarding/kyc') && <KybHelpSidebar />}
        </aside>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 -mt-2 mb-4 hidden sm:block lg:hidden">
        <div className="text-xs text-muted-foreground text-center">
          Step {currentStepIndex + 1} of {steps.length} • {progressPercentage}%
          complete
        </div>
      </div>

      <div className="lg:hidden bg-white border-t border-[#101010]/10 p-3 mt-2">
        <div className="text-center">
          <span className="text-sm font-semibold block">Need help?</span>
          <Link
            href="https://cal.com/potato/0-finance-onboarding"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-1"
          >
            <Calendar className="h-3 w-3" />
            Book Demo
          </Link>
        </div>
      </div>

      <footer className="py-2 sm:py-3 px-4 sm:px-6 text-center text-[#101010]/60 text-xs border-t border-[#101010]/10 mt-auto">
        <div className="max-w-4xl mx-auto">
          &copy; {new Date().getFullYear()} zero finance. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
