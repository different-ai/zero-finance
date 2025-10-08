'use client';

import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { DepositEarnCard } from '@/app/(authenticated)/dashboard/tools/earn-module/components/deposit-earn-card';
import { WithdrawEarnCard } from '@/app/(authenticated)/dashboard/tools/earn-module/components/withdraw-earn-card';
import { InsuranceContactPanel } from './insurance-contact-panel';
import { ZERO_LOGO_SRC } from '../demo-data';
import { toast } from 'sonner';
import type { Address } from 'viem';

type VaultRowProps = {
  vault: {
    id: string;
    name: string;
    risk: string;
    curator: string;
    address: string;
    appUrl: string;
    apy: number;
    balanceUsd: number;
    earnedUsd: number;
    isAuto: boolean;
    isInsured: boolean;
    isContactOnly: boolean;
  };
  safeAddress: string | null;
  isDemoMode: boolean;
  isSelected: boolean;
  expandedAction: 'deposit' | 'withdraw' | 'insure' | null;
  isExpanding: boolean;
  isCollapsing: boolean;
  onToggleAction: (action: 'deposit' | 'withdraw' | 'insure') => void;
  onDepositSuccess: () => void;
  onWithdrawSuccess: () => void;
  isLastRow: boolean;
};

export function VaultRowDesktop({
  vault,
  safeAddress,
  isDemoMode,
  isSelected,
  expandedAction,
  isExpanding,
  isCollapsing,
  onToggleAction,
  onDepositSuccess,
  onWithdrawSuccess,
  isLastRow,
}: VaultRowProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden',
        !isLastRow && !isSelected && 'border-b border-[#101010]/10',
      )}
    >
      <div
        className={cn(
          'grid grid-cols-12 gap-3 p-4 items-center transition-all duration-200 relative z-10',
          vault.isInsured
            ? 'bg-[#1B29FF]/5 hover:bg-[#1B29FF]/10 border-l-2 border-[#1B29FF]'
            : 'hover:bg-[#F7F7F2]/30',
          isSelected &&
            (vault.isInsured
              ? 'ring-1 ring-[#1B29FF]/30 bg-[#1B29FF]/12'
              : 'bg-[#F7F7F2]/50'),
          (isExpanding || isCollapsing) && 'transition-none',
        )}
      >
        <div className="col-span-5">
          <div className="flex items-start gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {vault.isAuto && (
                  <span className="px-1.5 py-0.5 bg-[#1B29FF] text-white text-[9px] uppercase tracking-wider shrink-0">
                    Auto
                  </span>
                )}
                <p className="text-[15px] font-medium text-[#101010] truncate">
                  {vault.name}
                </p>
                {vault.isInsured && (
                  <span className="insured-pill animate-glow inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#1B29FF]/15 text-[#1B29FF] text-[10px] font-semibold uppercase tracking-[0.18em]">
                    <Image
                      src={ZERO_LOGO_SRC}
                      alt="0 Finance insured"
                      width={14}
                      height={14}
                      className="h-3.5 w-3.5"
                    />
                    Insured
                  </span>
                )}
              </div>
              <p className="text-[12px] text-[#101010]/60 truncate mt-1">
                {vault.curator}
                {vault.risk ? ` · ${vault.risk}` : ''}
                {vault.isContactOnly && ' · Coverage arranged via 0 Finance'}
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-2 text-right">
          <p className="text-[18px] font-medium tabular-nums text-[#1B29FF]">
            {vault.apy.toFixed(1)}%
          </p>
        </div>

        <div className="col-span-2 text-right">
          <p className="text-[16px] tabular-nums text-[#101010]">
            {vault.isContactOnly
              ? '—'
              : new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(vault.balanceUsd)}
          </p>
          {vault.earnedUsd > 0 && !vault.isContactOnly && (
            <p className="text-[12px] tabular-nums text-[#1B29FF]">
              +
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(vault.earnedUsd)}
            </p>
          )}
        </div>

        <div className="col-span-3 flex justify-end gap-1">
          {vault.isContactOnly ? (
            <button
              onClick={() => onToggleAction('insure')}
              className={cn(
                'px-3 py-2 text-[12px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors',
                expandedAction === 'insure' &&
                  isSelected &&
                  'ring-2 ring-offset-1 ring-[#1B29FF]/40',
              )}
            >
              Connect with coverage
            </button>
          ) : isDemoMode ? (
            <>
              <button
                onClick={() =>
                  toast('Sign in to deposit funds from your real account.')
                }
                className="px-2.5 py-1 text-[12px] text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors"
              >
                Deposit
              </button>
              <button
                onClick={() =>
                  toast('Sign in to withdraw from live vault positions.')
                }
                className="px-2.5 py-1 text-[12px] text-[#101010] border border-[#101010]/10 hover:bg-[#F7F7F2] transition-colors"
              >
                Withdraw
              </button>
              {vault.appUrl && (
                <a
                  href={vault.appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 text-[#101010]/60 hover:text-[#101010] transition-colors flex items-center"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => onToggleAction('deposit')}
                className={cn(
                  'px-2.5 py-1 text-[12px] text-white transition-colors',
                  expandedAction === 'deposit' && isSelected
                    ? 'bg-[#1420CC]'
                    : 'bg-[#1B29FF] hover:bg-[#1420CC]',
                )}
              >
                Deposit
              </button>
              <button
                onClick={() => onToggleAction('withdraw')}
                className={cn(
                  'px-2.5 py-1 text-[12px] text-[#101010] border border-[#101010]/10 transition-colors',
                  expandedAction === 'withdraw' && isSelected
                    ? 'bg-[#F7F7F2]'
                    : 'bg-white hover:bg-[#F7F7F2]',
                )}
              >
                Withdraw
              </button>
              {vault.appUrl && (
                <a
                  href={vault.appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 text-[#101010]/60 hover:text-[#101010] transition-colors flex items-center"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </>
          )}
        </div>
      </div>

      {((expandedAction === 'insure' && isSelected) ||
        (!isDemoMode && expandedAction && isSelected)) && (
        <div
          className={cn(
            'transition-all duration-300 ease-out overflow-hidden',
            expandedAction && isSelected
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0',
            isExpanding && 'animate-in fade-in slide-in-from-top-1',
          )}
        >
          <div className="px-4 pb-4 bg-[#F7F7F2]/50">
            <div className="bg-white border border-[#101010]/10 p-5 sm:p-6">
              {expandedAction === 'insure' && isSelected ? (
                <InsuranceContactPanel />
              ) : expandedAction === 'deposit' && isSelected ? (
                <DepositEarnCard
                  key={`deposit-${vault.address}`}
                  safeAddress={safeAddress as Address}
                  vaultAddress={vault.address as Address}
                  onDepositSuccess={onDepositSuccess}
                />
              ) : expandedAction === 'withdraw' && isSelected ? (
                <WithdrawEarnCard
                  key={`withdraw-${vault.address}`}
                  safeAddress={safeAddress as Address}
                  vaultAddress={vault.address as Address}
                  onWithdrawSuccess={onWithdrawSuccess}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function VaultRowMobile({
  vault,
  safeAddress,
  isDemoMode,
  isSelected,
  expandedAction,
  isExpanding,
  isCollapsing,
  onToggleAction,
  onDepositSuccess,
  onWithdrawSuccess,
  isLastRow,
}: VaultRowProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden transition-all duration-200',
        !isLastRow && !isSelected && 'border-b border-[#101010]/5',
      )}
    >
      <div
        className={cn(
          'p-4 space-y-3 transition-all duration-200',
          vault.isInsured ? 'bg-[#1B29FF]/10' : 'bg-white',
          isSelected &&
            (vault.isInsured
              ? 'ring-1 ring-[#1B29FF]/40 bg-[#1B29FF]/14'
              : 'bg-[#F7F7F2]/40'),
          (isExpanding || isCollapsing) && 'transition-none',
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                {vault.isAuto && (
                  <span className="px-1.5 py-0.5 bg-[#1B29FF] text-white text-[9px] uppercase tracking-wider">
                    Auto
                  </span>
                )}
                <p className="text-[15px] font-medium text-[#101010]">
                  {vault.name}
                </p>
                {vault.isInsured && (
                  <span className="insured-pill animate-glow inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1B29FF]/15 text-[#1B29FF] text-[10px] font-semibold uppercase tracking-[0.18em]">
                    <Image
                      src={ZERO_LOGO_SRC}
                      alt="0 Finance insured"
                      width={14}
                      height={14}
                      className="h-3.5 w-3.5"
                    />
                    Insured
                  </span>
                )}
              </div>
              <p className="text-[12px] text-[#101010]/60">
                {vault.curator}
                {vault.risk ? ` · ${vault.risk}` : ''}
                {vault.isContactOnly && ' · Coverage arranged via 0 Finance'}
              </p>
            </div>
          </div>
          <p className="text-[18px] font-medium tabular-nums text-[#1B29FF]">
            {vault.apy.toFixed(1)}%
          </p>
        </div>

        <div className="flex justify-between text-[14px]">
          <span className="text-[#101010]/60">Balance</span>
          <span className="tabular-nums text-[#101010]">
            {vault.isContactOnly
              ? '—'
              : new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(vault.balanceUsd)}
          </span>
        </div>
        {vault.earnedUsd > 0 && !vault.isContactOnly && (
          <div className="flex justify-between text-[14px]">
            <span className="text-[#101010]/60">Earned</span>
            <span className="tabular-nums text-[#1B29FF]">
              +
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(vault.earnedUsd)}
            </span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {vault.isContactOnly ? (
            <button
              onClick={() => onToggleAction('insure')}
              className={cn(
                'flex-1 px-3 py-2 text-[13px] text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors',
                expandedAction === 'insure' &&
                  isSelected &&
                  'ring-2 ring-offset-1 ring-[#1B29FF]/40',
              )}
            >
              Connect with coverage
            </button>
          ) : isDemoMode ? (
            <>
              <button
                onClick={() =>
                  toast('Sign in to deposit funds from your real account.')
                }
                className="flex-1 px-3 py-2 text-[13px] text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors"
              >
                Deposit
              </button>
              <button
                onClick={() =>
                  toast('Sign in to withdraw from live vault positions.')
                }
                className="flex-1 px-3 py-2 text-[13px] text-[#101010] border border-[#101010]/10 hover:bg-[#F7F7F2] transition-colors"
              >
                Withdraw
              </button>
              {vault.appUrl && (
                <a
                  href={vault.appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-[13px] text-[#101010]/60 hover:text-[#101010] border border-[#101010]/10 hover:bg-[#F7F7F2] transition-colors flex items-center justify-center"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => onToggleAction('deposit')}
                className={cn(
                  'flex-1 px-3 py-2 text-[13px] text-white transition-colors',
                  expandedAction === 'deposit' && isSelected
                    ? 'bg-[#1420CC]'
                    : 'bg-[#1B29FF] hover:bg-[#1420CC]',
                )}
              >
                Deposit
              </button>
              <button
                onClick={() => onToggleAction('withdraw')}
                className={cn(
                  'flex-1 px-3 py-2 text-[13px] text-[#101010] border border-[#101010]/10 transition-colors',
                  expandedAction === 'withdraw' && isSelected
                    ? 'bg-[#F7F7F2]'
                    : 'bg-white hover:bg-[#F7F7F2]',
                )}
              >
                Withdraw
              </button>
              {vault.appUrl && (
                <a
                  href={vault.appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-[13px] text-[#101010]/60 hover:text-[#101010] border border-[#101010]/10 hover:bg-[#F7F7F2] transition-colors flex items-center justify-center"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </>
          )}
        </div>

        {((expandedAction === 'insure' && isSelected) ||
          (!isDemoMode && expandedAction && isSelected)) && (
          <div
            className={cn(
              'transition-all duration-300 ease-out overflow-hidden',
              expandedAction && isSelected
                ? 'max-h-[800px] opacity-100'
                : 'max-h-0 opacity-0',
              isExpanding && 'animate-in fade-in slide-in-from-top-1',
            )}
          >
            <div className="px-4 pt-3 pb-4">
              <div className="bg-white border border-[#101010]/10 p-4">
                {expandedAction === 'insure' && isSelected ? (
                  <InsuranceContactPanel />
                ) : expandedAction === 'deposit' && isSelected ? (
                  <DepositEarnCard
                    key={`deposit-mobile-${vault.address}`}
                    safeAddress={safeAddress as Address}
                    vaultAddress={vault.address as Address}
                    onDepositSuccess={onDepositSuccess}
                  />
                ) : expandedAction === 'withdraw' && isSelected ? (
                  <WithdrawEarnCard
                    key={`withdraw-mobile-${vault.address}`}
                    safeAddress={safeAddress as Address}
                    vaultAddress={vault.address as Address}
                    onWithdrawSuccess={onWithdrawSuccess}
                  />
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
