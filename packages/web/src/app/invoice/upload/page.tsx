'use client';

import React, { useState } from 'react';
import { FileUpload } from '@/components/invoice/file-upload';
import { useInvoiceStore } from '@/lib/store/invoice-store';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { ArrowRight, Receipt, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function InvoiceUploadPage() {
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);
  const { detectedInvoiceData, hasInvoiceData, applyDataToForm } = useInvoiceStore();
  const router = useRouter();

  // Handle when a file has been successfully uploaded
  const handleUploadComplete = (blobUrl: string, filename: string, invoiceData: any) => {
    setUploadedFileUrl(blobUrl);
    setUploadedFilename(filename);
    // Note: invoiceData is already set in the store by the FileUpload component
  };

  // Apply the detected data and navigate to the invoice creation page
  const handleContinue = () => {
    if (hasInvoiceData) {
      // Apply the detected data to the form
      applyDataToForm();
      // Navigate to the invoice create page
      router.push('/invoice/create');
      toast.success('Invoice data applied to the form!');
    } else {
      toast.error('No invoice data detected. Please upload a valid invoice document.');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Receipt className="h-8 w-8" />
        Upload Invoice Document
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>
                Upload a PDF or image of your invoice to extract information automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload 
                onUploadComplete={handleUploadComplete} 
                className="w-full"
              />
              {uploadedFileUrl && uploadedFilename && (
                <div className="mt-4 p-3 border rounded-md bg-muted/50">
                  <p className="text-sm font-medium">Uploaded file: {uploadedFilename}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Supports PDF, JPEG, PNG and WebP files up to 25MB.
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card className={`h-full ${!hasInvoiceData ? 'opacity-70' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {hasInvoiceData && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                Extracted Information
              </CardTitle>
              <CardDescription>
                {hasInvoiceData 
                  ? 'We\'ve successfully extracted the following information from your document.'
                  : 'Upload a document to extract invoice information.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] overflow-y-auto">
              {hasInvoiceData ? (
                <div className="space-y-4">
                  {/* Invoice details */}
                  {detectedInvoiceData?.invoiceNumber && (
                    <div>
                      <h3 className="font-medium">Invoice Number:</h3>
                      <p>{detectedInvoiceData.invoiceNumber}</p>
                    </div>
                  )}
                  
                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    {detectedInvoiceData?.issuedAt && (
                      <div>
                        <h3 className="font-medium">Issue Date:</h3>
                        <p>{new Date(detectedInvoiceData.issuedAt).toLocaleDateString()}</p>
                      </div>
                    )}
                    {detectedInvoiceData?.dueDate && (
                      <div>
                        <h3 className="font-medium">Due Date:</h3>
                        <p>{new Date(detectedInvoiceData.dueDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Seller info */}
                  {(detectedInvoiceData?.fromName || detectedInvoiceData?.sellerInfo?.businessName) && (
                    <div>
                      <h3 className="font-medium">Seller:</h3>
                      <p>{detectedInvoiceData?.fromName || detectedInvoiceData?.sellerInfo?.businessName}</p>
                      {detectedInvoiceData?.fromEmail && <p>{detectedInvoiceData.fromEmail}</p>}
                    </div>
                  )}
                  
                  {/* Buyer info */}
                  {(detectedInvoiceData?.toName || detectedInvoiceData?.buyerInfo?.businessName) && (
                    <div>
                      <h3 className="font-medium">Buyer:</h3>
                      <p>{detectedInvoiceData?.toName || detectedInvoiceData?.buyerInfo?.businessName}</p>
                      {detectedInvoiceData?.toEmail && <p>{detectedInvoiceData.toEmail}</p>}
                    </div>
                  )}
                  
                  {/* Total */}
                  {detectedInvoiceData?.total && (
                    <div>
                      <h3 className="font-medium">Total Amount:</h3>
                      <p className="text-lg font-bold">
                        {detectedInvoiceData.currency || ''} {detectedInvoiceData.total}
                      </p>
                    </div>
                  )}
                  
                  {/* Items summary */}
                  {detectedInvoiceData?.items && detectedInvoiceData.items.length > 0 && (
                    <div>
                      <h3 className="font-medium">Items:</h3>
                      <p>{detectedInvoiceData.items.length} item(s) detected</p>
                    </div>
                  )}
                  
                  {/* Additional notes */}
                  {detectedInvoiceData?.additionalNotes && (
                    <div>
                      <h3 className="font-medium">Additional Notes:</h3>
                      <p className="text-sm whitespace-pre-wrap">{detectedInvoiceData.additionalNotes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <p>No information extracted yet</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleContinue}
                disabled={!hasInvoiceData}
                className="w-full"
              >
                Continue to Invoice <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
