'use client';

import { useState, useEffect } from 'react';
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
  Copy,
  Check,
  Info,
  CreditCard,
  Settings,
  ArrowRightCircle,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimplifiedOffRamp } from '@/components/transfers/simplified-off-ramp';
import {
  getUserFundingSources,
  type UserFundingSourceDisplayData,
} from '@/actions/get-user-funding-sources';
import { usePrivy } from '@privy-io/react-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { useRealSavingsState } from '@/components/savings/hooks/use-real-savings-state';
import { cn, formatUsd } from '@/lib/utils';
import Link from 'next/link';
import { HelpMenu } from '@/components/dashboard/help-menu';

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
  network: 'ethereum' | 'solana';
}

export function FundsDisplay({
  totalBalance = 0,
  walletAddress,
  network,
}: FundsDisplayProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [fundingSources, setFundingSources] = useState<
    UserFundingSourceDisplayData[]
  >([]);
  const [isLoadingFundingSources, setIsLoadingFundingSources] = useState(false);
  const { ready, authenticated, user } = usePrivy();
  const isMobile = useIsMobile();

  // Get savings state
  const {
    savingsState,
    isLoading: savingsLoading,
    optimisticAllocation,
  } = useRealSavingsState(walletAddress || null, totalBalance);

  const allocation = savingsState?.allocation ?? optimisticAllocation ?? 0;
  const isSavingsRuleActive = savingsState?.enabled && allocation > 0;
  const exampleNextDeposit = 100;
  const nextDepositSavings = exampleNextDeposit * (allocation / 100);

  const savingsButtonText =
    allocation === 0 ? 'Set Savings Rule' : 'Savings Rule';
  const ruleText = isSavingsRuleActive
    ? `Savings Rule: ${allocation}% of incoming cash`
    : 'Savings Rule: Not active';
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

  // Fetch funding sources when account details dialog is opened
  const fetchFundingSources = async () => {
    if (ready && authenticated && user?.id) {
      setIsLoadingFundingSources(true);
      try {
        const sources = await getUserFundingSources(user.id, network);
        setFundingSources(sources);
      } catch (err) {
        console.error('Failed to fetch funding sources:', err);
      } finally {
        setIsLoadingFundingSources(false);
      }
    }
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

  // Fetch funding sources on component mount to determine if Move button should be enabled
  useEffect(() => {
    fetchFundingSources();
  }, [ready, authenticated, user?.id]);

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

        {/* Add savings rule display */}
        <div className="pt-2 space-y-1 border-t border-gray-100">
          <div className="text-sm font-medium text-gray-700 flex items-center">
            <ArrowRightCircle className="w-4 h-4 mr-1.5 text-[#0050ff]/70" />
            {ruleText}
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
                                        <SimplifiedOffRamp 
                            fundingSources={fundingSources} 
                          />
            </DialogContent>
          </Dialog>

          <Button
            asChild
            className={cn(
              'flex-1 inline-flex items-center justify-center py-3 font-medium rounded-md transition-all hover:scale-[1.01] active:scale-[0.99] gap-3',
              isSavingsRuleActive
                ? 'bg-transparent hover:bg-[#0050ff]/5 text-[#0050ff] border-2 border-[#0050ff]'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm hover:shadow-md',
            )}
          >
            <Link href="/dashboard/savings">
              <Settings className="h-5 w-5" />
              {savingsButtonText}
            </Link>
          </Button>

          <Dialog onOpenChange={(open) => open && fetchFundingSources()}>
            <DialogTrigger asChild>
              <Button className="flex-1 inline-flex items-center justify-center py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md transition-all hover:scale-[1.01] active:scale-[0.99] border border-gray-200 shadow-sm hover:shadow-md gap-3">
                <Info className="h-5 w-5" />
                Account details
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-gray-200 text-gray-800 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  Account details
                </DialogTitle>
              </DialogHeader>

              {isLoadingFundingSources ? (
                <div className="space-y-4 mt-4">
                  <Skeleton variant="card" className="h-16 w-full" />
                  <Skeleton variant="card" className="h-16 w-full" />
                  <Skeleton variant="card" className="h-16 w-full" />
                </div>
              ) : (
                <Tabs defaultValue="ach" className="w-full mt-4">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                    <TabsTrigger
                      value="ach"
                      className="data-[state=active]:bg-white"
                    >
                      ACH
                    </TabsTrigger>
                    <TabsTrigger
                      value="iban"
                      className="data-[state=active]:bg-white"
                    >
                      IBAN
                    </TabsTrigger>
                    <TabsTrigger
                      value="crypto"
                      className="data-[state=active]:bg-white"
                    >
                      Crypto
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="ach" className="space-y-4 mt-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm mb-4">
                        For US domestic transfers
                      </p>

                      {achAccount ? (
                        <div className="space-y-4">
                          <div>
                            <p className="text-gray-600 text-sm mb-1">
                              Bank Name
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-gray-800">
                                {achAccount.sourceBankName}
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  copyToClipboard(
                                    achAccount.sourceBankName || '',
                                    'bankName',
                                  )
                                }
                                className="text-gray-500 hover:text-gray-700 h-8 w-8"
                              >
                                {copiedField === 'bankName' ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div>
                            <p className="text-gray-600 text-sm mb-1">
                              Account Number
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-gray-800 font-mono">
                                {achAccount.sourceIdentifier}
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  copyToClipboard(
                                    achAccount.sourceIdentifier || '',
                                    'accountNumber',
                                  )
                                }
                                className="text-gray-500 hover:text-gray-700 h-8 w-8"
                              >
                                {copiedField === 'accountNumber' ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          {achAccount.sourceRoutingNumber && (
                            <div>
                              <p className="text-gray-600 text-sm mb-1">
                                Routing Number
                              </p>
                              <div className="flex items-center justify-between">
                                <p className="text-gray-800 font-mono">
                                  {achAccount.sourceRoutingNumber}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    copyToClipboard(
                                      achAccount.sourceRoutingNumber || '',
                                      'routingNumber',
                                    )
                                  }
                                  className="text-gray-500 hover:text-gray-700 h-8 w-8"
                                >
                                  {copiedField === 'routingNumber' ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No US bank account connected
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="iban" className="space-y-4 mt-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm mb-4">
                        For international transfers
                      </p>

                      {ibanAccount ? (
                        <div className="space-y-4">
                          <div>
                            <p className="text-gray-600 text-sm mb-1">
                              Bank Name
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-gray-800">
                                {ibanAccount.sourceBankName}
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  copyToClipboard(
                                    ibanAccount.sourceBankName || '',
                                    'ibanBankName',
                                  )
                                }
                                className="text-gray-500 hover:text-gray-700 h-8 w-8"
                              >
                                {copiedField === 'ibanBankName' ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div>
                            <p className="text-gray-600 text-sm mb-1">IBAN</p>
                            <div className="flex items-center justify-between">
                              <p className="text-gray-800 font-mono text-xs">
                                {ibanAccount.sourceIdentifier}
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  copyToClipboard(
                                    ibanAccount.sourceIdentifier || '',
                                    'iban',
                                  )
                                }
                                className="text-gray-500 hover:text-gray-700 h-8 w-8"
                              >
                                {copiedField === 'iban' ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          {ibanAccount.sourceBicSwift && (
                            <div>
                              <p className="text-gray-600 text-sm mb-1">
                                BIC/SWIFT
                              </p>
                              <div className="flex items-center justify-between">
                                <p className="text-gray-800 font-mono">
                                  {ibanAccount.sourceBicSwift}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    copyToClipboard(
                                      ibanAccount.sourceBicSwift || '',
                                      'bicSwift',
                                    )
                                  }
                                  className="text-gray-500 hover:text-gray-700 h-8 w-8"
                                >
                                  {copiedField === 'bicSwift' ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No international account connected
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
                            Wallet Address ({network === 'ethereum' ? 'Base' : network} Network)
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-gray-800 font-mono text-xs break-all">
                              {walletAddress}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                copyToClipboard(walletAddress, 'walletAddress')
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
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
