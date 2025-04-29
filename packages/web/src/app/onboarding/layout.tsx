'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    { name: 'Activate Primary Account', path: '/onboarding/create-safe' },
    { name: 'Tax Setup', path: '/onboarding/tax-account-setup' },
    { name: 'Info', path: '/onboarding/info' },
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
      {/* Header with a very subtle gradient or solid color */}
      <div className="bg-gradient-to-b from-background to-muted/40 border-b border-border/40">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-foreground text-2xl font-semibold">
            Account Setup
          </h1>
          <p className="text-muted-foreground mt-1">
            Just a few steps to get your secure account ready.
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="px-6 py-5 border-b border-border/40 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.path}>
                <div className="flex flex-col items-center text-center relative z-10 flex-shrink-0 w-20">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border ${
                      currentStepIndex >= index
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card text-muted-foreground border-border'
                    }`}
                  >
                    {currentStepIndex > index ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium truncate w-full ${
                      currentStepIndex >= index
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-px bg-border relative mx-2">
                    <div
                      className={`absolute top-0 left-0 h-full bg-primary transition-all duration-300 ${
                        currentStepIndex > index ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Content container */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>

      {/* Footer */}
      <footer className="py-4 px-6 text-center text-muted-foreground text-xs">
        <div className="max-w-4xl mx-auto">
          © {new Date().getFullYear()} hyprsqrl. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
