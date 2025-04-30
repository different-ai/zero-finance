import { z } from 'zod';
// import { createTRPCRouter, protectedProcedure } from '@/server/trpc';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { Context } from '@/server/context';
import { protectedProcedure, router } from '../create-router';

// Define input type explicitly for better clarity
const SyncInputSchema = z.object({
  privyUserId: z.string(),
  email: z.string().email().optional(),
  name: z.string().optional(),
});
type SyncInput = z.infer<typeof SyncInputSchema>;

export const userRouter = router({
  syncContactToLoops: protectedProcedure
    .input(SyncInputSchema)
    .mutation(async ({ ctx, input }: { ctx: Context; input: SyncInput }) => {
      const { privyUserId, email, name } = input;
      const loopsApiKey = process.env.LOOPS_API_KEY;

      if (!loopsApiKey) {
        console.error('LOOPS_API_KEY is not set. Cannot sync contact to Loops.');
        return { success: false, message: 'Loops API key not configured.' };
      }

      // 1. Check if user exists using privyDid and if already synced
      const user = await db.query.users.findFirst({
        where: eq(users.privyDid, privyUserId),
        columns: {
          loopsContactSynced: true,
        },
      });

      // If user not found in DB yet, or already synced, exit early
      if (!user || user.loopsContactSynced) {
        return { success: true, message: 'User not found or already synced.' };
      }

      // Email is required by Loops
      if (!email) {
         console.warn(`Cannot sync user ${privyUserId} to Loops without an email.`);
         return { success: false, message: 'Email is required to sync contact.' };
      }

      try {
        // 2. Call Loops API to create or update contact
        const response = await fetch('https://app.loops.so/api/v1/contacts/create', { // or /update if preferred
          method: 'POST', 
          headers: {
            'Authorization': `Bearer ${loopsApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            userId: privyUserId, // Use Privy ID as the Loops userId
            firstName: name?.split(' ')[0] ?? '',
            source: 'hyprsqrl app sync', 
            // Add any other relevant properties
          }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Loops API Error (${response.status}): ${errorBody}`);
            throw new Error(`Failed to sync contact to Loops (Status: ${response.status})`);
        }

        // 3. Update sync flag in our database using privyDid
        await db
          .update(users)
          .set({ loopsContactSynced: true })
          .where(eq(users.privyDid, privyUserId));

        console.log(`Successfully synced contact ${privyUserId} (${email}) to Loops.`);
        return { success: true, message: 'Contact synced successfully.' };

      } catch (error: any) {
        console.error(`Error syncing contact ${privyUserId} to Loops:`, error);
        // Don't update the flag if the API call failed
        // Consider more specific error handling/retries if needed
        return { success: false, message: error.message || 'Failed to sync contact.' };
      }
    }),
}); 