# Safe Infrastructure & Aerodrome Integration Learnings

*Created: November 26, 2025*

## 1. Safe Multicall Debugging

### The "Silent Failure" Phenomenon
When relaying Safe transactions via ERC-4337 (UserOperations), a transaction can appear successful at the "envelope" level while failing internally.

*   **Symptom:** The UserOperation consumes gas and returns success (`success: true` in `UserOperationEvent`), but the intended actions (swaps, transfers) do not occur.
*   **Root Cause:** The EntryPoint successfully calls the Smart Wallet, but the Smart Wallet's internal execution (e.g., `execTransaction` calling `MultiSend`) reverts. The Smart Wallet catches this revert to pay the Bundler, effectively masking the application-level failure.

### Detection Strategy
To diagnose these failures, inspect the Transaction Receipt logs for the Safe's specific event topics:

1.  **ExecutionSuccess:** `0x442e715f626346e8c54381002da614f62bee8d27386535b2521ec8540898556e`
2.  **ExecutionFailure:** `0x23428b18acfb3ea64b08dc0c1d476e628bf8e15b398966b7b070f4ad2ab60104`

**Key Insight:** If you see `UserOperationEvent` but also `ExecutionFailure` (or no `ExecutionSuccess`), the Safe transaction reverted internally.

## 2. Aerodrome SlipStream (Uniswap V3) Integration

### `exactInputSingle` vs `exactInput`
We encountered significant issues using `exactInputSingle` for concentrated liquidity swaps due to `sqrtPriceLimitX96` management.

*   **The Pitfall:** `exactInputSingle` requires an explicit `sqrtPriceLimitX96`.
    *   Setting it to `0` works *only* if `tokenIn < tokenOut` (Price decreases).
    *   If `tokenIn > tokenOut` (Price increases), `0` is an invalid limit (below current price), causing immediate reverts (`SPL` or `Safe Math` errors).
    *   Manually calculating `MIN_SQRT_RATIO + 1` vs `MAX_SQRT_RATIO - 1` is error-prone and requires robust token sorting logic on the client.

*   **The Solution:** Prefer `exactInput` with Path Encoding.
    *   **Function:** `exactInput(ExactInputParams calldata params)`
    *   **Path:** `encodePacked(['address', 'uint24', 'address'], [tokenIn, tickSpacing, tokenOut])`
    *   **Benefit:** When using `exactInput`, the router parses the path and automatically sets the correct `sqrtPriceLimitX96` (0 or Max) based on the swap direction derived from the token addresses. This delegates safety complexity to the contract.

### Code Example (Viem)
```typescript
import { encodePacked, encodeFunctionData } from 'viem';

// 1. Encode the path (TokenIn + TickSpacing + TokenOut)
const path = encodePacked(
  ['address', 'uint24', 'address'],
  [SUPER_OETH_ADDRESS, TICK_SPACING, WETH_ADDRESS]
);

// 2. Prepare params for exactInput
const swapParams = {
  path,
  recipient: safeAddress,
  deadline: deadline,
  amountIn: amountIn,
  amountOutMinimum: minOut,
};

// 3. Encode calldata
const data = encodeFunctionData({
  abi: SLIPSTREAM_ROUTER_ABI,
  functionName: 'exactInput',
  args: [swapParams],
});
```

## 3. UI/UX Patterns for Relayed Transactions

### Decoupling Submission from Completion
For complex relayed transactions (like a 3-step multicall), the UI must distinguish between "Transaction Sent" and "Process Complete".

*   **Anti-Pattern:** Automatically calling `onSuccess/close()` immediately after `sendTransaction` resolves.
    *   *Risk:* If the backend is fast, the modal vanishes before the user registers what happened.
    *   *Risk:* If the UI state isn't managed, the user might think the action failed or did nothing.
*   **Best Practice:**
    1.  Await Transaction Hash.
    2.  Transition Modal to **Success State** (Green checkmark, summary of action).
    3.  Require **Explicit User Interaction** ("Done" button) to close the modal.
    4.  Trigger data refetches (balances, history) only upon that final confirmation to ensure the UI feels responsive and data is fresh.

### Advanced: "The Two-Phase Loading State"
UserOps confirm quickly, but state changes (balances) lag behind due to indexer latency. To prevent "ghosting" (where a user sees a success message but their balance hasn't changed):

*   **Phase 1: Transaction Confirmation (Chain)**
    *   Wait for `bundlerClient.sendUserOperation`.
    *   Wait for `publicClient.waitForTransactionReceipt`.
    *   *Status:* "Transaction Confirmed on Chain."

*   **Phase 2: Data Finality (App State)**
    *   Do **NOT** rely on simple `refetch()`.
    *   Implement a **"Poll-Until-Changed"** loop.
    *   Capture the *initial* balance before the transaction.
    *   After Phase 1, poll the balance endpoint every 1-2s.
    *   Only transition the UI to "Success" when `newBalance !== initialBalance`.

**Example Logic:**
```typescript
const initialBalance = balance;
await sendTx(); // Phase 1
await waitForReceipt(); // Phase 1

setLoadingState('indexing'); // Phase 2: "Updating balances..."

// Poll until data reflects reality
const checkBalance = async () => {
  const newBalance = await fetchBalance();
  if (newBalance !== initialBalance) {
    setLoadingState('success');
  } else {
    setTimeout(checkBalance, 1000);
  }
};
checkBalance();
```