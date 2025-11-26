'use client';

import { ExternalLink } from 'lucide-react';
import { cn, formatUsd } from '@/lib/utils';
import { DepositEarnCard } from '@/app/(authenticated)/dashboard/tools/earn-module/components/deposit-earn-card';
import { WithdrawEarnCard } from '@/app/(authenticated)/dashboard/tools/earn-module/components/withdraw-earn-card';
import { InsuranceContactPanel } from './insurance-contact-panel';
import { toast } from 'sonner';
import type { Address } from 'viem';
import type { VaultViewModel, VaultAction } from './types';

type VaultRowProps = {
  vault: VaultViewModel;
  safeAddress: string | null;
  isDemoMode: boolean;
  isTechnical: boolean;
  isSelected: boolean;
  expandedAction: VaultAction;
  isExpanding: boolean;
  isCollapsing: boolean;
  onToggleAction: (
    action: 'deposit' | 'withdraw' | 'insure',
    vault: { address: string; name: string },
  ) => void;
  onDepositSuccess: () => void;
  onWithdrawSuccess: () => void;
  isLastRow: boolean;
};

/**
 * Desktop Vault Row Component
 *
 * Displays a single vault in a table row format for desktop views.
 * Supports bimodal display (technical/banking mode).
 *
 * Key requirement: In banking mode (isTechnical=false), vault contract links
 * (basescan links) should NOT be shown. They only appear in technical mode.
 */
