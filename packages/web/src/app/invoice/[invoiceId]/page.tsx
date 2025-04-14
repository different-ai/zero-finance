import React from 'react';
import { notFound } from 'next/navigation';
import { appRouter } from '@/server/routers/_app';
// import InvoiceClient from '@/components/invoice/invoice-client'; // Use InvoiceDisplay instead
import { InvoiceDisplay, InvoiceDisplayData } from '@/components/invoice/invoice-display'; // Import display component and its data type
import { formatUnits } from 'viem'; // Needed for formatting amount

// Helper function to map raw DB data to display data
function mapToDisplayData(rawData: any): InvoiceDisplayData | null {
  if (!rawData) return null;

  const invoiceDetails = rawData.invoiceData || {}; // Nested data from DB
  
  // Calculate total amount from items if not directly available
  const calculatedTotal = invoiceDetails.invoiceItems?.reduce((sum: number, item: any) => {
    const quantity = item.quantity || 0;
    const unitPrice = parseFloat(item.unitPrice || '0');
    const taxRate = parseFloat(item.tax?.amount || '0') / 100;
    const subtotal = quantity * unitPrice;
    const taxAmount = subtotal * taxRate;
    return sum + subtotal + taxAmount;
  }, 0).toFixed(2) || rawData.amount || '0.00';

  return {
    invoiceNumber: invoiceDetails.invoiceNumber,
    creationDate: rawData.createdAt,
    status: rawData.status === 'paid' ? 'Paid' : rawData.status === 'db_pending' ? 'Draft' : 'Pending', // Map status
    sellerInfo: invoiceDetails.sellerInfo,
    buyerInfo: invoiceDetails.buyerInfo,
    invoiceItems: invoiceDetails.invoiceItems?.map((item: any) => ({ 
       ...item, 
       // Ensure unitPrice is string for display component if needed
       unitPrice: String(item.unitPrice) 
    })),
    paymentTerms: invoiceDetails.paymentTerms,
    note: invoiceDetails.note,
    terms: invoiceDetails.terms,
    paymentType: invoiceDetails.paymentType,
    currency: rawData.currency,
    network: invoiceDetails.network,
    amount: calculatedTotal, // Use calculated or raw amount
    bankDetails: invoiceDetails.bankDetails,
    isOnChain: !!rawData.requestId, // Check if RN ID exists
  };
}

// Server Component for the public invoice view
export default async function PublicInvoicePage({
  params,
  searchParams,
}: {
  params: { invoiceId: string };
  searchParams: { token?: string };
}) {
  const invoiceId = params?.invoiceId;
  const shareToken = searchParams?.token;

  if (!invoiceId) {
    console.log('PublicInvoicePage: No invoice ID provided.');
    return notFound();
  }

  if (!shareToken) {
    console.log(`PublicInvoicePage: Access attempt without token for invoice ${invoiceId}`);
    return notFound();
  }

  console.log(`PublicInvoicePage: Accessing invoice ${invoiceId} with token.`);

  let rawInvoiceData: any = null;
  let fetchError: string | null = null;
  let displayData: InvoiceDisplayData | null = null;

  try {
    const publicCaller = appRouter.createCaller({});
    rawInvoiceData = await publicCaller.invoice.getByPublicIdAndToken({
      id: invoiceId,
      token: shareToken,
    });
    console.log(`PublicInvoicePage: Successfully fetched invoice ${invoiceId} using public token.`);
    
    // Map the fetched data to the display format
    displayData = mapToDisplayData(rawInvoiceData);
    if (!displayData) {
      throw new Error('Failed to process fetched invoice data.');
    }

  } catch (error: any) {
    console.error(`Error loading public invoice ${invoiceId} with token:`, error);
    fetchError = error.message || 'Failed to load invoice data.';

    if (error.code === 'NOT_FOUND') {
       console.log(`Public invoice ${invoiceId} not found or token invalid.`);
       return notFound();
    }
    if (error.code === 'UNAUTHORIZED' || error.code === 'FORBIDDEN') {
       console.log(`Public access denied (${error.code}) for invoice ${invoiceId}. Token likely invalid.`);
       return notFound();
    }
    
    // Render error using InvoiceDisplay for consistency
    return (
      <main className="container mx-auto px-4 py-8 space-y-6">
        <InvoiceDisplay invoiceData={null} error={fetchError} isLoading={false} />
      </main>
    );
  }
  
  // We should only reach here with valid displayData
  if (!displayData) {
     console.error('PublicInvoicePage: Display data unexpectedly null after successful fetch and processing.');
     return (
       <main className="container mx-auto px-4 py-8 space-y-6">
         <InvoiceDisplay invoiceData={null} error={"Internal processing error."} isLoading={false} />
       </main>
     );
  }

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      {/* Render the InvoiceDisplay component with the formatted data */}
      <InvoiceDisplay
        invoiceData={displayData}
        isExternalView={true}
        isLoading={false} // Data is loaded at this point
      />
    </main>
  );
} 