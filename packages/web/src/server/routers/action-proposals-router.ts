import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '../create-router';
import { db } from '@/db';
import { actionProposals } from '@/db/schema';
import { and, eq, inArray } from 'drizzle-orm';

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

      return { success: true };
    }),
});
