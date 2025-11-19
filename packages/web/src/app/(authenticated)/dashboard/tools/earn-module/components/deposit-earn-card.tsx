import { useState, useEffect } from 'react';
import {
  Loader2,
  AlertCircle,
  ArrowDownToLine,
  CheckCircle,
  ExternalLink,
  Clock,
  ArrowRight,
  ArrowDown,
} from 'lucide-react';
import { trpc } from '@/utils/trpc';
import type { Address, Hex } from 'viem';
import {
  formatUnits,
  parseUnits,
  encodeFunctionData,
  parseAbi,
  createPublicClient,
  http,
  erc20Abi,
} from 'viem';
import { base, arbitrum } from 'viem/chains';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { USDC_ADDRESS, USDC_DECIMALS } from '@/lib/constants';
import {
  SUPPORTED_CHAINS,
  type SupportedChainId,
} from '@/lib/constants/chains';
import Safe, {
  SafeAccountConfig,
  SafeDeploymentConfig,
} from '@safe-global/protocol-kit';
import { cn } from '@/lib/utils';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { buildSafeTx, relaySafeTx } from '@/lib/sponsor-tx/core';

// Bridge quote type (matches tRPC response)
interface BridgeQuote {
  inputAmount: string;
  outputAmount: string;
  bridgeFee: string;
  lpFee: string;
  relayerGasFee: string;
  totalFee: string;
  estimatedFillTime: number;
}

interface DepositEarnCardProps {
  safeAddress: Address;
  vaultAddress: Address;
  onDepositSuccess?: () => void;
  chainId?: SupportedChainId; // Target chain for the vault
}

// ERC4626 Vault ABI for deposits
const VAULT_ABI = parseAbi([
  'function deposit(uint256 assets, address receiver) public returns (uint256 shares)',
  'function previewDeposit(uint256 assets) public view returns (uint256 shares)',
  'function maxDeposit(address receiver) public view returns (uint256)',
  'function asset() public view returns (address)',
  'function allowance(address owner, address spender) public view returns (uint256)',
]);

type TransactionStep =
  | 'idle'
  | 'checking'
  | 'approving'
  | 'waiting-approval'
  | 'depositing'
  | 'waiting-deposit'
  | 'bridging'
  | 'waiting-bridge'
  | 'needs-deployment'
  | 'deploying-safe'
  | 'waiting-deployment'
  | 'success'
  | 'error';

interface DeploymentInfo {
  chainId: number;
  transaction: {
    to: string;
    data: string;
    value: string;
    chainId: number;
  };
  predictedAddress: string;
}

interface TransactionState {
  step: TransactionStep;
  txHash?: string;
  errorMessage?: string;
  depositedAmount?: string;
  bridgeQuote?: BridgeQuote;
  deploymentInfo?: DeploymentInfo;
}

