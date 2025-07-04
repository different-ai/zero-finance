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
  ArrowRight, 
  Copy, 
  Check, 
  Info, 
  MoreHorizontal, 
  Settings,
  DollarSign 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimplifiedOffRamp } from '@/components/transfers/simplified-off-ramp';
import { getUserFundingSources, type UserFundingSourceDisplayData } from '@/actions/get-user-funding-sources';
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
}

export function FundsDisplay({ totalBalance = 0, walletAddress }: FundsDisplayProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [fundingSources, setFundingSources] = useState<UserFundingSourceDisplayData[]>([]);
  const [isLoadingFundingSources, setIsLoadingFundingSources] = useState(false);
  const [showOverflow, setShowOverflow] = useState(false);
  const { ready, authenticated, user } = usePrivy();
  const isMobile = useIsMobile();

  // Get savings state
  const { savingsState, isLoading: savingsLoading, optimisticAllocation } = useRealSavingsState(
    walletAddress || null,
    totalBalance,
  );

  const allocation = savingsState?.allocation ?? optimisticAllocation ?? 0;
  const isSavingsRuleActive = savingsState?.enabled && allocation > 0;

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
        const sources = await getUserFundingSources(user.id);
        setFundingSources(sources);
      } catch (err) {
        console.error("Failed to fetch funding sources:", err);
      } finally {
        setIsLoadingFundingSources(false);
      }
    }
  };

  // Find bank account details from funding sources
  const achAccount = fundingSources.find(source => source.sourceAccountType === 'us_ach');
  const ibanAccount = fundingSources.find(source => source.sourceAccountType === 'iban');
  
  // Check if user has any virtual accounts
  const hasVirtualAccounts = achAccount || ibanAccount;

  // Fetch funding sources on component mount to determine if Move button should be enabled
  useEffect(() => {
    fetchFundingSources();
  }, [ready, authenticated, user?.id]);

  // Generate savings rule text
  const savingsRuleText = isSavingsRuleActive 
    ? `Automatically set aside ${allocation}% of every deposit`
    : "No savings rule active";

  return (
    <Card className="card-premium">
      <CardHeader className="pb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="currency-icon animate-scale-in">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-1">
              <p className="text-account-meta">Personal · USD</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <HelpMenu />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowOverflow(!showOverflow)}
              className="btn-ghost h-8 w-8"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-8 px-10 space-y-8">
        {/* Balance Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-balance">
              {totalBalance < 0 ? '-' : ''}{formatCurrency(Math.abs(totalBalance))}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(totalBalance.toString(), 'balance')}
              className="btn-ghost h-8 w-8 opacity-60 hover:opacity-100"
            >
              {isCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="text-subtitle">
            {savingsRuleText}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Primary Action - Move Money */}
          <Dialog open={isMoveModalOpen} onOpenChange={setIsMoveModalOpen}>
            <DialogTrigger asChild>
              <Button
                className={cn(
                  "btn-primary focus-ring",
                  isMobile ? "w-full" : "w-44",
                  !hasVirtualAccounts && "opacity-50 cursor-not-allowed"
                )}
                disabled={!hasVirtualAccounts}
                title={!hasVirtualAccounts ? "Connect a bank account to enable transfers" : undefined}
              >
                <ArrowRight className="h-4 w-4" />
                Move Money
              </Button>
            </DialogTrigger>
            <DialogContent className={`p-0 ${isMobile ? 'h-screen max-h-screen w-screen max-w-none m-0 rounded-none' : 'max-w-2xl'}`}>
              <SimplifiedOffRamp fundingSources={fundingSources} />
            </DialogContent>
          </Dialog>
          
          {/* Secondary Action - Edit Savings Rule */}
          <Button
            asChild
            className={cn(
              "btn-secondary focus-ring",
              isMobile ? "w-full" : "w-44"
            )}
          >
            <Link href="/dashboard/savings">
              <Settings className="h-4 w-4" />
              Edit Rule
            </Link>
          </Button>
        </div>
        
        {/* Overflow Menu - Account Details */}
        {showOverflow && (
          <div className="pt-4 border-t border-gray-100">
            <Dialog onOpenChange={(open) => open && fetchFundingSources()}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="btn-ghost text-sm"
                  onClick={() => setShowOverflow(false)}
                >
                  <Info className="h-4 w-4" />
                  View account details
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
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <Tabs defaultValue="ach" className="w-full mt-4">
                    <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                      <TabsTrigger value="ach" className="data-[state=active]:bg-white">ACH</TabsTrigger>
                      <TabsTrigger value="iban" className="data-[state=active]:bg-white">IBAN</TabsTrigger>
                      <TabsTrigger value="crypto" className="data-[state=active]:bg-white">Crypto</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="ach" className="space-y-4 mt-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-600 text-sm mb-4">For US domestic transfers</p>
                        
                        {achAccount ? (
                          <div className="space-y-4">
                            <div>
                              <p className="text-gray-600 text-sm mb-1">Bank Name</p>
                              <div className="flex items-center justify-between">
                                <p className="text-gray-800">{achAccount.sourceBankName}</p>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => copyToClipboard(achAccount.sourceBankName || '', 'bankName')}
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
                              <p className="text-gray-600 text-sm mb-1">Account Number</p>
                              <div className="flex items-center justify-between">
                                <p className="text-gray-800 font-mono">{achAccount.sourceIdentifier}</p>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => copyToClipboard(achAccount.sourceIdentifier || '', 'accountNumber')}
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
                                <p className="text-gray-600 text-sm mb-1">Routing Number</p>
                                <div className="flex items-center justify-between">
                                  <p className="text-gray-800 font-mono">{achAccount.sourceRoutingNumber}</p>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => copyToClipboard(achAccount.sourceRoutingNumber || '', 'routingNumber')}
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
                          <p className="text-gray-500 text-sm">No US bank account connected</p>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="iban" className="space-y-4 mt-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-600 text-sm mb-4">For international transfers</p>
                        
                        {ibanAccount ? (
                          <div className="space-y-4">
                            <div>
                              <p className="text-gray-600 text-sm mb-1">Bank Name</p>
                              <div className="flex items-center justify-between">
                                <p className="text-gray-800">{ibanAccount.sourceBankName}</p>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => copyToClipboard(ibanAccount.sourceBankName || '', 'ibanBankName')}
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
                                <p className="text-gray-800 font-mono text-xs">{ibanAccount.sourceIdentifier}</p>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => copyToClipboard(ibanAccount.sourceIdentifier || '', 'iban')}
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
                                <p className="text-gray-600 text-sm mb-1">BIC/SWIFT</p>
                                <div className="flex items-center justify-between">
                                  <p className="text-gray-800 font-mono">{ibanAccount.sourceBicSwift}</p>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => copyToClipboard(ibanAccount.sourceBicSwift || '', 'bicSwift')}
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
                          <p className="text-gray-500 text-sm">No international account connected</p>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="crypto" className="space-y-4 mt-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-600 text-sm mb-4">For cryptocurrency transfers</p>
                        
                        {walletAddress ? (
                          <div>
                            <p className="text-gray-600 text-sm mb-1">Wallet Address (Base Network)</p>
                            <div className="flex items-center justify-between">
                              <p className="text-gray-800 font-mono text-xs break-all">{walletAddress}</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(walletAddress, 'walletAddress')}
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
                          <p className="text-gray-500 text-sm">No wallet address available</p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}  