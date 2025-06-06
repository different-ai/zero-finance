'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Wallet, Copy, Check, Info, CreditCard, MoreHorizontal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimplifiedOffRamp } from '@/components/transfers/simplified-off-ramp';
import { getUserFundingSources, type UserFundingSourceDisplayData } from '@/actions/get-user-funding-sources';
import { usePrivy } from '@privy-io/react-auth';
import { Skeleton } from '@/components/ui/skeleton';

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
  const { ready, authenticated, user } = usePrivy();

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

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200/60 rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">$</span>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Personal · USD</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-5xl font-bold text-gray-800">
            {totalBalance < 0 ? '-' : ''}{formatCurrency(Math.abs(totalBalance))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(totalBalance.toString(), 'balance')}
            className="text-gray-500 hover:text-gray-700"
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="flex gap-3">
          <Dialog open={isMoveModalOpen} onOpenChange={setIsMoveModalOpen}>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Move
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl p-0">
              <SimplifiedOffRamp />
            </DialogContent>
          </Dialog>
          
          <Dialog onOpenChange={(open) => open && fetchFundingSources()}>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
              >
                <Info className="h-4 w-4 mr-2" />
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
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <Tabs defaultValue="local" className="w-full mt-4">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                    <TabsTrigger value="local" className="data-[state=active]:bg-white">Local</TabsTrigger>
                    <TabsTrigger value="international" className="data-[state=active]:bg-white">International</TabsTrigger>
                    <TabsTrigger value="crypto" className="data-[state=active]:bg-white">Crypto</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="local" className="space-y-4 mt-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm mb-4">For domestic transfers only</p>
                      
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
                  
                  <TabsContent value="international" className="space-y-4 mt-6">
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
      </CardContent>
    </Card>
  );
} 