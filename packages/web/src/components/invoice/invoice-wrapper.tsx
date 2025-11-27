'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { UserFundingSource } from '@/db/schema'; // Added
import { FiatPaymentDetails } from './fiat-payment-details';
import { CryptoManualPaymentDetails } from './crypto-manual-payment-details';
import { RequestNetworkPayButton } from './request-network-pay-button';
import { usePrivy } from '@privy-io/react-auth'; // Import Privy hook
import { Wallet } from 'lucide-react'; // Import Wallet icon
import { formatDisplayCurrency } from '@/lib/utils'; // Import the new utility
import { getCurrencyConfig } from '@/lib/currencies'; // Import currency config

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

  // Scenario 1 & 2: On-chain Payments (Crypto OR Fiat - Button handles logic)
  if (isOnChain) {
    // Check if user is authenticated
    if (authenticated) {
      // User is logged in, show the pay/declare button
      // The button component will determine whether to pay or declare
      return <RequestNetworkPayButton requestNetworkId={requestNetworkId} />;
    } else {
      // User is not logged in, show connect button
      return (
        <Button onClick={login} disabled={isLoginDisabled}>
          <Wallet className="mr-2 h-4 w-4" />
          {isLoginDisabled ? 'Loading...' : 'Sign in to Pay/Declare'}
        </Button>
      );
    }
  }

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

    if (!paymentAddress) {
      return (
        <p className="text-sm text-orange-600">
          Payment address not specified for this invoice. Please contact the
          seller.
        </p>
      );
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
    if (!bankDetails || Object.keys(bankDetails).length === 0) {
      return (
        <p className="text-sm text-orange-600">
          Bank details not specified for this invoice. Please contact the
          seller.
        </p>
      );
    }

    return (
      <FiatPaymentDetails
        fundingSource={null} // Don't use seller funding source
        invoiceNumber={invoiceNumber}
        invoiceBankDetails={bankDetails}
      />
    );
  }

  // Fallback or should not happen if paymentType is always crypto/fiat
  return (
    <p className="text-sm text-gray-500">
      Payment details configuration error.
    </p>
  );
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
    <div className="bg-white shadow-xl rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 px-8 py-6 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
              Invoice{' '}
              {staticInvoiceData.invoiceNumber
                ? `#${staticInvoiceData.invoiceNumber}`
                : ''}
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              ID: {dbInvoiceData.id.slice(-8).toUpperCase()}
            </p>
          </div>
          <div className="text-right">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                dbInvoiceData.status === 'paid'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  dbInvoiceData.status === 'paid'
                    ? 'bg-green-600'
                    : 'bg-yellow-600'
                }`}
              />
              {dbInvoiceData.status === 'paid' ? 'Paid' : 'Pending Payment'}
            </div>
            {staticInvoiceData.issueDate && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                Issued:{' '}
                {new Date(staticInvoiceData.issueDate).toLocaleDateString()}
              </p>
            )}
            {staticInvoiceData.dueDate && (
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Due: {new Date(staticInvoiceData.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Seller/Buyer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
              From
            </h3>
            <p className="font-semibold text-lg text-neutral-900 dark:text-white">
              {sellerName}
            </p>
            {sellerEmail && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {sellerEmail}
              </p>
            )}
            {sellerAddress && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {sellerAddress}
              </p>
            )}
            {(sellerCity || sellerPostalCode) && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {sellerCity}
                {sellerCity && sellerPostalCode && ', '}
                {sellerPostalCode}
              </p>
            )}
            {sellerCountry && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {sellerCountry}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
              To
            </h3>
            <p className="font-semibold text-lg text-neutral-900 dark:text-white">
              {buyerName}
            </p>
            {buyerEmail && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {buyerEmail}
              </p>
            )}
            {buyerAddress && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {buyerAddress}
              </p>
            )}
            {(buyerCity || buyerPostalCode) && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {buyerCity}
                {buyerCity && buyerPostalCode && ', '}
                {buyerPostalCode}
              </p>
            )}
            {buyerCountry && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {buyerCountry}
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
            Invoice Details
          </h3>
          <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Tax
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
                {staticInvoiceItems.map(
                  (item: ParsedInvoiceItem, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-neutral-100">
                        {item.name || 'Item'}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-neutral-600 dark:text-neutral-400">
                        {item.quantity || 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-neutral-600 dark:text-neutral-400">
                        {formatDisplayCurrency(
                          item.unitPrice || '0',
                          dbInvoiceData.currency,
                          network,
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-neutral-600 dark:text-neutral-400">
                        {item.tax && typeof item.tax === 'object'
                          ? item.tax.amount
                          : item.tax
                            ? item.tax + '%'
                            : '0%'}
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-medium text-neutral-900 dark:text-neutral-100">
                        {formatDisplayCurrency(
                          calculateItemTotal(item).toFixed(2),
                          dbInvoiceData.currency,
                          network,
                        )}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80 space-y-2">
            <div className="flex justify-between py-2 text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">
                Subtotal
              </span>
              <span className="text-neutral-900 dark:text-neutral-100">
                {formatDisplayCurrency(
                  subtotal.toFixed(2),
                  dbInvoiceData.currency,
                  network,
                )}
              </span>
            </div>
            {totalTax > 0 && (
              <div className="flex justify-between py-2 text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Tax
                </span>
                <span className="text-neutral-900 dark:text-neutral-100">
                  {formatDisplayCurrency(
                    totalTax.toFixed(2),
                    dbInvoiceData.currency,
                    network,
                  )}
                </span>
              </div>
            )}
            <div className="flex justify-between py-3 text-lg font-semibold border-t border-neutral-200 dark:border-neutral-700">
              <span className="text-neutral-900 dark:text-neutral-100">
                Total Amount
              </span>
              <span className="text-neutral-900 dark:text-neutral-100">
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
          <div className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            {staticInvoiceData.note && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                  Notes
                </h4>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                  {staticInvoiceData.note}
                </p>
              </div>
            )}
            {staticInvoiceData.terms && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                  Terms & Conditions
                </h4>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                  {staticInvoiceData.terms}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Payment Info Section (External View Only) */}
        {isExternalView && (
          <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">
              Payment Information
            </h3>
            <ExternalPaymentInfo
              staticInvoiceData={staticInvoiceData}
              dbInvoiceData={dbInvoiceData}
              requestNetworkId={requestNetworkId}
            />
          </div>
        )}

        {/* Processing Message if not external (and maybe if not paid?) */}
        {!isExternalView && dbInvoiceData.status !== 'paid' && (
          <div className="mt-8">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                This invoice is being processed. Full details and payment
                options will be available once processing is complete.
              </p>
            </div>
          </div>
        )}
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
