import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { db } from '@/db';
import {
  userDestinationBankAccounts,
  offrampTransfers,
  workspaces,
} from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { alignApi } from '@/server/services/align-api';
import { getSpendableBalanceByWorkspace } from '@/server/services/spendable-balance';
import type { ApiKeyContext } from './api-key';

/**
 * Create an MCP server instance for a specific workspace context
 */
export function createMcpServer(context: ApiKeyContext) {
  const server = new McpServer({
    name: '0-finance',
    version: '1.0.0',
  });

  // =========================================================================
  // Tool 1: list_saved_bank_accounts
  // =========================================================================
  server.tool(
    'list_saved_bank_accounts',
    'List saved bank accounts for this workspace. Use these IDs when proposing transfers.',
    {},
    async () => {
      try {
        // Get the workspace owner to find their bank accounts
        const workspace = await db.query.workspaces.findFirst({
          where: eq(workspaces.id, context.workspaceId),
        });

        if (!workspace) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: 'Workspace not found' }),
              },
            ],
          };
        }

        const bankAccounts = await db
          .select({
            id: userDestinationBankAccounts.id,
            accountName: userDestinationBankAccounts.accountName,
            accountType: userDestinationBankAccounts.accountType,
            bankName: userDestinationBankAccounts.bankName,
            // Only return last 4 digits for security
            ibanLast4: userDestinationBankAccounts.ibanNumber,
            accountNumberLast4: userDestinationBankAccounts.accountNumber,
          })
          .from(userDestinationBankAccounts)
          .where(eq(userDestinationBankAccounts.userId, workspace.createdBy));

        const sanitized = bankAccounts.map((acc) => ({
          id: acc.id,
          name: acc.accountName || `${acc.bankName || 'Bank'} Account`,
          type: acc.accountType,
          bank_name: acc.bankName,
          last_4:
            acc.ibanLast4?.slice(-4) ||
            acc.accountNumberLast4?.slice(-4) ||
            '****',
        }));

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                bank_accounts: sanitized,
                count: sanitized.length,
              }),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: error instanceof Error ? error.message : 'Unknown error',
              }),
            },
          ],
        };
      }
    },
  );

  // =========================================================================
  // Tool 2: get_balance
  // =========================================================================
  server.tool(
    'get_balance',
    'Get the current USDC balance available for transfers. Returns idle (in Safe), earning (in vaults), and total spendable balance.',
    {},
    async () => {
      try {
        const result = await getSpendableBalanceByWorkspace(
          context.workspaceId,
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: error instanceof Error ? error.message : 'Unknown error',
              }),
            },
          ],
        };
      }
    },
  );

  // =========================================================================
  // Tool 3: propose_bank_transfer
  // =========================================================================
  server.tool(
    'propose_bank_transfer',
    'Propose a bank transfer for user approval. The user must approve this in the UI before funds are sent.',
    {
      amount_usdc: z
        .string()
        .describe('Amount in USDC to send (e.g., "1000.00")'),
      destination_currency: z
        .enum(['usd', 'eur'])
        .describe('Target currency for the bank'),
      saved_bank_account_id: z
        .string()
        .optional()
        .describe('ID of a saved bank account (from list_saved_bank_accounts)'),
      reason: z
        .string()
        .optional()
        .describe('Why is this transfer being proposed? (shown to user)'),
    },
    async ({
      amount_usdc,
      destination_currency,
      saved_bank_account_id,
      reason,
    }) => {
      try {
        if (!context.alignCustomerId) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error:
                    'KYC not completed. User must complete KYC before transfers.',
                }),
              },
            ],
          };
        }

        // Get workspace
        const workspace = await db.query.workspaces.findFirst({
          where: eq(workspaces.id, context.workspaceId),
        });

        if (!workspace) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: 'Workspace not found' }),
              },
            ],
          };
        }

        // Get bank account details
        if (!saved_bank_account_id) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error:
                    'saved_bank_account_id is required. Use list_saved_bank_accounts to get available accounts.',
                }),
              },
            ],
          };
        }

        const bankAccount =
          await db.query.userDestinationBankAccounts.findFirst({
            where: and(
              eq(userDestinationBankAccounts.id, saved_bank_account_id),
              eq(userDestinationBankAccounts.userId, workspace.createdBy),
            ),
          });

        if (!bankAccount) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: 'Bank account not found' }),
              },
            ],
          };
        }

        // Get a quote from Align
        const paymentRails = destination_currency === 'eur' ? 'sepa' : 'ach';

        const quote = await alignApi.getOfframpQuote(context.alignCustomerId, {
          source_amount: amount_usdc,
          source_token: 'usdc',
          source_network: 'base',
          destination_currency,
          destination_payment_rails: paymentRails,
        });

        // Build bank account payload for Align
        // Convert null to undefined for AlignDestinationBankAccount compatibility
        const alignBankAccount: import('@/server/services/align-api').AlignDestinationBankAccount =
          {
            bank_name: bankAccount.bankName || 'Bank',
            account_holder_type: bankAccount.accountHolderType as
              | 'individual'
              | 'business',
            account_holder_address: {
              country: bankAccount.country || 'US',
              city: bankAccount.city || '',
              street_line_1: bankAccount.streetLine1 || '',
              postal_code: bankAccount.postalCode || '',
            },
            account_type: bankAccount.accountType as 'us' | 'iban',
            ...(bankAccount.accountHolderType === 'individual' && {
              account_holder_first_name:
                bankAccount.accountHolderFirstName ?? undefined,
              account_holder_last_name:
                bankAccount.accountHolderLastName ?? undefined,
            }),
            ...(bankAccount.accountHolderType === 'business' && {
              account_holder_business_name:
                bankAccount.accountHolderBusinessName ?? undefined,
            }),
            ...(bankAccount.accountType === 'us' && {
              us: {
                account_number: bankAccount.accountNumber!,
                routing_number: bankAccount.routingNumber!,
              },
            }),
            ...(bankAccount.accountType === 'iban' && {
              iban: {
                iban_number: bankAccount.ibanNumber!.replace(/\s/g, ''),
                bic: bankAccount.bicSwift!.replace(/\s/g, ''),
              },
            }),
          };

        // Create transfer from quote
        const transfer = await alignApi.createTransferFromQuote(
          context.alignCustomerId,
          quote.quote_id,
          alignBankAccount,
        );

        // Store in our DB with agent proposal flags
        await db.insert(offrampTransfers).values({
          userId: workspace.createdBy,
          workspaceId: context.workspaceId,
          alignTransferId: transfer.id,
          status: transfer.status as any,
          amountToSend: amount_usdc,
          destinationCurrency: destination_currency,
          destinationPaymentRails: paymentRails,
          destinationBankAccountId: saved_bank_account_id,
          destinationBankAccountSnapshot: JSON.stringify({
            bankName: bankAccount.bankName,
            accountType: bankAccount.accountType,
            last4:
              bankAccount.ibanNumber?.slice(-4) ||
              bankAccount.accountNumber?.slice(-4),
          }),
          depositAmount: transfer.quote.deposit_amount,
          depositToken: transfer.quote.deposit_token,
          depositNetwork: transfer.quote.deposit_network,
          depositAddress: transfer.quote.deposit_blockchain_address,
          feeAmount: transfer.quote.fee_amount,
          quoteExpiresAt: transfer.quote.expires_at
            ? new Date(transfer.quote.expires_at)
            : null,
          // Agent proposal fields
          proposedByAgent: true,
          agentProposalMessage: reason || 'Proposed via MCP agent',
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                proposal_id: transfer.id,
                status: 'pending_user_approval',
                message:
                  'Transfer proposed. User must approve in the 0 Finance dashboard.',
                details: {
                  amount_usdc: amount_usdc,
                  destination_currency: destination_currency,
                  destination_amount: quote.destination_amount,
                  fee_usdc: transfer.quote.fee_amount,
                  bank_account: bankAccount.bankName,
                  expires_at: transfer.quote.expires_at,
                },
              }),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: error instanceof Error ? error.message : 'Unknown error',
              }),
            },
          ],
        };
      }
    },
  );

  // =========================================================================
  // Tool 4: list_proposals
  // =========================================================================
  server.tool(
    'list_proposals',
    'List pending transfer proposals and their status.',
    {
      include_completed: z
        .boolean()
        .optional()
        .describe('Include completed/processed transfers (default: false)'),
    },
    async ({ include_completed }) => {
      try {
        const workspace = await db.query.workspaces.findFirst({
          where: eq(workspaces.id, context.workspaceId),
        });

        if (!workspace) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: 'Workspace not found' }),
              },
            ],
          };
        }

        // Get transfers proposed by agent
        const transfers = await db
          .select({
            id: offrampTransfers.alignTransferId,
            status: offrampTransfers.status,
            amount_usdc: offrampTransfers.amountToSend,
            destination_currency: offrampTransfers.destinationCurrency,
            deposit_amount: offrampTransfers.depositAmount,
            fee_amount: offrampTransfers.feeAmount,
            proposal_message: offrampTransfers.agentProposalMessage,
            created_at: offrampTransfers.createdAt,
            quote_expires_at: offrampTransfers.quoteExpiresAt,
            dismissed: offrampTransfers.dismissed,
          })
          .from(offrampTransfers)
          .where(
            and(
              eq(offrampTransfers.workspaceId, context.workspaceId),
              eq(offrampTransfers.proposedByAgent, true),
            ),
          )
          .orderBy(desc(offrampTransfers.createdAt))
          .limit(20);

        // Filter based on include_completed flag
        const filtered = include_completed
          ? transfers
          : transfers.filter((t) => t.status === 'pending' && !t.dismissed);

        const proposals = filtered.map((t) => ({
          id: t.id,
          status: t.dismissed ? 'dismissed' : t.status,
          amount_usdc: t.amount_usdc,
          destination_currency: t.destination_currency,
          deposit_amount: t.deposit_amount,
          fee_amount: t.fee_amount,
          reason: t.proposal_message,
          created_at: t.created_at?.toISOString(),
          quote_expired: t.quote_expires_at
            ? new Date(t.quote_expires_at) < new Date()
            : false,
        }));

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                proposals,
                count: proposals.length,
                pending_count: proposals.filter((p) => p.status === 'pending')
                  .length,
              }),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: error instanceof Error ? error.message : 'Unknown error',
              }),
            },
          ],
        };
      }
    },
  );

  return server;
}
