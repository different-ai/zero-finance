'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Paperclip, Clock, Play, CheckCircle, Loader2, Receipt, FileText, DollarSign, Calendar, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/trpc/react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SampleEmailDemoProps {
  onProcessComplete?: () => void;
}

type SampleType = 'invoice' | 'receipt' | 'bank-transaction';

interface SampleEmail {
  type: SampleType;
  icon: any;
  from: string;
  to: string;
  subject: string;
  body: string;
  attachment?: {
    name: string;
    size: string;
  };
  actionText: string;
  benefitText: string;
  benefitIcon: any;
}

const sampleEmails: Record<SampleType, SampleEmail> = {
  invoice: {
    type: 'invoice',
    icon: FileText,
    from: 'billing@cloudservices.com',
    to: 'you@yourcompany.com',
    subject: 'Invoice #INV-2024-001 - Cloud Services Subscription',
    body: `Hi there,

Please find attached your invoice for this month's cloud services subscription. The total amount due is **$1,250.00** with payment due by **${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}**.

This invoice covers:
- Premium hosting plan - $850.00
- Additional storage (500GB) - $200.00
- SSL certificates - $100.00
- Domain management - $100.00

Please remit payment via wire transfer or credit card through our payment portal.

Best regards,
Cloud Services Billing Team`,
    attachment: {
      name: 'invoice-2024-001.pdf',
      size: '1.2 MB'
    },
    actionText: 'Process Invoice',
    benefitText: 'Invoices allow you to schedule payments and track due dates',
    benefitIcon: Calendar
  },
  receipt: {
    type: 'receipt',
    icon: Receipt,
    from: 'receipts@amazon.com',
    to: 'you@yourcompany.com',
    subject: 'Your order has been delivered - Order #123-4567890',
    body: `Hello,

Your order has been delivered! Here's your receipt for your records.

**Order Details:**
Order Number: #123-4567890
Order Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
Total Amount: **$347.92**

**Items Purchased:**
- Laptop Stand (Ergonomic) - $89.99
- Wireless Mouse & Keyboard Set - $129.99
- USB-C Hub (7-in-1) - $79.99
- HDMI Cable (6ft, 2-pack) - $19.99

**Subtotal:** $319.96
**Tax:** $27.96
**Total:** $347.92

Thank you for your business!

Amazon Business Team`,
    attachment: {
      name: 'amazon-receipt-123-4567890.pdf',
      size: '856 KB'
    },
    actionText: 'Process Receipt',
    benefitText: 'Receipts are automatically categorized for expense tracking',
    benefitIcon: Receipt
  },
  'bank-transaction': {
    type: 'bank-transaction',
    icon: DollarSign,
    from: 'notifications@chase.com',
    to: 'you@yourcompany.com',
    subject: 'Wire Transfer Confirmation - QuickBooks Payroll',
    body: `Dear Business Account Holder,

This email confirms your recent wire transfer has been completed.

**Transaction Details:**
Transaction ID: WT-2024-78901234
Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
Amount: **$8,457.23**

**Transfer Details:**
From: Your Business Checking (****1234)
To: QuickBooks Payroll Services
Reference: Payroll Period 01/15 - 01/31

**Vendor Information:**
Vendor: QuickBooks Payroll
Category: Payroll Services
Tax ID: 77-0123456

This transfer covered payroll for 12 employees including:
- Base salaries: $6,500.00
- Payroll taxes: $1,457.23
- Processing fee: $500.00

If you have any questions about this transaction, please contact us.

Chase Business Banking`,
    actionText: 'Process Transaction',
    benefitText: 'Bank transactions with vendor info enable automatic reconciliation',
    benefitIcon: DollarSign
  }
};

