'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { OnboardingTasksCard } from './onboarding-tasks-card';
import { AccountInfoDialog } from '@/components/virtual-accounts/account-info-dialog';
import { useBimodal, BlueprintGrid, Crosshairs } from '@/components/ui/bimodal';
import { cn } from '@/lib/utils';

type OnboardingStepStatus =
  | 'not_started'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'none';

interface OnboardingStep {
  isCompleted: boolean;
  status: OnboardingStepStatus;
  kycMarkedDone?: boolean;
  kycSubStatus?: string | null;
}

interface OnboardingInitialData {
  steps: {
    createSafe: OnboardingStep;
    verifyIdentity: OnboardingStep;
    setupBankAccount: OnboardingStep;
  };
  isCompleted: boolean;
}

interface Props {
  initialData?: OnboardingInitialData;
  safeAddress?: string | null;
  isDemoMode?: boolean;
}

export function VirtualAccountOnboardingLayer({
  initialData,
  safeAddress,
  isDemoMode = false,
}: Props) {
  const [showTasks, setShowTasks] = useState(false);
  const [isAccountInfoOpen, setIsAccountInfoOpen] = useState(false);
  const { isTechnical, isHydrated } = useBimodal();

  // Prevent hydration mismatch by using consistent value until hydrated
  const effectiveTechnical = isHydrated ? isTechnical : false;

  const isFullyCompleted = useMemo(() => {
    if (!initialData) return false;
    const s = initialData.steps;
    return Boolean(s?.verifyIdentity?.isCompleted);
  }, [initialData]);

  if (isFullyCompleted) return null;

  if (!showTasks) {
    return (
      <div
        className={cn(
          'relative w-full overflow-hidden transition-all duration-300',
          effectiveTechnical
            ? 'bg-white border border-[#1B29FF]/20 rounded-sm shadow-none'
            : 'bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)]',
        )}
      >
        {/* Blueprint Grid (Technical only) */}
        {effectiveTechnical && <BlueprintGrid />}

        {/* Crosshairs (Technical only) */}
        {effectiveTechnical && (
          <>
            <Crosshairs position="top-left" />
            <Crosshairs position="top-right" />
          </>
        )}

        {/* Meta Tag (Technical only) */}
        {effectiveTechnical && (
          <div className="absolute top-2 right-8 font-mono text-[9px] text-[#101010]/40 tracking-wider">
            ID::ONBOARD_001
          </div>
        )}

        <div className="relative z-10 p-5 sm:p-6">
          {/* Header */}
          <div className="pb-4">
            <h3
              className={cn(
                effectiveTechnical
                  ? 'font-mono text-[14px] text-[#1B29FF] uppercase tracking-wider'
                  : 'text-[15px] sm:text-[16px] font-medium tracking-[-0.01em] text-[#101010]',
              )}
            >
              {effectiveTechnical
                ? 'INIT::SAVINGS_DEPOSIT'
                : 'Get started with savings'}
            </h3>
          </div>

          {/* Content */}
          <div className="space-y-5">
            <p
              className={cn(
                'leading-[1.5]',
                effectiveTechnical
                  ? 'font-mono text-[12px] text-[#101010]/60'
                  : 'text-[14px] text-[#101010]/70',
              )}
            >
              {effectiveTechnical
                ? 'Transfer USDC or USD to begin yield accumulation on your treasury.'
                : 'Deposit funds to start earning yield automatically.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <AccountInfoDialog
                open={isAccountInfoOpen}
                onOpenChange={setIsAccountInfoOpen}
                isDemoMode={isDemoMode}
                safeAddress={safeAddress}
                trigger={
                  <Button
                    className={cn(
                      'gap-2 transition-colors',
                      effectiveTechnical
                        ? 'border border-[#1B29FF] bg-transparent text-[#1B29FF] font-mono px-4 py-2 rounded-sm hover:bg-[#1B29FF] hover:text-white'
                        : 'bg-[#1B29FF] hover:bg-[#1420CC] text-white font-medium px-6 py-3 rounded-md',
                    )}
                  >
                    {effectiveTechnical ? '[ DEPOSIT ]' : 'Deposit Now'}
                  </Button>
                }
              />
            </div>

            <button
              type="button"
              onClick={() => setShowTasks(true)}
              className={cn(
                'inline-flex items-center gap-1 transition-colors',
                effectiveTechnical
                  ? 'font-mono text-[11px] text-[#1B29FF]/60 hover:text-[#1B29FF]'
                  : 'text-[13px] text-[#101010]/60 hover:text-[#1B29FF]',
              )}
            >
              {effectiveTechnical
                ? 'UNLOCK::HIGHER_LIMITS'
                : 'Want higher limits?'}
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <OnboardingTasksCard initialData={initialData as any} />;
}
