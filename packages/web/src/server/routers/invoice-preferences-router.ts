import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { userInvoicePreferences } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export const invoicePreferencesRouter = router({
  // Get user's active invoice preferences
  getActivePreferences: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;

      const [preferences] = await db
        .select()
        .from(userInvoicePreferences)
        .where(
          and(
            eq(userInvoicePreferences.userPrivyDid, userId),
            eq(userInvoicePreferences.isActive, true)
          )
        )
        .limit(1);

      return preferences || null;
    }),

  // Get all user's invoice preference profiles
  getAllProfiles: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;

      const profiles = await db
        .select()
        .from(userInvoicePreferences)
        .where(eq(userInvoicePreferences.userPrivyDid, userId))
        .orderBy(userInvoicePreferences.profileName);

      return profiles;
    }),

  // Save or update invoice preferences
  savePreferences: protectedProcedure
    .input(z.object({
      profileName: z.string().optional().default('Default'),
      defaultSellerName: z.string().optional(),
      defaultSellerEmail: z.string().email().optional(),
      defaultSellerAddress: z.string().optional(),
      defaultSellerCity: z.string().optional(),
      defaultSellerPostalCode: z.string().optional(),
      defaultSellerCountry: z.string().optional(),
      defaultPaymentTerms: z.string().optional(),
      defaultCurrency: z.string().optional(),
      defaultPaymentType: z.string().optional(),
      defaultNetwork: z.string().optional(),
      defaultNotes: z.string().optional(),
      defaultTerms: z.string().optional(),
      setAsActive: z.boolean().optional().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Check if user already has preferences with this profile name
      const [existing] = await db
        .select()
        .from(userInvoicePreferences)
        .where(
          and(
            eq(userInvoicePreferences.userPrivyDid, userId),
            eq(userInvoicePreferences.profileName, input.profileName)
          )
        )
        .limit(1);

      if (existing) {
        // Update existing preferences
        const [updated] = await db
          .update(userInvoicePreferences)
          .set({
            ...input,
            updatedAt: new Date(),
          })
          .where(eq(userInvoicePreferences.id, existing.id))
          .returning();

        // If setting as active, deactivate other profiles
        if (input.setAsActive) {
          await db
            .update(userInvoicePreferences)
            .set({ isActive: false })
            .where(
              and(
                eq(userInvoicePreferences.userPrivyDid, userId),
                eq(userInvoicePreferences.isActive, true)
              )
            );
          
          // Re-activate the one we just updated
          await db
            .update(userInvoicePreferences)
            .set({ isActive: true })
            .where(eq(userInvoicePreferences.id, updated.id));
        }

        return updated;
      } else {
        // If setting as active, deactivate other profiles first
        if (input.setAsActive) {
          await db
            .update(userInvoicePreferences)
            .set({ isActive: false })
            .where(
              and(
                eq(userInvoicePreferences.userPrivyDid, userId),
                eq(userInvoicePreferences.isActive, true)
              )
            );
        }

        // Create new preferences
        const [created] = await db
          .insert(userInvoicePreferences)
          .values({
            userPrivyDid: userId,
            ...input,
            isActive: input.setAsActive,
          })
          .returning();

        return created;
      }
    }),

  // Delete a preference profile
  deleteProfile: protectedProcedure
    .input(z.object({
      profileId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Verify ownership
      const [profile] = await db
        .select()
        .from(userInvoicePreferences)
        .where(
          and(
            eq(userInvoicePreferences.id, input.profileId),
            eq(userInvoicePreferences.userPrivyDid, userId)
          )
        )
        .limit(1);

      if (!profile) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Profile not found',
        });
      }

      // Don't allow deleting the last profile
      const profileCount = await db
        .select()
        .from(userInvoicePreferences)
        .where(eq(userInvoicePreferences.userPrivyDid, userId));

      if (profileCount.length <= 1) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot delete your only profile',
        });
      }

      await db
        .delete(userInvoicePreferences)
        .where(eq(userInvoicePreferences.id, input.profileId));

      return { success: true };
    }),

  // Set a profile as active
  setActiveProfile: protectedProcedure
    .input(z.object({
      profileId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Verify ownership
      const [profile] = await db
        .select()
        .from(userInvoicePreferences)
        .where(
          and(
            eq(userInvoicePreferences.id, input.profileId),
            eq(userInvoicePreferences.userPrivyDid, userId)
          )
        )
        .limit(1);

      if (!profile) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Profile not found',
        });
      }

      // Deactivate all other profiles
      await db
        .update(userInvoicePreferences)
        .set({ isActive: false })
        .where(
          and(
            eq(userInvoicePreferences.userPrivyDid, userId),
            eq(userInvoicePreferences.isActive, true)
          )
        );

      // Activate the selected profile
      const [activated] = await db
        .update(userInvoicePreferences)
        .set({ isActive: true })
        .where(eq(userInvoicePreferences.id, input.profileId))
        .returning();

      return activated;
    }),
});