'use client'; // Start as client component, might change

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { trpc } from '@/utils/trpc'; // Assuming client-side fetching for now
// import { InvoiceDisplay } from '@/components/invoice/invoice-display'; // Placeholder for extracted component
import { Button } from '@/components/ui/button';
import { Share2, UploadCloud, Download } from 'lucide-react';
import { toast } from 'sonner';

// Placeholder for the actual display component
const InvoiceDisplay = ({ invoiceData }: { invoiceData: any }) => {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-4">Invoice Details (Internal View)</h2>
      <pre>{JSON.stringify(invoiceData, null, 2)}</pre>
      {/* Actual display rendering will go here */}
    </div>
  );
};


export default function InternalInvoicePage() {
  const params = useParams();
  // Ensure params exists before accessing invoiceId
  const invoiceId = params?.invoiceId as string;

  // TODO: Implement proper server-side fetching and authentication/authorization
  // For now, using tRPC query on client-side as a placeholder structure
  const { data: rawInvoiceData, isLoading, error } = trpc.invoice.getById.useQuery(
    { id: invoiceId },
    { enabled: !!invoiceId } // Only run query if invoiceId is available
  );

  // Assuming the actual invoice details are nested under the 'invoiceData' property
  // Need to parse this if it's stored as JSON string, or cast if object
  // Let's assume it's already an object for now, but might need JSON.parse
  const invoiceDetails = rawInvoiceData?.invoiceData as any; // Cast to any for now, refine later

  const handleShare = async () => {
    // Use rawInvoiceData for id and shareToken which are top-level
    if (rawInvoiceData?.id && rawInvoiceData?.shareToken) {
      // Construct the external URL using the DB ID
      const shareUrl = `${window.location.origin}/invoice/${rawInvoiceData.id}?token=${rawInvoiceData.shareToken}`;
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Shareable link copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy link.');
        console.error('Failed to copy share link:', err);
      }
    } else {
      toast.error('Could not generate share link.');
    }
  };

  const handleCommitToChain = () => {
    // TODO: Implement tRPC mutation call to commit invoice to Request Network
    toast.info('Commit to blockchain functionality not yet implemented.');
  };

  const handleDownloadPdf = () => {
    // TODO: Implement PDF generation/download functionality
    toast.info('PDF download functionality not yet implemented.');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-600">Loading invoice...</p>
      </div>
    );
  }

  if (error || !rawInvoiceData) {
    // TODO: Improve error handling, check for specific auth errors from query if implemented
    console.error('Error loading invoice:', error);
    // return notFound(); // Use notFound for actual server component errors
     return <div className="text-red-500 text-center mt-10">Error loading invoice or invoice not found.</div>;
  }

  // Check if invoiceDetails exist before trying to access properties
  if (!invoiceDetails) {
    return <div className="text-orange-500 text-center mt-10">Invoice data format seems incorrect.</div>;
  }

  // Determine if commit should be possible (is crypto, not already on chain)
  // Access properties via invoiceDetails, use rawInvoiceData for requestId
  const canCommit = invoiceDetails.paymentType === 'crypto' && !rawInvoiceData.requestId;

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        {/* Access invoiceNumber via invoiceDetails */}
        <h1 className="text-2xl font-semibold">Invoice #{invoiceDetails.invoiceNumber} (Internal)</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          {canCommit && (
             <Button variant="outline" onClick={handleCommitToChain}>
               <UploadCloud className="mr-2 h-4 w-4" /> Commit to Chain
             </Button>
          )}
           <Button variant="outline" onClick={handleDownloadPdf}>
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Pass the nested invoiceDetails to the display component */}
      <InvoiceDisplay invoiceData={invoiceDetails} />

      {/* Add more sections if needed, e.g., payment status, history */}
    </main>
  );
} 