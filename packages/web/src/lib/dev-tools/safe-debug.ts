import { Address } from 'viem';
import Safe from '@safe-global/protocol-kit';
import { buildPrevalidatedSig, SAFE_ABI } from '../sponsor-tx/core';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

export async function debugSafeSig(
  safeAddress: Address,
  safeTx: any,
  signer: Address,
) {
  console.log('debugging safe sig');
  const publicClient = createPublicClient({ chain: base, transport: http() });
  const sdk = await Safe.init({
    safeAddress,
    provider: process.env.NEXT_PUBLIC_BASE_RPC_URL!!,
  });
  console.log('sdk initialized');
  const txHash = await sdk.getTransactionHash(safeTx);
  const preSig = buildPrevalidatedSig(signer as `0x${string}`);
  console.log('preSig built');

  const res = await publicClient.readContract({
    address: safeAddress,
    abi: SAFE_ABI,
    functionName: 'isValidSignature',
    args: [txHash as `0x${string}`, preSig],
  });
  console.log('res', res);
  console.log('debugSignature:', {
    owners: await sdk.getOwners(),
    safeTxHash: txHash,
    preSig,
    isValidSig: res,
  });
}
