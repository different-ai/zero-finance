/**
 * Across Bridge Service
 * Handles cross-chain vault deposits via Across Protocol
 *
 * Flow:
 * 1. Get bridge quote with fees
 * 2. Encode cross-chain actions (approve + vault deposit)
 * 3. Build bridge transaction for user to sign
 * 4. Monitor bridge status with exponential backoff
 */

import {
  type Address,
  type Hex,
  encodeFunctionData,
  encodeAbiParameters,
  parseAbi,
} from 'viem';
import type { SupportedChainId } from '@/lib/types/multi-chain';
import {
  getAcrossBridgeQuote,
  getAcrossClient,
  type BridgeQuote,
} from '@/lib/across/across-client';
import {
  encodeVaultDepositMulticall,
  type CrossChainAction,
} from '@/lib/across/encode-multicall';
import {
  getUSDCAddress,
  getChainConfig,
  SUPPORTED_CHAINS,
} from '@/lib/constants/chains';

/**
 * ERC20 Approve ABI
 */
const ERC20_APPROVE_ABI = parseAbi([
  'function approve(address spender, uint256 amount) public returns (bool)',
]);

/**
 * Across SpokePool addresses
 */
const SPOKE_POOL_ADDRESSES: Record<SupportedChainId, Address> = {
  [SUPPORTED_CHAINS.BASE]: '0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64',
  [SUPPORTED_CHAINS.ARBITRUM]: '0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A',
  [SUPPORTED_CHAINS.MAINNET]: '0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5', // Mainnet SpokePool
};

/**
 * SpokePool V3 depositV3 ABI
 */
const spokePoolDepositV3Abi = [
  {
    name: 'depositV3',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'depositor', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'inputToken', type: 'address' },
      { name: 'outputToken', type: 'address' },
      { name: 'inputAmount', type: 'uint256' },
      { name: 'outputAmount', type: 'uint256' },
      { name: 'destinationChainId', type: 'uint256' },
      { name: 'exclusiveRelayer', type: 'address' },
      { name: 'quoteTimestamp', type: 'uint32' },
      { name: 'fillDeadline', type: 'uint32' },
      { name: 'exclusivityDeadline', type: 'uint32' },
      { name: 'message', type: 'bytes' },
    ],
    outputs: [],
  },
] as const;

/**
 * Bridge transaction for user to sign
 */
export interface BridgeTransaction {
  to: Address;
  data: Hex;
  value: bigint;
  chainId: SupportedChainId;
}

/**
 * Bridge deposit parameters
 */
export interface BridgeDepositParams {
  depositor: Address;
  vaultAddress?: Address; // Made optional for simple transfers
  destinationSafeAddress: Address;
  amount: string;
  sourceChainId: SupportedChainId;
  destChainId: SupportedChainId;
  message?: Hex; // Optional custom message
}

/**
 * Get bridge quote for vault deposit
 * Returns fee breakdown and transaction details
 *
 * @param params - Bridge parameters
 * @returns Bridge quote with fee breakdown
 *
 * @example
 * ```ts
 * const quote = await getBridgeQuoteForVault({
 *   amount: '100000000', // 100 USDC (6 decimals)
 *   sourceChainId: SUPPORTED_CHAINS.BASE,
 *   destChainId: SUPPORTED_CHAINS.ARBITRUM,
 *   vaultAddress: '0x...',
 *   destinationSafeAddress: '0x...',
 * });
 * console.log(`Total fee: ${formatUnits(quote.totalFee, 6)} USDC`);
 * ```
 */
export async function getBridgeQuoteForVault(params: {
  amount: string;
  sourceChainId: SupportedChainId;
  destChainId: SupportedChainId;
  vaultAddress?: Address; // Made optional
  destinationSafeAddress: Address;
}): Promise<BridgeQuote> {
  const { amount, sourceChainId, destChainId } = params;

  // Get quote from Across
  const quote = await getAcrossBridgeQuote({
    amount: BigInt(amount),
    originChainId: sourceChainId,
    destinationChainId: destChainId,
  });

  return quote;
}

/**
 * Encode bridge transaction with vault deposit
 * Returns transaction for user to sign on origin chain
 *
 * @param params - Bridge deposit parameters
 * @returns Transaction ready to be signed
 *
 * @example
 * ```ts
 * const tx = await encodeBridgeWithVaultDeposit({
 *   depositor: '0x...',
 *   vaultAddress: '0x...',
 *   destinationSafeAddress: '0x...',
 *   amount: '100000000',
 *   sourceChainId: SUPPORTED_CHAINS.BASE,
 *   destChainId: SUPPORTED_CHAINS.ARBITRUM,
 * });
 *
 * // User signs and sends transaction
 * const hash = await walletClient.sendTransaction(tx);
 * ```
 */
