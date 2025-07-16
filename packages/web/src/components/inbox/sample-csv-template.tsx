'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Download, Upload, CheckCircle, Loader2, Table, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/trpc/react';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SampleCSVTemplateProps {
  onProcessComplete?: () => void;
}

const sampleCSVContent = `Date,Vendor,Description,Amount,Type
2024-01-10,QuickBooks,Monthly subscription payment,89.99,payment
2024-01-12,Stripe Inc,Payment processing fees,125.50,payment
2024-01-15,Acme Corp,Invoice #INV-2024-001,1250.00,invoice
2024-01-16,Office Depot,Office supplies purchase,234.78,receipt
2024-01-17,Electric Company,Monthly electricity bill,156.78,bill
2024-01-18,AWS,Cloud services - January,892.45,bill
2024-01-19,Freelancer John,Website development payment,2500.00,payment
2024-01-20,Costco Wholesale,Business supplies,456.23,receipt
2024-01-22,Verizon Business,Internet and phone services,299.99,bill
2024-01-23,Adobe Creative Cloud,Annual subscription renewal,599.88,invoice
2024-01-25,FedEx,Shipping services,78.45,receipt
2024-01-26,Zoom,Video conferencing annual plan,149.90,payment`;

export function SampleCSVTemplate({ onProcessComplete }: SampleCSVTemplateProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const processCSVMutation = api.inbox.processCSV.useMutation({
    onSuccess: (result) => {
      setIsProcessed(true);
      toast({
        title: "Sample CSV processed!",
        description: `${result.processedCount} transactions imported to your inbox`,
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

  const handleTryCSV = () => {
    setIsProcessing(true);
    processCSVMutation.mutate({
      csvContent: sampleCSVContent,
      fileName: 'quickbooks-export-sample.csv',
    });
  };

  const downloadSampleCSV = () => {
    const blob = new Blob([sampleCSVContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quickbooks-export-sample.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Sample CSV downloaded",
      description: "Check your downloads folder",
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Benefit Text */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/20 rounded-full">
          <Table className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-sm text-green-700 dark:text-green-300">
            CSV imports from QuickBooks, Xero, or bank exports enable bulk transaction processing
          </span>
        </div>
      </div>

      <Card className="overflow-hidden border-2 border-dashed border-gray-300">
        {/* Header */}
        <div className="bg-gray-50 dark:bg-gray-900/50 border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Sample CSV Export</span>
              <Badge variant="secondary" className="text-xs">
                QuickBooks Format
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(true)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">What's included:</h3>
              <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span>4 Invoices to schedule</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>3 Receipts for expenses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                  <span>3 Bills to track</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <span>2 Payment confirmations</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-300">
                <strong>Try it:</strong> This sample contains 12 transactions from various vendors 
                like QuickBooks, AWS, Adobe, and more - similar to a real accounting export.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-semibold">12</div>
                <div className="text-xs text-muted-foreground">Transactions</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">$9,421</div>
                <div className="text-xs text-muted-foreground">Total Amount</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">Jan 2024</div>
                <div className="text-xs text-muted-foreground">Date Range</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border-t border-blue-200 dark:border-blue-800 p-4">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={downloadSampleCSV}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1"
            >
              <Button
                onClick={handleTryCSV}
                disabled={isProcessing || isProcessed}
                className={cn(
                  "w-full relative overflow-hidden transition-all duration-300",
                  isProcessed 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-blue-600 hover:bg-blue-700"
                )}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing CSV...
                  </>
                ) : isProcessed ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Imported!
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Sample CSV
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

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>CSV Preview</DialogTitle>
            <DialogDescription>
              Sample data showing the expected CSV format
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-auto max-h-[60vh] border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0">
                <tr>
                  {['Date', 'Vendor', 'Description', 'Amount', 'Type'].map((header) => (
                    <th key={header} className="px-4 py-2 text-left font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {sampleCSVContent.split('\n').slice(1).map((line, index) => {
                  const [date, vendor, description, amount, type] = line.split(',');
                  return (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td className="px-4 py-2">{date}</td>
                      <td className="px-4 py-2">{vendor}</td>
                      <td className="px-4 py-2">{description}</td>
                      <td className="px-4 py-2">${amount}</td>
                      <td className="px-4 py-2">
                        <Badge variant={
                          type === 'invoice' ? 'default' :
                          type === 'receipt' ? 'secondary' :
                          type === 'bill' ? 'outline' :
                          'secondary'
                        } className="text-xs">
                          {type}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Info text */}
      <p className="text-xs text-center text-muted-foreground">
        CSV format compatible with QuickBooks, Xero, and most accounting software exports
      </p>
    </div>
  );
}

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}