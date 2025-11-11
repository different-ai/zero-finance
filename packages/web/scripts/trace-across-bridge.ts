#!/usr/bin/env tsx
/**
 * Trace Across Bridge Transaction
 *
 * Follows a deposit from Base through Across bridge to Arbitrum.
 *
 * Usage:
 *   pnpm tsx scripts/trace-across-bridge.ts <base-tx-hash>
 *
 * Example:
 *   pnpm tsx scripts/trace-across-bridge.ts 0x1234...
 */

import { createPublicClient, http, type Hex, decodeEventLog } from 'viem';
import { base, arbitrum } from 'viem/chains';

const ACROSS_SPOKE_POOL_BASE = '0x09aea4b2242abc8bb4bb78d537a67a245a7bec64';
const ACROSS_SPOKE_POOL_ARBITRUM = '0xe35e9842fceaca96570b734083f4a58e8f7c5f2a';

// V3FundsDeposited event ABI
const V3_FUNDS_DEPOSITED_ABI = {
  name: 'V3FundsDeposited',
  type: 'event',
  inputs: [
    { type: 'address', name: 'inputToken' },
    { type: 'address', name: 'outputToken' },
    { type: 'uint256', name: 'inputAmount' },
    { type: 'uint256', name: 'outputAmount' },
    { type: 'uint256', name: 'destinationChainId', indexed: true },
    { type: 'uint32', name: 'depositId', indexed: true },
    { type: 'uint32', name: 'quoteTimestamp' },
    { type: 'uint32', name: 'fillDeadline' },
    { type: 'uint32', name: 'exclusivityDeadline' },
    { type: 'address', name: 'depositor', indexed: true },
    { type: 'address', name: 'recipient' },
    { type: 'address', name: 'exclusiveRelayer' },
    { type: 'bytes', name: 'message' },
  ],
} as const;

// FilledV3Relay event ABI (simplified - without tuple)
const FILLED_V3_RELAY_ABI = {
  name: 'FilledV3Relay',
  type: 'event',
  inputs: [
    { type: 'address', name: 'inputToken' },
    { type: 'address', name: 'outputToken' },
    { type: 'uint256', name: 'inputAmount' },
    { type: 'uint256', name: 'outputAmount' },
    { type: 'uint256', name: 'repaymentChainId' },
    { type: 'uint256', name: 'originChainId', indexed: true },
    { type: 'uint32', name: 'depositId', indexed: true },
    { type: 'uint32', name: 'fillDeadline' },
    { type: 'uint32', name: 'exclusivityDeadline' },
    { type: 'address', name: 'exclusiveRelayer' },
    { type: 'address', name: 'relayer', indexed: true },
    { type: 'address', name: 'depositor' },
    { type: 'address', name: 'recipient' },
    { type: 'bytes', name: 'message' },
  ],
} as const;

// FilledV3Relay event from Across SpokePool on destination
const FILLED_V3_RELAY = parseAbiItem(
  'event FilledV3Relay(address inputToken, address outputToken, uint256 inputAmount, uint256 outputAmount, uint256 repaymentChainId, uint256 indexed originChainId, uint32 indexed depositId, uint32 fillDeadline, uint32 exclusivityDeadline, address exclusiveRelayer, address indexed relayer, address depositor, address recipient, bytes message, tuple(address updatedRecipient, bytes updatedMessage, uint256 updatedOutputAmount, uint8 fillType) relayExecutionInfo)',
);

