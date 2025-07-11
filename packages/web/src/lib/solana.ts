import { createSolanaRpc, devnet, mainnet } from '@solana/kit';

export const mainnetRpc = createSolanaRpc(mainnet('https://api.mainnet-beta.solana.com'));
export const devnetRpc = createSolanaRpc(devnet('https://api.devnet.solana.com'));

export const LAMPORTS_PER_SOL = 1_000_000_000