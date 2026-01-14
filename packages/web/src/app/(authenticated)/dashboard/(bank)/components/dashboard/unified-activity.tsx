'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { trpc, RouterOutputs } from '@/utils/trpc';
import {
  Loader2,
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  RefreshCw,
  Bot,
  ExternalLink,
  TrendingUp,
  Check,
  Clock,
  X,
  Play,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBimodal } from '@/components/ui/bimodal';
import type { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import {
  encodeFunctionData,
  erc20Abi,
  formatUnits,
  parseAbi,
  type Address,
} from 'viem';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { USDC_ADDRESS, USDC_DECIMALS } from '@/lib/constants';
import { toast } from 'sonner';
import { ResumeTransferModal } from './resume-transfer-modal';
import { TransactionAttachments } from './transaction-attachments';

// =============================================================================
// TYPES
// =============================================================================

type BankTransaction =
  RouterOutputs['align']['getBankingHistory']['transactions'][number];

type ActionProposal = RouterOutputs['actionProposals']['list'][number];

interface CryptoTransaction {
  type: 'incoming' | 'outgoing' | 'module' | 'creation';
  hash: string;
  timestamp: number;
  from?: string;
  to?: string;
  value?: string;
  tokenAddress?: string;
  tokenSymbol?: string;
  tokenDecimals?: number;
  methodName?: string;
  swept?: boolean;
  sweptPercentage?: number;
  sweptAmount?: string;
  sweptTxHash?: string;
}

// Unified transaction that merges both sources
interface UnifiedTransaction {
  id: string;
  category:
    | 'bank_send'
    | 'bank_receive'
    | 'crypto_send'
    | 'crypto_receive'
    | 'auto_save'
    | 'agent_proposal';
  title: string;
  subtitle: string;
  amount: string;
  amountPrefix: '+' | '-' | '';
  timestamp: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'canceled';

  // Bank-specific fields
  bankName?: string;
  accountMask?: string;
  accountType?: string;
  recipientName?: string;
  paymentRails?: string;
  fiatAmount?: string;
  fiatCurrency?: string;
  fee?: string;
  exchangeRate?: string;

  // Crypto-specific fields
  cryptoAddress?: string;
  transactionHash?: string;

  // Auto-save specific
  sweptPercentage?: number;
  sweptTxHash?: string;

  // Agent proposal specific
  proposedByAgent?: boolean;
  agentProposalMessage?: string;

  // For pending offramps that need action
  needsAction?: boolean;
  alignTransferId?: string;

  // Action proposal metadata (crypto/savings)
  proposalId?: string;
  proposalType?:
    | 'bank_transfer'
    | 'crypto_transfer'
    | 'savings_deposit'
    | 'savings_withdraw';
  proposalPayload?: Record<string, unknown>;
}

const ERC4626_ABI = parseAbi([
  'function deposit(uint256 assets, address receiver) returns (uint256)',
  'function withdraw(uint256 assets, address receiver, address owner) returns (uint256)',
]);

// =============================================================================
// HELPERS
// =============================================================================

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) return 'just now';
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} min ago`;
  }
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatFullDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getDateGroup(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 604800000);

  if (date >= today) return 'Today';
  if (date >= yesterday) return 'Yesterday';
  if (date >= weekAgo) return 'This Week';
  return 'Earlier';
}

function formatAmount(amount: string | number, decimals: number = 2): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function maskAccountNumber(accountNumber?: string): string {
  if (!accountNumber) return '';
  const last4 = accountNumber.slice(-4);
  return `****${last4}`;
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function normalizeProposalPayload(
  payload: ActionProposal['payload'],
): Record<string, unknown> {
  if (!payload) return {};
  if (typeof payload === 'string') {
    try {
      return JSON.parse(payload) as Record<string, unknown>;
    } catch (error) {
      return {};
    }
  }
  return payload as Record<string, unknown>;
}

function mapProposalStatus(
  status: ActionProposal['status'],
): UnifiedTransaction['status'] {
  switch (status) {
    case 'pending':
      return 'pending';
    case 'approved':
      return 'processing';
    case 'executed':
      return 'completed';
    case 'rejected':
    case 'failed':
      return 'failed';
    case 'canceled':
      return 'canceled';
    default:
      return 'pending';
  }
}

// =============================================================================
// TRANSACTION MERGING LOGIC
// =============================================================================

function mergeBankAndCryptoTransactions(
  bankTxs: BankTransaction[],
  cryptoTxs: CryptoTransaction[],
  proposals: ActionProposal[],
): UnifiedTransaction[] {
  const unified: UnifiedTransaction[] = [];
  const usedCryptoHashes = new Set<string>();

  // First, process bank transactions
  for (const bankTx of bankTxs) {
    // Try to find matching crypto tx by hash
    const matchingCrypto = cryptoTxs.find(
      (ctx) =>
        ctx.hash === bankTx.transactionHash && !usedCryptoHashes.has(ctx.hash),
    );

    if (matchingCrypto) {
      usedCryptoHashes.add(matchingCrypto.hash);
    }

    // Parse bank account snapshot if available (API now sends bankAccountDetails directly)
    const bankSnapshot = bankTx.bankAccountDetails || null;

    const isAgentProposal = bankTx.proposedByAgent;
    const needsAction =
      bankTx.status === 'pending' && bankTx.type === 'outgoing';

    let category: UnifiedTransaction['category'];
    let title: string;
    let subtitle: string;

    if (isAgentProposal && needsAction) {
      category = 'agent_proposal';
      title = 'Pending Approval';
      // Show bank destination in subtitle, reasoning goes in expanded details
      subtitle = bankSnapshot?.bankName
        ? `transfer to ${bankSnapshot.bankName}${bankSnapshot.recipientName ? ` (${bankSnapshot.recipientName})` : ''} in ${bankTx.secondaryCurrency || 'USD'}`
        : bankTx.agentProposalMessage || 'Proposed by AI agent';
    } else if (bankTx.type === 'outgoing') {
      category = 'bank_send';
      title = 'Bank Transfer';
      subtitle = bankSnapshot?.bankName
        ? `To ${bankSnapshot.bankName}${bankSnapshot.accountMask ? ` · ${bankSnapshot.accountMask}` : ''}`
        : 'To bank account';
    } else {
      category = 'bank_receive';
      title = 'Deposit';
      // Format payment rails nicely (ach -> ACH, sepa -> SEPA, wire -> Wire)
      const rails = bankTx.paymentRails?.toUpperCase();
      subtitle = rails ? `Via ${rails}` : 'From bank transfer';
    }

    unified.push({
      id: bankTx.id,
      category,
      title,
      subtitle,
      amount: `$${formatAmount(bankTx.primaryAmount)}`,
      amountPrefix: bankTx.type === 'incoming' ? '+' : '-',
      timestamp: bankTx.createdAt ? new Date(bankTx.createdAt) : new Date(),
      status: bankTx.status as UnifiedTransaction['status'],

      // Bank details
      bankName: bankSnapshot?.bankName,
      accountMask: bankSnapshot?.accountMask,
      accountType: bankSnapshot?.accountType,
      recipientName: bankSnapshot?.recipientName,
      paymentRails: bankTx.paymentRails?.toUpperCase(),
      fiatAmount: bankTx.secondaryAmount || undefined,
      fiatCurrency: bankTx.secondaryCurrency || undefined,
      fee: bankTx.feeAmount || undefined,

      // Crypto details
      transactionHash: bankTx.transactionHash || undefined,

      // Agent/action details
      proposedByAgent: bankTx.proposedByAgent,
      agentProposalMessage: bankTx.agentProposalMessage || undefined,
      needsAction,
      alignTransferId: bankTx.alignTransferId,
      proposalId: needsAction ? bankTx.alignTransferId : undefined,
      proposalType: needsAction ? 'bank_transfer' : undefined,
    });
  }

  // Then, add crypto transactions that weren't matched to bank txs
  for (const cryptoTx of cryptoTxs) {
    if (usedCryptoHashes.has(cryptoTx.hash)) continue;

    // Skip non-USDC transactions
    if (
      cryptoTx.tokenSymbol !== 'USDC' &&
      cryptoTx.tokenAddress?.toLowerCase() !== USDC_ADDRESS.toLowerCase()
    ) {
      continue;
    }

    const isAutoSave = cryptoTx.swept;
    const isIncoming = cryptoTx.type === 'incoming';

    let category: UnifiedTransaction['category'];
    let title: string;
    let subtitle: string;

    if (isAutoSave) {
      category = 'auto_save';
      title = 'Auto-saved';
      subtitle = `${cryptoTx.sweptPercentage}% of deposit`;
    } else if (isIncoming) {
      category = 'crypto_receive';
      title = 'Received';
      subtitle = cryptoTx.from
        ? `From ${truncateAddress(cryptoTx.from)}`
        : 'From external wallet';
    } else {
      category = 'crypto_send';
      title = 'Transfer';
      subtitle = cryptoTx.to
        ? `To ${truncateAddress(cryptoTx.to)}`
        : 'To external wallet';
    }

    const amount = cryptoTx.value
      ? formatUnits(
          BigInt(cryptoTx.value),
          cryptoTx.tokenDecimals || USDC_DECIMALS,
        )
      : '0';

    unified.push({
      id: cryptoTx.hash,
      category,
      title,
      subtitle,
      amount: `$${formatAmount(amount)}`,
      amountPrefix: isIncoming || isAutoSave ? '+' : '-',
      timestamp: new Date(cryptoTx.timestamp),
      status: 'completed',

      cryptoAddress: isIncoming ? cryptoTx.from : cryptoTx.to,
      transactionHash: cryptoTx.hash,

      sweptPercentage: cryptoTx.sweptPercentage,
      sweptTxHash: cryptoTx.sweptTxHash,
    });
  }

  for (const proposal of proposals) {
    const payload = normalizeProposalPayload(proposal.payload);
    const proposalType = proposal.proposalType;
    const status = mapProposalStatus(proposal.status);
    const needsAction = proposal.status === 'pending';

    const amountValue = payload.amount ? String(payload.amount) : '0';
    const tokenSymbol =
      (payload.tokenSymbol as string | undefined) ??
      (payload.assetSymbol as string | undefined) ??
      'USDC';
    const amountLabel =
      tokenSymbol === 'USDC'
        ? `$${formatAmount(amountValue)}`
        : `${formatAmount(amountValue)} ${tokenSymbol}`;

    let subtitle = 'Proposed by agent';
    let title = needsAction ? 'Pending Approval' : 'Proposal';
    let amountPrefix: UnifiedTransaction['amountPrefix'] = '-';

    if (proposalType === 'crypto_transfer') {
      const toAddress = payload.toAddress as string | undefined;
      subtitle = toAddress
        ? `crypto transfer to ${truncateAddress(toAddress)}`
        : 'crypto transfer';
      title = needsAction ? 'Pending Approval' : 'Crypto Transfer';
    } else if (proposalType === 'savings_deposit') {
      const vaultName =
        (payload.vaultDisplayName as string | undefined) ??
        (payload.vaultName as string | undefined);
      subtitle = vaultName
        ? `deposit to ${vaultName}`
        : 'deposit to savings vault';
      title = needsAction ? 'Pending Approval' : 'Savings Deposit';
      amountPrefix = '-';
    } else if (proposalType === 'savings_withdraw') {
      const vaultName =
        (payload.vaultDisplayName as string | undefined) ??
        (payload.vaultName as string | undefined);
      subtitle = vaultName
        ? `withdraw from ${vaultName}`
        : 'withdraw from savings vault';
      title = needsAction ? 'Pending Approval' : 'Savings Withdrawal';
      amountPrefix = '+';
    }

    unified.push({
      id: proposal.id,
      category: 'agent_proposal',
      title,
      subtitle,
      amount: amountLabel,
      amountPrefix,
      timestamp: proposal.createdAt ? new Date(proposal.createdAt) : new Date(),
      status,
      proposedByAgent: proposal.proposedByAgent ?? true,
      agentProposalMessage: proposal.proposalMessage ?? undefined,
      needsAction,
      proposalId: proposal.id,
      proposalType,
      proposalPayload: payload,
    });
  }

  // Sort by timestamp, newest first
  unified.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return unified;
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function TransactionIcon({
  category,
  status,
}: {
  category: UnifiedTransaction['category'];
  status: UnifiedTransaction['status'];
}) {
  const iconMap = {
    bank_send: <ArrowUpRight className="h-5 w-5" />,
    bank_receive: <ArrowDownLeft className="h-5 w-5" />,
    crypto_send: <ArrowUpRight className="h-5 w-5" />,
    crypto_receive: <ArrowDownLeft className="h-5 w-5" />,
    auto_save: <TrendingUp className="h-5 w-5" />,
    agent_proposal: <Bot className="h-5 w-5" />,
  };

  const colorMap = {
    bank_send: 'bg-sky-600/10 text-sky-600',
    bank_receive: 'bg-emerald-600/10 text-emerald-600',
    crypto_send: 'bg-sky-600/10 text-sky-600',
    crypto_receive: 'bg-emerald-600/10 text-emerald-600',
    auto_save: 'bg-emerald-600/10 text-emerald-600',
    agent_proposal: 'bg-violet-600/10 text-violet-600',
  };

  return (
    <div
      className={cn(
        'h-10 w-10 flex items-center justify-center rounded-full',
        colorMap[category],
      )}
    >
      {iconMap[category]}
    </div>
  );
}

function StatusBadge({ status }: { status: UnifiedTransaction['status'] }) {
  const getIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3.5 w-3.5" />;
      case 'processing':
        return <Loader2 className="h-3.5 w-3.5 animate-spin" />;
      case 'completed':
        return <Check className="h-3.5 w-3.5" />;
      case 'failed':
      case 'canceled':
        return <X className="h-3.5 w-3.5" />;
    }
  };

  const getClassName = () => {
    switch (status) {
      case 'pending':
        return 'text-amber-600';
      case 'processing':
        return 'text-blue-600';
      case 'completed':
        return 'text-emerald-600';
      case 'failed':
        return 'text-red-600';
      case 'canceled':
        return 'text-gray-500';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'canceled':
        return 'Canceled';
    }
  };

  return (
    <span
      className={cn('inline-flex items-center gap-1 text-sm', getClassName())}
    >
      {getIcon()}
      {getLabel()}
    </span>
  );
}

function TransactionRow({
  tx,
  isTechnical,
  onApprove,
  onDismiss,
  isActionPending,
}: {
  tx: UnifiedTransaction;
  isTechnical: boolean;
  onApprove?: () => void;
  onDismiss?: () => void;
  isActionPending?: boolean;
}) {
  const amountColor =
    tx.amountPrefix === '+' ? 'text-emerald-600' : 'text-[#101010]';
  const proposalPayload = tx.proposalPayload ?? {};
  const proposalRecipient = proposalPayload.toAddress as string | undefined;
  const proposalTokenSymbol =
    (proposalPayload.tokenSymbol as string | undefined) ??
    (proposalPayload.assetSymbol as string | undefined);
  const proposalVaultName =
    (proposalPayload.vaultDisplayName as string | undefined) ??
    (proposalPayload.vaultName as string | undefined);

  return (
    <AccordionItem
      value={tx.id}
      className="border-b border-[#101010]/10 last:border-b-0"
    >
      <AccordionTrigger className="hover:no-underline px-4 py-3 [&[data-state=open]]:bg-[#F7F7F2]/50">
        <div className="flex items-center gap-3 w-full">
          <TransactionIcon category={tx.category} status={tx.status} />

          <div className="flex-1 min-w-0 text-left">
            <p className="text-[15px] font-medium text-[#101010] truncate">
              {tx.title}
            </p>
            <p className="text-[13px] text-[#101010]/60 truncate">
              {tx.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Agent proposal actions */}
            {tx.category === 'agent_proposal' && tx.needsAction && (
              <div
                className="flex items-center gap-1.5 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="sm"
                  onClick={onApprove}
                  disabled={isActionPending}
                  className="h-7 px-2.5 bg-[#1B29FF] hover:bg-[#1420CC] text-white text-[11px] font-medium rounded-sm"
                >
                  <Play className="h-3 w-3 mr-1 fill-current" />
                  <span className="hidden sm:inline">Approve</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                  disabled={isActionPending}
                  className="h-7 w-7 p-0 text-[#101010]/40 hover:text-[#101010]/60 hover:bg-[#101010]/5 rounded-sm"
                >
                  {isActionPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <X className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            )}

            {/* Amount and time */}
            {tx.category !== 'agent_proposal' && (
              <div className="text-right">
                <p
                  className={cn(
                    'text-[15px] font-medium tabular-nums',
                    amountColor,
                  )}
                >
                  {tx.amountPrefix}
                  {tx.amount}
                </p>
                <p className="text-[12px] text-[#101010]/40">
                  {formatDate(tx.timestamp)}
                </p>
              </div>
            )}

            {tx.category === 'agent_proposal' && (
              <p
                className={cn(
                  'text-[15px] font-medium tabular-nums',
                  amountColor,
                )}
              >
                {tx.amount}
              </p>
            )}
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="pb-4">
        <div className="bg-[#F7F7F2] p-4 space-y-3">
          {/* Agent proposal details */}
          {tx.category === 'agent_proposal' && (
            <>
              {/* AI Reasoning - highlighted */}
              {tx.agentProposalMessage && (
                <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 mb-3">
                  <div className="flex items-start gap-2">
                    <Bot className="h-4 w-4 text-violet-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] font-medium text-violet-600 uppercase tracking-wide mb-1">
                        AI Reasoning
                      </p>
                      <p className="text-[13px] text-violet-900">
                        {tx.agentProposalMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {tx.proposalType && tx.proposalType !== 'bank_transfer' ? (
                <>
                  {tx.proposalType === 'crypto_transfer' && (
                    <>
                      {proposalRecipient && (
                        <DetailRow
                          label="Recipient"
                          value={truncateAddress(proposalRecipient)}
                        />
                      )}
                      {proposalTokenSymbol && (
                        <DetailRow label="Token" value={proposalTokenSymbol} />
                      )}
                      <DetailRow label="Amount" value={tx.amount} />
                    </>
                  )}

                  {(tx.proposalType === 'savings_deposit' ||
                    tx.proposalType === 'savings_withdraw') && (
                    <>
                      <DetailRow
                        label="Action"
                        value={
                          tx.proposalType === 'savings_deposit'
                            ? 'Deposit'
                            : 'Withdraw'
                        }
                      />
                      {proposalVaultName && (
                        <DetailRow label="Vault" value={proposalVaultName} />
                      )}
                      {proposalTokenSymbol && (
                        <DetailRow label="Token" value={proposalTokenSymbol} />
                      )}
                      <DetailRow label="Amount" value={tx.amount} />
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* Bank account details */}
                  {tx.recipientName && (
                    <DetailRow label="Recipient" value={tx.recipientName} />
                  )}
                  {tx.bankName && (
                    <DetailRow label="Bank" value={tx.bankName} />
                  )}
                  {tx.accountMask && (
                    <DetailRow label="Account" value={tx.accountMask} />
                  )}
                  {tx.accountType && (
                    <DetailRow
                      label="Account Type"
                      value={
                        tx.accountType === 'iban'
                          ? 'IBAN (International)'
                          : tx.accountType === 'us'
                            ? 'US Bank Account'
                            : tx.accountType.toUpperCase()
                      }
                    />
                  )}
                  {tx.paymentRails && (
                    <DetailRow label="Method" value={tx.paymentRails} />
                  )}

                  <div className="border-t border-[#101010]/10 my-3" />

                  {/* Amount details */}
                  <DetailRow
                    label="Amount to send"
                    value={`${tx.amount.replace('$', '')} USDC`}
                  />
                  {tx.fiatAmount && tx.fiatCurrency && (
                    <DetailRow
                      label="They will receive"
                      value={`${formatCurrencySymbol(tx.fiatCurrency)}${formatAmount(tx.fiatAmount)} ${tx.fiatCurrency}`}
                    />
                  )}
                  {tx.fee && (
                    <DetailRow label="Fee" value={`$${formatAmount(tx.fee)}`} />
                  )}
                </>
              )}
            </>
          )}

          {/* Bank transfer details */}
          {(tx.category === 'bank_send' || tx.category === 'bank_receive') && (
            <>
              {tx.recipientName && (
                <DetailRow label="Recipient" value={tx.recipientName} />
              )}
              {tx.bankName && <DetailRow label="Bank" value={tx.bankName} />}
              {tx.accountMask && (
                <DetailRow label="Account" value={tx.accountMask} />
              )}
              {tx.paymentRails && (
                <DetailRow label="Method" value={tx.paymentRails} />
              )}

              <div className="border-t border-[#101010]/10 my-3" />

              {tx.category === 'bank_send' && (
                <>
                  <DetailRow
                    label="You sent"
                    value={`${tx.amount.replace('$', '')} USDC`}
                  />
                  {tx.fiatAmount && tx.fiatCurrency && (
                    <DetailRow
                      label="They received"
                      value={`${formatCurrencySymbol(tx.fiatCurrency)}${formatAmount(tx.fiatAmount)} ${tx.fiatCurrency}`}
                    />
                  )}
                  {tx.fee && (
                    <DetailRow label="Fee" value={`$${formatAmount(tx.fee)}`} />
                  )}
                </>
              )}

              {tx.category === 'bank_receive' && (
                <>
                  <DetailRow
                    label="Amount received"
                    value={`${tx.amount.replace('$', '')} USDC`}
                  />
                  {tx.fiatAmount && tx.fiatCurrency && (
                    <DetailRow
                      label="Original amount"
                      value={`${formatCurrencySymbol(tx.fiatCurrency)}${formatAmount(tx.fiatAmount)}`}
                    />
                  )}
                </>
              )}
            </>
          )}

          {/* Crypto transfer details */}
          {(tx.category === 'crypto_send' ||
            tx.category === 'crypto_receive') && (
            <>
              <DetailRow
                label={tx.category === 'crypto_send' ? 'To' : 'From'}
                value={tx.cryptoAddress || 'Unknown'}
                mono
              />
              <DetailRow
                label="Amount"
                value={`${tx.amount.replace('$', '')} USDC`}
              />
            </>
          )}

          {/* Auto-save details */}
          {tx.category === 'auto_save' && (
            <>
              <DetailRow
                label="Saved"
                value={`${tx.sweptPercentage}% of deposit`}
              />
              <DetailRow label="Amount" value={tx.amount} />
            </>
          )}

          <div className="border-t border-gray-200 my-3" />

          <DetailRow label="Date" value={formatFullDate(tx.timestamp)} />
          <DetailRow
            label="Status"
            value={<StatusBadge status={tx.status} />}
          />

          {/* Technical mode: show tx hash */}
          {isTechnical && tx.transactionHash && (
            <>
              <div className="border-t border-[#101010]/10 my-3" />
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-gray-500">Tx Hash</span>
                <a
                  href={`https://basescan.org/tx/${tx.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] font-mono text-[#1B29FF] hover:underline flex items-center gap-1"
                >
                  {truncateAddress(tx.transactionHash)}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </>
          )}

          {/* Auto-save: link to savings tx */}
          {tx.category === 'auto_save' && tx.sweptTxHash && isTechnical && (
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-gray-500">Savings Tx</span>
              <a
                href={`https://basescan.org/tx/${tx.sweptTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-mono text-emerald-600 hover:underline flex items-center gap-1"
              >
                {truncateAddress(tx.sweptTxHash)}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          {/* Attachments section - show for bank sends, crypto sends, and agent proposals */}
          {(tx.category === 'bank_send' ||
            tx.category === 'crypto_send' ||
            tx.category === 'agent_proposal') &&
            tx.id && (
              <>
                <div className="border-t border-[#101010]/10 my-3" />
                <TransactionAttachments
                  transactionType={
                    tx.category === 'bank_send' ||
                    tx.category === 'agent_proposal'
                      ? 'offramp'
                      : 'crypto_outgoing'
                  }
                  transactionId={tx.id}
                />
              </>
            )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-[#101010]/60">{label}</span>
      <span className={cn('text-[13px] text-[#101010]', mono && 'font-mono')}>
        {value}
      </span>
    </div>
  );
}

function formatCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'AED ',
  };
  return symbols[currency.toUpperCase()] || '';
}

function isNoCustomerError(message: string | undefined): boolean {
  if (!message) return false;
  return (
    message.toLowerCase().includes('no align customer') ||
    message.toLowerCase().includes('customer id') ||
    message.toLowerCase().includes('not found for user')
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function UnifiedActivity() {
  const { isTechnical } = useBimodal();
  const utils = trpc.useUtils();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionPendingIds, setActionPendingIds] = useState<Set<string>>(
    new Set(),
  );
  const [resumeTransferId, setResumeTransferId] = useState<string | null>(null);
  const hasSyncedBankRef = React.useRef(false);
  const hasSyncedSafeRef = React.useRef(false);

  // Get current workspace context
  const { data: workspaceData } =
    trpc.workspace.getOrCreateWorkspace.useQuery();
  const workspaceId = workspaceData?.workspaceId;

  // Get user's primary safe via getMultiChainPositions (user-scoped, not workspace-scoped)
  // This ensures consistency with balance queries per AGENTS.md guidelines
  const { data: positions } = trpc.earn.getMultiChainPositions.useQuery();
  const primarySafeAddress = positions?.safes.find(
    (s) => s.chainId === SUPPORTED_CHAINS.BASE,
  )?.address as Address | undefined;

  const { ready: relayReady, send: sendWithRelay } =
    useSafeRelay(primarySafeAddress);

  // Fetch bank transactions
  const {
    data: bankingHistory,
    isLoading: isLoadingBank,
    isError: isBankError,
    error: bankError,
  } = trpc.align.getBankingHistory.useQuery({ limit: 50 });

  // Fetch crypto transactions (from our DB - synced separately)
  const { data: cryptoTxs, isLoading: isLoadingCrypto } =
    trpc.safe.getEnrichedTransactions.useQuery(
      {
        safeAddress: primarySafeAddress!,
        workspaceId: workspaceId!,
        limit: 50,
      },
      { enabled: !!primarySafeAddress && !!workspaceId },
    );

  const { data: actionProposalsData } = trpc.actionProposals.list.useQuery();

  // Sync mutations
  const syncVAHistory = trpc.align.syncVirtualAccountHistory.useMutation({
    onSettled: () => utils.align.getBankingHistory.invalidate(),
  });
  const syncOfframp = trpc.align.syncOfframpTransfers.useMutation({
    onSettled: () => utils.align.getBankingHistory.invalidate(),
  });
  const syncSafeTransactions = trpc.safe.syncSafeTransactions.useMutation({
    onSettled: () => utils.safe.getEnrichedTransactions.invalidate(),
  });
  const dismissTransfer = trpc.align.dismissOfframpTransfer.useMutation({
    onSuccess: () => utils.align.getBankingHistory.invalidate(),
  });
  const dismissActionProposal = trpc.actionProposals.dismiss.useMutation({
    onSuccess: () => utils.actionProposals.list.invalidate(),
  });
  const markProposalExecuted = trpc.actionProposals.markExecuted.useMutation({
    onSuccess: () => utils.actionProposals.list.invalidate(),
  });
  const markProposalFailed = trpc.actionProposals.markFailed.useMutation({
    onSuccess: () => utils.actionProposals.list.invalidate(),
  });

  // Initial sync - sync bank data sources on component mount (once only)
  // Note: We intentionally omit mutation functions from deps to prevent infinite loops.
  // tRPC mutation objects change state when called, which would re-trigger the effect.
  React.useEffect(() => {
    if (hasSyncedBankRef.current) return;
    hasSyncedBankRef.current = true;

    // Sync bank transfers (fire and forget)
    Promise.allSettled([
      syncVAHistory.mutateAsync(),
      syncOfframp.mutateAsync(),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync Safe transactions when we have the Safe address and workspace (once per address)
  // Note: We intentionally omit syncSafeTransactions from deps to prevent infinite loops.
  React.useEffect(() => {
    if (!primarySafeAddress || !workspaceId || hasSyncedSafeRef.current) return;
    hasSyncedSafeRef.current = true;

    syncSafeTransactions.mutate({
      safeAddress: primarySafeAddress,
      workspaceId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primarySafeAddress]);

  // Merge transactions
  const unifiedTransactions = useMemo(() => {
    const bankTxs = bankingHistory?.transactions ?? [];
    const crypto = (cryptoTxs ?? []) as CryptoTransaction[];
    const proposals = (actionProposalsData ?? []) as ActionProposal[];
    return mergeBankAndCryptoTransactions(bankTxs, crypto, proposals);
  }, [bankingHistory?.transactions, cryptoTxs, actionProposalsData]);

  // Group by date
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, UnifiedTransaction[]> = {};

    for (const tx of unifiedTransactions) {
      const group = getDateGroup(tx.timestamp);
      if (!groups[group]) groups[group] = [];
      groups[group].push(tx);
    }

    return groups;
  }, [unifiedTransactions]);

  const groupOrder = ['Today', 'Yesterday', 'This Week', 'Earlier'];

  // Handlers
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.allSettled([
      syncVAHistory.mutateAsync(),
      syncOfframp.mutateAsync(),
      primarySafeAddress && workspaceId
        ? syncSafeTransactions.mutateAsync({
            safeAddress: primarySafeAddress,
            workspaceId,
          })
        : Promise.resolve(),
    ]);
    await utils.actionProposals.list.invalidate();
    setIsRefreshing(false);
  };

  const executeActionProposal = async (tx: UnifiedTransaction) => {
    if (!tx.proposalId || !tx.proposalType) {
      return;
    }

    if (!relayReady || !primarySafeAddress) {
      toast.error('Smart wallet not ready. Please try again.');
      return;
    }

    const payload = tx.proposalPayload ?? {};
    const amountBaseUnits = payload.amountBaseUnits as string | undefined;

    if (!amountBaseUnits) {
      toast.error('Proposal is missing amount data.');
      return;
    }

    const actionId = tx.proposalId;
    setActionPendingIds((prev) => new Set(prev).add(actionId));

    let submittedTxHash: string | null = null;

    try {
      const amount = BigInt(amountBaseUnits);
      const transactions: MetaTransactionData[] = [];

      if (tx.proposalType === 'crypto_transfer') {
        const toAddress = payload.toAddress as Address | undefined;
        const tokenAddress = payload.tokenAddress as Address | undefined;

        if (!toAddress || !tokenAddress) {
          throw new Error('Proposal missing transfer addresses.');
        }

        const transferData = encodeFunctionData({
          abi: erc20Abi,
          functionName: 'transfer',
          args: [toAddress, amount],
        });

        transactions.push({
          to: tokenAddress,
          value: '0',
          data: transferData,
          operation: 0,
        });
      }

      if (tx.proposalType === 'savings_deposit') {
        const vaultAddress = payload.vaultAddress as Address | undefined;
        const assetAddress = payload.assetAddress as Address | undefined;

        if (!vaultAddress || !assetAddress) {
          throw new Error('Proposal missing vault information.');
        }

        const approveData = encodeFunctionData({
          abi: erc20Abi,
          functionName: 'approve',
          args: [vaultAddress, amount],
        });
        const depositData = encodeFunctionData({
          abi: ERC4626_ABI,
          functionName: 'deposit',
          args: [amount, primarySafeAddress],
        });

        transactions.push(
          {
            to: assetAddress,
            value: '0',
            data: approveData,
            operation: 0,
          },
          {
            to: vaultAddress,
            value: '0',
            data: depositData,
            operation: 0,
          },
        );
      }

      if (tx.proposalType === 'savings_withdraw') {
        const vaultAddress = payload.vaultAddress as Address | undefined;
        if (!vaultAddress) {
          throw new Error('Proposal missing vault information.');
        }

        const withdrawData = encodeFunctionData({
          abi: ERC4626_ABI,
          functionName: 'withdraw',
          args: [amount, primarySafeAddress, primarySafeAddress],
        });

        transactions.push({
          to: vaultAddress,
          value: '0',
          data: withdrawData,
          operation: 0,
        });
      }

      if (transactions.length === 0) {
        throw new Error('No executable transactions built for proposal.');
      }

      submittedTxHash = await sendWithRelay(transactions);

      const chainIdRaw =
        (payload.chainId as number | string | undefined) ??
        (payload.chain_id as number | string | undefined);
      const parsedChainId =
        typeof chainIdRaw === 'number'
          ? chainIdRaw
          : typeof chainIdRaw === 'string'
            ? Number(chainIdRaw)
            : undefined;
      const chainId =
        typeof parsedChainId === 'number' && Number.isFinite(parsedChainId)
          ? parsedChainId
          : undefined;

      const result = await markProposalExecuted.mutateAsync({
        id: tx.proposalId,
        txHash: submittedTxHash,
        chainId,
        safeAddress: primarySafeAddress,
      });

      if (result.status === 'executed') {
        toast.success('Proposal executed');
      } else if (result.status === 'approved') {
        toast.success(
          result.pending
            ? 'Transaction submitted. Confirming on-chain…'
            : 'Transaction submitted',
        );
      } else {
        toast.error('Safe execution failed');
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to execute proposal';

      if (!submittedTxHash) {
        toast.error(message);
        await markProposalFailed.mutateAsync({
          id: tx.proposalId,
          reason: message,
        });
      } else {
        toast.error(
          'Transaction submitted, but status update failed. Refresh shortly.',
        );
      }
    } finally {
      setActionPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(actionId);
        return next;
      });
    }
  };

  const handleDismiss = async (tx: UnifiedTransaction) => {
    const actionId = tx.proposalId ?? tx.alignTransferId;
    if (!actionId) return;

    setActionPendingIds((prev) => new Set(prev).add(actionId));
    try {
      if (tx.proposalType && tx.proposalType !== 'bank_transfer') {
        await dismissActionProposal.mutateAsync({ id: actionId });
        toast.success('Proposal dismissed');
      } else if (tx.alignTransferId) {
        await dismissTransfer.mutateAsync({
          alignTransferId: tx.alignTransferId,
        });
        toast.success('Transfer dismissed');
      }
    } catch (err) {
      toast.error('Failed to dismiss proposal');
    } finally {
      setActionPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(actionId);
        return next;
      });
    }
  };

  const handleApprove = (tx: UnifiedTransaction) => {
    if (tx.proposalType && tx.proposalType !== 'bank_transfer') {
      executeActionProposal(tx);
      return;
    }

    if (tx.alignTransferId) {
      setResumeTransferId(tx.alignTransferId);
    }
  };

  const handleResumeSuccess = () => {
    setResumeTransferId(null);
    utils.align.getBankingHistory.invalidate();
  };

  const isLoading = isLoadingBank || (!!primarySafeAddress && isLoadingCrypto);
  const isNoCustomerState = isNoCustomerError(bankError?.message);
  const hasTransactions = unifiedTransactions.length > 0;

  return (
    <Card
      className={cn(
        'bg-white border shadow-none',
        isTechnical ? 'border-[#1B29FF]/20' : 'border-[#101010]/10',
      )}
    >
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <div>
          <p
            className={cn(
              'mb-1',
              isTechnical
                ? 'font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase'
                : 'uppercase tracking-[0.14em] text-[11px] text-[#101010]/60',
            )}
          >
            {isTechnical ? 'TX::HISTORY' : 'RECENT ACTIVITY'}
          </p>
          <h3
            className={cn(
              'text-lg font-semibold',
              isTechnical ? 'font-mono text-[#101010]' : 'text-[#101010]',
            )}
          >
            Activity
          </h3>
          <p
            className={cn(
              'text-[13px]',
              isTechnical ? 'font-mono text-[#101010]/60' : 'text-[#101010]/60',
            )}
          >
            {isTechnical ? 'All account activity' : 'Recent transactions'}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
          className="h-8 w-8 p-0"
        >
          <RefreshCw
            className={cn('h-4 w-4', isRefreshing && 'animate-spin')}
          />
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[#101010]/40" />
          </div>
        ) : isBankError && !isNoCustomerState ? (
          <div className="px-6 py-8">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">Error loading activity</p>
            </div>
            <p className="text-sm text-[#101010]/60 mt-1">
              {bankError?.message || 'Please try again later.'}
            </p>
          </div>
        ) : !hasTransactions || isNoCustomerState ? (
          <div className="px-6 py-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-[#F7F7F2] flex items-center justify-center">
                <Building2 className="h-6 w-6 text-[#101010]/40" />
              </div>
            </div>
            <p className="text-[15px] font-medium text-[#101010] mb-1">
              No activity yet
            </p>
            <p className="text-[13px] text-[#101010]/60 max-w-[280px] mx-auto">
              Your transactions will appear here once you start using your
              account.
            </p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {groupOrder.map((group) => {
              const txs = groupedTransactions[group];
              if (!txs || txs.length === 0) return null;

              return (
                <div key={group}>
                  <div className="px-4 py-2 bg-[#F7F7F2]">
                    <p className="text-[11px] font-medium text-[#101010]/60 uppercase tracking-[0.14em]">
                      {group}
                    </p>
                  </div>
                  {txs.map((tx) => (
                    <TransactionRow
                      key={tx.id}
                      tx={tx}
                      isTechnical={isTechnical}
                      onApprove={
                        tx.needsAction ? () => handleApprove(tx) : undefined
                      }
                      onDismiss={
                        tx.needsAction ? () => handleDismiss(tx) : undefined
                      }
                      isActionPending={actionPendingIds.has(
                        tx.proposalId || tx.alignTransferId || '',
                      )}
                    />
                  ))}
                </div>
              );
            })}
          </Accordion>
        )}
      </CardContent>

      {/* Resume Transfer Modal */}
      {resumeTransferId && (
        <ResumeTransferModal
          transferId={resumeTransferId}
          isOpen={!!resumeTransferId}
          onClose={() => setResumeTransferId(null)}
          onSuccess={handleResumeSuccess}
        />
      )}
    </Card>
  );
}
