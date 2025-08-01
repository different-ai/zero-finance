'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send, 
  CheckCircle, 
  Clock, 
  Mail,
  Loader2,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Download,
  Filter,
  Search,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for past transactions
const pastTransactions = [
  {
    id: 1,
    contractor: 'Alex Rivera',
    company: 'Rivera Design Co.',
    amount: 3500,
    project: 'Mobile App UI',
    date: 'Jan 28, 2024',
    status: 'paid',
    receipt: 'PAY-2024-087'
  },
  {
    id: 2,
    contractor: 'Jamie Park',
    company: 'Park Development',
    amount: 7200,
    project: 'Backend API Development',
    date: 'Jan 25, 2024',
    status: 'paid',
    receipt: 'PAY-2024-086'
  },
  {
    id: 3,
    contractor: 'Morgan Lee',
    company: 'Lee Marketing',
    amount: 2800,
    project: 'Content Strategy',
    date: 'Jan 22, 2024',
    status: 'paid',
    receipt: 'PAY-2024-085'
  }
];

export function InteractiveDemo() {
  const [step, setStep] = useState<'idle' | 'sending' | 'detected' | 'scheduled' | 'paid'>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');

  const startDemo = () => {
    setStep('sending');
    setIsProcessing(true);

    // Step 1: Email sent
    setTimeout(() => {
      setStep('detected');
      setActiveTab('pending'); // Switch to pending tab
    }, 1000);

    // Step 2: Payment scheduled
    setTimeout(() => {
      setStep('scheduled');
    }, 3000);

    // Step 3: Payment sent
    setTimeout(() => {
      setStep('paid');
      setIsProcessing(false);
      setActiveTab('history'); // Switch to history tab
    }, 6000);
  };

  const resetDemo = () => {
    setStep('idle');
    setIsProcessing(false);
    setActiveTab('pending');
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
      {/* Left Side: Email Trigger */}
      <div className="space-y-6">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold mb-2">Try It: Send a Contractor Invoice</h3>
          <p className="text-muted-foreground">
            Click "Send Invoice" below to see how contractor payments are automated
          </p>
        </div>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contractor Invoice Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email Preview */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">From: Sarah Chen</p>
                <p className="text-xs text-muted-foreground">Designer & Developer</p>
                <p className="text-xs text-muted-foreground">sarah@techstudio.io</p>
              </div>
              
              <div className="border-t pt-3">
                <p className="text-sm font-medium">Invoice #2024-047</p>
                <p className="text-sm text-muted-foreground">Website Redesign Project</p>
              </div>
              
              <div className="bg-background rounded p-3">
                <p className="text-2xl font-bold">$5,000 USDC</p>
                <p className="text-xs text-muted-foreground">Due: February 15, 2024</p>
              </div>
            </div>

            {/* Send Button */}
            <Button 
              className="w-full" 
              size="lg"
              onClick={startDemo}
              disabled={isProcessing}
            >
              {step === 'idle' ? (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Invoice Email
                </>
              ) : step === 'sending' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Email Sent!
                </>
              )}
            </Button>

            {/* Flow Steps */}
            <div className="space-y-2 pt-4">
              <p className="text-sm font-medium text-muted-foreground">Automated Flow:</p>
              <div className="space-y-2">
                <div className={cn(
                  "flex items-center gap-2 text-sm transition-all",
                  step !== 'idle' ? "text-green-600 font-medium" : "text-muted-foreground"
                )}>
                  <div className={cn(
                    "h-2 w-2 rounded-full transition-all",
                    step !== 'idle' ? "bg-green-600" : "bg-muted-foreground"
                  )} />
                  1. Detect contractor invoice
                </div>
                <div className={cn(
                  "flex items-center gap-2 text-sm transition-all",
                  ['scheduled', 'paid'].includes(step) ? "text-green-600 font-medium" : "text-muted-foreground"
                )}>
                  <div className={cn(
                    "h-2 w-2 rounded-full transition-all",
                    ['scheduled', 'paid'].includes(step) ? "bg-green-600" : "bg-muted-foreground"
                  )} />
                  2. Schedule payment
                </div>
                <div className={cn(
                  "flex items-center gap-2 text-sm transition-all",
                  step === 'paid' ? "text-green-600 font-medium" : "text-muted-foreground"
                )}>
                  <div className={cn(
                    "h-2 w-2 rounded-full transition-all",
                    step === 'paid' ? "bg-green-600" : "bg-muted-foreground"
                  )} />
                  3. Pay in USDC (24h)
                </div>
              </div>
            </div>

            {step === 'paid' && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={resetDemo}
              >
                Try Again
              </Button>
            )}
          </CardContent>

          {/* Flying email animation */}
          <AnimatePresence>
            {step === 'sending' && (
              <motion.div
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{ x: 400, y: -50, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <Mail className="h-8 w-8 text-primary" />
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      {/* Right Side: Realistic App Interface */}
      <div className="space-y-4">
        {/* App Header */}
        <div className="bg-background border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Contractor Payment Vault</h3>
                <p className="text-sm text-muted-foreground">Auto-pay contractors from email invoices</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Building2 className="h-4 w-4" />
              Sync QuickBooks
            </Button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Vault Balance</p>
              <p className="text-xl font-bold">$37,500</p>
              <p className="text-xs text-green-600">+$12,500 this month</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Pending Payments</p>
              <p className="text-xl font-bold">{step === 'idle' ? '0' : '1'}</p>
              <p className="text-xs text-muted-foreground">Next: Tomorrow</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">This Month</p>
              <p className="text-xl font-bold">$18,700</p>
              <p className="text-xs text-muted-foreground">12 payments</p>
            </div>
          </div>
        </div>

        {/* Main App Content */}
        <Card className="min-h-[400px]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Invoice Management</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending" className="relative">
                  Pending
                  {['detected', 'scheduled'].includes(step) && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-4">
                <AnimatePresence mode="wait">
                  {(step === 'idle' || step === 'sending') && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12"
                    >
                      <Mail className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No pending invoices</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        New invoices will appear here automatically
                      </p>
                    </motion.div>
                  )}

                  {['detected', 'scheduled'].includes(step) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="space-y-3">
                        <Card className={cn(
                          "transition-all",
                          step === 'detected' && "border-yellow-200 bg-yellow-50/50 dark:bg-yellow-900/10",
                          step === 'scheduled' && "border-blue-200 bg-blue-50/50 dark:bg-blue-900/10"
                        )}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start gap-3">
                                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                  <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-semibold">Sarah Chen</p>
                                  <p className="text-sm text-muted-foreground">Tech Studio Inc.</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Invoice #2024-047 • Website Redesign
                                  </p>
                                </div>
                              </div>
                              <Badge className={cn(
                                step === 'detected' && "bg-yellow-100 text-yellow-800 border-yellow-300",
                                step === 'scheduled' && "bg-blue-600"
                              )}>
                                {step === 'detected' ? (
                                  <>
                                    <Clock className="h-3 w-3 mr-1" />
                                    Processing
                                  </>
                                ) : (
                                  <>
                                    <Clock className="h-3 w-3 mr-1" />
                                    Scheduled
                                  </>
                                )}
                              </Badge>
                            </div>

                            <div className="flex items-end justify-between">
                              <div>
                                <p className="text-2xl font-bold">$5,000 USDC</p>
                                <p className="text-xs text-muted-foreground">Due: Feb 15, 2024</p>
                              </div>
                              {step === 'scheduled' && (
                                <p className="text-sm text-blue-600 font-medium">
                                  Auto-pay tomorrow 10:00 AM
                                </p>
                              )}
                            </div>

                            {step === 'detected' && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-3 pt-3 border-t"
                              >
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Sparkles className="h-4 w-4 text-yellow-600" />
                                  AI analyzing invoice details...
                                </div>
                              </motion.div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="scheduled" className="mt-4">
                <div className="text-center py-12">
                  <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No scheduled payments</p>
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <div className="space-y-3">
                  {step === 'paid' && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/10">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3">
                              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <p className="font-semibold">Sarah Chen</p>
                                <p className="text-sm text-muted-foreground">Tech Studio Inc.</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Invoice #2024-047 • Website Redesign
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Paid
                            </Badge>
                          </div>

                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-xl font-bold">$5,000 USDC</p>
                              <p className="text-xs text-muted-foreground">Just now</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Receipt
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Past Transactions */}
                  {pastTransactions.map((transaction) => (
                    <Card key={transaction.id} className="hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                              <CheckCircle className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-semibold">{transaction.contractor}</p>
                              <p className="text-sm text-muted-foreground">{transaction.company}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {transaction.project}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Paid
                          </Badge>
                        </div>

                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-lg font-semibold">${transaction.amount.toLocaleString()} USDC</p>
                            <p className="text-xs text-muted-foreground">{transaction.date}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Receipt
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}