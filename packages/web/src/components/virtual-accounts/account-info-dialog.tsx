'use client';

import { useState, useEffect } from 'react';
import { Building2, Globe, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BankingInstructionsDisplay } from './banking-instructions-display';
import { CryptoDepositDisplay } from './crypto-deposit-display';
import { cn } from '@/lib/utils';
import { useBimodal } from '@/components/ui/bimodal';
import { usePrivy } from '@privy-io/react-auth';
import { api } from '@/trpc/react';

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

        {/* Advanced/USDC Account Details Section - Only show in Technical mode */}
        {isTechnical && (
          <div className="mt-6 border-t border-[#1B29FF]/10 pt-4">
            <button
              type="button"
              onClick={() => setShowAdvancedDetails((prev) => !prev)}
              className="inline-flex items-center gap-2 text-[12px] font-medium transition-colors text-[#1B29FF] hover:text-[#1B29FF]/80 font-mono"
            >
              <Globe className="h-4 w-4" />
              {showAdvancedDetails ? 'HIDE::USDC_DETAILS' : 'USDC'}
            </button>

            {showAdvancedDetails && (
              <div className="mt-4">
                {isDemoMode ? (
                  <CryptoDepositDisplay
                    safeAddress={
                      safeAddress ||
                      '0x0000000000000000000000000000000000000000'
                    }
                    chainName="Base"
                  />
                ) : multiChainData?.safes && multiChainData.safes.length > 0 ? (
                  <CryptoDepositDisplay
                    safeAddress={
                      multiChainData.safes.find((s) => s.chainId === 8453)
                        ?.address || multiChainData.safes[0].address
                    }
                    chainName="Base"
                  />
                ) : (
                  <p
                    className={cn(
                      'text-[13px] py-4',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]/60'
                        : 'text-[#101010]/60',
                    )}
                  >
                    {isTechnical
                      ? 'NO_SAFE::DEPLOY_REQUIRED'
                      : 'No wallet address available. Complete onboarding to create your account.'}
                  </p>
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
