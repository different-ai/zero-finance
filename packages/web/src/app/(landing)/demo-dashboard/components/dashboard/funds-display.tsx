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
import {
  Copy,
  Check,
  Info,
  CreditCard,
  Settings,
  ArrowRightCircle,
  Send,
  RefreshCw,
  X,
  Loader2,
  Building2,
  Globe,
  Wallet,
  Euro,
  DollarSign,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  onSendPayment?: () => void;
  onConvert?: () => void;
}

export function FundsDisplay({
  totalBalance = 264267.57,
  walletAddress = "0x7f3e...8a2b",
  onSendPayment,
  onConvert,
}: FundsDisplayProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Demo savings rule
  const allocation = 15;
  const isSavingsRuleActive = true;
  const ruleText = isSavingsRuleActive
    ? `Savings Rule: ${allocation}% of incoming cash`
    : 'Savings Rule: Not active';
  const savingsButtonText = 'Savings Rule';

  // Handle copying to clipboard
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
      })
      .catch((err) => console.error('Failed to copy:', err));
  };



  const handleSendPayment = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowPaymentModal(false);
    onSendPayment?.();
  };

  const handleConvert = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setShowConvertModal(false);
    onConvert?.();
  };

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
                Business · USD
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-5xl font-bold text-gray-800">
            {formatCurrency(totalBalance)}
          </div>
        </div>

        {/* Savings rule display */}
        <div className="pt-2 space-y-1 border-t border-gray-100">
          <div className="text-sm font-medium text-gray-700 flex items-center">
            <ArrowRightCircle className="w-4 h-4 mr-1.5 text-[#0050ff]/70" />
            {ruleText}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Move Button */}
          <Button
            onClick={() => setShowMoveModal(true)}
            className="flex-1 inline-flex items-center justify-center py-3 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white font-semibold rounded-md transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25 gap-3"
          >
            <CreditCard className="h-5 w-5" />
            Move
          </Button>

          {/* Savings Rule Button */}
          <Button
            className={cn(
              'flex-1 inline-flex items-center justify-center py-3 font-medium rounded-md transition-all hover:scale-[1.01] active:scale-[0.99] gap-3',
              'bg-transparent hover:bg-[#0050ff]/5 text-[#0050ff] border-2 border-[#0050ff]'
            )}
          >
            <Settings className="h-5 w-5" />
            {savingsButtonText}
          </Button>

          {/* Account Details Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1 inline-flex items-center justify-center py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md transition-all hover:scale-[1.01] active:scale-[0.99] border border-gray-200 shadow-sm hover:shadow-md gap-3">
                <Info className="h-5 w-5" />
                Account details
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-gray-200 text-gray-800 max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Virtual Bank Accounts
                </DialogTitle>
              </DialogHeader>

              {/* Account Stats */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-gray-600">Total Accounts</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Euro className="h-4 w-4 text-blue-600" />
                    <p className="text-2xl font-bold">1</p>
                  </div>
                  <p className="text-xs text-gray-600">EUR Account</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <p className="text-2xl font-bold">2</p>
                  </div>
                  <p className="text-xs text-gray-600">USD Accounts</p>
                </div>
              </div>

              <Tabs defaultValue="all" className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-4 bg-gray-100">
                  <TabsTrigger value="all" className="data-[state=active]:bg-white">
                    All Accounts
                  </TabsTrigger>
                  <TabsTrigger value="usd" className="data-[state=active]:bg-white">
                    USD
                  </TabsTrigger>
                  <TabsTrigger value="eur" className="data-[state=active]:bg-white">
                    EUR
                  </TabsTrigger>
                  <TabsTrigger value="crypto" className="data-[state=active]:bg-white">
                    Crypto
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4 mt-6">
                  {/* Virtual Account Cards */}
                  <div className="space-y-4">
                    {/* USD Account 1 - ACH */}
                    <Card className="border-green-200 overflow-hidden">
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
                            <p className="text-xs text-gray-600 mb-1">Bank Name</p>
                            <p className="font-medium">Lead Bank</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Currency</p>
                            <p className="font-medium">USD</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Account Number</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-medium">101019644</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard('101019644', 'usd1-account')}
                                className="h-6 w-6"
                              >
                                {copiedField === 'usd1-account' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Routing Number</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-medium">216383879</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard('216383879', 'usd1-routing')}
                                className="h-6 w-6"
                              >
                                {copiedField === 'usd1-routing' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            <ArrowRightCircle className="h-4 w-4 text-gray-400" />
                            <div className="flex items-center gap-1">
                              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">U</span>
                              </div>
                              <span className="text-sm font-medium">USDC on Base</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* EUR Account - IBAN */}
                    <Card className="border-blue-200 overflow-hidden">
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
                            <p className="text-xs text-gray-600 mb-1">Bank Name</p>
                            <p className="font-medium">HSBC UK</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Currency</p>
                            <p className="font-medium">EUR</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">IBAN</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-medium">GB82 WEST 1234 5698 7654 32</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard('GB82WEST12345698765432', 'eur-iban')}
                                className="h-6 w-6"
                              >
                                {copiedField === 'eur-iban' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">BIC/SWIFT</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-medium">HBUKGB4B</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard('HBUKGB4B', 'eur-bic')}
                                className="h-6 w-6"
                              >
                                {copiedField === 'eur-bic' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Euro className="h-5 w-5 text-blue-600" />
                            <ArrowRightCircle className="h-4 w-4 text-gray-400" />
                            <div className="flex items-center gap-1">
                              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">U</span>
                              </div>
                              <span className="text-sm font-medium">USDC on Polygon</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* USD Account 2 - Wire */}
                    <Card className="border-green-200 overflow-hidden">
                      <div className="h-1 bg-green-500" />
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              USD Virtual Account (Wire)
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Receive USD payments via Wire Transfer
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
                            <p className="text-xs text-gray-600 mb-1">Bank Name</p>
                            <p className="font-medium">JPMorgan Chase</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Currency</p>
                            <p className="font-medium">USD</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Account Number</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-medium">987654321</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard('987654321', 'usd2-account')}
                                className="h-6 w-6"
                              >
                                {copiedField === 'usd2-account' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Routing Number</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-medium">021000021</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard('021000021', 'usd2-routing')}
                                className="h-6 w-6"
                              >
                                {copiedField === 'usd2-routing' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            <ArrowRightCircle className="h-4 w-4 text-gray-400" />
                            <div className="flex items-center gap-1">
                              <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">U</span>
                              </div>
                              <span className="text-sm font-medium">USDT on Ethereum</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="usd" className="space-y-4 mt-6">
                  {/* Show only USD accounts */}
                  <div className="space-y-4">
                    {/* USD Account 1 - ACH */}
                    <Card className="border-green-200 overflow-hidden">
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
                            <p className="text-xs text-gray-600 mb-1">Bank Name</p>
                            <p className="font-medium">Lead Bank</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Currency</p>
                            <p className="font-medium">USD</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Account Number</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-medium">101019644</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard('101019644', 'usd1-account')}
                                className="h-6 w-6"
                              >
                                {copiedField === 'usd1-account' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Routing Number</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-medium">216383879</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard('216383879', 'usd1-routing')}
                                className="h-6 w-6"
                              >
                                {copiedField === 'usd1-routing' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            <ArrowRightCircle className="h-4 w-4 text-gray-400" />
                            <div className="flex items-center gap-1">
                              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">U</span>
                              </div>
                              <span className="text-sm font-medium">USDC on Base</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* USD Account 2 - Wire */}
                    <Card className="border-green-200 overflow-hidden">
                      <div className="h-1 bg-green-500" />
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              USD Virtual Account (Wire)
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Receive USD payments via Wire Transfer
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
                            <p className="text-xs text-gray-600 mb-1">Bank Name</p>
                            <p className="font-medium">JPMorgan Chase</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Currency</p>
                            <p className="font-medium">USD</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Account Number</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-medium">987654321</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard('987654321', 'usd2-account')}
                                className="h-6 w-6"
                              >
                                {copiedField === 'usd2-account' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Routing Number</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-medium">021000021</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard('021000021', 'usd2-routing')}
                                className="h-6 w-6"
                              >
                                {copiedField === 'usd2-routing' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            <ArrowRightCircle className="h-4 w-4 text-gray-400" />
                            <div className="flex items-center gap-1">
                              <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">U</span>
                              </div>
                              <span className="text-sm font-medium">USDT on Ethereum</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="eur" className="space-y-4 mt-6">
                  {/* Show only EUR account */}
                  <div className="space-y-4">
                    <Card className="border-blue-200 overflow-hidden">
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
                            <p className="text-xs text-gray-600 mb-1">Bank Name</p>
                            <p className="font-medium">HSBC UK</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Currency</p>
                            <p className="font-medium">EUR</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">IBAN</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-medium">GB82 WEST 1234 5698 7654 32</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard('GB82WEST12345698765432', 'eur-iban')}
                                className="h-6 w-6"
                              >
                                {copiedField === 'eur-iban' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">BIC/SWIFT</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-medium">HBUKGB4B</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard('HBUKGB4B', 'eur-bic')}
                                className="h-6 w-6"
                              >
                                {copiedField === 'eur-bic' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Euro className="h-5 w-5 text-blue-600" />
                            <ArrowRightCircle className="h-4 w-4 text-gray-400" />
                            <div className="flex items-center gap-1">
                              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">U</span>
                              </div>
                              <span className="text-sm font-medium">USDC on Polygon</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-100 rounded-lg p-3">
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Payment Rails:</span> SEPA, SWIFT
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            <span className="font-medium">Bank Address:</span> 8 Canada Square, London E14 5HQ, UK
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="crypto" className="space-y-4 mt-6">
                  {/* Direct Crypto Deposits */}
                  <div className="bg-[#0050ff]/5 border border-[#0050ff]/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-[#0050ff] rounded-full flex items-center justify-center mb-1">
                          <span className="text-white font-bold">Ξ</span>
                        </div>
                        <p className="text-xs font-medium text-gray-700">USDC/USDT</p>
                      </div>
                      <ArrowRightCircle className="w-5 h-5 text-[#0050ff]" />
                      <div className="text-center">
                        <div className="w-12 h-12 bg-[#0050ff] rounded-full flex items-center justify-center mb-1">
                          <span className="text-white font-bold">Ξ</span>
                        </div>
                        <p className="text-xs font-medium text-gray-700">Your Wallet</p>
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-2">
                      Direct stablecoin deposits
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-[#0050ff] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">Ξ</span>
                      </div>
                      <p className="text-gray-700 font-medium text-sm">
                        Multi-Chain Crypto Address
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-600 text-sm mb-2">
                          Universal Deposit Address
                        </p>
                        <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                          <p className="text-[#0050ff] font-mono text-xs break-all font-semibold">
                            0x7f3e8a2b9c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard('0x7f3e8a2b9c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f', 'walletAddress')}
                            className="text-gray-500 hover:text-gray-700 h-8 w-8 ml-2"
                          >
                            {copiedField === 'walletAddress' ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-600 text-sm mb-2">Supported Networks</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white p-2 rounded border border-gray-200">
                            <p className="text-xs font-medium text-gray-700">Base</p>
                            <p className="text-xs text-gray-500">USDC preferred</p>
                          </div>
                          <div className="bg-white p-2 rounded border border-gray-200">
                            <p className="text-xs font-medium text-gray-700">Polygon</p>
                            <p className="text-xs text-gray-500">USDC/USDT</p>
                          </div>
                          <div className="bg-white p-2 rounded border border-gray-200">
                            <p className="text-xs font-medium text-gray-700">Ethereum</p>
                            <p className="text-xs text-gray-500">USDC/USDT</p>
                          </div>
                          <div className="bg-white p-2 rounded border border-gray-200">
                            <p className="text-xs font-medium text-gray-700">Solana</p>
                            <p className="text-xs text-gray-500">USDC only</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Accepted Tokens:</span> USDC, USDT
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Pro tip:</strong> Use Base network for lowest fees and fastest deposits
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>

      {/* Move Modal */}
      {showMoveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Move Funds</h3>
              <button onClick={() => setShowMoveModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={() => {
                  setShowMoveModal(false);
                  setShowPaymentModal(true);
                }}
                className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <Send className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Send Payment</p>
                    <p className="text-sm text-gray-500">Transfer to suppliers or partners</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => {
                  setShowMoveModal(false);
                  setShowConvertModal(true);
                }}
                className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Convert Currency</p>
                    <p className="text-sm text-gray-500">Exchange between currencies</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Send Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Supplier name or email"
                  defaultValue="Shenzhen Electronics Co."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    defaultValue="50000"
                  />
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>CNY</option>
                    <option>USD</option>
                    <option>EUR</option>
                    <option>INR</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Payment for..."
                  defaultValue="Payment for Order #SE-2024-893"
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  <span className="font-medium">Early payment discount available:</span> Pay now to save 2% (¥1,000)
                </p>
              </div>
              
              <button 
                onClick={handleSendPayment}
                disabled={isProcessing}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Payment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Convert Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Convert Currency</h3>
              <button onClick={() => setShowConvertModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    defaultValue="10000"
                  />
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>USD</option>
                    <option>CNY</option>
                    <option>EUR</option>
                    <option>INR</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-center">
                <RefreshCw className="w-6 h-6 text-gray-400" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    placeholder="0.00"
                    value="9195.40"
                    readOnly
                  />
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>EUR</option>
                    <option>USD</option>
                    <option>CNY</option>
                    <option>INR</option>
                  </select>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-900">
                  <span className="font-medium">You save:</span> $89.45 vs traditional banks
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Rate: 1.0880 • 0.3% better than market
                </p>
              </div>
              
              <button 
                onClick={handleConvert}
                disabled={isProcessing}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Convert Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}