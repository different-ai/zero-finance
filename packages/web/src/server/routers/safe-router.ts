import { z } from 'zod';
import { router, protectedProcedure } from '../create-router';
import { TRPCError } from '@trpc/server';
// import axios from 'axios'; // Use fetch instead
import { type Address } from 'viem';
import { createPublicClient, http, isAddress, erc20Abi } from 'viem';
import { base } from 'viem/chains';

// Base Sepolia URL (Use Base Mainnet URL for production)
// const BASE_TRANSACTION_SERVICE_URL = 'https://safe-transaction-base-sepolia.safe.global/api'; 
const BASE_TRANSACTION_SERVICE_URL = 'https://safe-transaction-base.safe.global/api'; // PRODUCTION

// Define structure for a transaction item (matching the frontend component)
// Simplified version based on Safe Service response structure
interface TransactionItemFromService {
  type: 'ETHEREUM_TRANSACTION' | 'MODULE_TRANSACTION' | 'MULTISIG_TRANSACTION';
  txHash?: string;
  transactionHash?: string;
  executionDate: string; // ISO 8601 date string
  from?: string;
  to?: string;
  value?: string; // String number
  data?: string | null;
  tokenInfo?: {
      address: string;
      symbol: string;
      decimals: number;
  } | null;
  dataDecoded?: {
      method: string;
      parameters?: any[];
  } | null;
  safeTxHash?: string; // Present for multisig transactions
  isExecuted?: boolean; // For multisig
  transfers?: Array<{
      type: string;
      value?: string;
      to?: string;
      from?: string;
      tokenInfo?: {
          address: string;
          symbol: string;
          decimals: number;
      };
  }>;
  // ... other fields available in the API response
}

// Function to map API response to our simplified TransactionItem
function mapTxItem(tx: TransactionItemFromService, safeAddress?: string): TransactionItem | null {
    const timestamp = new Date(tx.executionDate).getTime();
    let type: TransactionItem['type'] = 'module'; // Default guess
    let value: string | undefined;
    let tokenInfo: { address: string; symbol: string; decimals: number } | undefined;

    // Skip unexecuted multisig for now
    if (tx.type === 'MULTISIG_TRANSACTION' && !tx.isExecuted) {
        return null;
    }

    // Check transfers array first - this is the most reliable way to identify token transfers
    if (tx.transfers && tx.transfers.length > 0) {
        const transfer = tx.transfers[0]; // Use the first transfer for simplicity
        
        // Check if this is an ERC20 transfer
        if (transfer.type === 'ERC20_TRANSFER' && transfer.tokenInfo) {
            tokenInfo = {
                address: transfer.tokenInfo.address,
                symbol: transfer.tokenInfo.symbol,
                decimals: transfer.tokenInfo.decimals || 18,
            };
            value = transfer.value || '0';
            
            // Determine if incoming or outgoing based on the to/from addresses
            if (safeAddress) {
                const safeAddrLower = safeAddress.toLowerCase();
                if (transfer.to?.toLowerCase() === safeAddrLower) {
                    type = 'incoming';
                } else if (transfer.from?.toLowerCase() === safeAddrLower) {
                    type = 'outgoing';
                }
            }
        }
    }
    
    // If no transfers found, try to determine type from transaction type
    if (type === 'module') {
        if (tx.type === 'ETHEREUM_TRANSACTION') {
            // Check if this is an incoming ETH transfer to the safe
            if (safeAddress && tx.to?.toLowerCase() === safeAddress.toLowerCase() && tx.value && tx.value !== '0') {
                type = 'incoming';
                value = tx.value;
            }
        } else if (tx.type === 'MULTISIG_TRANSACTION') {
            // For multisig transactions, check the decoded data
            if (tx.dataDecoded?.method === 'transfer' || tx.dataDecoded?.method === 'transferFrom') {
                type = 'outgoing';
                // Try to get value from parameters if not already set
                if (!value && tx.dataDecoded.parameters) {
                    const valueParam = tx.dataDecoded.parameters.find(p => p.name === 'value' || p.name === 'amount');
                    if (valueParam) {
                        value = valueParam.value;
                    }
                }
            }
        }
    }

    // Handle creation transactions
    if (!tx.to && tx.type === 'ETHEREUM_TRANSACTION') {
        type = 'creation';
    }

    return {
        type: type, 
        hash: tx.txHash || tx.transactionHash || tx.safeTxHash || '', // Use available hash
        timestamp: timestamp,
        from: tx.from,
        to: tx.to,
        value: value,
        tokenAddress: tokenInfo?.address,
        tokenSymbol: tokenInfo?.symbol,
        tokenDecimals: tokenInfo?.decimals,
        methodName: tx.dataDecoded?.method,
        transfers: tx.transfers,
    };
}

