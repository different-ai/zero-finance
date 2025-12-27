'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  ArrowRightCircle,
  ArrowLeft,
  ChevronRight,
  Building2,
  Wallet,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { useBimodal } from '@/components/ui/bimodal';
import { cn, formatUsd } from '@/lib/utils';
import { SimplifiedOffRamp } from '@/components/transfers/simplified-off-ramp';
import { BankingInstructionsDisplay } from '@/components/virtual-accounts/banking-instructions-display';
import { CryptoDepositDisplay } from '@/components/virtual-accounts/crypto-deposit-display';
import { useIsMobile } from '@/hooks/use-mobile';
import { api } from '@/trpc/react';
import { usePrivy } from '@privy-io/react-auth';
import { type VaultPosition } from './dashboard-summary-wrapper';

type DepositView = 'select' | 'bank' | 'crypto';

type DashboardSummaryProps = {
  spendableBalance: number; // Total (Earning + Idle)
  earningBalance: number; // In vaults, generating yield
  idleBalance: number; // In Safe, not earning
  vaultPositions: VaultPosition[]; // For transfer flow (vault withdrawal)
  savingsApy: number;
  safeAddress: string | null;
  isDemoMode?: boolean;
};

export function DashboardSummary({
  spendableBalance,
  earningBalance,
  idleBalance,
  vaultPositions,
  savingsApy,
  safeAddress,
  isDemoMode = false,
}: DashboardSummaryProps) {
  const { isTechnical } = useBimodal();
  const isMobile = useIsMobile();
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositView, setDepositView] = useState<DepositView>('select');
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const { ready, authenticated, user } = usePrivy();

  // Fetch funding sources for transfer modal
  const {
    data: accountData,
    isLoading: isLoadingFundingSources,
    refetch: refetchFundingSources,
  } = api.align.getVirtualAccountDetails.useQuery(undefined, {
    enabled: !isDemoMode && ready && authenticated && !!user?.id,
  });

  // Fetch multi-chain positions for crypto deposit address
  const { data: multiChainData } = api.earn.getMultiChainPositions.useQuery(
    undefined,
    {
      enabled: !isDemoMode && ready && authenticated,
      staleTime: 30000,
    },
  );

  const fundingSources = isDemoMode ? [] : accountData?.fundingSources || [];
  const userData = isDemoMode ? null : accountData?.userData;

  // Get Base Safe address for crypto deposits
  const baseSafe = multiChainData?.safes?.find((s) => s.chainId === 8453);

  // Reset deposit view when dialog closes
  const handleDepositOpenChange = (open: boolean) => {
    setIsDepositOpen(open);
    if (!open) {
      setDepositView('select');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch">
      {/* Balance Card - Spendable | Earning | Idle */}
      <div
        className={cn(
          'flex-1 grid gap-4 p-6',
          'grid-cols-1 md:grid-cols-3',
          isTechnical
            ? 'border border-[#1B29FF]/20'
            : 'border border-[#101010]/10',
        )}
      >
        {/* Column 1 - Spendable Balance (Total) */}
        <div className="flex flex-col justify-center">
          <p
            className={cn(
              'mb-1',
              isTechnical
                ? 'font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase'
                : 'uppercase tracking-[0.14em] text-[11px] text-[#101010]/60',
            )}
          >
            {isTechnical ? 'BALANCE::SPENDABLE' : 'Spendable'}
          </p>
          <p
            className={cn(
              'tabular-nums',
              isTechnical
                ? 'font-mono text-[28px] text-[#101010]'
                : 'text-[32px] font-semibold text-[#101010]',
            )}
          >
            {formatUsd(spendableBalance)}
          </p>
        </div>

        {/* Column 2 - Earning Balance (Clickable) */}
        <Link
          href="/dashboard/savings"
          className={cn(
            'flex flex-col justify-center px-4 py-3 -my-3 transition-colors group',
            isTechnical
              ? 'hover:bg-[#1B29FF]/5 border-l border-[#1B29FF]/10'
              : 'hover:bg-[#F7F7F2] border-l border-[#101010]/10',
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={cn(
                  'mb-1',
                  isTechnical
                    ? 'font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase'
                    : 'uppercase tracking-[0.14em] text-[11px] text-[#101010]/60',
                )}
              >
                {isTechnical ? 'VAULT::EARNING' : 'Earning'}
              </p>
              <p
                className={cn(
                  'tabular-nums',
                  isTechnical
                    ? 'font-mono text-[28px] text-[#101010]'
                    : 'text-[32px] font-semibold text-[#101010]',
                )}
              >
                {formatUsd(earningBalance)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <TrendingUp
                  className={cn(
                    'h-3 w-3',
                    isTechnical ? 'text-[#1B29FF]' : 'text-green-600',
                  )}
                />
                <span
                  className={cn(
                    'text-[12px]',
                    isTechnical
                      ? 'font-mono text-[#1B29FF]'
                      : 'text-green-600 font-medium',
                  )}
                >
                  {savingsApy.toFixed(2)}% APY
                </span>
              </div>
            </div>
            <ChevronRight
              className={cn(
                'h-5 w-5 transition-transform group-hover:translate-x-1',
                isTechnical ? 'text-[#1B29FF]/60' : 'text-[#101010]/40',
              )}
            />
          </div>
        </Link>

        {/* Column 3 - Idle Balance */}
        <div
          className={cn(
            'flex flex-col justify-center px-4 py-3 -my-3',
            isTechnical
              ? 'border-l border-[#1B29FF]/10'
              : 'border-l border-[#101010]/10',
          )}
        >
          <p
            className={cn(
              'mb-1',
              isTechnical
                ? 'font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase'
                : 'uppercase tracking-[0.14em] text-[11px] text-[#101010]/60',
            )}
          >
            {isTechnical ? 'BALANCE::IDLE' : 'Idle'}
          </p>
          <p
            className={cn(
              'tabular-nums',
              isTechnical
                ? 'font-mono text-[28px] text-[#101010]'
                : 'text-[32px] font-semibold text-[#101010]',
            )}
          >
            {formatUsd(idleBalance)}
          </p>
          <p
            className={cn(
              'mt-1',
              isTechnical
                ? 'font-mono text-[11px] text-[#101010]/50'
                : 'text-[11px] text-[#101010]/50',
            )}
          >
            {isTechnical ? 'NOT_EARNING' : 'Not earning'}
          </p>
        </div>
      </div>

      {/* Action Buttons - Outside the card, on the right */}
      <div className="flex flex-col justify-center gap-2 items-center sm:min-w-[250px] sm:max-w-[180px]">
        {/* Deposit Button */}
        <Dialog open={isDepositOpen} onOpenChange={handleDepositOpenChange}>
          <DialogTrigger asChild>
            <Button
              className={cn(
                'w-full justify-center bg-[#1B29FF] text-white hover:bg-[#1420CC]',
                isTechnical && 'font-mono',
              )}
            >
              {isTechnical ? 'DEPOSIT' : 'Deposit'}
            </Button>
          </DialogTrigger>
          <DialogContent
            className={cn(
              'bg-white border-[#101010]/10',
              depositView === 'select'
                ? 'max-w-md'
                : 'max-w-2xl max-h-[90vh] overflow-y-auto',
            )}
          >
            {/* Selection View */}
            {depositView === 'select' && (
              <>
                <DialogHeader className="border-b border-[#101010]/10 pb-4">
                  <DialogTitle
                    className={cn(
                      isTechnical
                        ? 'font-mono text-[18px] text-[#1B29FF]'
                        : 'text-[22px] font-semibold tracking-[-0.01em] text-[#101010]',
                    )}
                  >
                    {isTechnical ? 'DEPOSIT::FUNDS' : 'Deposit'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 pt-6 pb-2">
                  {/* Bank Transfer Option */}
                  <button
                    onClick={() => {
                      setDepositView('bank');
                      refetchFundingSources();
                    }}
                    className={cn(
                      'w-full flex items-center gap-4 p-5 transition-all group text-left',
                      isTechnical
                        ? 'border border-[#1B29FF]/20 hover:border-[#1B29FF]/40 hover:bg-[#1B29FF]/5'
                        : 'border border-[#101010]/10 rounded-[12px] hover:border-[#1B29FF]/30 hover:shadow-[0_2px_8px_rgba(16,16,16,0.04)]',
                    )}
                  >
                    <div
                      className={cn(
                        'h-12 w-12 flex items-center justify-center',
                        isTechnical
                          ? 'bg-[#1B29FF]/10'
                          : 'bg-[#F7F7F2] rounded-full',
                      )}
                    >
                      <Building2
                        className={cn(
                          'h-6 w-6',
                          isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]/70',
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <p
                        className={cn(
                          'text-[16px] font-medium mb-0.5',
                          isTechnical
                            ? 'font-mono text-[#1B29FF]'
                            : 'text-[#101010]',
                        )}
                      >
                        {isTechnical ? 'ACH::WIRE' : 'ACH / Wire'}
                      </p>
                      <p
                        className={cn(
                          'text-[13px]',
                          isTechnical
                            ? 'font-mono text-[#101010]/60'
                            : 'text-[#101010]/60',
                        )}
                      >
                        {isTechnical
                          ? 'ACH / SEPA / Wire → USDC'
                          : 'Receive via ACH or wire transfer'}
                      </p>
                    </div>
                    <ArrowRightCircle
                      className={cn(
                        'h-5 w-5 transition-colors',
                        isTechnical
                          ? 'text-[#1B29FF]/40 group-hover:text-[#1B29FF]'
                          : 'text-[#101010]/20 group-hover:text-[#1B29FF]',
                      )}
                    />
                  </button>

                  {/* Crypto Deposit Option */}
                  {(baseSafe || safeAddress) && (
                    <button
                      onClick={() => setDepositView('crypto')}
                      className={cn(
                        'w-full flex items-center gap-4 p-5 transition-all group text-left',
                        isTechnical
                          ? 'border border-[#1B29FF]/20 hover:border-[#1B29FF]/40 hover:bg-[#1B29FF]/5'
                          : 'border border-[#101010]/10 rounded-[12px] hover:border-[#1B29FF]/30 hover:shadow-[0_2px_8px_rgba(16,16,16,0.04)]',
                      )}
                    >
                      <div
                        className={cn(
                          'h-12 w-12 flex items-center justify-center',
                          isTechnical
                            ? 'bg-[#1B29FF]/10'
                            : 'bg-[#F7F7F2] rounded-full',
                        )}
                      >
                        <Wallet
                          className={cn(
                            'h-6 w-6',
                            isTechnical
                              ? 'text-[#1B29FF]'
                              : 'text-[#101010]/70',
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <p
                          className={cn(
                            'text-[16px] font-medium mb-0.5',
                            isTechnical
                              ? 'font-mono text-[#1B29FF]'
                              : 'text-[#101010]',
                          )}
                        >
                          {isTechnical ? 'CRYPTO::DEPOSIT' : 'Crypto Deposit'}
                        </p>
                        <p
                          className={cn(
                            'text-[13px]',
                            isTechnical
                              ? 'font-mono text-[#101010]/60'
                              : 'text-[#101010]/60',
                          )}
                        >
                          {isTechnical
                            ? 'USDC on Base → Direct to Safe'
                            : 'Send USDC on Base network'}
                        </p>
                      </div>
                      <ArrowRightCircle
                        className={cn(
                          'h-5 w-5 transition-colors',
                          isTechnical
                            ? 'text-[#1B29FF]/40 group-hover:text-[#1B29FF]'
                            : 'text-[#101010]/20 group-hover:text-[#1B29FF]',
                        )}
                      />
                    </button>
                  )}
                </div>
              </>
            )}

            {/* Bank Transfer View */}
            {depositView === 'bank' && (
              <>
                <DialogHeader className="border-b border-[#101010]/10 pb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setDepositView('select')}
                      className={cn(
                        'p-2 -ml-2 transition-colors',
                        isTechnical
                          ? 'hover:bg-[#1B29FF]/10 text-[#1B29FF]'
                          : 'hover:bg-[#F7F7F2] text-[#101010]/60 rounded-full',
                      )}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <DialogTitle
                      className={cn(
                        'flex items-center gap-2',
                        isTechnical
                          ? 'font-mono text-[18px] text-[#1B29FF]'
                          : 'text-[22px] font-semibold tracking-[-0.01em] text-[#101010]',
                      )}
                    >
                      <Building2
                        className={cn(
                          'h-5 w-5',
                          isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]/60',
                        )}
                      />
                      {isTechnical ? 'ACH::WIRE' : 'ACH / Wire Transfer'}
                    </DialogTitle>
                  </div>
                </DialogHeader>

                {isLoadingFundingSources ? (
                  <div className="py-12 text-center">
                    <Loader2
                      className={cn(
                        'h-8 w-8 animate-spin mx-auto mb-4',
                        'text-[#1B29FF]',
                      )}
                    />
                    <p
                      className={cn(
                        'text-[14px]',
                        isTechnical
                          ? 'font-mono text-[#1B29FF]'
                          : 'text-[#101010]/60',
                      )}
                    >
                      {isTechnical
                        ? 'LOADING::ACCOUNTS'
                        : 'Loading accounts...'}
                    </p>
                  </div>
                ) : fundingSources.length > 0 ? (
                  <BankingInstructionsDisplay
                    accounts={fundingSources}
                    userData={userData}
                  />
                ) : (
                  <div
                    className={cn(
                      'py-12 text-center',
                      isTechnical && 'font-mono',
                    )}
                  >
                    <div
                      className={cn(
                        'mx-auto mb-4 h-16 w-16 flex items-center justify-center',
                        isTechnical
                          ? 'bg-[#1B29FF]/10'
                          : 'bg-[#F7F7F2] rounded-full',
                      )}
                    >
                      <Building2
                        className={cn(
                          'h-8 w-8',
                          isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]/40',
                        )}
                      />
                    </div>
                    <p
                      className={cn(
                        'text-[16px] font-medium mb-2',
                        isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]',
                      )}
                    >
                      {isTechnical
                        ? 'NO_ACCOUNTS::FOUND'
                        : 'No bank accounts yet'}
                    </p>
                    <p
                      className={cn(
                        'text-[14px] max-w-[300px] mx-auto',
                        'text-[#101010]/60',
                      )}
                    >
                      {isTechnical
                        ? 'INIT::ONBOARDING -> CREATE::VIRTUAL_ACCOUNTS'
                        : 'Complete onboarding to get your virtual bank accounts.'}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Crypto Deposit View */}
            {depositView === 'crypto' && (baseSafe || safeAddress) && (
              <>
                <DialogHeader className="border-b border-[#101010]/10 pb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setDepositView('select')}
                      className={cn(
                        'p-2 -ml-2 transition-colors',
                        isTechnical
                          ? 'hover:bg-[#1B29FF]/10 text-[#1B29FF]'
                          : 'hover:bg-[#F7F7F2] text-[#101010]/60 rounded-full',
                      )}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <DialogTitle
                      className={cn(
                        'flex items-center gap-2',
                        isTechnical
                          ? 'font-mono text-[18px] text-[#1B29FF]'
                          : 'text-[22px] font-semibold tracking-[-0.01em] text-[#101010]',
                      )}
                    >
                      <Wallet
                        className={cn(
                          'h-5 w-5',
                          isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]/60',
                        )}
                      />
                      {isTechnical ? 'CRYPTO::DEPOSIT' : 'Crypto Deposit'}
                    </DialogTitle>
                  </div>
                </DialogHeader>

                <div className="py-6">
                  <CryptoDepositDisplay
                    safeAddress={baseSafe?.address || safeAddress || ''}
                    chainName="Base"
                  />
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Transfer Button */}
        <Dialog
          open={isTransferOpen}
          onOpenChange={(open) => {
            setIsTransferOpen(open);
            if (open) refetchFundingSources();
          }}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-center gap-2',
                isTechnical
                  ? 'border-[#1B29FF]/40 text-[#1B29FF] hover:bg-[#1B29FF]/5 font-mono'
                  : 'border-[#101010]/20 text-[#101010] hover:bg-[#F7F7F2] hover:text-[#1B29FF]',
              )}
            >
              <ArrowRightCircle className="h-4 w-4" />
              {isTechnical ? 'TRANSFER' : 'Transfer'}
            </Button>
          </DialogTrigger>
          <DialogContent
            className={`p-0 ${isMobile ? 'h-screen max-h-screen w-screen max-w-none m-0' : 'max-w-2xl'}`}
          >
            <SimplifiedOffRamp
              fundingSources={fundingSources}
              idleBalance={idleBalance}
              earningBalance={earningBalance}
              spendableBalance={spendableBalance}
              vaultPositions={vaultPositions}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
