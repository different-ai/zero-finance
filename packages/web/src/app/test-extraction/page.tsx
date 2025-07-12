'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/utils/trpc';

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

export default function TestExtractionPage() {
  const [rawText, setRawText] = useState(SAMPLE_INVOICE_TEXT);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractMutation = trpc.invoice.prefillFromRaw.useMutation({
    onSuccess: (data) => {
      setExtractedData(data);
      setError(null);
      setIsLoading(false);
    },
    onError: (error) => {
      setError(error.message);
      setExtractedData(null);
      setIsLoading(false);
    },
  });

  const handleExtract = () => {
    if (!rawText.trim()) {
      setError('Please provide invoice text to extract');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setExtractedData(null);
    
    extractMutation.mutate({ rawText });
  };

  const analyzeExtraction = (data: any) => {
    const checks = [
      { field: 'Seller Business Name', value: data.sellerInfo?.businessName, expected: 'Orion Web Infrastructure Ltd.' },
      { field: 'Seller Email', value: data.sellerInfo?.email, expected: 'billing@oroninfra.com' },
      { field: 'Seller Phone', value: data.sellerInfo?.phone, expected: '+1 (415) 555-1034' },
      { field: 'Buyer Business Name', value: data.buyerInfo?.businessName, expected: 'Zero Finance Inc.' },
      { field: 'Buyer Contact', value: data.buyerInfo?.contactName, expected: 'Benjamin Shafii' },
      { field: 'Invoice Number', value: data.invoiceNumber, expected: 'INV-2025-0711' },
      { field: 'Currency', value: data.currency, expected: 'EUR' },
      { field: 'Total Amount', value: data.totalAmount, expected: '450.00' },
      { field: 'Bank Name', value: data.bankDetails?.bankName, expected: 'First Horizon Bank' },
      { field: 'Routing Number', value: data.bankDetails?.routingNumber, expected: '121000358' },
      { field: 'Account Number', value: data.bankDetails?.accountNumber, expected: '0987654321' },
      { field: 'Line Items Count', value: data.invoiceItems?.length, expected: 5 },
    ];

    return checks;
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Invoice Extraction Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Input Invoice Text</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste invoice text here..."
              className="min-h-[400px] font-mono text-sm"
            />
            
            <div className="flex gap-2">
              <Button 
                onClick={handleExtract} 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Extracting...' : 'Extract Data'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setRawText(SAMPLE_INVOICE_TEXT)}
              >
                Load Sample
              </Button>
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle>Extraction Results</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Extracting data...</span>
              </div>
            )}

            {extractedData && (
              <div className="space-y-4">
                {/* Quality Analysis */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-3">Extraction Quality Analysis</h3>
                  <div className="space-y-2">
                    {analyzeExtraction(extractedData).map((check, index) => {
                      const match = check.value === check.expected || 
                                   (check.field === 'Line Items Count' && check.value === check.expected);
                      return (
                        <div key={index} className={`flex items-center gap-2 text-sm ${match ? 'text-green-700' : 'text-red-700'}`}>
                          <span>{match ? '✅' : '❌'}</span>
                          <span className="font-medium">{check.field}:</span>
                          <span>{check.value || 'null'}</span>
                          {!match && <span className="text-gray-500">(expected: {check.expected})</span>}
                        </div>
                      );
                    })}
                  </div>
                  
                  {(() => {
                    const checks = analyzeExtraction(extractedData);
                    const score = checks.filter(check => 
                      check.value === check.expected || 
                      (check.field === 'Line Items Count' && check.value === check.expected)
                    ).length;
                    const percentage = Math.round(score / checks.length * 100);
                    
                    return (
                      <div className="mt-3 p-2 bg-white rounded border">
                        <strong>Score: {score}/{checks.length} ({percentage}%)</strong>
                        {percentage === 100 && <span className="ml-2 text-green-600">🎉 Perfect!</span>}
                        {percentage >= 80 && percentage < 100 && <span className="ml-2 text-yellow-600">👍 Good</span>}
                        {percentage < 80 && <span className="ml-2 text-red-600">⚠️ Needs improvement</span>}
                      </div>
                    );
                  })()}
                </div>

                {/* Raw JSON */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-3">Raw Extracted Data</h3>
                  <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-96">
                    {JSON.stringify(extractedData, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {!extractedData && !isLoading && !error && (
              <div className="text-center py-8 text-gray-500">
                No extraction results yet. Click "Extract Data" to test the pipeline.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}