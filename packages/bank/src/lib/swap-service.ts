import { encodeFunctionData, parseUnits, type Address } from 'viem';

// Basic ABI for Uniswap V3 SwapRouter exactInputSingle
// Found via Basescan: https://basescan.org/address/0x2626664c2603336E57B271c5C0b26F421741e481#code
const UNISWAP_V3_ROUTER_ABI = [
  {
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "tokenIn", "type": "address" },
          { "internalType": "address", "name": "tokenOut", "type": "address" },
          { "internalType": "uint24", "name": "fee", "type": "uint24" },
          { "internalType": "address", "name": "recipient", "type": "address" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" },
          { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
          { "internalType": "uint256", "name": "amountOutMinimum", "type": "uint256" },
          { "internalType": "uint160", "name": "sqrtPriceLimitX96", "type": "uint160" }
        ],
        "internalType": "struct ISwapRouter.ExactInputSingleParams",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "exactInputSingle",
    "outputs": [
      { "internalType": "uint256", "name": "amountOut", "type": "uint256" }
    ],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;

// Uniswap V3 Router address on Base
const UNISWAP_V3_ROUTER_ADDRESS: Address = '0x2626664c2603336E57B271c5C0b26F421741e481';

// WETH address on Base (Uniswap uses WETH, not native ETH)
const WETH_ADDRESS: Address = '0x4200000000000000000000000000000000000006';

// USDC address on Base
const USDC_ADDRESS: Address = process.env.NEXT_PUBLIC_USDC_ADDRESS_BASE as Address;

// Standard fee tier for WETH/USDC on Base (check Uniswap info for best tier)
const WETH_USDC_FEE_TIER = 3000; // 0.3%

interface SwapTxData {
  to: Address;
  value: bigint;
  data: `0x${string}`;
}

/**
 * Encodes the transaction data for swapping ETH (via WETH) for USDC using Uniswap V3.
 * @param ethAmount The amount of ETH to swap (as a string, e.g., "0.01").
 * @param recipientAddress The address that will receive the USDC (the Safe address).
 * @param slippageTolerance Percentage (e.g., 0.5 for 0.5%). Defaults to 0.5.
 * @returns The encoded transaction data.
 */
export const encodeEthToUsdcSwapData = (
  ethAmount: string,
  recipientAddress: Address,
  slippageTolerance: number = 0.5
): SwapTxData => {
  if (!USDC_ADDRESS) {
    throw new Error("USDC address environment variable is not set.");
  }

  const amountIn = parseUnits(ethAmount, 18); // ETH has 18 decimals

  // Note: Calculating amountOutMinimum requires a price feed.
  // For now, setting it to 0 for simplicity, but THIS IS UNSAFE FOR PRODUCTION.
  // You MUST implement proper slippage calculation based on real-time prices.
  const amountOutMinimum = 0n; 
  console.warn("0xHypr WARNING: amountOutMinimum is 0. Slippage protection is disabled!");

  const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 minutes from now

  const params = {
    tokenIn: WETH_ADDRESS,
    tokenOut: USDC_ADDRESS,
    fee: WETH_USDC_FEE_TIER,
    recipient: recipientAddress,
    deadline: deadline,
    amountIn: amountIn,
    amountOutMinimum: amountOutMinimum,
    sqrtPriceLimitX96: 0n, // Setting 0 means no price limit
  };

  const swapData = encodeFunctionData({
    abi: UNISWAP_V3_ROUTER_ABI,
    functionName: 'exactInputSingle',
    args: [params]
  });

  return {
    to: UNISWAP_V3_ROUTER_ADDRESS,
    value: amountIn, // The value of the transaction is the ETH being sent
    data: swapData,
  };
}; 