'use client';

import { DollarSign, Euro, Info } from 'lucide-react';

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

export function BankingInstructionsDisplay({
  accounts,
  hasCompletedKyc,
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
                <div className="flex items-center gap-3 mb-4 text-[#101010]">
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
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] text-[#101010]/80">
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45">
                      Bank name
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010]">
                      {starterAchAccount.sourceBankName}
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45">
                      Routing number
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010]">
                      {starterAchAccount.sourceRoutingNumber}
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45">
                      Account number
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010]">
                      {starterAchAccount.sourceAccountNumber}
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45">
                      Beneficiary
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010]">
                      {getRecipientName(starterAchAccount, userData)}
                    </dd>
                  </div>
                </dl>
              </section>
            )}

            {starterIbanAccount && (
              <section className="rounded-[14px] border border-[#101010]/10 bg-[#F7F7F2] p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-4 text-[#101010]">
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
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] text-[#101010]/80">
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45">
                      Bank name
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010]">
                      {starterIbanAccount.sourceBankName}
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45">
                      IBAN
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010]">
                      {starterIbanAccount.sourceIban}
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45">
                      BIC / SWIFT
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010]">
                      {starterIbanAccount.sourceBicSwift}
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45">
                      Beneficiary
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010]">
                      {getRecipientName(starterIbanAccount, userData)}
                    </dd>
                  </div>
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
                <div className="flex items-center gap-3 mb-4 text-[#101010]">
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
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] text-[#101010]/80">
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45">
                      Bank name
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010]">
                      {fullAchAccount.sourceBankName}
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45">
                      Routing number
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010]">
                      {fullAchAccount.sourceRoutingNumber}
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45">
                      Account number
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010]">
                      {fullAchAccount.sourceAccountNumber}
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45">
                      Beneficiary
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010]">
                      {getRecipientName(fullAchAccount, userData)}
                    </dd>
                  </div>
                </dl>
              </section>
            )}

            {fullIbanAccount && (
              <section className="rounded-[14px] border border-[#101010]/10 bg-[#F7F7F2] p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-4 text-[#101010]">
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
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] text-[#101010]/80">
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45">
                      Bank name
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010]">
                      {fullIbanAccount.sourceBankName}
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45">
                      IBAN
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010]">
                      {fullIbanAccount.sourceIban}
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45">
                      BIC / SWIFT
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010]">
                      {fullIbanAccount.sourceBicSwift}
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45">
                      Beneficiary
                    </dt>
                    <dd className="text-[14px] font-medium text-[#101010]">
                      {getRecipientName(fullIbanAccount, userData)}
                    </dd>
                  </div>
                </dl>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
