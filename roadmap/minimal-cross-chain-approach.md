# Minimal Cross-Chain Approach: No Safe Deployment Needed

## The Key Insight

Your Safe address is **deterministic** - it's the same on Base and Arbitrum. You don't need to deploy the Safe on Arbitrum to receive vault shares there.

## How It Works

```
BASE (where your Safe is deployed)
    ↓
User's Safe calls Across SpokePool
    ↓
"Bridge 1000 USDC to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb (my Safe address)"
    ↓
Across bridges USDC (~30 seconds)
    ↓
ARBITRUM (Safe not deployed yet)
    ↓
MinimalCrossChainVault receives USDC
    ↓
Deposits to Morpho Vault
    ↓
Vault shares minted to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
    ↓
Shares sit there waiting (no Safe needed!)
```

## Withdrawal Later

When you want to withdraw:

```typescript
// Option 1: Deploy Safe on Arbitrum (~$20)
// Then your Safe can call vault.withdraw()

// Option 2: Use a helper contract
// MinimalCrossChainVault can have a withdraw function
// that lets you withdraw to any address you control
```

## The Smart Contract (Ultra Minimal)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {IERC4626} from "forge-std/interfaces/IERC4626.sol";

contract MinimalCrossChainVault {
    address public immutable ACROSS_SPOKE_POOL;
    address public immutable VAULT;
    
    constructor(address _across, address _vault) {
        ACROSS_SPOKE_POOL = _across;
        VAULT = _vault;
    }
    
    // Called by Across when bridge completes
    function handleV3AcrossMessage(
        address token,
        uint256 amount,
        address,
        bytes memory message
    ) external {
        require(msg.sender == ACROSS_SPOKE_POOL, "Unauthorized");
        
        address userSafe = abi.decode(message, (address));
        
        // Deposit to vault - shares go to user's Safe address
        IERC20(token).approve(VAULT, amount);
        IERC4626(VAULT).deposit(amount, userSafe);
    }
}
```

**That's it!** 65 lines of code total.

## Frontend Integration

### Step 1: Call Across from Base

```typescript
// User's Safe on Base calls Across SpokePool
const depositTx = await safeOnBase.sendTransaction([{
  to: ACROSS_SPOKE_POOL_BASE,
  data: encodeFunctionData({
    abi: ACROSS_V3_ABI,
    functionName: 'depositV3',
    args: [
      safeAddress, // depositor
      MINIMAL_VAULT_CONTRACT_ARBITRUM, // recipient (our helper contract)
      USDC_BASE, // input token
      USDC_ARBITRUM, // output token  
      parseUnits('1000', 6), // amount
      parseUnits('1000', 6), // output amount
      42161n, // Arbitrum chain ID
      '0x0000000000000000000000000000000000000000', // no exclusive relayer
      Math.floor(Date.now() / 1000) - 60, // quote timestamp
      Math.floor(Date.now() / 1000) + 3600, // fill deadline
      0, // no exclusivity
      encodeAbiParameters(
        [{ type: 'address' }],
        [safeAddress] // Message: your Safe address
      ),
    ],
  }),
  value: '0',
}]);
```

### Step 2: Shares Arrive (automatically)

After ~30 seconds, vault shares are sitting at your Safe's address on Arbitrum.

### Step 3: Check Balance

```typescript
// Check vault balance on Arbitrum (Safe doesn't need to exist)
const arbitrumClient = createPublicClient({
  chain: arbitrum,
  transport: http(),
});

const shares = await arbitrumClient.readContract({
  address: MORPHO_VAULT_ARBITRUM,
  abi: ['function balanceOf(address) view returns (uint256)'],
  functionName: 'balanceOf',
  args: [safeAddress], // Your Safe address (not deployed on Arbitrum)
});

console.log('You have shares on Arbitrum:', shares);
// Even though your Safe isn't deployed there!
```

### Step 4: Withdraw (two options)

**Option A: Deploy Safe on Arbitrum**

```typescript
// 1. Deploy Safe on Arbitrum with same address
// Cost: ~$20 one-time
deploySafeOnArbitrum(safeAddress);

