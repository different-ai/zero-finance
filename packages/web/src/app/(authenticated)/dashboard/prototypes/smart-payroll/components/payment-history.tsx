'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Search,
  Download,
  Copy,
  Calendar
} from 'lucide-react';
import { mockPaymentHistory } from '../mock-data';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function PaymentHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');
  
  const filteredHistory = mockPaymentHistory.filter(payment => {
    const matchesSearch = 
      payment.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.recipientAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMonth = selectedMonth === 'all' || 
      format(new Date(payment.date), 'yyyy-MM') === selectedMonth;
    
    return matchesSearch && matchesMonth;
  });

  const copyTxHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.success('Transaction hash copied to clipboard');
  };

  const getChainExplorerUrl = (chain: string, txHash: string) => {
    switch (chain) {
      case 'ethereum':
        return `https://etherscan.io/tx/${txHash}`;
      case 'base':
        return `https://basescan.org/tx/${txHash}`;
      case 'solana':
        return `https://solscan.io/tx/${txHash}`;
      default:
        return '#';
    }
  };

  const getChainBadgeColor = (chain: string) => {
    switch (chain) {
      case 'ethereum':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'base':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'solana':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Calculate total spent
  const totalSpent = filteredHistory
    .filter(p => p.status === 'success')
    .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Payment History</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track all payments made from your payroll pool
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by recipient or invoice number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          <option value="all">All Time</option>
          <option value="2024-01">January 2024</option>
          <option value="2023-12">December 2023</option>
          <option value="2023-11">November 2023</option>
        </select>
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Payments</p>
              <p className="text-2xl font-bold">{filteredHistory.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No payments found</p>
          </Card>
        ) : (
          filteredHistory.map(payment => (
            <Card key={payment.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    {/* Payment Header */}
                    <div className="flex items-center gap-3">
                      {payment.status === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <h3 className="font-semibold">{payment.recipientName}</h3>
                      <Badge className={getChainBadgeColor(payment.chain)}>
                        {payment.chain}
                      </Badge>
                    </div>
                    
                    {/* Payment Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-medium">
                          {payment.amount} {payment.currency}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground">Invoice</p>
                        <p className="font-medium">
                          {payment.invoiceNumber || 'N/A'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium">
                          {format(new Date(payment.date), 'MMM dd, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                    
                    {/* Transaction Hash */}
                    <div className="flex items-center gap-2 text-sm">
                      <p className="text-muted-foreground">Tx:</p>
                      <code className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {payment.txHash.slice(0, 10)}...{payment.txHash.slice(-8)}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyTxHash(payment.txHash)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => window.open(getChainExplorerUrl(payment.chain, payment.txHash), '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}