'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Wallet, Copy, Check, Info, Share, CreditCard, FileText, MoreHorizontal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [isAddressCopied, setIsAddressCopied] = useState(false);

  // Handle copying address to clipboard
  const copyToClipboard = (text: string, type: 'balance' | 'address') => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        if (type === 'balance') {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        } else {
          setIsAddressCopied(true);
          setTimeout(() => setIsAddressCopied(false), 2000);
        }
      })
      .catch((err) => console.error('Failed to copy:', err));
  };

  // Mock IBAN data - in real app this would come from backend
  const mockIBAN = 'LT06 3250 0582 7846 2873';
  const mockBIC = 'REVOLT21';
  const beneficiaryName = 'Benjamin Shafii';

  return (
    <Card className="bg-slate-900 border-slate-800 rounded-2xl shadow-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">$</span>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Personal · USD</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-5xl font-bold text-white">
            {totalBalance < 0 ? '-' : ''}{formatCurrency(Math.abs(totalBalance))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(totalBalance.toString(), 'balance')}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white border-0"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Move
          </Button>
          <Button
            variant="secondary"
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white border-0"
          >
            <FileText className="h-4 w-4 mr-2" />
            Statement
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white border-0"
              >
                <Info className="h-4 w-4 mr-2" />
                Account details
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  Account details
                  <div className="flex items-center gap-2 ml-auto">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">€</span>
                    </div>
                    <span className="text-base font-normal">Euro</span>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="local" className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                  <TabsTrigger value="local" className="data-[state=active]:bg-slate-700">Local</TabsTrigger>
                  <TabsTrigger value="international" className="data-[state=active]:bg-slate-700">International</TabsTrigger>
                </TabsList>
                
                <TabsContent value="local" className="space-y-4 mt-6">
                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-4">For domestic transfers only</p>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Beneficiary</p>
                        <div className="flex items-center justify-between">
                          <p className="text-white">{beneficiaryName}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(beneficiaryName, 'address')}
                            className="text-slate-400 hover:text-white hover:bg-slate-700 h-8 w-8"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-slate-400 text-sm mb-1">IBAN</p>
                        <div className="flex items-center justify-between">
                          <p className="text-white font-mono">{mockIBAN}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(mockIBAN, 'address')}
                            className="text-slate-400 hover:text-white hover:bg-slate-700 h-8 w-8"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-slate-400 text-sm mb-1">BIC</p>
                        <div className="flex items-center justify-between">
                          <p className="text-white font-mono">{mockBIC}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(mockBIC, 'address')}
                            className="text-slate-400 hover:text-white hover:bg-slate-700 h-8 w-8"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="secondary"
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white border-0"
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Share details
                  </Button>
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs">💡</span>
                      </div>
                      <p className="text-slate-400">
                        Use these details to receive your salary and transfers from a Euro bank account.
                      </p>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs">🌍</span>
                      </div>
                      <p className="text-slate-400">
                        Give these details to merchants to set up Direct Debits and automatically pay off your recurring bills.
                      </p>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs">⏱️</span>
                      </div>
                      <p className="text-slate-400">
                        If the sending bank supports instant payments, the payment will arrive in a few seconds. Otherwise, it will take up to 2 working days.
                      </p>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs">🚩</span>
                      </div>
                      <p className="text-slate-400">
                        If your employer or a merchant refuses your IBAN because it&apos;s not &apos;local&apos;, it&apos;s against the law. Please find out what you can do on our blog.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="international" className="space-y-4 mt-6">
                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-4">For international transfers</p>
                    {walletAddress && (
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Wallet Address (Base Network)</p>
                        <div className="flex items-center justify-between">
                          <p className="text-white font-mono text-xs break-all">{walletAddress}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(walletAddress, 'address')}
                            className="text-slate-400 hover:text-white hover:bg-slate-700 h-8 w-8"
                          >
                            {isAddressCopied ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
} 