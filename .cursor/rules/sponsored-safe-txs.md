# Sending Sponsored Transactions via Safe from a Next.js Page (`page.tsx`)

This document outlines the process for executing gas-sponsored transactions through a user's Gnosis Safe wallet, initiated from a client-side Next.js component (`page.tsx`), using Privy's smart wallet infrastructure and our custom `useSafeRelay` hook.

## Context

We leverage Privy's Smart Wallet (which acts as the owner of the user's primary Gnosis Safe) and the `@safe-global/protocol-kit` (abstracted within our helpers) to construct and relay transactions without requiring the user to pay gas fees directly. The sponsorship is handled by Privy's infrastructure when using the `smartClient.sendTransaction` method, which is called internally by our `useSafeRelay` hook.

## Steps

The process is significantly simplified by using the `useSafeRelay` hook within a `useCallback` triggered by a user action (e.g., clicking a "Send" button) in a `'use client'` component:

1.  **Prerequisites & Setup:**
    *   Ensure the component is marked `'use client'`.
    *   Import necessary hooks: `useSafeRelay` from `@/hooks/use-safe-relay`.
    *   Import necessary libraries: `viem` (for encoding, types, constants like `Address`, `Hex`, `encodeFunctionData`, `erc20Abi`), `MetaTransactionData` from `@safe-global/safe-core-sdk-types`.
    *   Import UI components, `trpc` client (`api`), and potentially `toast` for notifications.
    *   Define constants (e.g., contract addresses like `USDC_ADDRESS`, `USDC_DECIMALS`).
    *   Initialize `viem` public client if needed for reads (`createPublicClient`).

2.  **Get Primary Safe Address:**
    *   Fetch the user's primary Safe address, typically stored in the database and retrieved via a tRPC query (e.g., `api.settings.userSafes.list.useQuery()`). Ensure it's cast or validated as `Address`.

3.  **Initialize the Hook:**
    *   Call `const { ready, send } = useSafeRelay(primarySafeAddress);`.
    *   The `ready` state indicates if the hook is properly initialized (smart wallet connected, valid Safe address provided).

4.  **Prepare Transaction Data:**
    *   Inside your event handler (`useCallback`):
        *   Check if `ready` is `true`.
        *   Use `viem`'s `encodeFunctionData` to create the `data` payload for the *actual* transaction(s) you want the Safe to execute (e.g., an `erc20Abi` `transfer` call).
        *   Define the `to` address (the target contract, e.g., `USDC_ADDRESS`) and `value` (usually `'0'` or `0n` for token transfers).
        *   Structure this information as an array of `MetaTransactionData` objects: `const transactions: MetaTransactionData[] = [{ to, value: '0', data }];`.

5.  **Send Transaction via Hook:**
    *   Call the `send` function from the hook: `const txHash = await send(transactions);`.
    *   This function handles:
        *   Initializing the Safe SDK.
        *   Creating the Safe transaction.
        *   Adding the pre-validated signature.
        *   Encoding the `execTransaction` calldata.
        *   Relaying the transaction via Privy's `smartClient.sendTransaction` for sponsorship.
    *   Store the returned transaction hash (`txHash`).

6.  **Handle UI Updates and Confirmation:**
    *   Set loading states (`isLoading`).
    *   Display the `txHash` to the user.
    *   Optionally, poll for the transaction receipt using `publicClient.getTransactionReceipt({ hash: txHash })`.
    *   Show success/error messages using `toast`.
    *   Reset form state and potentially refresh relevant data (e.g., balance) on success.
    *   Handle errors gracefully, extracting useful messages from the error object (the `send` function might throw errors if not `ready` or if relaying fails).

## Core Helpers (Internal)

The `useSafeRelay` hook relies on helper functions in `@/lib/sponsor-tx/core.ts`:

*   `buildSafeTx`: Initializes Safe SDK, creates the meta-transaction.
*   `relaySafeTx`: Adds the pre-validated signature, encodes `execTransaction`, and calls `smartClient.sendTransaction`.
*   `buildPrevalidatedSig`: Generates the specific signature format required by Safe for owner-based execution without EOA signatures.

## Example

Refer to `packages/web/src/app/(authenticated)/dashboard/send-usdc/page.tsx` for a practical implementation using the `useSafeRelay` hook for sending USDC. Notice how the component logic is much simpler compared to the previous direct implementation. 