export function SampleEmailDemo({ onProcessComplete }: SampleEmailDemoProps) {
  const [selectedType, setSelectedType] = useState<SampleType>('invoice');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const { toast } = useToast();
  
  const currentSample = sampleEmails[selectedType];
  
  const processSampleEmailMutation = api.inbox.processSampleEmail.useMutation({
    onSuccess: () => {
      setIsProcessed(true);
      toast({
        title: `Sample ${selectedType.replace('-', ' ')} processed!`,
        description: `Check your inbox to see the extracted ${selectedType === 'bank-transaction' ? 'transaction' : selectedType}`,
      });
      onProcessComplete?.();
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsProcessed(false);
        setIsProcessing(false);
      }, 3000);
    },
    onError: (error) => {
      setIsProcessing(false);
      toast({
        title: "Processing failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleTryMe = () => {
    setIsProcessing(true);
    processSampleEmailMutation.mutate({ type: selectedType });
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Sample Type Selector */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const types: SampleType[] = ['invoice', 'receipt', 'bank-transaction'];
            const currentIndex = types.indexOf(selectedType);
            const prevIndex = currentIndex === 0 ? types.length - 1 : currentIndex - 1;
            setSelectedType(types[prevIndex]);
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as SampleType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="invoice" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Invoice
            </TabsTrigger>
            <TabsTrigger value="receipt" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Receipt
            </TabsTrigger>
            <TabsTrigger value="bank-transaction" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Bank Transfer
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const types: SampleType[] = ['invoice', 'receipt', 'bank-transaction'];
            const currentIndex = types.indexOf(selectedType);
            const nextIndex = (currentIndex + 1) % types.length;
            setSelectedType(types[nextIndex]);
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Benefit Text */}
      <motion.div
        key={selectedType}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/20 rounded-full">
          <currentSample.benefitIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm text-blue-700 dark:text-blue-300">
            {currentSample.benefitText}
          </span>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedType}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden border-2 border-dashed border-gray-300">
            {/* Email Header */}
            <div className="bg-gray-50 dark:bg-gray-900/50 border-b px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Sample {selectedType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Demo
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>Just now</span>
                </div>
              </div>
            </div>

            {/* Email Content */}
            <div className="p-6">
              {/* From/To Section */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex gap-2">
                  <span className="font-medium text-gray-600 w-12">From:</span>
                  <span>{currentSample.from}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium text-gray-600 w-12">To:</span>
                  <span>{currentSample.to}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium text-gray-600 w-12">Subject:</span>
                  <span className="font-medium">{currentSample.subject}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                {/* Email Body */}
                <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
                  {currentSample.body.split('\n').map((paragraph, index) => {
                    if (paragraph.startsWith('- ')) {
                      return (
                        <li key={index} className="ml-4">
                          {paragraph.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
                        </li>
                      );
                    }
                    if (paragraph.trim() === '') {
                      return <br key={index} />;
                    }
                    return (
                      <p key={index} dangerouslySetInnerHTML={{ 
                        __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                      }} />
                    );
                  })}
                </div>

                {/* Attachment */}
                {currentSample.attachment && (
                  <div className="mt-4 flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <Paperclip className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{currentSample.attachment.name}</span>
                    <Badge variant="secondary" className="text-xs">{currentSample.attachment.size}</Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Try Me Button */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border-t border-blue-200 dark:border-blue-800 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p className="font-medium">See AI in action!</p>
                  <p className="text-xs opacity-90">Click to process this sample {selectedType === 'bank-transaction' ? 'transaction' : selectedType}</p>
                </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleTryMe}
                disabled={isProcessing || isProcessed}
                className={cn(
                  "relative overflow-hidden transition-all duration-300",
                  isProcessed 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-blue-600 hover:bg-blue-700"
                )}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isProcessed ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Processed!
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    {currentSample.actionText}
                  </>
                )}
                
                {/* Animated background effect */}
                {isProcessing && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: [-200, 200] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </Button>
            </motion.div>
          </div>
        </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Info text */}
      <p className="text-xs text-center text-muted-foreground">
        These are sample emails for demonstration. The AI will extract financial details and add them to your inbox.
      </p>
    </div>
  );
}

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}