/**
 * Encode cross-chain actions into Across message format
 * The message is executed by the MulticallHandler on the destination chain
 */
function encodeCrossChainMessage(actions: CrossChainAction[]): Hex {
  // Encode actions array for MulticallHandler
  // Format: abi.encode(Action[]) where Action = (target, callData, value)
  const encoded = encodeAbiParameters(
    [
      {
        type: 'tuple[]',
        components: [
          { name: 'target', type: 'address' },
          { name: 'callData', type: 'bytes' },
          { name: 'value', type: 'uint256' },
        ],
      },
    ],
    [
      actions.map((action) => ({
        target: action.target,
        callData: action.callData,
        value: action.value,
      })),
    ],
  );

  return encoded;
}

/**
 * Encode simple bridge transfer (no multicall)
 *
 * @param params - Bridge deposit parameters
 * @returns Array of Transactions ready to be signed (Approve + Deposit)
 */
export async function encodeBridgeTransfer(
  params: BridgeDepositParams,
): Promise<BridgeTransaction[]> {
  const {
    depositor,
    destinationSafeAddress,
    amount,
    sourceChainId,
    destChainId,
  } = params;

  // Get quote
  const quote = await getAcrossBridgeQuote({
    amount: BigInt(amount),
    originChainId: sourceChainId,
    destinationChainId: destChainId,
  });

  // Get USDC addresses
  const sourceUSDC = getUSDCAddress(sourceChainId);
  const destUSDC = getUSDCAddress(destChainId);

  // Get SpokePool address for source chain
  const spokePoolAddress = SPOKE_POOL_ADDRESSES[sourceChainId];

  // 1. Construct Approve Transaction
  const approveData = encodeFunctionData({
    abi: ERC20_APPROVE_ABI,
    functionName: 'approve',
    args: [spokePoolAddress, BigInt(amount)],
  });

  const approveTx: BridgeTransaction = {
    to: sourceUSDC,
    data: approveData,
    value: 0n,
    chainId: sourceChainId,
  };

  // Get deposit parameters from the raw quote
  const rawQuote = quote.rawQuote;
  const deposit = rawQuote.deposit;

  // 2. Construct Deposit Transaction
  // Encode depositV3 call with EMPTY message and recipient = destinationSafeAddress
  // This will just transfer funds to the destination Safe
  const depositData = encodeFunctionData({
    abi: spokePoolDepositV3Abi,
    functionName: 'depositV3',
    args: [
      depositor,
      destinationSafeAddress, // Recipient is the Safe directly
      sourceUSDC,
      destUSDC,
      BigInt(amount),
      quote.outputAmount,
      BigInt(destChainId),
      deposit.exclusiveRelayer as Address,
      deposit.quoteTimestamp,
      deposit.fillDeadline,
      deposit.exclusivityDeadline,
      '0x', // Empty message for simple transfer
    ],
  });

  const depositTx: BridgeTransaction = {
    to: spokePoolAddress,
    data: depositData,
    value: 0n,
    chainId: sourceChainId,
  };

  // Return batch: [Approve, Deposit]
  return [approveTx, depositTx];
}

export async function encodeBridgeWithVaultDeposit(
  params: BridgeDepositParams,
): Promise<BridgeTransaction[]> {
  const {
    depositor,
    vaultAddress,
    destinationSafeAddress,
    amount,
    sourceChainId,
    destChainId,
  } = params;

  // Validate vault address is present for vault deposit flow
  if (!vaultAddress) {
    throw new Error('Vault address is required for vault deposit flow');
  }

  // Get quote with cross-chain actions
  const quote = await getAcrossBridgeQuote({
    amount: BigInt(amount),
    originChainId: sourceChainId,
    destinationChainId: destChainId,
  });

  // Get USDC addresses
  const sourceUSDC = getUSDCAddress(sourceChainId);
  const destUSDC = getUSDCAddress(destChainId);

  // Get SpokePool address for source chain
  const spokePoolAddress = SPOKE_POOL_ADDRESSES[sourceChainId];

  // 1. Construct Approve Transaction
  const approveData = encodeFunctionData({
    abi: ERC20_APPROVE_ABI,
    functionName: 'approve',
    args: [spokePoolAddress, BigInt(amount)],
  });

  const approveTx: BridgeTransaction = {
    to: sourceUSDC,
    data: approveData,
    value: 0n,
    chainId: sourceChainId,
  };

  // Get MulticallHandler for destination chain
  const destChainConfig = getChainConfig(destChainId);
  const multicallHandler = destChainConfig.acrossMulticallHandler;

  if (!multicallHandler) {
    throw new Error(
      `No Across MulticallHandler configured for chain ${destChainId}`,
    );
  }

  // Encode cross-chain actions: approve + vault deposit
  const actions = encodeVaultDepositMulticall({
    tokenAddress: destUSDC,
    vaultAddress,
    amount: quote.outputAmount, // Use output amount (after fees)
    recipient: destinationSafeAddress,
  });

  // Encode cross-chain message for MulticallHandler
  const message = encodeCrossChainMessage(actions);

  // Get deposit parameters from the raw quote
  const rawQuote = quote.rawQuote;
  const deposit = rawQuote.deposit;

  // 2. Construct Deposit Transaction
  const depositData = encodeFunctionData({
    abi: spokePoolDepositV3Abi,
    functionName: 'depositV3',
    args: [
      depositor,
      multicallHandler,
      sourceUSDC,
      destUSDC,
      BigInt(amount),
      quote.outputAmount,
      BigInt(destChainId),
      deposit.exclusiveRelayer as Address,
      deposit.quoteTimestamp,
      deposit.fillDeadline,
      deposit.exclusivityDeadline,
      message,
    ],
  });

  const depositTx: BridgeTransaction = {
    to: spokePoolAddress,
    data: depositData,
    value: 0n, // No ETH value for USDC bridge
    chainId: sourceChainId,
  };

  // Return batch: [Approve, Deposit]
  return [approveTx, depositTx];
}

