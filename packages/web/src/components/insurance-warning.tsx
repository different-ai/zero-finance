'use client';

import { useState, useEffect } from 'react';
import { api } from '@/trpc/react';
import { X, AlertTriangle, Mail, Calendar } from 'lucide-react';

interface InsuranceWarningProps {
  variant?: 'dashboard' | 'savings' | 'deposit' | 'onboarding';
  dismissible?: boolean;
  className?: string;
}

export function InsuranceWarning({
  variant = 'dashboard',
  dismissible = true,
  className = '',
}: InsuranceWarningProps) {
  const [dismissed, setDismissed] = useState(false);
  const { data: profile } = api.user.getProfile.useQuery();

  // Store dismissal in localStorage for 30 days
  useEffect(() => {
    const dismissedUntil = localStorage.getItem('insurance-warning-dismissed');
    if (dismissedUntil && new Date(dismissedUntil) > new Date()) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    const dismissedUntil = new Date();
    dismissedUntil.setDate(dismissedUntil.getDate() + 30);
    localStorage.setItem(
      'insurance-warning-dismissed',
      dismissedUntil.toISOString(),
    );
    setDismissed(true);
  };

  // Don't show if user is insured or warning is dismissed
  if (profile?.isInsured || dismissed) return null;

  const warningContent = {
    dashboard: {
      title: 'Your funds are not FDIC insured',
      message: 'DeFi yields carry smart contract risk.',
      severity: 'warning' as const,
    },
    savings: {
      title: '8% APY target • Not FDIC insured',
      message: 'Returns not guaranteed. Smart contract risks apply.',
      severity: 'warning' as const,
    },
    deposit: {
      title: 'Important: DeFi yields carry risk',
      message: 'Not FDIC insured. You may lose funds.',
      severity: 'error' as const,
    },
    onboarding: {
      title: 'Understanding DeFi Risks',
      message: 'Zero Finance offers DeFi yields, not traditional banking.',
      severity: 'info' as const,
    },
  };

  const content = warningContent[variant];

  const bgColor = {
    warning: 'bg-amber-50 border-amber-400',
    error: 'bg-red-50 border-red-400',
    info: 'bg-blue-50 border-blue-400',
  }[content.severity];

  const textColor = {
    warning: 'text-amber-700',
    error: 'text-red-700',
    info: 'text-blue-700',
  }[content.severity];

  const iconColor = {
    warning: 'text-amber-500',
    error: 'text-red-500',
    info: 'text-blue-500',
  }[content.severity];

  return (
    <div className={`${bgColor} border-l-4 p-4 mb-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${textColor}`}>
            {content.title}
          </h3>
          <div className={`mt-2 text-sm ${textColor}`}>
            <p>{content.message}</p>
            <div className="mt-3">
              <p className="font-medium mb-2">Want insurance coverage?</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:raghav@0.finance"
                  className={`inline-flex items-center gap-1 underline hover:no-underline ${textColor}`}
                >
                  <Mail className="h-4 w-4" />
                  raghav@0.finance
                </a>
                <a
                  href="https://cal.com/team/0finance/15?overlayCalendar=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 underline hover:no-underline ${textColor}`}
                >
                  <Calendar className="h-4 w-4" />
                  Book 15 min call
                </a>
              </div>
            </div>
          </div>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <button
              onClick={handleDismiss}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${iconColor} hover:opacity-70`}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
