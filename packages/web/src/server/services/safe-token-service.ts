import {
  type Address,
  createPublicClient,
  http,
  encodeFunctionData,
  parseUnits,
  type Hex,
} from 'viem';
import { base, polygon, mainnet } from 'viem/chains'; // Import chain definitions
import { USDC_ADDRESS } from '@/lib/constants';
import { getBaseRpcUrl } from '@/lib/base-rpc-url';
// Removed imports related to backend signing and Safe SDK initialization
// import { submitSignedSafeOp } from '../relayer/relaykitSponsor';
import type { MetaTransactionData } from '@safe-global/safe-core-sdk-types'; // Use imported type
// import Safe, { EthersAdapter } from '@safe-global/protocol-kit';
// import { ethers } from 'ethers';
// import { getUserPrivateKey } from '@/lib/user-profile-service';

// ERC20 ABI for token transfers (simplified)
const ERC20_ABI = [
  {
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const; // Use const assertion for stricter ABI typing

// Token addresses (ensure these are correct and comprehensive)
export const TOKEN_ADDRESSES: Record<string, Record<string, Address>> = {
  base: {
    usdc: USDC_ADDRESS as Address,
    usdt: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
  },
  ethereum: {
    usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  },
  polygon: {
    usdc: '0x3c499c542cEF5E3811e1192ce70d8cC03d593F91', // Updated Polygon USDC address
    usdt: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  },
};

const CHAIN_CONFIGS = {
  base: base,
  ethereum: mainnet,
  polygon: polygon,
};

const RPC_URLS: Record<string, string> = {
  base: getBaseRpcUrl(),
  ethereum:
    process.env.ETHEREUM_RPC_URL ||
    process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL ||
    '',
  polygon:
    process.env.POLYGON_RPC_URL ||
    process.env.NEXT_PUBLIC_POLYGON_RPC_URL ||
    '',
};

// Helper to get token decimals (defaulting to 6 for USDC/USDT)
function getTokenDecimals(tokenSymbol: string): number {
  // Add logic here if different tokens have different decimals
  return 6;
}

/**
 * Prepares transaction data for transferring an ERC20 token from a Safe.
 * This data can then be signed and executed/relayed on the client-side.
 */
export function prepareTokenTransferData({
  tokenSymbol,
  tokenNetwork,
  recipientAddress,
  amount,
}: {
  tokenSymbol: string;
  tokenNetwork: keyof typeof TOKEN_ADDRESSES;
  recipientAddress: Address;
  amount: string;
}): MetaTransactionData {
  const lowerCaseSymbol = tokenSymbol.toLowerCase();
  const tokenAddress = TOKEN_ADDRESSES[tokenNetwork]?.[lowerCaseSymbol];
  if (!tokenAddress) {
    throw new Error(
      `Unsupported token ${tokenSymbol} on network ${tokenNetwork}`,
    );
  }

  const decimals = getTokenDecimals(lowerCaseSymbol);
  const amountInBaseUnits = parseUnits(amount, decimals);

  const transferData = encodeFunctionData({
    abi: ERC20_ABI,
    functionName: 'transfer',
    args: [recipientAddress, amountInBaseUnits],
  });

  return {
    to: tokenAddress,
    data: transferData,
    value: '0', // Value is 0 for ERC20 transfers
    operation: 0, // Explicitly set operation to CALL
  };
}

// Removed: createAndSignSafeTransaction function
// Removed: executeSafeTokenTransfer function

/**
 * Checks if a transaction (UserOperation) has been confirmed.
 * TODO: Implement actual check using the userOpHash with a bundler/service.
 */
export async function checkTransactionConfirmation(
  userOpHash: string,
  network: keyof typeof CHAIN_CONFIGS,
): Promise<boolean> {
  try {
    const chainConfig = CHAIN_CONFIGS[network];
    const rpcUrl = RPC_URLS[network];
    if (!chainConfig || !rpcUrl) {
      throw new Error(`Unsupported network for confirmation check: ${network}`);
    }

    const publicClient = createPublicClient({
      chain: chainConfig,
      transport: http(rpcUrl),
    });

    // TODO: Implement actual check using the userOpHash
    // This likely involves querying an ERC-4337 bundler or using a service
    // like Pimlico to check the status of the UserOperation.
    // For now, placeholder returns false.
    console.warn(
      `Placeholder: checkTransactionConfirmation for ${userOpHash} on ${network} not fully implemented.`,
    );

    // Example using hypothetical function (replace with actual implementation)
    // const receipt = await publicClient.getUserOperationReceipt({ hash: userOpHash as Hex });
    // return !!receipt && receipt.success;

    return false; // Placeholder
  } catch (error) {
    console.error('Error checking transaction confirmation:', error);
    return false; // Return false on error
  }
}
