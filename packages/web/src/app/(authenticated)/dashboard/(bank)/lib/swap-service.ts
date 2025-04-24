import { encodeFunctionData, parseUnits, type Address, getAddress } from 'viem';
import type { LiFiStep, Route } from '@lifi/types'; // Need to install @lifi/types

// Uniswap V4 uses UniversalRouter for simplest swaps
// This ABI is specifically for the exactInputSingle command on Universal Router
const UNIVERSAL_ROUTER_ABI = [
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "commands",
        "type": "bytes"
      },
      {
        "internalType": "bytes[]",
        "name": "inputs",
        "type": "bytes[]"
      }
    ],
    "name": "execute",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;

// Command IDs for Universal Router
const UNIVERSAL_ROUTER_COMMANDS = {
  V3_SWAP_EXACT_IN: '00', // Hex command for V3 exact input swap
  UNWRAP_WETH: '0c',      // Hex command for unwrapping WETH
  WRAP_ETH: '0b'          // Hex command for wrapping ETH to WETH
};

// Universal Router address on Base - converted to checksum format
const UNIVERSAL_ROUTER_ADDRESS: Address = getAddress('0x198EF79F2a46Ddbe87a35F499aA3Bd5698E4DDC0');

// WETH address on Base - converted to checksum format
const WETH_ADDRESS: Address = getAddress('0x4200000000000000000000000000000000000006');

// USDC address on Base - converted to checksum format
const usdcEnvAddress = process.env.NEXT_PUBLIC_USDC_ADDRESS_BASE || '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const USDC_ADDRESS: Address = getAddress(usdcEnvAddress);

// Default slippage from environment with fallback to 1%
const DEFAULT_SLIPPAGE = process.env.NEXT_PUBLIC_SWAP_SLIPPAGE 
  ? parseFloat(process.env.NEXT_PUBLIC_SWAP_SLIPPAGE) 
  : 1.0;

// Standard fee tier for ETH/USDC on Base
const ETH_USDC_FEE_TIER = 500; // 0.05%

// Current market price of ETH in USDC (approximately)
const ETH_PRICE_IN_USDC = 3300n; // Update this regularly in production

interface SwapTxData {
  to: Address;
  value: bigint;
  data: `0x${string}`;
  gasPrice?: string; // Optional: 1inch might provide gas price hints
  estimatedGas?: string; // Optional: 1inch might provide gas estimates
}

/**
 * Encodes the transaction data for swapping ETH for USDC using Uniswap V4 Universal Router.
 * 
 * @param ethAmount The amount of ETH to swap (as a string, e.g., "0.01").
 * @param recipientAddress The address that will receive the USDC (the Safe address).
 * @param slippageTolerance Percentage (e.g., 0.5 for 0.5%). Defaults to env value or 1.0%.
 * @returns The encoded transaction data.
 */
