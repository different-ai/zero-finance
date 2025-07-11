'use client';

import { useCallback, useMemo } from 'react';
import type { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import { Address, type Hex, isAddress } from 'viem';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { relaySafeTx } from '@/lib/sponsor-tx/core';
import { buildSafeTx } from '@/lib/sponsor-tx/core';


/**
 * Hook: useSafeRelay
 *
 * Relays Safe transactions through the connected Privy smart‑wallet.
 *
 * @param safeAddress — the Safe being controlled. May be `undefined`
 *                     until the caller has determined which Safe to use.
 *
 * @returns { ready, send }
 *   • ready — boolean, true when the smart‑wallet client and safeAddress
 *             are both present and well‑formed.
 *   • send  — async (txs, gas?, opts?) => userOperationHash
 *             ‑ txs  : array of MetaTransactionData to include in the SafeTx
 *             ‑ gas  : override for safeTxGas if you want manual control
 *             ‑ opts : { skipPreSig?: boolean } — forward to relaySafeTx.
 */
export function useSafeRelay(safeAddress: Address | string | undefined) {
  const { client: smartClient } = useSmartWallets();

  // ---------- derived state ----------
  const ready = useMemo(() => {
    return (
      !!smartClient?.account &&
      !!safeAddress &&
      isAddress(safeAddress) &&
      isAddress(smartClient.account.address)
    );
  }, [smartClient, safeAddress]);

  // ---------- sender ----------
  const send = useCallback(
    async (
      txs: MetaTransactionData[],
      gas?: bigint | string,
      opts: { skipPreSig?: boolean } = {},
    ): Promise<Hex> => {
      if (!ready || !smartClient?.account || !safeAddress) {
        throw new Error('useSafeRelay: not ready');
      }

      const safeAddr = safeAddress as Address;
      const signerAddr = smartClient.account.address as Address;

      // Use provided gas or default to 200_000n
      const gasToUse = gas || 200_000n;
      
      console.log('Building Safe transaction with gas:', gasToUse.toString());

      const safeTx = await buildSafeTx(txs, { safeAddress: safeAddr, gas: gasToUse });
      console.log('safeTx', safeTx);

      return relaySafeTx(
        safeTx,
        signerAddr,
        smartClient,
        safeAddr,
        undefined,
        undefined,
        opts,
      );
    },
    [ready, smartClient, safeAddress],
  );

  return { ready, send };
}