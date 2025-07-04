import { z } from 'zod';
import { db } from '@/db';
import { inboxCards, actionLedger } from '@/db/schema';
import { protectedProcedure, router } from '../create-router';
import { TRPCError } from '@trpc/server';
import { eq, and, desc, asc, inArray } from 'drizzle-orm';

// Schema for creating a new inbox card
const createInboxCardSchema = z.object({
  cardId: z.string(),
  icon: z.string(),
  title: z.string(),
  subtitle: z.string(),
  confidence: z.number().min(0).max(100),
  status: z.enum(['pending', 'executed', 'dismissed', 'auto', 'snoozed', 'error', 'seen', 'done']).default('pending'),
  blocked: z.boolean().default(false),
  timestamp: z.string(), // ISO string
  snoozedTime: z.string().optional(),
  isAiSuggestionPending: z.boolean().default(false),
  requiresAction: z.boolean().default(false),
  suggestedActionLabel: z.string().optional(),
  amount: z.string().optional(),
  currency: z.string().optional(),
  fromEntity: z.string().optional(),
  toEntity: z.string().optional(),
  logId: z.string(),
  subjectHash: z.string().nullable().optional(),
  rationale: z.string(),
  codeHash: z.string(),
  chainOfThought: z.array(z.string()),
  impact: z.any(), // Financial impact object
  parsedInvoiceData: z.any().optional(),
  sourceDetails: z.any(),
  comments: z.array(z.any()).default([]),
  suggestedUpdate: z.any().optional(),
  metadata: z.any().optional(),
  sourceType: z.string(),
  embedding: z.array(z.number()).optional(),
});

// Schema for updating an inbox card
const updateInboxCardSchema = z.object({
  cardId: z.string(),
  status: z.enum(['pending', 'executed', 'dismissed', 'auto', 'snoozed', 'error', 'seen', 'done']).optional(),
  blocked: z.boolean().optional(),
  snoozedTime: z.string().optional(),
  isAiSuggestionPending: z.boolean().optional(),
  comments: z.array(z.any()).optional(),
  suggestedUpdate: z.any().optional(),
});

