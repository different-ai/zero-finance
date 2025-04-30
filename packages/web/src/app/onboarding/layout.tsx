'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Check, LogIn, LogOut } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout, login, ready, authenticated } = usePrivy();

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
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-foreground text-2xl font-semibold">
              Account Setup
            </h1>
            <p className="text-muted-foreground mt-1">
              Just a few steps to get your secure account ready.
            </p>
          </div>
          {ready && (
            <Button
              variant="outline"
              size="sm"
              onClick={authenticated ? logout : login}
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
      </div>

      {/* Main Onboarding Section: tighter, visually grouped */}
      <div className="flex flex-1 w-full max-w-4xl mx-auto px-2 sm:px-6 lg:px-8 py-10 gap-4 flex-col lg:flex-row items-start">
        {/* Main Content Card */}
        <main className="flex-1 flex items-start ">
          {children}
        </main>

        {/* Sidebar Stepper & Help */}
        <aside className="w-full max-w-xs lg:w-72 flex flex-col gap-4 sticky top-24 self-start">
          {/* Stepper */}
          <div className="bg-white dark:bg-card rounded-xl border border-border/40 shadow-sm p-4 flex flex-col gap-1">
            <ol className="flex flex-row lg:flex-col gap-2 lg:gap-3">
              {steps.map((step, index) => {
                const isCompleted = currentStepIndex > index;
                const isCurrent = currentStepIndex === index;
                return (
                  <li key={step.path} className="flex items-center gap-2 min-h-[32px]">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs font-semibold transition-colors ${
                        isCompleted
                          ? 'bg-primary text-primary-foreground border-primary'
                          : isCurrent
                          ? 'bg-background text-primary border-primary ring-2 ring-primary/30'
                          : 'bg-muted text-muted-foreground border-border'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium truncate ${
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
          <div className="bg-white dark:bg-card rounded-xl border border-border/40 shadow-sm p-4 flex flex-col items-center text-center mt-auto">
            <span className="text-sm font-semibold mb-1">Having trouble?</span>
            <span className="text-xs text-muted-foreground mb-2">
              Feel free to contact us and we will always help you through the process.
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

      {/* Footer */}
      <footer className="py-3 px-6 text-center text-muted-foreground text-xs border-t border-border/40">
        <div className="max-w-4xl mx-auto">
          &copy; {new Date().getFullYear()} hyprsqrl. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
