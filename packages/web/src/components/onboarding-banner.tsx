'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, X, Info, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface OnboardingBannerProps {
  onStartOnboarding?: () => void;
}

export function OnboardingBanner({ onStartOnboarding }: OnboardingBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [hasDismissed, setHasDismissed] = useState(false);

  // Check if the banner has been dismissed before
  useEffect(() => {
    const dismissed = localStorage.getItem('onboardingBannerDismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
      setHasDismissed(true);
    }
  }, []);

  const dismissBanner = () => {
    setIsVisible(false);
    localStorage.setItem('onboardingBannerDismissed', 'true');
    setHasDismissed(true);
  };

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
              Currently, we only support crypto payments in EURe on Gnosis Chain. Fiat integration and multi-chain support are coming soon!
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              {onStartOnboarding && (
                <button
                  onClick={onStartOnboarding}
                  className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Complete Onboarding <ArrowRight className="ml-1 h-3 w-3" />
                </button>
              )}
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