async function traceTransaction(baseTxHash: string) {
  console.log('🔍 Tracing Across Bridge Transaction\n');
  console.log('Base Transaction:', baseTxHash);
  console.log('─'.repeat(80));

  const baseClient = createPublicClient({
    chain: base,
    transport: http(
      process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
    ),
  });

  const arbitrumClient = createPublicClient({
    chain: arbitrum,
    transport: http(
      process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL ||
        'https://arb1.arbitrum.io/rpc',
    ),
  });

  // Step 1: Get Base transaction receipt
  console.log('\n1️⃣  Checking Base Transaction...\n');

  let receipt;
  try {
    receipt = await baseClient.getTransactionReceipt({
      hash: baseTxHash as Hex,
    });

    console.log(
      '   Status:',
      receipt.status === 'success' ? '✅ Success' : '❌ Failed',
    );
    console.log('   Block:', receipt.blockNumber.toString());
    console.log('   Gas Used:', receipt.gasUsed.toString());

    if (receipt.status !== 'success') {
      console.log(
        '\n   ❌ Transaction failed on Base! Check BaseScan for details.',
      );
      console.log(`   → https://basescan.org/tx/${baseTxHash}\n`);
      return;
    }
  } catch (error) {
    console.error('   ❌ Error fetching transaction:', error);
    return;
  }

  // Step 2: Find V3FundsDeposited event
  console.log('\n2️⃣  Looking for Across Bridge Event...\n');

  const depositEvent = receipt.logs.find((log) => {
    try {
      if (log.address.toLowerCase() !== ACROSS_SPOKE_POOL_BASE.toLowerCase()) {
        return false;
      }
      const decoded = baseClient.decodeEventLog({
        abi: [V3_FUNDS_DEPOSITED],
        data: log.data,
        topics: log.topics,
      });
      return decoded.eventName === 'V3FundsDeposited';
    } catch {
      return false;
    }
  });

  if (!depositEvent) {
    console.log('   ❌ No V3FundsDeposited event found!');
    console.log('   → This might not be an Across bridge transaction.');
    return;
  }

  const decoded = baseClient.decodeEventLog({
    abi: [V3_FUNDS_DEPOSITED],
    data: depositEvent.data,
    topics: depositEvent.topics,
  });

  const {
    depositId,
    depositor,
    recipient,
    inputAmount,
    outputAmount,
    destinationChainId,
    message,
  } = decoded.args as any;

  console.log('   ✅ Found Across Deposit Event:');
  console.log('   - Deposit ID:', depositId.toString());
  console.log('   - From:', depositor);
  console.log('   - To:', recipient);
  console.log(
    '   - Input Amount:',
    (Number(inputAmount) / 1e6).toFixed(2),
    'USDC',
  );
  console.log(
    '   - Output Amount:',
    (Number(outputAmount) / 1e6).toFixed(2),
    'USDC',
  );
  console.log(
    '   - Destination Chain:',
    destinationChainId.toString(),
    '(Arbitrum)',
  );
  console.log(
    '   - Has Message:',
    message !== '0x' ? 'Yes (Multicall for vault deposit)' : 'No',
  );

  // Step 3: Search for fill on Arbitrum
  console.log('\n3️⃣  Searching for Fill on Arbitrum...\n');
  console.log('   ⏳ Checking last 10,000 blocks for fill event...\n');

  try {
    const currentBlock = await arbitrumClient.getBlockNumber();
    const fromBlock = currentBlock - 10000n; // Last ~30-40 minutes

    const fillLogs = await arbitrumClient.getLogs({
      address: ACROSS_SPOKE_POOL_ARBITRUM as Hex,
      event: FILLED_V3_RELAY,
      fromBlock,
      toBlock: 'latest',
    });

    // Find matching fill by depositId and originChainId
    const matchingFill = fillLogs.find((log) => {
      try {
        const fillDecoded = arbitrumClient.decodeEventLog({
          abi: [FILLED_V3_RELAY],
          data: log.data,
          topics: log.topics,
        });
        const fillArgs = fillDecoded.args as any;
        return (
          fillArgs.depositId === depositId && fillArgs.originChainId === 8453n // Base chain ID
        );
      } catch {
        return false;
      }
    });

    if (!matchingFill) {
      console.log('   ⏳ Fill not found yet - bridge still processing');
      console.log('   → Across bridge typically takes 20-60 seconds');
      console.log('   → Try running this script again in 30 seconds');
      console.log('\n   Monitor at: https://across.to');
      return;
    }

    console.log('   ✅ Found Fill Event!');
    console.log('   - Transaction:', matchingFill.transactionHash);
    console.log('   - Block:', matchingFill.blockNumber?.toString());

    const fillTx = await arbitrumClient.getTransactionReceipt({
      hash: matchingFill.transactionHash!,
    });

    console.log(
      '   - Status:',
      fillTx.status === 'success' ? '✅ Success' : '❌ Failed',
    );
    console.log('   - Gas Used:', fillTx.gasUsed.toString());

    if (fillTx.status !== 'success') {
      console.log('\n   ❌ Fill transaction failed on Arbitrum!');
      console.log(
        `   → Check Arbiscan: https://arbiscan.io/tx/${matchingFill.transactionHash}\n`,
      );
      return;
    }

    // Check if multicall executed successfully
    if (message !== '0x') {
      console.log('\n4️⃣  Checking Multicall Execution (Vault Deposit)...\n');

      // Look for Transfer and Deposit events
      const transferEvents = fillTx.logs.filter(
        (log) =>
          log.topics[0] ===
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer event
      );

      const depositEvents = fillTx.logs.filter(
        (log) =>
          log.topics[0] ===
          '0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7', // Deposit event (ERC-4626)
      );

      if (depositEvents.length > 0) {
        console.log('   ✅ Vault deposit successful!');
        console.log('   - Found', depositEvents.length, 'deposit event(s)');
        console.log(
          '   - Your funds are now in the Morpho vault earning yield!',
        );
      } else {
        console.log('   ⚠️  No deposit events found');
        console.log('   - Multicall might have failed');
        console.log(
          '   - Check if USDC is in your Safe on Arbitrum (not in vault)',
        );
      }
    }

    console.log('\n' + '─'.repeat(80));
    console.log('\n📝 Transaction Summary:\n');
    console.log(
      '✅ Step 1: Deposited on Base -',
      `https://basescan.org/tx/${baseTxHash}`,
    );
    console.log(
      '✅ Step 2: Filled on Arbitrum -',
      `https://arbiscan.io/tx/${matchingFill.transactionHash}`,
    );

    if (message !== '0x' && depositEvents.length > 0) {
      console.log('✅ Step 3: Deposited to vault - Funds earning yield! 🎉\n');
    } else if (message !== '0x') {
      console.log('⚠️  Step 3: Multicall might have failed - Check Arbiscan\n');
    } else {
      console.log('ℹ️  Note: Direct transfer (no vault deposit)\n');
    }
  } catch (error) {
    console.error('   ❌ Error searching for fill:', error);
  }
}

// CLI entry point
const txHash = process.argv[2];

if (!txHash || !txHash.startsWith('0x')) {
  console.error(
    '❌ Usage: pnpm tsx scripts/trace-across-bridge.ts <base-tx-hash>',
  );
  console.error(
    '   Example: pnpm tsx scripts/trace-across-bridge.ts 0x1234567890abcdef...',
  );
  process.exit(1);
}

traceTransaction(txHash).catch(console.error);
