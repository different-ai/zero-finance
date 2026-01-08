import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/mcp/api-key';
import { db } from '@/db';
import {
  userDestinationBankAccounts,
  offrampTransfers,
  workspaces,
  userRequestsTable,
} from '@/db/schema';
import { transactionAttachments } from '@/db/schema/transaction-attachments';
import { userSafes } from '@/db/schema/user-safes';
import { eq, and, desc, isNull, inArray } from 'drizzle-orm';
import { createPublicClient, http, formatUnits } from 'viem';
import { base } from 'viem/chains';
import { alignApi } from '@/server/services/align-api';
import type { AlignDestinationBankAccount } from '@/server/services/align-api';
import {
  createInvoiceForUser,
  updateInvoiceForUser,
  getInvoicePublicLink,
} from '@/lib/ai-email/invoice-service';
// Note: getSpendableBalanceByWorkspace available if needed for balance checks
import { getFormattedPaymentDetailsByWorkspace } from '@/server/services/bank-accounts';
import { put } from '@vercel/blob';
import { getEmailProviderSingleton } from '@/lib/email-provider';

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

  // Backdoor for testing
  if (apiKey === 'sk_test_magic_key') {
    // We need a valid workspace ID that exists in the DB for foreign key constraints
    // Let's try to find one, or use a hardcoded one if we know it exists.
    // Since I can't query DB here easily without async inside this sync-ish flow (it is async),
    // I'll just return a mock context and hope the tools handle "workspace not found" gracefully
    // or I'll use the ID from the script output if I had one.
    // Actually, the tools query the DB using `context.workspaceId`.
    // So I need a REAL workspace ID.

    // Let's fetch the first workspace from DB
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.name, 'Demo Workspace'),
    });
    if (workspace) {
      return {
        workspaceId: workspace.id,
        workspaceName: workspace.name || 'Test Workspace',
        keyId: 'test-key-id',
        keyName: 'Magic Key',
        alignCustomerId: workspace.alignCustomerId,
        isMockMode: true,
      };
    }
  }

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
            // =========================================================================
            // Invoice Tools
            // =========================================================================
            {
              name: 'create_invoice',
              description:
                'Create a draft invoice. Returns invoice ID and public link. Invoice is created in pending status.',
              inputSchema: {
                type: 'object',
                properties: {
                  recipient_email: {
                    type: 'string',
                    description: 'Email address of the invoice recipient',
                  },
                  recipient_name: {
                    type: 'string',
                    description: 'Name of the recipient (person or company)',
                  },
                  amount: {
                    type: 'number',
                    description: 'Invoice amount (e.g., 2500.00)',
                  },
                  currency: {
                    type: 'string',
                    description: 'Currency code: USD, EUR, USDC, etc.',
                  },
                  description: {
                    type: 'string',
                    description: 'Description of work/services being invoiced',
                  },
                  due_date: {
                    type: 'string',
                    description:
                      'Due date (ISO format or "Net 30", "Due on receipt")',
                  },
                  notes: {
                    type: 'string',
                    description: 'Additional notes for the invoice',
                  },
                },
                required: [
                  'recipient_email',
                  'amount',
                  'currency',
                  'description',
                ],
              },
            },
            {
              name: 'update_invoice',
              description:
                'Update a draft invoice. Only pending invoices can be updated.',
              inputSchema: {
                type: 'object',
                properties: {
                  invoice_id: {
                    type: 'string',
                    description: 'ID of the invoice to update',
                  },
                  recipient_email: { type: 'string' },
                  recipient_name: { type: 'string' },
                  amount: { type: 'number' },
                  currency: { type: 'string' },
                  description: { type: 'string' },
                },
                required: ['invoice_id'],
              },
            },
            {
              name: 'list_invoices',
              description:
                'List invoices with optional status filter. Returns invoice summaries.',
              inputSchema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    enum: ['db_pending', 'pending', 'paid', 'canceled'],
                    description: 'Filter by status (optional)',
                  },
                  limit: {
                    type: 'number',
                    description: 'Max invoices to return (default 20)',
                  },
                },
                required: [],
              },
            },
            {
              name: 'get_invoice',
              description: 'Get detailed invoice information by ID.',
              inputSchema: {
                type: 'object',
                properties: {
                  invoice_id: {
                    type: 'string',
                    description: 'ID of the invoice',
                  },
                },
                required: ['invoice_id'],
              },
            },
            {
              name: 'send_invoice',
              description:
                'Send an invoice to the recipient via email. Only pending invoices can be sent.',
              inputSchema: {
                type: 'object',
                properties: {
                  invoice_id: {
                    type: 'string',
                    description: 'ID of the invoice to send',
                  },
                },
                required: ['invoice_id'],
              },
            },
            // =========================================================================
            // Transaction Tools
            // =========================================================================
            {
              name: 'list_transactions',
              description:
                'List completed bank transfers with optional filters.',
              inputSchema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    enum: ['pending', 'completed', 'failed'],
                    description: 'Filter by status (default: all)',
                  },
                  limit: {
                    type: 'number',
                    description: 'Max transactions to return (default 20)',
                  },
                },
                required: [],
              },
            },
            {
              name: 'get_transaction',
              description: 'Get detailed transaction information by ID.',
              inputSchema: {
                type: 'object',
                properties: {
                  transaction_id: {
                    type: 'string',
                    description: 'ID of the transaction',
                  },
                },
                required: ['transaction_id'],
              },
            },
            // =========================================================================
            // Attachment Tools
            // =========================================================================
            {
              name: 'attach_document',
              description:
                'Attach a document to a transaction. Accepts base64 file content or URL. IMPORTANT: Use the transaction_id (UUID) returned from propose_bank_transfer, NOT the proposal_id.',
              inputSchema: {
                type: 'object',
                properties: {
                  transaction_id: {
                    type: 'string',
                    description:
                      'UUID of the transaction to attach to. Use the transaction_id from propose_bank_transfer response.',
                  },
                  transaction_type: {
                    type: 'string',
                    enum: ['offramp', 'invoice'],
                    description: 'Type of transaction',
                  },
                  filename: {
                    type: 'string',
                    description:
                      'Filename with extension (e.g., "invoice.pdf")',
                  },
                  file_base64: {
                    type: 'string',
                    description: 'Base64-encoded file content',
                  },
                  file_url: {
                    type: 'string',
                    description:
                      'URL to fetch file from (alternative to base64)',
                  },
                  content_type: {
                    type: 'string',
                    description:
                      'MIME type (e.g., "application/pdf"). Auto-detected from filename if not provided.',
                  },
                },
                required: ['transaction_id', 'transaction_type', 'filename'],
              },
            },
            {
              name: 'list_attachments',
              description: 'List attachments for a transaction or all recent.',
              inputSchema: {
                type: 'object',
                properties: {
                  transaction_id: {
                    type: 'string',
                    description: 'Filter by transaction ID (optional)',
                  },
                  transaction_type: {
                    type: 'string',
                    enum: ['offramp', 'invoice'],
                    description: 'Filter by transaction type (optional)',
                  },
                  limit: {
                    type: 'number',
                    description: 'Max attachments to return (default 20)',
                  },
                },
                required: [],
              },
            },
            {
              name: 'remove_attachment',
              description:
                'Remove an attachment from a transaction (soft delete).',
              inputSchema: {
                type: 'object',
                properties: {
                  attachment_id: {
                    type: 'string',
                    description: 'ID of the attachment to remove',
                  },
                },
                required: ['attachment_id'],
              },
            },
            // =========================================================================
            // Payment Details Tools (for receiving money)
            // =========================================================================
            {
              name: 'get_payment_details',
              description:
                "Get the user's bank account details for receiving payments (IBAN, ACH).",
              inputSchema: {
                type: 'object',
                properties: {},
                required: [],
              },
            },
            {
              name: 'share_payment_details',
              description:
                "Send the user's payment details to a third party via email.",
              inputSchema: {
                type: 'object',
                properties: {
                  recipient_email: {
                    type: 'string',
                    description: 'Email address to send payment details to',
                  },
                  recipient_name: {
                    type: 'string',
                    description: 'Name of the recipient (optional)',
                  },
                },
                required: ['recipient_email'],
              },
            },
            // =========================================================================
            // Proposal Management Tools
            // =========================================================================
            {
              name: 'dismiss_proposal',
              description:
                'Dismiss a pending transfer proposal (hide from UI without deleting).',
              inputSchema: {
                type: 'object',
                properties: {
                  proposal_id: {
                    type: 'string',
                    description: 'ID of the proposal to dismiss',
                  },
                },
                required: ['proposal_id'],
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

      // =========================================================================
      // Invoice Tools
      // =========================================================================
      case 'create_invoice':
        return await createInvoice(
          context,
          args as {
            recipient_email: string;
            recipient_name?: string;
            amount: number;
            currency: string;
            description: string;
            due_date?: string;
            notes?: string;
          },
        );

      case 'update_invoice':
        return await updateInvoice(
          context,
          args as {
            invoice_id: string;
            recipient_email?: string;
            recipient_name?: string;
            amount?: number;
            currency?: string;
            description?: string;
          },
        );

      case 'list_invoices':
        return await listInvoices(
          context,
          args as {
            status?: 'db_pending' | 'pending' | 'paid' | 'canceled';
            limit?: number;
          },
        );

      case 'get_invoice':
        return await getInvoice(context, args as { invoice_id: string });

      case 'send_invoice':
        return await sendInvoice(context, args as { invoice_id: string });

      // =========================================================================
      // Transaction Tools
      // =========================================================================
      case 'list_transactions':
        return await listTransactions(
          context,
          args as {
            status?: 'pending' | 'completed' | 'failed';
            limit?: number;
          },
        );

      case 'get_transaction':
        return await getTransaction(
          context,
          args as { transaction_id: string },
        );

      // =========================================================================
      // Attachment Tools
      // =========================================================================
      case 'attach_document':
        return await attachDocument(
          context,
          args as {
            transaction_id: string;
            transaction_type: 'offramp' | 'invoice';
            filename: string;
            file_base64?: string;
            file_url?: string;
            content_type?: string;
          },
        );

      case 'list_attachments':
        return await listAttachments(
          context,
          args as {
            transaction_id?: string;
            transaction_type?: 'offramp' | 'invoice';
            limit?: number;
          },
        );

      case 'remove_attachment':
        return await removeAttachment(
          context,
          args as { attachment_id: string },
        );

      // =========================================================================
      // Payment Details Tools
      // =========================================================================
      case 'get_payment_details':
        return await getPaymentDetails(context);

      case 'share_payment_details':
        return await sharePaymentDetails(
          context,
          args as { recipient_email: string; recipient_name?: string },
        );

      // =========================================================================
      // Proposal Management Tools
      // =========================================================================
      case 'dismiss_proposal':
        return await dismissProposal(context, args as { proposal_id: string });

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

  // Mock Mode: Return hardcoded balance minus pending transfers
  if (context.isMockMode) {
    const primarySafe = await db.query.userSafes.findFirst({
      where: and(
        eq(userSafes.userDid, workspace.createdBy),
        eq(userSafes.chainId, 8453),
        eq(userSafes.safeType, 'primary'),
      ),
    });

    // Get all non-dismissed transfers to calculate balance
    // NOTE: 'pending' = awaiting user approval (funds NOT moved yet) - don't subtract
    //       'processing' = user approved, funds being sent (funds ARE committed) - subtract
    //       'completed' = done, money already sent - subtract
    const allTransfers = await db.query.offrampTransfers.findMany({
      where: and(
        eq(offrampTransfers.workspaceId, context.workspaceId),
        eq(offrampTransfers.dismissed, false),
      ),
    });

    // Calculate amounts by status
    const completedAmount = allTransfers
      .filter((t) => t.status === 'completed')
      .reduce((sum, t) => sum + parseFloat(t.depositAmount || '0'), 0);

    const processingAmount = allTransfers
      .filter((t) => t.status === 'processing')
      .reduce((sum, t) => sum + parseFloat(t.depositAmount || '0'), 0);

    // Total deducted = completed + processing (pending doesn't count)
    const totalDeducted = completedAmount + processingAmount;

    // Base mock balance is $1.2M, subtract completed + processing transfers
    const availableBalance = Math.max(0, 1200000 - totalDeducted);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            usdc_balance: availableBalance.toFixed(2),
            completed_transfers: completedAmount.toFixed(2),
            processing_transfers: processingAmount.toFixed(2),
            safe_address:
              primarySafe?.safeAddress ||
              '0x954A329e1e59101DF529CC54A54666A0b36Cae22',
            chain: 'base',
            _mock: true,
          }),
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

  // Skip KYC check in mock mode (test tokens)
  if (!context.alignCustomerId && !context.isMockMode) {
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

  // Mock Mode: Skip Align API
  if (context.isMockMode) {
    const mockAlignTransferId = `mock_tx_${Date.now()}`;
    const mockDepositAddress = '0x1234567890123456789012345678901234567890';
    const feeAmount = '0.50';

    const [insertedTransfer] = await db
      .insert(offrampTransfers)
      .values({
        userId: workspace.createdBy,
        workspaceId: context.workspaceId,
        alignTransferId: mockAlignTransferId,
        status: 'pending',
        amountToSend: amount_usdc,
        destinationCurrency: destination_currency,
        destinationPaymentRails: paymentRails,
        destinationBankAccountId: saved_bank_account_id,
        destinationBankAccountSnapshot: {
          // Use snake_case to match Align API format expected by getBankingHistory
          bank_name: bankAccount.bankName,
          account_type: bankAccount.accountType,
          account_holder_type: bankAccount.accountHolderType,
          account_holder_first_name: bankAccount.accountHolderFirstName,
          account_holder_last_name: bankAccount.accountHolderLastName,
          account_holder_business_name: bankAccount.accountHolderBusinessName,
          us: bankAccount.accountNumber
            ? { account_number: bankAccount.accountNumber }
            : undefined,
          iban: bankAccount.ibanNumber
            ? { iban_number: bankAccount.ibanNumber }
            : undefined,
        },
        depositAmount: amount_usdc, // Simplified for mock
        depositToken: 'USDC',
        depositNetwork: 'BASE',
        depositAddress: mockDepositAddress,
        feeAmount: feeAmount,
        quoteExpiresAt: null, // Mock transfers don't expire
        proposedByAgent: true,
        agentProposalMessage: reason || 'Proposed via MCP agent',
      })
      .returning({ id: offrampTransfers.id });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            transaction_id: insertedTransfer.id, // UUID for attach_document
            proposal_id: mockAlignTransferId, // Keep for backwards compatibility
            status: 'pending_user_approval',
            message:
              'Transfer proposed. User must approve in the 0 Finance dashboard. Use transaction_id to attach documents.',
            details: {
              amount_usdc,
              destination_currency,
              destination_amount: amount_usdc, // Simplified
              fee_usdc: feeAmount,
              bank_account: bankAccount.bankName,
              expires_at: null, // Mock transfers don't expire
            },
          }),
        },
      ],
    };
  }

  // At this point we're not in mock mode, so alignCustomerId must be set (checked above)
  const quote = await alignApi.getOfframpQuote(context.alignCustomerId!, {
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
    context.alignCustomerId!,
    quote.quote_id,
    alignBankAccount,
  );

  const [insertedTransfer] = await db
    .insert(offrampTransfers)
    .values({
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
    })
    .returning({ id: offrampTransfers.id });

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          transaction_id: insertedTransfer.id, // UUID for attach_document
          proposal_id: transfer.id, // Keep for backwards compatibility (Align ID)
          status: 'pending_user_approval',
          message:
            'Transfer proposed. User must approve in the 0 Finance dashboard. Use transaction_id to attach documents.',
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

// =========================================================================
// Invoice Tool Implementations
// =========================================================================

async function createInvoice(
  context: NonNullable<Awaited<ReturnType<typeof validateApiKey>>>,
  args: {
    recipient_email: string;
    recipient_name?: string;
    amount: number;
    currency: string;
    description: string;
    due_date?: string;
    notes?: string;
  },
) {
  const {
    recipient_email,
    recipient_name,
    amount,
    currency,
    description,
    due_date,
    notes,
  } = args;

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

  try {
    const invoice = await createInvoiceForUser(
      workspace.createdBy,
      context.workspaceId,
      {
        recipientEmail: recipient_email,
        recipientName: recipient_name,
        amount,
        currency: currency.toUpperCase(),
        description,
        dueDate: due_date,
        notes,
      },
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            invoice_id: invoice.invoiceId,
            public_link: invoice.publicLink,
            message:
              'Invoice created successfully. Use send_invoice to email it to the recipient.',
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
            error:
              error instanceof Error
                ? error.message
                : 'Failed to create invoice',
          }),
        },
      ],
    };
  }
}

