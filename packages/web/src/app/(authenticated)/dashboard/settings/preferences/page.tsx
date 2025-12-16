'use client';

import { ArrowLeft, Monitor, Banknote, Cpu } from 'lucide-react';
import Link from 'next/link';
import { useBimodal, BlueprintGrid, Crosshairs } from '@/components/ui/bimodal';
import { cn } from '@/lib/utils';

export default function PreferencesPage() {
  const { isTechnical, toggle } = useBimodal();

  return (
    <div
      className={cn(
        'min-h-screen',
        isTechnical ? 'bg-[#F8F9FA]' : 'bg-[#F7F7F2]',
      )}
    >
      {/* Header */}
      <header
        className={cn(
          'sticky top-0 z-40 border-b',
          isTechnical
            ? 'bg-[#F8F9FA] border-[#1B29FF]/20'
            : 'bg-[#F7F7F2] border-[#101010]/10',
        )}
      >
        <div className="h-[60px] flex items-center px-4 sm:px-6 max-w-[1400px] mx-auto">
          <Link
            href="/dashboard/settings"
            className={cn(
              'inline-flex items-center text-[13px] transition-colors mr-4',
              isTechnical
                ? 'text-[#1B29FF]/60 hover:text-[#1B29FF] font-mono'
                : 'text-[#101010]/60 hover:text-[#101010]',
            )}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {isTechnical ? 'CONFIG' : 'Settings'}
          </Link>
          <div
            className={cn(
              'h-4 w-px mr-4',
              isTechnical ? 'bg-[#1B29FF]/20' : 'bg-[#101010]/10',
            )}
          />
          <p
            className={cn(
              'uppercase tracking-[0.14em] text-[11px] mr-3',
              isTechnical ? 'text-[#1B29FF] font-mono' : 'text-[#101010]/60',
            )}
          >
            {isTechnical ? 'SETTINGS::PREFERENCES' : 'Settings'}
          </p>
          <h1
            className={cn(
              'leading-[1] text-[#101010]',
              isTechnical
                ? 'font-mono text-[22px] sm:text-[26px]'
                : 'font-serif text-[24px] sm:text-[28px]',
            )}
          >
            {isTechnical ? 'Preferences' : 'Preferences'}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-6 sm:py-8 max-w-[800px] mx-auto">
        {/* View Mode Section */}
        <div
          className={cn(
            'relative overflow-hidden p-5 sm:p-6',
            isTechnical
              ? 'bg-white border border-[#1B29FF]/20'
              : 'bg-white border border-[#101010]/10 rounded-lg',
          )}
        >
          {/* Blueprint Grid (Technical only) */}
          {isTechnical && <BlueprintGrid />}

          {/* Crosshairs (Technical only) */}
          {isTechnical && (
            <>
              <Crosshairs position="top-left" />
              <Crosshairs position="top-right" />
            </>
          )}

          {/* Meta Tag (Technical only) */}
          {isTechnical && (
            <div className="absolute top-2 right-8 font-mono text-[9px] text-[#101010]/40 tracking-wider">
              ID::VIEW_MODE_001
            </div>
          )}

          <div className="relative z-10 flex items-start gap-3 mb-6">
            <Monitor
              className={cn(
                'h-5 w-5 mt-0.5 flex-shrink-0',
                isTechnical ? 'text-[#1B29FF]' : 'text-[#0050ff]',
              )}
            />
            <div>
              <h2
                className={cn(
                  'text-[15px] sm:text-[16px] font-medium text-[#101010]',
                  isTechnical && 'font-mono',
                )}
              >
                {isTechnical ? 'INTERFACE::MODE' : 'View Mode'}
              </h2>
              <p
                className={cn(
                  'mt-1 text-[13px] sm:text-[14px] leading-[1.5]',
                  isTechnical
                    ? 'text-[#101010]/60 font-mono'
                    : 'text-[#101010]/70',
                )}
              >
                {isTechnical
                  ? 'Select interface rendering mode'
                  : 'Choose how you want to see your account information'}
              </p>
            </div>
          </div>

          {/* Mode Selection Cards */}
          <div className="relative z-10 grid gap-4 sm:grid-cols-2">
            {/* Banking Mode Card */}
            <button
              type="button"
              onClick={() => isTechnical && toggle()}
              className={cn(
                'relative p-4 sm:p-5 text-left transition-all',
                isTechnical ? 'rounded-sm' : 'rounded-lg',
                !isTechnical
                  ? 'border-2 border-[#0050ff] bg-[#0050ff]/5'
                  : isTechnical
                    ? 'border border-[#1B29FF]/20 hover:border-[#1B29FF]/40 bg-white'
                    : 'border-2 border-[#101010]/10 hover:border-[#101010]/20 bg-white',
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
                    'h-10 w-10 flex items-center justify-center',
                    isTechnical ? 'rounded-sm' : 'rounded-lg',
                    !isTechnical
                      ? 'bg-[#0050ff] text-white'
                      : 'bg-[#F7F7F2] text-[#101010]/60',
                  )}
                >
                  <Banknote className="h-5 w-5" />
                </div>
                <div>
                  <h3
                    className={cn(
                      'text-[14px] font-medium text-[#101010]',
                      isTechnical && 'font-mono',
                    )}
                  >
                    {isTechnical ? 'MODE::BANKING' : 'Banking'}
                  </h3>
                  <p
                    className={cn(
                      'text-[12px] text-[#101010]/60',
                      isTechnical && 'font-mono',
                    )}
                  >
                    {isTechnical ? 'fiat_interface=true' : 'I bank in dollars'}
                  </p>
                </div>
              </div>
              <p
                className={cn(
                  'text-[13px] text-[#101010]/70 leading-[1.5]',
                  isTechnical && 'font-mono text-[12px]',
                )}
              >
                {isTechnical
                  ? 'Standard banking interface. Balance in USD, ACH/wire deposits, yield optimization.'
                  : 'Simple bank account view. See your balance in dollars, make deposits via ACH/wire, and earn yield on your savings.'}
              </p>
              <ul className="mt-3 space-y-1">
                <li
                  className={cn(
                    'text-[12px] text-[#101010]/60 flex items-center gap-2',
                    isTechnical && 'font-mono text-[11px]',
                  )}
                >
                  <span
                    className={cn(
                      'h-1 w-1 rounded-full',
                      isTechnical ? 'bg-[#1B29FF]/40' : 'bg-[#101010]/40',
                    )}
                  />
                  {isTechnical
                    ? 'banking_terminology'
                    : 'Familiar banking terminology'}
                </li>
                <li
                  className={cn(
                    'text-[12px] text-[#101010]/60 flex items-center gap-2',
                    isTechnical && 'font-mono text-[11px]',
                  )}
                >
                  <span
                    className={cn(
                      'h-1 w-1 rounded-full',
                      isTechnical ? 'bg-[#1B29FF]/40' : 'bg-[#101010]/40',
                    )}
                  />
                  {isTechnical
                    ? 'fiat_rails=ach,wire'
                    : 'ACH & wire transfer focus'}
                </li>
                <li
                  className={cn(
                    'text-[12px] text-[#101010]/60 flex items-center gap-2',
                    isTechnical && 'font-mono text-[11px]',
                  )}
                >
                  <span
                    className={cn(
                      'h-1 w-1 rounded-full',
                      isTechnical ? 'bg-[#1B29FF]/40' : 'bg-[#101010]/40',
                    )}
                  />
                  {isTechnical
                    ? 'ui_complexity=minimal'
                    : 'Clean, simplified interface'}
                </li>
              </ul>
            </button>

            {/* Technical/Crypto Mode Card */}
            <button
              type="button"
              onClick={() => !isTechnical && toggle()}
              className={cn(
                'relative p-4 sm:p-5 text-left transition-all',
                isTechnical ? 'rounded-sm' : 'rounded-lg',
                isTechnical
                  ? 'border-2 border-[#1B29FF] bg-[#1B29FF]/5'
                  : 'border-2 border-[#101010]/10 hover:border-[#101010]/20 bg-white',
              )}
            >
              {isTechnical && (
                <div className="absolute top-3 right-3">
                  <div className="h-5 w-5 rounded-sm bg-[#1B29FF] flex items-center justify-center">
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
                    'h-10 w-10 flex items-center justify-center',
                    isTechnical ? 'rounded-sm' : 'rounded-lg',
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
                    {isTechnical ? 'MODE::TECHNICAL' : 'Technical'}
                  </h3>
                  <p
                    className={cn(
                      'text-[12px] text-[#101010]/60',
                      isTechnical && 'font-mono',
                    )}
                  >
                    {isTechnical ? 'crypto_interface=true' : 'I bank in crypto'}
                  </p>
                </div>
              </div>
              <p
                className={cn(
                  'text-[13px] text-[#101010]/70 leading-[1.5]',
                  isTechnical && 'font-mono text-[12px]',
                )}
              >
                {isTechnical
                  ? 'Full on-chain visibility. Wallet addresses, USDC balances, direct Safe deposits.'
                  : 'Full on-chain view with wallet addresses, USDC balances, and direct crypto deposits to your Safe wallet.'}
              </p>
              <ul className="mt-3 space-y-1">
                <li
                  className={cn(
                    'text-[12px] text-[#101010]/60 flex items-center gap-2',
                    isTechnical && 'font-mono text-[11px]',
                  )}
                >
                  <span
                    className={cn(
                      'h-1 w-1 rounded-full',
                      isTechnical ? 'bg-[#1B29FF]/40' : 'bg-[#101010]/40',
                    )}
                  />
                  {isTechnical
                    ? 'display_addresses=true'
                    : 'Wallet addresses & chain info'}
                </li>
                <li
                  className={cn(
                    'text-[12px] text-[#101010]/60 flex items-center gap-2',
                    isTechnical && 'font-mono text-[11px]',
                  )}
                >
                  <span
                    className={cn(
                      'h-1 w-1 rounded-full',
                      isTechnical ? 'bg-[#1B29FF]/40' : 'bg-[#101010]/40',
                    )}
                  />
                  {isTechnical ? 'deposit_method=usdc' : 'Direct USDC deposits'}
                </li>
                <li
                  className={cn(
                    'text-[12px] text-[#101010]/60 flex items-center gap-2',
                    isTechnical && 'font-mono text-[11px]',
                  )}
                >
                  <span
                    className={cn(
                      'h-1 w-1 rounded-full',
                      isTechnical ? 'bg-[#1B29FF]/40' : 'bg-[#101010]/40',
                    )}
                  />
                  {isTechnical
                    ? 'vault_strategy=multi_chain'
                    : 'Multi-chain vault strategies'}
                </li>
              </ul>
            </button>
          </div>

          {/* Current Mode Indicator */}
          <div
            className={cn(
              'relative z-10 mt-6 pt-4 border-t',
              isTechnical ? 'border-[#1B29FF]/10' : 'border-[#101010]/10',
            )}
          >
            <p
              className={cn(
                'text-[12px]',
                isTechnical
                  ? 'font-mono text-[#101010]/50'
                  : 'text-[#101010]/50',
              )}
            >
              {isTechnical ? 'CURRENT::' : 'Currently using: '}
              <span
                className={cn(
                  'font-medium',
                  isTechnical ? 'text-[#1B29FF]' : 'text-[#0050ff]',
                )}
              >
                {isTechnical ? 'TECHNICAL (CRYPTO)' : 'Banking (Fiat)'} mode
              </span>
            </p>
          </div>
        </div>

        {/* Info Note */}
        <div
          className={cn(
            'mt-4 p-4 border',
            isTechnical
              ? 'bg-[#1B29FF]/5 border-[#1B29FF]/10'
              : 'bg-[#F7F7F2] border-[#101010]/10 rounded-lg',
          )}
        >
          <p
            className={cn(
              'text-[13px] leading-[1.5]',
              isTechnical
                ? 'font-mono text-[12px] text-[#101010]/60'
                : 'text-[#101010]/60',
            )}
          >
            {isTechnical ? (
              <>
                <span className="text-[#1B29FF]">NOTE::</span> Mode switch does
                not affect account state. Balances, settings, and transactions
                persist across interface modes.
              </>
            ) : (
              <>
                <strong className="text-[#101010]">Note:</strong> You can switch
                modes anytime. Your account, balances, and settings remain the
                same — only the interface changes.
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  );
}
