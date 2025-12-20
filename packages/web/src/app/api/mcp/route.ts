import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/mcp/api-key';
import { db } from '@/db';
import {
  userDestinationBankAccounts,
  offrampTransfers,
  workspaces,
} from '@/db/schema';
import { userSafes } from '@/db/schema/user-safes';
import { eq, and, desc } from 'drizzle-orm';
import { createPublicClient, http, formatUnits } from 'viem';
import { base } from 'viem/chains';
import { alignApi } from '@/server/services/align-api';
import type { AlignDestinationBankAccount } from '@/server/services/align-api';

// USDC on Base
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const USDC_DECIMALS = 6;

const ERC20_BALANCE_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
] as const;

/**
 * Extract and validate API key from request
 */
async function authenticateRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  const apiKey = authHeader.slice(7);
  return validateApiKey(apiKey);
}

/**
 * Simple JSON-RPC MCP handler
 * Implements the MCP protocol directly without the SDK transport layer
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate
    const context = await authenticateRequest(request);
    if (!context) {
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          error: {
            code: -32001,
            message: 'Unauthorized: Invalid or missing API key',
          },
          id: null,
        },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { method, params, id } = body;

    // Handle MCP methods
    let result: unknown;

    switch (method) {
      case 'initialize':
        result = {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: '0-finance',
            version: '1.0.0',
          },
        };
        break;

      case 'tools/list':
        result = {
          tools: [
            {
              name: 'list_saved_bank_accounts',
              description:
                'List saved bank accounts for this workspace. Use these IDs when proposing transfers.',
              inputSchema: {
                type: 'object',
                properties: {},
                required: [],
              },
            },
            {
              name: 'get_balance',
              description:
                'Get the current USDC balance available for transfers.',
              inputSchema: {
                type: 'object',
                properties: {},
                required: [],
              },
            },
            {
              name: 'propose_bank_transfer',
              description:
                'Propose a bank transfer for user approval. The user must approve this in the UI before funds are sent.',
              inputSchema: {
                type: 'object',
                properties: {
                  amount_usdc: {
                    type: 'string',
                    description: 'Amount in USDC to send (e.g., "1000.00")',
                  },
                  destination_currency: {
                    type: 'string',
                    enum: ['usd', 'eur'],
                    description: 'Target currency for the bank',
                  },
                  saved_bank_account_id: {
                    type: 'string',
                    description:
                      'ID of a saved bank account (from list_saved_bank_accounts)',
                  },
                  reason: {
                    type: 'string',
                    description:
                      'Why is this transfer being proposed? (shown to user)',
                  },
                },
                required: [
                  'amount_usdc',
                  'destination_currency',
                  'saved_bank_account_id',
                ],
              },
            },
            {
              name: 'list_proposals',
              description: 'List pending transfer proposals and their status.',
              inputSchema: {
                type: 'object',
                properties: {
                  include_completed: {
                    type: 'boolean',
                    description:
                      'Include completed/processed transfers (default: false)',
                  },
                },
                required: [],
              },
            },
          ],
        };
        break;

      case 'tools/call':
        result = await handleToolCall(context, params);
        break;

      default:
        return NextResponse.json({
          jsonrpc: '2.0',
          error: {
            code: -32601,
            message: `Method not found: ${method}`,
          },
          id,
        });
    }

    return NextResponse.json({
      jsonrpc: '2.0',
      result,
      id,
    });
  } catch (error) {
    console.error('[MCP] Error handling request:', error);
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message:
            error instanceof Error ? error.message : 'Internal server error',
        },
        id: null,
      },
      { status: 500 },
    );
  }
}

/**
 * Handle tool calls
 */
async function handleToolCall(
  context: NonNullable<Awaited<ReturnType<typeof validateApiKey>>>,
  params: { name: string; arguments?: Record<string, unknown> },
) {
  const { name, arguments: args = {} } = params;

  try {
    switch (name) {
      case 'list_saved_bank_accounts':
        return await listSavedBankAccounts(context);

      case 'get_balance':
        return await getBalance(context);

      case 'propose_bank_transfer':
        return await proposeBankTransfer(
          context,
          args as {
            amount_usdc: string;
            destination_currency: 'usd' | 'eur';
            saved_bank_account_id: string;
            reason?: string;
          },
        );

      case 'list_proposals':
        return await listProposals(
          context,
          args as { include_completed?: boolean },
        );

      default:
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ error: `Unknown tool: ${name}` }),
            },
          ],
        };
    }
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
}

// =========================================================================
// Tool implementations
// =========================================================================

async function listSavedBankAccounts(
  context: NonNullable<Awaited<ReturnType<typeof validateApiKey>>>,
) {
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
      acc.ibanLast4?.slice(-4) || acc.accountNumberLast4?.slice(-4) || '****',
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
}

async function getBalance(
  context: NonNullable<Awaited<ReturnType<typeof validateApiKey>>>,
) {
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

  const primarySafe = await db.query.userSafes.findFirst({
    where: and(
      eq(userSafes.userDid, workspace.createdBy),
      eq(userSafes.chainId, 8453),
      eq(userSafes.safeType, 'primary'),
    ),
  });

  if (!primarySafe) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: 'No primary Safe found on Base',
            usdc_balance: '0',
          }),
        },
      ],
    };
  }

  const publicClient = createPublicClient({
    chain: base,
    transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
  });

  const balance = await publicClient.readContract({
    address: USDC_ADDRESS,
    abi: ERC20_BALANCE_ABI,
    functionName: 'balanceOf',
    args: [primarySafe.safeAddress as `0x${string}`],
  });

  const formattedBalance = formatUnits(balance as bigint, USDC_DECIMALS);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          usdc_balance: formattedBalance,
          safe_address: primarySafe.safeAddress,
          chain: 'base',
        }),
      },
    ],
  };
}

async function proposeBankTransfer(
  context: NonNullable<Awaited<ReturnType<typeof validateApiKey>>>,
  args: {
    amount_usdc: string;
    destination_currency: 'usd' | 'eur';
    saved_bank_account_id: string;
    reason?: string;
  },
) {
  const { amount_usdc, destination_currency, saved_bank_account_id, reason } =
    args;

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

  const bankAccount = await db.query.userDestinationBankAccounts.findFirst({
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

  const paymentRails = destination_currency === 'eur' ? 'sepa' : 'ach';

  const quote = await alignApi.getOfframpQuote(context.alignCustomerId, {
    source_amount: amount_usdc,
    source_token: 'usdc',
    source_network: 'base',
    destination_currency,
    destination_payment_rails: paymentRails,
  });

  const alignBankAccount: AlignDestinationBankAccount = {
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
      account_holder_last_name: bankAccount.accountHolderLastName ?? undefined,
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

  const transfer = await alignApi.createTransferFromQuote(
    context.alignCustomerId,
    quote.quote_id,
    alignBankAccount,
  );

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
            amount_usdc,
            destination_currency,
            destination_amount: quote.destination_amount,
            fee_usdc: transfer.quote.fee_amount,
            bank_account: bankAccount.bankName,
            expires_at: transfer.quote.expires_at,
          },
        }),
      },
    ],
  };
}

async function listProposals(
  context: NonNullable<Awaited<ReturnType<typeof validateApiKey>>>,
  args: { include_completed?: boolean },
) {
  const { include_completed } = args;

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
          pending_count: proposals.filter((p) => p.status === 'pending').length,
        }),
      },
    ],
  };
}

/**
 * OPTIONS /api/mcp - CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type, Authorization, mcp-session-id',
      'Access-Control-Expose-Headers': 'Mcp-Session-Id',
    },
  });
}