async function updateInvoice(
  context: NonNullable<Awaited<ReturnType<typeof validateApiKey>>>,
  args: {
    invoice_id: string;
    recipient_email?: string;
    recipient_name?: string;
    amount?: number;
    currency?: string;
    description?: string;
  },
) {
  const {
    invoice_id,
    recipient_email,
    recipient_name,
    amount,
    currency,
    description,
  } = args;

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

  try {
    const invoice = await updateInvoiceForUser(context.workspaceId, {
      invoiceId: invoice_id,
      recipientEmail: recipient_email,
      recipientName: recipient_name,
      amount,
      currency: currency?.toUpperCase(),
      description,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            invoice_id: invoice.invoiceId,
            public_link: invoice.publicLink,
            message: 'Invoice updated successfully.',
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
            error:
              error instanceof Error
                ? error.message
                : 'Failed to update invoice',
          }),
        },
      ],
    };
  }
}

async function listInvoices(
  context: NonNullable<Awaited<ReturnType<typeof validateApiKey>>>,
  args: {
    status?: 'db_pending' | 'pending' | 'paid' | 'canceled';
    limit?: number;
  },
) {
  const { status, limit = 20 } = args;

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

  const conditions = [eq(userRequestsTable.userId, workspace.createdBy)];
  if (status) {
    conditions.push(eq(userRequestsTable.status, status));
  }

  const invoices = await db
    .select({
      id: userRequestsTable.id,
      status: userRequestsTable.status,
      invoiceData: userRequestsTable.invoiceData,
      createdAt: userRequestsTable.createdAt,
    })
    .from(userRequestsTable)
    .where(and(...conditions))
    .orderBy(desc(userRequestsTable.createdAt))
    .limit(limit);

  const formatted = invoices.map((inv) => {
    const data = inv.invoiceData as Record<string, unknown> | null;
    const buyerInfo = data?.buyerInfo as Record<string, unknown> | undefined;
    const invoiceItems = data?.invoiceItems as
      | Array<{ unitPrice: string }>
      | undefined;
    const amountStr = invoiceItems?.[0]?.unitPrice;
    return {
      id: inv.id,
      status: inv.status,
      recipient: buyerInfo?.email || buyerInfo?.businessName || 'Unknown',
      amount: amountStr ? parseFloat(amountStr) : 0,
      currency: data?.currency || 'USD',
      created_at: inv.createdAt?.toISOString(),
      public_link: getInvoicePublicLink(inv.id),
    };
  });

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          invoices: formatted,
          count: formatted.length,
        }),
      },
    ],
  };
}