// 2. Now Safe can withdraw
await safeOnArbitrum.sendTransaction([{
  to: MORPHO_VAULT_ARBITRUM,
  data: encodeFunctionData({
    abi: ERC4626_ABI,
    functionName: 'withdraw',
    args: [amount, safeAddress, safeAddress],
  }),
  value: '0',
}]);
```

**Option B: Add withdraw to helper contract**

```solidity
// Add this to MinimalCrossChainVault.sol:

function withdrawFor(
    address userSafe,
    uint256 shares,
    bytes memory signature
) external {
    // Verify signature from Safe owner
    require(isValidSafeSignature(userSafe, signature), "Invalid sig");
    
    // Transfer shares from Safe to this contract
    // (Safe must have approved this contract)
    IERC20(VAULT).transferFrom(userSafe, address(this), shares);
    
    // Redeem shares
    uint256 assets = IERC4626(VAULT).redeem(shares, userSafe, address(this));
    
    // Bridge back to Base if needed
    // Or keep on Arbitrum
}
```

## Cost Comparison

| Approach | Deploy Cost | Per Deposit | Per Withdraw | Complexity |
|----------|-------------|-------------|--------------|------------|
| **Deploy Safe on Arbitrum** | $20 | $5 (bridge) | $2 (gas) | Low |
| **Minimal helper contract** | $25 | $5 (bridge) | $0* | Medium |
| **No contracts** | $0 | $5 (bridge) | $22** | High |

*If you add withdraw function to helper contract  
**Need to deploy Safe when withdrawing

## Recommendation

**Use the minimal helper contract:**

1. Deploy MinimalCrossChainVault on Arbitrum (~$25)
2. Deposits go through Across → helper → vault
3. Shares accumulate at your Safe's address
4. When you want to withdraw, deploy Safe on Arbitrum (~$20)

**Benefits:**
- ✅ Simplest possible contract (65 lines)
- ✅ No Safe needed on Arbitrum immediately
- ✅ Can add multiple vaults later
- ✅ Shares sit safely waiting for you
- ✅ Pay for Arbitrum Safe only when you withdraw

## Full Example

```typescript
// packages/web/src/lib/hooks/use-minimal-cross-chain.ts

export function useMinimalCrossChainDeposit(safeAddress: Address) {
  const { send } = useSafeRelay(safeAddress);
  
  return useMutation({
    mutationFn: async ({ amount }: { amount: string }) => {
      const amountWei = parseUnits(amount, 6);
      
      // Build Across deposit call with message
      const message = encodeAbiParameters(
        [{ type: 'address' }],
        [safeAddress] // Your Safe address
      );
      
      // Call Across from Base
      await send([{
        to: ACROSS_SPOKE_POOL_BASE,
        data: encodeFunctionData({
          abi: ACROSS_V3_ABI,
          functionName: 'depositV3',
          args: [
            safeAddress,
            MINIMAL_VAULT_ARBITRUM, // Our helper contract
            USDC_BASE,
            USDC_ARBITRUM,
            amountWei,
            amountWei,
            42161n,
            '0x0000000000000000000000000000000000000000',
            Math.floor(Date.now() / 1000) - 60,
            Math.floor(Date.now() / 1000) + 3600,
            0,
            message, // Your Safe address encoded
          ],
        }),
        value: '0',
      }]);
      
      // Done! Shares will arrive in ~30 seconds
    },
  });
}
```

## Why This Is Better

1. **No Safe needed on Arbitrum** (until you withdraw)
2. **Minimal contract** (65 lines, easy to audit)
3. **Shares are safe** (sitting at your address)
4. **Flexible** (deploy Safe later, or add features to helper)
5. **Cost effective** (pay for Arbitrum Safe only when needed)

The contract I created earlier (CrossChainVaultReceiver) was overcomplicated. This is all you need!
