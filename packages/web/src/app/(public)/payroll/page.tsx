'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  DollarSign, 
  Clock, 
  CheckCircle,
  Wallet,
  Mail,
  Zap,
  ArrowRight,
  Shield,
  Globe
} from 'lucide-react';

// Import components from the prototype
import { PayrollPoolCard } from '@/app/(authenticated)/dashboard/prototypes/smart-payroll/components/payroll-pool-card';
import { InvoiceInbox } from '@/app/(authenticated)/dashboard/prototypes/smart-payroll/components/invoice-inbox';
import { AutoPaySettings } from '@/app/(authenticated)/dashboard/prototypes/smart-payroll/components/auto-pay-settings';
import { PaymentHistory } from '@/app/(authenticated)/dashboard/prototypes/smart-payroll/components/payment-history';
import { mockInvoices, mockPayrollPool } from '@/app/(authenticated)/dashboard/prototypes/smart-payroll/mock-data';

export default function PublicPayrollPage() {
  const [activeTab, setActiveTab] = useState('demo');
  const [showDemo, setShowDemo] = useState(false);
  
  // Calculate stats
  const pendingInvoices = mockInvoices.filter(inv => inv.status === 'pending').length;
  const scheduledPayments = mockInvoices.filter(inv => inv.status === 'scheduled').length;
  const monthlySpend = mockInvoices
    .filter(inv => inv.status === 'paid' && new Date(inv.detectedAt).getMonth() === new Date().getMonth())
    .reduce((sum, inv) => sum + parseFloat(inv.invoice.amount), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="secondary">
            <Zap className="h-3 w-3 mr-1" />
            AI-Powered Invoice Management
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Smart Payroll System
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Automatically detect, manage, and pay invoices from your emails with a dedicated payroll pool. 
            Works seamlessly with Ethereum, Base, and Solana.
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Button size="lg" onClick={() => setShowDemo(true)}>
              Try Live Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              View Documentation
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Mail className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>AI Invoice Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Automatically extracts invoice data from your synced emails. No manual entry required.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Wallet className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Dedicated Payroll Pool</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Separate wallet for invoice payments with multi-chain support and balance tracking.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Smart Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                First-time recipient warnings and configurable auto-pay rules keep your funds safe.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold">1</span>
                </div>
                <h4 className="font-semibold mb-2">Connect Email</h4>
                <p className="text-sm text-muted-foreground">
                  Sync your business email to detect invoices automatically
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold">2</span>
                </div>
                <h4 className="font-semibold mb-2">Fund Pool</h4>
                <p className="text-sm text-muted-foreground">
                  Add funds to your payroll pool on any supported chain
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold">3</span>
                </div>
                <h4 className="font-semibold mb-2">Review & Pay</h4>
                <p className="text-sm text-muted-foreground">
                  One-click payments with recipient verification
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold">4</span>
                </div>
                <h4 className="font-semibold mb-2">Automate</h4>
                <p className="text-sm text-muted-foreground">
                  Set up rules for automatic recurring payments
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Multi-Chain Support */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Globe className="h-6 w-6" />
              Multi-Chain Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Ethereum</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Pay with ETH or USDC on Ethereum mainnet
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">Base</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  Lower fees with Base L2 network
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Solana</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Fast and cheap payments on Solana
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Demo Section */}
        {showDemo && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Live Demo</h2>
            
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
            
            {/* Demo Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="demo" className="flex items-center gap-2">
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
              
              <TabsContent value="demo" className="mt-6">
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
        )}

        {/* CTA Section */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Automate Your Invoice Payments?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of businesses saving time with AI-powered invoice management
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
                Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}