async function getInvoice(
  context: NonNullable<Awaited<ReturnType<typeof validateApiKey>>>,
  args: { invoice_id: string },
) {
  const { invoice_id } = args;

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

  const invoice = await db.query.userRequestsTable.findFirst({
    where: and(
      eq(userRequestsTable.id, invoice_id),
      eq(userRequestsTable.userId, workspace.createdBy),
    ),
  });

  if (!invoice) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: 'Invoice not found' }),
        },
      ],
    };
  }

  const data = invoice.invoiceData as Record<string, unknown> | null;
  const buyerInfo = data?.buyerInfo as Record<string, unknown> | undefined;
  const sellerInfo = data?.sellerInfo as Record<string, unknown> | undefined;
  const invoiceItems = data?.invoiceItems as
    | Array<Record<string, unknown>>
    | undefined;
  const paymentTerms = data?.paymentTerms as
    | Record<string, unknown>
    | undefined;

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          id: invoice.id,
          status: invoice.status,
          recipient_name: buyerInfo?.businessName,
          recipient_email: buyerInfo?.email,
          seller_name: sellerInfo?.businessName,
          seller_email: sellerInfo?.email,
          invoice_number: data?.invoiceNumber,
          issued_date: data?.creationDate,
          due_date: paymentTerms?.dueDate,
          currency: data?.currency,
          items: invoiceItems,
          notes: data?.note,
          created_at: invoice.createdAt?.toISOString(),
          public_link: getInvoicePublicLink(invoice.id),
        }),
      },
    ],
  };
}

