import { type ApiKeyContext } from '@/lib/mcp/api-key';
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
import {
  createSandboxFaucetMint,
  SandboxFaucetLimitError,
} from '@/server/earn/yield-sandbox';
import { getWorkspaceSafes } from '@/server/earn/multi-chain-safe-manager';
import { actionProposals, webhookEndpoints, workspaces } from '@/db/schema';
import { db } from '@/db';
import { and, eq } from 'drizzle-orm';
import { type Address, isAddress } from 'viem';
import crypto from 'crypto';
import {
  dispatchWebhookEvent,
  logAuditEvent,
  type WebhookEventType,
} from '@/server/services/webhook-service';

export const yieldTools = [
  {
    name: 'vaults.list',
    description: 'List curated yield vaults with insurance metadata.',
    inputSchema: {
      type: 'object',
      properties: {
        chain_id: { type: 'number' },
        insured: { type: 'boolean' },
        sandbox_only: { type: 'boolean' },
        status: { type: 'string' },
      },
      required: [],
    },
  },
  {
    name: 'vaults.get',
    description: 'Get a specific vault by id.',
    inputSchema: {
      type: 'object',
      properties: {
        vault_id: { type: 'string' },
      },
      required: ['vault_id'],
    },
  },
  {
    name: 'vaults.quote',
    description: 'Get a deposit/withdraw quote for a vault.',
    inputSchema: {
      type: 'object',
      properties: {
        vault_id: { type: 'string' },
        amount: { type: 'string' },
        direction: { type: 'string', enum: ['deposit', 'withdraw'] },
        slippage_bps: { type: 'number' },
        chain_id: { type: 'number' },
      },
      required: ['vault_id', 'amount', 'direction'],
    },
  },
  {
    name: 'vaults.instructions',
    description: 'Get calldata + approval instructions for a vault action.',
    inputSchema: {
      type: 'object',
      properties: {
        vault_id: { type: 'string' },
        amount: { type: 'string' },
        direction: { type: 'string', enum: ['deposit', 'withdraw'] },
        receiver: { type: 'string' },
        owner: { type: 'string' },
        chain_id: { type: 'number' },

        reason: { type: 'string' },
      },
      required: ['vault_id', 'amount'],
    },
  },
  {
    name: 'actions.withdraw',
    description: 'Create a managed withdrawal proposal for approval.',
    inputSchema: {
      type: 'object',
      properties: {
        vault_id: { type: 'string' },
        amount: { type: 'string' },
        receiver: { type: 'string' },
        owner: { type: 'string' },
        reason: { type: 'string' },
      },
      required: ['vault_id', 'amount'],
    },
  },
  {
    name: 'sandbox.status',
    description: 'Check sandbox/insurance status for the workspace.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'sandbox.faucet',
    description: 'Mint sandbox zUSDC to an address.',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string' },
        amount: { type: 'string' },
      },
      required: ['address', 'amount'],
    },
  },
  {
    name: 'webhooks.list',
    description: 'List webhook endpoints for the workspace.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'webhooks.create',
    description: 'Create a webhook endpoint for yield events.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        events: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'vault.position.updated',
              'vault.action.created',
              'vault.action.completed',
              'insurance.status.changed',
            ],
          },
        },
      },
      required: ['url', 'events'],
    },
  },
  {
    name: 'webhooks.disable',
    description: 'Disable a webhook endpoint by id.',
    inputSchema: {
      type: 'object',
      properties: {
        webhook_id: { type: 'string' },
      },
      required: ['webhook_id'],
    },
  },
  {
    name: 'workspace.status',
    description: 'Get workspace yield policy status.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
];

async function findWorkspaceOwner(workspaceId: string) {
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, workspaceId),
  });
  if (!workspace) {
    throw new Error('Workspace not found');
  }
  return workspace.createdBy;
}

type YieldErrorCode =
  | 'bad_request'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'rate_limited'
  | 'invalid_state'
  | 'internal';

function wrapResult(payload: unknown) {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(payload),
      },
    ],
  };
}

