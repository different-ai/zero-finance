/**
 * Safe Transaction Service
 * 
 * Prepares and executes Safe transactions for allocation transfers using Viem.
 * NOTE: SDK initialization uses a simplified approach due to type complexities.
 */

import Safe from '@safe-global/protocol-kit'; // Keep only the main import for now
import {
  encodeFunctionData, 
  parseUnits, 
  type Address, 
  createPublicClient, 
  http,
  Hex,
  TransactionReceipt
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import { ConfirmedAllocationResult } from './allocation-state';
// Removed problematic imports: EthersAdapter, SafeTransactionDataPartial, OperationType

// Load environment variables
const PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY as Hex | undefined;
const SAFE_ADDRESS = process.env.NEXT_PUBLIC_SAFE_ADDRESS as Address | undefined;
const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS_BASE as Address | undefined;
const RPC_URL = process.env.BASE_RPC_URL;
const TAX_DESTINATION_ADDRESS = process.env.TAX_DESTINATION_ADDRESS as Address | undefined;
const LIQUIDITY_DESTINATION_ADDRESS = process.env.LIQUIDITY_DESTINATION_ADDRESS as Address | undefined;
const YIELD_DESTINATION_ADDRESS = process.env.YIELD_DESTINATION_ADDRESS as Address | undefined;

// ERC20 ABI (minimal for transfer)
const ERC20_TRANSFER_ABI = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

/**
 * Initialize the Safe SDK using a simplified approach based on observed patterns.
 * @returns Initialized Safe SDK instance.
 */
export const initializeSafeSDKWithViem = async (): Promise<Safe> => {
  if (!PRIVATE_KEY || !SAFE_ADDRESS || !RPC_URL) {
    throw new Error('Missing required environment variables for Safe SDK initialization');
  }

  try {
    // Create Viem account from private key
    const account = privateKeyToAccount(PRIVATE_KEY);

    // Initialize Safe SDK using simplified init config (provider=rpc_url, signer=address)
    // This mimics patterns seen elsewhere but might lack full type correctness.
    const safeSdk = await Safe.init({
      provider: RPC_URL,       // Pass RPC URL string directly
      signer: account.address, // Pass signer address string
      safeAddress: SAFE_ADDRESS
    });

    console.log(`Safe SDK potentially initialized for Safe: ${await safeSdk.getAddress()} using signer address: ${account.address}`);
    return safeSdk;
  } catch (error) {
    console.error('Error initializing Safe SDK with simplified Viem config:', error);
    throw error;
  }
};

/**
 * Prepares a single ERC20 transfer transaction data structure.
 */
const prepareTransferTxData = (
  tokenAddress: Address,
  recipientAddress: Address,
  amountWei: string
): any | null => { // Using 'any' for SafeTransactionDataPartial due to import issues
  const amountBigInt = BigInt(amountWei);
  if (amountBigInt <= 0n) {
    return null;
  }
  try {
    const data = encodeFunctionData({
      abi: ERC20_TRANSFER_ABI,
      functionName: 'transfer',
      args: [recipientAddress, amountBigInt]
    });
    return {
      to: tokenAddress,
      data,
      value: '0',
      // operation: OperationType.Call // Removed OperationType due to import issues, assume default is Call
    };
  } catch (error) {
    console.error(`Error preparing transfer to ${recipientAddress}:`, error);
    return null;
  }
};

/**
 * Executes a batch Safe transaction to transfer allocated funds.
 */
export const executeAllocationTransactions = async (
  allocatedAmounts: ConfirmedAllocationResult
): Promise<string> => {
  
  if (!USDC_ADDRESS || !TAX_DESTINATION_ADDRESS || !LIQUIDITY_DESTINATION_ADDRESS || !YIELD_DESTINATION_ADDRESS) {
    throw new Error('Missing required destination addresses or USDC address in environment variables');
  }

  console.log('Preparing allocation transactions...', allocatedAmounts);

  const transactions: any[] = []; // Using 'any' for SafeTransactionDataPartial

  const taxTx = prepareTransferTxData(USDC_ADDRESS, TAX_DESTINATION_ADDRESS, allocatedAmounts.taxAmount);
  if (taxTx) transactions.push(taxTx);

  const liquidityTx = prepareTransferTxData(USDC_ADDRESS, LIQUIDITY_DESTINATION_ADDRESS, allocatedAmounts.liquidityAmount);
  if (liquidityTx) transactions.push(liquidityTx);

  const yieldTx = prepareTransferTxData(USDC_ADDRESS, YIELD_DESTINATION_ADDRESS, allocatedAmounts.yieldAmount);
  if (yieldTx) transactions.push(yieldTx);

  if (transactions.length === 0) {
    console.log('No allocations with non-zero amounts to execute.');
    return "No transactions executed."; 
  }

  try {
    const safeSdk = await initializeSafeSDKWithViem();
    
    console.log(`Creating batch transaction with ${transactions.length} transfers...`);
    const safeTransaction = await safeSdk.createTransaction({ transactions: transactions });

    console.log('Executing Safe transaction...');
    const executeTxResponse = await safeSdk.executeTransaction(safeTransaction);
    
    // Attempt to get receipt - structure might vary based on actual response
    // Need a public client to wait for the transaction
    const publicClient = createPublicClient({ chain: base, transport: http(RPC_URL) });

    // Explicitly cast hash to expected type
    const txHash = executeTxResponse.hash as Hex;
    if (!txHash || typeof txHash !== 'string' || !txHash.startsWith('0x')) {
        console.error("Invalid or missing transaction hash from executeTxResponse", executeTxResponse);
        throw new Error("Invalid or missing transaction hash from execution response");
    }

    console.log("Waiting for transaction receipt for hash:", txHash);
    const receipt: TransactionReceipt | null = await publicClient.waitForTransactionReceipt({ 
      hash: txHash 
    });

    if (!receipt) {
      console.error("Failed to get transaction receipt", { txHash });
      throw new Error(`Failed to get transaction receipt for hash ${txHash}`);
    }
    
    if (receipt.status !== 'success') {
      console.error("Transaction failed", { receipt });
      throw new Error(`Safe transaction execution failed. Status: ${receipt.status}, Hash: ${receipt.transactionHash}`);
    }

    console.log('Safe transaction executed successfully:', receipt.transactionHash);
    return receipt.transactionHash;

  } catch (error) {
    console.error('Error executing Safe allocation transaction:', error);
    throw error instanceof Error ? error : new Error('Failed to execute Safe transaction');
  }
};

/**
 * Prepare a Safe transaction to transfer USDC
 * Note: This doesn't execute the transaction, just demonstrates how it would be prepared
 * 
 * @param recipientAddress The address to send USDC to
 * @param amount The amount of USDC to send (in USDC units, e.g. "1.5" for 1.5 USDC)
 * @returns The encoded transaction data
 */
export const prepareSafeTx = (recipientAddress: string, amount: string) => {
  if (!USDC_ADDRESS) {
    throw new Error('Missing USDC_ADDRESS environment variable');
  }
  
  try {
    // Convert the amount to USDC's decimals (6)
    const amountInWei = parseUnits(amount, 6);
    
    // Encode the transfer function call
    const data = encodeFunctionData({
      abi: ERC20_TRANSFER_ABI,
      functionName: 'transfer',
      args: [recipientAddress as `0x${string}`, amountInWei]
    });
    
    return {
      to: USDC_ADDRESS,
      data,
      value: '0', // No ETH being sent
      operation: 0, // Call operation
    };
  } catch (error) {
    console.error('Error preparing Safe transaction:', error);
    throw error;
  }
}; 