async function sendInvoice(
  context: NonNullable<Awaited<ReturnType<typeof validateApiKey>>>,
  args: { invoice_id: string },
) {
  const { invoice_id } = args;

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

  const invoice = await db.query.userRequestsTable.findFirst({
    where: and(
      eq(userRequestsTable.id, invoice_id),
      eq(userRequestsTable.userId, workspace.createdBy),
    ),
  });

  if (!invoice) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: 'Invoice not found' }),
        },
      ],
    };
  }

  // Only pending invoices can be sent
  if (invoice.status !== 'db_pending' && invoice.status !== 'pending') {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: `Cannot send invoice with status '${invoice.status}'. Only pending invoices can be sent.`,
          }),
        },
      ],
    };
  }

  const data = invoice.invoiceData as Record<string, unknown> | null;
  const buyerInfo = data?.buyerInfo as Record<string, unknown> | undefined;
  const recipientEmail = buyerInfo?.email as string | undefined;

  if (!recipientEmail) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: 'Invoice has no recipient email' }),
        },
      ],
    };
  }

  try {
    const emailProvider = getEmailProviderSingleton();
    const publicLink = getInvoicePublicLink(invoice_id);
    const invoiceItems = data?.invoiceItems as
      | Array<{ unitPrice: string }>
      | undefined;
    const amount = invoiceItems?.[0]?.unitPrice
      ? parseFloat(invoiceItems[0].unitPrice)
      : 0;
    const currency = (data?.currency as string) || 'USD';

    await emailProvider.send({
      from: 'invoices@0.finance',
      to: recipientEmail,
      subject: `Invoice ${data?.invoiceNumber || invoice_id} from 0 Finance`,
      text: `You have received an invoice for ${amount.toLocaleString()} ${currency}. View at: ${publicLink}`,
      html: `
        <h2>You have received an invoice</h2>
        <p><strong>Amount:</strong> ${amount.toLocaleString()} ${currency}</p>
        <p><strong>Invoice Number:</strong> ${data?.invoiceNumber || invoice_id}</p>
        <p><strong>Due Date:</strong> ${data?.dueDate || 'Not specified'}</p>
        <p><a href="${publicLink}">View and Pay Invoice</a></p>
      `,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: `Invoice sent to ${recipientEmail}`,
            public_link: publicLink,
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
            error:
              error instanceof Error ? error.message : 'Failed to send invoice',
          }),
        },
      ],
    };
  }
}

