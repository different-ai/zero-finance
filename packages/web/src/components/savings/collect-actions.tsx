/**
 * Collect Actions - Modals for collecting funds from vaults and bridging to Base
 * Handles multi-step flows with progress indicators
 */

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type {
  SafeInfo,
  CrossChainVault,
  SupportedChainId,
} from '@/lib/types/multi-chain';
import { NetworkBadge } from './network-badge';
import { cn } from '@/lib/utils';
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';

interface VaultPosition {
  shares: bigint;
  value: string;
  apy: number;
  vaultId: string;
}

interface CollectFromVaultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  positions: VaultPosition[];
  vaults: CrossChainVault[];
  onConfirm: () => Promise<void>;
}

type StepStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface WithdrawStep {
  vaultId: string;
  vaultName: string;
  chainId: SupportedChainId;
  value: string;
  status: StepStatus;
  txHash?: string;
  error?: string;
}

/**
 * CollectFromVaultsModal - Multi-step withdrawal from all vaults
 *
 * Design Language Compliance:
 * - Modal: Clean white background with proper spacing
 * - Progress indicators: Clear status for each step
 * - Typography: Consistent with design system
 * - Banking terminology: "Collect" not "Withdraw"
 */
export function CollectFromVaultsModal({
  open,
  onOpenChange,
  positions,
  vaults,
  onConfirm,
}: CollectFromVaultsModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<WithdrawStep[]>(() =>
    positions.map((pos) => {
      const vault = vaults.find((v) => v.id === pos.vaultId);
      return {
        vaultId: pos.vaultId,
        vaultName: vault?.displayName || 'Unknown Vault',
        chainId: vault?.chainId || SUPPORTED_CHAINS.BASE,
        value: pos.value,
        status: 'pending' as StepStatus,
      };
    }),
  );

  const handleConfirm = async () => {
    setIsProcessing(true);

    try {
      // Simulate multi-step process
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);

        // Update step to processing
        setSteps((prev) =>
          prev.map((step, idx) =>
            idx === i ? { ...step, status: 'processing' } : step,
          ),
        );

        // Execute withdrawal (this would be the actual onConfirm call)
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async operation

        // Update step to completed
        setSteps((prev) =>
          prev.map((step, idx) =>
            idx === i
              ? { ...step, status: 'completed', txHash: '0x...' }
              : step,
          ),
        );
      }

      // Call the actual confirmation handler
      await onConfirm();

      // Auto-close after a delay
      setTimeout(() => {
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      // Mark current step as failed
      setSteps((prev) =>
        prev.map((step, idx) =>
          idx === currentStep
            ? {
                ...step,
                status: 'failed',
                error: error instanceof Error ? error.message : 'Unknown error',
              }
            : step,
        ),
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const totalValue = positions.reduce((sum, pos) => {
    const numericValue = parseFloat(pos.value.replace(/[$,]/g, ''));
    return sum + (isNaN(numericValue) ? 0 : numericValue);
  }, 0);

  const allCompleted = steps.every((s) => s.status === 'completed');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Collect from Vaults</DialogTitle>
          <DialogDescription>
            Withdraw your funds from {positions.length} vault
            {positions.length === 1 ? '' : 's'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Total value */}
          <div className="p-4 bg-[#F7F7F2] border border-[#101010]/10 rounded-lg">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60 mb-1">
              Total Amount
            </p>
            <p className="text-[24px] font-medium tabular-nums text-[#101010]">
              ${totalValue.toFixed(2)}
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            {steps.map((step) => (
              <WithdrawStepRow key={step.vaultId} step={step} />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-[#101010]/10">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              disabled={isProcessing}
              className="flex-1"
            >
              {allCompleted ? 'Close' : 'Cancel'}
            </Button>
            {!allCompleted && (
              <Button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="flex-1 bg-[#1B29FF] hover:bg-[#1420CC]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  'Confirm'
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function WithdrawStepRow({ step }: { step: WithdrawStep }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-3 rounded-md border',
        step.status === 'completed' && 'bg-[#10b981]/5 border-[#10b981]/20',
        step.status === 'processing' && 'bg-[#1B29FF]/5 border-[#1B29FF]/20',
        step.status === 'failed' && 'bg-[#ef4444]/5 border-[#ef4444]/20',
        step.status === 'pending' && 'bg-[#F7F7F2] border-[#101010]/10',
      )}
    >
      <div className="flex items-center gap-3">
        <StatusIcon status={step.status} />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-[13px] font-medium text-[#101010]">
              {step.vaultName}
            </p>
          </div>
          <NetworkBadge chainId={step.chainId} size="sm" />
        </div>
      </div>

      <div className="text-right">
        <p className="text-[13px] font-medium tabular-nums text-[#101010]">
          {step.value}
        </p>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: StepStatus }) {
  if (status === 'completed') {
    return <CheckCircle2 className="size-5 text-[#10b981] flex-shrink-0" />;
  }
  if (status === 'processing') {
    return (
      <Loader2 className="size-5 text-[#1B29FF] animate-spin flex-shrink-0" />
    );
  }
  if (status === 'failed') {
    return <AlertCircle className="size-5 text-[#ef4444] flex-shrink-0" />;
  }
  return (
    <div className="size-5 rounded-full border-2 border-[#101010]/20 flex-shrink-0" />
  );
}

interface CollectToBaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  safes: SafeInfo[];
  onConfirm: () => Promise<void>;
}

/**
 * CollectToBaseModal - Bridge all funds to Base chain
 *
 * Design Language Compliance:
 * - Shows estimated bridge time
 * - Clear progress indicators
 * - Banking terminology: "Transfer" not "Bridge"
 */
export function CollectToBaseModal({
  open,
  onOpenChange,
  safes,
  onConfirm,
}: CollectToBaseModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const nonBaseSafes = safes.filter(
    (safe) => safe.chainId !== SUPPORTED_CHAINS.BASE,
  );
  const estimatedTime = nonBaseSafes.length * 15; // 15 minutes per chain

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
      setIsCompleted(true);
      setTimeout(() => {
        onOpenChange(false);
        setIsCompleted(false);
      }, 2000);
    } catch (error) {
      console.error('Bridge failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const totalValue = safes.reduce((sum, safe) => {
    return sum + (safe.balance ? Number(safe.balance) / 1e6 : 0);
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transfer to Base</DialogTitle>
          <DialogDescription>
            Bridge funds from {nonBaseSafes.length} account
            {nonBaseSafes.length === 1 ? '' : 's'} to Base
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Total value */}
          <div className="p-4 bg-[#F7F7F2] border border-[#101010]/10 rounded-lg">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60 mb-1">
              Total Amount
            </p>
            <p className="text-[24px] font-medium tabular-nums text-[#101010]">
              ${totalValue.toFixed(2)}
            </p>
          </div>

          {/* Estimated time */}
          <div className="flex items-center justify-between p-3 bg-[#1B29FF]/5 border border-[#1B29FF]/20 rounded-md">
            <span className="text-[13px] text-[#101010]/80">
              Estimated time
            </span>
            <span className="text-[13px] font-medium text-[#101010]">
              ~{estimatedTime} minutes
            </span>
          </div>

          {/* Accounts to bridge */}
          <div className="space-y-2">
            {nonBaseSafes.map((safe) => (
              <div
                key={`${safe.safeAddress}-${safe.chainId}`}
                className="flex items-center justify-between p-3 bg-[#F7F7F2] border border-[#101010]/10 rounded-md"
              >
                <div className="flex items-center gap-3">
                  <NetworkBadge chainId={safe.chainId} size="sm" />
                  <ArrowRight className="size-4 text-[#101010]/40" />
                  <NetworkBadge chainId={SUPPORTED_CHAINS.BASE} size="sm" />
                </div>
                <p className="text-[13px] font-medium tabular-nums text-[#101010]">
                  $
                  {safe.balance
                    ? (Number(safe.balance) / 1e6).toFixed(2)
                    : '0.00'}
                </p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-[#101010]/10">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isProcessing || isCompleted}
              className="flex-1 bg-[#1B29FF] hover:bg-[#1420CC]"
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="size-4 mr-2" />
                  Complete
                </>
              ) : isProcessing ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Confirm Transfer'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
