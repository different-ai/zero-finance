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
    <div className="min-h-screen flex flex-col bg-muted/40">
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
      <div className="flex flex-1 w-full max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 py-8 gap-8 flex-col lg:flex-row">
        {/* Main Content Card */}
        <main className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-xl bg-white dark:bg-card rounded-2xl shadow-xl p-8 sm:p-10 mx-auto">
            {children}
          </div>
        </main>

        {/* Sidebar Stepper & Help */}
        <aside className="w-full lg:w-80 flex flex-col gap-8">
          {/* Stepper */}
          <div className="bg-white dark:bg-card rounded-2xl shadow p-6">
            <ol className="flex flex-row lg:flex-col gap-4 lg:gap-6">
              {steps.map((step, index) => (
                <li key={step.path} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors text-base font-semibold ${
                      currentStepIndex > index
                        ? 'bg-primary text-primary-foreground border-primary'
                        : currentStepIndex === index
                        ? 'bg-background text-primary border-primary'
                        : 'bg-muted text-muted-foreground border-border'
                    }`}
                  >
                    {currentStepIndex > index ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium truncate ${
                      currentStepIndex >= index
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step.name}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Help/Support Section */}
          <div className="bg-white dark:bg-card rounded-2xl shadow p-6 flex flex-col items-center text-center mt-auto">
            <span className="text-lg mb-2">Having trouble?</span>
            <span className="text-sm text-muted-foreground mb-4">
              Feel free to contact us and we will always help you through the process.
            </span>
            <button
              className="bg-primary text-primary-foreground rounded-lg px-4 py-2 font-medium hover:bg-primary/90 transition-colors"
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