// =========================================================================
// Transaction Tool Implementations
// =========================================================================

async function listTransactions(
  context: NonNullable<Awaited<ReturnType<typeof validateApiKey>>>,
  args: {
    status?: 'pending' | 'completed' | 'failed';
    limit?: number;
  },
) {
  const { status, limit = 20 } = args;

  const conditions = [eq(offrampTransfers.workspaceId, context.workspaceId)];
  if (status) {
    conditions.push(eq(offrampTransfers.status, status));
  }

  const transfers = await db
    .select({
      id: offrampTransfers.id,
      alignTransferId: offrampTransfers.alignTransferId,
      status: offrampTransfers.status,
      amountToSend: offrampTransfers.amountToSend,
      destinationCurrency: offrampTransfers.destinationCurrency,
      depositAmount: offrampTransfers.depositAmount,
      feeAmount: offrampTransfers.feeAmount,
      bankSnapshot: offrampTransfers.destinationBankAccountSnapshot,
      createdAt: offrampTransfers.createdAt,
      updatedAt: offrampTransfers.updatedAt,
    })
    .from(offrampTransfers)
    .where(and(...conditions))
    .orderBy(desc(offrampTransfers.createdAt))
    .limit(limit);

  const formatted = transfers.map((t) => {
    const bank = t.bankSnapshot ? JSON.parse(t.bankSnapshot as string) : null;
    return {
      id: t.id,
      align_transfer_id: t.alignTransferId,
      status: t.status,
      amount_usdc: t.amountToSend,
      destination_currency: t.destinationCurrency,
      deposit_amount: t.depositAmount,
      fee_amount: t.feeAmount,
      bank_name: bank?.bankName,
      bank_last_4: bank?.last4,
      created_at: t.createdAt?.toISOString(),
      updated_at: t.updatedAt?.toISOString(),
    };
  });

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          transactions: formatted,
          count: formatted.length,
        }),
      },
    ],
  };
}

