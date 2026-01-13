import { NextRequest, NextResponse } from 'next/server';
import {
  authenticateApiKeyRequest,
  hasValidAdminToken,
} from '@/server/cli/auth';
import {
  listSavedBankAccounts,
  proposeBankTransfer,
  listProposals,
  createBankAccount,
  createInvoice,
  updateInvoice,
  listInvoices,
  getInvoice,
  sendInvoice,
  listTransactions,
  getTransaction,
  attachDocument,
  listAttachments,
  removeAttachment,
  getPaymentDetails,
  sharePaymentDetails,
  dismissProposal,
} from '@/app/api/mcp/route';
import { createApiKey } from '@/lib/mcp/api-key';
import { createPrivyUser, pregeneratePrivyWallets } from '@/server/cli/privy';
import { ensureUserWorkspace } from '@/server/utils/workspace';
import { db } from '@/db';
import {
  actionProposals,
  userProfilesTable,
  users,
  webhookEndpoints,
  workspaces,
} from '@/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { type Address, isAddress, parseUnits } from 'viem';
import crypto from 'crypto';
import { USDC_ASSET, BASE_CHAIN_ID } from '@/server/earn/base-vaults';
import {
  buildVaultPolicyErrorDetails,
  getVaultForWorkspace,
  getVaultInstructionsForWorkspace,
  getVaultQuoteForWorkspace,
  getVaultSuggestions,
  listVaultsForWorkspace,
} from '@/server/earn/yield-service';
import { getVaultPositions } from '@/server/earn/yield-positions';
import {
  createSandboxFaucetMint,
  SandboxFaucetLimitError,
} from '@/server/earn/yield-sandbox';
import { listVaults } from '@/server/earn/vault-registry';
import { getWorkspaceYieldPolicy } from '@/server/services/yield-policy';
import { getWorkspaceSafes } from '@/server/earn/multi-chain-safe-manager';
import {
  dispatchWebhookEvent,
  logAuditEvent,
  type WebhookEventType,
} from '@/server/services/webhook-service';
import { getSpendableBalanceByWorkspace } from '@/server/services/spendable-balance';

export const dynamic = 'force-dynamic';

type McpTextResult = {
  content: Array<{ type: string; text: string }>;
};

function unwrapMcpResult(result: unknown) {
  if (!result || typeof result !== 'object') {
    return result;
  }

  if (!('content' in result)) {
    return result;
  }

  const content = (result as McpTextResult).content;
  const text = content?.[0]?.text;
  if (!text) {
    return result;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return text;
  }
}

function jsonResponse(payload: unknown, status = 200) {
  return NextResponse.json(payload, { status });
}

function errorResponse(message: string, status = 400) {
  return jsonResponse({ error: message }, status);
}

type YieldErrorCode =
  | 'bad_request'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'rate_limited'
  | 'invalid_state'
  | 'internal';

function statusToYieldCode(status: number): YieldErrorCode {
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not_found';
  if (status === 429) return 'rate_limited';
  if (status >= 500) return 'internal';
  return 'bad_request';
}

function yieldErrorResponse(
  message: string,
  status = 400,
  code?: YieldErrorCode,
  details?: Record<string, unknown>,
) {
  return jsonResponse(
    {
      error: {
        message,
        code: code ?? statusToYieldCode(status),
        ...(details ? { details } : {}),
      },
    },
    status,
  );
}

function requireAdmin(request: NextRequest) {
  if (!hasValidAdminToken(request)) {
    throw new Error('Unauthorized: invalid admin token');
  }
}

async function requireApiContext(request: NextRequest) {
  const context = await authenticateApiKeyRequest(request);
  if (!context) {
    throw new Error('Unauthorized: invalid or missing API key');
  }
  return context;
}

async function findWorkspaceOwner(workspaceId: string) {
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, workspaceId),
  });

  if (!workspace) {
    throw new Error('Workspace not found');
  }

  return workspace.createdBy;
}

async function createProposal(params: {
  workspaceId: string;
  proposalType: 'crypto_transfer' | 'savings_deposit' | 'savings_withdraw';
  proposalMessage?: string;
  payload: Record<string, unknown>;
}) {
  const ownerDid = await findWorkspaceOwner(params.workspaceId);

  const [proposal] = await db
    .insert(actionProposals)
    .values({
      userDid: ownerDid,
      workspaceId: params.workspaceId,
      proposalType: params.proposalType,
      proposalMessage: params.proposalMessage,
      payload: params.payload,
      status: 'pending',
      proposedByAgent: true,
    })
    .returning();

  if (!proposal) {
    throw new Error('Failed to create proposal');
  }

  return proposal;
}

async function createYieldProposal(params: {
  workspaceId: string;
  proposalType: 'savings_deposit' | 'savings_withdraw';
  proposalMessage?: string;
  payload: Record<string, unknown>;
  vaultId: string;
  amount: string;
  direction: 'deposit' | 'withdraw';
  actor: string;
}) {
  const proposal = await createProposal({
    workspaceId: params.workspaceId,
    proposalType: params.proposalType,
    proposalMessage: params.proposalMessage,
    payload: params.payload,
  });

  await logAuditEvent({
    workspaceId: params.workspaceId,
    actor: params.actor,
    eventType: 'vault.action.created',
    metadata: {
      proposal_id: proposal.id,
      vault_id: params.vaultId,
      amount: params.amount,
      direction: params.direction,
    },
  });

  await dispatchWebhookEvent({
    workspaceId: params.workspaceId,
    eventType: 'vault.action.created',
    payload: {
      proposal_id: proposal.id,
      vault_id: params.vaultId,
      amount: params.amount,
      direction: params.direction,
    },
  });

  return proposal;
}

