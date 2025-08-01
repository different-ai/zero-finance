'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PayrollPoolCard } from './components/payroll-pool-card';
import { InvoiceInbox } from './components/invoice-inbox';
import { AutoPaySettings } from './components/auto-pay-settings';
import { PaymentHistory } from './components/payment-history';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockInvoices, mockPayrollPool } from './mock-data';
import { FileText, DollarSign, Clock, CheckCircle } from 'lucide-react';

export default function SmartPayrollPage() {
  const [activeTab, setActiveTab] = useState('inbox');
  
  // Calculate stats
  const pendingInvoices = mockInvoices.filter(inv => inv.status === 'pending').length;
  const scheduledPayments = mockInvoices.filter(inv => inv.status === 'scheduled').length;
  const monthlySpend = mockInvoices
    .filter(inv => inv.status === 'paid' && new Date(inv.detectedAt).getMonth() === new Date().getMonth())
    .reduce((sum, inv) => sum + parseFloat(inv.invoice.amount), 0);

  return (
    <div className="container mx-auto py-10 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Smart Payroll</h1>
        <p className="text-muted-foreground">
          AI-powered invoice payments from your dedicated payroll pool. Works with Ethereum, Base, and Solana.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pool Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockPayrollPool.totalValueUSD.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvoices}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledPayments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlySpend.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Payroll Pool Card */}
      <PayrollPoolCard />
      
      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inbox" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Invoice Inbox
            {pendingInvoices > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 px-1">
                {pendingInvoices}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="autopay" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Auto-Pay Rules
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Payment History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="inbox" className="mt-6">
          <InvoiceInbox />
        </TabsContent>
        
        <TabsContent value="autopay" className="mt-6">
          <AutoPaySettings />
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <PaymentHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}