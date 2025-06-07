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

    // Skip unexecuted multisig for now
    if (tx.type === 'MULTISIG_TRANSACTION' && !tx.isExecuted) {
        return null;
    }

    // Better type detection based on transaction type and data
    if (tx.type === 'ETHEREUM_TRANSACTION') {
        // Check if this is an incoming transfer to the safe
        if (safeAddress && tx.to?.toLowerCase() === safeAddress.toLowerCase()) {
            type = 'incoming';
        } else if (tx.value && tx.value !== '0') {
            type = 'outgoing';
        } else {
            type = 'module';
        }
    } else if (tx.type === 'MULTISIG_TRANSACTION') {
        // For multisig transactions, check if it's a token transfer
        if (tx.dataDecoded?.method === 'transfer' || tx.dataDecoded?.method === 'transferFrom') {
            type = 'outgoing';
        } else if (tx.value && tx.value !== '0' && (!tx.data || tx.data === '0x')) {
            // ETH transfer
            type = 'outgoing';
        } else {
            type = 'module';
        }
    } else if (tx.type === 'MODULE_TRANSACTION') {
        type = 'module';
    }

    // Extract token info from transfers array if available
    let tokenInfo = tx.tokenInfo;
    let value = tx.value;
    
    // For MULTISIG_TRANSACTION, check if there are transfers
    if (tx.type === 'MULTISIG_TRANSACTION' && tx.transfers && tx.transfers.length > 0) {
        const transfer = tx.transfers[0]; // Take the first transfer
        if (transfer.type === 'ERC20_TRANSFER' && transfer.tokenInfo) {
            tokenInfo = transfer.tokenInfo;
            value = transfer.value;
        }
    }

    return {
        type: type, 
        hash: tx.txHash || tx.transactionHash || '', // Use the main transaction hash
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
      })
    )
    .query(async ({ input }): Promise<TransactionItem[]> => {
      const { safeAddress } = input;
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
                .filter((tx: TransactionItem | null): tx is TransactionItem => tx !== null);
            
            console.log(`0xHypr - Found ${transactions.length} executed transactions for ${safeAddress}`);
            return transactions;
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