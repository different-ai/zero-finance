import React from 'react';
import { notFound } from 'next/navigation';
import { userRequestService } from '@/lib/user-request-service';
import { InvoiceWrapper } from '@/components/invoice/invoice-wrapper';
import { invoiceDataSchema, } from '@/server/routers/invoice-router';
import { z } from 'zod';

type ParsedInvoiceDetails = z.infer<typeof invoiceDataSchema> & {
  paymentMethod?: string;
  paymentAddress?: string;
  payment?: {
    type?: string;
    currency?: string;
    network?: string;
    address?: string;
  };
};
type Params = Promise<{ invoiceId: string }>;

export default async function ExternalInvoicePage(props: { params: Promise<Params> }) {
  const params = await props.params;
  const { invoiceId } = params;

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
      console.log(
        '0xHypr',
        'External View - Invoice data:',
        JSON.stringify(dbRequest.invoiceData, null, 2)
      );

      const parseResult = invoiceDataSchema.safeParse(dbRequest.invoiceData);
      if (parseResult.success) {
        // Merge the parsed data with the raw invoice data to get all fields
        parsedInvoiceDetails = {
          ...parseResult.data,
          ...(dbRequest.invoiceData as any), // Include paymentMethod, paymentAddress, etc.
        };
        console.log(
          '0xHypr',
          'External View - Successfully parsed invoiceData on server.'
        );
        console.log(
          '0xHypr',
          'External View - Parsed invoice details:',
          JSON.stringify(parsedInvoiceDetails, null, 2)
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
            // todo: fix the types
            dbInvoiceData={dbRequest as any}
            parsedInvoiceDetails={parsedInvoiceDetails}
            parsingError={parsingError}
            isExternalView={true}
            sellerCryptoAddress={null} // Don't use seller profile data
            sellerFundingSource={null} // Don't use seller profile data
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
