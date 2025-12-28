import React, { useState } from 'react';
import { UserFundingSource } from '@/db/schema';
import { Copy, Check, DollarSign, Euro, Info } from 'lucide-react';

interface FiatPaymentDetailsProps {
  fundingSource: UserFundingSource | null;
  invoiceNumber?: string | null;
  invoiceBankDetails?: {
    accountHolder?: string;
    iban?: string;
    bic?: string;
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
  } | null;
}

function CopyButton({ value }: { value: string | null | undefined }) {
  const [copied, setCopied] = useState(false);

  if (!value) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1 rounded transition-colors hover:bg-[#101010]/5"
    >
      {copied ? (
        <Check className="h-3 w-3 text-green-600" />
      ) : (
        <Copy className="h-3 w-3 text-[#101010]/40" />
      )}
    </button>
  );
}

export const FiatPaymentDetails: React.FC<FiatPaymentDetailsProps> = ({
  fundingSource,
  invoiceNumber,
  invoiceBankDetails,
}) => {
  // Extract bank details from invoice or funding source
  let accountHolder: string | undefined;
  let iban: string | undefined;
  let bic: string | undefined;
  let bankName: string | undefined;
  let accountNumber: string | undefined;
  let routingNumber: string | undefined;

  if (invoiceBankDetails) {
    accountHolder = invoiceBankDetails.accountHolder;
    iban = invoiceBankDetails.iban;
    bic = invoiceBankDetails.bic;
    bankName = invoiceBankDetails.bankName;
    accountNumber = invoiceBankDetails.accountNumber;
    routingNumber = invoiceBankDetails.routingNumber;
  } else if (fundingSource) {
    accountHolder = fundingSource.sourceBankBeneficiaryName ?? undefined;
    iban = fundingSource.sourceIban ?? undefined;
    bic = fundingSource.sourceBicSwift ?? undefined;
    bankName = fundingSource.sourceBankName ?? undefined;
    accountNumber = fundingSource.sourceAccountNumber ?? undefined;
    routingNumber = fundingSource.sourceRoutingNumber ?? undefined;
  }

  // Determine payment type: US ACH or SEPA/IBAN
  const hasIban = iban && iban.trim() !== '';
  const hasUsAch =
    (accountNumber && accountNumber.trim() !== '') ||
    (routingNumber && routingNumber.trim() !== '');

  // No valid payment details
  if (!hasIban && !hasUsAch) {
    return (
      <p className="text-sm text-gray-500">
        Bank details not provided by seller.
      </p>
    );
  }

  const isAch = hasUsAch && !hasIban;

  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white border border-[#101010]/10 text-[#1B29FF]">
          {isAch ? (
            <DollarSign className="h-4 w-4" />
          ) : (
            <Euro className="h-4 w-4" />
          )}
        </span>
        <div>
          <p className="text-[15px] font-semibold tracking-[-0.01em] text-[#101010]">
            {isAch ? 'US ACH & Wire' : 'SEPA / IBAN'}
          </p>
          <p className="text-[12px] text-[#101010]/60">
            {isAch
              ? 'Domestic USD transfers'
              : 'Eurozone & international wires'}
          </p>
        </div>
      </div>

      {/* Currency info */}
      <div className="p-3 rounded-md bg-white/60 border border-[#101010]/5 mb-4">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#101010]/40" />
          <div className="text-[11px] leading-relaxed text-[#101010]/60">
            <span className="font-semibold text-[#101010]">
              Source currency:
            </span>{' '}
            {isAch ? 'USD' : 'EUR'}
          </div>
        </div>
      </div>

      {/* Bank details */}
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] text-[#101010]/80">
        {bankName && (
          <div>
            <dt className="uppercase tracking-[0.16em] text-[10px] mb-1 text-[#101010]/45">
              Bank name
            </dt>
            <dd className="text-[14px] font-medium text-[#101010]">
              {bankName}
            </dd>
          </div>
        )}

        {isAch ? (
          <>
            {routingNumber && (
              <div>
                <dt className="uppercase tracking-[0.16em] text-[10px] mb-1 text-[#101010]/45">
                  Routing number
                </dt>
                <dd className="text-[14px] font-medium text-[#101010] flex items-center">
                  {routingNumber}
                  <CopyButton value={routingNumber} />
                </dd>
              </div>
            )}
            {accountNumber && (
              <div>
                <dt className="uppercase tracking-[0.16em] text-[10px] mb-1 text-[#101010]/45">
                  Account number
                </dt>
                <dd className="text-[14px] font-medium text-[#101010] flex items-center">
                  {accountNumber}
                  <CopyButton value={accountNumber} />
                </dd>
              </div>
            )}
          </>
        ) : (
          <>
            {iban && (
              <div>
                <dt className="uppercase tracking-[0.16em] text-[10px] mb-1 text-[#101010]/45">
                  IBAN
                </dt>
                <dd className="text-[14px] font-medium text-[#101010] flex items-center">
                  {iban}
                  <CopyButton value={iban} />
                </dd>
              </div>
            )}
            {bic && (
              <div>
                <dt className="uppercase tracking-[0.16em] text-[10px] mb-1 text-[#101010]/45">
                  BIC / SWIFT
                </dt>
                <dd className="text-[14px] font-medium text-[#101010] flex items-center">
                  {bic}
                  <CopyButton value={bic} />
                </dd>
              </div>
            )}
          </>
        )}

        {accountHolder && (
          <div>
            <dt className="uppercase tracking-[0.16em] text-[10px] mb-1 text-[#101010]/45">
              Beneficiary
            </dt>
            <dd className="text-[14px] font-medium text-[#101010]">
              {accountHolder}
            </dd>
          </div>
        )}
      </dl>

      {/* Invoice reference */}
      {invoiceNumber && (
        <div className="mt-4 pt-4 border-t border-[#101010]/10">
          <p className="text-[12px] text-[#101010]/60">
            Please include{' '}
            <span className="font-semibold text-[#101010]">
              Invoice #{invoiceNumber}
            </span>{' '}
            in your payment reference.
          </p>
        </div>
      )}
    </div>
  );
};

FiatPaymentDetails.displayName = 'FiatPaymentDetails';
