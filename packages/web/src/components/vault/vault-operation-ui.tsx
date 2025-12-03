'use client';

import { cn } from '@/lib/utils';
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Rocket,
  ArrowUpFromLine,
  ArrowDownToLine,
} from 'lucide-react';
import { ReactNode } from 'react';

/**
 * Reusable UI components for vault operations (deposits and withdrawals)
 * These components provide consistent styling for both technical and banking modes.
 */

// ============================================================================
// Transaction State Types
// ============================================================================

export type TransactionStep =
  | 'idle'
  | 'checking'
  | 'approving'
  | 'waiting-approval'
  | 'depositing'
  | 'withdrawing'
  | 'waiting-deposit'
  | 'waiting-withdraw'
  | 'indexing'
  | 'bridging'
  | 'waiting-bridge'
  | 'waiting-arrival'
  | 'needs-deployment'
  | 'deploying-safe'
  | 'waiting-deployment'
  | 'success'
  | 'error';

export interface TransactionState {
  step: TransactionStep;
  txHash?: string;
  errorMessage?: string;
  amount?: string;
  outputAsset?: string;
}

// ============================================================================
// Balance Display
// ============================================================================

interface BalanceDisplayProps {
  label: string;
  balance: string;
  symbol: string;
  usdEquivalent?: string;
  isTechnical?: boolean;
}

