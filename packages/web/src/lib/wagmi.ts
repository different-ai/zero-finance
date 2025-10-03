'use client'
import { createConfig } from '@privy-io/wagmi';
import { http } from 'wagmi'
import { base, mainnet } from 'wagmi/chains' // Add other chains if needed

// Get Privy App ID from environment variables
const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

if (!privyAppId) {
  throw new Error("NEXT_PUBLIC_PRIVY_APP_ID is not set in environment variables");
}

export const config = createConfig({
  chains: [base, mainnet], // Add other chains used in the app
  transports: {
    // Configure transports for each chain
    [base.id]: http(),
    [mainnet.id]: http(),
    // Add other transports if needed
  },
  ssr: true, // Enable SSR support if needed for Next.js
}) 