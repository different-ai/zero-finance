/**
 * Safe Transaction Service
 * 
 * Prepares and executes Safe transactions for allocation transfers using Viem.
 * NOTE: SDK initialization uses a simplified approach due to type complexities.
 */

import { 
  createPublicClient, 
  http, 
  type Address, 
  type Hex, 
  encodeFunctionData
} from 'viem';
import { base } from 'viem/chains'; // Use the correct chain
import { privateKeyToAccount, type PrivateKeyAccount } from 'viem/accounts';
import Safe from '@safe-global/protocol-kit'; // Default import
// Note: EthersAdapter is part of protocol-kit but we use Viem initialization
import { MetaTransactionData, OperationType } from '@safe-global/safe-core-sdk-types';
import { GelatoRelayPack, GelatoOptions } from '@safe-global/relay-kit'; // Import necessary types
import { getRpcUrl, getUsdcAddress } from '../lib/safe-service'; // Corrected path
import { erc20Abi } from 'viem'; // Keep for ABI
import { ConfirmedAllocationResult, getFullAllocationStateForUser } from './allocation-state';
import { db } from '@/db';
import { userSafes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// --- Configuration ---
const USDC_DECIMALS = 6;
const RPC_URL = getRpcUrl();
const USDC_TOKEN_ADDRESS = getUsdcAddress();
const GELATO_RELAY_API_KEY = process.env.GELATO_RELAY_API_KEY;
// Use a valid Hex type for the dummy key
const DUMMY_SIGNER_PRIVATE_KEY: Hex = '0x0000000000000000000000000000000000000000000000000000000000000001';

const PLACEHOLDER_SAFE_ADDRESS = '0xDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF' as Address;

if (!RPC_URL || !USDC_TOKEN_ADDRESS) {
  throw new Error('Missing RPC_URL or USDC_TOKEN_ADDRESS configuration.');
}
if (!GELATO_RELAY_API_KEY) {
  console.warn('GELATO_RELAY_API_KEY not set. Relaying will fail.');
}

// Initialize Viem Public Client (can be reused)
const publicClient = createPublicClient({
  chain: base,
  transport: http(RPC_URL),
});

// --- Helper Functions ---

const createTransferTx = (
  tokenAddress: Address,
  toAddress: Address,
  amountWei: string,
): MetaTransactionData => {
  // Using Viem's encodeFunctionData with erc20Abi
  const data = encodeFunctionData({
    abi: erc20Abi,
    functionName: 'transfer',
    args: [toAddress, BigInt(amountWei)],
  });

  return {
    to: tokenAddress,
    value: '0',
    data: data,
    operation: OperationType.Call,
  };
};

/**
 * Gets or creates a destination Safe record (tax, liquidity, yield) for a user.
 * If the safe doesn't exist, it creates a placeholder record in the DB
 * and returns a placeholder address. Actual deployment is NOT handled here.
 * @param userDid The Privy DID of the user.
 * @param safeType The type of destination safe ('tax', 'liquidity', 'yield').
 * @returns The address of the destination safe (or a placeholder).
 */
const getOrCreateDestinationSafe = async (
  userDid: string,
  safeType: 'tax' | 'liquidity' | 'yield'
): Promise<Address> => {
  let destinationSafe = await db.select()
    .from(userSafes)
    .where(and(
      eq(userSafes.userDid, userDid),
      eq(userSafes.safeType, safeType)
    ))
    .limit(1)
    .then(res => res[0]);

  if (destinationSafe) {
    console.log(`Found existing ${safeType} safe for user ${userDid}: ${destinationSafe.safeAddress}`);
    return destinationSafe.safeAddress as Address;
  } else {
    console.warn(`User ${userDid} does not have a ${safeType} safe configured. Creating placeholder record.`);
    try {
      const newSafeRecord = await db.insert(userSafes).values({
        userDid: userDid,
        safeAddress: PLACEHOLDER_SAFE_ADDRESS,
        safeType: safeType,
      }).returning().then(res => res[0]);

      if (!newSafeRecord) {
        throw new Error(`Failed to insert placeholder ${safeType} safe record for user ${userDid}`);
      }
      console.log(`Created placeholder ${safeType} safe record for user ${userDid} with address ${PLACEHOLDER_SAFE_ADDRESS}`);
      return PLACEHOLDER_SAFE_ADDRESS;
    } catch (dbError) {
      console.error(`Database error creating placeholder ${safeType} safe for user ${userDid}:`, dbError);
      throw new Error(`Failed to ensure ${safeType} safe record exists for user ${userDid}`);
    }
  }
};


// --- Main Service Function (Viem Based - Attempt 5 using Safe.init) ---

/**
 * Executes the allocation transactions via Safe{Core} SDK and Gelato Relay.
 * Fetches the primary safe address and destination addresses based on userDid.
 * 
 * @param confirmedAllocation The amounts confirmed for allocation.
 * @param userDid The Privy DID of the user whose allocation is being executed.
 * @returns The Gelato Relay Task ID.
 */
export const executeAllocationTransactions = async (
  confirmedAllocation: ConfirmedAllocationResult,
  userDid: string
): Promise<string> => {
  if (!GELATO_RELAY_API_KEY) {
    throw new Error('Gelato Relay API Key is not configured.');
  }

  try {
    console.log(`Fetching primary safe address for user ${userDid}...`);
    const fullState = await getFullAllocationStateForUser(userDid);
    const primarySafeAddress = fullState.primarySafeAddress as Address;
    console.log(`Using primary safe address: ${primarySafeAddress}`);

    // Initialize Protocol Kit with Viem config using Safe.init
    const protocolKit = await Safe.init({
        provider: RPC_URL, // Pass RPC URL string directly
        signer: DUMMY_SIGNER_PRIVATE_KEY, // Pass dummy private key string
        safeAddress: primarySafeAddress // The address of the Safe to connect to
        // removed predictedSafe, as we are connecting to an existing Safe
    });

    console.log(`Protocol Kit initialized for Safe: ${await protocolKit.getAddress()}`);

    console.log(`Fetching destination safe addresses for user ${userDid}...`);
    const taxSafeAddress = await getOrCreateDestinationSafe(userDid, 'tax');
    const liquiditySafeAddress = await getOrCreateDestinationSafe(userDid, 'liquidity');
    const yieldSafeAddress = await getOrCreateDestinationSafe(userDid, 'yield');

    console.log(`Destination Safes - Tax: ${taxSafeAddress}, Liquidity: ${liquiditySafeAddress}, Yield: ${yieldSafeAddress}`);

    const transactions: MetaTransactionData[] = [];
    if (BigInt(confirmedAllocation.taxAmount) > 0n) {
      transactions.push(createTransferTx(USDC_TOKEN_ADDRESS, taxSafeAddress, confirmedAllocation.taxAmount));
    }
    if (BigInt(confirmedAllocation.liquidityAmount) > 0n) {
      transactions.push(createTransferTx(USDC_TOKEN_ADDRESS, liquiditySafeAddress, confirmedAllocation.liquidityAmount));
    }
    if (BigInt(confirmedAllocation.yieldAmount) > 0n) {
      transactions.push(createTransferTx(USDC_TOKEN_ADDRESS, yieldSafeAddress, confirmedAllocation.yieldAmount));
    }

    if (transactions.length === 0) {
      console.log('No allocation amounts > 0, skipping transaction execution.');
      return 'skipped_no_amount';
    }

    console.log('Preparing Safe transaction...');
    const safeTransaction = await protocolKit.createTransaction({ transactions });
    
    console.log('Signing Safe transaction...');
    const signedSafeTx = await protocolKit.signTransaction(safeTransaction);

    // Initialize Gelato Relay Kit correctly with API Key string
    const relayKit = new GelatoRelayPack(GELATO_RELAY_API_KEY);

    console.log('Relaying transaction via Gelato...');
    const chainId = await protocolKit.getChainId();
    
    // Define Gelato options
    const options: GelatoOptions = {
      isSponsored: true, 
      // gasLimit: '1000000' // Optional
    };

    // Use relayTransaction with correct signature property access and options
    const relayResponse = await relayKit.relayTransaction({
        target: primarySafeAddress,
        encodedTransaction: signedSafeTx.encodedSignatures(), // Call function to get string
        chainId: chainId,
        options: options, 
    });

    console.log(`Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${relayResponse.taskId}`);
    return relayResponse.taskId;

  } catch (error: any) {
    console.error('Error executing allocation transactions:', error);
    if (error.response?.data) {
      console.error('Error response data:', error.response.data);
    }
    if (error.message) {
        console.error('Error message:', error.message);
    }
    throw new Error(`Failed to execute allocation transactions for user ${userDid}: ${error.message || 'Unknown error'}`);
  }
}; 