export function DepositEarnCard({
  safeAddress,
  vaultAddress,
  onDepositSuccess,
  chainId = SUPPORTED_CHAINS.BASE, // Default to Base
}: DepositEarnCardProps) {
  const { wallets } = useWallets();
  const [amount, setAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState(''); // Separate state for deposit on target chain
  const [transactionState, setTransactionState] = useState<TransactionState>({
    step: 'idle',
  });
  const [bridgeQuote, setBridgeQuote] = useState<BridgeQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  // Determine if this is a cross-chain deposit (vault on different chain than user's Safe on Base)
  const isCrossChain = chainId !== SUPPORTED_CHAINS.BASE;

  const { ready: isRelayReady, send: sendTxViaRelay } =
    useSafeRelay(safeAddress);
  const { client: smartWalletClient, getClientForChain } = useSmartWallets();
  const publicClient = createPublicClient({
    chain: base,
    transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
  });

  // Reset state when vault changes
  useEffect(() => {
    console.log('[DepositEarnCard] Vault address changed to:', vaultAddress);
    setAmount('');
    setDepositAmount('');
    setTransactionState({ step: 'idle' });
  }, [vaultAddress]);

  // Fetch USDC balance
  const [usdcBalance, setUsdcBalance] = useState<bigint>(0n);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  const fetchBalance = async () => {
    if (!safeAddress) return;

    try {
      // Only show loading on first load, not on refetches
      if (!hasInitialLoad) {
        setIsLoadingBalance(true);
      }
      const balance = await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [safeAddress],
      });
      setUsdcBalance(balance);
      setHasInitialLoad(true);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setUsdcBalance(0n);
      setHasInitialLoad(true);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Fetch balance on mount and after transactions
  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 30000); // Poll every 30 seconds instead of 10
    return () => {
      clearInterval(interval);
    };
  }, [safeAddress]);

  // tRPC utils for refetching
  const trpcUtils = trpc.useUtils();

  // tRPC mutation for encoding bridge transaction
  const bridgeDepositMutation =
    trpc.earn.depositToVaultWithBridge.useMutation();

  // tRPC mutation for updating bridge status
  const updateBridgeStatusMutation =
    trpc.earn.updateBridgeDeposit.useMutation();

  // tRPC mutation for Safe deployment on new chain
  const safeDeploymentMutation = trpc.earn.getSafeDeploymentTx.useMutation();

  // tRPC mutation for registering a deployed Safe
  const registerSafeMutation = trpc.earn.registerDeployedSafe.useMutation();

  // tRPC mutation for bridging funds only
  const bridgeFundsMutation = trpc.earn.bridgeFunds.useMutation();

  // Fetch target safe balance for cross-chain vaults
  const { data: targetSafeBalanceData, refetch: refetchTargetBalance } =
    trpc.earn.getSafeBalanceOnChain.useQuery(
      {
        safeAddress: safeAddress, // This is actually the Base Safe address, we need the target Safe address. Wait, safeAddress prop is the current safe.
        // We need to fetch the target safe address first or assume it's the same if deployed with same nonce.
        // Actually, for balance check we need the target safe address.
        // The backend `getSafeOnChain` handles looking up the safe for the user on the target chain.
        // But the frontend only has `safeAddress` (Base Safe).
        // We should probably fetch the target safe address first.
        // However, `getMultiChainPositions` returns all safes.
        // Let's use a useEffect to find the target safe address from `multiChainData`.
        chainId: chainId,
      },
      {
        enabled: false, // We'll enable this manually once we have the target safe address
      },
    );
    
  // We need to get the target safe address to check its balance
  const { data: multiChainPositions, isLoading: isLoadingPositions } = trpc.earn.getMultiChainPositions.useQuery(
    undefined,
    { enabled: isCrossChain },
  );

  const targetSafeAddress = multiChainPositions?.safes.find(
    (s) => s.chainId === chainId,
  )?.address as Address | undefined;

  // Auto-trigger deployment check if cross-chain and no safe exists
  useEffect(() => {
    if (
      isCrossChain &&
      !isLoadingPositions &&
      !targetSafeAddress &&
      transactionState.step === 'idle'
    ) {
      console.log('[DepositEarnCard] No target Safe found, fetching deployment info...');
      setTransactionState({ step: 'checking' }); // Show loading state briefly
      
      safeDeploymentMutation
        .mutateAsync({
          targetChainId: chainId,
          safeType: 'primary',
        })
        .then((res) => {
          setTransactionState({
            step: 'needs-deployment',
            deploymentInfo: {
              chainId: chainId,
              transaction: {
                 to: res.to,
                 data: res.data,
                 value: res.value,
                 chainId: chainId
              },
              predictedAddress: res.predictedAddress,
            },
          });
        })
        .catch((err) => {
          console.error('Failed to fetch deployment info:', err);
          setTransactionState({ 
              step: 'error', 
              errorMessage: 'Failed to load account setup info. Please refresh.' 
          });
        });
    }
  }, [isCrossChain, isLoadingPositions, targetSafeAddress, chainId, transactionState.step]);

  // Force fetch of target balance when we have the address
  const [targetBalance, setTargetBalance] = useState<bigint>(0n);
  
  useEffect(() => {
    if (isCrossChain && targetSafeAddress) {
        trpcUtils.earn.getSafeBalanceOnChain.fetch({
             safeAddress: targetSafeAddress,
             chainId,
        }).then(res => {
            setTargetBalance(BigInt(res.balance));
        }).catch(console.error);
    }
  }, [isCrossChain, targetSafeAddress, chainId, trpcUtils]);

  // Poll target balance when bridging
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCrossChain && targetSafeAddress) {
      const checkBalance = async () => {
        const result = await trpcUtils.earn.getSafeBalanceOnChain.fetch({
          safeAddress: targetSafeAddress,
          chainId,
        });
        setTargetBalance(BigInt(result.balance));
        return result;
      };

      // Initial check
      checkBalance();
      
      // Regular poll every 10s
      interval = setInterval(checkBalance, 10000);

      // Poll if we are waiting for bridge
      if (transactionState.step === 'waiting-bridge' || transactionState.step === 'bridging') {
         // The interval above covers this
         // But we can add logic to auto-complete bridge step
      }
    }
    return () => clearInterval(interval);
  }, [isCrossChain, targetSafeAddress, chainId, transactionState.step, trpcUtils]);


  // Fetch bridge quote for cross-chain deposits (funding flow)
  useEffect(() => {
    if (!isCrossChain || !amount || parseFloat(amount) <= 0) {
      setBridgeQuote(null);
      return;
    }

    const fetchQuote = async () => {
      setIsLoadingQuote(true);
      try {
        const amountInSmallestUnit = parseUnits(amount, USDC_DECIMALS);
        const quote = await trpcUtils.earn.getBridgeQuote.fetch({
            amount: amountInSmallestUnit.toString(),
            sourceChainId: SUPPORTED_CHAINS.BASE,
            destChainId: chainId,
            vaultAddress,
        });
        setBridgeQuote(quote);
      } catch (error) {
        console.error('Failed to fetch bridge quote:', error);
        setBridgeQuote(null);
      } finally {
        setIsLoadingQuote(false);
      }
    };

    // Debounce quote fetching
    const timeoutId = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timeoutId);
  }, [amount, isCrossChain, chainId, vaultAddress, trpcUtils]);

  // Check current allowance
  const {
    data: allowanceData,
    refetch: refetchAllowance,
    isLoading: isLoadingAllowance,
  } = trpc.earn.checkAllowance.useQuery(
    {
      tokenAddress: USDC_ADDRESS,
      ownerAddress: safeAddress,
      spenderAddress: vaultAddress,
    },
    {
      enabled: !!safeAddress && !!vaultAddress && !isCrossChain, // Only check allowance on Base for same-chain
      refetchInterval: 30000, // Reduced from 10s to 30s
      staleTime: 20000, // Consider data fresh for 20s
    },
  );

  // Handle "Bridge Funds" Action
  const handleBridgeOnly = async () => {
      if (!amount || !isRelayReady) return;
      const amountInSmallestUnit = parseUnits(amount, USDC_DECIMALS);
      await handleBridgeFunds(amountInSmallestUnit);
  }
  
  // Handle "Deposit" Action (Target Chain)
  const handleDepositOnly = async () => {
      if (!depositAmount || !targetSafeAddress) return;
      const amountInSmallestUnit = parseUnits(depositAmount, USDC_DECIMALS);
      await handleTargetChainDeposit(amountInSmallestUnit, targetSafeAddress);
  }

  // Single flow deposit handler (Same Chain)
  const handleSameChainDeposit = async () => {
    if (!amount || !isRelayReady) return;

    const amountInSmallestUnit = parseUnits(amount, USDC_DECIMALS);
    const currentAllowance = allowanceData
      ? BigInt(allowanceData.allowance)
      : 0n;
    const needsApproval = amountInSmallestUnit > currentAllowance;

    console.log('[DepositEarnCard] Starting deposit flow:', {
      vault: vaultAddress,
      amount: amount,
      amountInSmallestUnit: amountInSmallestUnit.toString(),
      currentAllowance: currentAllowance.toString(),
      needsApproval,
      isRelayReady,
      isCrossChain,
      targetChainId: chainId,
    });

    try {
      // Step 1: Check requirements
      setTransactionState({ step: 'checking' });

      // Check balance
      if (amountInSmallestUnit > usdcBalance) {
        throw new Error(
          `Insufficient balance. You have ${formatUnits(usdcBalance, USDC_DECIMALS)} USDC`,
        );
      }

      // Step 2: Approve if needed
      if (needsApproval) {
        setTransactionState((prev) => ({ ...prev, step: 'approving' }));

        console.log(
          'Approving',
          formatUnits(amountInSmallestUnit, USDC_DECIMALS),
          'USDC for vault:',
          vaultAddress,
        );

        const approveData = encodeFunctionData({
          abi: erc20Abi,
          functionName: 'approve',
          args: [vaultAddress, amountInSmallestUnit],
        });

        const approvalTxHash = await sendTxViaRelay(
          [
            {
              to: USDC_ADDRESS,
              value: '0',
              data: approveData,
            },
          ],
          300_000n,
        );

        if (!approvalTxHash) throw new Error('Approval transaction failed');

        setTransactionState({
          step: 'waiting-approval',
          txHash: approvalTxHash,
        });

        // Wait for approval to be mined and verify it succeeded
        await new Promise((resolve) => setTimeout(resolve, 7000));
        await refetchAllowance();

        // Verify the approval was successful
        const newAllowance = await publicClient.readContract({
          address: USDC_ADDRESS,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [safeAddress, vaultAddress],
        });

        console.log('New allowance after approval:', newAllowance.toString());

        if (newAllowance < amountInSmallestUnit) {
          throw new Error(
            'Approval transaction succeeded but allowance was not updated correctly',
          );
        }
      }

      // Step 3: Execute deposit
      setTransactionState((prev) => ({ ...prev, step: 'depositing' }));

      // Verify vault asset
      const vaultAsset = await publicClient.readContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: 'asset',
        args: [],
      });

      if (vaultAsset.toLowerCase() !== USDC_ADDRESS.toLowerCase()) {
        throw new Error('Invalid vault asset configuration');
      }

      // Check max deposit limit
      const maxDepositLimit = await publicClient.readContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: 'maxDeposit',
        args: [safeAddress],
      });

      console.log('Max deposit limit:', maxDepositLimit.toString());
      console.log('Attempting to deposit:', amountInSmallestUnit.toString());

      if (amountInSmallestUnit > maxDepositLimit) {
        throw new Error(
          `Deposit amount exceeds vault limit. Maximum allowed: ${formatUnits(maxDepositLimit, USDC_DECIMALS)} USDC`,
        );
      }

      // Preview deposit
      let expectedShares: bigint;
      try {
        expectedShares = await publicClient.readContract({
          address: vaultAddress,
          abi: VAULT_ABI,
          functionName: 'previewDeposit',
          args: [amountInSmallestUnit],
        });
        console.log('Expected shares:', expectedShares.toString());
      } catch (previewError) {
        console.error('Preview deposit failed:', previewError);
        throw new Error(
          'Unable to preview deposit. The vault may be paused or have reached its capacity.',
        );
      }

      // Encode deposit
      const depositData = encodeFunctionData({
        abi: VAULT_ABI,
        functionName: 'deposit',
        args: [amountInSmallestUnit, safeAddress],
      });

      // Use higher gas limit for Gauntlet vault (it might have more complex logic)
      const isGauntletVault =
        vaultAddress.toLowerCase() ===
        '0x236919f11ff9ea9550a4287696c2fc9e18e6e890';
      const gasLimit = isGauntletVault ? 750_000n : 500_000n;

      console.log(
        'Using gas limit:',
        gasLimit.toString(),
        'for vault:',
        vaultAddress,
      );

      const depositTxHash = await sendTxViaRelay(
        [
          {
            to: vaultAddress,
            value: '0',
            data: depositData,
          },
        ],
        gasLimit,
      );

      if (!depositTxHash) throw new Error('Deposit transaction failed');

      setTransactionState({
        step: 'waiting-deposit',
        txHash: depositTxHash,
      });

      // Wait for deposit to be mined
      await new Promise((resolve) => setTimeout(resolve, 7000));

      // Success!
      setTransactionState({
        step: 'success',
        txHash: depositTxHash,
        depositedAmount: amount,
      });

      // Reset form and refetch data
      setAmount('');
      await fetchBalance();
      await refetchAllowance();

      if (onDepositSuccess) {
        onDepositSuccess();
      }
    } catch (error) {
      console.error('[DepositEarnCard] Transaction error:', error);
      console.error('[DepositEarnCard] Error details:', {
        vault: vaultAddress,
        amount: amount,
        step: transactionState.step,
        errorType: error?.constructor?.name,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      });

      // Provide more specific error messages
      let errorMessage = 'Transaction failed';
      if (error instanceof Error) {
        if (
          error.message.includes('insufficient funds') ||
          error.message.includes('Insufficient')
        ) {
          errorMessage = error.message;
        } else if (
          error.message.includes('User denied') ||
          error.message.includes('rejected')
        ) {
          errorMessage = 'Transaction was cancelled';
        } else if (error.message.includes('gas')) {
          errorMessage =
            'Transaction ran out of gas. Please try again with a smaller amount.';
        } else if (
          error.message.includes('vault limit') ||
          error.message.includes('capacity')
        ) {
          errorMessage = error.message;
        } else if (error.message.includes('allowance')) {
          errorMessage = 'Token approval failed. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }

      setTransactionState((prev) => ({
        ...prev,
        step: 'error',
        errorMessage,
      }));
    }
  };

  // Handle "Bridge Funds" Step
  const handleBridgeFunds = async (amountInSmallestUnit: bigint) => {
    try {
      setTransactionState({
        step: 'bridging',
        bridgeQuote: bridgeQuote ?? undefined,
      });

      const bridgeResult = await bridgeFundsMutation.mutateAsync({
        amount: amountInSmallestUnit.toString(),
        sourceChainId: SUPPORTED_CHAINS.BASE,
        destChainId: chainId,
      });

       if (bridgeResult.needsDeployment) {
         // This should be handled by the deployment UI state, but just in case
         const deploymentResult = bridgeResult as any;
          setTransactionState({
          step: 'needs-deployment',
          deploymentInfo: {
            chainId: deploymentResult.destinationChainId,
            transaction: deploymentResult.deploymentTransaction,
            predictedAddress: deploymentResult.predictedSafeAddress,
          },
        });
        return;
       }

      const {
        bridgeTransactionId,
        transaction: bridgeTx,
      } = bridgeResult as any;

      // Execute bridge transaction on Base (Source)
      const bridgeTxHash = await sendTxViaRelay(
        [
          {
            to: bridgeTx.to as Address,
            value: bridgeTx.value,
            data: bridgeTx.data as `0x${string}`,
          },
        ],
        500_000n,
      );

      if (!bridgeTxHash) throw new Error('Bridge transaction failed');

      await updateBridgeStatusMutation.mutateAsync({
        bridgeTransactionId,
        depositTxHash: bridgeTxHash,
      });

      setTransactionState({
        step: 'waiting-bridge',
        txHash: bridgeTxHash,
      });

      // Wait for bridge to initiate (mined on Base)
      await new Promise((resolve) => setTimeout(resolve, 7000));
      
      // Now we wait for funds to arrive on destination (Polling in useEffect will handle UI update)
      // User stays on "waiting-bridge" until balance increases
      setTransactionState({ step: 'idle' }); // Reset to idle so they can see the updated balance
      setAmount('');

    } catch (error) {
      console.error('[DepositEarnCard] Bridge error:', error);
      let errorMessage = 'Bridge transaction failed';
      if (error instanceof Error) errorMessage = error.message;
      setTransactionState({ step: 'error', errorMessage });
    }
  };

  const { user } = usePrivy();

  // Handle "Deposit on Target Chain" Step
  const handleTargetChainDeposit = async (
    amountInSmallestUnit: bigint,
    targetSafe: Address,
  ) => {
    try {
      setTransactionState({ step: 'checking' });

      // 1. Get Client for Target Chain (Smart Wallet Client - used as Relayer)
      const targetClient = await getClientForChain({ id: chainId });
      if (!targetClient || !targetClient.account)
        throw new Error(`Could not get client for chain ${chainId}`);

      const smartWalletAddress = targetClient.account.address;

      // 2. Get Public Client for Target Chain
      const rpcUrl =
        chainId === 42161
          ? process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL
          : process.env.NEXT_PUBLIC_BASE_RPC_URL;
      const targetPublicClient = createPublicClient({
        chain: chainId === 42161 ? arbitrum : base,
        transport: http(rpcUrl),
      });

      // 3. Check Allowance on Target Chain
      const targetUSDC =
        chainId === 42161
          ? '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' // Arb USDC
          : USDC_ADDRESS;

      const allowance = await targetPublicClient.readContract({
        address: targetUSDC as Address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [targetSafe, vaultAddress],
      });

      // 4. Determine Signer (Owner of the Safe)
      const owners = await targetPublicClient.readContract({
        address: targetSafe,
        abi: parseAbi(['function getOwners() view returns (address[])']),
        functionName: 'getOwners',
      });

      const isSmartWalletOwner = owners.some(
        (owner) =>
          owner.toLowerCase() === smartWalletAddress.toLowerCase(),
      );
      const isEoaOwner =
        user?.wallet?.address &&
        owners.some(
          (owner) =>
            owner.toLowerCase() === user.wallet!.address.toLowerCase(),
        );

      let signerAddress: Address;

      if (isSmartWalletOwner) {
        console.log('Target Safe is owned by Smart Wallet');
        signerAddress = smartWalletAddress;
      } else if (isEoaOwner) {
        console.log('Target Safe is owned by EOA');
        signerAddress = user!.wallet!.address as Address;
      } else {
        // Fallback or Error
        console.warn(
          'Neither Smart Wallet nor current EOA is an owner. Using first owner.',
        );
        signerAddress = owners[0];
      }

      // 5. Build Batch Transaction (Approve + Deposit)
      const txs = [];

      if (allowance < amountInSmallestUnit) {
        console.log(`Adding approval for chain ${chainId}...`);
        const approveData = encodeFunctionData({
          abi: erc20Abi,
          functionName: 'approve',
          args: [vaultAddress, amountInSmallestUnit],
        });

        txs.push({
          to: targetUSDC as Address,
          value: '0',
          data: approveData,
        });
      }

      console.log(`Adding deposit for chain ${chainId}...`);
      const depositData = encodeFunctionData({
        abi: VAULT_ABI,
        functionName: 'deposit',
        args: [amountInSmallestUnit, targetSafe],
      });

      txs.push({
        to: vaultAddress,
        value: '0',
        data: depositData,
      });

      setTransactionState({ step: 'depositing' });
      console.log('Building Safe batch transaction for target chain...', txs);

      // Build the Safe transaction
      const safeTx = await buildSafeTx(txs, {
        safeAddress: targetSafe,
        gas: 500_000n, // Safe gas limit
        chainId, // Pass chainId for correct context
      });

      // Relay the transaction
      // If signer is EOA, relaySafeTx handles EIP-712 signing via Privy embedded wallet (if available in context? No, we might need to pass signer)
      // relaySafeTx logic needs verification: it uses `smartClient.sendTransaction`.
      // If signer != smartClient.address, it needs a signature.
      // `relaySafeTx` in `core.ts` takes `signerAddress`.
      // But how does it get the signature?
      // It calls `safeTx.addSignature`. But wait, `buildPrevalidatedSig` is only for `msg.sender == owner`.
      // If EOA is owner, we need `signTypedData`.
      // `relaySafeTx` implementation in `core.ts` assumes `skipPreSig` or manual addition?
      // Let's check `core.ts` implementation details I just committed.
      // It has `if (!opts.skipPreSig) { buildPrevalidatedSig... }`.
      // This ONLY works for Smart Wallet owner (where msg.sender is owner).
      // For EOA owner, we need to sign!

      // We need to sign the transaction hash if EOA is owner.
      if (isEoaOwner) {
        console.log('Signing with EOA...');
        const safeTxHash = await safeTx.getTransactionHash();
        const userAddress = user!.wallet!.address;

        const wallet = wallets.find(
          (w) => w.address.toLowerCase() === userAddress.toLowerCase(),
        );

        if (!wallet) {
          throw new Error('Connected wallet not found for signing');
        }

        // Sign the Safe transaction hash
        // Note: This uses eth_sign (or personal_sign) which produces a valid signature for Safe
        // Safe accepts EIP-191 signatures of the tx hash
        const signature = await wallet.sign(safeTxHash);

        // Add the signature to the Safe transaction object
        // Safe SDK expects the signature to be added before execution
        safeTx.addSignature({
          signer: userAddress as Address,
          data: signature as Hex,
          staticPart: () => signature as Hex,
          dynamicPart: () => '',
        } as any); // Cast to any because Safe SDK types can be strict about signature implementation
      }

      const depositUserOpHash = await relaySafeTx(
        safeTx,
        signerAddress,
        targetClient,
        targetSafe,
        undefined, // chain object
        undefined, // providerUrl
        { skipPreSig: isEoaOwner }, // Skip pre-validated sig if EOA, as we added a real signature above
      );

      console.log('Target chain deposit UserOp:', depositUserOpHash);

      setTransactionState({
        step: 'waiting-deposit',
        txHash: depositUserOpHash,
      });

      // Wait for deposit
      await new Promise((r) => setTimeout(r, 7000));

      setTransactionState({
        step: 'success',
        txHash: depositUserOpHash,
        depositedAmount: depositAmount,
      });

      setDepositAmount('');
      if (onDepositSuccess) onDepositSuccess();
    } catch (error) {
      console.error('[DepositEarnCard] Target deposit error:', error);
      let errorMessage = 'Deposit failed on destination chain';
      if (error instanceof Error) errorMessage = error.message;
      setTransactionState({ step: 'error', errorMessage });
    }
  };
  const handleMax = () => {
      const maxAmount = formatUnits(usdcBalance, USDC_DECIMALS);
      setAmount(maxAmount);
  };
  
  const handleMaxDeposit = () => {
      const maxAmount = formatUnits(targetBalance, USDC_DECIMALS);
      setDepositAmount(maxAmount);
  };

  const resetTransaction = () => {
    setTransactionState({ step: 'idle' });
  };

  // Only show loading skeleton on very first load, never on data refetches
  const showSkeleton = isLoadingBalance && !hasInitialLoad;

  const currentAllowance = allowanceData ? BigInt(allowanceData.allowance) : 0n;
  const availableBalance = formatUnits(usdcBalance, USDC_DECIMALS);
  const displayBalance = parseFloat(availableBalance).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    },
  );
  
  const availableTargetBalance = formatUnits(targetBalance, USDC_DECIMALS);
  const displayTargetBalance = parseFloat(availableTargetBalance).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    },
  );

  // Show skeleton only on initial load, not on data updates
  if (showSkeleton) {
    return (
      <div className="space-y-4">
        <div className="h-20 w-full bg-[#101010]/5 animate-pulse" />
        <div className="h-12 w-full bg-[#101010]/5 animate-pulse" />
        <div className="h-12 w-full bg-[#101010]/5 animate-pulse" />
      </div>
    );
  }

  // Check if we need approval (Component Scope)
  const amountInSmallestUnit = amount ? parseUnits(amount, USDC_DECIMALS) : 0n;
  const needsApproval = amountInSmallestUnit > currentAllowance;

  // Calculate progress
  const getProgress = () => {
    switch (transactionState.step) {
      case 'checking':
        return 10;
      case 'approving':
        return 25;
      case 'waiting-approval':
        return 40;
      case 'bridging':
        return 50;
      case 'depositing':
        return 60;
      case 'waiting-deposit':
        return 80;
      case 'waiting-bridge':
        return 90;
      case 'success':
        return 100;
      default:
        return 0;
    }
  };

  // Needs deployment state - show UI to deploy Safe on destination chain
  if (
    transactionState.step === 'needs-deployment' &&
    transactionState.deploymentInfo
  ) {
    const { deploymentInfo } = transactionState;
    const chainName =
      deploymentInfo.chainId === 42161
        ? 'Arbitrum'
        : `Chain ${deploymentInfo.chainId}`;

    const handleDeploySafe = async () => {
      try {
        setTransactionState({ step: 'deploying-safe' });

        console.log('Deploying Safe on Arbitrum. Chain object:', arbitrum);
        
        // Get the smart wallet client for Arbitrum
        // Use hardcoded ID 42161 to prevent "reading 'id' of undefined" error if arbitrum import fails
        const arbClient = await getClientForChain({ id: 42161 });
        if (!arbClient) {
          throw new Error('Failed to get Arbitrum client for Safe deployment');
        }

        const smartWalletAddress = arbClient.account?.address;
        if (!smartWalletAddress) {
          throw new Error('Smart wallet address not found');
        }

        console.log('[DepositEarnCard] Starting Arbitrum Safe deployment');
        console.log(
          '[DepositEarnCard] Smart wallet address:',
          smartWalletAddress,
        );

        // Create Safe configuration with the Privy wallet as owner
        const safeAccountConfig: SafeAccountConfig = {
          owners: [smartWalletAddress],
          threshold: 1,
        };

        // Use the Base Safe address as salt nonce for deterministic address matching
        const saltNonce = safeAddress.toLowerCase();
        const safeDeploymentConfig: SafeDeploymentConfig = {
          saltNonce,
          safeVersion: '1.4.1',
        };

        console.log('[DepositEarnCard] Safe config:', {
          safeAccountConfig,
          safeDeploymentConfig,
        });

        // Initialize the Protocol Kit with Arbitrum RPC
        const arbitrumRpcUrl =
          process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL ||
          'https://arb1.arbitrum.io/rpc';

        const protocolKit = await Safe.init({
          predictedSafe: {
            safeAccountConfig,
            safeDeploymentConfig,
          },
          provider: arbitrumRpcUrl,
        });

        // Get the predicted Safe address
        const predictedSafeAddress =
          (await protocolKit.getAddress()) as Address;
        console.log(
          `[DepositEarnCard] Predicted Safe address on Arbitrum: ${predictedSafeAddress}`,
        );

        // Create the Safe deployment transaction
        const deploymentTransaction =
          await protocolKit.createSafeDeploymentTransaction();

        setTransactionState({ step: 'waiting-deployment' });

        // Send the deployment transaction on Arbitrum using Privy smart wallet
        console.log(
          '[DepositEarnCard] Sending deployment transaction on Arbitrum...',
        );

        if (!arbitrum) {
             throw new Error('Arbitrum chain definition is missing. Cannot proceed with deployment.');
        }

        const userOpHash = await arbClient.sendTransaction(
          {
            to: deploymentTransaction.to as Address,
            value: BigInt(deploymentTransaction.value || '0'),
            data: deploymentTransaction.data as `0x${string}`,
            chain: arbitrum,
          },
          {
            uiOptions: {
              showWalletUIs: false,
            },
          },
        );

        console.log(`[DepositEarnCard] UserOperation hash: ${userOpHash}`);

        // Wait for Safe deployment to be confirmed
        const arbPublicClient = createPublicClient({
          chain: arbitrum,
          transport: http(arbitrumRpcUrl),
        });

        // Poll for Safe bytecode on Arbitrum
        let retries = 30; // 2 minutes timeout
        while (retries > 0) {
          const code = await arbPublicClient.getBytecode({
            address: predictedSafeAddress,
          });
          if (code && code !== '0x') {
            console.log(
              '[DepositEarnCard] Safe deployed successfully on Arbitrum',
            );
            break;
          }
          await new Promise((r) => setTimeout(r, 4000));
          retries--;
        }

        if (retries === 0) {
          throw new Error(
            'Safe deployment timed out. Please check later and try again.',
          );
        }

        // Save the Safe to database via tRPC
        console.log('[DepositEarnCard] Saving Arbitrum Safe to database...');
        await registerSafeMutation.mutateAsync({
          safeAddress: predictedSafeAddress,
          chainId: deploymentInfo.chainId,
          safeType: 'primary',
        });

        // Reset to idle and let user retry the deposit
        setTransactionState({ step: 'idle' });

        // Show success message briefly then reset
        console.log(
          `[DepositEarnCard] Arbitrum Safe created at ${predictedSafeAddress}`,
        );
      } catch (error) {
        console.error('Safe deployment error:', error);
        setTransactionState({
          step: 'error',
          errorMessage:
            error instanceof Error ? error.message : 'Failed to deploy Safe',
        });
      }
    };

    return (
      <div className="space-y-4">
        <div className="bg-[#FFF7ED] border border-[#F59E0B]/20 p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-4 w-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
            <div className="space-y-3">
              <div className="text-[14px] font-medium text-[#101010]">
                {chainName} Account Setup Required
              </div>
              <p className="text-[12px] text-[#101010]/70 leading-relaxed">
                To deposit to {chainName} vaults, you need to set up your
                account on {chainName} first. This is a one-time setup that
                creates your secure savings account on the destination network.
              </p>
              <div className="text-[11px] text-[#101010]/50">
                Predicted address:{' '}
                <code className="font-mono">
                  {deploymentInfo.predictedAddress.slice(0, 10)}...
                  {deploymentInfo.predictedAddress.slice(-8)}
                </code>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleDeploySafe}
          className="w-full py-3 bg-[#1B29FF] text-white text-[14px] font-medium hover:bg-[#1420CC] transition-colors"
        >
          Set Up {chainName} Account
        </button>

        <button
          onClick={resetTransaction}
          className="w-full py-2 text-[12px] text-[#101010]/60 hover:text-[#101010] transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  // Deploying Safe state
  if (
    transactionState.step === 'deploying-safe' ||
    transactionState.step === 'waiting-deployment'
  ) {
    return (
      <div className="space-y-4">
        <div className="bg-white border border-[#101010]/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-[#101010]">
              Setting Up Account
            </span>
            <Loader2 className="h-4 w-4 animate-spin text-[#1B29FF]" />
          </div>

          <div className="relative h-2 bg-[#101010]/5 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-[#1B29FF] transition-all duration-500"
              style={{
                width:
                  transactionState.step === 'deploying-safe' ? '30%' : '70%',
              }}
            />
          </div>

          <div className="flex items-center gap-2 text-[12px] text-[#101010]/60">
            <Clock className="h-3 w-3" />
            {transactionState.step === 'deploying-safe'
              ? 'Deploying your Safe on destination chain...'
              : 'Waiting for deployment confirmation...'}
          </div>
        </div>
      </div>
    );
  }

  // Transaction in progress (Blocking View)
  // We exclude 'checking' from this view to avoid flashing a loading screen for quick checks
  if (
    transactionState.step !== 'idle' &&
    transactionState.step !== 'success' &&
    transactionState.step !== 'error' &&
    transactionState.step !== 'checking'
  ) {
    return (
      <div className="space-y-4">
        <div className="bg-white border border-[#101010]/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-[#101010]">
              Processing Transaction
            </span>
            <Loader2 className="h-4 w-4 animate-spin text-[#1B29FF]" />
          </div>

          <div className="relative h-2 bg-[#101010]/5 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-[#1B29FF] transition-all duration-500"
              style={{ width: `${getProgress()}%` }}
            />
          </div>

          <div className="space-y-2">
            {transactionState.step === 'checking' && (
              <div className="flex items-center gap-2 text-[12px] text-[#101010]/60">
                <Clock className="h-3 w-3" />
                Checking requirements...
              </div>
            )}

            {(transactionState.step === 'approving' ||
              transactionState.step === 'waiting-approval') && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[12px] text-[#101010]">
                  <div className="h-2 w-2 rounded-full bg-[#FFA500] animate-pulse" />
                  Step 1 of 2: Approving USDC
                </div>
                {transactionState.txHash && (
                  <a
                    href={`https://basescan.org/tx/${transactionState.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] text-[#1B29FF] hover:text-[#1420CC] transition-colors"
                  >
                    View on Explorer
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}

            {(transactionState.step === 'depositing' ||
              transactionState.step === 'waiting-deposit') && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[12px] text-[#101010]">
                  <div className="h-2 w-2 rounded-full bg-[#1B29FF] animate-pulse" />
                  {isCrossChain
                    ? 'Step 2 of 2: Depositing on Destination Chain'
                    : 'Step 2 of 2: Depositing USDC'}
                </div>
                {transactionState.txHash && (
                  <a
                    href={`https://basescan.org/tx/${transactionState.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] text-[#1B29FF] hover:text-[#1420CC] transition-colors"
                  >
                    View on Explorer
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}

            {(transactionState.step === 'bridging' ||
              transactionState.step === 'waiting-bridge') && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[12px] text-[#101010]">
                  <div className="h-2 w-2 rounded-full bg-[#28A0F0] animate-pulse" />
                  Transferring Funds
                </div>
                <div className="text-[11px] text-[#101010]/60">
                  Funds are being bridged via Across Protocol. This typically
                  takes 1-2 minutes.
                </div>
                {transactionState.txHash && (
                  <a
                    href={`https://basescan.org/tx/${transactionState.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] text-[#1B29FF] hover:text-[#1420CC] transition-colors"
                  >
                    View on BaseScan
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-[11px] text-[#101010]/50 text-center">
          Please wait while your transaction is being processed
        </p>
      </div>
    );
  }

  // Success state
  if (transactionState.step === 'success') {
    return (
      <div className="space-y-4">
        <div className="bg-[#F6F5EF] border border-[#10B981]/20 p-4">
          <div className="flex gap-3">
            <CheckCircle className="h-4 w-4 text-[#10B981] flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <div className="text-[14px] font-medium text-[#101010]">
                {isCrossChain && !depositAmount // If it was a bridge transaction
                  ? `Successfully deposited ${transactionState.depositedAmount} USDC`
                  : `Successfully deposited ${transactionState.depositedAmount} USDC`}
              </div>
              <div className="text-[12px] text-[#101010]/70">
                  Your funds are now earning yield in the vault.
              </div>
              {transactionState.txHash && (
                <a
                  href={`https://basescan.org/tx/${transactionState.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] text-[#1B29FF] hover:text-[#1420CC] transition-colors"
                >
                  View transaction
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={resetTransaction}
            className="flex-1 px-3 py-2 text-[13px] text-[#101010] bg-white border border-[#101010]/10 hover:bg-[#F7F7F2] transition-colors"
          >
            Deposit More
          </button>
          <button
            onClick={() => {
              resetTransaction();
              if (onDepositSuccess) onDepositSuccess();
            }}
            className="flex-1 px-3 py-2 text-[13px] text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // Error state
  if (transactionState.step === 'error') {
    return (
      <div className="space-y-4">
        <div className="bg-[#FFF8E6] border border-[#FFA500]/20 p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-4 w-4 text-[#FFA500] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-[14px] font-medium text-[#101010]">
                Transaction Failed
              </div>
              <div className="text-[12px] text-[#101010]/70">
                {transactionState.errorMessage}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={resetTransaction}
          className="w-full px-3 py-2 text-[13px] text-[#101010] bg-white border border-[#101010]/10 hover:bg-[#F7F7F2] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // --- CROSS-CHAIN LOADING / UNDETERMINED STATE ---
  // If we are cross-chain but don't have the target safe address yet,
  // and we are NOT in the "needs-deployment" flow (which handles its own UI),
  // show a skeleton to prevent flashing the default view.
  if (
    isCrossChain &&
    (!targetSafeAddress || isLoadingPositions) &&
    transactionState.step !== 'needs-deployment' &&
    transactionState.step !== 'deploying-safe' &&
    transactionState.step !== 'waiting-deployment'
  ) {
    return (
      <div className="space-y-4">
        <div className="h-20 w-full bg-[#101010]/5 animate-pulse" />
        <div className="h-12 w-full bg-[#101010]/5 animate-pulse" />
        <div className="h-12 w-full bg-[#101010]/5 animate-pulse" />
      </div>
    );
  }

  // --- CROSS-CHAIN SPLIT VIEW ---
  if (isCrossChain && targetSafeAddress) {
      const chainName = chainId === 42161 ? 'Arbitrum' : `Chain ${chainId}`;
      
      return (
          <div className="space-y-6">
             {/* TOP CARD: Target Chain Account (Investment) */}
             <div className="bg-white border border-[#101010]/10 p-5 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-1">
                            {chainName} Account Balance
                        </p>
                        <p className="text-[24px] font-medium tabular-nums text-[#101010]">
                            ${displayTargetBalance}
                        </p>
                    </div>
                </div>

                {/* Target Deposit Input & Button */}
                <div className="space-y-3">
                    <div className="relative">
                        <input
                            type="number"
                            placeholder="0.0"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            className="w-full h-12 px-4 bg-[#F7F7F2] border border-[#101010]/10 rounded-md focus:border-[#1B29FF] focus:outline-none text-[15px] transition-colors"
                            step="0.000001"
                            min="0"
                            max={availableTargetBalance}
                            disabled={targetBalance === 0n}
                        />
                         <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <span className="text-[12px] text-[#101010]/50">USDC</span>
                            <button
                                type="button"
                                onClick={handleMaxDeposit}
                                className="text-[11px] text-[#1B29FF] font-medium hover:text-[#1420CC] transition-colors"
                                disabled={targetBalance === 0n}
                            >
                                MAX
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={handleDepositOnly}
                        disabled={!depositAmount || parseFloat(depositAmount) <= 0 || targetBalance === 0n || transactionState.step === 'checking'}
                        className="w-full h-11 bg-[#1B29FF] hover:bg-[#1420CC] text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {transactionState.step === 'checking' ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <ArrowDownToLine className="h-4 w-4" />
                        )}
                        Deposit to Earn
                    </button>
                </div>
             </div>

            {/* BOTTOM CARD: Source Chain Account (Funding) */}
             <div className="bg-[#F7F7F2] border border-[#101010]/10 p-5 rounded-[12px]">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-[14px] font-medium text-[#101010]">
                           Add funds from Base
                        </h3>
                        <p className="text-[12px] text-[#101010]/60 mt-0.5">
                            Available: ${displayBalance}
                        </p>
                    </div>
                </div>
                
                {/* Bridge Input & Button */}
                <div className="flex gap-3">
                     <div className="relative flex-1">
                        <input
                            type="number"
                            placeholder="0.0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full h-10 px-3 bg-white border border-[#101010]/10 rounded-md focus:border-[#1B29FF] focus:outline-none text-[14px] transition-colors"
                            step="0.000001"
                             min="0"
                             max={availableBalance}
                        />
                         <button
                            type="button"
                            onClick={handleMax}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#1B29FF] hover:text-[#1420CC]"
                        >
                            MAX
                        </button>
                     </div>
                     <button
                        onClick={handleBridgeOnly}
                        disabled={!amount || parseFloat(amount) <= 0 || isLoadingQuote}
                        className="px-4 h-10 bg-white border border-[#101010]/20 hover:border-[#101010]/40 text-[#101010] text-[13px] font-medium rounded-md transition-colors flex items-center gap-2 whitespace-nowrap"
                     >
                        {isLoadingQuote ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowRight className="h-3 w-3" />}
                        Transfer
                     </button>
                </div>
                
                {/* Quote Info */}
                {bridgeQuote && amount && (
                    <div className="mt-3 p-2 bg-[#101010]/5 rounded text-[11px] text-[#101010]/70 flex justify-between">
                         <span>Fee: ${formatUnits(BigInt(bridgeQuote.totalFee), USDC_DECIMALS)}</span>
                         <span>Est. Time: {bridgeQuote.estimatedFillTime}s</span>
                    </div>
                )}
             </div>
          </div>
      );
  }

  // --- DEFAULT SAME-CHAIN VIEW ---
  return (
    <div className="space-y-4">
      {/* Current Balance */}
      <div className="bg-[#F7F7F2] border border-[#101010]/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-1">
              Available Balance
            </p>
            <p className="text-[24px] font-medium tabular-nums text-[#101010]">
              ${displayBalance}
            </p>
          </div>
          {currentAllowance > 0n && (
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-[#101010]/50">
                Pre-approved
              </p>
              <p className="text-[14px] font-medium tabular-nums text-[#10B981]">
                ${formatUnits(currentAllowance, USDC_DECIMALS)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <label
          htmlFor="deposit-amount"
          className="text-[12px] font-medium text-[#101010]"
        >
          Amount to Deposit
        </label>
        <div className="relative">
          <input
            id="deposit-amount"
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 pr-20 text-[14px] bg-white border border-[#101010]/10 focus:border-[#1B29FF] focus:outline-none transition-colors"
            step="0.000001"
            min="0"
            max={availableBalance}
            disabled={usdcBalance === 0n}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="text-[11px] text-[#101010]/50">USD</span>
            <button
              type="button"
              onClick={handleMax}
              className="px-1.5 py-0.5 text-[10px] text-[#1B29FF] hover:text-[#1420CC] transition-colors"
              disabled={usdcBalance === 0n}
            >
              MAX
            </button>
          </div>
        </div>
        {needsApproval && amount && (
          <p className="text-[11px] text-[#101010]/50">
            Will require approval for ${amount}
          </p>
        )}
      </div>

      {/* Deposit Button */}
      <button
        onClick={handleSameChainDeposit}
        disabled={
          !amount ||
          parseFloat(amount) <= 0 ||
          parseFloat(amount) > parseFloat(availableBalance) ||
          !isRelayReady ||
          usdcBalance === 0n ||
          transactionState.step === 'checking'
        }
        className="w-full px-4 py-2.5 text-[14px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {transactionState.step === 'checking' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowDownToLine className="h-4 w-4" />
        )}
        {needsApproval ? 'Approve & Deposit' : 'Deposit'}
      </button>

      {/* No balance warning */}
      {usdcBalance === 0n && (
        <div className="bg-[#FFF8E6] border border-[#FFA500]/20 p-3">
          <div className="flex gap-2 items-start">
            <AlertCircle className="h-4 w-4 text-[#FFA500] flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#101010]/70">
              No balance available to deposit. Wire funds to your account to get
              started.
            </p>
          </div>
        </div>
      )}

      {/* Help text */}
      <p className="text-[11px] text-[#101010]/50 text-center">
        {needsApproval
            ? 'This will approve and deposit in a single transaction flow'
            : 'Your deposit will start earning yield immediately'}
      </p>
    </div>
  );
}
