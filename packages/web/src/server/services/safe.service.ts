import { createPublicClient, http, Address, isAddress, formatUnits } from 'viem';
import { base } from 'viem/chains';

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

const USDC_ADDRESS_BASE =
  (process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS_BASE as Address) ||
  ('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address);

// Memoize decimals per token to avoid extra RPC calls and make the balance
// routine more robust. USDC on Base always has 6 decimals, so we hard-code
// that value to remove an unnecessary network request that occasionally
// times out and caused the dashboard balance to show 0.

const DECIMAL_CACHE: Record<string, number> = {
  [USDC_ADDRESS_BASE.toLowerCase()]: 6,
};

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
    // 1. Fetch raw balance
    const balance = await publicClient.readContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [safeAddress],
    });

    // 2. Determine token decimals – first check cache, otherwise query chain
    let decimals: number;
    const cacheKey = tokenAddress.toLowerCase();
    if (DECIMAL_CACHE[cacheKey] !== undefined) {
      decimals = DECIMAL_CACHE[cacheKey];
    } else {
      try {
        decimals = await publicClient.readContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: 'decimals',
        });
        DECIMAL_CACHE[cacheKey] = decimals;
      } catch (decErr) {
        // Default to 18 decimals if contract call fails (most ERC-20s) to
        // avoid crashing the balance fetch.
        console.error(`Failed to fetch decimals for ${tokenAddress}:`, decErr);
        decimals = 18;
      }
    }
    
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