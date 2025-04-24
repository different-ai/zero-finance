import { 
  createPublicClient, 
  http, 
  type Address, 
  type Hash, 
  decodeAbiParameters,
  decodeErrorResult,
  parseAbiItem
} from 'viem';
import { base } from 'viem/chains';

// Standard Error ABI for decoding revert reasons
const ERROR_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "Error",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "reason",
        "type": "string"
      }
    ],
    "name": "Panic",
    "type": "error"
  }
] as const;

// Uniswap Universal Router error signatures for common failures
const UNISWAP_ROUTER_ERRORS = {
  "V3TooLittleReceived": "0x3b00ae70", 
  "InsufficientEth": "0x37aedb04",
  "ExecutionFailed": "0xfdb6ca5d",
  "TransferFailed": "0x5a26ae8a",
  "DeadlineExceeded": "0x1a15a3cc",
  "ContractLocked": "0x6dcaafb7",
  "ETHNotAccepted": "0x1932be1d",
  "InvalidMsgValue": "0xffb53339",
} as const;

interface TransactionDebugResult {
  success: boolean;
  statusText: string;
  transaction?: any;
  receipt?: any;
  revertReason?: string;
  errorType?: string;
  gasInfo?: {
    used: string;
    limit: string;
    percentUsed: number;
  };
  suggestions?: string[];
}

/**
 * Decodes a Uniswap-specific error from the transaction data
 */
const decodeUniswapError = (data: `0x${string}` | undefined): { type: string, message: string } | null => {
  if (!data || data === '0x') return null;
  
  // Check for known Uniswap error signatures
  const errorSig = data.slice(0, 10);
  for (const [errorName, signature] of Object.entries(UNISWAP_ROUTER_ERRORS)) {
    if (errorSig === signature) {
      let message = `Uniswap ${errorName} error`;
      
      // For specific errors, add more details
      if (errorName === 'V3TooLittleReceived') {
        message = 'Slippage error: received amount less than minimum expected';
      } else if (errorName === 'InsufficientEth') {
        message = 'Not enough ETH sent for the transaction';
      } else if (errorName === 'DeadlineExceeded') {
        message = 'Transaction exceeded its deadline (took too long)';
      }
      
      return { type: errorName, message };
    }
  }
  
  // Try to decode as a generic Error(string)
  try {
    const decodedError = decodeErrorResult({
      abi: ERROR_ABI,
      data,
    });
    
    if (decodedError) {
      return { 
        type: decodedError.errorName, 
        message: decodedError.args?.[0]?.toString() || 'Unknown error'
      };
    }
  } catch (e) {
    // Could not decode as a standard error
  }
  
  return { type: 'Unknown', message: `Could not decode error data: ${data}` };
};

/**
 * Debug a failed transaction by hash
 * Analyzes the transaction, receipt, and tries to decode any error information
 */
