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
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

  // Demo bank account details
  const achAccount = {
    sourceBankName: 'JPMorgan Chase',
    sourceIdentifier: '****4521',
    sourceRoutingNumber: '021000021',
  };

  const ibanAccount = {
    sourceBankName: 'HSBC UK',
    sourceIdentifier: 'GB82 WEST 1234 5698 7654 32',
    sourceBicSwift: 'HBUKGB4B',
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
            <DialogContent className="bg-white border-gray-200 text-gray-800 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  Account details
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="ach" className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                  <TabsTrigger value="ach" className="data-[state=active]:bg-white">
                    ACH
                  </TabsTrigger>
                  <TabsTrigger value="iban" className="data-[state=active]:bg-white">
                    IBAN
                  </TabsTrigger>
                  <TabsTrigger value="crypto" className="data-[state=active]:bg-white">
                    Crypto
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="ach" className="space-y-4 mt-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600 text-sm mb-4">
                      For US domestic transfers
                    </p>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Bank Name</p>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-800">{achAccount.sourceBankName}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(achAccount.sourceBankName, 'bankName')}
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
                            onClick={() => copyToClipboard(achAccount.sourceIdentifier, 'accountNumber')}
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

                      <div>
                        <p className="text-gray-600 text-sm mb-1">Routing Number</p>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-800 font-mono">{achAccount.sourceRoutingNumber}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(achAccount.sourceRoutingNumber, 'routingNumber')}
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
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="iban" className="space-y-4 mt-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600 text-sm mb-4">
                      For international transfers
                    </p>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Bank Name</p>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-800">{ibanAccount.sourceBankName}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(ibanAccount.sourceBankName, 'ibanBankName')}
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
                            onClick={() => copyToClipboard(ibanAccount.sourceIdentifier, 'iban')}
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

                      <div>
                        <p className="text-gray-600 text-sm mb-1">BIC/SWIFT</p>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-800 font-mono">{ibanAccount.sourceBicSwift}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(ibanAccount.sourceBicSwift, 'bicSwift')}
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
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="crypto" className="space-y-4 mt-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600 text-sm mb-4">
                      For cryptocurrency transfers
                    </p>
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