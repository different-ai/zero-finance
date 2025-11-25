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
import { BimodalCard, useBimodal } from '@/components/ui/bimodal';

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
  // SEPA/IBAN accounts route through Bridge
  if (account.sourceAccountType === 'iban') {
    return 'Bridge Building Sp.z.o.o.';
  }
  if (account.sourceBankBeneficiaryName) {
    return account.sourceBankBeneficiaryName;
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

function CopyButton({
  value,
  isTechnical,
}: {
  value: string | null | undefined;
  isTechnical?: boolean;
}) {
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
      className={cn(
        'ml-2 p-1 rounded transition-colors',
        isTechnical ? 'hover:bg-[#1B29FF]/10' : 'hover:bg-[#101010]/5',
      )}
    >
      {copied ? (
        <Check
          className={cn(
            'h-3 w-3',
            isTechnical ? 'text-[#1B29FF]' : 'text-green-600',
          )}
        />
      ) : (
        <Copy
          className={cn(
            'h-3 w-3',
            isTechnical ? 'text-[#1B29FF]/60' : 'text-[#101010]/40',
          )}
        />
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
  const { isTechnical } = useBimodal();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isAch = account.sourceAccountType === 'us_ach';
  const isFullAccount = account.accountTier === 'full';

  const hasAdvancedDetails =
    account.destinationAddress ||
    account.destinationBankName ||
    account.destinationCurrency;

  return (
    <BimodalCard isTechnical={isTechnical} className="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 text-[#101010]">
          <span
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center',
              isTechnical
                ? 'rounded-sm bg-[#1B29FF]/5 border border-[#1B29FF]/20 text-[#1B29FF]'
                : 'rounded-full bg-white border border-[#101010]/10 text-[#1B29FF]',
            )}
          >
            {isAch ? (
              <DollarSign className="h-4 w-4" />
            ) : (
              <Euro className="h-4 w-4" />
            )}
          </span>
          <div>
            <p
              className={cn(
                'text-[15px] font-semibold tracking-[-0.01em]',
                isTechnical && 'font-mono text-[#1B29FF] uppercase',
              )}
            >
              {isTechnical
                ? isAch
                  ? 'RAIL::US_ACH_WIRE'
                  : 'RAIL::SEPA_IBAN'
                : isAch
                  ? 'US ACH & wire'
                  : 'SEPA / IBAN'}
            </p>
            <p
              className={cn(
                'text-[12px] text-[#101010]/60',
                isTechnical && 'font-mono text-[10px]',
              )}
            >
              {isTechnical
                ? isAch
                  ? 'SETTLEMENT::DOMESTIC_USD'
                  : 'SETTLEMENT::INTL_EUR'
                : isAch
                  ? 'Domestic USD transfers'
                  : 'Eurozone & international wires'}
            </p>
          </div>
        </div>
        {account.status && (
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em]',
              isTechnical
                ? 'bg-[#1B29FF]/10 text-[#1B29FF] font-mono rounded-sm border border-[#1B29FF]/20'
                : 'bg-green-500/10 text-green-700 rounded-full',
            )}
          >
            {account.status}
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div
          className={cn(
            'p-3 rounded-md',
            isTechnical
              ? 'bg-[#1B29FF]/5 border border-[#1B29FF]/10'
              : 'bg-white/60 border border-[#101010]/5',
          )}
        >
          <div className="flex items-start gap-2">
            <Info
              className={cn(
                'h-4 w-4 mt-0.5 flex-shrink-0',
                isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]/40',
              )}
            />
            <div
              className={cn(
                'text-[11px] leading-relaxed',
                isTechnical ? 'font-mono text-[#1B29FF]' : 'text-[#101010]/60',
              )}
            >
              <span
                className={cn(
                  'font-semibold',
                  isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]',
                )}
              >
                {isTechnical ? 'ASSET::' : 'Source currency:'}
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
                You&apos;ll receive transfer confirmations from Bridge (our
                payment processor). This is normal.
              </div>
            </div>
          </div>
        )}
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] text-[#101010]/80">
        <div>
          <dt
            className={cn(
              'uppercase tracking-[0.16em] text-[10px] mb-1',
              isTechnical ? 'font-mono text-[#1B29FF]/70' : 'text-[#101010]/45',
            )}
          >
            {isTechnical ? 'INSTITUTION' : 'Bank name'}
          </dt>
          <dd
            className={cn(
              'text-[14px] font-medium text-[#101010]',
              isTechnical && 'font-mono',
            )}
          >
            {account.sourceBankName}
          </dd>
        </div>

        {isAch ? (
          <>
            <div>
              <dt
                className={cn(
                  'uppercase tracking-[0.16em] text-[10px] mb-1',
                  isTechnical
                    ? 'font-mono text-[#1B29FF]/70'
                    : 'text-[#101010]/45',
                )}
              >
                {isTechnical ? 'ROUTING_NUM' : 'Routing number'}
              </dt>
              <dd
                className={cn(
                  'text-[14px] font-medium text-[#101010] flex items-center',
                  isTechnical && 'font-mono',
                )}
              >
                {account.sourceRoutingNumber}
                <CopyButton
                  value={account.sourceRoutingNumber}
                  isTechnical={isTechnical}
                />
              </dd>
            </div>
            <div>
              <dt
                className={cn(
                  'uppercase tracking-[0.16em] text-[10px] mb-1',
                  isTechnical
                    ? 'font-mono text-[#1B29FF]/70'
                    : 'text-[#101010]/45',
                )}
              >
                {isTechnical ? 'ACCOUNT_ID' : 'Account number'}
              </dt>
              <dd
                className={cn(
                  'text-[14px] font-medium text-[#101010] flex items-center',
                  isTechnical && 'font-mono',
                )}
              >
                {account.sourceAccountNumber}
                <CopyButton
                  value={account.sourceAccountNumber}
                  isTechnical={isTechnical}
                />
              </dd>
            </div>
          </>
        ) : (
          <>
            <div>
              <dt
                className={cn(
                  'uppercase tracking-[0.16em] text-[10px] mb-1',
                  isTechnical
                    ? 'font-mono text-[#1B29FF]/70'
                    : 'text-[#101010]/45',
                )}
              >
                IBAN
              </dt>
              <dd
                className={cn(
                  'text-[14px] font-medium text-[#101010] flex items-center',
                  isTechnical && 'font-mono',
                )}
              >
                {account.sourceIban}
                <CopyButton
                  value={account.sourceIban}
                  isTechnical={isTechnical}
                />
              </dd>
            </div>
            <div>
              <dt
                className={cn(
                  'uppercase tracking-[0.16em] text-[10px] mb-1',
                  isTechnical
                    ? 'font-mono text-[#1B29FF]/70'
                    : 'text-[#101010]/45',
                )}
              >
                {isTechnical ? 'BIC_SWIFT' : 'BIC / SWIFT'}
              </dt>
              <dd
                className={cn(
                  'text-[14px] font-medium text-[#101010] flex items-center',
                  isTechnical && 'font-mono',
                )}
              >
                {account.sourceBicSwift}
                <CopyButton
                  value={account.sourceBicSwift}
                  isTechnical={isTechnical}
                />
              </dd>
            </div>
          </>
        )}

        <div>
          <dt
            className={cn(
              'uppercase tracking-[0.16em] text-[10px] mb-1',
              isTechnical ? 'font-mono text-[#1B29FF]/70' : 'text-[#101010]/45',
            )}
          >
            {isTechnical ? 'BENEFICIARY' : 'Beneficiary'}
          </dt>
          <dd
            className={cn(
              'text-[14px] font-medium text-[#101010]',
              isTechnical && 'font-mono',
            )}
          >
            {getRecipientName(account, userData)}
          </dd>
        </div>
      </dl>

      {hasAdvancedDetails && (
        <div className="mt-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={cn(
              'text-[13px] transition-colors flex items-center gap-1',
              isTechnical
                ? 'font-mono text-[#1B29FF] hover:text-[#1B29FF]/80'
                : 'text-[#101010]/60 hover:text-[#1B29FF]',
            )}
          >
            <ChevronRight
              className={cn(
                'h-4 w-4 transition-transform',
                showAdvanced && 'rotate-90',
              )}
            />
            {isTechnical ? 'STRUCT::DETAILS' : 'Technical details'}
          </button>

          {showAdvanced && (
            <div
              className={cn(
                'mt-3 p-4 rounded-md space-y-3',
                isTechnical
                  ? 'bg-[#1B29FF]/5 border border-[#1B29FF]/10'
                  : 'bg-[#101010]/5 border border-[#101010]/10',
              )}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start text-[12px]">
                  <span
                    className={cn(
                      'uppercase tracking-[0.14em] text-[10px]',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]/70'
                        : 'text-[#101010]/60',
                    )}
                  >
                    {isTechnical ? 'ENTITY' : 'Platform'}
                  </span>
                  <span
                    className={cn(
                      'font-medium text-right',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]'
                        : 'text-[#101010]',
                    )}
                  >
                    Different AI Inc. (0 Finance)
                  </span>
                </div>
                <div className="flex justify-between items-start text-[12px]">
                  <span
                    className={cn(
                      'uppercase tracking-[0.14em] text-[10px]',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]/70'
                        : 'text-[#101010]/60',
                    )}
                  >
                    {isTechnical ? 'PROCESSOR' : 'Payments'}
                  </span>
                  <span
                    className={cn(
                      'font-medium text-right max-w-[60%]',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]'
                        : 'text-[#101010]',
                    )}
                  >
                    Bridge Building Sp. Z.o.o. (via Fractal)
                  </span>
                </div>
                <div className="flex justify-between items-start text-[12px]">
                  <span
                    className={cn(
                      'uppercase tracking-[0.14em] text-[10px]',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]/70'
                        : 'text-[#101010]/60',
                    )}
                  >
                    {isTechnical ? 'CUSTODY_MODEL' : 'Custody'}
                  </span>
                  <span
                    className={cn(
                      'font-medium text-right',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]'
                        : 'text-[#101010]',
                    )}
                  >
                    {isTechnical
                      ? 'SELF_CUSTODY::EOA_OWNED'
                      : 'Self-custodied (you own the funds)'}
                  </span>
                </div>
              </div>
              <div
                className={cn(
                  'pt-3 border-t',
                  isTechnical ? 'border-[#1B29FF]/10' : 'border-[#101010]/10',
                )}
              >
                <p
                  className={cn(
                    'text-[11px] leading-relaxed',
                    isTechnical
                      ? 'font-mono text-[#1B29FF]/60'
                      : 'text-[#101010]/60',
                  )}
                >
                  Email receipts will show &quot;Bridge&quot; as the payment
                  processor. This is normal.
                </p>
              </div>
              {account.destinationCurrency && (
                <div className="flex justify-between text-[12px]">
                  <span
                    className={cn(
                      'uppercase tracking-[0.14em] text-[10px]',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]/70'
                        : 'text-[#101010]/60',
                    )}
                  >
                    {isTechnical ? 'DEST_ASSET' : 'Destination currency'}
                  </span>
                  <span
                    className={cn(
                      'font-medium',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]'
                        : 'text-[#101010]/80',
                    )}
                  >
                    {account.destinationCurrency.toUpperCase()}
                  </span>
                </div>
              )}
              {account.destinationAddress && (
                <div className="space-y-1">
                  <dt
                    className={cn(
                      'uppercase tracking-[0.14em] text-[10px]',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]/70'
                        : 'text-[#101010]/60',
                    )}
                  >
                    {isTechnical ? 'SETTLEMENT_ADDR' : 'Settlement address'}
                  </dt>
                  <dd
                    className={cn(
                      'text-[12px] font-mono break-all flex items-start gap-2',
                      isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]/80',
                    )}
                  >
                    <span className="flex-1">{account.destinationAddress}</span>
                    <CopyButton
                      value={account.destinationAddress}
                      isTechnical={isTechnical}
                    />
                  </dd>
                </div>
              )}
              {account.destinationBankName && (
                <div className="flex justify-between text-[12px]">
                  <span
                    className={cn(
                      'uppercase tracking-[0.14em] text-[10px]',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]/70'
                        : 'text-[#101010]/60',
                    )}
                  >
                    {isTechnical ? 'DEST_INSTITUTION' : 'Destination bank'}
                  </span>
                  <span
                    className={cn(
                      'font-medium',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]'
                        : 'text-[#101010]/80',
                    )}
                  >
                    {account.destinationBankName}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </BimodalCard>
  );
}

