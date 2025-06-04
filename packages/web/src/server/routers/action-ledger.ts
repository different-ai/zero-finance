import { z } from 'zod';
import { router as createTRPCRouter, protectedProcedure } from '../create-router';
import { actionLedger } from '@/db/schema';
import { eq, desc, count } from 'drizzle-orm';
import { db } from '@/db';

export const actionLedgerRouter = createTRPCRouter({
  getUserActionLedgerEntries: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, offset } = input;
      const userId = ctx.user.id; // <-- CORRECTED: Access user directly from ctx
      console.log('userId', userId);

      const ledgerEntries = await db
        .select({
          id: actionLedger.id,
          actionTitle: actionLedger.actionTitle,
          actionType: actionLedger.actionType,
          status: actionLedger.status,
          approvedAt: actionLedger.approvedAt,
          amount: actionLedger.amount,
          currency: actionLedger.currency,
        })
        .from(actionLedger)
        .where(eq(actionLedger.approvedBy, userId))
        .orderBy(desc(actionLedger.approvedAt))
        .limit(limit)
        .offset(offset);

      // Get total count for pagination
      const totalCountResult = await db
        .select({ value: count() })
        .from(actionLedger)
        .where(eq(actionLedger.approvedBy, userId));
      
      const totalCount = totalCountResult[0]?.value ?? 0;

      return {
        entries: ledgerEntries,
        totalCount,
        limit,
        offset,
      };
    }),
}); 