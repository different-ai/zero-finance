import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { TRPCError } from '@trpc/server';

const LOOPS_API_KEY = process.env.LOOPS_API_KEY;
const LOOPS_API_BASE_URL = 'https://app.loops.so/api/v1';

export const feedbackRouter = router({
  sendFeedback: protectedProcedure
    .input(
      z.object({
        feedback: z.string().min(1).max(5000),
        userEmail: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { feedback, userEmail } = input;

      if (!LOOPS_API_KEY) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'loops api key not configured',
        });
      }

      try {
        // send transactional email via loops
        const response = await fetch(`${LOOPS_API_BASE_URL}/transactional`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOOPS_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'founders@0.finance',
            transactionalId: 'cmcoz1sx04doqzc0iq66v9ewj', // you'll need to create this in loops
            dataVariables: {
              userEmail,
              feedback,
              submittedAt: new Date().toISOString(),
            },
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.error('loops api error:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'failed to send feedback email',
          });
        }

        // optionally send a copy to the user
        await fetch(`${LOOPS_API_BASE_URL}/transactional`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOOPS_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userEmail,
            transactionalId: 'cmcozafh73lxizz0hmhmma8q1', // different transactional id for user copy
            dataVariables: {
              feedback,
              submittedAt: new Date().toISOString(),
            },
          }),
        });

        return { success: true };
      } catch (error) {
        console.error('error sending feedback:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'failed to send feedback',
        });
      }
    }),
}); 