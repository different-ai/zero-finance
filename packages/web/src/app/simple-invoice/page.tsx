'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimplifiedInvoiceForm } from '@/components/invoice/simplified-invoice-form';
import { trpc } from '@/utils/trpc';
import { Loader2 } from 'lucide-react';

const SAMPLE_INVOICE_TEXT = `
INVOICE

Invoice #: INV-2025-0711
Date Issued: July 11, 2025
Due Date: August 10, 2025 (Net 30)

Seller:
Company: Orion Web Infrastructure Ltd.
Address: 850 Mission St, 5th Floor, San Francisco, CA 94103
Phone: +1 (415) 555-1034
Email: billing@oroninfra.com
Tax ID: 94-2938471

Buyer:
Company: Zero Finance Inc.
Address: 166 Geary St, Suite 1500, San Francisco, CA 94108
Contact: Benjamin Shafii
Email: ops@0.finance
Tax ID: 88-7293847

Line Items:
Qty  Description                           Unit Price  Total
1    Dedicated VPS (8 cores, 32 GB RAM)   €220.00     €220.00
1    Premium Uptime Monitoring (June 2025) €75.00      €75.00
1    Static IP Allocation + Redundancy Tier €55.00     €55.00
1    DNS Failover Management               €40.00      €40.00
1    Priority SLA Support (24/7)          €60.00      €60.00

Subtotal: €450.00
Tax (0.0%): €0.00
Total Due: €450.00

Payment Instructions:
Bank Name: First Horizon Bank
Routing Number: 121000358
Account Number: 0987654321
Account Name: Orion Web Infrastructure Ltd.
SWIFT Code for international: FHBKUS44XXX

Please include invoice number in payment memo.

Notes:
• All services billed are for usage during June 2025.
• This invoice reflects a discounted rate under the Zero Finance strategic partner plan.
• For questions, contact our billing department.
`;

export default function SimpleInvoicePage() {
  const [rawText, setRawText] = useState('');
  const [extractedData, setExtractedData] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const extractMutation = trpc.invoice.prefillFromRaw.useMutation({
    onSuccess: (data) => {
      console.log('🎉 Extraction successful:', data);
      setExtractedData(data);
      setShowForm(true);
    },
    onError: (error) => {
      console.error('❌ Extraction failed:', error);
    },
  });

  const handleExtract = () => {
    if (!rawText.trim()) {
      return;
    }
    extractMutation.mutate({ rawText });
  };

  const loadSample = () => {
    setRawText(SAMPLE_INVOICE_TEXT);
  };

  const resetForm = () => {
    setRawText('');
    setExtractedData(null);
    setShowForm(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Simple Invoice Creation</h1>
        <p className="text-gray-600">
          {showForm 
            ? 'Review and edit the extracted invoice data below'
            : 'Paste your invoice text to automatically extract and create an invoice'
          }
        </p>
      </div>

      {!showForm ? (
        /* Extraction Phase */
        <Card>
          <CardHeader>
            <CardTitle>Extract Invoice Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste invoice text here..."
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={loadSample} variant="outline">
                Load Sample Invoice
              </Button>
              <Button 
                onClick={handleExtract} 
                disabled={!rawText.trim() || extractMutation.isPending}
                className="flex-1"
              >
                {extractMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Extracting Data...
                  </>
                ) : (
                  'Extract & Create Invoice'
                )}
              </Button>
            </div>
            
            {extractMutation.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                <strong>Error:</strong> {extractMutation.error.message}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Form Phase */
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Create Invoice</h2>
              <p className="text-sm text-gray-600">
                Data has been automatically extracted and filled in the form below
              </p>
            </div>
            <Button onClick={resetForm} variant="outline">
              Start Over
            </Button>
          </div>
          
          <SimplifiedInvoiceForm extractedData={extractedData} />
        </div>
      )}
    </div>
  );
}