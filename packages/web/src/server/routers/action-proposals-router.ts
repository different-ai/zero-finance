import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '../create-router';
import { db } from '@/db';
import { actionProposals } from '@/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { type Address, isAddress, parseEventLogs } from 'viem';
import {
  SUPPORTED_CHAINS,
  type SupportedChainId,
} from '@/lib/constants/chains';
import { getRPCManager } from '@/lib/multi-chain-rpc';
import {
  dispatchWebhookEvent,
  logAuditEvent,
} from '@/server/services/webhook-service';
import { getVaultPositions } from '@/server/earn/yield-positions';
import {
  getSafeOnChain,
  getWorkspaceSafes,
} from '@/server/earn/multi-chain-safe-manager';
import { getVaultByAddress, getVaultById } from '@/server/earn/vault-registry';

const proposalTypeSchema = z.enum([
  'crypto_transfer',
  'savings_deposit',
  'savings_withdraw',
]);

function requireWorkspaceId(workspaceId: string | null | undefined): string {
  if (!workspaceId) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Workspace context is required.',
    });
  }
  return workspaceId;
}

type SavingsDirection = 'deposit' | 'withdraw';

type VaultPayload = Record<string, unknown>;

function resolveSavingsDirection(
  proposalType: string,
): SavingsDirection | null {
  if (proposalType === 'savings_deposit') return 'deposit';
  if (proposalType === 'savings_withdraw') return 'withdraw';
  return null;
}

function resolvePayloadAmount(payload: VaultPayload): string | undefined {
  const amount = payload.amount;
  if (typeof amount === 'string') return amount;
  if (typeof amount === 'number') return amount.toString();
  return undefined;
}

async function resolveVaultId(payload: VaultPayload) {
  const directId =
    (typeof payload.vault_id === 'string' && payload.vault_id) ||
    (typeof payload.vaultId === 'string' && payload.vaultId) ||
    null;

  if (directId) return directId;

  const address =
    (typeof payload.vaultAddress === 'string' && payload.vaultAddress) ||
    (typeof payload.vault_address === 'string' && payload.vault_address) ||
    null;

  const chainIdRaw =
    (payload.chainId as number | string | undefined) ??
    (payload.chain_id as number | string | undefined);
  const chainId =
    typeof chainIdRaw === 'number'
      ? chainIdRaw
      : typeof chainIdRaw === 'string'
        ? Number(chainIdRaw)
        : null;

  if (!address || !chainId) return null;

  const vault = await getVaultByAddress(address as Address, chainId);
  return vault?.id ?? null;
}

