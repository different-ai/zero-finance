'use server';

// Helper to send Loops transactional emails
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

export async function joinApiWaitlist(data: {
  email?: string;
  companyName?: string;
  useCase?: string;
  privyDid?: string;
  userId?: string;
}): Promise<{ success: boolean; message?: string }> {
  try {
    // Validate required fields
    if (!data.email && !data.privyDid) {
      return {
        success: false,
        message: 'Email or authentication required',
      };
    }

    if (!data.companyName) {
      return {
        success: false,
        message: 'Company name is required',
      };
    }

    // Send emails via Loops (no database needed - all tracking in Loops)
    const userConfirmationId =
      process.env.LOOPS_TRANSACTIONAL_ID_API_WAITLIST_CONFIRMATION;
    const internalNotificationId =
      process.env.LOOPS_TRANSACTIONAL_ID_API_WAITLIST_INTERNAL;
    const internalEmail = process.env.INTERNAL_NOTIFICATION_EMAIL || 'team@example.com';

    try {
      const emailPromises = [];

      // Always send internal notification if configured
      if (internalNotificationId) {
        // Build internal notification dataVariables
        const internalDataVariables: Record<string, string> = {
          companyName: data.companyName,
          useCase: data.useCase || 'Not provided',
          privyDid: data.privyDid || 'N/A',
          timestamp: new Date().toISOString(),
        };

        // Only include email field if provided (Loops validates this as email format)
        if (data.email) {
          internalDataVariables.email = data.email;
        }

        emailPromises.push(
          sendLoopsTransactionalEmail({
            transactionalId: internalNotificationId,
            email: internalEmail,
            dataVariables: internalDataVariables,
          })
        );
      }

      // Send user confirmation only if they provided an email
      if (data.email && userConfirmationId) {
        emailPromises.push(
          sendLoopsTransactionalEmail({
            transactionalId: userConfirmationId,
            email: data.email,
            dataVariables: {
              companyName: data.companyName,
              useCase: data.useCase || 'Not provided',
              calLink: 'https://cal.com/team/0finance/30',
            },
          })
        );
      }

      if (emailPromises.length > 0) {
        await Promise.all(emailPromises);
        console.log('Successfully sent API waitlist emails via Loops.');
      } else {
        console.warn('Loops transactional IDs not configured. Skipping emails.');
      }
    } catch (emailError) {
      console.error('Failed to send emails, but user was added to waitlist:', emailError);
      // Don't fail the whole operation if emails fail
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error joining API waitlist:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}
