'use client';

import { DollarSign, Euro, Info, Copy, Check } from 'lucide-react';
import { useState } from 'react';

type VirtualAccount = {
  id: string;
  accountTier: 'starter' | 'full' | null;
  sourceAccountType: 'us_ach' | 'iban' | 'uk_details' | 'other';
  sourceCurrency: string | null;
  sourceBankName: string | null;
  sourceRoutingNumber: string | null;
  sourceAccountNumber: string | null;
  sourceIban: string | null;
  sourceBicSwift: string | null;
  sourceBankBeneficiaryName: string | null;
  destinationAddress?: string | null;
  destinationBankName?: string | null;
  status?: string | null;
};

type UserData = {
  firstName?: string | null;
  lastName?: string | null;
  companyName?: string | null;
};

interface BankingInstructionsDisplayProps {
  accounts: VirtualAccount[];
  hasCompletedKyc: boolean;
  userData?: UserData | null;
}

function getRecipientName(
  account: VirtualAccount,
  userData?: UserData | null,
): string {
  if (account.sourceBankBeneficiaryName) {
    return account.sourceBankBeneficiaryName;
  }
  if (userData?.companyName) {
    return userData.companyName;
  }
  if (userData?.firstName && userData?.lastName) {
    return `${userData.firstName} ${userData.lastName}`;
  }
  return 'Your account';
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
      className="ml-2 p-1 rounded hover:bg-[#101010]/5 transition-colors"
    >
      {copied ? (
        <Check className="h-3 w-3 text-green-600" />
      ) : (
        <Copy className="h-3 w-3 text-[#101010]/40" />
      )}
    </button>
  );
}

