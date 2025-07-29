"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface Transaction {
  id: string;
  type: "payment" | "receipt" | "conversion" | "fee";
  description: string;
  amount: number;
  currency: string;
  timestamp: Date;
  status: "completed" | "pending" | "processing";
  category?: string;
}

interface BankTransfer {
  id: string;
  type: "onramp" | "offramp";
  amount: number;
  currency: string;
  bankName: string;
  accountEnding: string;
  timestamp: Date;
  status: "completed" | "pending" | "processing" | "failed";
  reference?: string;
}

const formatCurrency = (amount: number, currency: string = "USD") => {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    CNY: "¥",
    INR: "₹",
    MXN: "MX$",
    GBP: "£"
  };
  return `${symbols[currency] || currency + " "}${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const getRelativeTime = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
};

// Sample data generators
const generateTransaction = (index: number): Transaction => {
  const descriptions = [
    { type: "payment", desc: "Payment to Shenzhen Electronics Co.", amount: -18250.50, currency: "CNY" },
    { type: "receipt", desc: "Amazon FBA Payout", amount: 12350.42, currency: "USD" },
    { type: "payment", desc: "Supplier Invoice - Mumbai Textiles", amount: -85000, currency: "INR" },
    { type: "conversion", desc: "Currency Exchange CNY → USD", amount: 25000, currency: "USD" },
    { type: "fee", desc: "Shopify Monthly Subscription", amount: -299, currency: "USD" },
    { type: "payment", desc: "VAT Payment - EU Q3 2024", amount: -8234, currency: "EUR" },
    { type: "receipt", desc: "Customer Payment - Carlos Martinez", amount: 320500, currency: "MXN" },
    { type: "fee", desc: "Google Ads Campaign", amount: -2450, currency: "USD" }
  ];
  
  const template = descriptions[index % descriptions.length];
  const minutesAgo = index * 47 + Math.floor(Math.random() * 20);
  
  return {
    id: `tx-${index}`,
    type: template.type as Transaction["type"],
    description: template.desc,
    amount: template.amount,
    currency: template.currency,
    timestamp: new Date(Date.now() - minutesAgo * 60 * 1000),
    status: index === 0 ? "processing" : index < 3 ? "completed" : "completed",
    category: template.type === "payment" ? "Supplier" : template.type === "receipt" ? "Revenue" : "Operating Expense"
  };
};

const generateBankTransfer = (index: number): BankTransfer => {
  const transfers = [
    { type: "onramp", amount: 50000, currency: "USD", bankName: "JPMorgan Chase", accountEnding: "4521", reference: "ACH-2024-001" },
    { type: "offramp", amount: -25000, currency: "USD", bankName: "Wells Fargo", accountEnding: "8923", reference: "WD-2024-045" },
    { type: "onramp", amount: 75000, currency: "EUR", bankName: "HSBC UK", accountEnding: "7632", reference: "SEPA-2024-112" },
    { type: "offramp", amount: -15000, currency: "USD", bankName: "Bank of America", accountEnding: "3421", reference: "ACH-2024-089" },
    { type: "onramp", amount: 100000, currency: "USD", bankName: "JPMorgan Chase", accountEnding: "4521", reference: "WIRE-2024-234" },
  ];
  
  const template = transfers[index % transfers.length];
  const hoursAgo = index * 12 + Math.floor(Math.random() * 6);
  
  return {
    id: `bt-${index}`,
    type: template.type as BankTransfer["type"],
    amount: template.amount,
    currency: template.currency,
    bankName: template.bankName,
    accountEnding: template.accountEnding,
    timestamp: new Date(Date.now() - hoursAgo * 60 * 60 * 1000),
    status: index === 0 ? "processing" : index === 4 ? "failed" : "completed",
    reference: template.reference
  };
};

export function TransactionTabs() {
  const [cryptoTransactions, setCryptoTransactions] = useState<Transaction[]>(() => 
    Array.from({ length: 8 }, (_, i) => generateTransaction(i))
  );
  
  const [bankTransfers, setBankTransfers] = useState<BankTransfer[]>(() => 
    Array.from({ length: 5 }, (_, i) => generateBankTransfer(i))
  );

  const [isLoadingCrypto, setIsLoadingCrypto] = useState(false);
  const [isLoadingBank, setIsLoadingBank] = useState(false);

  // Simulate adding new transactions periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newTx = generateTransaction(cryptoTransactions.length);
      setCryptoTransactions(prev => [newTx, ...prev.slice(0, 7)]);
    }, 15000);

    return () => clearInterval(interval);
  }, [cryptoTransactions.length]);

  const refreshCryptoTransactions = async () => {
    setIsLoadingCrypto(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCryptoTransactions(Array.from({ length: 8 }, (_, i) => generateTransaction(i)));
    setIsLoadingCrypto(false);
  };

  const refreshBankTransfers = async () => {
    setIsLoadingBank(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setBankTransfers(Array.from({ length: 5 }, (_, i) => generateBankTransfer(i)));
    setIsLoadingBank(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bank" className="w-full">
          <TabsList className="mb-4 overflow-x-auto bg-gray-100">
            <TabsTrigger value="bank" className="data-[state=active]:bg-white">Bank Transfers</TabsTrigger>
            <TabsTrigger value="crypto" className="data-[state=active]:bg-white">Crypto Transfers</TabsTrigger>
          </TabsList>

          <TabsContent value="bank" className="space-y-3">
            <div className="flex justify-end mb-2">
              <button
                onClick={refreshBankTransfers}
                disabled={isLoadingBank}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                {isLoadingBank ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Refresh
              </button>
            </div>
            
            {bankTransfers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No bank transfers yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bankTransfers.map((transfer) => (
                  <div key={transfer.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transfer.type === 'onramp' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transfer.type === 'onramp' ? (
                          <ArrowDownRight className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {transfer.type === 'onramp' ? 'Deposit from' : 'Withdrawal to'} {transfer.bankName}
                        </p>
                        <p className="text-xs text-gray-500">
                          ****{transfer.accountEnding} • {getRelativeTime(transfer.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${transfer.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transfer.amount >= 0 ? '+' : '-'}{formatCurrency(transfer.amount, transfer.currency)}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        {getStatusIcon(transfer.status)}
                        <span className="text-xs text-gray-600 capitalize">{transfer.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="crypto" className="space-y-3">
            <div className="flex justify-end mb-2">
              <button
                onClick={refreshCryptoTransactions}
                disabled={isLoadingCrypto}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                {isLoadingCrypto ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Refresh
              </button>
            </div>
            
            {cryptoTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No crypto transfers yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cryptoTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'payment' ? 'bg-red-100' : 
                        tx.type === 'receipt' ? 'bg-green-100' : 
                        tx.type === 'conversion' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {tx.type === 'payment' ? <ArrowUpRight className="w-5 h-5 text-red-600" /> :
                         tx.type === 'receipt' ? <ArrowDownRight className="w-5 h-5 text-green-600" /> :
                         tx.type === 'conversion' ? <RefreshCw className="w-5 h-5 text-blue-600" /> :
                         <DollarSign className="w-5 h-5 text-gray-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                        <p className="text-xs text-gray-500">{getRelativeTime(tx.timestamp)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.amount >= 0 ? '+' : ''}{formatCurrency(tx.amount, tx.currency)}
                      </p>
                      {tx.status === 'processing' && (
                        <span className="text-xs text-yellow-600 flex items-center justify-end gap-1">
                          <Clock className="w-3 h-3" />
                          Processing
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}