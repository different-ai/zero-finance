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

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

interface FundsDisplayProps {
  totalBalance?: number;
  walletAddress?: string;
}

export function FundsDisplay({
  totalBalance = 0,
  walletAddress,
}: FundsDisplayProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const { ready, authenticated, user } = usePrivy();
  const isMobile = useIsMobile();

  // Use tRPC to fetch funding sources
  const {
    data: fundingSources = [],
    isLoading: isLoadingFundingSources,
    refetch: refetchFundingSources,
  } = api.align.getVirtualAccountDetails.useQuery(undefined, {
    enabled: ready && authenticated && !!user?.id,
  });

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

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#0050ff] rounded-full flex items-center justify-center shadow-md shadow-[#0050ff]/20">
              <span className="text-white font-semibold text-lg">$</span>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Personal · USD
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-5xl font-bold text-gray-800">
            {totalBalance < 0 ? '-' : ''}
            {formatCurrency(Math.abs(totalBalance))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Dialog open={isMoveModalOpen} onOpenChange={setIsMoveModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex-1 inline-flex items-center justify-center py-3 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white font-semibold rounded-md transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25 gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                title={
                  !hasVirtualAccounts
                    ? 'Connect a bank account to enable transfers'
                    : undefined
                }
              >
                <CreditCard className="h-5 w-5" />
                Move
              </Button>
            </DialogTrigger>
            <DialogContent
              className={`p-0 ${isMobile ? 'h-screen max-h-screen w-screen max-w-none m-0 rounded-none' : 'max-w-2xl'}`}
            >
              <SimplifiedOffRamp fundingSources={fundingSources} />
            </DialogContent>
          </Dialog>

          <Dialog onOpenChange={(open) => open && refetchFundingSources()}>
            <DialogTrigger asChild>
              <Button className="flex-1 inline-flex items-center justify-center py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md transition-all hover:scale-[1.01] active:scale-[0.99] border border-gray-200 shadow-sm hover:shadow-md gap-3">
                <Info className="h-5 w-5" />
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

                    <TabsContent value="usd" className="space-y-4 mt-6">
                      {/* Show only USD accounts */}
                      <div className="space-y-4">
                        {fundingSources
                          .filter(
                            (source) => source.sourceAccountType === 'us_ach',
                          )
                          .map((source, index) => (
                            <Card
                              key={source.id || index}
                              className="border-green-200 overflow-hidden"
                            >
                              <div className="h-1 bg-green-500" />
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold flex items-center gap-2">
                                      <Building2 className="h-4 w-4" />
                                      USD Virtual Account (ACH)
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Receive USD payments via ACH/Wire
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
                                    <p className="font-medium">USD</p>
                                  </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
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
                                            `usd-account-${index}`,
                                          )
                                        }
                                        className="h-6 w-6"
                                      >
                                        {copiedField ===
                                        `usd-account-${index}` ? (
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
                                              source.sourceRoutingNumber || '',
                                              `usd-routing-${index}`,
                                            )
                                          }
                                          className="h-6 w-6"
                                        >
                                          {copiedField ===
                                          `usd-routing-${index}` ? (
                                            <Check className="h-3 w-3" />
                                          ) : (
                                            <Copy className="h-3 w-3" />
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <DollarSign className="h-5 w-5 text-green-600" />
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
                              </CardContent>
                            </Card>
                          ))}

                        {fundingSources.filter(
                          (s) => s.sourceAccountType === 'us_ach',
                        ).length === 0 && (
                          <p className="text-gray-500 text-sm text-center py-8">
                            No USD accounts connected
                          </p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="eur" className="space-y-4 mt-6">
                      {/* Show only EUR accounts */}
                      <div className="space-y-4">
                        {fundingSources
                          .filter(
                            (source) => source.sourceAccountType === 'iban',
                          )
                          .map((source, index) => (
                            <Card
                              key={source.id || index}
                              className="border-blue-200 overflow-hidden"
                            >
                              <div className="h-1 bg-blue-500" />
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold flex items-center gap-2">
                                      <Building2 className="h-4 w-4" />
                                      EUR Virtual Account (SEPA)
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Receive EUR payments via SEPA/SWIFT
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
                                    <p className="font-medium">EUR</p>
                                  </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
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
                                            `eur-iban-${index}`,
                                          )
                                        }
                                        className="h-6 w-6"
                                      >
                                        {copiedField === `eur-iban-${index}` ? (
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
                                              `eur-bic-${index}`,
                                            )
                                          }
                                          className="h-6 w-6"
                                        >
                                          {copiedField ===
                                          `eur-bic-${index}` ? (
                                            <Check className="h-3 w-3" />
                                          ) : (
                                            <Copy className="h-3 w-3" />
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <Euro className="h-5 w-5 text-blue-600" />
                                    <ArrowRightCircle className="h-4 w-4 text-gray-400" />
                                    <div className="flex items-center gap-1">
                                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">
                                          U
                                        </span>
                                      </div>
                                      <span className="text-sm font-medium">
                                        {source.destinationCurrency?.toUpperCase() ||
                                          'USDC'}{' '}
                                        on{' '}
                                        {source.destinationPaymentRail ||
                                          'Polygon'}
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

                        {fundingSources.filter(
                          (s) => s.sourceAccountType === 'iban',
                        ).length === 0 && (
                          <p className="text-gray-500 text-sm text-center py-8">
                            No EUR accounts connected
                          </p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="crypto" className="space-y-4 mt-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-600 text-sm mb-4">
                          For cryptocurrency transfers
                        </p>

                        {walletAddress ? (
                          <div>
                            <p className="text-gray-600 text-sm mb-1">
                              Wallet Address (Base Network)
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-gray-800 font-mono text-xs break-all">
                                {walletAddress}
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  copyToClipboard(
                                    walletAddress,
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
