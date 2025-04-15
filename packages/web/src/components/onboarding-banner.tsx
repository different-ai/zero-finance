'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, X, Info, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/trpc/react';
import { useRouter } from 'next/navigation';

interface OnboardingBannerProps {
  onStartOnboarding?: () => void;
}

export function OnboardingBanner({ onStartOnboarding }: OnboardingBannerProps) {
  const [isVisible, setIsVisible] = useState(false); // Default to not visible until we confirm it should be shown
  const [hasDismissed, setHasDismissed] = useState(false);
  const router = useRouter();

  // Fetch onboarding status from the server
  const { data: onboardingStatus, isLoading } = api.onboarding.getOnboardingStatus.useQuery(
    undefined,
    {
      // Don't refetch on window focus to avoid flashing
      refetchOnWindowFocus: false,
      // Retry a few times in case of network issues
      retry: 3,
    }
  );

  // Determine visibility based on onboarding status and dismiss state
  useEffect(() => {
    // First check if banner was previously dismissed
    const dismissed = localStorage.getItem('onboardingBannerDismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
      setHasDismissed(true);
      return;
    }

    // Don't show if onboarding is completed
    if (onboardingStatus?.hasCompletedOnboarding) {
      setIsVisible(false);
      return;
    }

    // Show banner if user hasn't completed onboarding and hasn't dismissed the banner
    if (!isLoading && !onboardingStatus?.hasCompletedOnboarding && !hasDismissed) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [onboardingStatus, isLoading, hasDismissed]);

  const dismissBanner = () => {
    setIsVisible(false);
    localStorage.setItem('onboardingBannerDismissed', 'true');
    setHasDismissed(true);
  };

  const startOnboarding = () => {
    if (onStartOnboarding) {
      onStartOnboarding();
    } else {
      // Navigate to the onboarding welcome page
      router.push('/onboarding/welcome');
    }
  };

  // Don't render during loading or when not visible
  if (!isVisible) return null;

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-start gap-3">
          <div className="text-blue-500 flex-shrink-0 mt-0.5">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-800">Welcome to hyprsqrl Early Access</h3>
            <p className="text-xs text-blue-600 mt-1">
              Set up your account to get started.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <button
                onClick={startOnboarding}
                className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Complete Onboarding <ArrowRight className="ml-1 h-3 w-3" />
              </button>
              <Link 
                href="https://hyprsqrl.com/roadmap" 
                target="_blank"
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 hover:text-blue-800 hover:underline"
              >
                View Our Roadmap <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
              <Link 
                href="https://github.com/different-ai/hypr-v0/issues/new" 
                target="_blank"
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 hover:text-blue-800 hover:underline"
              >
                Request a Feature <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
        <button 
          onClick={dismissBanner}
          className="mt-2 md:mt-0 p-1 rounded-md text-blue-400 hover:text-blue-500 hover:bg-blue-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}