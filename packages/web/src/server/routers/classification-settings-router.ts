import { z } from 'zod';
import { db } from '@/db';
import { userClassificationSettings } from '@/db/schema';
import { protectedProcedure, router } from '../create-router';
import { TRPCError } from '@trpc/server';
import { eq, and, asc } from 'drizzle-orm';

const MAX_PROMPTS_PER_USER = 10;

export const classificationSettingsRouter = router({
  // Get all classification settings for the current user
  getUserClassificationSettings: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.userId!;
      
      const settings = await db
        .select()
        .from(userClassificationSettings)
        .where(eq(userClassificationSettings.userId, userId))
        .orderBy(asc(userClassificationSettings.priority));
      
      return settings;
    }),

  // Create a new classification prompt
  createClassificationPrompt: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      prompt: z.string().min(10).max(1000),
      enabled: z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId!;
      
      // Check if user has reached the limit
      const existingCount = await db
        .select({ count: userClassificationSettings.id })
        .from(userClassificationSettings)
        .where(eq(userClassificationSettings.userId, userId));
      
      if (existingCount.length >= MAX_PROMPTS_PER_USER) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `You can only have up to ${MAX_PROMPTS_PER_USER} classification prompts`,
        });
      }
      
      // Get the next priority value
      const highestPriority = await db
        .select({ priority: userClassificationSettings.priority })
        .from(userClassificationSettings)
        .where(eq(userClassificationSettings.userId, userId))
        .orderBy(asc(userClassificationSettings.priority))
        .limit(1);
      
      const nextPriority = highestPriority[0]?.priority ?? 0;
      
      const [newSetting] = await db
        .insert(userClassificationSettings)
        .values({
          userId,
          name: input.name,
          prompt: input.prompt,
          enabled: input.enabled,
          priority: nextPriority + 1,
        })
        .returning();
      
      return newSetting;
    }),

  // Update an existing classification prompt
  updateClassificationPrompt: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      name: z.string().min(1).max(100).optional(),
      prompt: z.string().min(10).max(1000).optional(),
      enabled: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId!;
      
      const [updated] = await db
        .update(userClassificationSettings)
        .set({
          ...(input.name && { name: input.name }),
          ...(input.prompt && { prompt: input.prompt }),
          ...(input.enabled !== undefined && { enabled: input.enabled }),
        })
        .where(
          and(
            eq(userClassificationSettings.id, input.id),
            eq(userClassificationSettings.userId, userId)
          )
        )
        .returning();
      
      if (!updated) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Classification prompt not found',
        });
      }
      
      return updated;
    }),

  // Delete a classification prompt
  deleteClassificationPrompt: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId!;
      
      const [deleted] = await db
        .delete(userClassificationSettings)
        .where(
          and(
            eq(userClassificationSettings.id, input.id),
            eq(userClassificationSettings.userId, userId)
          )
        )
        .returning();
      
      if (!deleted) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Classification prompt not found',
        });
      }
      
      return { success: true };
    }),

  // Reorder classification prompts (update priorities)
  reorderClassificationPrompts: protectedProcedure
    .input(z.object({
      promptIds: z.array(z.string().uuid()),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId!;
      
      // Verify all prompts belong to the user
      const userPrompts = await db
        .select({ id: userClassificationSettings.id })
        .from(userClassificationSettings)
        .where(eq(userClassificationSettings.userId, userId));
      
      const userPromptIds = userPrompts.map(p => p.id);
      const allPromptsValid = input.promptIds.every(id => userPromptIds.includes(id));
      
      if (!allPromptsValid) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid prompt IDs provided',
        });
      }
      
      // Update priorities based on order
      const updates = input.promptIds.map((id, index) => 
        db
          .update(userClassificationSettings)
          .set({ priority: index })
          .where(
            and(
              eq(userClassificationSettings.id, id),
              eq(userClassificationSettings.userId, userId)
            )
          )
      );
      
      await Promise.all(updates);
      
      return { success: true };
    }),
}); 