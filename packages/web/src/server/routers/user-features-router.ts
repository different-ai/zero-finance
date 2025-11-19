import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '../create-router';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { userFeatures } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export const userFeaturesRouter = router({
  // Check if user has access to a specific feature
  hasFeatureAccess: protectedProcedure
    .input(
      z.object({
        featureName: z.enum(['savings']),
      })
    )
    .query(async ({ input, ctx }) => {
      const { featureName } = input;
      const userDid = ctx.user.id;

      try {
        const feature = await db
          .select()
          .from(userFeatures)
          .where(
            and(
              eq(userFeatures.userPrivyDid, userDid),
              eq(userFeatures.featureName, featureName),
              eq(userFeatures.isActive, true)
            )
          )
          .limit(1);

        if (!feature.length) {
          return { hasAccess: false };
        }

        const userFeature = feature[0];
        
        // Check if feature has expired
        if (userFeature.expiresAt && userFeature.expiresAt < new Date()) {
          return { hasAccess: false, expired: true };
        }

        return { 
          hasAccess: true, 
          feature: userFeature,
          expiresAt: userFeature.expiresAt 
        };
      } catch (error) {
        console.error('Error checking feature access:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to check feature access',
        });
      }
    }),

  // Get all user features
  getUserFeatures: protectedProcedure
    .query(async ({ ctx }) => {
      const userDid = ctx.user.id;

      try {
        const features = await db
          .select()
          .from(userFeatures)
          .where(eq(userFeatures.userPrivyDid, userDid));

        return features;
      } catch (error) {
        console.error('Error fetching user features:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch user features',
        });
      }
    }),



  // Revoke a feature from a user
  revokeFeature: protectedProcedure
    .input(
      z.object({
        featureName: z.enum(['savings']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { featureName } = input;
      const userDid = ctx.user.id;

      try {
        await db
          .update(userFeatures)
          .set({
            isActive: false,
          })
          .where(
            and(
              eq(userFeatures.userPrivyDid, userDid),
              eq(userFeatures.featureName, featureName)
            )
          );

        return { success: true };
      } catch (error) {
        console.error('Error revoking feature:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to revoke feature',
        });
      }
    }),
}); 
