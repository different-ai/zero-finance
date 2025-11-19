'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import type { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import { Address, type Hex, isAddress } from 'viem';
import { base, arbitrum } from 'viem/chains';
import type { Chain } from 'viem/chains';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { relaySafeTx } from '@/lib/sponsor-tx/core';
import { buildSafeTx } from '@/lib/sponsor-tx/core';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';

/**
 * Helper to get Chain object for a chain ID
 */
function getChainForId(chainId: number): Chain {
  if (chainId === SUPPORTED_CHAINS.ARBITRUM) {
    return arbitrum;
  }
  return base;
}

/**
 * Hook: useSafeRelay
 *
 * Relays Safe transactions through the connected Privy smart‑wallet.
 *
 * @param safeAddress — the Safe being controlled. May be `undefined`
 *                     until the caller has determined which Safe to use.
 * @param chainId — optional chain ID for the Safe (defaults to Base)
 *
 * @returns { ready, send }
 *   • ready — boolean, true when the smart‑wallet client and safeAddress
 *             are both present and well‑formed.
 *   • send  — async (txs, gas?, opts?) => userOperationHash
 *             ‑ txs  : array of MetaTransactionData to include in the SafeTx
 *             ‑ gas  : override for safeTxGas if you want manual control
 *             ‑ opts : { skipPreSig?: boolean } — forward to relaySafeTx.
 */
export function useSafeRelay(
  safeAddress: Address | string | undefined,
  chainId?: number,
) {
  const { client: defaultClient, getClientForChain } = useSmartWallets();
  const [chainClient, setChainClient] = useState<any>(null);

  // Get the appropriate client for the target chain
  const targetChainId = chainId || SUPPORTED_CHAINS.BASE;
  const isCrossChain = targetChainId !== SUPPORTED_CHAINS.BASE;

  // Fetch chain-specific client when needed
  useEffect(() => {
    if (isCrossChain && getClientForChain) {
      getClientForChain({ id: targetChainId })
        .then((client) => {
          setChainClient(client);
        })
        .catch((err) => {
          console.error('[useSafeRelay] Failed to get client for chain:', err);
          setChainClient(null);
        });
    } else {
      setChainClient(null);
    }
  }, [isCrossChain, targetChainId, getClientForChain]);

  // Use chain-specific client for cross-chain, default client for Base
  const smartClient = isCrossChain ? chainClient : defaultClient;

  // Get chain object for the target chain
  const targetChain = useMemo(() => {
    return chainId ? getChainForId(chainId) : base;
  }, [chainId]);

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

      console.log('[useSafeRelay] Building Safe transaction:', {
        gas: gasToUse.toString(),
        chainId,
        isCrossChain,
        safeAddress: safeAddr,
        signerAddress: signerAddr,
        clientChain: smartClient?.chain?.id,
      });

      const safeTx = await buildSafeTx(txs, {
        safeAddress: safeAddr,
        chainId,
        gas: gasToUse,
      });
      console.log('safeTx', safeTx);

      return relaySafeTx(
        safeTx,
        signerAddr,
        smartClient,
        safeAddr,
        targetChain,
        undefined,
        opts,
      );
    },
    [ready, smartClient, safeAddress, chainId, targetChain],
  );

  return { ready, send };
}
