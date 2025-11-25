'use client';

import { useState, useEffect } from 'react';
import { Building2, Globe, Copy, Check, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BankingInstructionsDisplay } from './banking-instructions-display';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useBimodal } from '@/components/ui/bimodal';
import { usePrivy } from '@privy-io/react-auth';
import { api } from '@/trpc/react';
import { getChainDisplayName } from '@/lib/constants/chains';

// Demo data for when in demo mode
const demoFundingSources = [
  {
    id: 'demo-ach',
    accountTier: 'starter' as const,
    sourceAccountType: 'us_ach' as const,
    sourceCurrency: 'USD',
    sourceBankName: 'Demo Bank',
    sourceRoutingNumber: '123456789',
    sourceAccountNumber: '9876543210',
    sourceIban: null,
    sourceBicSwift: null,
    sourceBankBeneficiaryName: 'Demo User',
    status: 'active',
  },
];

const demoUserData = {
  firstName: 'Demo',
  lastName: 'User',
  companyName: null,
};

interface AccountInfoDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  isDemoMode?: boolean;
  safeAddress?: string | null;
}

export function AccountInfoDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
  isDemoMode = false,
  safeAddress,
}: AccountInfoDialogProps) {
  const { isTechnical } = useBimodal();
  const [internalOpen, setInternalOpen] = useState(false);
  const [showAdvancedDetails, setShowAdvancedDetails] = useState(false);
  const [copiedSafeAddress, setCopiedSafeAddress] = useState<string | null>(
    null,
  );
  const [hasRequestedStarterAccounts, setHasRequestedStarterAccounts] =
    useState(false);

  const { ready, authenticated, user } = usePrivy();

  // Use controlled or internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = controlledOnOpenChange || setInternalOpen;

  const {
    data: accountData,
    isLoading: isLoadingFundingSources,
    refetch: refetchFundingSources,
  } = api.align.getVirtualAccountDetails.useQuery(undefined, {
    enabled: !isDemoMode && ready && authenticated && !!user?.id,
  });

  const { data: multiChainData } = api.earn.getMultiChainPositions.useQuery(
    undefined,
    {
      enabled: !isDemoMode,
      staleTime: 30000,
    },
  );

  const createStarterAccountsMutation =
    api.align.createStarterAccountsRetroactively.useMutation({
      onSuccess: () => {
        void refetchFundingSources();
      },
      onError: (error) => {
        console.error(
          '[AccountInfoDialog] Failed to create starter accounts:',
          error,
        );
        setHasRequestedStarterAccounts(false);
      },
    });

  const fundingSources = isDemoMode
    ? demoFundingSources
    : accountData?.fundingSources || [];
  const userData = isDemoMode ? demoUserData : accountData?.userData;

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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
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
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="bg-white border-[#101010]/10 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-[#101010]/10 pb-4">
          <div>
            <p
              className={cn(
                'mb-2',
                isTechnical
                  ? 'font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase'
                  : 'uppercase tracking-[0.12em] text-[11px] text-[#101010]/60',
              )}
            >
              {isTechnical ? 'SYS::BANKING_INFO' : 'Banking information'}
            </p>
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
              {isTechnical ? 'ACCOUNT::DETAILS' : 'Your account details'}
            </DialogTitle>
          </div>
        </DialogHeader>

        {isLoadingFundingSources || createStarterAccountsMutation.isPending ? (
          <div className="py-12 text-center">
            <div className="flex justify-center mb-4">
              <Loader2
                className={cn(
                  'h-8 w-8 animate-spin',
                  isTechnical ? 'text-[#1B29FF]' : 'text-[#1B29FF]',
                )}
              />
            </div>
            <p
              className={cn(
                'text-[14px] mb-1',
                isTechnical
                  ? 'font-mono text-[#1B29FF]'
                  : 'font-medium text-[#101010]',
              )}
            >
              {createStarterAccountsMutation.isPending
                ? isTechnical
                  ? 'INIT::STARTER_ACCOUNTS'
                  : 'Setting up your accounts'
                : isTechnical
                  ? 'LOADING::ACCOUNT_DATA'
                  : 'Loading account details'}
            </p>
            <p
              className={cn(
                'text-[13px] max-w-[400px] mx-auto',
                isTechnical
                  ? 'font-mono text-[#101010]/60'
                  : 'text-[#101010]/60',
              )}
            >
              {createStarterAccountsMutation.isPending
                ? 'Creating your virtual bank accounts for deposits and transfers.'
                : 'Please wait while we fetch your banking information.'}
            </p>
          </div>
        ) : hasVirtualAccounts ? (
          <BankingInstructionsDisplay
            accounts={fundingSources}
            userData={userData}
          />
        ) : (
          <div
            className={cn(
              'py-6',
              isTechnical
                ? 'font-mono text-[12px] text-[#1B29FF]/60'
                : 'text-[14px] text-[#101010]/70',
            )}
          >
            {isTechnical
              ? 'NO_ACCOUNTS::CONNECT_VIA_ONBOARDING'
              : 'No virtual bank accounts are connected yet. Connect an account in onboarding to enable transfers.'}
          </div>
        )}

        {/* Advanced/USDC Account Details Section */}
        {(isDemoMode ||
          (multiChainData?.safes && multiChainData.safes.length > 0)) && (
          <div className="mt-6 border-t border-[#101010]/10 pt-4">
            <button
              type="button"
              onClick={() => setShowAdvancedDetails((prev) => !prev)}
              className={cn(
                'inline-flex items-center gap-2 text-[12px] font-medium transition-colors',
                isTechnical
                  ? 'text-[#1B29FF] hover:text-[#1B29FF]/80 font-mono'
                  : 'text-[#101010]/70 hover:text-[#1B29FF]',
              )}
            >
              <Globe className="h-4 w-4" />
              {showAdvancedDetails
                ? isTechnical
                  ? 'HIDE::USDC_DETAILS'
                  : 'Hide advanced details'
                : isTechnical
                  ? 'USDC'
                  : 'Advanced'}
            </button>

            {showAdvancedDetails && (
              <div className="mt-3 space-y-2">
                <p
                  className={cn(
                    'text-[11px] px-1 mb-2',
                    isTechnical
                      ? 'text-[#1B29FF]/60 font-mono'
                      : 'text-[#101010]/50',
                  )}
                >
                  {isTechnical
                    ? 'Wallet addresses for direct USDC deposits'
                    : 'Account identifiers for receiving crypto payments directly.'}
                </p>
                {isDemoMode ? (
                  <div
                    className={cn(
                      'p-3 text-[12px]',
                      isTechnical
                        ? 'rounded-sm border border-[#1B29FF]/20 bg-[#1B29FF]/5'
                        : 'rounded-[10px] border border-[#101010]/10 bg-[#F7F7F2]',
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span
                          className={cn(
                            'uppercase tracking-[0.1em] text-[10px] block mb-0.5',
                            isTechnical
                              ? 'text-[#1B29FF]/70 font-mono'
                              : 'text-[#101010]/50',
                          )}
                        >
                          {isTechnical
                            ? 'PRIMARY::DEMO'
                            : 'Primary Account (Demo)'}
                        </span>
                        <code
                          className={cn(
                            'font-mono text-[11px]',
                            isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]',
                          )}
                        >
                          {safeAddress || '0x...demo'}
                        </code>
                      </div>
                    </div>
                  </div>
                ) : (
                  multiChainData?.safes.map((safe) => (
                    <div
                      key={safe.id}
                      className={cn(
                        'p-3 text-[12px]',
                        isTechnical
                          ? 'rounded-sm border border-[#1B29FF]/20 bg-[#1B29FF]/5'
                          : 'rounded-[10px] border border-[#101010]/10 bg-[#F7F7F2]',
                      )}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span
                            className={cn(
                              'uppercase tracking-[0.1em] text-[10px] block mb-0.5',
                              isTechnical
                                ? 'text-[#1B29FF]/70 font-mono'
                                : 'text-[#101010]/50',
                            )}
                          >
                            {isTechnical
                              ? `CHAIN::${getChainDisplayName(safe.chainId).toUpperCase()}`
                              : `${getChainDisplayName(safe.chainId)} Account`}
                          </span>
                          <code
                            className={cn(
                              'font-mono text-[11px] break-all',
                              isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]',
                            )}
                          >
                            {safe.address}
                          </code>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyAddress(safe.address)}
                          className={cn(
                            'self-start sm:self-auto flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 text-[11px] transition-colors',
                            isTechnical
                              ? 'rounded-sm border border-[#1B29FF]/30 bg-white text-[#1B29FF] hover:border-[#1B29FF] hover:bg-[#1B29FF]/5 font-mono'
                              : 'rounded-full border border-[#101010]/15 bg-white text-[#101010] hover:border-[#1B29FF]/30 hover:text-[#1B29FF]',
                          )}
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

        {isDemoMode && (
          <div
            className={cn(
              'mt-4 p-4 text-[12px]',
              isTechnical
                ? 'rounded-sm border border-[#1B29FF]/20 bg-[#1B29FF]/5 font-mono text-[#1B29FF]/70'
                : 'rounded-[10px] border border-[#101010]/10 bg-[#F7F7F2] text-[#101010]/70',
            )}
          >
            {isTechnical
              ? 'MODE::DEMO // Sign in to view live account data'
              : 'Demo mode shows sample banking instructions. Sign in to your live workspace to view real account numbers.'}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
