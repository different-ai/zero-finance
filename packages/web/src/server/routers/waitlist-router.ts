import { z } from 'zod';
import { publicProcedure, router } from '../create-router';

// Helper to call the Loops API
async function sendLoopsTransactionalEmail({
  transactionalId,
  email,
  dataVariables,
}: {
  transactionalId: string;
  email: string;
  dataVariables?: Record<string, string | number>;
}) {
  const apiKey = process.env.LOOPS_API_KEY;
  if (!apiKey) {
    console.error('LOOPS_API_KEY is not set. Skipping email.');
    // In a real app, you might want to throw an error or handle this more gracefully.
    return;
  }

  const response = await fetch('https://app.loops.so/api/v1/transactional', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      transactionalId,
      email,
      dataVariables,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
      `Failed to send Loops email (transactionalId: ${transactionalId}). Status: ${response.status}. Body: ${errorBody}`,
    );
    throw new Error('Failed to send email.');
  }

  const data = await response.json();
  console.log('Successfully sent email:', data);
  return data;
}

const waitlistInputSchema = z.object({
  userType: z.enum(['freelancer-consultant', 'agency-studio', 'creator']),
  fullName: z.string().min(2),
  email: z.string().email(),
  country: z.string().min(1),
});

export const waitlistRouter = router({
  join: publicProcedure
    .input(waitlistInputSchema)
    .mutation(async ({ input }) => {
      const { email, fullName, userType, country } = input;

      const userConfirmationId =
        process.env.LOOPS_TRANSACTIONAL_ID_WAITLIST_CONFIRMATION;
      const internalNotificationId =
        process.env.LOOPS_TRANSACTIONAL_ID_INTERNAL_NOTIFICATION;
      const internalEmail = process.env.INTERNAL_NOTIFICATION_EMAIL;

      if (!userConfirmationId || !internalNotificationId || !internalEmail) {
        console.error(
          'Missing required environment variables for sending emails.',
        );
        throw new Error('Server configuration error.');
      }

      // Concurrently send both emails
      try {
        await Promise.all([
          // Send confirmation email to the user
          sendLoopsTransactionalEmail({
            transactionalId: userConfirmationId,
            email: email,
            dataVariables: {
              fullName: fullName,
            },
          }),
          // Send notification email to the internal team
          sendLoopsTransactionalEmail({
            transactionalId: internalNotificationId,
            email: internalEmail,
            dataVariables: {
              fullName,
              email,
              userType,
              country,
            },
          }),
        ]);

        // Here you would also save the user to your database.
        // e.g. await db.insert(waitlist).values(input);
        console.log(
          'Successfully processed waitlist request and sent emails via Loops.',
        );

        return { success: true };
      } catch (error) {
        console.error('Failed to process waitlist request with Loops:', error);
        // The error is already specific from sendLoopsTransactionalEmail, so just re-throwing
        throw new Error('Failed to join waitlist due to email sending failure.');
      }
    }),
}); 