import { NextRequest, NextResponse } from 'next/server';
import {
  authenticateApiKeyRequest,
  hasValidAdminToken,
} from '@/server/cli/auth';
import {
  buildVaultPolicyErrorDetails,
  getVaultForWorkspace,
  getVaultInstructionsForWorkspace,
  getVaultQuoteForWorkspace,
  getVaultSuggestions,
  listVaultsForWorkspace,
} from '@/server/earn/yield-service';
import { getVaultPositions } from '@/server/earn/yield-positions';
import { getWorkspaceYieldPolicy } from '@/server/services/yield-policy';
import { getWorkspaceSafes } from '@/server/earn/multi-chain-safe-manager';
import { db } from '@/db';
import { actionProposals, webhookEndpoints, workspaces } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { type Address, isAddress } from 'viem';
import crypto from 'crypto';
import {
  createSandboxFaucetMint,
  SandboxFaucetLimitError,
} from '@/server/earn/yield-sandbox';
import {
  dispatchWebhookEvent,
  logAuditEvent,
  type WebhookEventType,
} from '@/server/services/webhook-service';

export const dynamic = 'force-dynamic';

type YieldErrorCode =
  | 'bad_request'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'rate_limited'
  | 'invalid_state'
  | 'internal';

function jsonResponse(payload: unknown, status = 200) {
  return NextResponse.json(payload, { status });
}

function statusToYieldCode(status: number): YieldErrorCode {
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not_found';
  if (status === 429) return 'rate_limited';
  if (status >= 500) return 'internal';
  return 'bad_request';
}

