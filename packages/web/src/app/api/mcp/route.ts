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
            {
              name: 'create_bank_account',
              description:
                'Save a new bank account for future transfers. All fields are required - extract from invoice or ask user.',
              inputSchema: {
                type: 'object',
                properties: {
                  account_name: {
                    type: 'string',
                    description:
                      'Nickname for the account (e.g., "Cyprien N26")',
                  },
                  bank_name: {
                    type: 'string',
                    description: 'Name of the bank (e.g., "N26", "Chase")',
                  },
                  account_holder_type: {
                    type: 'string',
                    enum: ['individual', 'business'],
                    description: 'Type of account holder',
                  },
                  account_holder_first_name: {
                    type: 'string',
                    description:
                      'First name (required for individual accounts)',
                  },
                  account_holder_last_name: {
                    type: 'string',
                    description: 'Last name (required for individual accounts)',
                  },
                  account_holder_business_name: {
                    type: 'string',
                    description:
                      'Business name (required for business accounts)',
                  },
                  country: {
                    type: 'string',
                    description: 'Country code (e.g., "DE", "US")',
                  },
                  city: {
                    type: 'string',
                    description: 'City name',
                  },
                  street_line_1: {
                    type: 'string',
                    description: 'Street address line 1',
                  },
                  street_line_2: {
                    type: 'string',
                    description: 'Street address line 2 (optional)',
                  },
                  postal_code: {
                    type: 'string',
                    description: 'Postal/ZIP code',
                  },
                  account_type: {
                    type: 'string',
                    enum: ['us', 'iban'],
                    description: 'Type of bank account',
                  },
                  account_number: {
                    type: 'string',
                    description: 'Account number (required for US accounts)',
                  },
                  routing_number: {
                    type: 'string',
                    description: 'Routing number (required for US accounts)',
                  },
                  iban_number: {
                    type: 'string',
                    description: 'IBAN (required for IBAN accounts)',
                  },
                  bic_swift: {
                    type: 'string',
                    description: 'BIC/SWIFT code (required for IBAN accounts)',
                  },
                  is_default: {
                    type: 'boolean',
                    description:
                      'Set as default account for transfers (default: false)',
                  },
                },
                required: [
                  'account_name',
                  'bank_name',
                  'account_holder_type',
                  'country',
                  'city',
                  'street_line_1',
                  'postal_code',
                  'account_type',
                ],
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

      case 'create_bank_account':
        return await createBankAccount(
          context,
          args as {
            account_name: string;
            bank_name: string;
            account_holder_type: 'individual' | 'business';
            account_holder_first_name?: string;
            account_holder_last_name?: string;
            account_holder_business_name?: string;
            country: string;
            city: string;
            street_line_1: string;
            street_line_2?: string;
            postal_code: string;
            account_type: 'us' | 'iban';
            account_number?: string;
            routing_number?: string;
            iban_number?: string;
            bic_swift?: string;
            is_default?: boolean;
          },
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

async function createBankAccount(
  context: NonNullable<Awaited<ReturnType<typeof validateApiKey>>>,
  args: {
    account_name: string;
    bank_name: string;
    account_holder_type: 'individual' | 'business';
    account_holder_first_name?: string;
    account_holder_last_name?: string;
    account_holder_business_name?: string;
    country: string;
    city: string;
    street_line_1: string;
    street_line_2?: string;
    postal_code: string;
    account_type: 'us' | 'iban';
    account_number?: string;
    routing_number?: string;
    iban_number?: string;
    bic_swift?: string;
    is_default?: boolean;
  },
) {
  const {
    account_name,
    bank_name,
    account_holder_type,
    account_holder_first_name,
    account_holder_last_name,
    account_holder_business_name,
    country,
    city,
    street_line_1,
    street_line_2,
    postal_code,
    account_type,
    account_number,
    routing_number,
    iban_number,
    bic_swift,
    is_default = false,
  } = args;

  // Validate required fields based on account holder type
  if (account_holder_type === 'individual') {
    if (!account_holder_first_name || !account_holder_last_name) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error:
                'First name and last name are required for individual accounts',
            }),
          },
        ],
      };
    }
  } else if (account_holder_type === 'business') {
    if (!account_holder_business_name) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: 'Business name is required for business accounts',
            }),
          },
        ],
      };
    }
  }

  // Validate required fields based on account type
  if (account_type === 'us') {
    if (!account_number || !routing_number) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error:
                'Account number and routing number are required for US accounts',
            }),
          },
        ],
      };
    }
  } else if (account_type === 'iban') {
    if (!iban_number || !bic_swift) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: 'IBAN and BIC/SWIFT are required for IBAN accounts',
            }),
          },
        ],
      };
    }
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

  const userId = workspace.createdBy;

  // If setting this account as default, unset any existing default
  if (is_default) {
    await db
      .update(userDestinationBankAccounts)
      .set({ isDefault: false })
      .where(eq(userDestinationBankAccounts.userId, userId));
  }

  // Insert the new bank account
  const [newAccount] = await db
    .insert(userDestinationBankAccounts)
    .values({
      userId,
      accountName: account_name,
      bankName: bank_name,
      accountHolderType: account_holder_type,
      accountHolderFirstName:
        account_holder_type === 'individual' ? account_holder_first_name : null,
      accountHolderLastName:
        account_holder_type === 'individual' ? account_holder_last_name : null,
      accountHolderBusinessName:
        account_holder_type === 'business'
          ? account_holder_business_name
          : null,
      country,
      city,
      streetLine1: street_line_1,
      streetLine2: street_line_2 ?? null,
      postalCode: postal_code,
      accountType: account_type,
      accountNumber: account_type === 'us' ? account_number : null,
      routingNumber: account_type === 'us' ? routing_number : null,
      ibanNumber: account_type === 'iban' ? iban_number : null,
      bicSwift: account_type === 'iban' ? bic_swift : null,
      isDefault: is_default,
    })
    .returning({
      id: userDestinationBankAccounts.id,
      accountName: userDestinationBankAccounts.accountName,
      isDefault: userDestinationBankAccounts.isDefault,
    });

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          bank_account: {
            id: newAccount.id,
            name: newAccount.accountName,
            bank_name,
            account_type,
            is_default: newAccount.isDefault,
            last_4:
              account_type === 'iban'
                ? iban_number?.slice(-4)
                : account_number?.slice(-4),
          },
          message: 'Bank account saved. You can now use this ID for transfers.',
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