export function BankingInstructionsDisplay({
  accounts,
  userData,
}: BankingInstructionsDisplayProps) {
  const starterAccounts = accounts.filter(
    (acc) => acc.accountTier === 'starter',
  );
  const fullAccounts = accounts.filter((acc) => acc.accountTier === 'full');

  const starterAchAccount = starterAccounts.find(
    (acc) => acc.sourceAccountType === 'us_ach',
  );
  const starterIbanAccount = starterAccounts.find(
    (acc) => acc.sourceAccountType === 'iban',
  );

  const fullAchAccount = fullAccounts.find(
    (acc) => acc.sourceAccountType === 'us_ach',
  );
  const fullIbanAccount = fullAccounts.find(
    (acc) => acc.sourceAccountType === 'iban',
  );

  const hasStarter = starterAccounts.length > 0;
  const hasFull = fullAccounts.length > 0;

  return (
    <div className="space-y-6 py-6">
      {hasStarter && (
        <div>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-[#101010]">
                Instant access accounts
              </h3>
              <span className="inline-flex items-center rounded-full bg-[#1B29FF]/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#1B29FF]">
                Starter
              </span>
            </div>
            <div className="flex items-start gap-2 rounded-[10px] border border-[#1B29FF]/20 bg-[#1B29FF]/5 px-3 py-2.5">
              <Info className="h-4 w-4 text-[#1B29FF] mt-0.5 flex-shrink-0" />
              <div className="text-[12px] text-[#101010]/70 leading-relaxed">
                <p className="mb-1">
                  <span className="font-semibold text-[#101010]">
                    Deposits only:
                  </span>{' '}
                  Accept up to $10,000 total.
                </p>
                <p>
                  Complete business verification to unlock unlimited deposits
                  and bank withdrawals.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {starterAchAccount && (
              <section className="rounded-[14px] border border-[#101010]/10 bg-[#F7F7F2] p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 text-[#101010]">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white border border-[#101010]/10 text-[#1B29FF]">
                      <DollarSign className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold tracking-[-0.01em]">
                        US ACH & wire
                      </p>
                      <p className="text-[12px] text-[#101010]/60">
                        Domestic USD transfers
                      </p>
                    </div>
                  </div>
                  {starterAchAccount.status && (
                    <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-green-700">
                      {starterAchAccount.status}
                    </span>
                  )}
                </div>

                <div className="mb-4 p-3 bg-white/60 border border-[#101010]/5 rounded-md">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-[#101010]/40 mt-0.5 flex-shrink-0" />
                    <div className="text-[11px] text-[#101010]/60 leading-relaxed">
                      <span className="font-semibold text-[#101010]">
                        Currency:
                      </span>{' '}
                      {starterAchAccount.sourceCurrency?.toUpperCase() || 'USD'}
                    </div>
                  </div>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] text-[#101010]/80">
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                      Bank name
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010] flex items-center">
                      {starterAchAccount.sourceBankName}
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                      Routing number
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010] flex items-center">
                      {starterAchAccount.sourceRoutingNumber}
                      <CopyButton
                        value={starterAchAccount.sourceRoutingNumber}
                      />
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                      Account number
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010] flex items-center">
                      {starterAchAccount.sourceAccountNumber}
                      <CopyButton
                        value={starterAchAccount.sourceAccountNumber}
                      />
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                      Beneficiary
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010]">
                      {getRecipientName(starterAchAccount, userData)}
                    </dd>
                  </div>
                  {starterAchAccount.destinationAddress && (
                    <div className="sm:col-span-2">
                      <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                        Destination address
                      </dt>
                      <dd className="text-[14px] font-medium text-[#101010] flex items-center font-mono">
                        {starterAchAccount.destinationAddress}
                        <CopyButton
                          value={starterAchAccount.destinationAddress}
                        />
                      </dd>
                    </div>
                  )}
                  {starterAchAccount.destinationBankName && (
                    <div className="sm:col-span-2">
                      <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                        Destination bank
                      </dt>
                      <dd className="text-[14px] font-medium text-[#101010]">
                        {starterAchAccount.destinationBankName}
                      </dd>
                    </div>
                  )}
                </dl>
              </section>
            )}

            {starterIbanAccount && (
              <section className="rounded-[14px] border border-[#101010]/10 bg-[#F7F7F2] p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 text-[#101010]">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white border border-[#101010]/10 text-[#1B29FF]">
                      <Euro className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold tracking-[-0.01em]">
                        SEPA / IBAN
                      </p>
                      <p className="text-[12px] text-[#101010]/60">
                        Eurozone & international wires
                      </p>
                    </div>
                  </div>
                  {starterIbanAccount.status && (
                    <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-green-700">
                      {starterIbanAccount.status}
                    </span>
                  )}
                </div>

                <div className="mb-4 p-3 bg-white/60 border border-[#101010]/5 rounded-md">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-[#101010]/40 mt-0.5 flex-shrink-0" />
                    <div className="text-[11px] text-[#101010]/60 leading-relaxed">
                      <span className="font-semibold text-[#101010]">
                        Currency:
                      </span>{' '}
                      {starterIbanAccount.sourceCurrency?.toUpperCase() ||
                        'EUR'}
                    </div>
                  </div>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] text-[#101010]/80">
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                      Bank name
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010]">
                      {starterIbanAccount.sourceBankName}
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                      IBAN
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010] flex items-center">
                      {starterIbanAccount.sourceIban}
                      <CopyButton value={starterIbanAccount.sourceIban} />
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                      BIC / SWIFT
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010] flex items-center">
                      {starterIbanAccount.sourceBicSwift}
                      <CopyButton value={starterIbanAccount.sourceBicSwift} />
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                      Beneficiary
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010]">
                      {getRecipientName(starterIbanAccount, userData)}
                    </dd>
                  </div>
                  {starterIbanAccount.destinationAddress && (
                    <div className="sm:col-span-2">
                      <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                        Destination address
                      </dt>
                      <dd className="text-[14px] font-medium text-[#101010] flex items-center font-mono">
                        {starterIbanAccount.destinationAddress}
                        <CopyButton
                          value={starterIbanAccount.destinationAddress}
                        />
                      </dd>
                    </div>
                  )}
                  {starterIbanAccount.destinationBankName && (
                    <div className="sm:col-span-2">
                      <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                        Destination bank
                      </dt>
                      <dd className="text-[14px] font-medium text-[#101010]">
                        {starterIbanAccount.destinationBankName}
                      </dd>
                    </div>
                  )}
                </dl>
              </section>
            )}
          </div>
        </div>
      )}

      {hasFull && (
        <div>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-[#101010]">
                Your personal accounts
              </h3>
              <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-green-700">
                Unlimited
              </span>
            </div>
            <p className="text-[12px] text-[#101010]/60">
              No deposit limits. Backed by your verified business.
            </p>
          </div>

          <div className="space-y-4">
            {fullAchAccount && (
              <section className="rounded-[14px] border border-[#101010]/10 bg-[#F7F7F2] p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 text-[#101010]">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white border border-[#101010]/10 text-[#1B29FF]">
                      <DollarSign className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold tracking-[-0.01em]">
                        US ACH & wire
                      </p>
                      <p className="text-[12px] text-[#101010]/60">
                        Domestic USD transfers
                      </p>
                    </div>
                  </div>
                  {fullAchAccount.status && (
                    <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-green-700">
                      {fullAchAccount.status}
                    </span>
                  )}
                </div>

                <div className="mb-4 p-3 bg-white/60 border border-[#101010]/5 rounded-md">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-[#101010]/40 mt-0.5 flex-shrink-0" />
                    <div className="text-[11px] text-[#101010]/60 leading-relaxed">
                      <span className="font-semibold text-[#101010]">
                        Currency:
                      </span>{' '}
                      {fullAchAccount.sourceCurrency?.toUpperCase() || 'USD'}
                    </div>
                  </div>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] text-[#101010]/80">
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                      Bank name
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010]">
                      {fullAchAccount.sourceBankName}
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                      Routing number
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010] flex items-center">
                      {fullAchAccount.sourceRoutingNumber}
                      <CopyButton value={fullAchAccount.sourceRoutingNumber} />
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                      Account number
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010] flex items-center">
                      {fullAchAccount.sourceAccountNumber}
                      <CopyButton value={fullAchAccount.sourceAccountNumber} />
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                      Beneficiary
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010]">
                      {getRecipientName(fullAchAccount, userData)}
                    </dd>
                  </div>
                  {fullAchAccount.destinationAddress && (
                    <div className="sm:col-span-2">
                      <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                        Destination address
                      </dt>
                      <dd className="text-[14px] font-medium text-[#101010] flex items-center font-mono">
                        {fullAchAccount.destinationAddress}
                        <CopyButton value={fullAchAccount.destinationAddress} />
                      </dd>
                    </div>
                  )}
                  {fullAchAccount.destinationBankName && (
                    <div className="sm:col-span-2">
                      <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                        Destination bank
                      </dt>
                      <dd className="text-[14px] font-medium text-[#101010]">
                        {fullAchAccount.destinationBankName}
                      </dd>
                    </div>
                  )}
                </dl>
              </section>
            )}

            {fullIbanAccount && (
              <section className="rounded-[14px] border border-[#101010]/10 bg-[#F7F7F2] p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 text-[#101010]">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white border border-[#101010]/10 text-[#1B29FF]">
                      <Euro className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold tracking-[-0.01em]">
                        SEPA / IBAN
                      </p>
                      <p className="text-[12px] text-[#101010]/60">
                        Eurozone & international wires
                      </p>
                    </div>
                  </div>
                  {fullIbanAccount.status && (
                    <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-green-700">
                      {fullIbanAccount.status}
                    </span>
                  )}
                </div>

                <div className="mb-4 p-3 bg-white/60 border border-[#101010]/5 rounded-md">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-[#101010]/40 mt-0.5 flex-shrink-0" />
                    <div className="text-[11px] text-[#101010]/60 leading-relaxed">
                      <span className="font-semibold text-[#101010]">
                        Currency:
                      </span>{' '}
                      {fullIbanAccount.sourceCurrency?.toUpperCase() || 'EUR'}
                    </div>
                  </div>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] text-[#101010]/80">
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                      Bank name
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010]">
                      {fullIbanAccount.sourceBankName}
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                      IBAN
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010] flex items-center">
                      {fullIbanAccount.sourceIban}
                      <CopyButton value={fullIbanAccount.sourceIban} />
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                      BIC / SWIFT
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010] flex items-center">
                      {fullIbanAccount.sourceBicSwift}
                      <CopyButton value={fullIbanAccount.sourceBicSwift} />
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                      Beneficiary
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010]">
                      {getRecipientName(fullIbanAccount, userData)}
                    </dd>
                  </div>
                  {fullIbanAccount.destinationAddress && (
                    <div className="sm:col-span-2">
                      <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                        Destination address
                      </dt>
                      <dd className="text-[14px] font-medium text-[#101010] flex items-center font-mono">
                        {fullIbanAccount.destinationAddress}
                        <CopyButton
                          value={fullIbanAccount.destinationAddress}
                        />
                      </dd>
                    </div>
                  )}
                  {fullIbanAccount.destinationBankName && (
                    <div className="sm:col-span-2">
                      <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                        Destination bank
                      </dt>
                      <dd className="text-[14px] font-medium text-[#101010]">
                        {fullIbanAccount.destinationBankName}
                      </dd>
                    </div>
                  )}
                </dl>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
