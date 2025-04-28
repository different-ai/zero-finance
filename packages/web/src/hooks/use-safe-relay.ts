'use client';
import { useCallback, useMemo } from 'react';
import type { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { buildSafeTx, relaySafeTx } from '@/lib/sponsor-tx/core';
import { type Address, type Hex, isAddress } from 'viem';

/**
 * Custom hook to simplify relaying Safe transactions via Privy smart wallets.
 *
 * @param safeAddress The address of the Safe wallet to interact with.
 * @returns An object containing:
 *  - `ready`: Boolean indicating if the smart wallet client is available.
 *  - `send`: An async function to build and relay transactions.
 */
export function useSafeRelay(safeAddress: Address | string | undefined) {
  const { client: smartClient } = useSmartWallets();

  // Calculate readiness based on valid addresses
  const ready = useMemo(() => {
    return (
      !!smartClient?.account &&
      !!safeAddress &&
      isAddress(safeAddress) &&
      isAddress(smartClient.account.address) // Also check signer address validity
    );
  }, [smartClient, safeAddress]);

  /**
   * Builds a Safe transaction with the provided meta-transactions and relays it.
   *
   * @param txs An array of `MetaTransactionData` objects representing the transaction(s) to execute.
   * @param gas Optional gas limit for the Safe transaction.
   * @returns A Promise resolving to the transaction hash (user operation hash).
   * @throws An error if the smart wallet client is not ready.
   */
  const send = useCallback(
    async (
      txs: MetaTransactionData[],
      gas?: bigint | string,
    ): Promise<Hex> => {
      // Runtime checks remain useful even if TS needs assertion hints
      if (!ready || !smartClient?.account || !safeAddress) {
        throw new Error(
          'useSafeRelay: Not ready. Ensure smart wallet is connected and Safe address is valid.',
        );
      }

      // Assert types for function calls, relying on `ready` check for validity
      const assertedSafeAddress = safeAddress as Address;
      const assertedSignerAddress = smartClient.account.address as Address;

      const safeTx = await buildSafeTx(txs, { safeAddress: assertedSafeAddress, gas });

      const signer = { address: assertedSignerAddress };
      return relaySafeTx(safeTx, signer, smartClient);
    },
    // Include `ready` in dependencies as it signals the validity checks passed
    [ready, smartClient, safeAddress],
  );

  return useMemo(() => ({ ready, send }), [ready, send]);
} 