import { Safe4337Pack } from '@safe-global/relay-kit';
import { ethers } from 'ethers';
import { base } from 'viem/chains';
import { SignedSafeOpPayload } from './types';
import { http } from 'viem';
import { createPublicClient } from 'viem';

export async function submitSignedSafeOp(
  payload: SignedSafeOpPayload,
): Promise<`0x${string}`> {
  if (payload.chainId !== base.id) throw new Error('unsupported chain');

  const apiKey = process.env.PIMLICO_API_KEY!;
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.BASE_RPC_URL!,
  );

  // Create the Safe4337Pack with configuration
  // There are type mismatches between the SDK and TypeScript definitions
  console.log('payload', payload);
  const pack = await Safe4337Pack.init({
    provider: process.env.BASE_RPC_URL!,
    bundlerUrl: `https://api.pimlico.io/v2/${base.id}/rpc?apikey=${apiKey}`,
    
    safeModulesVersion: '0.3.0', // entrypoint v0.7
    paymasterOptions: {
      paymasterUrl: `https://api.pimlico.io/v2/${base.id}/rpc?apikey=${apiKey}`,
      paymasterAddress: '0x0000000000000000000000000000000000000000',
      paymasterTokenAddress: '0x0000000000000000000000000000000000000000',
    },
    options: {
      safeAddress: payload.predictedSafe,
    },
  });

  // Execute the transaction with the signed operation
  const userOpHash = await pack.executeTransaction({
    executable: payload.signedSafeOperation,
    skipBundlerGasEstimation: true,
  } as any);

  // The returned hash is a string but the type definition is incorrect
  return userOpHash as `0x${string}`;
}
