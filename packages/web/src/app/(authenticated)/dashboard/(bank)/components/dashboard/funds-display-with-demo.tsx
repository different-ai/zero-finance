'use client';

import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Wallet,
  Copy,
  Check,
  Info,
  CreditCard,
  MoreHorizontal,
  ArrowRightCircle,
  Building2,
  Globe,
  Euro,
  DollarSign,
  FileText,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimplifiedOffRamp } from '@/components/transfers/simplified-off-ramp';
import { usePrivy } from '@privy-io/react-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

import { cn, formatUsd } from '@/lib/utils';
import Link from 'next/link';
import { HelpMenu } from '@/components/dashboard/help-menu';
import { api } from '@/trpc/react';
import { useDemoMode } from '@/context/demo-mode-context';
import { getDemoVirtualAccounts } from '@/utils/demo-trpc';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const getRecipientName = (source: any, userData: any) => {
  if (source.sourceAccountType === 'iban') {
    // EUR/SEPA accounts always use Bridge Building
    return 'Bridge Building Sp.z.o.o.';
  } else if (source.sourceAccountType === 'us_ach') {
    // USD/ACH accounts use registered company or individual name
    if (userData?.companyName) {
      return userData.companyName;
    } else if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    } else if (source.sourceBankBeneficiaryName) {
      return source.sourceBankBeneficiaryName;
    }
    return 'Account Holder';
  }
  return source.sourceBankBeneficiaryName || 'Account Holder';
};

interface FundsDisplayWithDemoProps {
  totalBalance?: number;
  walletAddress?: string;
}