function errorResponse(
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

async function requireApiContext(request: NextRequest) {
  const context = await authenticateApiKeyRequest(request);
  if (!context) {
    throw new Error('Unauthorized: invalid or missing API key');
  }
  return context;
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

async function findWorkspaceOwner(workspaceId: string) {
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, workspaceId),
  });
  if (!workspace) {
    throw new Error('Workspace not found');
  }
  return workspace.createdBy;
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
  try {
    const { slug = [] } = await params;
    const context = await requireApiContext(request);

    if (slug[0] === 'vaults' && !slug[1]) {
      const { searchParams } = request.nextUrl;
      const chainId = searchParams.get('chain_id');
      const insured = parseBoolean(searchParams.get('insured'));
      const sandboxOnly = parseBoolean(searchParams.get('sandbox_only'));
      const status = searchParams.get('status') as 'active' | 'inactive' | null;

      const listStart = Date.now();
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

      await logAuditEvent({
        workspaceId: context.workspaceId,
        actor: context.keyId,
        eventType: 'vault.list.requested',
        metadata: {
          duration_ms: Date.now() - listStart,
          count: vaults.length,
          filters: {
            chain_id: chainId ? Number(chainId) : null,
            insured,
            sandbox_only: sandboxOnly,
            status,
          },
        },
      });

      return jsonResponse({
        vaults,
        ...(guidance ? { guidance } : {}),
      });
    }

    if (slug[0] === 'vaults' && slug[1] && !slug[2]) {
      const vault = await getVaultForWorkspace(context.workspaceId, slug[1]);
      if (!vault) {
        const suggestions = await getVaultSuggestions(context.workspaceId);
        return errorResponse('Vault not found', 404, 'not_found', {
          suggested_vaults: suggestions,
        });
      }
      return jsonResponse(vault);
    }

    if (slug[0] === 'vaults' && slug[1] && slug[2] === 'quote') {
      const { searchParams } = request.nextUrl;
      const amount = searchParams.get('amount');
      const direction = searchParams.get('direction') as
        | 'deposit'
        | 'withdraw'
        | null;
      const slippageBps = searchParams.get('slippage_bps');
      const requestedChainId = searchParams.get('chain_id');

      if (!amount || !direction) {
        return errorResponse('Missing amount or direction', 400);
      }

      const vault = await getVaultForWorkspace(context.workspaceId, slug[1]);
      if (!vault) {
        const suggestions = await getVaultSuggestions(context.workspaceId);
        return errorResponse('Vault not found', 404, 'not_found', {
          suggested_vaults: suggestions,
        });
      }

      if (requestedChainId) {
        const chainId = Number(requestedChainId);
        if (!Number.isFinite(chainId)) {
          return errorResponse('Invalid chain_id', 400, 'bad_request');
        }
        if (chainId !== vault.chainId) {
          return errorResponse(
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

      const quoteStart = Date.now();
      const quote = await getVaultQuoteForWorkspace({
        workspaceId: context.workspaceId,
        vaultId: slug[1],
        amount,
        direction,
        slippageBps: slippageBps ? Number(slippageBps) : undefined,
      });

      await logAuditEvent({
        workspaceId: context.workspaceId,
        actor: context.keyId,
        eventType: 'vault.quote.requested',
        metadata: {
          vault_id: slug[1],
          direction,
          amount,
          duration_ms: Date.now() - quoteStart,
        },
      });

      return jsonResponse({ quote: { ...quote, chain_id: vault.chainId } });
    }

    if (slug[0] === 'vaults' && slug[1] && slug[2] === 'instructions') {
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
        return errorResponse('Missing amount or direction', 400);
      }

      const vault = await getVaultForWorkspace(context.workspaceId, slug[1]);
      if (!vault) {
        const suggestions = await getVaultSuggestions(context.workspaceId);
        return errorResponse('Vault not found', 404, 'not_found', {
          suggested_vaults: suggestions,
        });
      }

      if (requestedChainId) {
        const chainId = Number(requestedChainId);
        if (!Number.isFinite(chainId)) {
          return errorResponse('Invalid chain_id', 400, 'bad_request');
        }
        if (chainId !== vault.chainId) {
          return errorResponse(
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
        return errorResponse(
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
        return errorResponse('Missing or invalid receiver address', 400);
      }

      const owner =
        ownerParam && isAddress(ownerParam)
          ? (ownerParam as Address)
          : receiver;

      const instructionsStart = Date.now();
      const instructions = await getVaultInstructionsForWorkspace({
        workspaceId: context.workspaceId,
        vaultId: slug[1],
        amount,
        direction,
        receiver,
        owner,
      });

      await logAuditEvent({
        workspaceId: context.workspaceId,
        actor: context.keyId,
        eventType: 'vault.instructions.requested',
        metadata: {
          vault_id: slug[1],
          direction,
          amount,
          duration_ms: Date.now() - instructionsStart,
        },
      });

      return jsonResponse({
        instructions: { ...instructions, chain_id: vault.chainId },
      });
    }

    if (slug[0] === 'positions') {
      const { searchParams } = request.nextUrl;
      const addresses = searchParams.getAll('address').filter(Boolean);

      const ownerAddresses = addresses.length
        ? (addresses as Address[])
        : (await getWorkspaceSafes(context.workspaceId)).map(
            (safe) => safe.safeAddress as Address,
          );

      const positionsStart = Date.now();
      const positions = await getVaultPositions({ ownerAddresses });

      if (slug[1]) {
        const filtered = positions.filter(
          (position) => position.vaultId === slug[1],
        );

        await logAuditEvent({
          workspaceId: context.workspaceId,
          actor: context.keyId,
          eventType: 'vault.position.updated',
          metadata: {
            vault_id: slug[1],
            count: filtered.length,
            duration_ms: Date.now() - positionsStart,
          },
        });

        await dispatchWebhookEvent({
          workspaceId: context.workspaceId,
          eventType: 'vault.position.updated',
          payload: {
            vault_id: slug[1],
            positions: filtered,
            count: filtered.length,
          },
        });

        return jsonResponse({ positions: filtered, count: filtered.length });
      }

      await logAuditEvent({
        workspaceId: context.workspaceId,
        actor: context.keyId,
        eventType: 'vault.position.updated',
        metadata: {
          count: positions.length,
          duration_ms: Date.now() - positionsStart,
        },
      });

      await dispatchWebhookEvent({
        workspaceId: context.workspaceId,
        eventType: 'vault.position.updated',
        payload: {
          positions,
          count: positions.length,
        },
      });

      return jsonResponse({ positions, count: positions.length });
    }

    if (slug[0] === 'sandbox' && slug[1] === 'status') {
      const policy = await getWorkspaceYieldPolicy(context.workspaceId);
      return jsonResponse({
        insurance_status: policy.insuranceStatus,
        has_completed_kyc: policy.hasCompletedKyc,
        sandbox_enabled: policy.canUseSandbox,
      });
    }

    if (slug[0] === 'sandbox' && slug[1] === 'vaults') {
      const vaults = await listVaultsForWorkspace(context.workspaceId, {
        sandboxOnly: true,
      });
      return jsonResponse({ vaults });
    }

    if (slug[0] === 'workspace' && slug[1] === 'status') {
      const policy = await getWorkspaceYieldPolicy(context.workspaceId);
      return jsonResponse({
        workspace_id: context.workspaceId,
        insurance_status: policy.insuranceStatus,
        has_completed_kyc: policy.hasCompletedKyc,
        sandbox_enabled: policy.canUseSandbox,
      });
    }

    if (slug[0] === 'webhooks' && !slug[1]) {
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

    return errorResponse('Not found', 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('unauthorized')) {
      return errorResponse(message, 401, 'unauthorized');
    }
    if (lowerMessage.includes('forbidden')) {
      return errorResponse(message, 403, 'forbidden');
    }
    if (lowerMessage.includes('not found')) {
      return errorResponse(message, 404, 'not_found');
    }
    return errorResponse(message, 400);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  try {
    const { slug = [] } = await params;

    if (slug[0] === 'admin' && slug[1] === 'workspaces' && slug[2]) {
      if (!hasValidAdminToken(request)) {
        return errorResponse('Unauthorized: invalid admin token', 401);
      }

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

    const context = await requireApiContext(request);

    if (slug[0] === 'webhooks' && !slug[1]) {
      const body = await request.json();
      const url = body?.url as string | undefined;
      const events = parseWebhookEvents(body?.events);

      if (!url) {
        return errorResponse('Missing url', 400);
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
      const body = await request.json();
      const address = body?.address as string | undefined;
      const amount = body?.amount as string | undefined;

      if (!address || !isAddress(address)) {
        return errorResponse('Missing or invalid address', 400);
      }

      if (!amount) {
        return errorResponse('Missing amount', 400);
      }

      if (!/^[0-9]+$/.test(amount)) {
        return errorResponse('Amount must be a numeric base-unit string', 400);
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
        return errorResponse('Sandbox faucet unavailable', 500, 'internal');
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
      const body = await request.json();
      const vaultId = body?.vault_id as string | undefined;
      const amount = body?.amount as string | undefined;
      const receiver = body?.receiver as string | undefined;
      const owner = body?.owner as string | undefined;
      const reason = body?.reason as string | undefined;

      if (!vaultId || !amount) {
        return errorResponse('Missing vault_id or amount', 400);
      }

      const vault = await getVaultForWorkspace(context.workspaceId, vaultId);
      if (!vault) {
        const suggestions = await getVaultSuggestions(context.workspaceId);
        return errorResponse('Vault not found', 404, 'not_found', {
          suggested_vaults: suggestions,
        });
      }
      const policy = await getWorkspaceYieldPolicy(context.workspaceId);
      if (!vault.actionability.actionable) {
        return errorResponse(
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

      const ownerDid = await findWorkspaceOwner(context.workspaceId);

      const [proposal] = await db
        .insert(actionProposals)
        .values({
          userDid: ownerDid,
          workspaceId: context.workspaceId,
          proposalType: 'savings_deposit',
          proposalMessage: reason,
          payload: {
            vault_id: vaultId,
            amount,
            receiver,
            owner,
          },
        })
        .returning();

      if (proposal) {
        await logAuditEvent({
          workspaceId: context.workspaceId,
          actor: context.keyId,
          eventType: 'vault.action.created',
          metadata: {
            proposal_id: proposal.id,
            vault_id: vaultId,
            amount,
            direction: 'deposit',
          },
        });

        await dispatchWebhookEvent({
          workspaceId: context.workspaceId,
          eventType: 'vault.action.created',
          payload: {
            proposal_id: proposal.id,
            vault_id: vaultId,
            amount,
            direction: 'deposit',
          },
        });
      }

      return jsonResponse({
        success: true,
        proposal_id: proposal?.id,
      });
    }

    if (slug[0] === 'actions' && slug[1] === 'vault-withdraw') {
      const body = await request.json();
      const vaultId = body?.vault_id as string | undefined;
      const amount = body?.amount as string | undefined;
      const receiver = body?.receiver as string | undefined;
      const owner = body?.owner as string | undefined;
      const reason = body?.reason as string | undefined;

      if (!vaultId || !amount) {
        return errorResponse('Missing vault_id or amount', 400);
      }

      const vault = await getVaultForWorkspace(context.workspaceId, vaultId);
      if (!vault) {
        const suggestions = await getVaultSuggestions(context.workspaceId);
        return errorResponse('Vault not found', 404, 'not_found', {
          suggested_vaults: suggestions,
        });
      }
      const policy = await getWorkspaceYieldPolicy(context.workspaceId);
      if (!vault.actionability.actionable) {
        return errorResponse(
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

      const ownerDid = await findWorkspaceOwner(context.workspaceId);

      const [proposal] = await db
        .insert(actionProposals)
        .values({
          userDid: ownerDid,
          workspaceId: context.workspaceId,
          proposalType: 'savings_withdraw',
          proposalMessage: reason,
          payload: {
            vault_id: vaultId,
            amount,
            receiver,
            owner,
          },
        })
        .returning();

      if (proposal) {
        await logAuditEvent({
          workspaceId: context.workspaceId,
          actor: context.keyId,
          eventType: 'vault.action.created',
          metadata: {
            proposal_id: proposal.id,
            vault_id: vaultId,
            amount,
            direction: 'withdraw',
          },
        });

        await dispatchWebhookEvent({
          workspaceId: context.workspaceId,
          eventType: 'vault.action.created',
          payload: {
            proposal_id: proposal.id,
            vault_id: vaultId,
            amount,
            direction: 'withdraw',
          },
        });
      }

      return jsonResponse({
        success: true,
        proposal_id: proposal?.id,
      });
    }

    return errorResponse('Not found', 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('unauthorized')) {
      return errorResponse(message, 401, 'unauthorized');
    }
    if (lowerMessage.includes('forbidden')) {
      return errorResponse(message, 403, 'forbidden');
    }
    if (lowerMessage.includes('not found')) {
      return errorResponse(message, 404, 'not_found');
    }
    return errorResponse(message, 400);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  try {
    const { slug = [] } = await params;
    const context = await requireApiContext(request);

    if (slug[0] === 'webhooks' && slug[1]) {
      const endpoint = await db.query.webhookEndpoints.findFirst({
        where: (tbl, { and: andLocal, eq: eqLocal }) =>
          andLocal(
            eqLocal(tbl.workspaceId, context.workspaceId),
            eqLocal(tbl.id, slug[1]),
          ),
      });

      if (!endpoint) {
        return errorResponse('Webhook not found', 404, 'not_found');
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

    return errorResponse('Not found', 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('unauthorized')) {
      return errorResponse(message, 401, 'unauthorized');
    }
    if (lowerMessage.includes('forbidden')) {
      return errorResponse(message, 403, 'forbidden');
    }
    if (lowerMessage.includes('not found')) {
      return errorResponse(message, 404, 'not_found');
    }
    return errorResponse(message, 400);
  }
}