export const encodeEthToUsdcSwapData = (
  ethAmount: string,
  recipientAddress: Address,
  slippageTolerance?: number // Made optional to prefer env value
): SwapTxData => {
  // Use provided slippage tolerance, or fall back to env variable or default
  const effectiveSlippage = slippageTolerance ?? DEFAULT_SLIPPAGE;
  
  console.log(`0xHypr Using slippage: ${effectiveSlippage}% (from ${slippageTolerance ? 'parameter' : 'environment'})`);
  
  if (!USDC_ADDRESS) {
    throw new Error("USDC address environment variable is not set.");
  }

  // Parse the ETH amount with 18 decimals
  const amountIn = parseUnits(ethAmount, 18);
  
  // Calculate minimum amount out with slippage tolerance
  // In production, use an on-chain quote service like the Uniswap Quote API
  // For now, use our hardcoded approximate ETH price
  const baseExpectedAmount = (amountIn * ETH_PRICE_IN_USDC) / 10n**18n;
  
  // Apply slippage tolerance (convert percentage to basis points)
  const slippageBasisPoints = BigInt(Math.floor(effectiveSlippage * 100));
  const amountOutMinimum = (baseExpectedAmount * (10000n - slippageBasisPoints)) / 10000n;
  
  console.log("0xHypr Slippage calculation:", {
    slippagePercent: effectiveSlippage, 
    slippageBasisPoints: slippageBasisPoints.toString(),
    baseExpected: baseExpectedAmount.toString(),
    afterSlippage: amountOutMinimum.toString() 
  });
  
  if (amountOutMinimum <= 0n) {
    console.warn("0xHypr WARNING: amountOutMinimum calculated as 0 or negative. Using 1 as minimum.");
  }
  
  // Set a reasonable deadline (20 minutes from now)
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20);
  
  // Encode the V3 exactInputSingle parameters
  // This is the payload for the V3_SWAP_EXACT_IN command
  const v3SwapData = encodeFunctionData({
    abi: [
      {
        name: "exactInputSingle",
        type: "function",
        inputs: [
          {
            name: "params",
            type: "tuple",
            components: [
              { name: "tokenIn", type: "address" },
              { name: "tokenOut", type: "address" },
              { name: "fee", type: "uint24" },
              { name: "recipient", type: "address" },
              { name: "amountIn", type: "uint256" },
              { name: "amountOutMinimum", type: "uint256" },
              { name: "sqrtPriceLimitX96", type: "uint160" }
            ]
          }
        ],
        outputs: [{ name: "amountOut", type: "uint256" }]
      }
    ],
    functionName: "exactInputSingle",
    args: [
      {
        tokenIn: WETH_ADDRESS,
        tokenOut: USDC_ADDRESS,
        fee: ETH_USDC_FEE_TIER,
        recipient: recipientAddress,
        amountIn,
        amountOutMinimum: amountOutMinimum > 0n ? amountOutMinimum : 1n,
        sqrtPriceLimitX96: 0n // No price limit
      }
    ]
  });
  
  // For ETH->USDC swap via Universal Router, we need two commands:
  // 1. WRAP_ETH - Convert ETH to WETH (input is ETH value)
  // 2. V3_SWAP_EXACT_IN - Swap WETH for USDC using V3 pools
  
  // Combine commands as a hex string prefixed with 0x
  const commands = `0x${UNIVERSAL_ROUTER_COMMANDS.WRAP_ETH}${UNIVERSAL_ROUTER_COMMANDS.V3_SWAP_EXACT_IN}` as `0x${string}`;
  
  // Inputs array for each command
  // First input - WRAP_ETH (empty input since amount comes from msg.value)
  // Second input - V3_SWAP_EXACT_IN with the encoded swap data
  const inputs = ['0x', v3SwapData] as const;
  
  // Encode the full Universal Router execute call
  const routerData = encodeFunctionData({
    abi: UNIVERSAL_ROUTER_ABI,
    functionName: 'execute',
    args: [commands, inputs]
  });
  
  console.log("0xHypr ETH to USDC swap details:", {
    ethAmount,
    amountIn: amountIn.toString(),
    amountInUSD: `~$${Number(ethAmount) * Number(ETH_PRICE_IN_USDC)}`,
    amountOutMinimum: (amountOutMinimum > 0n ? amountOutMinimum : 1n).toString(),
    slippageTolerance: `${effectiveSlippage}%`,
    recipient: recipientAddress,
    universalRouter: UNIVERSAL_ROUTER_ADDRESS,
    wethAddress: WETH_ADDRESS,
    usdcAddress: USDC_ADDRESS
  });
  
  return {
    to: UNIVERSAL_ROUTER_ADDRESS,
    value: amountIn, // The ETH being sent as the transaction value
    data: routerData,
  };
};

// --- New 1inch Aggregator Service --- 

const ONEINCH_API_URL = 'https://api.1inch.dev/swap/v6.0';
const BASE_CHAIN_ID = 8453;
const ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'; // Virtual address for ETH

/**
 * Fetches swap transaction data from the 1inch Aggregation Protocol API.
 * 
 * @param ethAmount The amount of ETH to swap (as a string, e.g., "0.01").
 * @param fromAddress The address initiating the swap (EOA/Privy wallet).
 * @param recipientAddress The address that will execute the transaction (Safe address).
 * @param slippageTolerance Percentage (e.g., 1.0 for 1%). Defaults to env value or 1.0%.
 * @returns The encoded transaction data from 1inch.
 */
export const get1inchSwapData = async (
  ethAmount: string,
  fromAddress: Address, 
  recipientAddress: Address, // Safe address
  slippageTolerance?: number
): Promise<SwapTxData> => {
  
  const effectiveSlippage = slippageTolerance ?? DEFAULT_SLIPPAGE;
  const amountInWei = parseUnits(ethAmount, 18);
  
  if (!process.env.NEXT_PUBLIC_USDC_ADDRESS_BASE) {
    throw new Error("USDC address environment variable (NEXT_PUBLIC_USDC_ADDRESS_BASE) is not set.");
  }
  const usdcAddress = getAddress(process.env.NEXT_PUBLIC_USDC_ADDRESS_BASE);
  
  // Construct the 1inch API request URL
  const params = new URLSearchParams({
    src: ETH_ADDRESS,
    dst: usdcAddress,
    amount: amountInWei.toString(),
    from: fromAddress, // The EOA address for context (balances, approvals)
    receiver: recipientAddress, // The Safe address will receive the swapped tokens
    slippage: effectiveSlippage.toString(),
    // includeGas: 'true', // Optionally include gas estimates
    // disableEstimate: 'true' // Use if you don't need 1inch to estimate; potentially faster
  });

  const apiUrl = `${ONEINCH_API_URL}/${BASE_CHAIN_ID}/swap?${params.toString()}`;
  console.log("0xHypr Calling 1inch API:", apiUrl);

  try {
    // Use API Key if available (recommended for better rates/limits)
    const headers: HeadersInit = {
      "Accept": "application/json"
    };
    if (process.env.NEXT_PUBLIC_1INCH_API_KEY) {
      headers["Authorization"] = `Bearer ${process.env.NEXT_PUBLIC_1INCH_API_KEY}`;
    }

    const response = await fetch(apiUrl, { headers });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("0xHypr 1inch API Error Response:", errorBody);
      throw new Error(`1inch API request failed with status ${response.status}: ${response.statusText}. Body: ${errorBody}`);
    }

    const swapData = await response.json();
    console.log("0xHypr 1inch API Response:", swapData);

    if (!swapData.tx || !swapData.tx.to || !swapData.tx.data || swapData.tx.value === undefined) {
       throw new Error('Invalid response structure from 1inch API. Missing tx object or required fields.');
    }

    // Return the transaction data needed for Safe execution
    return {
      to: getAddress(swapData.tx.to), // Ensure checksum address
      value: BigInt(swapData.tx.value), // ETH value to send with the tx
      data: swapData.tx.data as `0x${string}`,
      gasPrice: swapData.tx.gasPrice, // Optional
      estimatedGas: swapData.tx.gas, // Optional
    };

  } catch (error) {
    console.error("0xHypr Error fetching swap data from 1inch:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to get swap data from 1inch: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred while fetching 1inch swap data.");
    }
  }
}; 