function parseLimit(searchParams: URLSearchParams) {
  const limitParam = searchParams.get('limit');
  if (!limitParam) return undefined;
  const limit = Number(limitParam);
  return Number.isFinite(limit) ? limit : undefined;
}

function parseBoolean(value: string | null) {
  if (value === null) return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

function buildChainMismatchDetails(params: {
  expectedChainId: number;
  providedChainId: number;
}) {
  return {
    expected_chain_id: params.expectedChainId,
    provided_chain_id: params.providedChainId,
    rpc_hint: `Use an RPC endpoint for chain ${params.expectedChainId}.`,
  };
}

const WEBHOOK_EVENT_TYPES: WebhookEventType[] = [
  'vault.position.updated',
  'vault.action.created',
  'vault.action.completed',
  'insurance.status.changed',
];

function parseWebhookEvents(value: unknown): WebhookEventType[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error('events must be a non-empty array');
  }

  const events = value.filter((event): event is WebhookEventType =>
    WEBHOOK_EVENT_TYPES.includes(event as WebhookEventType),
  );

  if (events.length !== value.length) {
    throw new Error('events contains unsupported entries');
  }

  return events;
}

async function resolveDefaultReceiver(workspaceId: string, chainId: number) {
  const safes = await getWorkspaceSafes(workspaceId, 'primary');
  const safe = safes.find((entry) => entry.chainId === chainId);
  return safe?.safeAddress as Address | undefined;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  let slug: string[] = [];
  try {
    ({ slug = [] } = await params);
    if (slug.length === 0) {
      return errorResponse('Not found', 404);
    }

    if (slug[0] === 'whoami') {
      const context = await requireApiContext(request);
      return jsonResponse({
        workspace_id: context.workspaceId,
        workspace_name: context.workspaceName,
        key_id: context.keyId,
        key_name: context.keyName,
        align_customer_id: context.alignCustomerId,
      });
    }

    if (slug[0] === 'balance') {
      const context = await requireApiContext(request);
      const payload = await getSpendableBalanceByWorkspace(context.workspaceId);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    if (slug[0] === 'bank-accounts') {
      const context = await requireApiContext(request);
      const result = await listSavedBankAccounts(context);
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    if (slug[0] === 'bank-transfers' && slug[1] === 'proposals') {
      const context = await requireApiContext(request);
      const searchParams = new URL(request.url).searchParams;
      const includeCompleted = searchParams.get('include_completed') === 'true';
      const result = await listProposals(context, {
        include_completed: includeCompleted,
      });
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    if (slug[0] === 'invoices') {
      const context = await requireApiContext(request);
      if (slug[1]) {
        const result = await getInvoice(context, { invoice_id: slug[1] });
        const payload = unwrapMcpResult(result);
        if (payload && typeof payload === 'object' && 'error' in payload) {
          return jsonResponse(payload, 400);
        }
        return jsonResponse(payload);
      }

      const searchParams = new URL(request.url).searchParams;
      const status = searchParams.get('status') as
        | 'db_pending'
        | 'pending'
        | 'paid'
        | 'canceled'
        | null;
      const limit = parseLimit(searchParams);
      const result = await listInvoices(context, {
        status: status ?? undefined,
        limit,
      });
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    if (slug[0] === 'transactions') {
      const context = await requireApiContext(request);
      if (slug[1]) {
        const result = await getTransaction(context, {
          transaction_id: slug[1],
        });
        const payload = unwrapMcpResult(result);
        if (payload && typeof payload === 'object' && 'error' in payload) {
          return jsonResponse(payload, 400);
        }
        return jsonResponse(payload);
      }

      const searchParams = new URL(request.url).searchParams;
      const status = searchParams.get('status') as
        | 'pending'
        | 'completed'
        | 'failed'
        | null;
      const limit = parseLimit(searchParams);
      const result = await listTransactions(context, {
        status: status ?? undefined,
        limit,
      });
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    if (slug[0] === 'attachments') {
      const context = await requireApiContext(request);
      const searchParams = new URL(request.url).searchParams;
      const result = await listAttachments(context, {
        transaction_id: searchParams.get('transaction_id') || undefined,
        transaction_type:
          (searchParams.get('transaction_type') as
            | 'offramp'
            | 'invoice'
            | null) ?? undefined,
        limit: parseLimit(searchParams),
      });
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    if (slug[0] === 'payment-details') {
      const context = await requireApiContext(request);
      const result = await getPaymentDetails(context);
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    if (slug[0] === 'crypto-transfers' && slug[1] === 'proposals') {
      const context = await requireApiContext(request);
      const searchParams = new URL(request.url).searchParams;
      const includeCompleted = searchParams.get('include_completed') === 'true';

      const conditions = [
        eq(actionProposals.workspaceId, context.workspaceId),
        eq(actionProposals.proposalType, 'crypto_transfer'),
        eq(actionProposals.dismissed, false),
      ];

      if (!includeCompleted) {
        conditions.push(
          inArray(actionProposals.status, ['pending', 'approved']),
        );
      }

      const proposals = await db.query.actionProposals.findMany({
        where: and(...conditions),
        orderBy: (table, { desc }) => [desc(table.createdAt)],
      });

      return jsonResponse({ proposals, count: proposals.length });
    }

    if (slug[0] === 'savings' && slug[1] === 'proposals') {
      const context = await requireApiContext(request);
      const searchParams = new URL(request.url).searchParams;
      const includeCompleted = searchParams.get('include_completed') === 'true';

      const conditions = [
        eq(actionProposals.workspaceId, context.workspaceId),
        inArray(actionProposals.proposalType, [
          'savings_deposit',
          'savings_withdraw',
        ]),
        eq(actionProposals.dismissed, false),
      ];

      if (!includeCompleted) {
        conditions.push(
          inArray(actionProposals.status, ['pending', 'approved']),
        );
      }

      const proposals = await db.query.actionProposals.findMany({
        where: and(...conditions),
        orderBy: (table, { desc }) => [desc(table.createdAt)],
      });

      return jsonResponse({ proposals, count: proposals.length });
    }

    if (slug[0] === 'vaults' && !slug[1]) {
      const context = await requireApiContext(request);
      const { searchParams } = request.nextUrl;
      const chainId = searchParams.get('chain_id');
      const insured = parseBoolean(searchParams.get('insured'));
      const sandboxOnly = parseBoolean(searchParams.get('sandbox_only'));
      const status = searchParams.get('status') as 'active' | 'inactive' | null;

      const vaults = await listVaultsForWorkspace(context.workspaceId, {
        chainId: chainId ? Number(chainId) : undefined,
        insured,
        sandboxOnly,
        status: status ?? undefined,
      });

      const guidance =
        vaults.length === 0
          ? {
              message: 'No vaults available for the current filters.',
              recommended_vaults: await getVaultSuggestions(
                context.workspaceId,
              ),
            }
          : undefined;

      return jsonResponse({
        vaults,
        count: vaults.length,
        ...(guidance ? { guidance } : {}),
      });
    }

    if (slug[0] === 'vaults' && slug[1] && !slug[2]) {
      const context = await requireApiContext(request);
      const vault = await getVaultForWorkspace(context.workspaceId, slug[1]);
      if (!vault) {
        const suggestions = await getVaultSuggestions(context.workspaceId);
        return yieldErrorResponse('Vault not found', 404, 'not_found', {
          suggested_vaults: suggestions,
        });
      }
      return jsonResponse(vault);
    }

    if (slug[0] === 'vaults' && slug[1] && slug[2] === 'quote') {
      const context = await requireApiContext(request);
      const { searchParams } = request.nextUrl;
      const amount = searchParams.get('amount');
      const direction = searchParams.get('direction') as
        | 'deposit'
        | 'withdraw'
        | null;
      const slippageBps = searchParams.get('slippage_bps');
      const requestedChainId = searchParams.get('chain_id');

      if (!amount || !direction) {
        return yieldErrorResponse('Missing amount or direction', 400);
      }

      const vault = await getVaultForWorkspace(context.workspaceId, slug[1]);
      if (!vault) {
        const suggestions = await getVaultSuggestions(context.workspaceId);
        return yieldErrorResponse('Vault not found', 404, 'not_found', {
          suggested_vaults: suggestions,
        });
      }

      if (requestedChainId) {
        const chainId = Number(requestedChainId);
        if (!Number.isFinite(chainId)) {
          return yieldErrorResponse('Invalid chain_id', 400, 'bad_request');
        }
        if (chainId !== vault.chainId) {
          return yieldErrorResponse(
            'Chain mismatch for requested vault',
            400,
            'invalid_state',
            buildChainMismatchDetails({
              expectedChainId: vault.chainId,
              providedChainId: chainId,
            }),
          );
        }
      }

      try {
        const quote = await getVaultQuoteForWorkspace({
          workspaceId: context.workspaceId,
          vaultId: slug[1],
          amount,
          direction,
          slippageBps: slippageBps ? Number(slippageBps) : undefined,
        });
        return jsonResponse({ quote: { ...quote, chain_id: vault.chainId } });
      } catch (error) {
        return yieldErrorResponse(
          error instanceof Error ? error.message : 'Unexpected error',
          400,
        );
      }
    }

    if (slug[0] === 'vaults' && slug[1] && slug[2] === 'instructions') {
      const context = await requireApiContext(request);
      const { searchParams } = request.nextUrl;
      const amount = searchParams.get('amount');
      const direction = searchParams.get('direction') as
        | 'deposit'
        | 'withdraw'
        | null;
      const receiverParam = searchParams.get('receiver');
      const ownerParam = searchParams.get('owner');
      const requestedChainId = searchParams.get('chain_id');

      if (!amount || !direction) {
        return yieldErrorResponse('Missing amount or direction', 400);
      }

      const vault = await getVaultForWorkspace(context.workspaceId, slug[1]);
      if (!vault) {
        const suggestions = await getVaultSuggestions(context.workspaceId);
        return yieldErrorResponse('Vault not found', 404, 'not_found', {
          suggested_vaults: suggestions,
        });
      }

      if (requestedChainId) {
        const chainId = Number(requestedChainId);
        if (!Number.isFinite(chainId)) {
          return yieldErrorResponse('Invalid chain_id', 400, 'bad_request');
        }
        if (chainId !== vault.chainId) {
          return yieldErrorResponse(
            'Chain mismatch for requested vault',
            400,
            'invalid_state',
            buildChainMismatchDetails({
              expectedChainId: vault.chainId,
              providedChainId: chainId,
            }),
          );
        }
      }

      const policy = await getWorkspaceYieldPolicy(context.workspaceId);
      if (!vault.actionability.actionable) {
        return yieldErrorResponse(
          vault.actionability.reason ?? 'Vault action not allowed',
          403,
          'forbidden',
          buildVaultPolicyErrorDetails(
            policy,
            vault,
            vault.actionability.reason,
          ),
        );
      }

      const receiver = receiverParam
        ? (receiverParam as Address)
        : await resolveDefaultReceiver(context.workspaceId, vault.chainId);

      if (!receiver || !isAddress(receiver)) {
        return yieldErrorResponse('Missing or invalid receiver address', 400);
      }

      const owner =
        ownerParam && isAddress(ownerParam)
          ? (ownerParam as Address)
          : receiver;

      try {
        const instructions = await getVaultInstructionsForWorkspace({
          workspaceId: context.workspaceId,
          vaultId: slug[1],
          amount,
          direction,
          receiver,
          owner,
        });
        return jsonResponse({
          instructions: { ...instructions, chain_id: vault.chainId },
        });
      } catch (error) {
        return yieldErrorResponse(
          error instanceof Error ? error.message : 'Unexpected error',
          400,
        );
      }
    }

    if (slug[0] === 'positions') {
      const context = await requireApiContext(request);
      const { searchParams } = request.nextUrl;
      const addresses = searchParams.getAll('address').filter(Boolean);

      const ownerAddresses = addresses.length
        ? (addresses as Address[])
        : (await getWorkspaceSafes(context.workspaceId)).map(
            (safe) => safe.safeAddress as Address,
          );

      const positions = await getVaultPositions({ ownerAddresses });

      if (slug[1]) {
        const filtered = positions.filter(
          (position) => position.vaultId === slug[1],
        );
        return jsonResponse({ positions: filtered, count: filtered.length });
      }

      return jsonResponse({ positions, count: positions.length });
    }

    if (slug[0] === 'sandbox' && slug[1] === 'status') {
      const context = await requireApiContext(request);
      const policy = await getWorkspaceYieldPolicy(context.workspaceId);
      return jsonResponse({
        insurance_status: policy.insuranceStatus,
        has_completed_kyc: policy.hasCompletedKyc,
        sandbox_enabled: policy.canUseSandbox,
      });
    }

    if (slug[0] === 'sandbox' && slug[1] === 'vaults') {
      const context = await requireApiContext(request);
      const vaults = await listVaultsForWorkspace(context.workspaceId, {
        sandboxOnly: true,
      });
      return jsonResponse({ vaults, count: vaults.length });
    }

    if (slug[0] === 'workspace' && slug[1] === 'status') {
      const context = await requireApiContext(request);
      const policy = await getWorkspaceYieldPolicy(context.workspaceId);
      return jsonResponse({
        workspace_id: context.workspaceId,
        insurance_status: policy.insuranceStatus,
        has_completed_kyc: policy.hasCompletedKyc,
        sandbox_enabled: policy.canUseSandbox,
      });
    }

    if (slug[0] === 'webhooks' && !slug[1]) {
      const context = await requireApiContext(request);
      const endpoints = await db.query.webhookEndpoints.findMany({
        where: (tbl, { eq: eqLocal }) =>
          eqLocal(tbl.workspaceId, context.workspaceId),
      });

      const webhooks = endpoints.map((endpoint) => ({
        id: endpoint.id,
        url: endpoint.url,
        events: endpoint.events,
        is_active: endpoint.isActive,
        created_at: endpoint.createdAt,
      }));

      return jsonResponse({ webhooks, count: webhooks.length });
    }

    if (slug[0] === 'savings' && slug[1] === 'positions') {
      const context = await requireApiContext(request);
      const payload = await getSpendableBalanceByWorkspace(context.workspaceId);
      return jsonResponse(payload);
    }

    if (slug[0] === 'users' && slug[1]) {
      requireAdmin(request);
      const user = await db.query.users.findFirst({
        where: eq(users.privyDid, slug[1]),
      });

      if (!user) {
        return errorResponse('User not found', 404);
      }

      const profile = await db.query.userProfilesTable.findFirst({
        where: eq(userProfilesTable.privyDid, slug[1]),
      });

      return jsonResponse({ user, profile });
    }

    return errorResponse('Not found', 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    const lowerMessage = message.toLowerCase();
    const isYieldEndpoint =
      slug[0] === 'vaults' ||
      slug[0] === 'positions' ||
      slug[0] === 'sandbox' ||
      slug[0] === 'workspace' ||
      slug[0] === 'webhooks';

    if (isYieldEndpoint) {
      if (lowerMessage.includes('unauthorized')) {
        return yieldErrorResponse(message, 401, 'unauthorized');
      }
      if (lowerMessage.includes('forbidden')) {
        return yieldErrorResponse(message, 403, 'forbidden');
      }
      if (lowerMessage.includes('not found')) {
        return yieldErrorResponse(message, 404, 'not_found');
      }
      return yieldErrorResponse(message, 400);
    }

    if (lowerMessage.includes('unauthorized')) {
      return errorResponse(message, 401);
    }
    return errorResponse(message, 400);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  let slug: string[] = [];
  try {
    ({ slug = [] } = await params);
    if (slug.length === 0) {
      return errorResponse('Not found', 404);
    }

    if (slug[0] === 'admin' && slug[1] === 'workspaces' && slug[2]) {
      requireAdmin(request);

      if (slug[3] === 'insurance-activate') {
        await db
          .update(workspaces)
          .set({
            insuranceStatus: 'active',
            insuranceActivatedAt: new Date(),
            insuranceActivatedBy: 'admin',
          })
          .where(eq(workspaces.id, slug[2]));

        await logAuditEvent({
          workspaceId: slug[2],
          actor: 'admin',
          eventType: 'insurance.status.changed',
          metadata: { status: 'active' },
        });

        await dispatchWebhookEvent({
          workspaceId: slug[2],
          eventType: 'insurance.status.changed',
          payload: {
            workspace_id: slug[2],
            status: 'active',
          },
        });

        return jsonResponse({ success: true, status: 'active' });
      }

      if (slug[3] === 'insurance-suspend') {
        await db
          .update(workspaces)
          .set({
            insuranceStatus: 'suspended',
          })
          .where(eq(workspaces.id, slug[2]));

        await logAuditEvent({
          workspaceId: slug[2],
          actor: 'admin',
          eventType: 'insurance.status.changed',
          metadata: { status: 'suspended' },
        });

        await dispatchWebhookEvent({
          workspaceId: slug[2],
          eventType: 'insurance.status.changed',
          payload: {
            workspace_id: slug[2],
            status: 'suspended',
          },
        });

        return jsonResponse({ success: true, status: 'suspended' });
      }
    }

    if (slug[0] === 'bank-accounts') {
      const context = await requireApiContext(request);
      const body = await request.json();
      const result = await createBankAccount(context, body);
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload, 201);
    }

    if (slug[0] === 'bank-transfers' && slug[1] === 'proposals' && !slug[2]) {
      const context = await requireApiContext(request);
      const body = await request.json();
      const result = await proposeBankTransfer(context, body);
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload, 201);
    }

    if (
      slug[0] === 'bank-transfers' &&
      slug[1] === 'proposals' &&
      slug[2] &&
      slug[3] === 'dismiss'
    ) {
      const context = await requireApiContext(request);
      const result = await dismissProposal(context, { proposal_id: slug[2] });
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    if (slug[0] === 'invoices' && !slug[1]) {
      const context = await requireApiContext(request);
      const body = await request.json();
      const result = await createInvoice(context, body);
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload, 201);
    }

    if (slug[0] === 'invoices' && slug[1] && slug[2] === 'send') {
      const context = await requireApiContext(request);
      const result = await sendInvoice(context, { invoice_id: slug[1] });
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    if (slug[0] === 'attachments') {
      const context = await requireApiContext(request);
      const body = await request.json();
      const result = await attachDocument(context, body);
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload, 201);
    }

    if (slug[0] === 'payment-details' && slug[1] === 'share') {
      const context = await requireApiContext(request);
      const body = await request.json();
      const result = await sharePaymentDetails(context, body);
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    if (slug[0] === 'webhooks' && !slug[1]) {
      const context = await requireApiContext(request);
      const body = await request.json();
      const url = body?.url as string | undefined;
      const events = parseWebhookEvents(body?.events);

      if (!url) {
        return yieldErrorResponse('Missing url', 400);
      }

      const secret = crypto.randomBytes(24).toString('hex');

      const [endpoint] = await db
        .insert(webhookEndpoints)
        .values({
          workspaceId: context.workspaceId,
          url,
          secret,
          events,
          isActive: true,
        })
        .returning();

      if (endpoint) {
        await logAuditEvent({
          workspaceId: context.workspaceId,
          actor: context.keyId,
          eventType: 'webhook.endpoint.created',
          metadata: {
            webhook_id: endpoint.id,
            url: endpoint.url,
            events: endpoint.events,
          },
        });
      }

      return jsonResponse(
        {
          webhook: endpoint
            ? {
                id: endpoint.id,
                url: endpoint.url,
                events: endpoint.events,
                secret: endpoint.secret,
                is_active: endpoint.isActive,
                created_at: endpoint.createdAt,
              }
            : null,
        },
        201,
      );
    }

    if (slug[0] === 'sandbox' && slug[1] === 'faucet') {
      const context = await requireApiContext(request);
      const body = await request.json();
      const address = body?.address as string | undefined;
      const amount = body?.amount as string | undefined;

      if (!address || !isAddress(address)) {
        return yieldErrorResponse('Missing or invalid address', 400);
      }

      if (!amount) {
        return yieldErrorResponse('Missing amount', 400);
      }

      if (!/^[0-9]+$/.test(amount)) {
        return yieldErrorResponse(
          'Amount must be a numeric base-unit string',
          400,
        );
      }

      let result: Awaited<ReturnType<typeof createSandboxFaucetMint>> | null =
        null;

      try {
        result = await createSandboxFaucetMint({
          workspaceId: context.workspaceId,
          recipient: address as Address,
          amount,
        });
      } catch (error) {
        if (error instanceof SandboxFaucetLimitError) {
          const limitError = error as SandboxFaucetLimitError;
          return jsonResponse(
            {
              error: {
                message: limitError.message,
                code: 'rate_limited',
                retry_at: limitError.retryAt?.toISOString() ?? null,
                scope: limitError.scope,
              },
            },
            429,
          );
        }
        throw error;
      }

      if (!result) {
        return yieldErrorResponse(
          'Sandbox faucet unavailable',
          500,
          'internal',
        );
      }

      await logAuditEvent({
        workspaceId: context.workspaceId,
        actor: context.keyId,
        eventType: 'sandbox.faucet.minted',
        metadata: {
          address,
          amount,
          token_id: result.token.id,
          tx_hash: result.txHash,
        },
      });

      return jsonResponse({ success: true, ...result });
    }

    if (slug[0] === 'actions' && slug[1] === 'vault-deposit') {
      const context = await requireApiContext(request);
      const body = await request.json();
      const vaultId = body?.vault_id as string | undefined;
      const amount = body?.amount as string | undefined;
      const receiver = body?.receiver as string | undefined;
      const owner = body?.owner as string | undefined;
      const reason = body?.reason as string | undefined;

      if (!vaultId || !amount) {
        return yieldErrorResponse('Missing vault_id or amount', 400);
      }

      const vault = await getVaultForWorkspace(context.workspaceId, vaultId);
      if (!vault) {
        const suggestions = await getVaultSuggestions(context.workspaceId);
        return yieldErrorResponse('Vault not found', 404, 'not_found', {
          suggested_vaults: suggestions,
        });
      }
      const policy = await getWorkspaceYieldPolicy(context.workspaceId);
      if (!vault.actionability.actionable) {
        return yieldErrorResponse(
          vault.actionability.reason ?? 'Vault action not allowed',
          403,
          'forbidden',
          buildVaultPolicyErrorDetails(
            policy,
            vault,
            vault.actionability.reason,
          ),
        );
      }

      const proposal = await createYieldProposal({
        workspaceId: context.workspaceId,
        proposalType: 'savings_deposit',
        proposalMessage: reason,
        payload: {
          vault_id: vaultId,
          amount,
          receiver,
          owner,
        },
        vaultId,
        amount,
        direction: 'deposit',
        actor: context.keyId,
      });

      return jsonResponse(
        {
          success: true,
          proposal_id: proposal.id,
        },
        201,
      );
    }

    if (slug[0] === 'actions' && slug[1] === 'vault-withdraw') {
      const context = await requireApiContext(request);
      const body = await request.json();
      const vaultId = body?.vault_id as string | undefined;
      const amount = body?.amount as string | undefined;
      const receiver = body?.receiver as string | undefined;
      const owner = body?.owner as string | undefined;
      const reason = body?.reason as string | undefined;

      if (!vaultId || !amount) {
        return yieldErrorResponse('Missing vault_id or amount', 400);
      }

      const vault = await getVaultForWorkspace(context.workspaceId, vaultId);
      if (!vault) {
        const suggestions = await getVaultSuggestions(context.workspaceId);
        return yieldErrorResponse('Vault not found', 404, 'not_found', {
          suggested_vaults: suggestions,
        });
      }
      const policy = await getWorkspaceYieldPolicy(context.workspaceId);
      if (!vault.actionability.actionable) {
        return yieldErrorResponse(
          vault.actionability.reason ?? 'Vault action not allowed',
          403,
          'forbidden',
          buildVaultPolicyErrorDetails(
            policy,
            vault,
            vault.actionability.reason,
          ),
        );
      }

      const proposal = await createYieldProposal({
        workspaceId: context.workspaceId,
        proposalType: 'savings_withdraw',
        proposalMessage: reason,
        payload: {
          vault_id: vaultId,
          amount,
          receiver,
          owner,
        },
        vaultId,
        amount,
        direction: 'withdraw',
        actor: context.keyId,
      });

      return jsonResponse(
        {
          success: true,
          proposal_id: proposal.id,
        },
        201,
      );
    }

    if (slug[0] === 'crypto-transfers' && slug[1] === 'proposals') {
      const context = await requireApiContext(request);
      const body = await request.json();
      const chainId = Number(body.chain_id ?? BASE_CHAIN_ID);

      if (!isAddress(body.to_address)) {
        return errorResponse('Invalid to_address');
      }
      if (!isAddress(body.token_address)) {
        return errorResponse('Invalid token_address');
      }

      const tokenDecimals =
        typeof body.token_decimals === 'number'
          ? body.token_decimals
          : body.token_address?.toLowerCase() ===
              USDC_ASSET.address.toLowerCase()
            ? USDC_ASSET.decimals
            : undefined;

      if (tokenDecimals === undefined) {
        return errorResponse('token_decimals is required for non-USDC tokens');
      }

      const amountBaseUnits = parseUnits(String(body.amount), tokenDecimals);

      const proposal = await createProposal({
        workspaceId: context.workspaceId,
        proposalType: 'crypto_transfer',
        proposalMessage: body.reason,
        payload: {
          toAddress: body.to_address,
          tokenAddress: body.token_address,
          tokenSymbol: body.token_symbol ?? null,
          tokenDecimals,
          amount: String(body.amount),
          amountBaseUnits: amountBaseUnits.toString(),
          chainId,
        },
      });

      return jsonResponse(
        {
          proposal_id: proposal.id,
          status: proposal.status,
        },
        201,
      );
    }

    if (
      slug[0] === 'crypto-transfers' &&
      slug[1] === 'proposals' &&
      slug[2] &&
      slug[3] === 'dismiss'
    ) {
      const context = await requireApiContext(request);
      const proposal = await db.query.actionProposals.findFirst({
        where: and(
          eq(actionProposals.id, slug[2]),
          eq(actionProposals.workspaceId, context.workspaceId),
        ),
      });

      if (!proposal) {
        return errorResponse('Proposal not found', 404);
      }

      await db
        .update(actionProposals)
        .set({ status: 'canceled', dismissed: true })
        .where(eq(actionProposals.id, proposal.id));

      return jsonResponse({ success: true });
    }

    if (slug[0] === 'savings' && slug[1] === 'deposits') {
      const context = await requireApiContext(request);
      const body = await request.json();
      const vaults = await listVaults();
      const vault = vaults.find(
        (item) =>
          item.address.toLowerCase() ===
          String(body.vault_address).toLowerCase(),
      );

      if (!vault || !vault.asset) {
        return errorResponse('Vault not supported for CLI deposits');
      }

      const workspaceVault = await getVaultForWorkspace(
        context.workspaceId,
        vault.id,
      );
      if (!workspaceVault) {
        return yieldErrorResponse('Vault not found', 404);
      }
      if (!workspaceVault.actionability.actionable) {
        return yieldErrorResponse(
          workspaceVault.actionability.reason ?? 'Vault action not allowed',
          403,
          'forbidden',
        );
      }

      const amountBaseUnits = parseUnits(
        String(body.amount),
        vault.asset.decimals,
      );

      const proposal = await createYieldProposal({
        workspaceId: context.workspaceId,
        proposalType: 'savings_deposit',
        proposalMessage: body.reason,
        payload: {
          vault_id: vault.id,
          vaultAddress: vault.address,
          vaultName: vault.name,
          vaultDisplayName: vault.displayName,
          assetAddress: vault.asset.address,
          assetSymbol: vault.asset.symbol,
          assetDecimals: vault.asset.decimals,
          amount: String(body.amount),
          amountBaseUnits: amountBaseUnits.toString(),
          chainId: vault.chainId,
        },
        vaultId: vault.id,
        amount: String(body.amount),
        direction: 'deposit',
        actor: context.keyId,
      });

      return jsonResponse(
        {
          proposal_id: proposal.id,
          status: proposal.status,
        },
        201,
      );
    }

    if (slug[0] === 'savings' && slug[1] === 'withdrawals') {
      const context = await requireApiContext(request);
      const body = await request.json();
      const vaults = await listVaults();
      const vault = vaults.find(
        (item) =>
          item.address.toLowerCase() ===
          String(body.vault_address).toLowerCase(),
      );

      if (!vault || !vault.asset) {
        return errorResponse('Vault not supported for CLI withdrawals');
      }

      const workspaceVault = await getVaultForWorkspace(
        context.workspaceId,
        vault.id,
      );
      if (!workspaceVault) {
        return yieldErrorResponse('Vault not found', 404);
      }
      if (!workspaceVault.actionability.actionable) {
        return yieldErrorResponse(
          workspaceVault.actionability.reason ?? 'Vault action not allowed',
          403,
          'forbidden',
        );
      }

      const amountBaseUnits = parseUnits(
        String(body.amount),
        vault.asset.decimals,
      );

      const proposal = await createYieldProposal({
        workspaceId: context.workspaceId,
        proposalType: 'savings_withdraw',
        proposalMessage: body.reason,
        payload: {
          vault_id: vault.id,
          vaultAddress: vault.address,
          vaultName: vault.name,
          vaultDisplayName: vault.displayName,
          assetAddress: vault.asset.address,
          assetSymbol: vault.asset.symbol,
          assetDecimals: vault.asset.decimals,
          amount: String(body.amount),
          amountBaseUnits: amountBaseUnits.toString(),
          chainId: vault.chainId,
        },
        vaultId: vault.id,
        amount: String(body.amount),
        direction: 'withdraw',
        actor: context.keyId,
      });

      return jsonResponse(
        {
          proposal_id: proposal.id,
          status: proposal.status,
        },
        201,
      );
    }

    if (slug[0] === 'users') {
      requireAdmin(request);
      const body = await request.json();

      if (!body.email && !body.phone) {
        return errorResponse('email or phone is required');
      }

      const linkedAccounts = [] as Array<{
        type: 'email' | 'phone';
        address: string;
      }>;
      if (body.email) {
        linkedAccounts.push({ type: 'email', address: body.email });
      }
      if (body.phone) {
        linkedAccounts.push({ type: 'phone', address: body.phone });
      }

      const privyUser = await createPrivyUser({
        linked_accounts: linkedAccounts,
        ...(body.wallets ? { wallets: body.wallets } : {}),
        ...(body.create_direct_signer !== undefined
          ? { create_direct_signer: body.create_direct_signer }
          : {}),
        ...(body.custom_metadata
          ? { custom_metadata: body.custom_metadata }
          : {}),
      });

      const privyDid = privyUser?.id ?? privyUser?.user?.id;
      if (!privyDid) {
        return errorResponse('Privy user creation failed');
      }

      const { workspaceId } = await ensureUserWorkspace(
        db,
        privyDid,
        body.email ?? null,
      );

      const existingProfile = await db.query.userProfilesTable.findFirst({
        where: eq(userProfilesTable.privyDid, privyDid),
      });

      if (!existingProfile) {
        await db.insert(userProfilesTable).values({
          privyDid,
          email: body.email ?? null,
          skippedOrCompletedOnboardingStepper: false,
        });
      }

      const keyName = body.api_key_name ?? 'CLI Access';
      const { rawKey, keyId } = await createApiKey({
        workspaceId,
        name: keyName,
        createdBy: privyDid,
        expiresAt: body.api_key_expires_at
          ? new Date(body.api_key_expires_at)
          : undefined,
      });

      return jsonResponse(
        {
          privy_user: privyUser,
          workspace_id: workspaceId,
          api_key: rawKey,
          api_key_id: keyId,
        },
        201,
      );
    }

    if (slug[0] === 'users' && slug[1] && slug[2] === 'wallets') {
      requireAdmin(request);
      const body = await request.json();
      const wallets = body.wallets ?? [
        {
          chain_type: 'ethereum',
        },
      ];
      const privyUser = await pregeneratePrivyWallets({
        user_id: slug[1],
        wallets,
        ...(body.create_direct_signer !== undefined
          ? { create_direct_signer: body.create_direct_signer }
          : {}),
      });

      return jsonResponse({ privy_user: privyUser });
    }

    if (slug[0] === 'api-keys') {
      requireAdmin(request);
      const body = await request.json();

      if (!body.workspace_id || !body.created_by) {
        return errorResponse('workspace_id and created_by are required');
      }

      const { rawKey, keyId } = await createApiKey({
        workspaceId: body.workspace_id,
        name: body.name ?? 'CLI Access',
        createdBy: body.created_by,
        expiresAt: body.expires_at ? new Date(body.expires_at) : undefined,
      });

      return jsonResponse({ api_key: rawKey, api_key_id: keyId }, 201);
    }

    return errorResponse('Not found', 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    const lowerMessage = message.toLowerCase();
    const isYieldEndpoint =
      slug[0] === 'sandbox' || slug[0] === 'actions' || slug[0] === 'webhooks';

    if (isYieldEndpoint) {
      if (lowerMessage.includes('unauthorized')) {
        return yieldErrorResponse(message, 401, 'unauthorized');
      }
      if (lowerMessage.includes('forbidden')) {
        return yieldErrorResponse(message, 403, 'forbidden');
      }
      if (lowerMessage.includes('not found')) {
        return yieldErrorResponse(message, 404, 'not_found');
      }
      return yieldErrorResponse(message, 400);
    }

    if (lowerMessage.includes('unauthorized')) {
      return errorResponse(message, 401);
    }
    return errorResponse(message, 400);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  try {
    const { slug = [] } = await params;
    if (slug[0] === 'invoices' && slug[1]) {
      const context = await requireApiContext(request);
      const body = await request.json();
      const result = await updateInvoice(context, {
        invoice_id: slug[1],
        ...body,
      });
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    return errorResponse('Not found', 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    if (message.toLowerCase().includes('unauthorized')) {
      return errorResponse(message, 401);
    }
    return errorResponse(message, 400);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  let slug: string[] = [];
  try {
    ({ slug = [] } = await params);

    if (slug[0] === 'webhooks' && slug[1]) {
      const context = await requireApiContext(request);
      const endpoint = await db.query.webhookEndpoints.findFirst({
        where: (tbl, { and: andLocal, eq: eqLocal }) =>
          andLocal(
            eqLocal(tbl.workspaceId, context.workspaceId),
            eqLocal(tbl.id, slug[1]),
          ),
      });

      if (!endpoint) {
        return yieldErrorResponse('Webhook not found', 404, 'not_found');
      }

      await db
        .update(webhookEndpoints)
        .set({ isActive: false })
        .where(
          and(
            eq(webhookEndpoints.workspaceId, context.workspaceId),
            eq(webhookEndpoints.id, endpoint.id),
          ),
        );

      await logAuditEvent({
        workspaceId: context.workspaceId,
        actor: context.keyId,
        eventType: 'webhook.endpoint.disabled',
        metadata: {
          webhook_id: endpoint.id,
          url: endpoint.url,
          events: endpoint.events,
        },
      });

      return jsonResponse({ success: true });
    }

    if (slug[0] === 'attachments' && slug[1]) {
      const context = await requireApiContext(request);
      const result = await removeAttachment(context, {
        attachment_id: slug[1],
      });
      const payload = unwrapMcpResult(result);
      if (payload && typeof payload === 'object' && 'error' in payload) {
        return jsonResponse(payload, 400);
      }
      return jsonResponse(payload);
    }

    return errorResponse('Not found', 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    const lowerMessage = message.toLowerCase();
    const isYieldEndpoint = slug[0] === 'webhooks';

    if (isYieldEndpoint) {
      if (lowerMessage.includes('unauthorized')) {
        return yieldErrorResponse(message, 401, 'unauthorized');
      }
      if (lowerMessage.includes('forbidden')) {
        return yieldErrorResponse(message, 403, 'forbidden');
      }
      if (lowerMessage.includes('not found')) {
        return yieldErrorResponse(message, 404, 'not_found');
      }
      return yieldErrorResponse(message, 400);
    }

    if (lowerMessage.includes('unauthorized')) {
      return errorResponse(message, 401);
    }
    return errorResponse(message, 400);
  }
}
