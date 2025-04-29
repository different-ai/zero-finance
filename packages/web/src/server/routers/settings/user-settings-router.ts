import { z } from 'zod';
import { router, protectedProcedure } from '../../create-router';
import { db } from '@/db';
import { userSettingsTable, userProfilesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const userSettingsRouter = router({
  // Get user settings, creating default settings if not exists
  get: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' });

    // Try to find existing settings
    const settings = await db.query.userSettingsTable.findFirst({
      where: eq(userSettingsTable.userId, userId),
    });

    // If settings exist, return them
    if (settings) {
      return settings;
    }

    // If no settings, create default settings
    try {
      const [newSettings] = await db
        .insert(userSettingsTable)
        .values({
          userId,
          showAddresses: false, // Default to hiding addresses
        })
        .returning();
      
      return newSettings;
    } catch (error) {
      console.error('Error creating default user settings:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create default user settings',
      });
    }
  }),

  // Update user settings
  update: protectedProcedure
    .input(
      z.object({
        showAddresses: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' });

      // Check if settings exist
      const existingSettings = await db.query.userSettingsTable.findFirst({
        where: eq(userSettingsTable.userId, userId),
      });

      if (existingSettings) {
        // Update existing settings
        const [updatedSettings] = await db
          .update(userSettingsTable)
          .set({
            showAddresses: input.showAddresses,
            updatedAt: new Date(),
          })
          .where(eq(userSettingsTable.userId, userId))
          .returning();
        
        return updatedSettings;
      } else {
        // Create new settings if they don't exist
        const [newSettings] = await db
          .insert(userSettingsTable)
          .values({
            userId,
            showAddresses: input.showAddresses,
          })
          .returning();
        
        return newSettings;
      }
    }),
}); 