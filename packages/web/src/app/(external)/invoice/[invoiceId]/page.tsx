import React from 'react';
import { notFound } from 'next/navigation';
import { userRequestService } from '@/lib/user-request-service';
import { InvoiceWrapper } from '@/components/invoice/invoice-wrapper';
import { invoiceDataSchema } from '@/server/routers/invoice-router';
import { z } from 'zod';

type ParsedInvoiceDetails = z.infer<typeof invoiceDataSchema>;
type Params = { invoiceId: string };

export default async function ExternalInvoicePage({ params }: { params: Params }) {
  const invoiceId = params.invoiceId;

  console.log(
    '0xHypr',
    'External View - Simplified - Invoice ID:',
    invoiceId
  );

  if (!invoiceId) {
    console.log('0xHypr', 'External View - No Invoice ID provided.');
    return notFound();
  }

  let dbRequest = null;
  let parsedInvoiceDetails: ParsedInvoiceDetails | null = null;
  let parsingError = false;

  try {
    dbRequest = await userRequestService.getRequestByPrimaryKey(invoiceId);

    if (dbRequest) {
      console.log(
        '0xHypr',
        'External View - Found request in database:',
        invoiceId
      );

      const parseResult = invoiceDataSchema.safeParse(dbRequest.invoiceData);
      if (parseResult.success) {
        parsedInvoiceDetails = parseResult.data;
        console.log(
          '0xHypr',
          'External View - Successfully parsed invoiceData on server.'
        );
      } else {
        parsingError = true;
        console.error(
          '0xHypr',
          'External View - Failed to parse invoiceData on server:',
          parseResult.error
        );
      }

      return (
        <main className="container mx-auto px-4 py-8">
          <InvoiceWrapper
            requestId={dbRequest.id}
            requestNetworkId={dbRequest.requestId || undefined}
            dbInvoiceData={dbRequest}
            parsedInvoiceDetails={parsedInvoiceDetails}
            parsingError={parsingError}
            isExternalView={true}
          />
        </main>
      );
    } else {
      console.log(
        '0xHypr',
        'External View - Invoice ID not found in database:',
        invoiceId
      );
      return notFound();
    }
  } catch (dbError) {
    console.error(
      '0xHypr',
      'External View - Error fetching request from database:',
      dbError
    );
    return notFound();
  }
}
