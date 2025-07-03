import { z } from 'zod';
import { router as createTRPCRouter, protectedProcedure } from '../create-router';
import { CardActionsService } from '../services/card-actions-service';
import { TRPCError } from '@trpc/server';

export const cardActionsRouter = createTRPCRouter({
  // Track a new action
  trackAction: protectedProcedure
    .input(z.object({
      cardId: z.string(),
      actionType: z.enum([
        'status_changed',
        'marked_seen',
        'marked_paid',
        'dismissed',
        'ignored',
        'snoozed',
        'deleted',
        'approved',
        'executed',
        'category_added',
        'category_removed',
        'note_added',
        'note_updated',
        'amount_updated',
        'due_date_updated',
        'added_to_expenses',
        'payment_recorded',
        'reminder_set',
        'reminder_sent',
        'ai_classified',
        'ai_auto_approved',
        'ai_suggested_update',
        'attachment_downloaded',
        'shared',
        'comment_added',
      ]),
      actor: z.enum(['human', 'ai', 'system']).optional(),
      actorDetails: z.any().optional(),
      previousValue: z.any().optional(),
      newValue: z.any().optional(),
      details: z.any().optional(),
      metadata: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const actionId = await CardActionsService.trackAction({
        ...input,
        userId: ctx.user.id,
      });

      return { actionId };
    }),

  // Get all actions for a card
  getCardActions: protectedProcedure
    .input(z.object({
      cardId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const actions = await CardActionsService.getCardActions(
        input.cardId,
        ctx.user.id
      );

      return { actions };
    }),

  // Get recent actions across all cards
  getRecentActions: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const actions = await CardActionsService.getUserRecentActions(
        ctx.user.id,
        input.limit
      );

      return { actions };
    }),

  // Get action statistics
  getActionStats: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const stats = await CardActionsService.getActionStats(ctx.user.id);

      return stats;
    }),

  // Track batch actions
  trackBatchActions: protectedProcedure
    .input(z.object({
      actions: z.array(z.object({
        cardId: z.string(),
        actionType: z.enum([
          'status_changed',
          'marked_seen',
          'marked_paid',
          'dismissed',
          'ignored',
          'snoozed',
          'deleted',
          'approved',
          'executed',
          'category_added',
          'category_removed',
          'note_added',
          'note_updated',
          'amount_updated',
          'due_date_updated',
          'added_to_expenses',
          'payment_recorded',
          'reminder_set',
          'reminder_sent',
          'ai_classified',
          'ai_auto_approved',
          'ai_suggested_update',
          'attachment_downloaded',
          'shared',
          'comment_added',
        ]),
        actor: z.enum(['human', 'ai', 'system']).optional(),
        actorDetails: z.any().optional(),
        previousValue: z.any().optional(),
        newValue: z.any().optional(),
        details: z.any().optional(),
        metadata: z.any().optional(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const actionsWithUser = input.actions.map(action => ({
        ...action,
        userId: ctx.user.id,
      }));

      const actionIds = await CardActionsService.trackBatchActions(actionsWithUser);

      return { actionIds };
    }),
}); 