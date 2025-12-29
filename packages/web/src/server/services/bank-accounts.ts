/**
 * Bank Accounts Service
 *
 * Shared service for fetching user's bank accounts (virtual accounts for receiving).
 * Used by AI Email agent and MCP server.
 *
 * Filtering logic:
 * - Only show US ACH and IBAN accounts
 * - Hide starter accounts if user has full accounts (same type)
 * - Show one account per type (prefer full tier)
 */

import { db } from '@/db';
import { userFundingSources, workspaces } from '@/db/schema';
import { eq } from 'drizzle-orm';

export type BankAccountInfo = {
  id: string;
  type: 'us_ach' | 'iban';
  bank_name: string;
  last_4: string;
  currency: string;
  account_tier: 'starter' | 'full';
  display_name: string; // e.g., "🇺🇸 Mercury Bank ••••1234"
};

export type ListBankAccountsResult = {
  bank_accounts: BankAccountInfo[];
  count: number;
};

export type BankAccountsError = {
  error: string;
};

/**
 * Get bank accounts (virtual accounts for receiving) for a workspace.
 * Filters to show only US ACH and IBAN, preferring full tier over starter.
 */
export async function listBankAccountsByWorkspace(
  workspaceId: string,
): Promise<ListBankAccountsResult | BankAccountsError> {
  try {
    // Get workspace to check KYC status
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    });

    if (!workspace) {
      return { error: 'Workspace not found' };
    }

    // Get all Align funding sources for this workspace
    const fundingSources = await db.query.userFundingSources.findMany({
      where: eq(userFundingSources.workspaceId, workspaceId),
    });

    // Filter for Align sources only
    const alignSources = fundingSources.filter(
      (source) => source.sourceProvider === 'align',
    );

    // Filter to only US ACH and IBAN account types
    const supportedTypes = ['us_ach', 'iban'] as const;
    const filteredSources = alignSources.filter((source) =>
      supportedTypes.includes(source.sourceAccountType as 'us_ach' | 'iban'),
    );

    // Group by account type
    const byType = new Map<string, typeof filteredSources>();
    for (const source of filteredSources) {
      const type = source.sourceAccountType;
      if (!byType.has(type)) {
        byType.set(type, []);
      }
      byType.get(type)!.push(source);
    }

    // For each type, prefer full tier over starter
    const selectedAccounts: typeof filteredSources = [];
    for (const [_type, accounts] of byType) {
      const fullAccounts = accounts.filter((acc) => acc.accountTier === 'full');
      const starterAccounts = accounts.filter(
        (acc) => acc.accountTier === 'starter',
      );

      // Use full account if available, otherwise starter
      const accountToUse = fullAccounts[0] || starterAccounts[0];
      if (accountToUse) {
        selectedAccounts.push(accountToUse);
      }
    }

    // Transform to simplified format
    const bankAccounts: BankAccountInfo[] = selectedAccounts.map((source) => {
      const isUs = source.sourceAccountType === 'us_ach';
      const last4 = isUs
        ? source.sourceAccountNumber?.slice(-4) || '****'
        : source.sourceIban?.slice(-4) || '****';
      const bankName = source.sourceBankName || (isUs ? 'US Bank' : 'EU Bank');
      const icon = isUs ? '🇺🇸' : '🇪🇺';

      return {
        id: source.id,
        type: source.sourceAccountType as 'us_ach' | 'iban',
        bank_name: bankName,
        last_4: last4,
        currency: source.sourceCurrency || (isUs ? 'USD' : 'EUR'),
        account_tier: (source.accountTier as 'starter' | 'full') || 'full',
        display_name: `${icon} ${bankName} ••••${last4}`,
      };
    });

    return {
      bank_accounts: bankAccounts,
      count: bankAccounts.length,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get bank accounts by user's Privy DID.
 * Looks up the user's primary workspace first.
 */
export async function listBankAccountsByUserDid(
  userDid: string,
): Promise<ListBankAccountsResult | BankAccountsError> {
  try {
    // Find user's workspace
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.createdBy, userDid),
    });

    if (!workspace) {
      return { error: 'No workspace found for user' };
    }

    return listBankAccountsByWorkspace(workspace.id);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
