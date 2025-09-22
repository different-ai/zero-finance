'use client';

import { useEffect, useRef } from 'react';
import { usePrivy, useWallets, useCreateWallet } from '@privy-io/react-auth';

/**
 * Guarantees that a user has an embedded Privy wallet provisioned after login.
 * Useful when the Privy modal is not the primary login flow.
 */
export function EnsureEmbeddedWallet() {
  const { ready, authenticated, user } = usePrivy();
  const { wallets, ready: walletsReady } = useWallets();
  const { createWallet } = useCreateWallet();
  const creatingRef = useRef(false);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    if (!ready || !authenticated || !walletsReady) {
      hasCheckedRef.current = false;
      return;
    }

    if (creatingRef.current || hasCheckedRef.current) return;

    // Check if user already has an embedded wallet in their Privy account data
    const userHasEmbeddedWallet =
      user?.wallet?.walletClientType === 'privy' ||
      user?.linkedAccounts?.some(
        (account) =>
          account.type === 'wallet' && account.walletClientType === 'privy',
      );

    // Also check in the wallets array
    const hasEmbedded = wallets.some(
      (wallet) => wallet.walletClientType === 'privy',
    );

    hasCheckedRef.current = true;

    // Only create if no embedded wallet exists anywhere
    if (!hasEmbedded && !userHasEmbeddedWallet) {
      creatingRef.current = true;
      createWallet()
        .catch((error) => {
          if (error?.message?.includes('already has an embedded wallet')) {
            console.log(
              'User already has an embedded wallet, skipping creation',
            );
          } else {
            console.error('Error creating wallet:', error);
          }
        })
        .finally(() => {
          creatingRef.current = false;
        });
    }
  }, [ready, authenticated, walletsReady, wallets, user, createWallet]);

  return null;
}
