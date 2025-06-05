import { createPublicClient, http, Address, isAddress, formatUnits } from 'viem';
import { base } from 'viem/chains';

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

const USDC_ADDRESS_BASE =
  (process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS_BASE as Address) ||
  ('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address);

const erc20Abi = [
  {
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export async function getSafeBalance({
  safeAddress,
  tokenAddress = USDC_ADDRESS_BASE
}: {
  safeAddress: Address | undefined | null,
  tokenAddress?: Address
}): Promise<{ raw: bigint; formatted: string } | null> {
  if (!safeAddress || !isAddress(safeAddress) || !tokenAddress) {
    console.log(`Skipping balance fetch for invalid/missing address: ${safeAddress}`);
    return null;
  }
  try {
    const [balance, decimals] = await Promise.all([
        publicClient.readContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [safeAddress],
        }),
        publicClient.readContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'decimals',
        }),
    ]);
    
    const formatted = formatUnits(balance, decimals);
    
    return {
        raw: balance,
        formatted
    };
  } catch (blockchainError) {
    console.error(`Error fetching balance for safe ${safeAddress} on Base mainnet:`, blockchainError);
    return null;
  }
} 