'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
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
    { name: 'Create Safe', path: '/onboarding/create-safe' },
    { name: 'Info', path: '/onboarding/info' },
    { name: 'Complete', path: '/onboarding/complete' },
  ];

  // Get the current step index
  const currentStepIndex = steps.findIndex(step => step.path === pathname);

  const handleSignOut = async () => {
    try {
      await logout();
      // Optional: Redirect after sign out, e.g., to the sign-in page
      // window.location.href = '/sign-in';
      console.log('User logged out successfully via Privy');
    } catch (error) {
      console.error('Error logging out via Privy:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-end items-center">
          {user && (
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Log Out
            </Button>
          )}
        </div>
      </header>
      
      <header className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-white text-xl font-semibold">Welcome to hyprsqrl</h2>
        </div>
      </header>
      
      {/* Stepper */}
      <div className="px-6 py-3 bg-white border-b">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.path}>
                <div className="flex flex-col items-center text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    currentStepIndex >= index 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {currentStepIndex > index ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className="text-xs mt-1 text-muted-foreground">
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-colors ${
                    currentStepIndex > index ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
          {children}
        </div>
      </div>
    </div>
  );
} 