const SAFE_EXECUTION_EVENTS_ABI = [
  {
    type: 'event',
    name: 'ExecutionSuccess',
    inputs: [
      { name: 'txHash', type: 'bytes32', indexed: true },
      { name: 'payment', type: 'uint256', indexed: false },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ExecutionFailure',
    inputs: [
      { name: 'txHash', type: 'bytes32', indexed: true },
      { name: 'payment', type: 'uint256', indexed: false },
    ],
    anonymous: false,
  },
] as const;

function isSupportedChainId(chainId: number): chainId is SupportedChainId {
  return Object.values(SUPPORTED_CHAINS).includes(chainId as SupportedChainId);
}

function resolveChainIdFromPayload(payload: VaultPayload): number | null {
  const chainIdRaw =
    (payload.chainId as number | string | undefined) ??
    (payload.chain_id as number | string | undefined);

  if (typeof chainIdRaw === 'number') return chainIdRaw;
  if (typeof chainIdRaw === 'string') {
    const parsed = Number(chainIdRaw);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export const actionProposalsRouter = router({
  list: protectedProcedure
    .input(
      z
        .object({
          includeCompleted: z.boolean().optional(),
          types: z.array(proposalTypeSchema).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const workspaceId = requireWorkspaceId(ctx.workspaceId);

      const conditions = [
        eq(actionProposals.workspaceId, workspaceId),
        eq(actionProposals.dismissed, false),
      ];

      if (input?.types?.length) {
        conditions.push(inArray(actionProposals.proposalType, input.types));
      }

      if (!input?.includeCompleted) {
        conditions.push(
          inArray(actionProposals.status, ['pending', 'approved']),
        );
      }

      return db.query.actionProposals.findMany({
        where: and(...conditions),
        orderBy: (table, { desc }) => [desc(table.createdAt)],
      });
    }),

  dismiss: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const workspaceId = requireWorkspaceId(ctx.workspaceId);

      const proposal = await db.query.actionProposals.findFirst({
        where: and(
          eq(actionProposals.id, input.id),
          eq(actionProposals.workspaceId, workspaceId),
        ),
      });

      if (!proposal) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Proposal not found',
        });
      }

      if (proposal.status !== 'pending') {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: `Only pending proposals can be dismissed (status: ${proposal.status}).`,
        });
      }

      await db
        .update(actionProposals)
        .set({ status: 'canceled', dismissed: true })
        .where(eq(actionProposals.id, proposal.id));

      return { success: true };
    }),

  markExecuted: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
        chainId: z.number().int().optional(),
        safeAddress: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workspaceId = requireWorkspaceId(ctx.workspaceId);

      const proposal = await db.query.actionProposals.findFirst({
        where: and(
          eq(actionProposals.id, input.id),
          eq(actionProposals.workspaceId, workspaceId),
        ),
      });

      if (!proposal) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Proposal not found',
        });
      }

      if (proposal.status === 'executed') {
        return { success: true, status: 'executed' as const };
      }

      if (proposal.status === 'failed') {
        return { success: true, status: 'failed' as const };
      }

      const payload = proposal.payload as VaultPayload;

      const vaultIdForChain = await resolveVaultId(payload);
      const vaultChainId = vaultIdForChain
        ? ((await getVaultById(vaultIdForChain))?.chainId ?? null)
        : null;

      const chainIdCandidate =
        input.chainId ?? resolveChainIdFromPayload(payload) ?? vaultChainId;

      const chainId: SupportedChainId =
        typeof chainIdCandidate === 'number' &&
        isSupportedChainId(chainIdCandidate)
          ? chainIdCandidate
          : SUPPORTED_CHAINS.BASE;

      let safeAddress: Address | null = null;
      if (input.safeAddress) {
        if (!isAddress(input.safeAddress)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid safeAddress',
          });
        }
        safeAddress = input.safeAddress as Address;
      } else if (ctx.userId) {
        const safe = await getSafeOnChain(
          ctx.userId,
          workspaceId,
          chainId,
          'primary',
        );
        if (safe?.safeAddress && isAddress(safe.safeAddress)) {
          safeAddress = safe.safeAddress as Address;
        }
      }

      if (!safeAddress) {
        const safes = await getWorkspaceSafes(workspaceId, 'primary');
        const safeOnChain = safes.find((safe) => safe.chainId === chainId);
        if (safeOnChain?.safeAddress && isAddress(safeOnChain.safeAddress)) {
          safeAddress = safeOnChain.safeAddress as Address;
        }
      }

      if (!safeAddress) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Could not resolve Safe address for execution verification.',
        });
      }

      const notifySavingsCompletion = async (params: {
        status: 'executed' | 'failed';
        txHash: string;
        reason?: string;
      }) => {
        const direction = resolveSavingsDirection(proposal.proposalType);
        if (!direction) return;

        const vaultId = await resolveVaultId(payload);
        const amount = resolvePayloadAmount(payload);

        await logAuditEvent({
          workspaceId,
          actor: ctx.userId ?? undefined,
          eventType: 'vault.action.completed',
          metadata: {
            proposal_id: proposal.id,
            vault_id: vaultId,
            amount,
            direction,
            status: params.status,
            tx_hash: params.txHash,
            ...(params.reason ? { reason: params.reason } : {}),
          },
        });

        await dispatchWebhookEvent({
          workspaceId,
          eventType: 'vault.action.completed',
          payload: {
            proposal_id: proposal.id,
            vault_id: vaultId,
            amount,
            direction,
            status: params.status,
            tx_hash: params.txHash,
            ...(params.reason ? { reason: params.reason } : {}),
          },
        });

        if (!vaultId) return;

        const safes = await getWorkspaceSafes(workspaceId);
        const ownerAddresses = safes.map((safe) => safe.safeAddress as Address);

        if (ownerAddresses.length === 0) return;

        const positions = await getVaultPositions({ ownerAddresses });
        const filtered = positions.filter(
          (position) => position.vaultId === vaultId,
        );

        await logAuditEvent({
          workspaceId,
          actor: ctx.userId ?? undefined,
          eventType: 'vault.position.updated',
          metadata: {
            vault_id: vaultId,
            positions: filtered,
          },
        });

        await dispatchWebhookEvent({
          workspaceId,
          eventType: 'vault.position.updated',
          payload: {
            vault_id: vaultId,
            positions: filtered,
            count: filtered.length,
          },
        });
      };

      // Mark as approved (submitted) immediately so the UI stops showing it as actionable.
      await db
        .update(actionProposals)
        .set({ status: 'approved', txHash: input.txHash })
        .where(eq(actionProposals.id, proposal.id));

      const rpcManager = getRPCManager();
      const client = rpcManager.getClient(chainId);

      let receipt;
      try {
        receipt = await client.waitForTransactionReceipt({
          hash: input.txHash as `0x${string}`,
          timeout: 20_000,
          pollingInterval: 1_000,
        });
      } catch (error) {
        return { success: true, status: 'approved' as const, pending: true };
      }

      const safeLogs = receipt.logs.filter(
        (log) => log.address.toLowerCase() === safeAddress.toLowerCase(),
      );

      const parsed = parseEventLogs({
        abi: SAFE_EXECUTION_EVENTS_ABI,
        logs: safeLogs,
        strict: false,
      });

      const hasFailure = parsed.some(
        (event) => event.eventName === 'ExecutionFailure',
      );
      const hasSuccess = parsed.some(
        (event) => event.eventName === 'ExecutionSuccess',
      );

      if (hasFailure && !hasSuccess) {
        const reason = 'Safe execution failed (ExecutionFailure).';
        await db
          .update(actionProposals)
          .set({
            status: 'failed',
            txHash: input.txHash,
            proposalMessage: reason,
          })
          .where(eq(actionProposals.id, proposal.id));

        await notifySavingsCompletion({
          status: 'failed',
          txHash: input.txHash,
          reason,
        });

        return { success: true, status: 'failed' as const };
      }

      if (hasSuccess) {
        await db
          .update(actionProposals)
          .set({ status: 'executed', txHash: input.txHash })
          .where(eq(actionProposals.id, proposal.id));

        await notifySavingsCompletion({
          status: 'executed',
          txHash: input.txHash,
        });

        return { success: true, status: 'executed' as const };
      }

      const reason =
        'Could not verify Safe execution (missing ExecutionSuccess/ExecutionFailure logs).';
      await db
        .update(actionProposals)
        .set({
          status: 'failed',
          txHash: input.txHash,
          proposalMessage: reason,
        })
        .where(eq(actionProposals.id, proposal.id));

      await notifySavingsCompletion({
        status: 'failed',
        txHash: input.txHash,
        reason,
      });

      return { success: true, status: 'failed' as const };
    }),

  markFailed: protectedProcedure
    .input(z.object({ id: z.string().uuid(), reason: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const workspaceId = requireWorkspaceId(ctx.workspaceId);

      const proposal = await db.query.actionProposals.findFirst({
        where: and(
          eq(actionProposals.id, input.id),
          eq(actionProposals.workspaceId, workspaceId),
        ),
      });

      if (!proposal) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Proposal not found',
        });
      }

      await db
        .update(actionProposals)
        .set({
          status: 'failed',
          proposalMessage: input.reason ?? proposal.proposalMessage,
        })
        .where(eq(actionProposals.id, proposal.id));

      const direction = resolveSavingsDirection(proposal.proposalType);
      if (direction) {
        const payload = proposal.payload as VaultPayload;
        const vaultId = await resolveVaultId(payload);
        const amount = resolvePayloadAmount(payload);

        await logAuditEvent({
          workspaceId,
          actor: ctx.userId ?? undefined,
          eventType: 'vault.action.completed',
          metadata: {
            proposal_id: proposal.id,
            vault_id: vaultId,
            amount,
            direction,
            status: 'failed',
            reason: input.reason,
          },
        });

        await dispatchWebhookEvent({
          workspaceId,
          eventType: 'vault.action.completed',
          payload: {
            proposal_id: proposal.id,
            vault_id: vaultId,
            amount,
            direction,
            status: 'failed',
            reason: input.reason,
          },
        });

        if (vaultId) {
          const safes = await getWorkspaceSafes(workspaceId);
          const ownerAddresses = safes.map(
            (safe) => safe.safeAddress as Address,
          );

          if (ownerAddresses.length > 0) {
            const positions = await getVaultPositions({ ownerAddresses });
            const filtered = positions.filter(
              (position) => position.vaultId === vaultId,
            );

            await logAuditEvent({
              workspaceId,
              actor: ctx.userId ?? undefined,
              eventType: 'vault.position.updated',
              metadata: {
                vault_id: vaultId,
                positions: filtered,
              },
            });

            await dispatchWebhookEvent({
              workspaceId,
              eventType: 'vault.position.updated',
              payload: {
                vault_id: vaultId,
                positions: filtered,
                count: filtered.length,
              },
            });
          }
        }
      }

      return { success: true };
    }),
});
