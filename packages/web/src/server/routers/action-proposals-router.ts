import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '../create-router';
import { db } from '@/db';
import { actionProposals } from '@/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { type Address } from 'viem';
import {
  dispatchWebhookEvent,
  logAuditEvent,
} from '@/server/services/webhook-service';
import { getVaultPositions } from '@/server/earn/yield-positions';
import { getWorkspaceSafes } from '@/server/earn/multi-chain-safe-manager';
import { getVaultByAddress } from '@/server/earn/vault-registry';

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
    .input(z.object({ id: z.string().uuid(), txHash: z.string().min(1) }))
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
        .set({ status: 'executed', txHash: input.txHash })
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
            status: 'executed',
            tx_hash: input.txHash,
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
            status: 'executed',
            tx_hash: input.txHash,
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
