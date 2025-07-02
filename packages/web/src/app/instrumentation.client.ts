import posthog from 'posthog-js'
import { POSTHOG_HOST } from '@/lib/posthog-config'

// Initialize PostHog as early as possible on the client. This file is automatically
// executed by Next.js when it exists at the root of the `app` directory.
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: '/ingest',
  ui_host: POSTHOG_HOST,
  capture_pageview: false,
  capture_pageleave: true,
})

// ---- Console & error capturing ------------------------------
// Capture console logs/warnings/errors and send them to PostHog for
// easier debugging of user sessions. We only enable this outside of
// local development to avoid polluting the project logs.
if (process.env.NODE_ENV === 'production') {
  type ConsoleLevel = 'log' | 'info' | 'warn' | 'error'
  const levels: ConsoleLevel[] = ['log', 'info', 'warn', 'error']

  levels.forEach((level) => {
    const original = console[level] as (...args: any[]) => void
    console[level] = (...args: any[]) => {
      try {
        // Send a PostHog event with the log details
        posthog.capture('$console_log', {
          level,
          args: args.map((a) => {
            try {
              return typeof a === 'object' ? JSON.stringify(a) : String(a)
            } catch (_) {
              return '[unserialisable]'
            }
          }),
          url: window.location.href,
        })
      } catch (_) {
        // swallow any error – never break the console
      }
      // Always call the original console method
      original.apply(console, args)
    }
  })

  // Capture uncaught errors
  window.addEventListener('error', (event) => {
    posthog.capture('$error', {
      message: event.message,
      filename: (event as any).filename,
      lineno: (event as any).lineno,
      colno: (event as any).colno,
      url: window.location.href,
    })
  })

  // Capture unhandled Promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    posthog.capture('$unhandled_promise_rejection', {
      reason: String(event.reason),
      url: window.location.href,
    })
  })
}

// Re-export for convenience so it can be imported from this module elsewhere.
export default posthog; 