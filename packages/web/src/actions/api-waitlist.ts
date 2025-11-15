'use server';

export async function joinApiWaitlist(data: {
  email?: string;
  companyName?: string;
  useCase?: string;
  privyDid?: string;
  userId?: string;
}): Promise<{ success: boolean; message?: string }> {
  console.log('joinApiWaitlist', JSON.stringify(data, null, 2));
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

    console.log('LOOPS_API_KEY:', !!LOOPS_API_KEY);
    console.log('LOOPS_TRANSACTIONAL_ID_API_WAITLIST_INTERNAL:', process.env.LOOPS_TRANSACTIONAL_ID_API_WAITLIST_INTERNAL);
    console.log('LOOPS_TRANSACTIONAL_ID_API_WAITLIST_CONFIRMATION:', process.env.LOOPS_TRANSACTIONAL_ID_API_WAITLIST_CONFIRMATION);
    console.log('INTERNAL_NOTIFICATION_EMAIL:', process.env.INTERNAL_NOTIFICATION_EMAIL || 'ben@0.finance');
    
    if (LOOPS_API_KEY) {
      try {
        // Send internal notification
        const internalEmailPayload = {
          email: process.env.INTERNAL_NOTIFICATION_EMAIL || 'ben@0.finance',
          transactionalId: process.env.LOOPS_TRANSACTIONAL_ID_API_WAITLIST_INTERNAL,
          dataVariables: {
            companyName: data.companyName,
            email: data.email || 'Not provided',
            useCase: data.useCase || 'Not provided',
            privyId: data.privyDid || 'N/A',
            timestamp: new Date().toISOString(),
          },
        };
        
        console.log('[INTERNAL EMAIL] Request:', JSON.stringify({
          url: `${LOOPS_API_BASE_URL}/transactional`,
          method: 'POST',
          payload: internalEmailPayload,
        }, null, 2));
        
        const internalResponse = await fetch(`${LOOPS_API_BASE_URL}/transactional`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${LOOPS_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(internalEmailPayload),
        });
        
        const internalResponseText = await internalResponse.text();
        console.log('[INTERNAL EMAIL] Response status:', internalResponse.status);
        console.log('[INTERNAL EMAIL] Response body:', internalResponseText);
        
        if (!internalResponse.ok) {
          console.error('[INTERNAL EMAIL] Failed with status:', internalResponse.status);
        }

        // Send user confirmation if they provided an email
        console.log('Sending user confirmation email to:', data.email);
        if (data.email) {
          const userEmailPayload = {
            email: data.email,
            transactionalId: process.env.LOOPS_TRANSACTIONAL_ID_API_WAITLIST_CONFIRMATION,
            dataVariables: {
              companyName: data.companyName,
              useCase: data.useCase || 'Not provided',
              calLink: 'https://cal.com/team/0finance/30',
            },
          };
          
          console.log('[USER EMAIL] Request:', JSON.stringify({
            url: `${LOOPS_API_BASE_URL}/transactional`,
            method: 'POST',
            payload: userEmailPayload,
          }, null, 2));
          
          const userResponse = await fetch(`${LOOPS_API_BASE_URL}/transactional`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${LOOPS_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userEmailPayload),
          });
          
          const userResponseText = await userResponse.text();
          console.log('[USER EMAIL] Response status:', userResponse.status);
          console.log('[USER EMAIL] Response body:', userResponseText);
          
          if (!userResponse.ok) {
            console.error('[USER EMAIL] Failed with status:', userResponse.status);
          }
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
