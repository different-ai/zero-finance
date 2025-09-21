'use client';

import { useEffect, useRef } from 'react';
import {
  usePrivy,
  useWallets,
  useCreateWallet,
} from '@privy-io/react-auth';

/**
 * Guarantees that a user has an embedded Privy wallet provisioned after login.
 * Useful when the Privy modal is not the primary login flow.
 */
export function EnsureEmbeddedWallet() {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { createWallet } = useCreateWallet();
  const creatingRef = useRef(false);

  useEffect(() => {
    if (!ready || !authenticated || creatingRef.current) return;

    const hasEmbedded = wallets.some(
      (wallet) => wallet.walletClientType === 'privy',
    );

    if (!hasEmbedded) {
      creatingRef.current = true;
      void createWallet().finally(() => {
        creatingRef.current = false;
      });
    }
  }, [ready, authenticated, wallets, createWallet]);

  return null;
}
