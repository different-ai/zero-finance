'use client';

import {
  DollarSign,
  Euro,
  Info,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

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
  destinationCurrency?: string | null;
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

  // SEPA/IBAN accounts route through Bridge
  if (account.sourceAccountType === 'iban') {
    return 'Bridge Building Sp.z.o.o.';
  }

  // US ACH shows user's name
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

function AccountCard({
  account,
  userData,
}: {
  account: VirtualAccount;
  userData?: UserData | null;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isAch = account.sourceAccountType === 'us_ach';
  const isFullAccount = account.accountTier === 'full';

  const hasAdvancedDetails =
    account.destinationAddress ||
    account.destinationBankName ||
    account.destinationCurrency;

  return (
    <section className="rounded-[14px] border border-[#101010]/10 bg-[#F7F7F2] p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 text-[#101010]">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white border border-[#101010]/10 text-[#1B29FF]">
            {isAch ? (
              <DollarSign className="h-4 w-4" />
            ) : (
              <Euro className="h-4 w-4" />
            )}
          </span>
          <div>
            <p className="text-[15px] font-semibold tracking-[-0.01em]">
              {isAch ? 'US ACH & wire' : 'SEPA / IBAN'}
            </p>
            <p className="text-[12px] text-[#101010]/60">
              {isAch
                ? 'Domestic USD transfers'
                : 'Eurozone & international wires'}
            </p>
          </div>
        </div>
        {account.status && (
          <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-green-700">
            {account.status}
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="p-3 bg-white/60 border border-[#101010]/5 rounded-md">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-[#101010]/40 mt-0.5 flex-shrink-0" />
            <div className="text-[11px] text-[#101010]/60 leading-relaxed">
              <span className="font-semibold text-[#101010]">
                Source currency:
              </span>{' '}
              {account.sourceCurrency?.toUpperCase() || (isAch ? 'USD' : 'EUR')}
            </div>
          </div>
        </div>
        {!isAch && isFullAccount && (
          <div className="p-3 bg-blue-50/80 border border-blue-200/50 rounded-md">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-[11px] text-blue-900/80 leading-relaxed">
                <span className="font-semibold text-blue-900">
                  Email receipts:
                </span>{' '}
                You'll receive transfer confirmations from Bridge (our payment
                processor). This is normal.
              </div>
            </div>
          </div>
        )}
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] text-[#101010]/80">
        <div>
          <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
            Bank name
          </dt>
          <dd className="text-[14px] font-medium text-[#101010]">
            {account.sourceBankName}
          </dd>
        </div>

        {isAch ? (
          <>
            <div>
              <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                Routing number
              </dt>
              <dd className="text-[14px] font-medium text-[#101010] flex items-center">
                {account.sourceRoutingNumber}
                <CopyButton value={account.sourceRoutingNumber} />
              </dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                Account number
              </dt>
              <dd className="text-[14px] font-medium text-[#101010] flex items-center">
                {account.sourceAccountNumber}
                <CopyButton value={account.sourceAccountNumber} />
              </dd>
            </div>
          </>
        ) : (
          <>
            <div>
              <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                IBAN
              </dt>
              <dd className="text-[14px] font-medium text-[#101010] flex items-center">
                {account.sourceIban}
                <CopyButton value={account.sourceIban} />
              </dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
                BIC / SWIFT
              </dt>
              <dd className="text-[14px] font-medium text-[#101010] flex items-center">
                {account.sourceBicSwift}
                <CopyButton value={account.sourceBicSwift} />
              </dd>
            </div>
          </>
        )}

        <div>
          <dt className="uppercase tracking-[0.16em] text-[10px] text-[#101010]/45 mb-1">
            Beneficiary
          </dt>
          <dd className="text-[14px] font-medium text-[#101010]">
            {getRecipientName(account, userData)}
          </dd>
        </div>
      </dl>

      {hasAdvancedDetails && (
        <div className="mt-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[13px] text-[#101010]/60 hover:text-[#1B29FF] transition-colors flex items-center gap-1"
          >
            <ChevronRight
              className={cn(
                'h-4 w-4 transition-transform',
                showAdvanced && 'rotate-90',
              )}
            />
            Technical details
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 bg-[#101010]/5 border border-[#101010]/10 rounded-md space-y-3">
              <div className="pb-3 mb-3 border-b border-[#101010]/10">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] text-[#101010]/50 uppercase tracking-[0.14em] min-w-[80px]">
                      Platform
                    </span>
                    <span className="text-[11px] text-[#101010]/70">
                      Different AI Inc. (0 Finance)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] text-[#101010]/50 uppercase tracking-[0.14em] min-w-[80px]">
                      Payments
                    </span>
                    <span className="text-[11px] text-[#101010]/70">
                      Bridge Building Sp. Z.o.o. (via Fractal)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] text-[#101010]/50 uppercase tracking-[0.14em] min-w-[80px]">
                      Custody
                    </span>
                    <span className="text-[11px] text-[#101010]/70">
                      Self-custodied (you own the funds)
                    </span>
                  </div>
                </div>
                <p className="mt-3 pt-3 border-t border-[#101010]/10 text-[10px] text-[#101010]/50 leading-relaxed">
                  Email receipts will show "Bridge" as the payment processor.
                  This is normal.
                </p>
              </div>
              {account.destinationCurrency && (
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#101010]/60 uppercase tracking-[0.14em] text-[10px]">
                    Destination currency
                  </span>
                  <span className="text-[#101010]/80 font-medium">
                    {account.destinationCurrency.toUpperCase()}
                  </span>
                </div>
              )}
              {account.destinationAddress && (
                <div className="space-y-1">
                  <dt className="text-[#101010]/60 uppercase tracking-[0.14em] text-[10px]">
                    Settlement address
                  </dt>
                  <dd className="text-[12px] text-[#101010]/80 font-mono break-all flex items-start gap-2">
                    <span className="flex-1">{account.destinationAddress}</span>
                    <CopyButton value={account.destinationAddress} />
                  </dd>
                </div>
              )}
              {account.destinationBankName && (
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#101010]/60 uppercase tracking-[0.14em] text-[10px]">
                    Destination bank
                  </span>
                  <span className="text-[#101010]/80 font-medium">
                    {account.destinationBankName}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export function BankingInstructionsDisplay({
  accounts,
  userData,
}: Omit<BankingInstructionsDisplayProps, 'hasCompletedKyc'>) {
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
                  Accept up to $10,000 total. Funds arrive directly to your
                  account.
                </p>
                <p>
                  Complete verification to remove limits and enable transfers.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {starterAchAccount && (
              <AccountCard account={starterAchAccount} userData={userData} />
            )}
            {starterIbanAccount && (
              <AccountCard account={starterIbanAccount} userData={userData} />
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
              <AccountCard account={fullAchAccount} userData={userData} />
            )}
            {fullIbanAccount && (
              <AccountCard account={fullIbanAccount} userData={userData} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