export const debugTransaction = async (
  txHash: string, 
  rpcUrl: string = process.env.NEXT_PUBLIC_BASE_RPC_URL as string
): Promise<TransactionDebugResult> => {
  if (!rpcUrl) {
    throw new Error("RPC URL not configured");
  }
  
  console.log("0xHypr Starting transaction debug for:", txHash);
  
  try {
    // Create a public client to query the blockchain
    const client = createPublicClient({
      chain: base,
      transport: http(rpcUrl)
    });
    
    // Get transaction details and receipt
    const tx = await client.getTransaction({ hash: txHash as `0x${string}` });
    const receipt = await client.getTransactionReceipt({ hash: txHash as `0x${string}` });
    
    // Calculate gas usage percentage
    const gasUsedPercent = Number(
      (BigInt(receipt.gasUsed) * 100n / BigInt(tx.gas)).toString()
    );
    
    const result: TransactionDebugResult = {
      success: receipt.status === 'success',
      statusText: receipt.status === 'success' ? 'Success' : 'Failed',
      transaction: tx,
      receipt: receipt,
      gasInfo: {
        used: receipt.gasUsed.toString(),
        limit: tx.gas.toString(),
        percentUsed: gasUsedPercent
      },
      suggestions: []
    };
    
    // If transaction reverted, try to get more details
    if (receipt.status === 'reverted') {
      console.log("0xHypr Transaction reverted!");
      
      // For Uniswap transactions, try to identify common issues
      if (tx.to === '0x198EF79F2a46Ddbe87a35F499aA3Bd5698E4DDC0') { // Universal Router
        result.suggestions?.push('This transaction used Uniswap Universal Router');
        
        // If gas used is very low (less than 10% of limit), likely an input validation error
        if (gasUsedPercent < 10) {
          result.suggestions?.push('Transaction reverted very early (validation error)');
          result.suggestions?.push('Check: 1) Sufficient ETH balance 2) Valid parameters 3) Router approval');
        }
        
        // Look for transaction data to determine failure reason
        try {
          // Try to call the transaction to get the revert reason 
          const errorData = await client.call({
            account: tx.from,
            to: tx.to,
            data: tx.input,
            value: tx.value
          }).catch(err => {
            // Extract error data from the error object
            if (err.data) return { error: err.data as `0x${string}` };
            return { error: undefined };
          });
          
          if ('error' in errorData && errorData.error) {
            const uniswapError = decodeUniswapError(errorData.error);
            if (uniswapError) {
              result.errorType = uniswapError.type;
              result.revertReason = uniswapError.message;
              result.suggestions?.push(`Specific error: ${uniswapError.message}`);
              
              // Add targeted suggestions based on error type
              if (uniswapError.type === 'V3TooLittleReceived') {
                result.suggestions?.push('Try increasing slippage tolerance (current market may be volatile)');
              } else if (uniswapError.type === 'InsufficientEth') {
                result.suggestions?.push('Send more ETH with the transaction or reduce the swap amount');
              } else if (uniswapError.type === 'DeadlineExceeded') {
                result.suggestions?.push('Transaction took too long to mine - try again with a longer deadline');
              }
            }
          }
        } catch (callError) {
          console.error("0xHypr Error trying to simulate the failed call:", callError);
        }
        
        // If we still don't know the reason, check logs and add generic suggestions
        if (!result.revertReason) {
          result.revertReason = "Unknown Uniswap error";
          result.suggestions?.push('Check: 1) Sufficient slippage tolerance 2) Token approvals 3) ETH balance');
        }
      } else {
        // Generic revert for non-Uniswap contracts
        result.revertReason = "Transaction reverted without specific error message";
      }
      
      // Check for common issues regardless of contract
      if (gasUsedPercent >= 98) {
        result.suggestions?.push('Transaction may have run out of gas - try increasing gas limit');
      }
      
      if (receipt.logs.length > 0) {
        console.log("0xHypr Transaction emitted logs before reverting:", receipt.logs);
        result.suggestions?.push('Transaction emitted logs before failing - partial execution occurred');
      }
    }
    
    return result;
  } catch (error) {
    console.error("0xHypr Error debugging transaction:", error);
    return {
      success: false,
      statusText: `Error analyzing transaction: ${error instanceof Error ? error.message : 'Unknown error'}`,
      suggestions: ['Could not retrieve transaction details - check the hash is correct']
    };
  }
};

/**
 * Debug the transaction in a terminal-friendly format and print suggestions
 */
export const logTransactionDebug = async (txHash: string, rpcUrl?: string): Promise<void> => {
  try {
    console.log("0xHypr Transaction Debug", "-".repeat(30));
    console.log(`Transaction: ${txHash}`);
    
    const result = await debugTransaction(txHash, rpcUrl);
    
    console.log(`Status: ${result.statusText}`);
    
    if (result.revertReason) {
      console.log(`Revert Reason: ${result.revertReason}`);
    }
    
    if (result.gasInfo) {
      console.log(`Gas Used: ${result.gasInfo.used}/${result.gasInfo.limit} (${result.gasInfo.percentUsed}%)`);
    }
    
    if (result.suggestions && result.suggestions.length > 0) {
      console.log("\n0xHypr Suggested fixes:");
      result.suggestions.forEach((suggestion, i) => {
        console.log(`${i + 1}. ${suggestion}`);
      });
    }
    
    console.log("-".repeat(50));
  } catch (error) {
    console.error("0xHypr Failed to debug transaction:", error);
  }
}; 