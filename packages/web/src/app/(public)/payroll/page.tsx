'use client';

import { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Clock, 
  CheckCircle,
  Mail,
  Zap,
  ArrowRight,
  Shield,
  Send,
  Loader2,
  Building
} from 'lucide-react';
import { toast } from 'sonner';

// Import components from the prototype
import { ContractorVaultCard } from './components/contractor-vault-card';
import { InvoiceInbox } from '@/app/(authenticated)/dashboard/prototypes/smart-payroll/components/invoice-inbox';
import { AutoPaySettings } from '@/app/(authenticated)/dashboard/prototypes/smart-payroll/components/auto-pay-settings';
import { PaymentHistory } from '@/app/(authenticated)/dashboard/prototypes/smart-payroll/components/payment-history';
import { mockInvoices, mockPayrollPool } from '@/app/(authenticated)/dashboard/prototypes/smart-payroll/mock-data';

export default function PublicPayrollPage() {
  const [activeTab, setActiveTab] = useState('demo');
  const [showDemo, setShowDemo] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [qbSyncing, setQbSyncing] = useState(false);
  const [qbSynced, setQbSynced] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);
  
  // Calculate stats
  const pendingInvoices = mockInvoices.filter(inv => inv.status === 'pending').length;
  const scheduledPayments = mockInvoices.filter(inv => inv.status === 'scheduled').length;
  const monthlySpend = mockInvoices
    .filter(inv => inv.status === 'paid' && new Date(inv.detectedAt).getMonth() === new Date().getMonth())
    .reduce((sum, inv) => sum + parseFloat(inv.invoice.amount), 0);

  const handleTryDemo = () => {
    setShowDemo(true);
    setTimeout(() => {
      demoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSendSampleEmail = async () => {
    setEmailSending(true);
    
    // Simulate email processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Invoice email received!', {
      description: 'New invoice from TechConsultants LLC detected and processed',
    });
    
    setEmailSending(false);
    
    // Add a new invoice to the list (in real app, this would update the state)
    toast.info('Check the Invoice Inbox tab to see the new invoice', {
      duration: 5000,
    });
  };

  const handleQuickBooksSync = async () => {
    setQbSyncing(true);
    
    // Simulate QuickBooks sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('QuickBooks synced successfully!', {
      description: '12 vendors and 3 payment categories imported',
    });
    
    setQbSyncing(false);
    setQbSynced(true);
  };

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
            Contractor Payment Vault
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Automatically detect and pay contractor invoices from your emails. 
            Syncs with QuickBooks for seamless accounting.
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Button size="lg" onClick={handleTryDemo}>
              Try Live Demo
              <ArrowRight className="ml-2 h-4 w-4" />
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
              <Building className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>QuickBooks Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Seamlessly syncs with QuickBooks to match vendors and update your accounting.
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

        {/* Live Demo Section */}
        {showDemo && (
          <div className="mb-12" ref={demoRef}>
            <h2 className="text-3xl font-bold text-center mb-8">Live Demo</h2>
            
            {/* Interactive Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                onClick={handleSendSampleEmail}
                disabled={emailSending}
              >
                {emailSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Email...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Sample Invoice Email
                  </>
                )}
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleQuickBooksSync}
                disabled={qbSyncing || qbSynced}
              >
                {qbSyncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : qbSynced ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                    QuickBooks Synced
                  </>
                ) : (
                  <>
                    <Building className="mr-2 h-4 w-4" />
                    Sync with QuickBooks
                  </>
                )}
              </Button>
            </div>
            
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Vault Balance</CardTitle>
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
            
            {/* Contractor Vault Card */}
            <ContractorVaultCard qbSynced={qbSynced} />
            
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