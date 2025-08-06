import React from 'react';
import { notFound } from 'next/navigation';
import { userRequestService } from '@/lib/user-request-service';
import { InvoiceWrapper } from '@/components/invoice/invoice-wrapper';
import { invoiceDataSchema, } from '@/server/routers/invoice-router';
import { z } from 'zod';
import { userProfileService } from '@/lib/user-profile-service';
import { db } from '@/db';
import { userFundingSources, UserFundingSource } from '@/db/schema';
import { eq } from 'drizzle-orm';

type ParsedInvoiceDetails = z.infer<typeof invoiceDataSchema> & {
  paymentMethod?: string;
  paymentAddress?: string;
};
type Params = Promise<{ invoiceId: string }>;

async function getSellerFundingSource(userId: string): Promise<UserFundingSource | null> {
    const sources = await db
        .select()
        .from(userFundingSources)
        .where(eq(userFundingSources.userPrivyDid, userId))
        .limit(1);
    return sources.length > 0 ? sources[0] : null;
}

export default async function ExternalInvoicePage(props: { params: Params }) {
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
  let sellerCryptoAddress: string | null = null;
  let sellerFundingSource: UserFundingSource | null = null;

  try {
    dbRequest = await userRequestService.getRequestByPrimaryKey(invoiceId);

    if (dbRequest) {
      console.log(
        '0xHypr',
        'External View - Found request in database:',
        invoiceId
      );

      try {
        if (dbRequest.userId) {
          sellerCryptoAddress = await userProfileService.getPaymentAddress(dbRequest.userId);
          sellerFundingSource = await getSellerFundingSource(dbRequest.userId);
          console.log('0xHypr', `External View - Fetched seller details for user ${dbRequest.userId}: Address=${sellerCryptoAddress}, FundingSource=${!!sellerFundingSource}`);
        } else {
          console.warn('0xHypr', `External View - No userId found on request ${invoiceId}, cannot fetch seller details.`);
        }
      } catch (sellerError) {
        console.error('0xHypr', `External View - Error fetching seller details for request ${invoiceId}:`, sellerError);
      }

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

      // Extract payment details from parsed invoice data for display
      const paymentDetails = parsedInvoiceDetails?.bankDetails || null;
      const paymentMethod = parsedInvoiceDetails?.paymentMethod || parsedInvoiceDetails?.paymentType || 'fiat';
      const paymentAddress = parsedInvoiceDetails?.paymentAddress || null;
      const currency = parsedInvoiceDetails?.currency || dbRequest.currency || 'USD';
      const network = parsedInvoiceDetails?.network || null;

      return (
        <main className="container mx-auto px-4 py-8 space-y-6">
          {/* Payment Details Section for External View */}
          {((paymentMethod === 'fiat' && paymentDetails) || (paymentMethod !== 'fiat' && paymentAddress)) && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
              
              {paymentMethod === 'fiat' && paymentDetails ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentDetails.accountHolder && (
                      <div>
                        <p className="text-sm text-gray-500">Account Holder</p>
                        <p className="font-medium">{paymentDetails.accountHolder}</p>
                      </div>
                    )}
                    {paymentDetails.bankName && (
                      <div>
                        <p className="text-sm text-gray-500">Bank Name</p>
                        <p className="font-medium">{paymentDetails.bankName}</p>
                      </div>
                    )}
                    {paymentDetails.accountNumber && (
                      <div>
                        <p className="text-sm text-gray-500">Account Number</p>
                        <p className="font-medium">{paymentDetails.accountNumber}</p>
                      </div>
                    )}
                    {paymentDetails.routingNumber && (
                      <div>
                        <p className="text-sm text-gray-500">Routing Number</p>
                        <p className="font-medium">{paymentDetails.routingNumber}</p>
                      </div>
                    )}
                    {paymentDetails.iban && (
                      <div>
                        <p className="text-sm text-gray-500">IBAN</p>
                        <p className="font-medium">{paymentDetails.iban}</p>
                      </div>
                    )}
                    {paymentDetails.bic && (
                      <div>
                        <p className="text-sm text-gray-500">BIC/SWIFT</p>
                        <p className="font-medium">{paymentDetails.bic}</p>
                      </div>
                    )}
                  </div>
                  {paymentDetails.bankAddress && (
                    <div>
                      <p className="text-sm text-gray-500">Bank Address</p>
                      <p className="font-medium">{paymentDetails.bankAddress}</p>
                    </div>
                  )}
                </div>
              ) : paymentMethod !== 'fiat' && paymentAddress ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Network</p>
                    <p className="font-medium capitalize">{network || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Currency</p>
                    <p className="font-medium">{currency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Wallet Address</p>
                    <p className="font-mono text-sm break-all bg-gray-50 p-2 rounded">{paymentAddress}</p>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          <InvoiceWrapper
            requestId={dbRequest.id}
            requestNetworkId={dbRequest.requestId || undefined}
            // todo: fix the types
            dbInvoiceData={dbRequest as any}
            parsedInvoiceDetails={parsedInvoiceDetails}
            parsingError={parsingError}
            isExternalView={true}
            sellerCryptoAddress={sellerCryptoAddress}
            sellerFundingSource={sellerFundingSource}
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
