'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Check,
  LogIn,
  LogOut,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { api } from '@/trpc/react';
import { cn } from '@/lib/utils';
// Define our steps and their corresponding routes
export const steps = [
  { name: 'Welcome', path: '/onboarding/welcome' },
  { name: 'Add Email', path: '/onboarding/add-email' },
  { name: 'Activate Primary Account', path: '/onboarding/create-safe' },
  { name: 'Verify Identity', path: '/onboarding/kyc' },
  { name: 'KYC Pending Review', path: '/onboarding/kyc-pending-review' },
  { name: 'Complete', path: '/onboarding/complete' },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, login, ready, authenticated, user } = usePrivy();

  // Fetch customer status to check if onboarding is complete
  const { data: customerStatus, isLoading } =
    api.align.getCustomerStatus.useQuery(
      undefined, // no input
      { enabled: ready && authenticated }, // Only run if user is logged in
    );

  const isOnboardingComplete = customerStatus?.kycStatus === 'approved';

  // Get the current step index
  const currentStepIndex = steps.findIndex((step) =>
    pathname.startsWith(step.path),
  );

  // Calculate progress percentage
  const progressPercentage =
    currentStepIndex >= 0
      ? Math.round(((currentStepIndex + 1) / steps.length) * 100)
      : 0;

  // Logic for mobile step navigation
  const prevStep = currentStepIndex > 0 ? steps[currentStepIndex - 1] : null;
  const nextStep =
    currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1] : null;

  // Fetch user profile to access persisted email (may differ from Privy user obj)
  const { data: userProfile } = api.user.getProfile.useQuery(undefined, {
    enabled: ready && authenticated, // only fetch when auth ready
    staleTime: 5 * 60 * 1000,
  });



  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fb] bg-gradient-to-br from-slate-50 to-sky-100 ">
      {/* Header - simplified for mobile */}
      <div className="flex-col bg-gradient-to-b from-background to-muted/40 border-b border-border/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-0 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <div>
            <h1 className="text-foreground text-xl sm:text-2xl font-semibold">
              Account Setup
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5 sm:mt-1">
              Just a few steps to get your secure account ready.
            </p>
          </div>
          {ready && (
            <Button
              variant="outline"
              size="sm"
              onClick={authenticated ? logout : login}
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

        {/* Add progress bar beneath header - visible on all screens */}
        <Progress value={progressPercentage} className="h-1 rounded-none" />
      </div>

      {/* Mobile Progress Indicator - visible only on small screens */}
      <div className="md:hidden bg-white border-b border-border/40 px-4 py-2">
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

        {/* Mobile Step Navigation */}
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

      {/* Main Onboarding Section */}
      <div className="flex flex-1 w-full max-w-4xl mx-auto px-4 sm:px-0 lg:px-0 py-4 sm:py-6 lg:py-10 gap-4 flex-col lg:flex-row items-start ">
        {/* Main Content Card */}
        <main className="flex-1 flex flex-col items-start w-full order-2 lg:order-1">
          {/* --- Onboarding Completed Banner --- */}
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
          {/* --- End Banner --- */}

          {children}
        </main>

        {/* Sidebar Stepper & Help - hidden on mobile, shown on desktop */}
        <aside className="hidden lg:flex w-full lg:w-72 flex-col gap-4 sticky top-24 self-start order-1 lg:order-2">
          {/* Stepper */}
          <div className="bg-white dark:bg-card rounded-xl border border-border/40 shadow-sm p-4 flex flex-col gap-1">
            <ol className="flex flex-col gap-3">
              {steps.map((step, index) => {
                const isCompleted = currentStepIndex > index;
                const isCurrent = currentStepIndex === index;
                return (
                  <li
                    key={step.path}
                    className="flex items-center gap-2 min-h-[32px]"
                  >
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center border text-xs font-semibold transition-colors',
                        isCompleted
                          ? 'bg-primary text-primary-foreground border-primary'
                          : isCurrent
                            ? 'bg-background text-primary border-primary ring-2 ring-primary/30'
                            : 'bg-muted text-muted-foreground border-border',
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={cn(
                        'text-xs font-medium truncate',
                        isCurrent ? 'text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {step.name}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Help/Support Section */}
          <div className="bg-white dark:bg-card rounded-xl border border-border/40 shadow-sm p-4 flex flex-col items-center text-center mt-auto">
            <span className="text-sm font-semibold mb-1">Having trouble?</span>
            <span className="text-xs text-muted-foreground mb-2">
              Feel free to contact us and we will always help you through the
              process.
            </span>
            <button
              className="bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-primary/90 transition-colors"
              onClick={() => {
                // TODO: Implement contact support
                alert('Contact support coming soon!');
              }}
            >
              Contact us
            </button>
          </div>
        </aside>
      </div>

      {/* Add a text progress indicator beneath the content */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 -mt-2 mb-4 hidden sm:block lg:hidden">
        <div className="text-xs text-muted-foreground text-center">
          Step {currentStepIndex + 1} of {steps.length} • {progressPercentage}%
          complete
        </div>
      </div>

      {/* Mobile Bottom Help - Only visible on mobile */}
      <div className="lg:hidden bg-white border-t border-border/40 p-3 mt-2">
        <div className="text-center">
          <span className="text-sm font-semibold block">Having trouble?</span>
          <button
            className="mt-2 bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-primary/90 transition-colors"
            onClick={() => {
              window.location.href = 'mailto:ben@0.finance';
            }}
          >
            Contact us
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-2 sm:py-3 px-4 sm:px-6 text-center text-muted-foreground text-xs border-t border-border/40 mt-auto">
        <div className="max-w-4xl mx-auto">
          &copy; {new Date().getFullYear()} zero finance. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
