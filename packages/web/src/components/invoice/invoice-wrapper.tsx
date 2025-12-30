'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { UserFundingSource } from '@/db/schema'; // Added
import { FiatPaymentDetails } from './fiat-payment-details';
import { CryptoManualPaymentDetails } from './crypto-manual-payment-details';
// Request Network integration removed - invoices are now handled natively
import { usePrivy } from '@privy-io/react-auth'; // Import Privy hook
import { Wallet } from 'lucide-react'; // Import Wallet icon
import { formatDisplayCurrency } from '@/lib/utils'; // Import the new utility
import { getCurrencyConfig } from '@/lib/currencies'; // Import currency config
import WelcomeGradient from '@/app/(landing)/welcome-gradient'; // Import gradient for background
import { InvoiceAttachments } from './invoice-attachments'; // Import attachments component

// --- Define necessary types locally or import from a SAFE shared location ---
// Basic structure based on invoiceDataSchema fields used in this component
// Adjust as needed if more fields are used or if a shared type exists
type TaxField = number | { type: 'percentage'; amount: string };

type ParsedInvoiceItem = {
  name?: string;
  unitPrice?: string;
  quantity?: number;
  tax?: TaxField;
  // Add other item fields if used by static display
};

type ParsedInvoiceDetails = {
  paymentType?: 'crypto' | 'fiat';
  paymentMethod?: string;
  paymentAddress?: string;
  currency?: string;
  network?: string;
  bankDetails?: {
    accountHolder?: string;
    iban?: string;
    bic?: string;
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
    bankAddress?: string;
  } | null;
  invoiceNumber?: string;
  invoiceItems?: Array<ParsedInvoiceItem>; // Use the defined item type
  sellerInfo?: {
    businessName?: string;
    email?: string;
    address?:
      | string
      | {
          'street-address'?: string;
          locality?: string;
          'postal-code'?: string;
          'country-name'?: string;
        };
    city?: string;
    postalCode?: string;
    country?: string;
    // Add other seller fields if used
  };
  buyerInfo?: {
    businessName?: string;
    email?: string;
    address?:
      | string
      | {
          'street-address'?: string;
          locality?: string;
          'postal-code'?: string;
          'country-name'?: string;
        };
    city?: string;
    postalCode?: string;
    country?: string;
    // Add other buyer fields if used
  };
  issueDate?: string;
  dueDate?: string;
  note?: string;
  terms?: string;
  // Add other top-level fields from schema if used
};

// Minimal UserRequest type needed for props (can be refined)
type BasicUserRequest = {
  id: string;
  requestId?: string | null;
  invoiceData: any; // Keep as any for now, parsing happens on server
  currency?: string | null;
  amount?: string | null;
  status?: string | null; // Assuming status is a string now
  // Add other fields from UserRequest used directly by this component
};
// --- End Type Definitions ---

// Dynamically import the InvoiceClient component
const InvoiceClient = dynamic(() => import('./invoice-client'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
    </div>
  ),
});

interface InvoiceWrapperProps {
  requestId: string; // DB primary key
  requestNetworkId?: string; // Request Network ID (optional)
  walletPrivateKey?: string;
  dbInvoiceData?: BasicUserRequest | null;
  parsedInvoiceDetails: ParsedInvoiceDetails | null;
  parsingError: boolean;
  isExternalView?: boolean;
  sellerCryptoAddress?: string | null; // Keep for backward compatibility but don't use
  sellerFundingSource?: UserFundingSource | null; // Keep for backward compatibility but don't use
}