// Define and EXPORT our simplified TransactionItem
export interface TransactionItem {
  type: 'incoming' | 'outgoing' | 'module' | 'creation';
  hash: string;
  timestamp: number;
  from?: string;
  to?: string;
  value?: string; 
  tokenAddress?: string;
  tokenSymbol?: string;
  tokenDecimals?: number;
  methodName?: string;
  transfers?: Array<{
      type: string;
      value?: string;
      to?: string;
      from?: string;
      tokenInfo?: {
          address: string;
          symbol: string;
          decimals: number;
      };
  }>;
}

// Zod schema for input validation
const balanceInputSchema = z.object({
  safeAddress: z.string().refine(isAddress, { message: 'Invalid Safe address' }),
  tokenAddress: z.string().refine(isAddress, { message: 'Invalid Token address' }),
});

export const safeRouter = router({
  getTransactions: protectedProcedure
    .input(
      z.object({
        safeAddress: z.string().refine((val) => /^0x[a-fA-F0-9]{40}$/.test(val), {
            message: "Invalid Ethereum address",
        }),
        // Default to 100 if not provided
        limit: z.number().optional().default(100), 
      })
    )
    .query(async ({ input }): Promise<TransactionItem[]> => {
      const { safeAddress, limit = 100 } = input;
      // Construct URL with query parameters
      const url = new URL(`${BASE_TRANSACTION_SERVICE_URL}/v1/safes/${safeAddress}/all-transactions/`);
      url.searchParams.append('executed', 'true');
      url.searchParams.append('queued', 'false');
      url.searchParams.append('trusted', 'true');
      const apiUrl = url.toString();

      try {
        console.log(`0xHypr - Fetching transactions for ${safeAddress} from ${apiUrl}`);
        // Use fetch API
        const response = await fetch(apiUrl);

        if (!response.ok) {
             const errorBody = await response.text();
             console.error(`Error response from Safe Service (${response.status}): ${errorBody}`);
             throw new Error(`Failed to fetch data from Safe Transaction Service: ${response.statusText}`);
        }

        const data = await response.json();

        if (data && data.results) {
            const transactions: TransactionItem[] = data.results
                .map((tx: TransactionItemFromService) => mapTxItem(tx, safeAddress))
                .filter((tx: TransactionItem | null): tx is TransactionItem => tx !== null && tx.tokenSymbol === 'USDC')
                .sort((a: TransactionItem, b: TransactionItem) => b.timestamp - a.timestamp); 
            
            console.log(`0xHypr - Found ${transactions.length} executed transactions for ${safeAddress}`);
            return transactions.slice(0, limit);
        } else {
            console.error("Unexpected response structure from Safe Transaction Service", data);
            return [];
        }

      } catch (error: any) {
        // Log fetch-specific errors or re-throw as TRPCError
        console.error(`Error fetching transactions for Safe ${safeAddress}:`, error.message);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch transaction history from Safe service.',
          cause: error,
        });
      }
    }),

  /**
   * Fetches the ERC20 token balance for a given Safe address.
   */
  getBalance: protectedProcedure
    .input(balanceInputSchema)
    .query(async ({ input }) => {
      const { safeAddress, tokenAddress } = input;

      const publicClient = createPublicClient({
        chain: base,
        transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
      });

      try {
        const balance = await publicClient.readContract({
          address: tokenAddress as Address,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [safeAddress as Address],
        });

        return {
          safeAddress,
          tokenAddress,
          balance, // Returns BigInt
        };
      } catch (error: any) {
        console.error(
          `Error fetching balance for ${tokenAddress} at ${safeAddress} on ${base.name}:`,
          error,
        );
        // Consider re-throwing a TRPCError for client handling
        throw new Error(
          `Failed to fetch balance: ${error.shortMessage || error.message}`,
        );
      }
    }),
});

// export type SafeRouter = typeof safeRouter; // Removed type export 