export function BankingInstructionsDisplay({
  accounts,
  userData,
}: Omit<BankingInstructionsDisplayProps, 'hasCompletedKyc'>) {
  const { isTechnical } = useBimodal();
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
              <h3
                className={cn(
                  'text-[15px] font-semibold tracking-[-0.01em]',
                  isTechnical
                    ? 'font-mono text-[#1B29FF] uppercase'
                    : 'text-[#101010]',
                )}
              >
                {isTechnical
                  ? 'ACCESS::INSTANT_TIER'
                  : 'Instant access accounts'}
              </h3>
              <span
                className={cn(
                  'inline-flex items-center px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em]',
                  isTechnical
                    ? 'bg-[#1B29FF]/10 text-[#1B29FF] font-mono rounded-sm border border-[#1B29FF]/20'
                    : 'bg-[#1B29FF]/10 text-[#1B29FF] rounded-full',
                )}
              >
                {isTechnical ? 'TIER::STARTER' : 'Starter'}
              </span>
            </div>
            <div
              className={cn(
                'flex items-start gap-2 px-3 py-2.5',
                isTechnical
                  ? 'rounded-sm border border-[#1B29FF]/20 bg-[#1B29FF]/5'
                  : 'rounded-[10px] border border-[#1B29FF]/20 bg-[#1B29FF]/5',
              )}
            >
              <Info className="h-4 w-4 text-[#1B29FF] mt-0.5 flex-shrink-0" />
              <div
                className={cn(
                  'text-[12px] leading-relaxed',
                  isTechnical
                    ? 'font-mono text-[#1B29FF]/80'
                    : 'text-[#101010]/70',
                )}
              >
                <p className="mb-1">
                  <span
                    className={cn(
                      'font-semibold',
                      isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]',
                    )}
                  >
                    {isTechnical ? 'LIMITS::' : 'Deposits only:'}
                  </span>{' '}
                  {isTechnical
                    ? 'CAP_IN::10K_USD // SETTLEMENT::DIRECT'
                    : 'Accept up to $10,000 total. Funds arrive directly to your account.'}
                </p>
                <p>
                  {isTechnical
                    ? 'REQ::KYC_VERIFICATION -> UNLOCK::TRANSFERS'
                    : 'Complete verification to remove limits and enable transfers.'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {starterAchAccount && (
              <>
                <AccountCard account={starterAchAccount} userData={userData} />
                {/* Provider clarification for US ACH */}
                <div
                  className={cn(
                    'flex items-start gap-2 px-3 py-2.5',
                    isTechnical
                      ? 'rounded-sm border border-[#1B29FF]/10 bg-[#1B29FF]/5'
                      : 'rounded-[10px] border border-[#1B29FF]/10 bg-[#1B29FF]/5',
                  )}
                >
                  <Info className="h-4 w-4 text-[#1B29FF] mt-0.5 flex-shrink-0" />
                  <p
                    className={cn(
                      'text-[12px] leading-relaxed',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]/80'
                        : 'text-[#101010]/70',
                    )}
                  >
                    <span
                      className={cn(
                        'font-semibold',
                        isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]',
                      )}
                    >
                      DifferentAI Inc.
                    </span>{' '}
                    is the company name of Zero Finance. You will own the underlying funds and Zero Finance cannot move or access them. If you do the KYB process, you get a full account named after your company.
                  </p>
                </div>
              </>
            )}
            {starterIbanAccount && (
              <>
                <AccountCard account={starterIbanAccount} userData={userData} />
                {/* Provider clarification for EUR IBAN */}
                <div
                  className={cn(
                    'flex items-start gap-2 px-3 py-2.5',
                    isTechnical
                      ? 'rounded-sm border border-[#1B29FF]/10 bg-[#1B29FF]/5'
                      : 'rounded-[10px] border border-[#1B29FF]/10 bg-[#1B29FF]/5',
                  )}
                >
                  <Info className="h-4 w-4 text-[#1B29FF] mt-0.5 flex-shrink-0" />
                  <p
                    className={cn(
                      'text-[12px] leading-relaxed',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]/80'
                        : 'text-[#101010]/70',
                    )}
                  >
                    <span
                      className={cn(
                        'font-semibold',
                        isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]',
                      )}
                    >
                      Bridge
                    </span>{' '}
                    is our banking partner for EUR transfers
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {hasFull && (
        <div>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h3
                className={cn(
                  'text-[15px] font-semibold tracking-[-0.01em]',
                  isTechnical
                    ? 'font-mono text-[#1B29FF] uppercase'
                    : 'text-[#101010]',
                )}
              >
                {isTechnical ? 'ACCESS::FULL_TIER' : 'Your personal accounts'}
              </h3>
              <span
                className={cn(
                  'inline-flex items-center px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em]',
                  isTechnical
                    ? 'bg-[#1B29FF]/10 text-[#1B29FF] font-mono rounded-sm border border-[#1B29FF]/20'
                    : 'bg-green-500/10 text-green-700 rounded-full',
                )}
              >
                {isTechnical ? 'CAP::UNLIMITED' : 'Unlimited'}
              </span>
            </div>
            <p
              className={cn(
                'text-[12px]',
                isTechnical
                  ? 'font-mono text-[#1B29FF]/60'
                  : 'text-[#101010]/60',
              )}
            >
              {isTechnical
                ? 'VERIFIED::BUSINESS_ENTITY // LIMITS::REMOVED'
                : 'No deposit limits. Backed by your verified business.'}
            </p>
          </div>

          <div className="space-y-4">
            {fullAchAccount && (
              <>
                <AccountCard account={fullAchAccount} userData={userData} />
                {/* Provider clarification for US ACH */}
                <div
                  className={cn(
                    'flex items-start gap-2 px-3 py-2.5',
                    isTechnical
                      ? 'rounded-sm border border-[#1B29FF]/10 bg-[#1B29FF]/5'
                      : 'rounded-[10px] border border-[#1B29FF]/10 bg-[#1B29FF]/5',
                  )}
                >
                  <Info className="h-4 w-4 text-[#1B29FF] mt-0.5 flex-shrink-0" />
                  <p
                    className={cn(
                      'text-[12px] leading-relaxed',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]/80'
                        : 'text-[#101010]/70',
                    )}
                  >
                    <span
                      className={cn(
                        'font-semibold',
                        isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]',
                      )}
                    >
                      DifferentAI Inc.
                    </span>{' '}
                    is the company name of Zero Finance
                  </p>
                </div>
              </>
            )}
            {fullIbanAccount && (
              <>
                <AccountCard account={fullIbanAccount} userData={userData} />
                {/* Provider clarification for EUR IBAN */}
                <div
                  className={cn(
                    'flex items-start gap-2 px-3 py-2.5',
                    isTechnical
                      ? 'rounded-sm border border-[#1B29FF]/10 bg-[#1B29FF]/5'
                      : 'rounded-[10px] border border-[#1B29FF]/10 bg-[#1B29FF]/5',
                  )}
                >
                  <Info className="h-4 w-4 text-[#1B29FF] mt-0.5 flex-shrink-0" />
                  <p
                    className={cn(
                      'text-[12px] leading-relaxed',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]/80'
                        : 'text-[#101010]/70',
                    )}
                  >
                    <span
                      className={cn(
                        'font-semibold',
                        isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]',
                      )}
                    >
                      Bridge
                    </span>{' '}
                    is our banking partner for EUR transfers
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
