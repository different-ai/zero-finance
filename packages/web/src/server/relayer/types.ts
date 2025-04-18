import { BaseSafeOperation } from '@safe-global/relay-kit';

export interface SignedSafeOpPayload {
  chainId: number;
  userAddress: `0x${string}`;
  predictedSafe: `0x${string}`;
  signedSafeOperation: any;
}