// Sub-component for external payment info display
const ExternalPaymentInfo: React.FC<{
  staticInvoiceData: ParsedInvoiceDetails | {};
  dbInvoiceData: BasicUserRequest | null;
  requestNetworkId?: string;
}> = ({ staticInvoiceData, dbInvoiceData, requestNetworkId }) => {
  // Use Privy hook
  const { ready, authenticated, login } = usePrivy();

  const paymentType =
    (staticInvoiceData as ParsedInvoiceDetails).paymentType || 'crypto';
  const currency =
    dbInvoiceData?.currency ||
    (staticInvoiceData as ParsedInvoiceDetails).currency ||
    '';
  const network = (staticInvoiceData as ParsedInvoiceDetails).network || 'base';
  const isOnChain = !!requestNetworkId;
  const invoiceNumber = (staticInvoiceData as ParsedInvoiceDetails)
    .invoiceNumber;
  const amount = dbInvoiceData?.amount || null;

  // Disable button logic until Privy is ready
  const isLoginDisabled = !ready;

  // On-chain payments via Request Network have been removed
  // All payments are now handled natively via crypto or fiat payment details

  // Scenario 3a: Off-chain Crypto Payment (Show payment address from invoice)
  if (!isOnChain && paymentType === 'crypto') {
    // Use payment address from invoice data ONLY
    const paymentAddress =
      (staticInvoiceData as any)?.paymentAddress ||
      (staticInvoiceData as any)?.payment?.address;
    console.log(
      '💰 Crypto payment - using address from invoice:',
      paymentAddress,
    );

    // If no payment address, don't show anything (no warning)
    if (!paymentAddress) {
      return null;
    }

    return (
      <CryptoManualPaymentDetails
        address={paymentAddress}
        currency={currency}
        network={network}
        amount={amount ?? null}
      />
    );
  }

  // Scenario 3b: Off-chain Fiat Payment (Show Bank Details from invoice)
  if (!isOnChain && paymentType === 'fiat') {
    console.log(
      '🏦 External fiat payment - staticInvoiceData:',
      staticInvoiceData,
    );
    console.log(
      '🏦 External fiat payment - bank details:',
      (staticInvoiceData as ParsedInvoiceDetails).bankDetails,
    );

    const bankDetails = (staticInvoiceData as ParsedInvoiceDetails).bankDetails;
    // If no bank details, don't show anything (no warning)
    if (!bankDetails || Object.keys(bankDetails).length === 0) {
      return null;
    }

    return (
      <FiatPaymentDetails
        fundingSource={null} // Don't use seller funding source
        invoiceNumber={invoiceNumber}
        invoiceBankDetails={bankDetails}
      />
    );
  }

  // Fallback - don't show anything if payment type is unknown
  return null;
};
ExternalPaymentInfo.displayName = 'ExternalPaymentInfo'; // Add display name

