'use client';

import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InsuranceContactPanel } from './insurance-contact-panel';
import type { SelectedVaultState, ActiveVaultAction } from './types';

type InsuranceBannerProps = {
  userIsInsured: boolean;
  isTechnical: boolean;
  selectedVault: SelectedVaultState;
  onToggleInsurance: (
    action: ActiveVaultAction,
    vault: { address: string; name: string },
  ) => void;
};

/**
 * Insurance Protection Banner
 *
 * Shows active insurance status when user is insured,
 * or an expandable CTA to get insurance coverage when not insured.
 *
 * Supports bimodal display:
 * - Banking mode: Soft, rounded design with friendly language
 * - Technical mode: Blueprint-style with protocol/contract info
 */
export function InsuranceBanner({
  userIsInsured,
  isTechnical,
  selectedVault,
  onToggleInsurance,
}: InsuranceBannerProps) {
  if (userIsInsured) {
    return <InsuranceActiveStatus isTechnical={isTechnical} />;
  }

  return (
    <InsuranceCTA
      isTechnical={isTechnical}
      selectedVault={selectedVault}
      onToggleInsurance={onToggleInsurance}
    />
  );
}

/**
 * Active insurance status banner - shown when user has insurance coverage
 */
function InsuranceActiveStatus({ isTechnical }: { isTechnical: boolean }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        isTechnical
          ? 'rounded-sm border border-[#1B29FF]/20 bg-[#1B29FF]/5 p-4'
          : 'rounded-[12px] border border-[#1B29FF]/10 bg-white p-6 shadow-[0_2px_8px_rgba(27,41,255,0.04)]',
      )}
    >
      {/* Technical Background Grid */}
      {isTechnical && (
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(to right, #1B29FF 1px, transparent 1px), linear-gradient(to bottom, #1B29FF 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            maskImage:
              'linear-gradient(to bottom, black 40%, transparent 100%)',
          }}
        />
      )}

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'flex items-center justify-center',
              isTechnical
                ? 'h-8 w-8 rounded-sm bg-[#1B29FF]/10 text-[#1B29FF] border border-[#1B29FF]/20'
                : 'h-10 w-10 rounded-full bg-[#1B29FF]/10 text-[#1B29FF]',
            )}
          >
            <Shield className={cn('w-5 h-5', isTechnical && 'w-4 h-4')} />
          </div>
          <div>
            <h3
              className={cn(
                'font-medium',
                isTechnical
                  ? 'font-mono text-[13px] text-[#1B29FF] uppercase tracking-wide'
                  : 'text-[15px] text-[#101010]',
              )}
            >
              {isTechnical
                ? 'RISK_COVERAGE::ACTIVE'
                : 'Insurance Protection Active'}
            </h3>
            <p
              className={cn(
                'mt-0.5',
                isTechnical
                  ? 'font-mono text-[11px] text-[#1B29FF]/70'
                  : 'text-[13px] text-[#101010]/60',
              )}
            >
              {isTechnical
                ? 'PROTOCOL::CHAINPROOF // LICENSED_INSURER // COVERAGE::UP_TO_$1M'
                : 'Your deposits are covered by Chainproof (licensed insurer) up to $1M'}
            </p>
          </div>
        </div>
        {isTechnical && (
          <div className="hidden sm:block font-mono text-[10px] text-[#1B29FF]/50 text-right">
            <div className="uppercase tracking-wider">Contract</div>
            <div>0xCA...45A</div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Insurance CTA banner - expandable accordion to get coverage
 */
function InsuranceCTA({
  isTechnical,
  selectedVault,
  onToggleInsurance,
}: {
  isTechnical: boolean;
  selectedVault: SelectedVaultState;
  onToggleInsurance: (
    action: ActiveVaultAction,
    vault: { address: string; name: string },
  ) => void;
}) {
  const isExpanded = selectedVault.vaultAddress === 'insured-contact';

  return (
    <div
      className={cn(
        'bg-white border border-[#101010]/10 rounded-[12px] overflow-hidden transition-all duration-300',
        isExpanded && 'border-[#1B29FF]/20',
        isTechnical && 'rounded-sm border-[#1B29FF]/20',
      )}
    >
      <button
        type="button"
        onClick={() =>
          onToggleInsurance('insure', {
            address: 'insured-contact',
            name: 'Get Protection',
          })
        }
        className="w-full p-6 text-left hover:bg-[#F7F7F2]/50 transition-colors"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'flex-shrink-0 w-10 h-10 flex items-center justify-center',
                isTechnical
                  ? 'rounded-sm bg-[#1B29FF]/5 border border-[#1B29FF]/20'
                  : 'rounded-full bg-[#1B29FF]/10',
              )}
            >
              <Shield className="h-5 w-5 text-[#1B29FF]" />
            </div>
            <div>
              <h3
                className={cn(
                  'text-[15px] font-semibold text-[#101010] mb-0.5',
                  isTechnical && 'font-mono text-[#1B29FF] uppercase',
                )}
              >
                {isTechnical
                  ? 'RISK_COVERAGE::AVAILABLE'
                  : 'Insurance Coverage'}
              </h3>
              <p
                className={cn(
                  'text-[13px] text-[#101010]/60',
                  isTechnical && 'font-mono text-[11px]',
                )}
              >
                {isTechnical
                  ? 'PROTOCOL::CHAINPROOF // LICENSED_INSURER // COVERAGE::UP_TO_$1M'
                  : 'Protect your deposits with coverage up to $1M from a licensed insurer'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'hidden sm:inline-block text-[13px] font-medium text-[#1B29FF]',
                isTechnical && 'font-mono text-[11px] uppercase',
              )}
            >
              {isExpanded
                ? isTechnical
                  ? 'CLOSE'
                  : 'Close'
                : isTechnical
                  ? 'VIEW_SPECS'
                  : 'Learn more'}
            </span>
            <svg
              className={cn(
                'w-4 h-4 text-[#101010]/40 transition-transform duration-200',
                isExpanded && 'rotate-180',
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </button>

      {/* Accordion Content - Insurance Contact Panel */}
      <div
        className={cn(
          'transition-all duration-300 ease-out overflow-hidden',
          isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="px-6 pb-6 border-t border-[#101010]/10">
          <div className="pt-4">
            <InsuranceContactPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