export const inboxCardsRouter = router({
  // Create a new inbox card
  createCard: protectedProcedure
    .input(createInboxCardSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      try {
        const newCard = await db.insert(inboxCards).values({
          userId,
          cardId: input.cardId,
          icon: input.icon,
          title: input.title,
          subtitle: input.subtitle,
          confidence: input.confidence,
          status: input.status,
          blocked: input.blocked,
          timestamp: new Date(input.timestamp),
          snoozedTime: input.snoozedTime || null,
          isAiSuggestionPending: input.isAiSuggestionPending,
          requiresAction: input.requiresAction,
          suggestedActionLabel: input.suggestedActionLabel || null,
          amount: input.amount || null,
          currency: input.currency || null,
          fromEntity: input.fromEntity || null,
          toEntity: input.toEntity || null,
          logId: input.logId,
          subjectHash: input.subjectHash || null,
          rationale: input.rationale,
          codeHash: input.codeHash,
          chainOfThought: input.chainOfThought,
          impact: input.impact,
          parsedInvoiceData: input.parsedInvoiceData || null,
          sourceDetails: input.sourceDetails,
          comments: input.comments,
          suggestedUpdate: input.suggestedUpdate || null,
          metadata: input.metadata || null,
          sourceType: input.sourceType,
          embedding: input.embedding || [],
        }).returning();

        console.log(`[Inbox Cards] Created new card for user ${userId}:`, {
          cardId: input.cardId,
          title: input.title,
          sourceType: input.sourceType,
        });

        return {
          success: true,
          card: newCard[0],
          message: 'Inbox card created successfully',
        };
      } catch (error) {
        console.error('[Inbox Cards] Error creating card:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create inbox card',
          cause: error,
        });
      }
    }),

  // Get user's inbox cards with filtering
  getUserCards: protectedProcedure
    .input(z.object({
      status: z.enum(['pending', 'executed', 'dismissed', 'auto', 'snoozed', 'error', 'seen', 'done']).optional(),
      sourceType: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
      sortBy: z.enum(['timestamp', 'confidence', 'createdAt']).default('timestamp'),
      sortOrder: z.enum(['asc', 'desc']).default('desc'),
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      try {
        const whereConditions = [eq(inboxCards.userId, userId)];
        
        if (input.status) {
          whereConditions.push(eq(inboxCards.status, input.status));
        }
        
        if (input.sourceType) {
          whereConditions.push(eq(inboxCards.sourceType, input.sourceType));
        }

        const orderByColumn = input.sortBy === 'timestamp' ? inboxCards.timestamp :
                             input.sortBy === 'confidence' ? inboxCards.confidence :
                             inboxCards.createdAt;

        const orderBy = input.sortOrder === 'asc' ? asc(orderByColumn) : desc(orderByColumn);

        const cards = await db.select()
          .from(inboxCards)
          .where(and(...whereConditions))
          .orderBy(orderBy)
          .limit(input.limit)
          .offset(input.offset);

        return {
          cards,
          total: cards.length, // In a real implementation, you'd do a separate count query
        };
      } catch (error) {
        console.error('[Inbox Cards] Error fetching user cards:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch inbox cards',
          cause: error,
        });
      }
    }),

  // Update an inbox card
  updateCard: protectedProcedure
    .input(updateInboxCardSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      try {
        const updateData: any = {
          updatedAt: new Date(),
        };

        if (input.status !== undefined) updateData.status = input.status;
        if (input.blocked !== undefined) updateData.blocked = input.blocked;
        if (input.snoozedTime !== undefined) updateData.snoozedTime = input.snoozedTime;
        if (input.isAiSuggestionPending !== undefined) updateData.isAiSuggestionPending = input.isAiSuggestionPending;
        if (input.comments !== undefined) updateData.comments = input.comments;
        if (input.suggestedUpdate !== undefined) updateData.suggestedUpdate = input.suggestedUpdate;

        const updatedCard = await db.update(inboxCards)
          .set(updateData)
          .where(and(
            eq(inboxCards.cardId, input.cardId),
            eq(inboxCards.userId, userId)
          ))
          .returning();

        if (updatedCard.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Inbox card not found or you do not have permission to update it',
          });
        }

        console.log(`[Inbox Cards] Updated card for user ${userId}:`, {
          cardId: input.cardId,
          updates: Object.keys(updateData),
        });

        return {
          success: true,
          card: updatedCard[0],
          message: 'Inbox card updated successfully',
        };
      } catch (error) {
        console.error('[Inbox Cards] Error updating card:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update inbox card',
          cause: error,
        });
      }
    }),

  // Delete an inbox card
  deleteCard: protectedProcedure
    .input(z.object({
      cardId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      try {
        const deletedCard = await db.delete(inboxCards)
          .where(and(
            eq(inboxCards.cardId, input.cardId),
            eq(inboxCards.userId, userId)
          ))
          .returning();

        if (deletedCard.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Inbox card not found or you do not have permission to delete it',
          });
        }

        console.log(`[Inbox Cards] Deleted card for user ${userId}:`, {
          cardId: input.cardId,
        });

        return {
          success: true,
          message: 'Inbox card deleted successfully',
        };
      } catch (error) {
        console.error('[Inbox Cards] Error deleting card:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete inbox card',
          cause: error,
        });
      }
    }),

  // Get a specific inbox card by cardId
  getCard: protectedProcedure
    .input(z.object({
      cardId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      try {
        const card = await db.select()
          .from(inboxCards)
          .where(and(
            eq(inboxCards.cardId, input.cardId),
            eq(inboxCards.userId, userId)
          ))
          .limit(1);

        if (card.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Inbox card not found',
          });
        }

        return card[0];
      } catch (error) {
        console.error('[Inbox Cards] Error fetching card:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch inbox card',
          cause: error,
        });
      }
    }),

  // Get inbox statistics
  getStats: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;
      
      try {
        // Get all cards for the user
        const cards = await db.select()
          .from(inboxCards)
          .where(eq(inboxCards.userId, userId));

        // Calculate statistics
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const stats = {
          total: cards.length,
          pending: cards.filter(c => c.status === 'pending').length,
          executed: cards.filter(c => c.status === 'executed').length,
          dismissed: cards.filter(c => c.status === 'dismissed').length,
          snoozed: cards.filter(c => c.status === 'snoozed').length,
          error: cards.filter(c => c.status === 'error').length,
          
          // Today's stats
          executedToday: cards.filter(c => 
            c.status === 'executed' && 
            c.timestamp && 
            new Date(c.timestamp) >= today
          ).length,
          
          // This week's stats
          executedThisWeek: cards.filter(c => 
            c.status === 'executed' && 
            c.timestamp && 
            new Date(c.timestamp) >= lastWeek
          ).length,
          
          // This month's stats
          executedThisMonth: cards.filter(c => 
            c.status === 'executed' && 
            c.timestamp && 
            new Date(c.timestamp) >= lastMonth
          ).length,
          
          // Average confidence
          averageConfidence: cards.length > 0 
            ? Math.round(cards.reduce((sum, c) => sum + (c.confidence || 0), 0) / cards.length)
            : 0,
          
          // Source breakdown
          sourceBreakdown: cards.reduce((acc, card) => {
            acc[card.sourceType] = (acc[card.sourceType] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          
          // Daily trend for last 7 days
          dailyTrend: Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(date.getDate() - (6 - i));
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);
            
            return {
              date: date.toISOString().split('T')[0],
              count: cards.filter(c => 
                c.timestamp && 
                new Date(c.timestamp) >= date &&
                new Date(c.timestamp) < nextDate
              ).length,
              executed: cards.filter(c => 
                c.status === 'executed' &&
                c.timestamp && 
                new Date(c.timestamp) >= date &&
                new Date(c.timestamp) < nextDate
              ).length,
            };
          }),
        };

        return stats;
      } catch (error) {
        console.error('[Inbox Cards] Error calculating stats:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to calculate inbox statistics',
          cause: error,
        });
      }
    }),

  // Mark an inbox card as seen
  markSeen: protectedProcedure
    .input(z.object({
      cardId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      try {
        const updatedCard = await db.update(inboxCards)
          .set({
            status: 'seen',
            updatedAt: new Date(),
          })
          .where(and(
            eq(inboxCards.cardId, input.cardId),
            eq(inboxCards.userId, userId)
          ))
          .returning();

        if (updatedCard.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Inbox card not found or you do not have permission to mark it as seen',
          });
        }

        console.log(`[Inbox Cards] Marked card for user ${userId} as seen:`, {
          cardId: input.cardId,
        });

        return {
          success: true,
          card: updatedCard[0],
          message: 'Inbox card marked as seen successfully',
        };
      } catch (error) {
        console.error('[Inbox Cards] Error marking card as seen:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to mark inbox card as seen',
          cause: error,
        });
      }
    }),

  // Approve an inbox card with a note
  approveWithNote: protectedProcedure
    .input(z.object({
      cardId: z.string(),
      note: z.string(),
      categories: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      try {
        const updatedCard = await db.update(inboxCards)
          .set({
            status: 'seen',
            updatedAt: new Date(),
          })
          .where(and(
            eq(inboxCards.cardId, input.cardId),
            eq(inboxCards.userId, userId)
          ))
          .returning();

        if (updatedCard.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Inbox card not found or you do not have permission to approve it',
          });
        }

        console.log(`[Inbox Cards] Approved card for user ${userId}:`, {
          cardId: input.cardId,
          note: input.note,
          categories: input.categories,
        });

        // Insert ledger entry with note
        const card = updatedCard[0];

        await db.insert(actionLedger).values({
          approvedBy: userId,
          inboxCardId: card.cardId,
          actionTitle: card.title,
          actionSubtitle: card.subtitle,
          actionType: 'note',
          sourceType: card.sourceType,
          sourceDetails: card.sourceDetails,
          impactData: card.impact,
          amount: card.amount || null,
          currency: card.currency || null,
          confidence: card.confidence,
          rationale: card.rationale,
          chainOfThought: card.chainOfThought,
          originalCardData: card,
          parsedInvoiceData: card.parsedInvoiceData || null,
          status: 'approved',
          note: input.note,
          categories: input.categories || [],
        }).returning();

        return {
          success: true,
          card: updatedCard[0],
          message: 'Inbox card approved with note successfully',
        };
      } catch (error) {
        console.error('[Inbox Cards] Error approving card with note:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to approve inbox card with note',
          cause: error,
        });
      }
    }),

  // Bulk update status for multiple cards
  bulkUpdateStatus: protectedProcedure
    .input(z.object({
      cardIds: z.array(z.string()),
      status: z.enum(['pending', 'executed', 'dismissed', 'auto', 'snoozed', 'error', 'seen', 'done']),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      try {
        // Update all cards in the list
        const updatedCards = await db.update(inboxCards)
          .set({
            status: input.status,
            updatedAt: new Date(),
          })
          .where(and(
            eq(inboxCards.userId, userId),
            inArray(inboxCards.cardId, input.cardIds)
          ))
          .returning();

        console.log(`[Inbox Cards] Bulk updated ${updatedCards.length} cards for user ${userId} to status: ${input.status}`);

        // If status is 'seen', log to action ledger for each card
        if (input.status === 'seen') {
          const ledgerEntries = updatedCards.map(card => ({
            approvedBy: userId,
            inboxCardId: card.cardId,
            actionTitle: card.title,
            actionSubtitle: card.subtitle,
            actionType: 'bulk_approve' as const,
            sourceType: card.sourceType,
            sourceDetails: card.sourceDetails,
            impactData: card.impact,
            amount: card.amount || null,
            currency: card.currency || null,
            confidence: card.confidence,
            rationale: card.rationale,
            chainOfThought: card.chainOfThought,
            originalCardData: card,
            parsedInvoiceData: card.parsedInvoiceData || null,
            status: 'approved' as const,
            note: 'Bulk approved',
            categories: [] as string[],
          }));

          if (ledgerEntries.length > 0) {
            await db.insert(actionLedger).values(ledgerEntries);
          }
        }

        return {
          success: true,
          updatedCount: updatedCards.length,
          message: `Successfully updated ${updatedCards.length} cards`,
        };
      } catch (error) {
        console.error('[Inbox Cards] Error bulk updating cards:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to bulk update inbox cards',
          cause: error,
        });
      }
    }),

  // Bulk delete multiple cards
  bulkDelete: protectedProcedure
    .input(z.object({
      cardIds: z.array(z.string()),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      try {
        // Delete all cards in the list
        const deletedCards = await db.delete(inboxCards)
          .where(and(
            eq(inboxCards.userId, userId),
            inArray(inboxCards.cardId, input.cardIds)
          ))
          .returning();

        console.log(`[Inbox Cards] Bulk deleted ${deletedCards.length} cards for user ${userId}`);

        return {
          success: true,
          deletedCount: deletedCards.length,
          message: `Successfully deleted ${deletedCards.length} cards`,
        };
      } catch (error) {
        console.error('[Inbox Cards] Error bulk deleting cards:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to bulk delete inbox cards',
          cause: error,
        });
      }
    }),
}); 