// Sub-component for static display when only DB data is available
const StaticInvoiceDisplay: React.FC<{
  dbInvoiceData: BasicUserRequest;
  parsedInvoiceDetails: ParsedInvoiceDetails | null;
  parsingError: boolean;
  isExternalView: boolean;
  requestNetworkId?: string;
}> = ({
  dbInvoiceData,
  parsedInvoiceDetails,
  parsingError,
  isExternalView,
  requestNetworkId,
}) => {
  // Handle parsing error passed from parent
  if (parsingError || !parsedInvoiceDetails) {
    console.error(
      'StaticInvoiceDisplay: Parsing failed on server or data is null.',
    );
    return (
      <div className="bg-white shadow rounded-lg p-8 text-red-600">
        Error displaying invoice: Invalid or missing invoice details.
      </div>
    );
  }

  // Use the pre-parsed data directly
  const staticInvoiceData = parsedInvoiceDetails;

  const staticInvoiceItems = staticInvoiceData.invoiceItems || [];
  const sellerName = staticInvoiceData.sellerInfo?.businessName || 'Seller';
  const sellerEmail = staticInvoiceData.sellerInfo?.email;
  const sellerAddressRaw = staticInvoiceData.sellerInfo?.address;
  const sellerAddress =
    typeof sellerAddressRaw === 'string'
      ? sellerAddressRaw
      : sellerAddressRaw?.['street-address'];
  const sellerCity = staticInvoiceData.sellerInfo?.city;
  const sellerPostalCode = staticInvoiceData.sellerInfo?.postalCode;
  const sellerCountry = staticInvoiceData.sellerInfo?.country;

  const buyerName = staticInvoiceData.buyerInfo?.businessName || 'Client';
  const buyerEmail = staticInvoiceData.buyerInfo?.email;
  const buyerAddressRaw = staticInvoiceData.buyerInfo?.address;
  const buyerAddress =
    typeof buyerAddressRaw === 'string'
      ? buyerAddressRaw
      : buyerAddressRaw?.['street-address'];
  const buyerCity = staticInvoiceData.buyerInfo?.city;
  const buyerPostalCode = staticInvoiceData.buyerInfo?.postalCode;
  const buyerCountry = staticInvoiceData.buyerInfo?.country;

  // Extract network for currency formatting
  const network = staticInvoiceData.network || 'base';

  // Calculate totals
  const getTaxPercent = (tax: TaxField | undefined): number => {
    if (!tax) return 0;
    if (typeof tax === 'object') {
      return parseFloat(tax.amount || '0');
    }
    return tax;
  };

  const calculateItemTotal = (item: ParsedInvoiceItem) => {
    const quantity = item.quantity || 1;
    const unitPrice = parseFloat(item.unitPrice || '0');
    const taxRate = getTaxPercent(item.tax) / 100;
    const subtotal = quantity * unitPrice;
    const taxAmount = subtotal * taxRate;
    return subtotal + taxAmount;
  };

  const subtotal = staticInvoiceItems.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    const unitPrice = parseFloat(item.unitPrice || '0');
    return sum + quantity * unitPrice;
  }, 0);

  const totalTax = staticInvoiceItems.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    const unitPrice = parseFloat(item.unitPrice || '0');
    const taxRate = getTaxPercent(item.tax) / 100;
    return sum + quantity * unitPrice * taxRate;
  }, 0);

  const totalAmount = subtotal + totalTax;

  // Convert calculated total to smallest unit for proper display
  // Get currency config to determine decimals
  const currencySymbol =
    dbInvoiceData.currency || staticInvoiceData.currency || 'USD';
  const currencyConfig = getCurrencyConfig(currencySymbol, network);
  const decimals = currencyConfig?.decimals || 2;

  // Convert to smallest unit (e.g., cents for USD, wei for ETH)
  const totalAmountInSmallestUnit = Math.round(
    totalAmount * Math.pow(10, decimals),
  ).toString();

  return (
    <div className="relative overflow-hidden">
      {/* Subtle animated gradient background */}
      <WelcomeGradient />

      <div className="relative z-10 bg-white/95 border border-[#101010]/10 overflow-hidden backdrop-blur-sm">
        {/* Header - Mobile responsive */}
        <div className="bg-[#F7F7F2]/90 px-4 sm:px-6 py-4 sm:py-6 border-b border-[#101010]/10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-[#101010] tracking-[-0.01em]">
                Invoice{' '}
                {staticInvoiceData.invoiceNumber
                  ? `#${staticInvoiceData.invoiceNumber}`
                  : ''}
              </h1>
            </div>
            <div className="text-left sm:text-right space-y-1">
              {staticInvoiceData.issueDate && (
                <p className="text-[13px] text-[#101010]/60">
                  Issued:{' '}
                  {new Date(staticInvoiceData.issueDate).toLocaleDateString()}
                </p>
              )}
              {staticInvoiceData.dueDate && (
                <p className="text-[13px] font-medium text-[#101010]/80">
                  Due:{' '}
                  {new Date(staticInvoiceData.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Seller/Buyer Info - Mobile responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="space-y-1">
              <h3 className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
                From
              </h3>
              <p className="font-medium text-[15px] text-[#101010]">
                {sellerName}
              </p>
              {sellerEmail && (
                <p className="text-[13px] text-[#101010]/60">{sellerEmail}</p>
              )}
              {sellerAddress && (
                <p className="text-[13px] text-[#101010]/60">{sellerAddress}</p>
              )}
              {(sellerCity || sellerPostalCode) && (
                <p className="text-[13px] text-[#101010]/60">
                  {sellerCity}
                  {sellerCity && sellerPostalCode && ', '}
                  {sellerPostalCode}
                </p>
              )}
              {sellerCountry && (
                <p className="text-[13px] text-[#101010]/60">{sellerCountry}</p>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
                To
              </h3>
              <p className="font-medium text-[15px] text-[#101010]">
                {buyerName}
              </p>
              {buyerEmail && (
                <p className="text-[13px] text-[#101010]/60">{buyerEmail}</p>
              )}
              {buyerAddress && (
                <p className="text-[13px] text-[#101010]/60">{buyerAddress}</p>
              )}
              {(buyerCity || buyerPostalCode) && (
                <p className="text-[13px] text-[#101010]/60">
                  {buyerCity}
                  {buyerCity && buyerPostalCode && ', '}
                  {buyerPostalCode}
                </p>
              )}
              {buyerCountry && (
                <p className="text-[13px] text-[#101010]/60">{buyerCountry}</p>
              )}
            </div>
          </div>

          {/* Items - Mobile card layout, Desktop table */}
          <div className="mb-6 sm:mb-8">
            <h3 className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-4">
              Invoice Details
            </h3>

            {/* Mobile: Card layout */}
            <div className="sm:hidden space-y-3">
              {staticInvoiceItems.map(
                (item: ParsedInvoiceItem, index: number) => (
                  <div key={index} className="bg-[#F7F7F2] p-4 space-y-2">
                    <p className="font-medium text-[14px] text-[#101010]">
                      {item.name || 'Item'}
                    </p>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#101010]/60">
                        {item.quantity || 1} ×{' '}
                        {parseFloat(item.unitPrice || '0').toLocaleString(
                          'en-US',
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}{' '}
                        {dbInvoiceData.currency || currencySymbol}
                      </span>
                      <span className="font-medium text-[#101010] tabular-nums">
                        {calculateItemTotal(item).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{' '}
                        {dbInvoiceData.currency || currencySymbol}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>

            {/* Desktop: Table layout */}
            <div className="hidden sm:block border border-[#101010]/10 overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-[#F7F7F2]">
                  <tr>
                    <th className="px-4 py-3 text-left uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                      Description
                    </th>
                    <th className="px-4 py-3 text-right uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-right uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 text-right uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#101010]/10">
                  {staticInvoiceItems.map(
                    (item: ParsedInvoiceItem, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-4 text-[14px] text-[#101010]">
                          {item.name || 'Item'}
                        </td>
                        <td className="px-4 py-4 text-[14px] text-right text-[#101010]/60 tabular-nums">
                          {item.quantity || 1}
                        </td>
                        <td className="px-4 py-4 text-[14px] text-right text-[#101010]/60 tabular-nums">
                          {parseFloat(item.unitPrice || '0').toLocaleString(
                            'en-US',
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}{' '}
                          {dbInvoiceData.currency || currencySymbol}
                        </td>
                        <td className="px-4 py-4 text-[14px] text-right font-medium text-[#101010] tabular-nums">
                          {calculateItemTotal(item).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{' '}
                          {dbInvoiceData.currency || currencySymbol}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals - Mobile responsive */}
          <div className="flex justify-end mb-6 sm:mb-8">
            <div className="w-full sm:w-80 space-y-2">
              <div className="flex justify-between py-2 text-[13px]">
                <span className="text-[#101010]/60">Subtotal</span>
                <span className="text-[#101010] tabular-nums">
                  {subtotal.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  {dbInvoiceData.currency || currencySymbol}
                </span>
              </div>
              {totalTax > 0 && (
                <div className="flex justify-between py-2 text-[13px]">
                  <span className="text-[#101010]/60">Tax</span>
                  <span className="text-[#101010] tabular-nums">
                    {totalTax.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    {dbInvoiceData.currency || currencySymbol}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-3 border-t border-[#101010]/10">
                <span className="text-[15px] font-semibold text-[#101010]">
                  Total
                </span>
                <span className="text-[18px] font-semibold text-[#101010] tabular-nums">
                  {formatDisplayCurrency(
                    totalAmountInSmallestUnit,
                    dbInvoiceData.currency,
                    network,
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          {(staticInvoiceData.note || staticInvoiceData.terms) && (
            <div className="space-y-4 pt-4 sm:pt-6 border-t border-[#101010]/10">
              {staticInvoiceData.note && (
                <div>
                  <h4 className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
                    Notes
                  </h4>
                  <p className="text-[13px] text-[#101010]/80 whitespace-pre-wrap">
                    {staticInvoiceData.note}
                  </p>
                </div>
              )}
              {staticInvoiceData.terms && (
                <div>
                  <h4 className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
                    Terms & Conditions
                  </h4>
                  <p className="text-[13px] text-[#101010]/80 whitespace-pre-wrap">
                    {staticInvoiceData.terms}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Attachments Section - shows documents attached via AI email or manually */}
          <div className="pt-4 sm:pt-6 border-t border-[#101010]/10">
            <InvoiceAttachments invoiceId={dbInvoiceData.id} />
          </div>

          {/* Payment Info Section (External View Only) - only show if payment info exists */}
          {isExternalView &&
            (() => {
              const paymentType = staticInvoiceData.paymentType || 'crypto';
              const hasPaymentAddress =
                !!(staticInvoiceData as any)?.paymentAddress ||
                !!(staticInvoiceData as any)?.payment?.address;
              const hasBankDetails = !!(
                staticInvoiceData.bankDetails &&
                Object.keys(staticInvoiceData.bankDetails).length > 0
              );
              const hasPaymentInfo =
                (paymentType === 'crypto' && hasPaymentAddress) ||
                (paymentType === 'fiat' && hasBankDetails);

              if (!hasPaymentInfo) return null;

              return (
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[#101010]/10">
                  <h3 className="text-[15px] font-semibold mb-4 text-[#101010]">
                    Payment Information
                  </h3>
                  <ExternalPaymentInfo
                    staticInvoiceData={staticInvoiceData}
                    dbInvoiceData={dbInvoiceData}
                    requestNetworkId={requestNetworkId}
                  />
                </div>
              );
            })()}

          {/* Processing Message if not external (and maybe if not paid?) */}
          {!isExternalView && dbInvoiceData.status !== 'paid' && (
            <div className="mt-6 sm:mt-8">
              <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/20 p-4">
                <p className="text-[13px] text-[#101010]/80">
                  This invoice is being processed. Full details and payment
                  options will be available once processing is complete.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
StaticInvoiceDisplay.displayName = 'StaticInvoiceDisplay'; // Add display name

// Sub-component for fallback error display
const InvoiceErrorFallback: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <p>Error: Could not load invoice details.</p>
    </div>
  );
};
InvoiceErrorFallback.displayName = 'InvoiceErrorFallback'; // Add display name

export function InvoiceWrapper({
  requestId,
  requestNetworkId,
  walletPrivateKey,
  dbInvoiceData,
  parsedInvoiceDetails,
  parsingError,
  isExternalView = false,
  sellerCryptoAddress,
  sellerFundingSource,
}: InvoiceWrapperProps) {
  console.log('0xHypr', 'InvoiceWrapper (Simplified) - Rendering:', {
    requestId,
    requestNetworkId,
    walletPrivateKey,
    dbInvoiceData,
    parsedInvoiceDetails,
    parsingError,
    isExternalView,
  });

  let InvoiceComponent: React.ComponentType<any>;
  let componentProps: any = {
    requestId,
    requestNetworkId,
    dbInvoiceData,
    parsedInvoiceDetails,
    parsingError,
    isExternalView,
  };

  if (walletPrivateKey) {
    // Logged-in user view
    InvoiceComponent = InvoiceClient;
    componentProps.walletPrivateKey = walletPrivateKey;
  } else if (dbInvoiceData) {
    // External view (now simplified)
    // For external view, we now directly render the static display
    // as there's no token/decryption key to handle.
    console.log(
      '0xHypr',
      'InvoiceWrapper - Rendering StaticInvoiceDisplay (External/Simplified)',
    );
    return (
      <StaticInvoiceDisplay
        dbInvoiceData={dbInvoiceData}
        parsedInvoiceDetails={parsedInvoiceDetails}
        parsingError={parsingError}
        isExternalView={true} // Explicitly set for static display
        requestNetworkId={requestNetworkId}
      />
    );
  } else {
    // If no wallet key and no DB data, it's an error
    console.log(
      '0xHypr',
      'InvoiceWrapper - No data available, rendering error fallback',
    );
    return <InvoiceErrorFallback />;
  }

  // Render the chosen component (InvoiceClient for logged-in view)
  return <InvoiceComponent {...componentProps} />;
}

InvoiceWrapper.displayName = 'InvoiceWrapper';
InvoiceWrapper.displayName = 'InvoiceWrapper';
