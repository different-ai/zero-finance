import { PostHog } from 'posthog-node'

/**
 * Returns a new PostHog Node client. Because server functions in Next.js can
 * be short-lived, we configure the client to flush immediately so events don't
 * get lost before the function exits.
 */
export function PostHogClient() {
  return new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  })
} 