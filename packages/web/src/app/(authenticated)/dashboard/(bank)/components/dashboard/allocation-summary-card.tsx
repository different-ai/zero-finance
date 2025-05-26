'use client';

import React, { useEffect } from 'react';
import { useAllocationState } from '../../hooks/use-allocation-state';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Loader2,
  AlertCircle,
  Wallet,
  Landmark,
  Copy,
  ArrowRight,
  ChevronDown,
  ExternalLink,
  DollarSign,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { formatUnits } from 'viem';
import { useUserSafes } from '@/hooks/use-user-safes';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { api } from '@/trpc/react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

// Dynamically import CreateSafePage to avoid SSR issues
const CreateSafePage = dynamic(
  () => import('@/app/onboarding/create-safe/page'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
);

// Helper function to format balance strings (assuming 6 decimals for USDC)
const formatBalance = (
  amount: string | undefined | null,
  decimals: number = 6,
): string => {
  // Check for null, undefined, or the string '0'
  if (amount === null || amount === undefined || amount === '0') return '0.00';
  try {
    const formatted = formatUnits(BigInt(amount), decimals);
    // Format to 2-6 decimal places for readability
    const number = parseFloat(formatted);
    return number.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  } catch (error) {
    console.error('Error formatting balance:', amount, error);
    return '0.00'; // Return default on error
  }
};

// Internal component for the Add Funds CTA
const AddFundsCTA: React.FC<{
  safeAddress: string;
  onCopy: (text: string) => void;
  hasVirtualBankAccount?: boolean;
  primarySafeHasBalance?: boolean;
}> = ({
  safeAddress,
  onCopy,
  hasVirtualBankAccount = false,
  primarySafeHasBalance = false,
}) => {
  // const { data: virtualAccountDetails } = api.align.getVirtualAccountDetails.useQuery(); // Prop is used instead

  let ctaTitle = 'Add funds to start using your account:';
  if (primarySafeHasBalance) {
    ctaTitle = 'Funding Options:';
  } else if (hasVirtualBankAccount) {
    // If no primary balance, but has a VBA, title remains about adding funds to use that VBA.
    ctaTitle = 'Add funds to your account:';
  }

  // Determine text for Bank Transfer section based primarily on hasVirtualBankAccount
  let bankTransferHeading = '';
  let bankTransferDescription = '';
  let bankTransferButtonText = '';
  const bankTransferButtonLink = '/settings/funding-sources/align';

  if (!hasVirtualBankAccount) {
    bankTransferHeading = 'Enable Bank Transfers';
    bankTransferDescription =
      'Set up a virtual bank account to receive traditional payments that automatically convert to digital currency.';
    bankTransferButtonText = 'Set Up Virtual Bank Account';
  }

  const showBankTransferRecommendedTag = !hasVirtualBankAccount;
  if (hasVirtualBankAccount) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-base font-semibold text-gray-800">{ctaTitle}</h3>

      {/* Bank Transfer Option */}
      <div className="bg-gradient-to-br from-green-50 to-green-100/40 border border-green-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
        <div className="flex items-center mb-3">
          <div className="rounded-full bg-green-600/10 w-10 h-10 flex items-center justify-center mr-3 shadow-inner">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
              <Landmark className="h-4 w-4 text-white" strokeWidth={1.5} />
            </div>
          </div>
          <h4 className="font-semibold text-lg text-gray-900">
            {bankTransferHeading}
          </h4>
          {showBankTransferRecommendedTag && (
            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              Recommended
            </span>
          )}
        </div>

        <p className="text-sm text-gray-700 mb-4">{bankTransferDescription}</p>
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center text-base py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          onClick={() => (window.location.href = bankTransferButtonLink)}
        >
          {bankTransferButtonText}{' '}
          {bankTransferButtonText.includes('View') ||
          bankTransferButtonText.includes('Set Up') ? (
            <ExternalLink className="ml-2 h-4 w-4" />
          ) : (
            <ArrowRight className="ml-2 h-4 w-4" />
          )}
        </Button>
        {hasVirtualBankAccount ? (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Share these account details with clients and payment services for
            fast settlements.
          </p>
        ) : (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Get your own account numbers for USD and EUR payments from clients
            worldwide.
          </p>
        )}
      </div>

      {/* Crypto option - Now as an accordion/collapsible section */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="more-funding-options" className="border-none">
          <div className="bg-gradient-to-br from-slate-50 to-sky-100/60 border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
            <AccordionTrigger className="w-full px-6 py-4 hover:no-underline text-left">
              <div className="flex items-center">
                <div className="rounded-full bg-sky-600/10 w-10 h-10 flex items-center justify-center mr-3 shadow-inner">
                  <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                    <Wallet className="h-4 w-4 text-white" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-lg text-gray-900">
                    More Funding Options
                  </span>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Send crypto directly (Base Network)
                  </p>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-0">
              <div className="bg-white/60 backdrop-blur-lg p-4 rounded-xl border border-gray-200 space-y-3">
                <p className="text-sm text-gray-700">
                  Send USDC, ETH, or other supported assets on the{' '}
                  <span className="font-semibold">Base network</span> to your
                  account address:
                </p>
                <div className="flex items-center bg-gray-50/50 rounded-lg p-3 border border-gray-300">
                  <div className="flex-1 font-mono text-sm text-gray-900 font-semibold truncate">
                    {safeAddress}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 h-7 w-7 text-gray-600 hover:text-primary"
                    onClick={() => onCopy(safeAddress)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

// Define USDC address for Base Mainnet
const USDC_BASE_MAINNET_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// New sub-component to display balance for a single safe
const SafeBalanceItem: React.FC<{
  safe: NonNullable<ReturnType<typeof useUserSafes>['data']>[0];
}> = ({ safe }) => {
  const {
    data: balanceData,
    isLoading: balanceLoading,
    error: balanceError,
  } = api.safe.getBalance.useQuery(
    {
      safeAddress: safe.safeAddress,
      tokenAddress: USDC_BASE_MAINNET_ADDRESS,
    },
    {
      enabled: !!safe.safeAddress,
      staleTime: 60 * 1000, // 1 minute
      refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    },
  );

  const safeTypeIcons: { [key: string]: React.ElementType } = {
    primary: Wallet,
    tax: ShieldCheck,
    yield: TrendingUp,
  };
  const IconComponent = safeTypeIcons[safe.safeType] || Wallet;

  const safeTypeColorsClasses = {
    primary: {
      bg: 'bg-green-600/10',
      gradient: 'from-green-500 to-green-600',
    },
    tax: {
      bg: 'bg-amber-600/10',
      gradient: 'from-amber-500 to-amber-600',
    },
    yield: {
      bg: 'bg-sky-600/10',
      gradient: 'from-sky-500 to-sky-600',
    },
  };
  const colorClasses =
    safeTypeColorsClasses[
      safe.safeType as keyof typeof safeTypeColorsClasses
    ] || safeTypeColorsClasses.primary;

  if (balanceLoading) {
    return (
      <div className="bg-white/60 backdrop-blur-lg rounded-xl p-5 border border-gray-200 shadow-sm">
        <div className="flex items-center mb-1">
          <div
            className={cn(
              'rounded-full w-10 h-10 flex items-center justify-center mr-3 shadow-inner',
              colorClasses.bg,
            )}
          >
            <Skeleton className="h-6 w-6 rounded-full bg-gray-300" />
          </div>
          <div>
            <Skeleton className="h-5 w-32 mb-1 bg-gray-300 capitalize" />
            <Skeleton className="h-3 w-24 bg-gray-300" />
          </div>
        </div>
        <Skeleton className="h-8 w-24 bg-gray-300 mt-1 ml-auto" />
      </div>
    );
  }

  const displayBalance = balanceError
    ? '0.00'
    : formatBalance(balanceData?.balance?.toString());

  return (
    <div className="bg-white/60 backdrop-blur-lg rounded-xl p-5 border border-gray-200 shadow-sm">
      <div className="flex items-center mb-1">
        <div
          className={cn(
            'rounded-full w-10 h-10 flex items-center justify-center mr-3 shadow-inner',
            colorClasses.bg,
          )}
        >
          <div
            className={cn(
              'rounded-full w-6 h-6 flex items-center justify-center shadow-sm bg-gradient-to-br',
              colorClasses.gradient,
            )}
          >
            <IconComponent className="h-4 w-4 text-white" strokeWidth={1.5} />
          </div>
        </div>
        <div>
          <p className="text-base font-semibold text-gray-800 capitalize">
            {safe.safeType} Account Balance
          </p>
          <p className="text-xs text-gray-500">USDC on Base Network</p>
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 text-right mt-1">
        ${displayBalance}
      </p>
      {balanceError && (
        <p className="text-xs text-red-500 text-right mt-1">
          Error loading balance. Please try again.
        </p>
      )}
    </div>
  );
};

export function AllocationSummaryCard() {
  const {
    data: allocationStatusData,
    isLoading: allocLoading,
    error: allocErrorMsg,
    refetch,
  } = api.allocations.getStatus.useQuery();
  const { data: safesData, isLoading: safesLoading } = useUserSafes();
  const { data: virtualAccountDetails, isLoading: isVirtualAccountLoading } =
    api.align.getVirtualAccountDetails.useQuery();
  const strategiesErrorObj = null; // Placeholder if not used, explicitly an object or null
  const strategiesLoading = false; // Placeholder

  const primarySafe = safesData?.find((safe) => safe.safeType === 'primary');
  const hasVirtualBankAccount = !!(
    virtualAccountDetails && virtualAccountDetails.length > 0
  );

  console.log('allocationStatusData', allocationStatusData);
  // primary safe
  console.log('primarySafe', primarySafe);
  // Fetch primary safe balance specifically for AddFundsCTA logic
  const { data: primarySafeBalanceData, isLoading: primarySafeBalanceLoading } =
    api.safe.getBalance.useQuery(
      {
        safeAddress: primarySafe?.safeAddress || '',
        tokenAddress: USDC_BASE_MAINNET_ADDRESS,
      },
      {
        enabled: !!primarySafe?.safeAddress, // Only run if primarySafe exists
        staleTime: 60 * 1000,
      },
    );

  // Correctly ensure this is a boolean for the prop to avoid linter errors
  const primarySafeHasBalanceForCTA: boolean = !!(
    primarySafeBalanceData?.balance &&
    BigInt(primarySafeBalanceData.balance.toString()) > 0n
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 30000);
    return () => clearInterval(intervalId);
  }, [refetch]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => toast.success('Address copied to clipboard!'),
      (err) => {
        toast.error('Failed to copy address.');
        console.error('Could not copy text: ', err);
      },
    );
  };

  if (
    allocLoading ||
    safesLoading ||
    isVirtualAccountLoading ||
    strategiesLoading ||
    primarySafeBalanceLoading
  ) {
    return (
      <Card className="w-full bg-gradient-to-br from-slate-50 to-sky-100 border border-blue-200/60 rounded-2xl p-6 shadow-sm">
        <CardHeader className="pb-3">
          <Skeleton className="h-7 w-3/5 mb-2 bg-gray-200" />
          <Skeleton className="h-4 w-4/5 bg-gray-200" />
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (allocErrorMsg || strategiesErrorObj) {
    return (
      <Card className="w-full bg-gradient-to-br from-red-50 to-red-100/40 border border-red-200/60 rounded-2xl p-6 shadow-sm">
        <CardHeader className="pb-2 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-3 text-red-500" />
          <CardTitle className="text-xl font-bold text-red-700">
            Error Loading Data
          </CardTitle>
          <AlertDescription className="text-sm text-red-600">
            {allocErrorMsg?.message ||
              (strategiesErrorObj as any)?.message ||
              'Could not fetch account details. Please try again later.'}
          </AlertDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!primarySafe) {
    return (
      <Card className="w-full bg-gradient-to-br from-slate-50 to-sky-100 border border-blue-200/60 rounded-2xl p-6 shadow-sm">
        <CardHeader className="pb-3 text-center">
          <div className="rounded-full bg-sky-600/10 w-16 h-16 flex items-center justify-center mb-4 mx-auto shadow-inner">
            <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-full w-9 h-9 flex items-center justify-center shadow-sm">
              <Wallet className="h-5 w-5 text-white" strokeWidth={1.5} />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            Set Up Your Account
          </CardTitle>
          <CardDescription className="text-sm text-gray-700 mt-1">
            Your secure self-custodial account needs to be initialized.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {/* Embed the CreateSafePage component directly */}
          <CreateSafePage />
        </CardContent>
      </Card>
    );
  }

  const totalUnallocatedWei = allocationStatusData?.totalUnallocatedWei
    ? BigInt(allocationStatusData.totalUnallocatedWei)
    : 0n;
  const isEffectivelyZeroAllocation =
    totalUnallocatedWei === 0n &&
    !Object.values(allocationStatusData || {}).some(
      (val) => typeof val === 'string' && BigInt(val as string) > 0n,
    );
  const isZeroAllocation = isEffectivelyZeroAllocation;

  const lastUpdated = 'N/A';

  // Filter for safes we want to display balances for (e.g., primary, tax, yield)
  const safesToDisplay =
    safesData?.filter((safe) =>
      ['primary', 'tax', 'yield'].includes(safe.safeType),
    ) || [];

  return (
    <Card className="w-full bg-gradient-to-br from-slate-50 to-sky-100 border border-blue-200/60 rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
          <div className="rounded-full bg-sky-600/10 w-9 h-9 flex items-center justify-center mr-2.5 shadow-inner">
            <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
              <DollarSign
                className="h-3.5 w-3.5 text-white"
                strokeWidth={2.5}
              />
            </div>
          </div>
          Account Overview
        </CardTitle>
        <CardDescription className="text-sm text-gray-700 pl-12">
          {primarySafe
            ? 'Overview of your account balances. Balances update periodically.'
            : 'Set up your account to manage funds.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        {safesLoading || isVirtualAccountLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : safesToDisplay.length > 0 ? (
          safesToDisplay.map((safe) => (
            <SafeBalanceItem key={safe.id} safe={safe} />
          ))
        ) : (
          // This fallback is if primarySafe exists, but no 'primary', 'tax', or 'yield' types were found in safesData
          // (which is unlikely if primarySafe exists and is included in the filter).
          // More likely, safesData might be empty or only contain other types.
          // The `!primarySafe` check already handles the main onboarding scenario.
          <div className="text-center text-gray-600 bg-white/50 p-6 rounded-xl border border-gray-200 shadow-sm">
            <Wallet className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="font-semibold">
              No specific account balances to display yet.
            </p>
            <p className="text-sm">
              Your primary account is ready. Add funds to get started or set up
              other account types like Tax or Yield safes in settings.
            </p>
          </div>
        )}

        {primarySafe && (
          <AddFundsCTA
            safeAddress={primarySafe.safeAddress}
            onCopy={copyToClipboard}
            hasVirtualBankAccount={hasVirtualBankAccount}
            primarySafeHasBalance={primarySafeHasBalanceForCTA}
          />
        )}
      </CardContent>
    </Card>
  );
}
