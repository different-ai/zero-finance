import { PostHogClient } from './posthog-server';

/**
 * Server-side PostHog tracking utilities
 */

interface UserTrackingData {
  userId: string;
  email?: string;
  name?: string;
  properties?: Record<string, any>;
}

/**
 * Track a user event server-side with email context
 */
export async function trackUserEvent(
  eventName: string,
  data: UserTrackingData,
  additionalProperties?: Record<string, any>
) {
  const posthog = PostHogClient();
  
  try {
    posthog.capture({
      distinctId: data.userId,
      event: eventName,
      properties: {
        email: data.email,
        name: data.name,
        ...data.properties,
        ...additionalProperties,
        // Always include these for consistency
        source: 'server',
        timestamp: new Date().toISOString(),
      },
    });
    
    // Ensure the event is sent before the function ends
    await posthog.flush();
    
    console.log('0xHypr', 'PostHog event tracked', { eventName, userId: data.userId, email: data.email });
  } catch (error) {
    console.error('0xHypr', 'Failed to track PostHog event', error);
  } finally {
    // Always shutdown to free resources
    await posthog.shutdown();
  }
}

/**
 * Identify a user server-side with email and properties
 */
export async function identifyUser(data: UserTrackingData) {
  const posthog = PostHogClient();
  
  try {
    posthog.identify({
      distinctId: data.userId,
      properties: {
        email: data.email,
        name: data.name,
        ...data.properties,
        // Email-specific properties
        email_domain: data.email?.split('@')[1],
        identified_at: new Date().toISOString(),
      },
    });
    
    await posthog.flush();
    
    console.log('0xHypr', 'PostHog user identified', { userId: data.userId, email: data.email });
  } catch (error) {
    console.error('0xHypr', 'Failed to identify PostHog user', error);
  } finally {
    await posthog.shutdown();
  }
}

/**
 * Track common events with email context
 */
export const PostHogEvents = {
  // User lifecycle events
  USER_SIGNED_UP: 'user_signed_up',
  USER_LOGGED_IN: 'user_logged_in',
  USER_LOGGED_OUT: 'user_logged_out',
  USER_PROFILE_UPDATED: 'user_profile_updated',
  
  // Onboarding events
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  ONBOARDING_SKIPPED: 'onboarding_skipped',
  
  // Feature usage events
  INVOICE_CREATED: 'invoice_created',
  INVOICE_SENT: 'invoice_sent',
  INVOICE_PAID: 'invoice_paid',
  
  TRANSACTION_INITIATED: 'transaction_initiated',
  TRANSACTION_COMPLETED: 'transaction_completed',
  
  KYC_STARTED: 'kyc_started',
  KYC_COMPLETED: 'kyc_completed',
  KYC_FAILED: 'kyc_failed',
  
  // Email events (for tracking email engagement)
  EMAIL_SENT: 'email_sent',
  EMAIL_OPENED: 'email_opened',
  EMAIL_CLICKED: 'email_clicked',
} as const;