import { z } from 'zod';
import { db } from '@/db';
import { actionLedger } from '@/db/schema';
import { protectedProcedure, router } from '../create-router';
import { TRPCError } from '@trpc/server';
import { eq, and, desc } from 'drizzle-orm';
import type { InboxCard } from '@/types/inbox';

const logActionSchema = z.object({
  inboxCard: z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string(),
    icon: z.string(),
    confidence: z.number(),
    status: z.string(),
    sourceType: z.string(),
    sourceDetails: z.any(),
    impact: z.any(),
    amount: z.string().optional(),
    currency: z.string().optional(),
    rationale: z.string(),
    chainOfThought: z.array(z.string()),
    parsedInvoiceData: z.any().optional(),
    metadata: z.any().optional(),
  }),
  actionType: z.string(), // e.g., 'payment', 'transfer', 'invoice', 'allocation'
  executionDetails: z.any().optional(), // Transaction hashes, API responses, etc.
  note: z.string().optional(),
  categories: z.array(z.string()).optional(),
});

export const actionLedgerRouter = router({
  // Log an approved action to the ledger
  logApprovedAction: protectedProcedure
    .input(logActionSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      try {
        const ledgerEntry = await db.insert(actionLedger).values({
          approvedBy: userId,
          inboxCardId: input.inboxCard.id,
          actionTitle: input.inboxCard.title,
          actionSubtitle: input.inboxCard.subtitle,
          actionType: input.actionType,
          sourceType: input.inboxCard.sourceType,
          sourceDetails: input.inboxCard.sourceDetails,
          impactData: input.inboxCard.impact,
          amount: input.inboxCard.amount || null,
          currency: input.inboxCard.currency || null,
          confidence: input.inboxCard.confidence,
          rationale: input.inboxCard.rationale,
          chainOfThought: input.inboxCard.chainOfThought,
          originalCardData: input.inboxCard,
          parsedInvoiceData: input.inboxCard.parsedInvoiceData || null,
          status: 'approved',
          executionDetails: input.executionDetails || null,
          metadata: input.inboxCard.metadata || null,
          note: input.note || null,
          categories: input.categories || null,
        }).returning();

        console.log(`[Action Ledger] Logged approved action for user ${userId}:`, {
          ledgerEntryId: ledgerEntry[0]?.id,
          actionTitle: input.inboxCard.title,
          actionType: input.actionType,
        });

        return {
          success: true,
          ledgerEntryId: ledgerEntry[0]?.id,
          message: 'Action logged to ledger successfully',
        };
      } catch (error) {
        console.error('[Action Ledger] Error logging approved action:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to log action to ledger',
          cause: error,
        });
      }
    }),

  // Update ledger entry with execution details
  updateExecutionStatus: protectedProcedure
    .input(z.object({
      ledgerEntryId: z.string(),
      status: z.enum(['executed', 'failed', 'cancelled']),
      executionDetails: z.any().optional(),
      errorMessage: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      try {
        const updatedEntry = await db.update(actionLedger)
          .set({
            status: input.status,
            executionDetails: input.executionDetails || null,
            errorMessage: input.errorMessage || null,
            executedAt: input.status === 'executed' ? new Date() : null,
            updatedAt: new Date(),
          })
          .where(eq(actionLedger.id, input.ledgerEntryId))
          .returning();

        if (updatedEntry.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Ledger entry not found',
          });
        }

        console.log(`[Action Ledger] Updated execution status for user ${userId}:`, {
          ledgerEntryId: input.ledgerEntryId,
          status: input.status,
        });

        return {
          success: true,
          message: 'Execution status updated successfully',
        };
      } catch (error) {
        console.error('[Action Ledger] Error updating execution status:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update execution status',
          cause: error,
        });
      }
    }),

  // Delete an action log
  deleteActionLog: protectedProcedure
    .input(z.object({
      actionLogId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      try {
        // First check if the action log exists and belongs to the user
        const existingLog = await db.select()
          .from(actionLedger)
          .where(and(
            eq(actionLedger.id, input.actionLogId),
            eq(actionLedger.approvedBy, userId)
          ))
          .limit(1);

        if (existingLog.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Action log not found or you do not have permission to delete it',
          });
        }

        // Delete the action log
        await db.delete(actionLedger)
          .where(and(
            eq(actionLedger.id, input.actionLogId),
            eq(actionLedger.approvedBy, userId)
          ));

        console.log(`[Action Ledger] Deleted action log for user ${userId}:`, {
          actionLogId: input.actionLogId,
        });

        return {
          success: true,
          message: 'Action log deleted successfully',
        };
      } catch (error) {
        console.error('[Action Ledger] Error deleting action log:', error);
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete action log',
          cause: error,
        });
      }
    }),

  // Get user's action history
  getUserActionHistory: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
      actionType: z.string().optional(),
      status: z.enum(['approved', 'executed', 'failed', 'cancelled']).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      try {
        const whereConditions = [eq(actionLedger.approvedBy, userId)];
        
        if (input.actionType) {
          whereConditions.push(eq(actionLedger.actionType, input.actionType));
        }
        
        if (input.status) {
          whereConditions.push(eq(actionLedger.status, input.status));
        }

        const entries = await db.select()
          .from(actionLedger)
          .where(and(...whereConditions))
          .orderBy(desc(actionLedger.approvedAt))
          .limit(input.limit)
          .offset(input.offset);

        return {
          entries,
          total: entries.length, // In a real implementation, you'd do a separate count query
        };
      } catch (error) {
        console.error('[Action Ledger] Error fetching user action history:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch action history',
          cause: error,
        });
      }
    }),
});
