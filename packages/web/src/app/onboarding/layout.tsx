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
    { name: 'Create Safe', path: '/onboarding/create-safe' },
    { name: 'Info', path: '/onboarding/info' },
    { name: 'Complete', path: '/onboarding/complete' },
  ];

  // Get the current step index
  const currentStepIndex = steps.findIndex(step => step.path === pathname);

  const handleSignOut = async () => {
    try {
      await logout();
      console.log('User logged out successfully via Privy');
    } catch (error) {
      console.error('Error logging out via Privy:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      {/* Top navigation bar */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-10 h-16 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center">
          <div className="text-[#111827] font-medium text-lg">hyprsqrl</div>
          {user && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="text-sm font-medium"
            >
              Log Out
            </Button>
          )}
        </div>
      </header>
      
      {/* Header with subtle gradient */}
      <div className="bg-gradient-to-r from-[#10B981]/5 to-[#10B981]/10 border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-[#111827] text-2xl font-semibold">Welcome to hyprsqrl</h1>
          <p className="text-[#6B7280] mt-2">Set up your account in just a few steps</p>
        </div>
      </div>
      
      {/* Enhanced stepper */}
      <div className="px-6 py-6 border-b border-[#E5E7EB] bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.path}>
                <div className="flex flex-col items-center text-center relative z-10">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                      currentStepIndex >= index 
                        ? 'bg-[#10B981] text-white' 
                        : 'bg-white text-[#6B7280] border border-[#E5E7EB]'
                    }`}
                  >
                    {currentStepIndex > index ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm mt-2 font-medium ${
                    currentStepIndex >= index
                      ? 'text-[#111827]'
                      : 'text-[#6B7280]'
                  }`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 relative">
                    <div className={`absolute top-[20px] h-0.5 w-full ${
                      currentStepIndex > index ? 'bg-[#10B981]' : 'bg-[#E5E7EB]'
                    }`} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content container with improved spacing and styling */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-8">
          {children}
        </div>
      </div>

      {/* Footer with subtle branding */}
      <footer className="py-6 px-6 text-center text-[#6B7280] text-sm">
        <div className="max-w-4xl mx-auto">
          <p>© {new Date().getFullYear()} hyprsqrl. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 