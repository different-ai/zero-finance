import { useState } from 'react';
import { useWalletClient, usePublicClient } from 'wagmi';
import { parseUnits, encodeFunctionData, type Address, type Hash } from 'viem';
import { getSpokePool, getUSDCAddress, ACROSS_FEE_PERCENT } from '@/lib/constants/across';

export type AcrossBridgeParams = {
  amount: string; // Amount in USDC (e.g., "1000")
  fromChain: number; // Source chain ID (e.g., 8453 for Base)
  toChain: number; // Destination chain ID (e.g., 42161 for Arbitrum)
  recipient: Address; // Recipient address on destination chain
};

export type AcrossBridgeResult = {
  approvalTxHash?: Hash;
  depositTxHash: Hash;
  estimatedFillTime: number; // seconds
  estimatedFee: number; // USDC amount
};

/**
 * Hook to bridge USDC across chains using Across Protocol
 * 
 * Usage:
 * const { bridge, isLoading, error } = useAcrossBridge()
 * await bridge({ amount: "1000", fromChain: 8453, toChain: 42161, recipient: "0x..." })
 */
export function useAcrossBridge() {
  const walletClient = useWalletClient();
  const publicClient = usePublicClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const bridge = async (params: AcrossBridgeParams): Promise<AcrossBridgeResult> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!walletClient.data) {
        throw new Error('Wallet not connected');
      }

      const amountWei = parseUnits(params.amount, 6); // USDC has 6 decimals
      const spokePoolAddress = getSpokePool(params.fromChain);
      const inputToken = getUSDCAddress(params.fromChain);
      const outputToken = getUSDCAddress(params.toChain);

      if (!spokePoolAddress || !inputToken || !outputToken) {
        throw new Error('Unsupported chain');
      }

      // Calculate fee (0.5% of amount)
      const estimatedFee = Number(params.amount) * ACROSS_FEE_PERCENT;
      const outputAmount = amountWei - parseUnits(estimatedFee.toFixed(6), 6);

      let approvalTxHash: Hash | undefined;

      // Step 1: Check allowance and approve if needed
      const allowance = await publicClient?.readContract({
        address: inputToken,
        abi: [
          {
            name: 'allowance',
            type: 'function',
            stateMutability: 'view',
            inputs: [
              { name: 'owner', type: 'address' },
              { name: 'spender', type: 'address' },
            ],
            outputs: [{ name: '', type: 'uint256' }],
          },
        ],
        functionName: 'allowance',
        args: [walletClient.data.account.address, spokePoolAddress],
      });

      if (!allowance || allowance < amountWei) {
        const approveData = encodeFunctionData({
          abi: [
            {
              name: 'approve',
              type: 'function',
              inputs: [
                { name: 'spender', type: 'address' },
                { name: 'amount', type: 'uint256' },
              ],
            },
          ],
          functionName: 'approve',
          args: [spokePoolAddress, amountWei],
        });

        approvalTxHash = await walletClient.data.sendTransaction({
          to: inputToken,
          data: approveData,
          chain: walletClient.data.chain,
        });

        // Wait for approval
        await publicClient?.waitForTransactionReceipt({ hash: approvalTxHash });
      }

      // Step 2: Deposit to Across
      const now = Math.floor(Date.now() / 1000);
      const depositData = encodeFunctionData({
        abi: [
          {
            name: 'depositV3',
            type: 'function',
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
          },
        ],
        functionName: 'depositV3',
        args: [
          walletClient.data.account.address, // depositor
          params.recipient, // recipient
          inputToken,
          outputToken,
          amountWei,
          outputAmount,
          BigInt(params.toChain),
          '0x0000000000000000000000000000000000000000' as Address, // no exclusive relayer
          now - 60, // quoteTimestamp (1 min ago)
          now + 1800, // fillDeadline (30 min)
          0, // exclusivityDeadline (no exclusivity)
          '0x', // no message
        ],
      });

      const depositTxHash = await walletClient.data.sendTransaction({
        to: spokePoolAddress,
        data: depositData,
        chain: walletClient.data.chain,
      });

      setIsLoading(false);

      return {
        approvalTxHash,
        depositTxHash,
        estimatedFillTime: 20, // ~20 seconds
        estimatedFee,
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      setIsLoading(false);
      throw error;
    }
  };

  return {
    bridge,
    isLoading,
    error,
  };
}
