'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, Inbox, ArrowRight, Sparkles, Clock, FileText, Check, Brain, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { SampleEmailDemo } from './sample-email-demo';
import { SampleCSVTemplate } from './sample-csv-template';

interface EmptyStateProps {
  onConnectGmail?: () => void;
  onGoToSettings?: () => void;
  processingEnabled?: boolean;
  lastSyncedAt?: Date | null;
  onEnableProcessing?: () => void;
}

export function GmailNotConnectedEmptyState({ onConnectGmail }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[400px] px-4"
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse" />
        <div className="relative bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 p-6 rounded-full">
          <Mail className="h-12 w-12 text-primary" />
        </div>
      </div>
      
      <h3 className="text-2xl font-semibold text-center mb-2">
        Connect Your Gmail
      </h3>
      
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Connect your Gmail account to automatically process invoices, bills, and receipts. 
        We&apos;ll scan your emails and create actionable cards for you.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button 
          onClick={onConnectGmail}
          className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
        >
          <Mail className="h-4 w-4" />
          Connect Gmail
          <ArrowRight className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex -space-x-2">
            <div className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
            <div className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
            <div className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <span>Process invoices automatically</span>
        </div>
      </div>
      
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
        <Card className="p-4 bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200/50 dark:border-neutral-800/50">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-sm">AI-Powered</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Automatically extract invoice details
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200/50 dark:border-neutral-800/50">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Clock className="h-4 w-4 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Real-time Sync</h4>
              <p className="text-xs text-muted-foreground mt-1">
                New emails processed automatically
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200/50 dark:border-neutral-800/50">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Smart Filtering</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Only relevant emails are processed
              </p>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

export function NoCardsEmptyState({ onGoToSettings, processingEnabled, lastSyncedAt }: EmptyStateProps) {
  const [copiedEnabled, setCopiedEnabled] = useState(false);
  const [copiedDisabled, setCopiedDisabled] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[600px] px-4"
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/10 blur-3xl animate-pulse" />
        <div className="relative bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 p-6 rounded-full">
          <Inbox className="h-12 w-12 text-neutral-400" />
        </div>
      </div>
      
      <h3 className="text-2xl font-semibold text-center mb-2">
        {processingEnabled ? 'No Cards Yet' : 'Your Inbox is Empty'}
      </h3>
      
      <p className="text-muted-foreground text-center max-w-md mb-8">
        {processingEnabled ? (
          <>
            Auto-processing is enabled and scanning for emails with invoices, bills, and receipts. 
            {lastSyncedAt && (
              <span className="block mt-2 text-sm">
                Last checked: {new Date(lastSyncedAt).toLocaleTimeString()}
              </span>
            )}
          </>
        ) : (
          'No invoice or payment emails found. Try syncing your Gmail or adjusting your date range.'
        )}
      </p>
      
      {processingEnabled ? (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span>Auto-processing is active</span>
          </div>
          
          <Button 
            variant="outline"
            onClick={onGoToSettings}
            className="gap-2"
          >
            Manage Settings
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <div className="mt-8 space-y-6 max-w-2xl w-full">
            <div>
              <h4 className="text-sm font-medium text-center mb-4">Try a sample email</h4>
              <SampleEmailDemo onProcessComplete={() => window.location.reload()} />
            </div>
            
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-center mb-4">Import from CSV</h4>
              <SampleCSVTemplate />
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Tip:</strong> Make sure you have emails containing keywords like &ldquo;invoice&rdquo;, 
                &ldquo;bill&rdquo;, &ldquo;payment&rdquo;, or &ldquo;receipt&rdquo; in your Gmail inbox.
              </p>
            </div>
            
            <div className="hidden">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h4 className="text-sm font-medium">Test Email Template</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => {
                    const subject = 'Invoice #TEST-001 - Test Company';
                    const body = `Dear Customer,

This is your invoice for services rendered.

Invoice Number: TEST-001
Date: ${new Date().toLocaleDateString()}
Amount Due: $150.00
Due Date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}

Please pay by the due date to avoid late fees.

Thank you for your business!

Best regards,
Test Company`;
                    
                    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
                    setCopiedEnabled(true);
                    setTimeout(() => setCopiedEnabled(false), 2000);
                  }}
                >
                  {copiedEnabled ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="space-y-2">
                <div className="text-xs">
                  <span className="font-medium text-muted-foreground">Subject:</span>
                  <p className="font-mono text-xs mt-0.5">Invoice #TEST-001 - Test Company</p>
                </div>
                <div className="text-xs">
                  <span className="font-medium text-muted-foreground">Body:</span>
                  <pre className="font-mono text-xs mt-0.5 whitespace-pre-wrap text-muted-foreground">Dear Customer,

This is your invoice for services rendered.

Invoice Number: TEST-001
Date: {new Date().toLocaleDateString()}
Amount Due: $150.00
...</pre>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <p className="text-xs text-muted-foreground">
                  <strong>Instructions:</strong>
                </p>
                <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Copy this template using the button above</li>
                  <li>Send it to your connected Gmail address</li>
                  <li>Wait a moment for Gmail to receive it</li>
                  <li>Click the &ldquo;Force Sync&rdquo; button above to process immediately</li>
                </ol>
                <p className="text-xs text-muted-foreground italic">
                  The email will also be detected automatically within 5 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={onGoToSettings}
              className="gap-2"
            >
              Enable Auto-Processing
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-8 space-y-6 max-w-2xl w-full">
            <div>
              <h4 className="text-sm font-medium text-center mb-4">Try a sample email</h4>
              <SampleEmailDemo onProcessComplete={() => window.location.reload()} />
            </div>
            
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-center mb-4">Import from CSV</h4>
              <SampleCSVTemplate />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mt-8">
            <Card className="p-4 bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200/50 dark:border-neutral-800/50">
              <h4 className="font-medium text-sm mb-2">What we look for:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Invoices & bills</li>
                <li>• Payment confirmations</li>
                <li>• Receipts & statements</li>
                <li>• Order confirmations</li>
              </ul>
            </Card>
            
            <Card className="p-4 bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200/50 dark:border-neutral-800/50">
              <h4 className="font-medium text-sm mb-2">How it works:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Scans your emails</li>
                <li>• Identifies financial docs</li>
                <li>• Creates actionable cards</li>
                <li>• Updates every 5 minutes</li>
              </ul>
            </Card>
          </div>
          </div>
          
          <div className="hidden">
            <div className="flex items-start justify-between gap-2 mb-3">
              <h4 className="text-sm font-medium">Quick Test</h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => {
                  const emailContent = `Subject: Invoice #TEST-001 - Test Company

Dear Customer,

This is your invoice for services rendered.

Invoice Number: TEST-001
Date: ${new Date().toLocaleDateString()}
Amount Due: $150.00
Due Date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}

Please pay by the due date to avoid late fees.

Thank you for your business!

Best regards,
Test Company`;
                  
                  navigator.clipboard.writeText(emailContent);
                  setCopiedDisabled(true);
                  setTimeout(() => setCopiedDisabled(false), 2000);
                }}
              >
                {copiedDisabled ? (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Email
                  </>
                )}
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                <strong>Quick test steps:</strong>
              </p>
              <ol className="text-xs text-muted-foreground space-y-0.5 list-decimal list-inside">
                <li>Copy this email template</li>
                <li>Send it to your connected Gmail address</li>
                <li>Wait a few seconds for delivery</li>
                <li>Click &ldquo;Sync Gmail&rdquo; above to process it</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function AIProcessingDisabledEmptyState({ onEnableProcessing }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[400px] px-4"
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse" />
        <div className="relative bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 p-6 rounded-full">
          <Brain className="h-12 w-12 text-primary" />
        </div>
      </div>
      
      <h3 className="text-2xl font-semibold text-center mb-2">
        Enable AI Processing
      </h3>
      
      <p className="text-muted-foreground text-center max-w-md mb-8">
        AI Processing is required to use the inbox. We&apos;ll automatically scan your emails for 
        invoices, bills, and receipts based on your selected keywords.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button 
          onClick={onEnableProcessing}
          className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
        >
          <Sparkles className="h-4 w-4" />
          Enable AI Processing
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
        <Card className="p-4 bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200/50 dark:border-neutral-800/50">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Smart Filtering</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Only processes emails matching your keywords
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200/50 dark:border-neutral-800/50">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Zap className="h-4 w-4 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Automatic Processing</h4>
              <p className="text-xs text-muted-foreground mt-1">
                New emails processed every 5 minutes
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200/50 dark:border-neutral-800/50">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Privacy First</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Your emails stay secure and private
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg max-w-lg">
        <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
          Default Keywords:
        </h4>
        <div className="flex flex-wrap gap-2">
          {['invoice', 'bill', 'payment', 'receipt', 'order', 'statement'].map((keyword) => (
            <Badge key={keyword} variant="secondary" className="text-xs">
              {keyword}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
          You can customize these keywords after enabling AI processing.
        </p>
      </div>
    </motion.div>
  );
} 