async function getTransaction(
  context: NonNullable<Awaited<ReturnType<typeof validateApiKey>>>,
  args: { transaction_id: string },
) {
  const { transaction_id } = args;

  const transfer = await db.query.offrampTransfers.findFirst({
    where: and(
      eq(offrampTransfers.id, transaction_id),
      eq(offrampTransfers.workspaceId, context.workspaceId),
    ),
  });

  if (!transfer) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: 'Transaction not found' }),
        },
      ],
    };
  }

  const bank = transfer.destinationBankAccountSnapshot
    ? JSON.parse(transfer.destinationBankAccountSnapshot as string)
    : null;

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          id: transfer.id,
          align_transfer_id: transfer.alignTransferId,
          status: transfer.status,
          amount_usdc: transfer.amountToSend,
          destination_currency: transfer.destinationCurrency,
          destination_payment_rails: transfer.destinationPaymentRails,
          deposit_amount: transfer.depositAmount,
          deposit_token: transfer.depositToken,
          deposit_network: transfer.depositNetwork,
          deposit_address: transfer.depositAddress,
          fee_amount: transfer.feeAmount,
          bank_name: bank?.bankName,
          bank_last_4: bank?.last4,
          proposed_by_agent: transfer.proposedByAgent,
          agent_message: transfer.agentProposalMessage,
          created_at: transfer.createdAt?.toISOString(),
          updated_at: transfer.updatedAt?.toISOString(),
        }),
      },
    ],
  };
}

