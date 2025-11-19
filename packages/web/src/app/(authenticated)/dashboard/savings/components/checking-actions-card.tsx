'use client';

import { useState, useEffect } from 'react';
import {
  ArrowRightCircle,
  Info,
  Building2,
  Copy,
  Check,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SimplifiedOffRamp } from '@/components/transfers/simplified-off-ramp';
import { BankingInstructionsDisplay } from '@/components/virtual-accounts/banking-instructions-display';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePrivy } from '@privy-io/react-auth';
import { useSafeOwnerCheck } from '@/hooks/use-safe-owner-check';
import { api } from '@/trpc/react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatUsd } from '@/lib/utils';
import { demoFundingSources, demoUserData } from '../demo-data';
import {
  getChainDisplayName,
  type SupportedChainId,
} from '@/lib/constants/chains';

type CheckingActionsCardProps = {
  balanceUsd: number;
  safeAddress: string | null;
  isDemoMode: boolean;
};

export function CheckingActionsCard({
  balanceUsd,
  safeAddress,
  isDemoMode,
}: CheckingActionsCardProps) {
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isAccountInfoOpen, setIsAccountInfoOpen] = useState(false);
  const [copiedSafeAddress, setCopiedSafeAddress] = useState<string | null>(
    null,
  );
  const [showAdvancedDetails, setShowAdvancedDetails] = useState(false);
  const isMobile = useIsMobile();
  const { ready, authenticated, user } = usePrivy();
  const { isOwner, isChecking: isCheckingOwnership } =
    useSafeOwnerCheck(safeAddress);

  const {
    data: accountData,
    isLoading: isLoadingFundingSources,
    refetch: refetchFundingSources,
  } = api.align.getVirtualAccountDetails.useQuery(undefined, {
    enabled: !isDemoMode && ready && authenticated && !!user?.id,
  });

  const { data: multiChainData, isLoading: isLoadingMultiChain } =
    api.earn.getMultiChainPositions.useQuery(undefined, {
      enabled: !isDemoMode && isAccountInfoOpen,
    });

  const [hasRequestedStarterAccounts, setHasRequestedStarterAccounts] =
    useState(false);

  const createStarterAccountsMutation =
    api.align.createStarterAccountsRetroactively.useMutation({
      onSuccess: () => {
        void refetchFundingSources();
      },
      onError: (error) => {
        console.error(
          '[Banking Instructions] Failed to create starter accounts:',
          error,
        );
        setHasRequestedStarterAccounts(false);
      },
    });

  const fundingSources = isDemoMode
    ? demoFundingSources
    : accountData?.fundingSources || [];
  const userData = isDemoMode ? demoUserData : accountData?.userData;
  const hasCompletedKyc = isDemoMode
    ? false
    : accountData?.hasCompletedKyc || false;

  const achAccount = fundingSources.find(
    (source) => source.sourceAccountType === 'us_ach',
  );
  const ibanAccount = fundingSources.find(
    (source) => source.sourceAccountType === 'iban',
  );

  const hasVirtualAccounts = Boolean(achAccount || ibanAccount);

  useEffect(() => {
    setHasRequestedStarterAccounts(false);
  }, [safeAddress]);

  const handleCopyAddress = (address: string) => {
    if (!address || typeof navigator === 'undefined') return;
    navigator.clipboard
      .writeText(address)
      .then(() => {
        setCopiedSafeAddress(address);
        setTimeout(() => setCopiedSafeAddress(null), 2000);
      })
      .catch((error) => console.error('Failed to copy address', error));
  };

  const hasOnlyStarterAccounts = !hasCompletedKyc && fundingSources.length > 0;
  const canInitiateMove =
    (isDemoMode || balanceUsd > 0) &&
    !!safeAddress &&
    !hasOnlyStarterAccounts &&
    isOwner !== false;
  const disableReason = !safeAddress
    ? 'Add a treasury safe to move funds'
    : isOwner === false
      ? 'You are not an owner of this Safe'
      : balanceUsd <= 0
        ? 'No withdrawable balance available'
        : hasOnlyStarterAccounts
          ? 'Complete business verification to enable withdrawals'
          : undefined;

  return (
    <div className="bg-white border border-[#101010]/10 rounded-[12px] p-6 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1">
          <p className="uppercase tracking-[0.16em] text-[11px] text-[#101010]/60 mb-2">
            Available Balance
          </p>
          <p className="text-[32px] sm:text-[40px] font-semibold leading-[0.95] tabular-nums text-[#101010]">
            {formatUsd(balanceUsd)}
          </p>
          <p className="mt-3 text-[13px] text-[#101010]/60">
            Ready to transfer or invest
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Dialog open={isMoveModalOpen} onOpenChange={setIsMoveModalOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-[15px] font-semibold text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors"
              disabled={
                !isDemoMode && (!canInitiateMove || isCheckingOwnership)
              }
              title={
                !isDemoMode && !canInitiateMove ? disableReason : undefined
              }
            >
              <ArrowRightCircle className="h-5 w-5" />
              Move Funds
            </Button>
          </DialogTrigger>
          <DialogContent
            className={`p-0 ${isMobile ? 'h-screen max-h-screen w-screen max-w-none m-0' : 'max-w-2xl'}`}
          >
            <SimplifiedOffRamp
              fundingSources={fundingSources}
              maxBalance={balanceUsd}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={isAccountInfoOpen}
          onOpenChange={(open) => {
            setIsAccountInfoOpen(open);
            if (!isDemoMode && open) {
              void refetchFundingSources();
              if (
                !hasRequestedStarterAccounts &&
                !isLoadingFundingSources &&
                fundingSources.length === 0 &&
                safeAddress &&
                !createStarterAccountsMutation.isPending
              ) {
                setHasRequestedStarterAccounts(true);
                createStarterAccountsMutation.mutate();
              }
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-[15px] font-semibold text-[#101010] border border-[#101010]/10 hover:border-[#1B29FF]/20 hover:text-[#1B29FF] hover:bg-[#F7F7F2] transition-colors"
            >
              <Info className="h-5 w-5 text-[#101010]/60" />
              Account Info
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-[#101010]/10 max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="border-b border-[#101010]/10 pb-4">
              <div>
                <p className="uppercase tracking-[0.12em] text-[11px] text-[#101010]/60 mb-2">
                  Banking information
                </p>
                <DialogTitle className="text-[22px] font-semibold tracking-[-0.01em] text-[#101010] flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[#101010]/60" />
                  Your account details
                </DialogTitle>

                {/* Advanced Account Details Section */}
                {(isDemoMode ||
                  (multiChainData?.safes &&
                    multiChainData.safes.length > 0)) && (
                  <div className="mt-6 border-t border-[#101010]/10 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAdvancedDetails((prev) => !prev)}
                      className="inline-flex items-center gap-2 text-[12px] font-medium text-[#101010]/70 hover:text-[#1B29FF] transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      {showAdvancedDetails
                        ? 'Hide advanced details'
                        : 'Advanced'}
                    </button>

                    {showAdvancedDetails && (
                      <div className="mt-3 space-y-2">
                        <p className="text-[11px] text-[#101010]/50 px-1 mb-2">
                          Account identifiers for receiving crypto payments
                          directly.
                        </p>
                        {isDemoMode ? (
                          <div className="rounded-[10px] border border-[#101010]/10 bg-[#F7F7F2] p-3 text-[12px]">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <span className="uppercase tracking-[0.1em] text-[10px] text-[#101010]/50 block mb-0.5">
                                  Primary Account (Demo)
                                </span>
                                <code className="font-mono text-[11px] text-[#101010]">
                                  {safeAddress}
                                </code>
                              </div>
                            </div>
                          </div>
                        ) : (
                          multiChainData?.safes.map((safe) => (
                            <div
                              key={safe.id}
                              className="rounded-[10px] border border-[#101010]/10 bg-[#F7F7F2] p-3 text-[12px]"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                  <span className="uppercase tracking-[0.1em] text-[10px] text-[#101010]/50 block mb-0.5">
                                    {getChainDisplayName(safe.chainId)} Account
                                  </span>
                                  <code className="font-mono text-[11px] text-[#101010] break-all">
                                    {safe.address}
                                  </code>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCopyAddress(safe.address)
                                  }
                                  className="self-start sm:self-auto flex-shrink-0 inline-flex items-center gap-1 rounded-full border border-[#101010]/15 bg-white px-3 py-1 text-[11px] text-[#101010] hover:border-[#1B29FF]/30 hover:text-[#1B29FF] transition-colors"
                                >
                                  {copiedSafeAddress === safe.address ? (
                                    <>
                                      <Check className="h-3 w-3" /> Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" /> Copy
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </DialogHeader>

            {isLoadingFundingSources ||
            createStarterAccountsMutation.isPending ? (
              <div className="space-y-3 py-6">
                <div className="text-center mb-4">
                  <p className="text-[13px] text-[#101010]/60">
                    {createStarterAccountsMutation.isPending
                      ? 'Creating your starter accounts...'
                      : 'Loading account details...'}
                  </p>
                </div>
                {[1, 2, 3].map((item) => (
                  <Skeleton key={item} className="h-12 w-full bg-[#101010]/5" />
                ))}
              </div>
            ) : hasVirtualAccounts ? (
              <BankingInstructionsDisplay
                accounts={fundingSources}
                userData={userData}
              />
            ) : (
              <div className="py-6 text-[14px] text-[#101010]/70">
                No virtual bank accounts are connected yet. Connect an account
                in onboarding to enable transfers.
              </div>
            )}

            {isDemoMode && (
              <div className="mt-4 rounded-[10px] border border-[#101010]/10 bg-[#F7F7F2] p-4 text-[12px] text-[#101010]/70">
                Demo mode shows sample banking instructions. Sign in to your
                live workspace to view real account numbers.
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-[12px] text-[#101010]/60">
        {isDemoMode
          ? 'Use these controls to explore how deposits and withdrawals work in Zero Finance.'
          : hasVirtualAccounts
            ? 'Transfers settle directly into your Zero treasury safe.'
            : 'Once your virtual account is approved, you can pull cash into savings here.'}
      </p>
    </div>
  );
}
