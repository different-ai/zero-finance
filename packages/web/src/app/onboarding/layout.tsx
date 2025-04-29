'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Check } from 'lucide-react';
import { usePrivy, useUser } from '@privy-io/react-auth';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useUser();
  const { logout } = usePrivy();

  // Define our steps and their corresponding routes
  const steps = [
    { name: 'Welcome', path: '/onboarding/welcome' },
    { name: 'Info', path: '/onboarding/info' },
    { name: 'Activate Primary Account', path: '/onboarding/create-safe' },
    {
      name: "Let's set up your tax account",
      path: '/onboarding/tax-account-setup',
    },
    { name: 'Complete', path: '/onboarding/complete' },
  ];

  // Get the current step index
  const currentStepIndex = steps.findIndex((step) =>
    pathname.startsWith(step.path),
  );

  const handleSignOut = async () => {
    try {
      await logout();
      console.log('User logged out successfully via Privy');
    } catch (error) {
      console.error('Error logging out via Privy:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fb]">
      {/* Header */}
      <div className="bg-gradient-to-b from-background to-muted/40 border-b border-border/40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-foreground text-2xl font-semibold">
            Account Setup
          </h1>
          <p className="text-muted-foreground mt-1">
            Just a few steps to get your secure account ready.
          </p>
        </div>
      </div>

      {/* Responsive flex: column on mobile, row on desktop */}
      <div className="flex flex-1 w-full max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 py-10 gap-6 flex-col lg:flex-row items-start">
        {/* Main Content Card */}
        <main className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-lg bg-white dark:bg-card rounded-xl shadow-lg p-8 sm:p-10 mx-auto">
            {children}
          </div>
        </main>

        {/* Sidebar Stepper & Help */}
        <aside className="w-full max-w-xs lg:w-80 flex flex-col gap-6 lg:sticky lg:top-24">
          {/* Stepper */}
          <div className="bg-white dark:bg-card rounded-xl border border-border/60 shadow-sm p-5">
            <ol className="flex flex-row lg:flex-col gap-3 lg:gap-4">
              {steps.map((step, index) => {
                const isCompleted = currentStepIndex > index;
                const isCurrent = currentStepIndex === index;
                return (
                  <li key={step.path} className="flex items-center gap-3 min-h-[36px]">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border text-sm font-semibold transition-colors ${
                        isCompleted
                          ? 'bg-primary text-primary-foreground border-primary'
                          : isCurrent
                          ? 'bg-background text-primary border-primary ring-2 ring-primary/30'
                          : 'bg-muted text-muted-foreground border-border'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium truncate ${
                        isCurrent
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {step.name}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Help/Support Section */}
          <div className="bg-white dark:bg-card rounded-xl border border-border/60 shadow-sm p-5 flex flex-col items-center text-center mt-auto">
            <span className="text-base font-semibold mb-1">Having trouble?</span>
            <span className="text-xs text-muted-foreground mb-3">
              Feel free to contact us and we will always help you through the process.
            </span>
            <button
              className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
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

      {/* Footer */}
      <footer className="py-3 px-6 text-center text-muted-foreground text-xs border-t border-border/40">
        <div className="max-w-4xl mx-auto">
          &copy; {new Date().getFullYear()} hyprsqrl. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
