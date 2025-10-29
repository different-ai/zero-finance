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
// Demo mode removed - demo only available at /dashboard/demo

// Removed demo transfer data - demo only at /dashboard/demo

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
  isDemo?: boolean;
}

export function FundsDisplayWithDemo({
  totalBalance = 0,
  walletAddress,
  isDemo = false,
}: FundsDisplayWithDemoProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const { ready, authenticated, user } = usePrivy();
  const isMobile = useIsMobile();
  // No demo mode here - use real data only
  const displayBalance = totalBalance;
  const displayAddress = walletAddress;

  // Demo funding sources data
  const demoFundingSources = [
    {
      id: 'demo-ach-1',
      sourceAccountType: 'us_ach' as const,
      sourceBankName: 'JPMorgan Chase',
      sourceCurrency: 'USD',
      sourceAccountNumber: '****5678',
      sourceRoutingNumber: '021000021',
      sourceBankBeneficiaryName: 'Demo Company Inc.',
      destinationCurrency: 'USDC',
      destinationPaymentRail: 'Base',
    },
    {
      id: 'demo-iban-1',
      sourceAccountType: 'iban' as const,
      sourceBankName: 'Deutsche Bank',
      sourceCurrency: 'EUR',
      sourceIban: 'DE89 3704 0044 0532 0130 00',
      sourceBicSwift: 'DEUTDEFF',
      sourceBankBeneficiaryName: 'Bridge Building Sp.z.o.o.',
      sourceBankAddress: 'Taunusanlage 12, 60325 Frankfurt am Main, Germany',
      destinationCurrency: 'USDC',
      destinationPaymentRail: 'Base',
    },
  ];

  const demoUserData = {
    firstName: 'John',
    lastName: 'Doe',
    companyName: 'Demo Company Inc.',
  };

  // Use tRPC to fetch funding sources
  const {
    data: realAccountData,
    isLoading: isLoadingFundingSources,
    refetch: refetchFundingSources,
  } = api.align.getVirtualAccountDetails.useQuery(undefined, {
    enabled: !isDemo && ready && authenticated && !!user?.id,
  });

  // Use demo or real funding sources based on mode
  const fundingSources = isDemo
    ? demoFundingSources
    : realAccountData?.fundingSources || [];
  const userData = isDemo ? demoUserData : realAccountData?.userData;

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
    <div className="bg-white border border-[#101010]/10">
      <div className="p-6 border-b border-[#101010]/10">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
             Withdrawable Balance
            </p>
            <div className="font-serif tabular-nums text-[#101010] overflow-hidden">
              {balanceDisplay.isNegative && (
                <span className="text-[#FF4444]">-</span>
              )}
              <span className="text-[16px] sm:text-[18px] leading-[1.1]">
                ${parseInt(balanceDisplay.integer).toLocaleString()}.
                {balanceDisplay.decimal}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex gap-2">
          <Dialog open={isMoveModalOpen} onOpenChange={setIsMoveModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="px-4 py-2 text-[14px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors"
                title={
                  !hasVirtualAccounts
                    ? 'Connect a bank account to enable transfers'
                    : undefined
                }
              >
                Move Funds →
              </Button>
            </DialogTrigger>
            <DialogContent
              className={`p-0 ${isMobile ? 'h-screen max-h-screen w-screen max-w-none m-0 rounded-none' : 'max-w-2xl'}`}
            >
              <SimplifiedOffRamp
                mode={isDemo ? 'demo' : 'real'}
                fundingSources={fundingSources}
              />
            </DialogContent>
          </Dialog>

          <Dialog
            onOpenChange={(open) => open && !isDemo && refetchFundingSources()}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="px-3 py-2 text-[13px] text-[#101010]/60 hover:text-[#101010] border-[#101010]/10 hover:bg-[#F7F7F2] transition-all"
              >
                <Info className="h-3.5 w-3.5 mr-1.5" />
                Details
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-gray-200 text-gray-800 max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Virtual Bank Accounts
                </DialogTitle>
              </DialogHeader>

              {!isDemo && isLoadingFundingSources ? (
                <div className="space-y-4 mt-4">
                  <Skeleton variant="card" className="h-16 w-full" />
                  <Skeleton variant="card" className="h-16 w-full" />
                  <Skeleton variant="card" className="h-16 w-full" />
                </div>
              ) : (
                <>
                  <Tabs defaultValue="all" className="w-full mt-6">
                    <TabsList className="grid w-full grid-cols-4 bg-[#F7F7F2] p-1">
                      <TabsTrigger
                        value="all"
                        className="data-[state=active]:bg-white data-[state=active]:text-[#101010] text-[#101010]/60 text-[14px] font-medium transition-colors"
                      >
                        All Accounts
                      </TabsTrigger>
                      <TabsTrigger
                        value="usd"
                        className="data-[state=active]:bg-white data-[state=active]:text-[#101010] text-[#101010]/60 text-[14px] font-medium transition-colors"
                      >
                        USD
                      </TabsTrigger>
                      <TabsTrigger
                        value="eur"
                        className="data-[state=active]:bg-white data-[state=active]:text-[#101010] text-[#101010]/60 text-[14px] font-medium transition-colors"
                      >
                        EUR
                      </TabsTrigger>
                      <TabsTrigger
                        value="crypto"
                        className="data-[state=active]:bg-white data-[state=active]:text-[#101010] text-[#101010]/60 text-[14px] font-medium transition-colors"
                      >
                        Crypto
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4 mt-6">
                      {/* Virtual Account Cards */}
                      <div className="space-y-4">
                        {fundingSources.map((source, index) => (
                          <div
                            key={source.id || index}
                            className="border border-[#101010]/10 bg-white overflow-hidden"
                          >
                            <div className={cn('h-1', 'bg-[#1B29FF]')} />
                            <div className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
                                    {source.sourceAccountType === 'iban'
                                      ? 'EUR Account · SEPA'
                                      : 'USD Account · ACH'}
                                  </p>
                                  <h4 className="font-serif text-[20px] leading-[1.1] text-[#101010]">
                                    {source.sourceBankName}
                                  </h4>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] uppercase tracking-wider border-[#1B29FF] text-[#1B29FF]"
                                >
                                  Active
                                </Badge>
                              </div>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-1">
                                      Currency
                                    </p>
                                    <p className="text-[16px] font-medium text-[#101010]">
                                      {source.sourceCurrency?.toUpperCase()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-1">
                                      Recipient Name
                                    </p>
                                    <p className="text-[16px] font-medium text-[#101010]">
                                      {getRecipientName(source, userData)}
                                    </p>
                                  </div>
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
                                                source.sourceAccountNumber ||
                                                  '',
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
                                              {copiedField ===
                                              `bic-${index}` ? (
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
                                        {source.destinationPaymentRail ||
                                          'Base'}
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
                              </div>
                            </div>
                          </div>
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
      </div>
    </div>
  );
}
