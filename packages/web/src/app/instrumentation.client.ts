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

// Re-export for convenience so it can be imported from this module elsewhere.
export default posthog; 