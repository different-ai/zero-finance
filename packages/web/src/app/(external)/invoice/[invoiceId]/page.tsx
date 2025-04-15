import React from 'react';
import { notFound } from 'next/navigation';
import { ephemeralKeyService } from '@/lib/ephemeral-key-service';
import { userRequestService } from '@/lib/user-request-service';
import { InvoiceWrapper } from '@/components/invoice/invoice-wrapper';
import { invoiceDataSchema } from '@/server/routers/invoice-router';
import { z } from 'zod';

type ParsedInvoiceDetails = z.infer<typeof invoiceDataSchema>;
type Params = Promise<{ invoiceId: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ExternalInvoicePage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  // Await both params and searchParams
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const invoiceId = params.invoiceId;
  const tokenValue = searchParams.token;
  const token = Array.isArray(tokenValue) ? tokenValue[0] : tokenValue;
  
  console.log('0xHypr', 'External View - Invoice ID:', invoiceId, 'Token:', token);

  if (!invoiceId) {
    console.log('0xHypr', 'External View - No Invoice ID provided.');
    return notFound();
  }

  if (!token) {
    console.log('0xHypr', 'External View - No token provided, access denied.');
    return notFound();
  }
  
  console.log('0xHypr', 'External View - Token provided, attempting access.');
  const decryptionKey = await ephemeralKeyService.getPrivateKey(token);

  if (!decryptionKey) {
    console.log('0xHypr', 'External View - Invalid or expired token.');
    return notFound();
  }

  console.log('0xHypr', 'External View - Valid token, decryption key obtained.');

  let dbRequest = null;
  let parsedInvoiceDetails: ParsedInvoiceDetails | null = null;
  let parsingError = false;

  try {
    dbRequest = await userRequestService.getRequestByPrimaryKey(invoiceId);

    if (dbRequest) {
      console.log('0xHypr', 'External View - Found request in database:', invoiceId);
      
      const parseResult = invoiceDataSchema.safeParse(dbRequest.invoiceData);
      if (parseResult.success) {
        parsedInvoiceDetails = parseResult.data;
        console.log('0xHypr', 'External View - Successfully parsed invoiceData on server.');
      } else {
        parsingError = true;
        console.error('0xHypr', 'External View - Failed to parse invoiceData on server:', parseResult.error);
      }

      return (
        <main className="container mx-auto px-4 py-8">
          <InvoiceWrapper 
            requestId={dbRequest.id}
            requestNetworkId={dbRequest.requestId || undefined}
            decryptionKey={decryptionKey}
            dbInvoiceData={dbRequest}
            parsedInvoiceDetails={parsedInvoiceDetails}
            parsingError={parsingError}
            isExternalView={true}
          />
        </main>
      );
    } else {
      console.log('0xHypr', 'External View - Invoice ID not found in database:', invoiceId);
    }
  } catch (dbError) {
    console.error('0xHypr', 'External View - Error fetching request from database:', dbError);
    console.log('0xHypr', 'External View - DB fetch failed, showing not found.');
    return notFound();
  }

  console.log('0xHypr', 'External View - No valid access path found for invoice:', invoiceId);
  return notFound();
}