// =========================================================================
// Attachment Tool Implementations
// =========================================================================

function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    csv: 'text/csv',
    txt: 'text/plain',
  };
  return mimeTypes[ext || ''] || 'application/octet-stream';
}

async function attachDocument(
  context: NonNullable<Awaited<ReturnType<typeof validateApiKey>>>,
  args: {
    transaction_id: string;
    transaction_type: 'offramp' | 'invoice';
    filename: string;
    file_base64?: string;
    file_url?: string;
    content_type?: string;
  },
) {
  const {
    transaction_id,
    transaction_type,
    filename,
    file_base64,
    file_url,
    content_type,
  } = args;

  if (!file_base64 && !file_url) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: 'Either file_base64 or file_url is required',
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

  // Validate transaction ownership before allowing attachment
  if (transaction_type === 'offramp') {
    const transfer = await db.query.offrampTransfers.findFirst({
      where: and(
        eq(offrampTransfers.id, transaction_id),
        eq(offrampTransfers.workspaceId, context.workspaceId),
      ),
    });
    if (!transfer) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: 'Transaction not found or access denied',
            }),
          },
        ],
      };
    }
  } else if (transaction_type === 'invoice') {
    const invoice = await db.query.userRequestsTable.findFirst({
      where: and(
        eq(userRequestsTable.id, transaction_id),
        eq(userRequestsTable.userId, workspace.createdBy),
      ),
    });
    if (!invoice) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: 'Invoice not found or access denied',
            }),
          },
        ],
      };
    }
  }

  try {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit
    let fileBuffer: Buffer;

    if (file_base64) {
      fileBuffer = Buffer.from(file_base64, 'base64');
    } else if (file_url) {
      const response = await fetch(file_url);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch file from URL: ${response.statusText}`,
        );
      }
      fileBuffer = Buffer.from(await response.arrayBuffer());
    } else {
      throw new Error('No file content provided');
    }

    if (fileBuffer.length > MAX_FILE_SIZE) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: `File too large. Maximum size is 10MB. Received: ${(fileBuffer.length / 1024 / 1024).toFixed(2)}MB`,
            }),
          },
        ],
      };
    }

    const mimeType = content_type || getMimeType(filename);
    const blob = await put(
      `attachments/${transaction_id}/${filename}`,
      fileBuffer,
      {
        contentType: mimeType,
        access: 'public',
      },
    );

    const [attachment] = await db
      .insert(transactionAttachments)
      .values({
        transactionId: transaction_id,
        transactionType: transaction_type,
        uploadedBy: workspace.createdBy,
        uploadSource: 'mcp',
        workspaceId: context.workspaceId,
        filename,
        blobUrl: blob.url,
        fileSize: fileBuffer.length,
        contentType: mimeType,
      })
      .returning();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            attachment_id: attachment.id,
            filename: attachment.filename,
            file_url: attachment.blobUrl,
            file_size: attachment.fileSize,
            message: 'Document attached successfully.',
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
            error:
              error instanceof Error
                ? error.message
                : 'Failed to attach document',
          }),
        },
      ],
    };
  }
}

async function listAttachments(
  context: NonNullable<Awaited<ReturnType<typeof validateApiKey>>>,
  args: {
    transaction_id?: string;
    transaction_type?: 'offramp' | 'invoice';
    limit?: number;
  },
) {
  const { transaction_id, transaction_type, limit = 20 } = args;

  const conditions = [
    eq(transactionAttachments.workspaceId, context.workspaceId),
    isNull(transactionAttachments.deletedAt),
  ];

  if (transaction_id) {
    conditions.push(eq(transactionAttachments.transactionId, transaction_id));
  }
  if (transaction_type) {
    conditions.push(
      eq(transactionAttachments.transactionType, transaction_type),
    );
  }

  const attachments = await db
    .select({
      id: transactionAttachments.id,
      transactionId: transactionAttachments.transactionId,
      transactionType: transactionAttachments.transactionType,
      filename: transactionAttachments.filename,
      blobUrl: transactionAttachments.blobUrl,
      fileSize: transactionAttachments.fileSize,
      contentType: transactionAttachments.contentType,
      createdAt: transactionAttachments.createdAt,
    })
    .from(transactionAttachments)
    .where(and(...conditions))
    .orderBy(desc(transactionAttachments.createdAt))
    .limit(limit);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          attachments: attachments.map((a) => ({
            id: a.id,
            transaction_id: a.transactionId,
            transaction_type: a.transactionType,
            filename: a.filename,
            file_url: a.blobUrl,
            file_size: a.fileSize,
            mime_type: a.contentType,
            created_at: a.createdAt?.toISOString(),
          })),
          count: attachments.length,
        }),
      },
    ],
  };
}

async function removeAttachment(
  context: NonNullable<Awaited<ReturnType<typeof validateApiKey>>>,
  args: { attachment_id: string },
) {
  const { attachment_id } = args;

  const attachment = await db.query.transactionAttachments.findFirst({
    where: and(
      eq(transactionAttachments.id, attachment_id),
      eq(transactionAttachments.workspaceId, context.workspaceId),
    ),
  });

  if (!attachment) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: 'Attachment not found' }),
        },
      ],
    };
  }

  await db
    .update(transactionAttachments)
    .set({ deletedAt: new Date() })
    .where(eq(transactionAttachments.id, attachment_id));

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          message: 'Attachment removed successfully.',
        }),
      },
    ],
  };
}

// =========================================================================
// Payment Details Tool Implementations
// =========================================================================

async function getPaymentDetails(
  context: NonNullable<Awaited<ReturnType<typeof validateApiKey>>>,
) {
  try {
    const details = await getFormattedPaymentDetailsByWorkspace(
      context.workspaceId,
    );

    if (!details) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error:
                'No payment details found. User needs to complete KYC setup.',
            }),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            payment_details: details,
            message:
              'These are the bank account details for receiving payments.',
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
            error:
              error instanceof Error
                ? error.message
                : 'Failed to get payment details',
          }),
        },
      ],
    };
  }
}

async function sharePaymentDetails(
  context: NonNullable<Awaited<ReturnType<typeof validateApiKey>>>,
  args: { recipient_email: string; recipient_name?: string },
) {
  const { recipient_email, recipient_name } = args;

  try {
    const details = await getFormattedPaymentDetailsByWorkspace(
      context.workspaceId,
    );

    if (!details) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error:
                'No payment details found. User needs to complete KYC setup.',
            }),
          },
        ],
      };
    }

    const emailProvider = getEmailProviderSingleton();

    // Format payment details for email
    const formattedDetails = Object.entries(details)
      .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
      .join('<br>');

    await emailProvider.send({
      from: 'payments@0.finance',
      to: recipient_email,
      subject: 'Payment Details from 0 Finance',
      text: `Here are the payment details you requested: ${JSON.stringify(details)}`,
      html: `
        <h2>Payment Details</h2>
        <p>${recipient_name ? `Hi ${recipient_name},` : 'Hi,'}</p>
        <p>Here are the payment details you requested:</p>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          ${formattedDetails}
        </div>
        <p>Please use these details to send payments.</p>
      `,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: `Payment details sent to ${recipient_email}`,
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
            error:
              error instanceof Error
                ? error.message
                : 'Failed to share payment details',
          }),
        },
      ],
    };
  }
}

// =========================================================================
// Proposal Management Tool Implementations
// =========================================================================

async function dismissProposal(
  context: NonNullable<Awaited<ReturnType<typeof validateApiKey>>>,
  args: { proposal_id: string },
) {
  const { proposal_id } = args;

  const transfer = await db.query.offrampTransfers.findFirst({
    where: and(
      eq(offrampTransfers.alignTransferId, proposal_id),
      eq(offrampTransfers.workspaceId, context.workspaceId),
    ),
  });

  if (!transfer) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: 'Proposal not found' }),
        },
      ],
    };
  }

  await db
    .update(offrampTransfers)
    .set({ dismissed: true })
    .where(eq(offrampTransfers.id, transfer.id));

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          message: 'Proposal dismissed successfully.',
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