function wrapError(
  message: string,
  code: YieldErrorCode = 'bad_request',
  details?: Record<string, unknown>,
) {
  return wrapResult({
    error: {
      message,
      code,
      ...(details ? { details } : {}),
    },
  });
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

export async function handleYieldTool(
  context: ApiKeyContext,
  params: { name: string; arguments?: Record<string, unknown> },
) {
  const args = params.arguments ?? {};

  switch (params.name) {
    case 'vaults.list': {
      const vaults = await listVaultsForWorkspace(context.workspaceId, {
        chainId: typeof args.chain_id === 'number' ? args.chain_id : undefined,
        insured: typeof args.insured === 'boolean' ? args.insured : undefined,
        sandboxOnly:
          typeof args.sandbox_only === 'boolean'
            ? args.sandbox_only
            : undefined,
        status:
          args.status === 'active' || args.status === 'inactive'
            ? args.status
            : undefined,
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
      return wrapResult({
        vaults,
        ...(guidance ? { guidance } : {}),
      });
    }
    case 'vaults.get': {
      const vaultId = args.vault_id as string | undefined;
      if (!vaultId) return wrapError('vault_id is required');
      const vault = await getVaultForWorkspace(context.workspaceId, vaultId);
      if (!vault) {
        const suggestions = await getVaultSuggestions(context.workspaceId);
        return wrapError('Vault not found', 'not_found', {
          suggested_vaults: suggestions,
        });
      }
      return wrapResult(vault);
    }
    case 'vaults.quote': {
      const vaultId = args.vault_id as string | undefined;
      const amount = args.amount as string | undefined;
      const direction = args.direction as 'deposit' | 'withdraw' | undefined;
      if (!vaultId || !amount || !direction) {
        return wrapError('vault_id, amount, direction required');
      }
      const vault = await getVaultForWorkspace(context.workspaceId, vaultId);
      if (!vault) {
        const suggestions = await getVaultSuggestions(context.workspaceId);
        return wrapError('Vault not found', 'not_found', {
          suggested_vaults: suggestions,
        });
      }

      if (
        typeof args.chain_id === 'number' &&
        args.chain_id !== vault.chainId
      ) {
        return wrapError(
          'Chain mismatch for requested vault',
          'invalid_state',
          buildChainMismatchDetails({
            expectedChainId: vault.chainId,
            providedChainId: args.chain_id,
          }),
        );
      }

      const quote = await getVaultQuoteForWorkspace({
        workspaceId: context.workspaceId,
        vaultId,
        amount,
        direction,
        slippageBps:
          typeof args.slippage_bps === 'number' ? args.slippage_bps : undefined,
      });
      return wrapResult({ quote: { ...quote, chain_id: vault.chainId } });
    }
    case 'vaults.instructions': {
      const vaultId = args.vault_id as string | undefined;
      const amount = args.amount as string | undefined;
      const direction = args.direction as 'deposit' | 'withdraw' | undefined;
      const receiver = args.receiver as string | undefined;
      const owner = args.owner as string | undefined;
      if (!vaultId || !amount || !direction || !receiver) {
        return wrapError('vault_id, amount, direction, receiver required');
      }
      if (!isAddress(receiver)) {
        return wrapError('Invalid receiver address');
      }
      if (owner && !isAddress(owner)) {
        return wrapError('Invalid owner address');
      }

      const vault = await getVaultForWorkspace(context.workspaceId, vaultId);
      if (!vault) {
        const suggestions = await getVaultSuggestions(context.workspaceId);
        return wrapError('Vault not found', 'not_found', {
          suggested_vaults: suggestions,
        });
      }

      if (
        typeof args.chain_id === 'number' &&
        args.chain_id !== vault.chainId
      ) {
        return wrapError(
          'Chain mismatch for requested vault',
          'invalid_state',
          buildChainMismatchDetails({
            expectedChainId: vault.chainId,
            providedChainId: args.chain_id,
          }),
        );
      }

      const policy = await getWorkspaceYieldPolicy(context.workspaceId);
      if (!vault.actionability.actionable) {
        return wrapError(
          vault.actionability.reason ?? 'Vault action not allowed',
          'forbidden',
          buildVaultPolicyErrorDetails(
            policy,
            vault,
            vault.actionability.reason,
          ),
        );
      }

      const instructions = await getVaultInstructionsForWorkspace({
        workspaceId: context.workspaceId,
        vaultId,
        amount,
        direction,
        receiver: receiver as Address,
        owner: owner ? (owner as Address) : (receiver as Address),
      });
      return wrapResult({
        instructions: { ...instructions, chain_id: vault.chainId },
      });
    }
    case 'positions.list': {
      const addresses = Array.isArray(args.addresses)
        ? (args.addresses as string[])
        : [];
      const ownerAddresses = addresses.length
        ? (addresses as Address[])
        : (await getWorkspaceSafes(context.workspaceId)).map(
            (safe) => safe.safeAddress as Address,
          );
      const positions = await getVaultPositions({ ownerAddresses });
      return wrapResult({ positions, count: positions.length });
    }
    case 'positions.get': {
      const vaultId = args.vault_id as string | undefined;
      if (!vaultId) return wrapError('vault_id required');
      const addresses = Array.isArray(args.addresses)
        ? (args.addresses as string[])
        : [];
      const ownerAddresses = addresses.length
        ? (addresses as Address[])
        : (await getWorkspaceSafes(context.workspaceId)).map(
            (safe) => safe.safeAddress as Address,
          );
      const positions = await getVaultPositions({ ownerAddresses });
      const filtered = positions.filter(
        (position) => position.vaultId === vaultId,
      );
      return wrapResult({ positions: filtered, count: filtered.length });
    }
    case 'actions.deposit': {
      const vaultId = args.vault_id as string | undefined;
      const amount = args.amount as string | undefined;
      if (!vaultId || !amount) {
        return wrapError('vault_id and amount required');
      }
      const vault = await getVaultForWorkspace(context.workspaceId, vaultId);
      if (!vault) {
        const suggestions = await getVaultSuggestions(context.workspaceId);
        return wrapError('Vault not found', 'not_found', {
          suggested_vaults: suggestions,
        });
      }
      const policy = await getWorkspaceYieldPolicy(context.workspaceId);
      if (!vault.actionability.actionable) {
        return wrapError(
          vault.actionability.reason ?? 'Vault action not allowed',
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
          proposalMessage: args.reason as string | undefined,
          payload: {
            vault_id: vaultId,
            amount,
            receiver: args.receiver,
            owner: args.owner,
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

      return wrapResult({ success: true, proposal_id: proposal?.id });
    }
    case 'actions.withdraw': {
      const vaultId = args.vault_id as string | undefined;
      const amount = args.amount as string | undefined;
      if (!vaultId || !amount) {
        return wrapError('vault_id and amount required');
      }
      const vault = await getVaultForWorkspace(context.workspaceId, vaultId);
      if (!vault) {
        const suggestions = await getVaultSuggestions(context.workspaceId);
        return wrapError('Vault not found', 'not_found', {
          suggested_vaults: suggestions,
        });
      }
      const policy = await getWorkspaceYieldPolicy(context.workspaceId);
      if (!vault.actionability.actionable) {
        return wrapError(
          vault.actionability.reason ?? 'Vault action not allowed',
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
          proposalMessage: args.reason as string | undefined,
          payload: {
            vault_id: vaultId,
            amount,
            receiver: args.receiver,
            owner: args.owner,
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

      return wrapResult({ success: true, proposal_id: proposal?.id });
    }
    case 'sandbox.status': {
      const policy = await getWorkspaceYieldPolicy(context.workspaceId);
      return wrapResult({
        insurance_status: policy.insuranceStatus,
        has_completed_kyc: policy.hasCompletedKyc,
        sandbox_enabled: policy.canUseSandbox,
      });
    }
    case 'sandbox.faucet': {
      const address = args.address as string | undefined;
      const amount = args.amount as string | undefined;
      if (!address || !amount) {
        return wrapError('address and amount required');
      }
      if (!isAddress(address)) {
        return wrapError('Invalid address');
      }
      if (!/^[0-9]+$/.test(amount)) {
        return wrapError('Amount must be a numeric base-unit string');
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
          return wrapResult({
            error: {
              message: limitError.message,
              code: 'rate_limited',
              retry_at: limitError.retryAt?.toISOString() ?? null,
              scope: limitError.scope,
            },
          });
        }
        throw error;
      }

      if (!result) {
        return wrapError('Sandbox faucet unavailable', 'internal');
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

      return wrapResult({ success: true, ...result });
    }
    case 'webhooks.list': {
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

      return wrapResult({ webhooks, count: webhooks.length });
    }
    case 'webhooks.create': {
      const url = args.url as string | undefined;
      if (!url) {
        return wrapError('url is required');
      }

      let events: WebhookEventType[] = [];
      try {
        events = parseWebhookEvents(args.events);
      } catch (error) {
        return wrapError(
          error instanceof Error ? error.message : 'Invalid events payload',
        );
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

      return wrapResult({
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
      });
    }
    case 'webhooks.disable': {
      const webhookId = args.webhook_id as string | undefined;
      if (!webhookId) {
        return wrapError('webhook_id is required');
      }

      const endpoint = await db.query.webhookEndpoints.findFirst({
        where: (tbl, { and: andLocal, eq: eqLocal }) =>
          andLocal(
            eqLocal(tbl.workspaceId, context.workspaceId),
            eqLocal(tbl.id, webhookId),
          ),
      });

      if (!endpoint) {
        return wrapError('Webhook not found', 'not_found');
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

      return wrapResult({ success: true });
    }
    case 'workspace.status': {
      const policy = await getWorkspaceYieldPolicy(context.workspaceId);
      return wrapResult({
        workspace_id: context.workspaceId,
        insurance_status: policy.insuranceStatus,
        has_completed_kyc: policy.hasCompletedKyc,
        sandbox_enabled: policy.canUseSandbox,
      });
    }
    default:
      return wrapError(`Unknown tool: ${params.name}`, 'bad_request');
  }
}