export function FundsDisplayWithDemo({
  totalBalance = 0,
  walletAddress,
}: FundsDisplayWithDemoProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const { ready, authenticated, user } = usePrivy();
  const isMobile = useIsMobile();
  const { isDemoMode, demoStep, demoBalance } = useDemoMode();

  // Use demo data if in demo mode
  const displayBalance = isDemoMode
    ? demoStep >= 3
      ? demoBalance
      : 0
    : totalBalance;
  const displayAddress = isDemoMode
    ? '0xDemo1234567890abcdef1234567890abcdef1234'
    : walletAddress;

  // Use tRPC to fetch funding sources (real mode)
  const {
    data: realAccountData,
    isLoading: isLoadingRealFundingSources,
    refetch: refetchFundingSources,
  } = api.align.getVirtualAccountDetails.useQuery(undefined, {
    enabled: ready && authenticated && !!user?.id && !isDemoMode,
  });

  // Get demo funding sources
  const demoFundingSources = isDemoMode ? getDemoVirtualAccounts(demoStep) : [];

  // Use demo or real funding sources
  const fundingSources = isDemoMode
    ? demoFundingSources
    : realAccountData?.fundingSources || [];
  const userData = isDemoMode ? null : realAccountData?.userData;
  const isLoadingFundingSources = isDemoMode
    ? false
    : isLoadingRealFundingSources;

  // Handle copying to clipboard
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        if (field === 'balance') {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        } else {
          setCopiedField(field);
          setTimeout(() => setCopiedField(null), 2000);
        }
      })
      .catch((err) => console.error('Failed to copy:', err));
  };

  // Find bank account details from funding sources
  const achAccount = fundingSources.find(
    (source) => source.sourceAccountType === 'us_ach',
  );
  const ibanAccount = fundingSources.find(
    (source) => source.sourceAccountType === 'iban',
  );

  // Check if user has any virtual accounts
  const hasVirtualAccounts = achAccount || ibanAccount;

  // Format balance with proper tabular number display
  const formatBalance = (amount: number) => {
    const absAmount = Math.abs(amount);
    const [integer, decimal] = absAmount.toFixed(2).split('.');
    return { integer, decimal, isNegative: amount < 0 };
  };

  const balanceDisplay = formatBalance(displayBalance);

  return (
    <Card className="bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
      <CardHeader className="p-5 sm:p-6 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1B29FF] rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">$</span>
            </div>
            <div>
              <p className="text-[#101010]/60 text-sm font-medium">
                {isDemoMode ? 'Demo Account' : 'Personal'} · USD
              </p>
            </div>
          </div>
          {isDemoMode && (
            <Badge variant="outline" className="text-xs">
              DEMO
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-5 sm:p-6 pt-0 space-y-6">
        <div className="flex items-center justify-between">
          <div className="font-serif tabular-nums text-[#101010]">
            {balanceDisplay.isNegative && (
              <span className="text-red-600">-</span>
            )}
            <span className="align-baseline text-[18px] mr-1">$</span>
            <span className="text-[40px] sm:text-[48px] leading-none font-bold">
              {parseInt(balanceDisplay.integer).toLocaleString()}
            </span>
            <span className="align-top text-[22px] ml-[2px]">
              .{balanceDisplay.decimal}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Dialog open={isMoveModalOpen} onOpenChange={setIsMoveModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="inline-flex items-center justify-center px-5 py-2.5 text-[14px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors"
                title={
                  !hasVirtualAccounts && !isDemoMode
                    ? 'Connect a bank account to enable transfers'
                    : undefined
                }
              >
                Move money →
              </Button>
            </DialogTrigger>
            <DialogContent
              className={`p-0 ${isMobile ? 'h-screen max-h-screen w-screen max-w-none m-0 rounded-none' : 'max-w-2xl'}`}
            >
              {isDemoMode ? (
                <div className="p-6">
                  <DialogHeader>
                    <DialogTitle>Demo: Transfer Funds</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-muted-foreground mt-4">
                    In the live app, you can transfer funds via ACH, wire, or
                    SEPA to your bank accounts.
                  </p>
                </div>
              ) : (
                <SimplifiedOffRamp fundingSources={fundingSources} />
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            onOpenChange={(open) =>
              !isDemoMode && open && refetchFundingSources()
            }
          >
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="text-[13px] text-[#101010] underline decoration-[#101010]/30 underline-offset-[4px] hover:text-[#1B29FF] hover:decoration-[#1B29FF] hover:bg-transparent px-0"
              >
                Account Details
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-gray-200 text-gray-800 max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {isDemoMode
                    ? 'Demo Virtual Bank Accounts'
                    : 'Virtual Bank Accounts'}
                </DialogTitle>
              </DialogHeader>

              {isLoadingFundingSources ? (
                <div className="space-y-4 mt-4">
                  <Skeleton variant="card" className="h-16 w-full" />
                  <Skeleton variant="card" className="h-16 w-full" />
                  <Skeleton variant="card" className="h-16 w-full" />
                </div>
              ) : (
                <>
                  <Tabs defaultValue="all" className="w-full mt-4">
                    <TabsList className="grid w-full grid-cols-4 bg-gray-100">
                      <TabsTrigger
                        value="all"
                        className="data-[state=active]:bg-white"
                      >
                        All Accounts
                      </TabsTrigger>
                      <TabsTrigger
                        value="usd"
                        className="data-[state=active]:bg-white"
                      >
                        USD
                      </TabsTrigger>
                      <TabsTrigger
                        value="eur"
                        className="data-[state=active]:bg-white"
                      >
                        EUR
                      </TabsTrigger>
                      <TabsTrigger
                        value="crypto"
                        className="data-[state=active]:bg-white"
                      >
                        Crypto
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4 mt-6">
                      {/* Virtual Account Cards */}
                      <div className="space-y-4">
                        {fundingSources.map((source, index) => (
                          <Card
                            key={source.id || index}
                            className={cn(
                              'overflow-hidden',
                              source.sourceAccountType === 'iban'
                                ? 'border-blue-200'
                                : 'border-green-200',
                            )}
                          >
                            <div
                              className={cn(
                                'h-1',
                                source.sourceAccountType === 'iban'
                                  ? 'bg-blue-500'
                                  : 'bg-green-500',
                              )}
                            />
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    {source.sourceAccountType === 'iban'
                                      ? 'EUR Virtual Account (SEPA)'
                                      : 'USD Virtual Account (ACH)'}
                                  </h4>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Receive{' '}
                                    {source.sourceCurrency?.toUpperCase()}{' '}
                                    payments via{' '}
                                    {source.sourceAccountType === 'iban'
                                      ? 'SEPA/SWIFT'
                                      : 'ACH/Wire'}
                                  </p>
                                </div>
                                <Badge className="bg-green-600">
                                  <Check className="h-3 w-3 mr-1" />
                                  Active
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <p className="text-xs text-gray-600 mb-1">
                                    Bank Name
                                  </p>
                                  <p className="font-medium">
                                    {source.sourceBankName}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 mb-1">
                                    Currency
                                  </p>
                                  <p className="font-medium">
                                    {source.sourceCurrency?.toUpperCase()}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <p className="text-xs text-gray-600 mb-1">
                                  Recipient Name / Beneficiary
                                </p>
                                <p className="font-medium">
                                  {getRecipientName(source, userData)}
                                </p>
                              </div>

                              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                                {source.sourceAccountType === 'us_ach' ? (
                                  <>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-600">
                                        Account Number
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono font-medium">
                                          {source.sourceAccountNumber}
                                        </span>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            copyToClipboard(
                                              source.sourceAccountNumber || '',
                                              `account-${index}`,
                                            )
                                          }
                                          className="h-6 w-6"
                                        >
                                          {copiedField ===
                                          `account-${index}` ? (
                                            <Check className="h-3 w-3" />
                                          ) : (
                                            <Copy className="h-3 w-3" />
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                    {source.sourceRoutingNumber && (
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                          Routing Number
                                        </span>
                                        <div className="flex items-center gap-2">
                                          <span className="font-mono font-medium">
                                            {source.sourceRoutingNumber}
                                          </span>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                              copyToClipboard(
                                                source.sourceRoutingNumber ||
                                                  '',
                                                `routing-${index}`,
                                              )
                                            }
                                            className="h-6 w-6"
                                          >
                                            {copiedField ===
                                            `routing-${index}` ? (
                                              <Check className="h-3 w-3" />
                                            ) : (
                                              <Copy className="h-3 w-3" />
                                            )}
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-600">
                                        IBAN
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs font-medium">
                                          {source.sourceIban}
                                        </span>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            copyToClipboard(
                                              source.sourceIban || '',
                                              `iban-${index}`,
                                            )
                                          }
                                          className="h-6 w-6"
                                        >
                                          {copiedField === `iban-${index}` ? (
                                            <Check className="h-3 w-3" />
                                          ) : (
                                            <Copy className="h-3 w-3" />
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                    {source.sourceBicSwift && (
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                          BIC/SWIFT
                                        </span>
                                        <div className="flex items-center gap-2">
                                          <span className="font-mono font-medium">
                                            {source.sourceBicSwift}
                                          </span>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                              copyToClipboard(
                                                source.sourceBicSwift || '',
                                                `bic-${index}`,
                                              )
                                            }
                                            className="h-6 w-6"
                                          >
                                            {copiedField === `bic-${index}` ? (
                                              <Check className="h-3 w-3" />
                                            ) : (
                                              <Copy className="h-3 w-3" />
                                            )}
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>

                              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  {source.sourceAccountType === 'iban' ? (
                                    <Euro className="h-5 w-5 text-blue-600" />
                                  ) : (
                                    <DollarSign className="h-5 w-5 text-green-600" />
                                  )}
                                  <ArrowRightCircle className="h-4 w-4 text-gray-400" />
                                  <div className="flex items-center gap-1">
                                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                      <span className="text-white text-xs font-bold">
                                        U
                                      </span>
                                    </div>
                                    <span className="text-sm font-medium">
                                      {source.destinationCurrency?.toUpperCase() ||
                                        'USDC'}{' '}
                                      on{' '}
                                      {source.destinationPaymentRail || 'Base'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {source.sourceBankAddress && (
                                <div className="bg-gray-100 rounded-lg p-3">
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">
                                      Bank Address:
                                    </span>{' '}
                                    {source.sourceBankAddress}
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}

                        {fundingSources.length === 0 && (
                          <div className="text-center py-8 border-2 border-dashed rounded-lg">
                            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-sm text-muted-foreground">
                              No virtual bank accounts connected yet
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    {/* Crypto tab remains the same */}
                    <TabsContent value="crypto" className="space-y-4 mt-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-600 text-sm mb-4">
                          For cryptocurrency transfers
                        </p>

                        {displayAddress ? (
                          <div>
                            <p className="text-gray-600 text-sm mb-1">
                              Wallet Address (Base Network)
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-gray-800 font-mono text-xs break-all">
                                {displayAddress}
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  copyToClipboard(
                                    displayAddress,
                                    'walletAddress',
                                  )
                                }
                                className="text-gray-500 hover:text-gray-700 h-8 w-8"
                              >
                                {copiedField === 'walletAddress' ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">
                            No wallet address available
                          </p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