/**
 * Bridge deposit status
 */
export type BridgeStatus = 'pending' | 'filled' | 'failed';

/**
 * Track bridge deposit and wait for fill
 * Uses exponential backoff for polling
 *
 * @param depositId - Deposit ID from bridge transaction
 * @param depositTxHash - Transaction hash of the deposit
 * @returns Bridge status
 *
 * @example
 * ```ts
 * const status = await trackBridgeDeposit(
 *   'deposit-id',
 *   '0x...'
 * );
 * if (status === 'filled') {
 *   console.log('Bridge complete!');
 * }
 * ```
 */
/**
 * Bridge deposit status response from Across API
 */
interface AcrossDepositStatus {
  status: 'pending' | 'filled';
  fillTxHash?: string;
  fillTimestamp?: number;
}

/**
 * Query Across API for deposit status
 */
async function queryAcrossDepositStatus(
  depositTxHash: string,
  originChainId: number,
): Promise<AcrossDepositStatus> {
  // Across provides a status API endpoint
  const apiUrl = `https://app.across.to/api/deposit/status?originChainId=${originChainId}&depositTxHash=${depositTxHash}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(
      `Across API error: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();

  // Map API response to our format
  if (data.fillTx || data.status === 'filled') {
    return {
      status: 'filled',
      fillTxHash: data.fillTx || data.fillTxHash,
      fillTimestamp: data.fillTimestamp,
    };
  }

  return {
    status: 'pending',
  };
}

export async function trackBridgeDeposit(
  depositTxHash: string,
  originChainId: SupportedChainId,
): Promise<BridgeStatus> {
  // Exponential backoff configuration
  const INITIAL_DELAY = 1000; // 1 second
  const MAX_DELAY = 30000; // 30 seconds
  const MAX_ATTEMPTS = 60; // Max 60 attempts (up to ~30 minutes)
  const BACKOFF_MULTIPLIER = 1.5;

  let delay = INITIAL_DELAY;
  let attempt = 0;

  while (attempt < MAX_ATTEMPTS) {
    try {
      // Query Across API for deposit status
      const status = await queryAcrossDepositStatus(
        depositTxHash,
        originChainId,
      );

      if (status.status === 'filled') {
        return 'filled';
      }

      // Still pending, wait and retry
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Increase delay for next attempt (exponential backoff)
      delay = Math.min(delay * BACKOFF_MULTIPLIER, MAX_DELAY);
      attempt++;
    } catch (error) {
      console.error(`Bridge tracking attempt ${attempt} failed:`, error);

      // If we get a 404 or network error, wait and retry
      if (attempt < MAX_ATTEMPTS - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * BACKOFF_MULTIPLIER, MAX_DELAY);
        attempt++;
        continue;
      }

      throw error;
    }
  }

  // Return pending if we hit max attempts (user can check later)
  return 'pending';
}

/**
 * Get estimated time to bridge completion
 *
 * @param quote - Bridge quote
 * @returns Estimated time in seconds
 */
export function getEstimatedBridgeTime(quote: BridgeQuote): number {
  return quote.estimatedFillTime;
}

/**
 * Calculate total cost including bridge fees
 *
 * @param amount - Input amount
 * @param quote - Bridge quote
 * @returns Total amount needed (input + fees)
 */
export function calculateTotalBridgeCost(
  amount: bigint,
  quote: BridgeQuote,
): bigint {
  return amount + quote.totalFee;
}
