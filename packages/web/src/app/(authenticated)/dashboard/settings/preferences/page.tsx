'use client';

import { ArrowLeft, Monitor, Banknote, Cpu } from 'lucide-react';
import Link from 'next/link';
import { useBimodal } from '@/components/ui/bimodal';
import { cn } from '@/lib/utils';

export default function PreferencesPage() {
  const { isTechnical, toggle } = useBimodal();

  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#F7F7F2] border-b border-[#101010]/10">
        <div className="h-[60px] flex items-center px-4 sm:px-6 max-w-[1400px] mx-auto">
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center text-[13px] text-[#101010]/60 hover:text-[#101010] transition-colors mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Settings
          </Link>
          <div className="h-4 w-px bg-[#101010]/10 mr-4" />
          <h1 className="font-serif text-[24px] sm:text-[28px] leading-[1] text-[#101010]">
            Preferences
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-6 sm:py-8 max-w-[800px] mx-auto">
        {/* View Mode Section */}
        <div className="bg-white border border-[#101010]/10 rounded-lg p-5 sm:p-6">
          <div className="flex items-start gap-3 mb-6">
            <Monitor className="h-5 w-5 text-[#0050ff] mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="text-[15px] sm:text-[16px] font-medium text-[#101010]">
                View Mode
              </h2>
              <p className="mt-1 text-[13px] sm:text-[14px] text-[#101010]/70 leading-[1.5]">
                Choose how you want to see your account information
              </p>
            </div>
          </div>

          {/* Mode Selection Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Banking Mode Card */}
            <button
              type="button"
              onClick={() => isTechnical && toggle()}
              className={cn(
                'relative p-4 sm:p-5 rounded-lg border-2 text-left transition-all',
                !isTechnical
                  ? 'border-[#0050ff] bg-[#0050ff]/5'
                  : 'border-[#101010]/10 hover:border-[#101010]/20 bg-white',
              )}
            >
              {!isTechnical && (
                <div className="absolute top-3 right-3">
                  <div className="h-5 w-5 rounded-full bg-[#0050ff] flex items-center justify-center">
                    <svg
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={cn(
                    'h-10 w-10 rounded-lg flex items-center justify-center',
                    !isTechnical
                      ? 'bg-[#0050ff] text-white'
                      : 'bg-[#F7F7F2] text-[#101010]/60',
                  )}
                >
                  <Banknote className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-[14px] font-medium text-[#101010]">
                    Banking
                  </h3>
                  <p className="text-[12px] text-[#101010]/60">
                    I bank in dollars
                  </p>
                </div>
              </div>
              <p className="text-[13px] text-[#101010]/70 leading-[1.5]">
                Simple bank account view. See your balance in dollars, make
                deposits via ACH/wire, and earn yield on your savings.
              </p>
              <ul className="mt-3 space-y-1">
                <li className="text-[12px] text-[#101010]/60 flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#101010]/40" />
                  Familiar banking terminology
                </li>
                <li className="text-[12px] text-[#101010]/60 flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#101010]/40" />
                  ACH & wire transfer focus
                </li>
                <li className="text-[12px] text-[#101010]/60 flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#101010]/40" />
                  Clean, simplified interface
                </li>
              </ul>
            </button>

            {/* Technical/Crypto Mode Card */}
            <button
              type="button"
              onClick={() => !isTechnical && toggle()}
              className={cn(
                'relative p-4 sm:p-5 rounded-lg border-2 text-left transition-all',
                isTechnical
                  ? 'border-[#1B29FF] bg-[#1B29FF]/5'
                  : 'border-[#101010]/10 hover:border-[#101010]/20 bg-white',
              )}
            >
              {isTechnical && (
                <div className="absolute top-3 right-3">
                  <div className="h-5 w-5 rounded-full bg-[#1B29FF] flex items-center justify-center">
                    <svg
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={cn(
                    'h-10 w-10 rounded-lg flex items-center justify-center',
                    isTechnical
                      ? 'bg-[#1B29FF] text-white'
                      : 'bg-[#F7F7F2] text-[#101010]/60',
                  )}
                >
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h3
                    className={cn(
                      'text-[14px] font-medium',
                      isTechnical
                        ? 'text-[#1B29FF] font-mono'
                        : 'text-[#101010]',
                    )}
                  >
                    {isTechnical ? 'TECHNICAL' : 'Technical'}
                  </h3>
                  <p className="text-[12px] text-[#101010]/60">
                    I bank in crypto
                  </p>
                </div>
              </div>
              <p className="text-[13px] text-[#101010]/70 leading-[1.5]">
                Full on-chain view with wallet addresses, USDC balances, and
                direct crypto deposits to your Safe wallet.
              </p>
              <ul className="mt-3 space-y-1">
                <li className="text-[12px] text-[#101010]/60 flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#101010]/40" />
                  Wallet addresses & chain info
                </li>
                <li className="text-[12px] text-[#101010]/60 flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#101010]/40" />
                  Direct USDC deposits
                </li>
                <li className="text-[12px] text-[#101010]/60 flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#101010]/40" />
                  Multi-chain vault strategies
                </li>
              </ul>
            </button>
          </div>

          {/* Current Mode Indicator */}
          <div className="mt-6 pt-4 border-t border-[#101010]/10">
            <p className="text-[12px] text-[#101010]/50">
              Currently using:{' '}
              <span
                className={cn(
                  'font-medium',
                  isTechnical ? 'text-[#1B29FF]' : 'text-[#0050ff]',
                )}
              >
                {isTechnical ? 'Technical (Crypto)' : 'Banking (Fiat)'} mode
              </span>
            </p>
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-4 p-4 bg-[#F7F7F2] border border-[#101010]/10 rounded-lg">
          <p className="text-[13px] text-[#101010]/60 leading-[1.5]">
            <strong className="text-[#101010]">Note:</strong> You can switch
            modes anytime. Your account, balances, and settings remain the same
            — only the interface changes.
          </p>
        </div>
      </main>
    </div>
  );
}
