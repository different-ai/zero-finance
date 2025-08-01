'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  CheckCircle, 
  Clock, 
  Mail,
  Loader2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function InteractiveDemo() {
  const [step, setStep] = useState<'idle' | 'sending' | 'detected' | 'scheduled' | 'paid'>('idle');
  const [isProcessing, setIsProcessing] = useState(false);

  const startDemo = () => {
    setStep('sending');
    setIsProcessing(true);

    // Step 1: Email sent
    setTimeout(() => {
      setStep('detected');
    }, 1000);

    // Step 2: Payment scheduled
    setTimeout(() => {
      setStep('scheduled');
    }, 3000);

    // Step 3: Payment sent
    setTimeout(() => {
      setStep('paid');
      setIsProcessing(false);
    }, 6000);
  };

  const resetDemo = () => {
    setStep('idle');
    setIsProcessing(false);
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

      {/* Right Side: System Response */}
      <div className="space-y-6">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold mb-2">Contractor Payment Vault</h3>
          <p className="text-muted-foreground">
            Balance: $37,500 USDC
          </p>
        </div>

        <Card className="min-h-[500px]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Contractor Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {step === 'idle' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20"
                >
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Waiting for contractor invoices...</p>
                </motion.div>
              )}

              {step === 'detected' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <Sparkles className="h-4 w-4" />
                      <p className="font-medium">New Invoice Detected!</p>
                    </div>
                    
                    <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/10">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="font-semibold">Sarah Chen</p>
                            <p className="text-sm text-muted-foreground">Website Redesign Project</p>
                            <p className="text-2xl font-bold mt-2">$5,000 USDC</p>
                          </div>
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            <Clock className="h-3 w-3 mr-1" />
                            Processing
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {step === 'scheduled' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="space-y-4">
                    <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-900/10">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="font-semibold">Sarah Chen</p>
                            <p className="text-sm text-muted-foreground">Website Redesign Project</p>
                            <p className="text-2xl font-bold mt-2">$5,000 USDC</p>
                          </div>
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            <Badge className="bg-blue-600">
                              <Clock className="h-3 w-3 mr-1" />
                              Auto-Pay Scheduled
                            </Badge>
                          </motion.div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Payment scheduled for tomorrow 10:00 AM
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {step === 'paid' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="space-y-4">
                    <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/10">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="font-semibold">Sarah Chen</p>
                            <p className="text-sm text-muted-foreground">Website Redesign Project</p>
                            <p className="text-2xl font-bold mt-2">$5,000 USDC</p>
                          </div>
                          <Badge className="bg-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Paid
                          </Badge>
                        </div>
                        
                        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                                Payment Successful
                              </p>
                              <p className="text-xs text-green-700 dark:text-green-300">
                                Receipt #PAY-2024-089
                              </p>
                            </div>
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Success animation */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center p-4"
                    >
                      <p className="text-sm text-muted-foreground">
                        Contractor paid automatically • QuickBooks updated
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}