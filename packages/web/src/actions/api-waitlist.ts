'use server';

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

    // Send emails via Loops - access env vars inside function for Server Actions
    const LOOPS_API_KEY = process.env.LOOPS_API_KEY;
    const LOOPS_API_BASE_URL = 'https://app.loops.so/api/v1';

    if (LOOPS_API_KEY) {
      try {
        // Send internal notification
        await fetch(`${LOOPS_API_BASE_URL}/transactional`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${LOOPS_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: process.env.INTERNAL_NOTIFICATION_EMAIL || 'ben@0.finance',
            transactionalId: process.env.LOOPS_TRANSACTIONAL_ID_API_WAITLIST_INTERNAL,
            dataVariables: {
              companyName: data.companyName,
              email: data.email || 'Not provided',
              useCase: data.useCase || 'Not provided',
              privyId: data.privyDid || 'N/A',
              timestamp: new Date().toISOString(),
            },
          }),
        });

        // Send user confirmation if they provided an email
        if (data.email) {
          await fetch(`${LOOPS_API_BASE_URL}/transactional`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${LOOPS_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: data.email,
              transactionalId: process.env.LOOPS_TRANSACTIONAL_ID_API_WAITLIST_CONFIRMATION,
              dataVariables: {
                companyName: data.companyName,
                useCase: data.useCase || 'Not provided',
                calLink: 'https://cal.com/team/0finance/30',
              },
            }),
          });
        }

        console.log('Successfully sent API waitlist emails via Loops.');
      } catch (error) {
        console.error('Failed to send API waitlist notification:', error);
        // Don't fail the mutation if notification fails
      }
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
