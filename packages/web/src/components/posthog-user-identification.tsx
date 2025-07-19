'use client'

import { useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { usePostHog } from 'posthog-js/react'

export function PostHogUserIdentification() {
  const { ready, authenticated, user } = usePrivy()
  const posthog = usePostHog()

  useEffect(() => {
    if (!ready || !posthog) return

    if (authenticated && user) {
      // Identify the user with their Privy ID and email
      const userId = user.id
      const email = user.email?.address
      
      // PostHog identify call with user properties
      posthog.identify(userId, {
        email: email,
        name: email?.split('@')[0], // Use email prefix as name if not available
        created_at: user.createdAt,
        // Add any other user properties you want to track
        wallet_address: user.wallet?.address,
        linked_accounts: user.linkedAccounts?.map(account => account.type),
        has_embedded_wallet: !!user.wallet,
        wallet_client_type: user.wallet?.walletClientType,
        // Custom properties
        source: 'privy',
        app: 'zero-finance',
        // Email-specific properties for better tracking
        email_domain: email?.split('@')[1],
      })

      // Set super properties that will be included with all events
      posthog.register({
        user_email: email,
        user_id: userId,
      })

      // Track login event
      posthog.capture('user_logged_in', {
        email: email,
        login_method: user.linkedAccounts?.[0]?.type || 'unknown',
        has_wallet: !!user.wallet
      })

      console.log('0xHypr', 'PostHog user identified', { userId, email })
    } else if (!authenticated && posthog.get_distinct_id()) {
      // Reset PostHog when user logs out
      posthog.reset()
      console.log('0xHypr', 'PostHog reset on logout')
    }
  }, [ready, authenticated, user, posthog])

  return null
}