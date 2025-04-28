import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { db } from '@/db';
import { allocationStrategies, userSafes } from '@/db/schema';
import { eq, and, sum as drizzleSum } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { AllocationStrategy } from '@/db/schema';

const allocationStrategyInputSchema = z.array(
  z.object({
    destinationSafeType: z.enum(['primary', 'tax', 'liquidity', 'yield']),
    percentage: z.number().int().min(0).max(100),
  })
).refine((strategies) => {
  // Ensure all required types are present (at least primary, tax, yield)
  const types = new Set(strategies.map(s => s.destinationSafeType));
  return types.has('primary') && types.has('tax') && types.has('yield');
}, { message: "Strategy must include entries for 'primary', 'tax', and 'yield' types." })
 .refine((strategies) => {
    // Ensure percentages sum to 100
    const totalPercentage = strategies.reduce((acc, s) => acc + s.percentage, 0);
    return totalPercentage === 100;
  }, { message: 'Percentages must sum to 100.' });

export const allocationStrategyRouter = router({
  /**
   * Gets the current allocation strategy for the user.
   * Returns a default strategy if none is set.
   */
  get: protectedProcedure
    .query(async ({ ctx }): Promise<AllocationStrategy[]> => {
      const privyDid = ctx.user.id;

      const strategies = await db.query.allocationStrategies.findMany({
        where: eq(allocationStrategies.userDid, privyDid),
        orderBy: (allocationStrategies, { asc }) => [asc(allocationStrategies.destinationSafeType)],
      });

      if (strategies.length > 0) {
        return strategies;
      }

      // Default strategy if none exists
      // We'll create these in the DB upon first fetch or set for consistency
      const defaultStrategy: Omit<AllocationStrategy, 'id' | 'createdAt' | 'updatedAt'>[] = [
        { userDid: privyDid, destinationSafeType: 'primary', percentage: 60 },
        { userDid: privyDid, destinationSafeType: 'tax', percentage: 30 },
        { userDid: privyDid, destinationSafeType: 'yield', percentage: 10 },
        // Optional: Add liquidity later if needed
      ];
      
      // Attempt to insert the default strategy if it doesn't exist
      try {
        await db.insert(allocationStrategies)
            .values(defaultStrategy)
            .onConflictDoNothing(); // Ignore if entries already exist (e.g., race condition)

        // Re-fetch after potential insert
        const finalStrategies = await db.query.allocationStrategies.findMany({
            where: eq(allocationStrategies.userDid, privyDid),
            orderBy: (allocationStrategies, { asc }) => [asc(allocationStrategies.destinationSafeType)],
        });

        if (finalStrategies.length === 0) {
            // This case should be rare after insert attempt, but handle defensively
            console.error(`Failed to get/create default strategy for user ${privyDid}`);
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Could not retrieve or create default allocation strategy.' });
        }
        return finalStrategies;

      } catch (error) {
          console.error(`Error setting/fetching default allocation strategy for user ${privyDid}:`, error);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to process allocation strategy.' });
      }
    }),

  /**
   * Sets or updates the allocation strategy for the user.
   * Replaces the entire strategy based on the input array.
   */
  set: protectedProcedure
    .input(allocationStrategyInputSchema)
    .mutation(async ({ ctx, input }) => {
      const privyDid = ctx.user.id;

      // Use a transaction to ensure atomicity
      await db.transaction(async (tx) => {
        // Delete existing strategies for the user
        await tx.delete(allocationStrategies)
          .where(eq(allocationStrategies.userDid, privyDid));

        // Insert new strategies
        const newStrategyValues = input.map(strategy => ({
          userDid: privyDid,
          destinationSafeType: strategy.destinationSafeType,
          percentage: strategy.percentage,
        }));

        if (newStrategyValues.length > 0) {
            await tx.insert(allocationStrategies).values(newStrategyValues);
        }
      });

      return { success: true, message: 'Allocation strategy updated successfully.' };
    }),
}); 