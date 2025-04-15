import { z } from 'zod';
import { eq, and, not, desc } from 'drizzle-orm';
import { router, protectedProcedure } from '../create-router';
import { db } from '@/db';
import { companyProfilesTable } from '@/db/schema';
import { TRPCError } from '@trpc/server';

const companyProfileSchema = z.object({
  id: z.string().optional(), // Provided when updating
  businessName: z.string().min(1, 'Business name is required'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  taxRegistration: z.string().optional().or(z.literal('')),
  registrationNumber: z.string().optional().or(z.literal('')),
  industryType: z.string().optional().or(z.literal('')),
  streetAddress: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  region: z.string().optional().or(z.literal('')),
  postalCode: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  logoUrl: z.string().url().optional().or(z.literal('')),
  brandColor: z.string().optional().or(z.literal('')), // TODO: Add validation like regex for hex color?
  isDefault: z.boolean().optional(),
});

export const companyProfileRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const profiles = await db.query.companyProfilesTable.findMany({
      where: eq(companyProfilesTable.userId, userId),
      orderBy: (profiles, { desc }) => [desc(profiles.isDefault), desc(profiles.createdAt)],
    });
    return profiles;
  }),

  create: protectedProcedure
    .input(companyProfileSchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' });

      // If setting this as default, unset other defaults first
      if (input.isDefault) {
        await db
          .update(companyProfilesTable)
          .set({ isDefault: false })
          .where(eq(companyProfilesTable.userId, userId));
      } else {
        // If not setting as default, check if it should become default
        const existingProfiles = await db.query.companyProfilesTable.findMany({
            where: eq(companyProfilesTable.userId, userId),
            columns: { id: true },
            limit: 1,
        });
        if (existingProfiles.length === 0) {
            input.isDefault = true; // Make first profile default
        }
      }


      const [newProfile] = await db
        .insert(companyProfilesTable)
        .values({
          ...input,
          userId: userId,
        })
        .returning();

      return newProfile;
    }),

  update: protectedProcedure
    .input(companyProfileSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
      const { id, ...updateData } = input;

      // Check if profile exists and belongs to the user
      const existingProfile = await db.query.companyProfilesTable.findFirst({
        where: and(eq(companyProfilesTable.id, id), eq(companyProfilesTable.userId, userId)),
        columns: { id: true },
      });

      if (!existingProfile) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Company profile not found' });
      }

      // If setting this as default, unset other defaults first
      if (updateData.isDefault) {
        await db
          .update(companyProfilesTable)
          .set({ isDefault: false })
           .where(and(eq(companyProfilesTable.userId, userId), not(eq(companyProfilesTable.id, id))));
      } else {
        // Check if unsetting the only default profile, which is not allowed
        const currentDefault = await db.query.companyProfilesTable.findFirst({
            where: and(eq(companyProfilesTable.id, id), eq(companyProfilesTable.isDefault, true)),
            columns: { id: true },
        });
        if (currentDefault) {
             const otherProfilesCount = await db.select({ id: companyProfilesTable.id }).from(companyProfilesTable).where(and(eq(companyProfilesTable.userId, userId), not(eq(companyProfilesTable.id, id)))).limit(1);
             if(otherProfilesCount.length > 0) {
                 // If unsetting the default and others exist, we must ensure another becomes default
                 // But we'll handle making *another* one default explicitly via `setDefault`
                 // For now, prevent unsetting the *only* default if it's the last one
                 // Let's refine this: If it's the only profile, it *must* remain default.
                  const totalProfilesCountResult = await db.select({ count: companyProfilesTable.id }).from(companyProfilesTable).where(eq(companyProfilesTable.userId, userId));
                 const totalProfilesCount = totalProfilesCountResult.length; // Drizzle returns array of objects

                 if (totalProfilesCount <= 1) {
                     updateData.isDefault = true; // Force it to stay default if it's the only one
                     // Alternatively throw error: throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot unset the only default profile.' });
                 }
             } else {
                // It's the only profile, must remain default
                 updateData.isDefault = true;
             }

        }
      }

      const [updatedProfile] = await db
        .update(companyProfilesTable)
        .set(updateData)
        .where(eq(companyProfilesTable.id, id))
        .returning();

      return updatedProfile;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
       if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
      const { id } = input;

      // Check if profile exists and belongs to user
      const profileToDelete = await db.query.companyProfilesTable.findFirst({
        where: and(eq(companyProfilesTable.id, id), eq(companyProfilesTable.userId, userId)),
        columns: { id: true, isDefault: true },
      });

      if (!profileToDelete) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Company profile not found' });
      }

      // Prevent deleting the default profile if it's the only one
      if (profileToDelete.isDefault) {
         const otherProfilesCountResult = await db.select({ count: companyProfilesTable.id }).from(companyProfilesTable).where(and(eq(companyProfilesTable.userId, userId), not(eq(companyProfilesTable.id, id)))).limit(1);
          if (otherProfilesCountResult.length === 0) {
             throw new TRPCError({
                 code: 'BAD_REQUEST',
                 message: 'Cannot delete the only company profile, especially if it is the default.',
             });
         }
        // If deleting the default and others exist, we need to ensure another becomes default
        // Find the most recently created other profile and set it as default
         const nextDefault = await db.query.companyProfilesTable.findFirst({
            where: and(eq(companyProfilesTable.userId, userId), not(eq(companyProfilesTable.id, id))),
            orderBy: (profiles, { desc }) => [desc(profiles.createdAt)],
            columns: { id: true },
         });
         if (nextDefault) {
            await db.update(companyProfilesTable).set({ isDefault: true }).where(eq(companyProfilesTable.id, nextDefault.id));
         }
      }


      await db.delete(companyProfilesTable).where(eq(companyProfilesTable.id, id));

      return { success: true };
    }),

  setDefault: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
        const userId = ctx.userId;
        if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
        const { id } = input;

         // Check if profile exists and belongs to user
        const profileToSetDefault = await db.query.companyProfilesTable.findFirst({
            where: and(eq(companyProfilesTable.id, id), eq(companyProfilesTable.userId, userId)),
            columns: { id: true },
        });

        if (!profileToSetDefault) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Company profile not found' });
        }

        // Start transaction
        await db.transaction(async (tx) => {
             // Unset current default(s)
            await tx
                .update(companyProfilesTable)
                .set({ isDefault: false })
                .where(and(eq(companyProfilesTable.userId, userId), eq(companyProfilesTable.isDefault, true)));

            // Set the new default
            await tx
                .update(companyProfilesTable)
                .set({ isDefault: true })
                .where(eq(companyProfilesTable.id, id));
        });


        return { success: true };
    }),
}); 