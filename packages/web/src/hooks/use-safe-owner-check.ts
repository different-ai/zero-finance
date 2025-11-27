'use client';

import { useEffect, useState } from 'react';
import { createPublicClient, http, type Address } from 'viem';
import { base } from 'viem/chains';
import { usePrivy } from '@privy-io/react-auth';
import { getBaseRpcUrl } from '@/lib/base-rpc-url';

const SAFE_ABI = [
  {
    name: 'getOwners',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address[]' }],
  },
  {
    name: 'isOwner',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ type: 'bool' }],
  },
] as const;

export function useSafeOwnerCheck(
  safeAddress: Address | string | null | undefined,
) {
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const { user } = usePrivy();

  useEffect(() => {
    if (!safeAddress || !user) {
      setIsOwner(null);
      return;
    }

    const checkOwnership = async () => {
      setIsChecking(true);
      try {
        const publicClient = createPublicClient({
          chain: base,
          transport: http(getBaseRpcUrl()),
        });

        // Get the user's smart wallet address
        const smartWalletAccount = user.linkedAccounts?.find(
          (account) => account.type === 'smart_wallet',
        );

        console.log('[useSafeOwnerCheck] Checking ownership:', {
          safeAddress,
          smartWalletAccount,
          linkedAccounts: user.linkedAccounts?.map((a) => ({
            type: a.type,
            address: 'address' in a ? a.address : undefined,
          })),
        });

        if (!smartWalletAccount || !('address' in smartWalletAccount)) {
          console.warn(
            '[useSafeOwnerCheck] No smart wallet found, cannot check ownership',
          );
          setIsOwner(false);
          return;
        }

        const userAddress = smartWalletAccount.address as Address;

        // Check if user's smart wallet is an owner of the Safe
        const ownerStatus = await publicClient.readContract({
          address: safeAddress as Address,
          abi: SAFE_ABI,
          functionName: 'isOwner',
          args: [userAddress],
        });

        console.log('[useSafeOwnerCheck] Ownership result:', {
          userAddress,
          safeAddress,
          isOwner: ownerStatus,
        });

        setIsOwner(ownerStatus);
      } catch (error) {
        console.error('Failed to check Safe ownership:', error);
        setIsOwner(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkOwnership();
  }, [safeAddress, user]);

  return { isOwner, isChecking };
}
