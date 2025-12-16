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
  ChevronRight,
  Building2,
  Wallet,
  TrendingUp,
} from 'lucide-react';
import { useBimodal } from '@/components/ui/bimodal';
import { cn, formatUsd } from '@/lib/utils';
import { SimplifiedOffRamp } from '@/components/transfers/simplified-off-ramp';
import { AccountInfoDialog } from '@/components/virtual-accounts/account-info-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { api } from '@/trpc/react';
import { usePrivy } from '@privy-io/react-auth';

type DashboardSummaryProps = {
  availableBalance: number;
  savingsBalance: number;
  savingsApy: number;
  safeAddress: string | null;
  isDemoMode?: boolean;
};

export function DashboardSummary({
  availableBalance,
  savingsBalance,
  savingsApy,
  safeAddress,
  isDemoMode = false,
}: DashboardSummaryProps) {
  const { isTechnical } = useBimodal();
  const isMobile = useIsMobile();
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const { ready, authenticated, user } = usePrivy();

  // Fetch funding sources for transfer modal
  const { data: accountData, refetch: refetchFundingSources } =
    api.align.getVirtualAccountDetails.useQuery(undefined, {
      enabled: !isDemoMode && ready && authenticated && !!user?.id,
    });

  const fundingSources = isDemoMode ? [] : accountData?.fundingSources || [];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch">
      {/* Balance Card - Only contains Available Balance and Savings Balance */}
      <div
        className={cn(
          'flex-1 grid gap-4 p-6',
          'grid-cols-1 md:grid-cols-2',
          isTechnical
            ? 'bg-white border border-[#1B29FF]/20'
            : 'bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)]',
        )}
      >
        {/* Left Column - Available Balance */}
        <div className="flex flex-col justify-center">
          <p
            className={cn(
              'mb-1',
              isTechnical
                ? 'font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase'
                : 'uppercase tracking-[0.14em] text-[11px] text-[#101010]/60',
            )}
          >
            {isTechnical ? 'BALANCE::AVAILABLE' : 'Available Balance'}
          </p>
          <p
            className={cn(
              'tabular-nums',
              isTechnical
                ? 'font-mono text-[28px] text-[#101010]'
                : 'text-[32px] font-semibold text-[#101010]',
            )}
          >
            {formatUsd(availableBalance)}
          </p>
          {isTechnical && (
            <p className="mt-1 font-mono text-[11px] text-[#101010]/50">
              Ready for transfer or deposit
            </p>
          )}
        </div>

        {/* Right Column - Savings Balance (Clickable) */}
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
                {isTechnical ? 'VAULT::SAVINGS' : 'Savings Balance'}
              </p>
              <p
                className={cn(
                  'tabular-nums',
                  isTechnical
                    ? 'font-mono text-[28px] text-[#101010]'
                    : 'text-[32px] font-semibold text-[#101010]',
                )}
              >
                {formatUsd(savingsBalance)}
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
      </div>

      {/* Action Buttons - Outside the card, on the right */}
      <div className="flex flex-col justify-center gap-2 items-center sm:min-w-[250px] sm:max-w-[180px]">
        {/* Deposit Button - Banking mode opens AccountInfoDialog directly, Technical mode shows options */}
        {isTechnical ? (
          <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
            <DialogTrigger asChild>
              <Button className="w-full justify-center bg-[#1B29FF] text-white hover:bg-[#1420CC] font-mono">
                DEPOSIT
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-[#101010]/10 max-w-md">
              <DialogHeader className="border-b border-[#101010]/10 pb-4">
                <DialogTitle className="font-serif text-[24px] leading-[1.1] text-[#101010]">
                  Select Funding Method
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 pt-4">
                {/* Bank Transfer Option */}
                <AccountInfoDialog
                  isDemoMode={isDemoMode}
                  safeAddress={safeAddress}
                  trigger={
                    <button className="w-full flex items-center gap-4 p-4 border border-[#101010]/10 hover:bg-[#F7F7F2] hover:border-[#101010]/20 transition-all text-left">
                      <div className="h-12 w-12 flex items-center justify-center bg-[#F7F7F2]">
                        <Building2 className="h-6 w-6 text-[#101010]/70" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[15px] font-medium text-[#101010]">
                          Wire Transfer
                        </p>
                        <p className="text-[13px] text-[#101010]/60">
                          ACH / SEPA / Wire via virtual account
                        </p>
                      </div>
                    </button>
                  }
                />

                {/* Crypto Option */}
                <button
                  onClick={() => setIsDepositOpen(false)}
                  className="w-full flex items-center gap-4 p-4 border border-[#1B29FF]/20 hover:bg-[#1B29FF]/5 hover:border-[#1B29FF]/40 transition-all text-left"
                >
                  <div className="h-12 w-12 flex items-center justify-center bg-[#1B29FF]/10">
                    <Wallet className="h-6 w-6 text-[#1B29FF]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-medium text-[#1B29FF] font-mono">
                      Crypto Deposit
                    </p>
                    <p className="text-[13px] text-[#101010]/60">
                      USDC on Base network
                    </p>
                  </div>
                </button>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          /* Banking mode - Deposit button opens AccountInfoDialog directly */
          <AccountInfoDialog
            isDemoMode={isDemoMode}
            safeAddress={safeAddress}
            trigger={
              <Button className="w-full justify-center bg-[#1B29FF] text-white hover:bg-[#1420CC]">
                Deposit
              </Button>
            }
          />
        )}

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
              maxBalance={availableBalance}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
