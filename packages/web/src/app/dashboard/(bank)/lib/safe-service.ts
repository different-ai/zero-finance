import { createPublicClient, http, formatUnits, getContract } from 'viem';
import { base } from 'viem/chains';

// Basic ABI for ERC20 balanceOf function
const erc20Abi = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
] as const;

// Export the helper functions
export const getRpcUrl = (): string => {
  const rpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL;
  if (!rpcUrl) {
    console.error('0xHypr Error: BASE_RPC_URL environment variable is not set.');
    throw new Error('BASE_RPC_URL is not configured.');
  }
  return rpcUrl;
};

export const getUsdcAddress = (): `0x${string}` => {
  const usdcAddress = process.env.NEXT_PUBLIC_USDC_ADDRESS_BASE as `0x${string}`;
  if (!usdcAddress) {
    console.error('0xHypr Error: NEXT_PUBLIC_USDC_ADDRESS_BASE environment variable is not set.');
    throw new Error('NEXT_PUBLIC_USDC_ADDRESS_BASE is not configured.');
  }
  return usdcAddress;
};

const getSafeAddress = (): `0x${string}` => {
  const safeAddress = process.env.NEXT_PUBLIC_SAFE_ADDRESS as `0x${string}`;
  if (!safeAddress) {
    console.error('0xHypr Error: NEXT_PUBLIC_SAFE_ADDRESS environment variable is not set.');
    throw new Error('NEXT_PUBLIC_SAFE_ADDRESS is not configured.');
  }
  return safeAddress;
};
// import { createPublicClient, http } from "viem";
// import { base } from "viem/chains";

// const client = createPublicClient({
//   chain: base,
//   transport: http("https://base-mainnet.g.alchemy.com/v2/i20KT3Wlszq3fR7Gru6SGaXUhjijetBt"),
// });

// const block = await client.getBlock({
//   blockNumber: 123456n,
// });

// console.log(block);

// Public client for read-only operations
const publicClient = createPublicClient({
  chain: base,
  transport: http(getRpcUrl()),
});




/**
 * Fetches the USDC balance of the configured Gnosis Safe.
 * @returns The formatted USDC balance as a string.
 */
export const getSafeUsdcBalance = async (): Promise<string> => {
  try {
    const safeAddress = getSafeAddress();
    const usdcAddress = getUsdcAddress();

    console.log(`0xHypr Debug: Fetching USDC balance for Safe: ${safeAddress} from contract: ${usdcAddress}`);

    const balance = await publicClient.readContract({
      address: usdcAddress,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [safeAddress],
    }) as bigint;

    console.log(`0xHypr Debug: Raw balance fetched: ${balance}`);

    // USDC on Base has 6 decimals
    const formattedBalance = formatUnits(balance, 6);
    console.log(`0xHypr Debug: Formatted balance: ${formattedBalance}`);

    return formattedBalance;
  } catch (error) {
    console.error('0xHypr Error fetching Safe USDC balance:', error);
    // Depending on requirements, might return '0' or re-throw
    throw new Error('Failed to fetch Safe USDC balance.');
  }
};

// Example usage (can be removed or used for testing)
// getSafeUsdcBalance()
//   .then(balance => console.log(`Safe Balance: ${balance} USDC`))
//   .catch(err => console.error(err)); 