export function VaultRowDesktop({
  vault,
  safeAddress,
  isDemoMode,
  isTechnical,
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
          isTechnical
            ? cn(
                'bg-white border-b border-[#1B29FF]/10',
                isSelected && 'bg-[#1B29FF]/5',
              )
            : cn(
                vault.isInsured
                  ? 'bg-[#1B29FF]/5 hover:bg-[#1B29FF]/10 border-l-2 border-[#1B29FF]'
                  : vault.category === 'growth'
                    ? 'bg-gradient-to-r from-[#10b981]/5 to-transparent hover:from-[#10b981]/10 border-l-2 border-[#10b981]'
                    : 'hover:bg-[#F7F7F2]/30',
                isSelected &&
                  (vault.isInsured
                    ? 'ring-1 ring-[#1B29FF]/30 bg-[#1B29FF]/12'
                    : vault.category === 'growth'
                      ? 'ring-1 ring-[#10b981]/30 bg-[#10b981]/8'
                      : 'bg-[#F7F7F2]/50'),
              ),
          (isExpanding || isCollapsing) && 'transition-none',
        )}
      >
        {/* Technical Mode ID Tag */}
        {isTechnical && (
          <div className="absolute top-2 right-2 font-mono text-[9px] text-[#1B29FF]/40">
            ID::{vault.id.toUpperCase().replace(/-/g, '_')}
          </div>
        )}

        {/* Strategy Column */}
        <div className="col-span-4">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {/* Technical mode: Show basescan link. Banking mode: Plain text */}
                {isTechnical ? (
                  <a
                    href={`https://basescan.org/address/${vault.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] font-mono text-[#1B29FF] hover:underline truncate inline-flex items-center gap-1"
                  >
                    {vault.name}
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                ) : (
                  <p className="text-[15px] font-medium text-[#101010] truncate">
                    {vault.displayName || vault.name}
                  </p>
                )}

                {/* Asset Badge */}
                <span
                  className={cn(
                    'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide',
                    isTechnical
                      ? 'bg-[#1B29FF]/10 text-[#1B29FF] font-mono'
                      : vault.asset.symbol === 'WETH' ||
                          vault.asset.symbol === 'ETH'
                        ? 'bg-[#627eea]/10 text-[#627eea]'
                        : 'bg-[#2775ca]/10 text-[#2775ca]',
                  )}
                >
                  {isTechnical
                    ? 'ERC-4626'
                    : vault.asset.isNative
                      ? 'ETH'
                      : vault.asset.symbol}
                </span>
              </div>

              {/* Curator info */}
              {isTechnical ? (
                <div className="mt-1">
                  <p className="text-[11px] font-mono text-[#101010]/70">
                    {vault.curator}
                  </p>
                </div>
              ) : (
                <p className="text-[12px] text-[#101010]/60 truncate mt-1">
                  {vault.curator}
                  {vault.risk ? ` · ${vault.risk}` : ''}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* APY Column */}
        <div className="col-span-2 text-right">
          <div className="flex items-baseline justify-end gap-1">
            <p
              className={cn(
                'tabular-nums',
                isTechnical
                  ? 'text-[18px] font-mono text-[#1B29FF]'
                  : cn(
                      'text-[24px] font-semibold',
                      vault.category === 'growth'
                        ? 'text-[#10b981]'
                        : 'text-[#1B29FF]',
                    ),
              )}
            >
              {vault.apy.toFixed(1)}%
            </p>
            {isTechnical && (
              <span className="text-[10px] text-[#1B29FF]/60 font-mono">
                VAR
              </span>
            )}
          </div>
        </div>

        {/* Position Column */}
        <div className="col-span-3 text-right">
          {vault.isContactOnly ? (
            <p
              className={cn(
                isTechnical
                  ? 'font-mono text-[#1B29FF]/40'
                  : 'text-[16px] text-[#101010]/40',
              )}
            >
              —
            </p>
          ) : vault.balanceUsd > 0 ? (
            <div>
              {isTechnical ? (
                <>
                  <p className="text-[15px] font-mono tabular-nums text-[#101010]">
                    {vault.balanceNative !== undefined
                      ? vault.balanceNative.toFixed(6)
                      : vault.balanceUsd.toFixed(2)}
                    <span className="ml-1 text-[11px] text-[#101010]/50">
                      {vault.asset.isNative ? 'ETH' : vault.asset.symbol}
                    </span>
                  </p>
                  <p className="text-[11px] font-mono text-[#101010]/50 tabular-nums">
                    ≈ {formatUsd(vault.balanceUsd)}
                  </p>
                </>
              ) : (
                <>
                  {vault.balanceNative !== undefined && (
                    <p className="text-[18px] font-semibold tabular-nums text-[#101010]">
                      {vault.balanceNative.toFixed(6)} ETH
                    </p>
                  )}
                  <p
                    className={cn(
                      'tabular-nums',
                      vault.balanceNative !== undefined
                        ? 'text-[13px] text-[#101010]/60'
                        : 'text-[18px] font-semibold text-[#101010]',
                    )}
                  >
                    {formatUsd(vault.balanceUsd)}
                  </p>
                </>
              )}
            </div>
          ) : (
            <p
              className={cn(
                isTechnical
                  ? 'text-[13px] font-mono text-[#101010]/40'
                  : 'text-[14px] text-[#101010]/40',
              )}
            >
              {isTechnical ? '0.00' : 'No position'}
            </p>
          )}
        </div>

        {/* Actions Column */}
        <div className="col-span-3 flex justify-end gap-1">
          <VaultActions
            vault={vault}
            isDemoMode={isDemoMode}
            isTechnical={isTechnical}
            isSelected={isSelected}
            expandedAction={expandedAction}
            onToggleAction={onToggleAction}
          />
        </div>
      </div>

      {/* Accordion Content */}
      {(expandedAction === 'insure' && isSelected) ||
      (!isDemoMode && expandedAction && isSelected) ? (
        <div
          className={cn(
            'transition-all duration-300 ease-out overflow-hidden',
            expandedAction && isSelected
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0',
            isExpanding && 'animate-in fade-in slide-in-from-top-1',
          )}
        >
          <div className="">
            <div className={cn('')}>
              {expandedAction === 'insure' && isSelected ? (
                <InsuranceContactPanel />
              ) : expandedAction === 'deposit' && isSelected ? (
                <DepositEarnCard
                  key={`deposit-${vault.address}`}
                  safeAddress={safeAddress as Address}
                  vaultAddress={vault.address as Address}
                  onDepositSuccess={onDepositSuccess}
                  chainId={vault.chainId}
                  isTechnical={isTechnical}
                />
              ) : expandedAction === 'withdraw' && isSelected ? (
                <WithdrawEarnCard
                  key={`withdraw-${vault.address}`}
                  safeAddress={safeAddress as Address}
                  vaultAddress={vault.address as Address}
                  onWithdrawSuccess={onWithdrawSuccess}
                  chainId={vault.chainId}
                  isTechnical={isTechnical}
                />
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Mobile Vault Card Component
 *
 * Displays a single vault in a card format for mobile views.
 * Supports bimodal display (technical/banking mode).
 */
export function VaultRowMobile({
  vault,
  safeAddress,
  isDemoMode,
  isTechnical,
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
          isTechnical
            ? cn(
                'bg-white border-b border-[#1B29FF]/10',
                isSelected && 'bg-[#1B29FF]/5',
              )
            : cn(
                vault.isInsured
                  ? 'bg-[#1B29FF]/10'
                  : vault.category === 'growth'
                    ? 'bg-gradient-to-r from-[#10b981]/5 to-transparent'
                    : 'bg-white',
                isSelected &&
                  (vault.isInsured
                    ? 'ring-1 ring-[#1B29FF]/40 bg-[#1B29FF]/14'
                    : vault.category === 'growth'
                      ? 'ring-1 ring-[#10b981]/30 bg-[#10b981]/8'
                      : 'bg-[#F7F7F2]/40'),
              ),
          (isExpanding || isCollapsing) && 'transition-none',
        )}
      >
        {/* Vault Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                {isTechnical ? (
                  <a
                    href={`https://basescan.org/address/${vault.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] font-mono text-[#1B29FF] hover:underline inline-flex items-center gap-1"
                  >
                    {vault.name}
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                ) : (
                  <p className="text-[15px] font-medium text-[#101010]">
                    {vault.displayName || vault.name}
                  </p>
                )}

                {/* Asset Badge */}
                <span
                  className={cn(
                    'inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wide',
                    isTechnical
                      ? 'bg-[#1B29FF]/10 text-[#1B29FF] font-mono'
                      : vault.asset.symbol === 'WETH' ||
                          vault.asset.symbol === 'ETH'
                        ? 'bg-[#627eea]/10 text-[#627eea]'
                        : 'bg-[#2775ca]/10 text-[#2775ca]',
                  )}
                >
                  {isTechnical
                    ? 'ERC-4626'
                    : vault.asset.isNative
                      ? 'ETH'
                      : vault.asset.symbol}
                </span>
              </div>
              {isTechnical ? (
                <p className="text-[11px] font-mono text-[#101010]/70">
                  {vault.curator}
                </p>
              ) : (
                <p className="text-[12px] text-[#101010]/60">
                  {vault.curator}
                  {vault.risk ? ` · ${vault.risk}` : ''}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <p
              className={cn(
                'tabular-nums',
                isTechnical
                  ? 'text-[18px] font-mono text-[#1B29FF]'
                  : cn(
                      'text-[22px] font-semibold',
                      vault.category === 'growth'
                        ? 'text-[#10b981]'
                        : 'text-[#1B29FF]',
                    ),
              )}
            >
              {vault.apy.toFixed(1)}%
            </p>
            {isTechnical && (
              <span className="text-[9px] text-[#1B29FF]/60 font-mono">
                VAR
              </span>
            )}
          </div>
        </div>

        {/* Vault Stats */}
        <MobileVaultStats vault={vault} isTechnical={isTechnical} />

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <VaultActionsMobile
            vault={vault}
            isDemoMode={isDemoMode}
            isTechnical={isTechnical}
            isSelected={isSelected}
            expandedAction={expandedAction}
            onToggleAction={onToggleAction}
          />
        </div>

        {/* Mobile Accordion Content */}
        {(expandedAction === 'insure' && isSelected) ||
        (!isDemoMode && expandedAction && isSelected) ? (
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
              <div
                className={cn(
                  'p-4',
                  isTechnical
                    ? 'bg-white border border-[#1B29FF]/20'
                    : 'bg-white border border-[#101010]/10',
                )}
              >
                {expandedAction === 'insure' && isSelected ? (
                  <InsuranceContactPanel />
                ) : expandedAction === 'deposit' && isSelected ? (
                  <DepositEarnCard
                    key={`deposit-mobile-${vault.address}`}
                    safeAddress={safeAddress as Address}
                    vaultAddress={vault.address as Address}
                    onDepositSuccess={onDepositSuccess}
                    chainId={vault.chainId}
                    isTechnical={isTechnical}
                  />
                ) : expandedAction === 'withdraw' && isSelected ? (
                  <WithdrawEarnCard
                    key={`withdraw-mobile-${vault.address}`}
                    safeAddress={safeAddress as Address}
                    vaultAddress={vault.address as Address}
                    onWithdrawSuccess={onWithdrawSuccess}
                    chainId={vault.chainId}
                    isTechnical={isTechnical}
                  />
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Mobile vault stats section
 */
function MobileVaultStats({
  vault,
  isTechnical,
}: {
  vault: VaultViewModel;
  isTechnical: boolean;
}) {
  if (vault.isContactOnly) {
    return (
      <div className="flex justify-between text-[14px]">
        <span
          className={
            isTechnical
              ? 'font-mono text-[11px] text-[#1B29FF]/70'
              : 'text-[#101010]/60'
          }
        >
          {isTechnical ? 'POSITION' : 'Position'}
        </span>
        <span
          className={
            isTechnical ? 'font-mono text-[#1B29FF]/40' : 'text-[#101010]/40'
          }
        >
          —
        </span>
      </div>
    );
  }

  if (vault.balanceUsd > 0) {
    if (isTechnical) {
      return (
        <div className="flex justify-between text-[14px]">
          <span className="font-mono text-[11px] text-[#1B29FF]/70">
            BALANCE
          </span>
          <div className="text-right">
            <span className="font-mono tabular-nums text-[#101010]">
              {vault.balanceNative !== undefined
                ? vault.balanceNative.toFixed(6)
                : vault.balanceUsd.toFixed(2)}
              <span className="ml-1 text-[11px] text-[#101010]/50">
                {vault.asset.isNative ? 'ETH' : vault.asset.symbol}
              </span>
            </span>
            <p className="text-[10px] font-mono text-[#101010]/50">
              ≈ {formatUsd(vault.balanceUsd)}
            </p>
          </div>
        </div>
      );
    }

    return (
      <>
        {vault.balanceNative !== undefined && (
          <div className="flex justify-between text-[14px]">
            <span className="text-[#101010]/60">Balance</span>
            <span className="tabular-nums font-medium text-[#101010]">
              {vault.balanceNative.toFixed(6)} ETH
            </span>
          </div>
        )}
        <div className="flex justify-between text-[14px]">
          <span className="text-[#101010]/60">
            {vault.balanceNative !== undefined ? 'Value' : 'Balance'}
          </span>
          <span className="tabular-nums text-[#101010]">
            {formatUsd(vault.balanceUsd)}
          </span>
        </div>
      </>
    );
  }

  return (
    <div className="flex justify-between text-[14px]">
      <span
        className={
          isTechnical
            ? 'font-mono text-[11px] text-[#1B29FF]/70'
            : 'text-[#101010]/60'
        }
      >
        {isTechnical ? 'POSITION' : 'Position'}
      </span>
      <span
        className={
          isTechnical ? 'font-mono text-[#101010]/40' : 'text-[#101010]/40'
        }
      >
        {isTechnical ? '0.00' : 'No position'}
      </span>
    </div>
  );
}

/**
 * Vault action buttons for desktop
 */
function VaultActions({
  vault,
  isDemoMode,
  isTechnical,
  isSelected,
  expandedAction,
  onToggleAction,
}: {
  vault: VaultViewModel;
  isDemoMode: boolean;
  isTechnical: boolean;
  isSelected: boolean;
  expandedAction: VaultAction;
  onToggleAction: (
    action: 'deposit' | 'withdraw' | 'insure',
    vault: { address: string; name: string },
  ) => void;
}) {
  if (vault.isContactOnly) {
    return (
      <button
        onClick={() => onToggleAction('insure', vault)}
        className={cn(
          'px-3 py-2 text-[12px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors',
          expandedAction === 'insure' &&
            isSelected &&
            'ring-2 ring-offset-1 ring-[#1B29FF]/40',
        )}
      >
        Connect with coverage
      </button>
    );
  }

  if (isDemoMode) {
    return (
      <>
        <button
          onClick={() =>
            toast('Sign in to deposit funds from your real account.')
          }
          className={cn(
            'px-2.5 py-1 text-[12px] transition-colors',
            isTechnical
              ? 'bg-transparent border border-[#1B29FF] text-[#1B29FF] hover:bg-[#1B29FF]/5 font-mono uppercase'
              : 'text-white bg-[#1B29FF] hover:bg-[#1420CC]',
          )}
        >
          Deposit
        </button>
        <button
          onClick={() =>
            toast('Sign in to withdraw from live vault positions.')
          }
          className={cn(
            'px-2.5 py-1 text-[12px] transition-colors',
            isTechnical
              ? 'text-[#101010]/60 hover:text-[#1B29FF] font-mono uppercase underline decoration-dotted underline-offset-4'
              : 'text-[#101010] border border-[#101010]/10 hover:bg-[#F7F7F2]',
          )}
        >
          Withdraw
        </button>
        {vault.appUrl && (
          <a
            href={vault.appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'px-2 py-1 transition-colors flex items-center',
              isTechnical
                ? 'text-[#1B29FF] hover:bg-[#1B29FF]/5'
                : 'text-[#101010]/60 hover:text-[#101010]',
            )}
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => onToggleAction('deposit', vault)}
        className={cn(
          'px-2.5 py-1 text-[12px] transition-colors',
          isTechnical
            ? cn(
                'bg-transparent border border-[#1B29FF] text-[#1B29FF] hover:bg-[#1B29FF]/5 font-mono uppercase',
                expandedAction === 'deposit' && isSelected && 'bg-[#1B29FF]/10',
              )
            : cn(
                'text-white',
                expandedAction === 'deposit' && isSelected
                  ? 'bg-[#1420CC]'
                  : 'bg-[#1B29FF] hover:bg-[#1420CC]',
              ),
        )}
      >
        Deposit
      </button>
      <button
        onClick={() => onToggleAction('withdraw', vault)}
        className={cn(
          'px-2.5 py-1 text-[12px] transition-colors',
          isTechnical
            ? cn(
                'text-[#101010]/60 hover:text-[#1B29FF] font-mono uppercase underline decoration-dotted underline-offset-4',
                expandedAction === 'withdraw' && isSelected && 'text-[#1B29FF]',
              )
            : cn(
                'text-[#101010] border border-[#101010]/10',
                expandedAction === 'withdraw' && isSelected
                  ? 'bg-[#F7F7F2]'
                  : 'bg-white hover:bg-[#F7F7F2]',
              ),
        )}
      >
        Withdraw
      </button>
      {vault.appUrl && (
        <a
          href={vault.appUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'px-2 py-1 transition-colors flex items-center',
            isTechnical
              ? 'text-[#1B29FF] hover:bg-[#1B29FF]/5'
              : 'text-[#101010]/60 hover:text-[#101010]',
          )}
        >
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </>
  );
}

/**
 * Vault action buttons for mobile (flex-1 for full width)
 */
function VaultActionsMobile({
  vault,
  isDemoMode,
  isTechnical,
  isSelected,
  expandedAction,
  onToggleAction,
}: {
  vault: VaultViewModel;
  isDemoMode: boolean;
  isTechnical: boolean;
  isSelected: boolean;
  expandedAction: VaultAction;
  onToggleAction: (
    action: 'deposit' | 'withdraw' | 'insure',
    vault: { address: string; name: string },
  ) => void;
}) {
  if (vault.isContactOnly) {
    return (
      <button
        onClick={() => onToggleAction('insure', vault)}
        className={cn(
          'flex-1 px-3 py-2 text-[13px] text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors',
          expandedAction === 'insure' &&
            isSelected &&
            'ring-2 ring-offset-1 ring-[#1B29FF]/40',
        )}
      >
        Connect with coverage
      </button>
    );
  }

  if (isDemoMode) {
    return (
      <>
        <button
          onClick={() =>
            toast('Sign in to deposit funds from your real account.')
          }
          className={cn(
            'flex-1 px-3 py-2 text-[13px] transition-colors',
            isTechnical
              ? 'bg-transparent border border-[#1B29FF] text-[#1B29FF] hover:bg-[#1B29FF]/5 font-mono uppercase'
              : 'text-white bg-[#1B29FF] hover:bg-[#1420CC]',
          )}
        >
          Deposit
        </button>
        <button
          onClick={() =>
            toast('Sign in to withdraw from live vault positions.')
          }
          className={cn(
            'flex-1 px-3 py-2 text-[13px] transition-colors',
            isTechnical
              ? 'text-[#101010]/60 hover:text-[#1B29FF] font-mono uppercase underline decoration-dotted underline-offset-4'
              : 'text-[#101010] border border-[#101010]/10 hover:bg-[#F7F7F2]',
          )}
        >
          Withdraw
        </button>
        {vault.appUrl && (
          <a
            href={vault.appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'px-3 py-2 text-[13px] transition-colors flex items-center justify-center',
              isTechnical
                ? 'text-[#1B29FF] hover:bg-[#1B29FF]/5 border border-[#1B29FF]/20'
                : 'text-[#101010]/60 hover:text-[#101010] border border-[#101010]/10 hover:bg-[#F7F7F2]',
            )}
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => onToggleAction('deposit', vault)}
        className={cn(
          'flex-1 px-3 py-2 text-[13px] transition-colors',
          isTechnical
            ? cn(
                'bg-transparent border border-[#1B29FF] text-[#1B29FF] hover:bg-[#1B29FF]/5 font-mono uppercase',
                expandedAction === 'deposit' && isSelected && 'bg-[#1B29FF]/10',
              )
            : cn(
                'text-white',
                expandedAction === 'deposit' && isSelected
                  ? 'bg-[#1420CC]'
                  : 'bg-[#1B29FF] hover:bg-[#1420CC]',
              ),
        )}
      >
        Deposit
      </button>
      <button
        onClick={() => onToggleAction('withdraw', vault)}
        className={cn(
          'flex-1 px-3 py-2 text-[13px] transition-colors',
          isTechnical
            ? cn(
                'text-[#101010]/60 hover:text-[#1B29FF] font-mono uppercase underline decoration-dotted underline-offset-4',
                expandedAction === 'withdraw' && isSelected && 'text-[#1B29FF]',
              )
            : cn(
                'text-[#101010] border border-[#101010]/10',
                expandedAction === 'withdraw' && isSelected
                  ? 'bg-[#F7F7F2]'
                  : 'bg-white hover:bg-[#F7F7F2]',
              ),
        )}
      >
        Withdraw
      </button>
      {vault.appUrl && (
        <a
          href={vault.appUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'px-3 py-2 text-[13px] transition-colors flex items-center justify-center',
            isTechnical
              ? 'text-[#1B29FF] hover:bg-[#1B29FF]/5 border border-[#1B29FF]/20'
              : 'text-[#101010]/60 hover:text-[#101010] border border-[#101010]/10 hover:bg-[#F7F7F2]',
          )}
        >
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </>
  );
}