export function BalanceDisplay({
  label,
  balance,
  symbol,
  usdEquivalent,
  isTechnical = false,
}: BalanceDisplayProps) {
  return (
    <div
      className={cn(
        'p-4 relative',
        isTechnical
          ? 'bg-white border border-[#1B29FF]/30'
          : 'bg-[#F7F7F2] border border-[#101010]/10',
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={cn(
              'uppercase tracking-[0.14em] text-[11px] mb-1',
              isTechnical ? 'font-mono text-[#1B29FF]' : 'text-[#101010]/60',
            )}
          >
            {label}
          </p>
          {isTechnical ? (
            <div>
              <p className="text-[24px] font-mono tabular-nums text-[#101010]">
                {balance} {symbol}
              </p>
              {usdEquivalent && (
                <p className="text-[12px] font-mono text-[#101010]/50">
                  ≈ ${usdEquivalent} USD
                </p>
              )}
            </div>
          ) : (
            <p className="text-[24px] font-medium tabular-nums text-[#101010]">
              {symbol === 'ETH' ? '' : '$'}
              {balance} {symbol === 'ETH' ? 'ETH' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Amount Input
// ============================================================================

interface AmountInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onMax?: () => void;
  symbol: string;
  maxAmount?: string;
  disabled?: boolean;
  isTechnical?: boolean;
  placeholder?: string;
}

export function AmountInput({
  label,
  value,
  onChange,
  onMax,
  symbol,
  maxAmount,
  disabled = false,
  isTechnical = false,
  placeholder = '0.0',
}: AmountInputProps) {
  return (
    <div className="space-y-2 relative">
      <label
        className={cn(
          'text-[12px] font-medium',
          isTechnical ? 'font-mono text-[#1B29FF] uppercase' : 'text-[#101010]',
        )}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'w-full px-3 py-2 pr-20 text-[14px] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            isTechnical
              ? 'font-mono bg-white border border-[#1B29FF]/30 text-[#101010] placeholder:text-[#101010]/30 focus:border-[#1B29FF] focus:outline-none'
              : 'bg-white border border-[#101010]/10 focus:border-[#1B29FF] focus:outline-none',
          )}
          step="0.000001"
          min="0"
          max={maxAmount}
          disabled={disabled}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <span
            className={cn(
              'text-[11px]',
              isTechnical ? 'font-mono text-[#1B29FF]' : 'text-[#101010]/50',
            )}
          >
            {symbol}
          </span>
          {onMax && (
            <button
              type="button"
              onClick={onMax}
              className={cn(
                'px-1.5 py-0.5 text-[10px] transition-colors',
                isTechnical
                  ? 'font-mono text-[#1B29FF] hover:text-[#1420CC] border border-[#1B29FF]/30 hover:border-[#1B29FF]'
                  : 'text-[#1B29FF] hover:text-[#1420CC]',
              )}
              disabled={disabled}
            >
              MAX
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Action Button
// ============================================================================

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  type: 'deposit' | 'withdraw' | 'bridge' | 'deploy';
  label?: string;
  isTechnical?: boolean;
}

export function ActionButton({
  onClick,
  disabled = false,
  isLoading = false,
  type,
  label,
  isTechnical = false,
}: ActionButtonProps) {
  const Icon =
    type === 'deposit'
      ? ArrowDownToLine
      : type === 'withdraw'
        ? ArrowUpFromLine
        : type === 'bridge'
          ? ArrowUpFromLine
          : Rocket;

  const defaultLabels = {
    deposit: isTechnical ? '[ EXECUTE ]' : 'Deposit',
    withdraw: isTechnical ? '[ EXECUTE ]' : 'Withdraw',
    bridge: isTechnical ? '[ BRIDGE TO BASE ]' : 'Bridge to Base',
    deploy: isTechnical ? '[ DEPLOY_SAFE ]' : 'Set Up Account',
  };

  const buttonLabel = label || defaultLabels[type];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full px-4 py-2.5 text-[14px] font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 relative',
        isTechnical
          ? 'font-mono uppercase bg-white border-2 border-[#1B29FF] text-[#1B29FF] hover:bg-[#1B29FF] hover:text-white'
          : 'text-white bg-[#1B29FF] hover:bg-[#1420CC]',
      )}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Icon className="h-4 w-4" />
      )}
      <span className="leading-none">{buttonLabel}</span>
    </button>
  );
}

// ============================================================================
// Success Banner
// ============================================================================

interface SuccessBannerProps {
  amount: string;
  asset: string;
  txHash?: string;
  onDismiss: () => void;
  type: 'deposit' | 'withdraw';
  isTechnical?: boolean;
  explorerUrl?: string;
}

export function SuccessBanner({
  amount,
  asset,
  txHash,
  onDismiss,
  type,
  isTechnical = false,
  explorerUrl = 'https://basescan.org',
}: SuccessBannerProps) {
  const displayAmount = asset === 'ETH' ? `${amount} ETH` : `$${amount}`;
  const action = type === 'deposit' ? 'Deposited' : 'Withdrew';
  const technicalAction =
    type === 'deposit' ? 'DEPOSIT::COMPLETE' : 'WITHDRAWAL::COMPLETE';

  return (
    <div
      className={cn(
        'p-4 relative',
        isTechnical
          ? 'bg-[#10B981]/5 border border-[#10B981]/30'
          : 'bg-[#F0FDF4] border border-[#10B981]/20',
      )}
    >
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 text-[#101010]/40 hover:text-[#101010]/60 transition-colors"
        aria-label="Dismiss"
      >
        <span className="text-[16px]">×</span>
      </button>
      <div className="flex gap-3">
        <CheckCircle className="h-5 w-5 text-[#10B981] flex-shrink-0 mt-0.5" />
        <div className="space-y-1.5 flex-1 pr-4">
          <div
            className={cn(
              'text-[14px] font-medium text-[#101010]',
              isTechnical && 'font-mono',
            )}
          >
            {isTechnical
              ? `${technicalAction} — ${amount} ${asset}`
              : `${action} ${displayAmount}`}
          </div>
          <p
            className={cn(
              'text-[12px] text-[#101010]/60',
              isTechnical && 'font-mono',
            )}
          >
            {isTechnical
              ? 'NOTE: BALANCE_UPDATE may take up to 60s'
              : 'Your balance may take up to 1 minute to update.'}
          </p>
          {isTechnical && txHash && (
            <a
              href={`${explorerUrl}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-[#1B29FF] hover:text-[#1420CC]"
            >
              VIEW_TX
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Processing Banner
// ============================================================================

interface ProcessingBannerProps {
  step: TransactionStep;
  txHash?: string;
  isTechnical?: boolean;
  explorerUrl?: string;
}

export function ProcessingBanner({
  step,
  txHash,
  isTechnical = false,
  explorerUrl = 'https://basescan.org',
}: ProcessingBannerProps) {
  const statusMessages: Record<string, string> = isTechnical
    ? {
        checking: 'CHECKING_REQUIREMENTS...',
        approving: 'SIGNING_APPROVAL...',
        'waiting-approval': 'CONFIRMING_APPROVAL...',
        depositing: 'SIGNING_DEPOSIT...',
        withdrawing: 'SIGNING_WITHDRAWAL...',
        'waiting-deposit': 'CONFIRMING_ON_CHAIN...',
        'waiting-withdraw': 'CONFIRMING_ON_CHAIN...',
        indexing: 'UPDATING_BALANCES...',
        bridging: 'INITIATING_BRIDGE...',
        'waiting-bridge': 'BRIDGE_IN_PROGRESS...',
      }
    : {
        checking: 'Checking requirements...',
        approving: 'Signing approval...',
        'waiting-approval': 'Confirming approval...',
        depositing: 'Signing deposit...',
        withdrawing: 'Signing withdrawal...',
        'waiting-deposit': 'Confirming on chain...',
        'waiting-withdraw': 'Confirming on chain...',
        indexing: 'Updating balances...',
        bridging: 'Initiating bridge...',
        'waiting-bridge': 'Bridge in progress...',
      };

  const statusMessage = statusMessages[step] || 'Processing...';

  return (
    <div
      className={cn(
        'p-4 relative',
        isTechnical
          ? 'bg-[#1B29FF]/5 border border-[#1B29FF]/30'
          : 'bg-[#EFF6FF] border border-[#1B29FF]/20',
      )}
    >
      <div className="flex gap-3">
        <Loader2 className="h-5 w-5 text-[#1B29FF] flex-shrink-0 mt-0.5 animate-spin" />
        <div className="space-y-1.5 flex-1">
          <div
            className={cn(
              'text-[14px] font-medium text-[#101010]',
              isTechnical && 'font-mono',
            )}
          >
            {isTechnical ? 'PROCESSING::TX' : 'Processing transaction'}
          </div>
          <p
            className={cn(
              'text-[12px] text-[#101010]/70',
              isTechnical && 'font-mono',
            )}
          >
            {statusMessage}
          </p>
          {isTechnical && step === 'indexing' && txHash && (
            <a
              href={`${explorerUrl}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-[#1B29FF] hover:text-[#1420CC]"
            >
              VIEW_TX
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Error Banner
// ============================================================================

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  isTechnical?: boolean;
}

export function ErrorBanner({
  message,
  onRetry,
  isTechnical = false,
}: ErrorBannerProps) {
  return (
    <div
      className={cn(
        'p-4 relative',
        isTechnical
          ? 'bg-[#EF4444]/5 border border-[#EF4444]/30'
          : 'bg-[#FEF2F2] border border-[#EF4444]/20',
      )}
    >
      <div className="flex gap-3">
        <AlertCircle className="h-5 w-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1">
          <div
            className={cn(
              'text-[14px] font-medium text-[#101010]',
              isTechnical && 'font-mono',
            )}
          >
            {isTechnical ? 'ERROR::OPERATION_FAILED' : 'Operation Failed'}
          </div>
          <p
            className={cn(
              'text-[12px] text-[#101010]/70',
              isTechnical && 'font-mono',
            )}
          >
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className={cn(
                'px-3 py-1.5 text-[12px] font-medium transition-colors',
                isTechnical
                  ? 'font-mono uppercase border border-[#1B29FF]/30 text-[#1B29FF] hover:bg-[#1B29FF]/5'
                  : 'text-[#1B29FF] hover:text-[#1420CC]',
              )}
            >
              {isTechnical ? '[ RETRY ]' : 'Try Again'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Safe Deployment Prompt
// ============================================================================

interface SafeDeploymentPromptProps {
  chainName: string;
  predictedAddress?: string;
  onDeploy: () => void;
  onCancel?: () => void;
  isDeploying?: boolean;
  isTechnical?: boolean;
}

export function SafeDeploymentPrompt({
  chainName,
  predictedAddress,
  onDeploy,
  onCancel,
  isDeploying = false,
  isTechnical = false,
}: SafeDeploymentPromptProps) {
  if (isDeploying) {
    return (
      <div
        className={cn(
          'p-6 text-center space-y-4 relative',
          isTechnical && 'bg-[#fafafa] border border-[#1B29FF]/20',
        )}
      >
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center mx-auto',
            isTechnical
              ? 'bg-[#1B29FF]/10 border border-[#1B29FF]/30'
              : 'bg-[#1B29FF]/10',
          )}
        >
          <Loader2 className="h-6 w-6 text-[#1B29FF] animate-spin" />
        </div>
        <div>
          <h3
            className={cn(
              'text-[18px] font-semibold text-[#101010] mb-2',
              isTechnical && 'font-mono',
            )}
          >
            {isTechnical
              ? `DEPLOYING::${chainName.toUpperCase()}_SAFE`
              : `Setting Up ${chainName} Account`}
          </h3>
          <p
            className={cn(
              'text-[14px] text-[#101010]/70',
              isTechnical && 'font-mono',
            )}
          >
            {isTechnical
              ? 'TX_IN_PROGRESS...'
              : 'This may take a moment. Please wait...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-[#FFF7ED] border border-[#F59E0B]/20 p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-4 w-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
          <div className="space-y-3">
            <div className="text-[14px] font-medium text-[#101010]">
              {chainName} Account Setup Required
            </div>
            <p className="text-[12px] text-[#101010]/70 leading-relaxed">
              To use {chainName} vaults, you need to set up your account on{' '}
              {chainName} first. This is a one-time setup that creates your
              secure savings account on the destination network.
            </p>
            {predictedAddress && (
              <div className="text-[11px] text-[#101010]/50">
                Predicted address:{' '}
                <code className="font-mono">
                  {predictedAddress.slice(0, 10)}...
                  {predictedAddress.slice(-8)}
                </code>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={onDeploy}
        className="w-full py-3 bg-[#1B29FF] text-white text-[14px] font-medium hover:bg-[#1420CC] transition-colors flex items-center justify-center gap-2"
      >
        <Rocket className="h-4 w-4" />
        Set Up {chainName} Account
      </button>

      {onCancel && (
        <button
          onClick={onCancel}
          className="w-full py-2 text-[12px] text-[#101010]/60 hover:text-[#101010] transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );
}

// ============================================================================
// Bridge Quote Display
// ============================================================================

interface BridgeQuoteDisplayProps {
  outputAmount: string;
  outputSymbol: string;
  fee: string;
  estimatedTime: number; // in seconds
  isLoading?: boolean;
  isTechnical?: boolean;
}

export function BridgeQuoteDisplay({
  outputAmount,
  outputSymbol,
  fee,
  estimatedTime,
  isLoading = false,
  isTechnical = false,
}: BridgeQuoteDisplayProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-[10px] font-mono text-[#1B29FF]/60">
        <Loader2 className="h-3 w-3 animate-spin" />
        Fetching quote...
      </div>
    );
  }

  const minutes = Math.ceil(estimatedTime / 60);

  return (
    <div className="p-2 bg-[#1B29FF]/5 border border-[#1B29FF]/20 space-y-1">
      <p className="font-mono text-[10px] text-[#1B29FF]">
        OUTPUT ≈ {outputAmount} {outputSymbol}
      </p>
      <p className="font-mono text-[10px] text-[#101010]/50">
        Fee: ~{fee} • ETA: ~{minutes} min
      </p>
    </div>
  );
}

// ============================================================================
// Card Container with Blueprint Grid (Technical Mode)
// ============================================================================

interface VaultCardContainerProps {
  children: ReactNode;
  isTechnical?: boolean;
}

export function VaultCardContainer({
  children,
  isTechnical = false,
}: VaultCardContainerProps) {
  return (
    <div
      className={cn(
        'space-y-4 relative p-4',
        isTechnical && 'bg-[#fafafa] border border-[#1B29FF]/20',
      )}
    >
      {/* Blueprint grid overlay for technical mode */}
      {isTechnical && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #1B29FF 1px, transparent 1px),
              linear-gradient(to bottom, #1B29FF 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
      )}
      {children}
    </div>
  );
}

// ============================================================================
// Loading Skeleton
// ============================================================================

export function VaultCardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-20 w-full bg-[#101010]/5 animate-pulse" />
      <div className="h-12 w-full bg-[#101010]/5 animate-pulse" />
      <div className="h-12 w-full bg-[#101010]/5 animate-pulse" />
    </div>
  );
}

// ============================================================================
// No Balance State
// ============================================================================

interface NoBalanceStateProps {
  message?: string;
  safeAddress?: string;
  vaultAddress?: string;
  chainId?: number;
  isTechnical?: boolean;
}

export function NoBalanceState({
  message = 'No funds available.',
  safeAddress,
  vaultAddress,
  chainId,
  isTechnical = false,
}: NoBalanceStateProps) {
  return (
    <div className="bg-[#F7F7F2] border border-[#101010]/10 p-4">
      <div className="flex gap-3">
        <AlertCircle className="h-4 w-4 text-[#101010]/40 flex-shrink-0 mt-0.5" />
        <div className="text-[12px] text-[#101010]/60 space-y-1">
          <div>{message}</div>
          {isTechnical && safeAddress && (
            <div className="font-mono text-[10px] text-[#101010]/40 space-y-0.5">
              <div>Safe: {safeAddress}</div>
              {vaultAddress && <div>Vault: {vaultAddress}</div>}
              {chainId && <div>Chain: {chainId}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