// --- New LI.FI Aggregator Service --- 

const LIFI_API_URL = 'https://li.quest/v1'; // LI.FI API base URL
const BASE_CHAIN_ID_LIFI = 8453;
const ETH_ADDRESS_LIFI = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'; // Virtual address for ETH

/**
 * Fetches a swap quote from LI.FI and returns the transaction data for the best route.
 * 
 * @param ethAmount The amount of ETH to swap (as a string, e.g., "0.01").
 * @param fromAddress The address initiating the swap (EOA/Privy wallet).
 * @param recipientAddress The address that will ultimately receive the funds and execute tx (Safe address).
 * @param slippageTolerance Percentage (e.g., 1.0 for 1%). Defaults to env value or 1.0%.
 * @returns The encoded transaction data from LI.FI for the best route.
 */
export const getLifiQuoteAndTxData = async (
  ethAmount: string,
  fromAddress: Address, 
  recipientAddress: Address, // Safe address
  slippageTolerance?: number
): Promise<SwapTxData> => {
  
  const effectiveSlippage = slippageTolerance ?? DEFAULT_SLIPPAGE;
  const amountInWei = parseUnits(ethAmount, 18);
  
  if (!process.env.NEXT_PUBLIC_USDC_ADDRESS_BASE) {
    throw new Error("USDC address environment variable (NEXT_PUBLIC_USDC_ADDRESS_BASE) is not set.");
  }
  const usdcAddress = getAddress(process.env.NEXT_PUBLIC_USDC_ADDRESS_BASE);

  // Construct the LI.FI /quote request URL
  const params = new URLSearchParams({
    fromChain: BASE_CHAIN_ID_LIFI.toString(),
    toChain: BASE_CHAIN_ID_LIFI.toString(),
    fromToken: ETH_ADDRESS_LIFI,
    toToken: usdcAddress,
    fromAmount: amountInWei.toString(),
    fromAddress: fromAddress, // EOA address performing the swap actions
    toAddress: recipientAddress, // Final recipient (Safe)
    slippage: (effectiveSlippage / 100).toString(), // LI.FI expects slippage as decimal (e.g., 0.01 for 1%)
    // order: 'RECOMMENDED', // Default
    // integrator: 'YOUR_INTEGRATOR_KEY', // Recommended: Get your integrator key from LI.FI
  });

  const quoteUrl = `${LIFI_API_URL}/quote?${params.toString()}`;
  console.log("0xHypr Calling LI.FI Quote API:", quoteUrl);

  try {
    const response = await fetch(quoteUrl);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("0xHypr LI.FI API Quote Error Response:", errorBody);
      throw new Error(`LI.FI API quote request failed with status ${response.status}: ${response.statusText}. Body: ${errorBody}`);
    }

    const quoteResponse = await response.json();
    console.log("0xHypr LI.FI Quote API Response:", quoteResponse);

    // LI.FI Quote response contains the transactionRequest directly
    const transactionRequest = quoteResponse.transactionRequest;

    if (!transactionRequest || !transactionRequest.to || !transactionRequest.data || transactionRequest.value === undefined) {
       throw new Error('Invalid response structure from LI.FI API /quote. Missing transactionRequest or required fields.');
    }

    // Return the transaction data needed for Safe execution
    // LI.FI returns value in hex string, convert to bigint
    return {
      to: getAddress(transactionRequest.to), // Ensure checksum address
      value: BigInt(transactionRequest.value), // ETH value to send with the tx
      data: transactionRequest.data as `0x${string}`,
      gasPrice: transactionRequest.gasPrice, // Optional
      estimatedGas: transactionRequest.gasLimit, // Optional
    };

  } catch (error) {
    console.error("0xHypr Error fetching swap data from LI.FI:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to get swap data from LI.FI: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred while fetching LI.FI swap data.");
    }
  }
}; 