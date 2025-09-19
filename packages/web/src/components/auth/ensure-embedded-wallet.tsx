'use client';

import { useEffect } from 'react';
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
  const { createWallet, creatingWallet } = useCreateWallet();

  useEffect(() => {
    if (!ready || !authenticated || creatingWallet) return;

    const hasEmbedded = wallets.some(
      (wallet) => wallet.walletClientType === 'privy',
    );

    if (!hasEmbedded) {
      void createWallet();
    }
  }, [ready, authenticated, wallets, createWallet, creatingWallet]);

  return null;
}
