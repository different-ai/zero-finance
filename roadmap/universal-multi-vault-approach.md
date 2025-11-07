# Universal Multi-Vault Approach: Zero Redeployment

## The Problem You Want to Solve

"I want to deposit to ANY Morpho vault on ANY chain without deploying a new contract every time I add a vault."

## The Solution

Deploy **one receiver contract per chain**. That one contract can handle **unlimited vaults**.

```
┌─────────────────────────────────────────────────────────┐
│                    BASE (Source Chain)                  │
│                                                         │
│  UniversalVaultRouter (deploy ONCE)                    │
│  ├─> Can send to Arbitrum                              │
│  ├─> Can send to Optimism                              │
│  ├─> Can send to Polygon                               │
│  └─> Can send to any chain you configure               │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Message: (userSafe, vaultAddress, minShares)
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        v                v                v
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  ARBITRUM   │  │  OPTIMISM   │  │  POLYGON    │
│             │  │             │  │             │
│ Universal   │  │ Universal   │  │ Universal   │
│ Receiver    │  │ Receiver    │  │ Receiver    │
│ (1 contract)│  │ (1 contract)│  │ (1 contract)│
│             │  │             │  │             │
│ ├─ Vault A  │  │ ├─ Vault A  │  │ ├─ Vault A  │
│ ├─ Vault B  │  │ ├─ Vault B  │  │ ├─ Vault B  │
│ ├─ Vault C  │  │ ├─ Vault C  │  │ ├─ Vault C  │
│ └─ Vault... │  │ └─ Vault... │  │ └─ Vault... │
│             │  │             │  │             │
│  UNLIMITED! │  │  UNLIMITED! │  │  UNLIMITED! │
└─────────────┘  └─────────────┘  └─────────────┘
```

## Key Insight: Dynamic Vault Address

Instead of hardcoding vault addresses in the contract, **pass the vault address in the message**:

```solidity
// ❌ OLD WAY (Bad - need to redeploy for each vault)
contract VaultReceiver {
  address public immutable VAULT = 0x7e97...; // Hardcoded!
  
  function handleMessage(...) {
    IERC4626(VAULT).deposit(amount, user); // Can only use this one vault
  }
}

// ✅ NEW WAY (Good - works with any vault)
contract UniversalVaultReceiver {
  function handleV3AcrossMessage(
    address token,
    uint256 amount,
    address,
    bytes memory message
  ) external {
    // Decode vault address from message
    (address userSafe, address vault, uint256 minShares) = 
      abi.decode(message, (address, address, uint256));
    
    // Deposit to ANY vault!
    IERC20(token).approve(vault, amount);
    IERC4626(vault).deposit(amount, userSafe);
  }
}
```

## Complete Implementation

### Smart Contract (Deploy Once Per Chain)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {IERC4626} from "forge-std/interfaces/IERC4626.sol";

/**
 * @title UniversalVaultReceiver
 * @notice Works with ANY ERC4626 vault - deploy once per chain!
 */
contract UniversalVaultReceiver {
    address public immutable ACROSS_SPOKE_POOL;
    address public owner;
    bool public allowAllVaults; // true = any vault, false = whitelist only
    mapping(address => bool) public allowedVaults;
    
    event VaultDeposit(
        address indexed userSafe,
        address indexed vault,
        uint256 assets,
        uint256 shares
    );
    
    constructor(
        address _acrossSpokePool,
        address _owner,
        bool _allowAllVaults
    ) {
        ACROSS_SPOKE_POOL = _acrossSpokePool;
        owner = _owner;
        allowAllVaults = _allowAllVaults;
    }
    
    /**
     * @notice Receives tokens and deposits to ANY vault
     * @param token Token received (USDC, etc)
     * @param amount Amount received
     * @param message Encoded: (userSafe, vaultAddress, minSharesOut)
     */
    function handleV3AcrossMessage(
        address token,
        uint256 amount,
        address,
        bytes memory message
    ) external {
        require(msg.sender == ACROSS_SPOKE_POOL, "Unauthorized");
        
        // Decode message - vault address is passed dynamically!
        (address userSafe, address vault, uint256 minSharesOut) = 
            abi.decode(message, (address, address, uint256));
        
        // Optional security: check if vault is allowed
        require(
            allowAllVaults || allowedVaults[vault],
            "Vault not allowed"
        );
        
        // Approve and deposit to the specified vault
        IERC20(token).approve(vault, amount);
        uint256 shares = IERC4626(vault).deposit(amount, userSafe);
        
        require(shares >= minSharesOut, "Slippage");
        
        emit VaultDeposit(userSafe, vault, amount, shares);
    }
    
    // Owner can whitelist vaults if allowAllVaults = false
    function setVaultAllowed(address vault, bool allowed) external {
        require(msg.sender == owner, "Unauthorized");
        allowedVaults[vault] = allowed;
    }
    
    function setAllowAllVaults(bool _allow) external {
        require(msg.sender == owner, "Unauthorized");
        allowAllVaults = _allow;
    }
}
```

That's it! **~80 lines of code**. Deploy this once on Arbitrum, and it works with **every Morpho vault on Arbitrum**.

## Frontend: Just Update the Registry

```typescript
// packages/web/src/server/earn/vault-registry.ts

export interface Vault {
  id: string;
  name: string;
  address: Address;
  chainId: number;
  // ... other fields
}

// Just add vaults to this array - NO contract deployment needed!
export const ALL_VAULTS: Vault[] = [
  // Arbitrum vaults
  {
    id: 'morpho-arb-gauntlet-usdc',
    name: 'Gauntlet USDC Core',
    address: '0x7e97fa6893871A2751B5fE961978DCCb2c201E65',
    chainId: 42161, // Arbitrum
  },
  {
    id: 'morpho-arb-steakhouse-usdc',
    name: 'Steakhouse USDC',
    address: '0x...', // Different vault, same chain
    chainId: 42161, // Arbitrum
  },
  {
    id: 'morpho-arb-another-vault',
    name: 'Another Vault',
    address: '0x...', // Another vault, same chain
    chainId: 42161, // Arbitrum
  },
  
  // Optimism vaults (using same pattern)
  {
    id: 'morpho-op-vault-a',
    name: 'Vault A',
    address: '0x...',
    chainId: 10, // Optimism
  },
  
  // Polygon vaults
  {
    id: 'morpho-poly-vault-a',
    name: 'Vault A',
    address: '0x...',
    chainId: 137, // Polygon
  },
  
  // Add as many as you want - ZERO deployment cost!
];
```

## Deposit Flow (Any Vault)

```typescript
// User selects "Gauntlet USDC Core on Arbitrum"
const vault = ALL_VAULTS.find(v => v.id === 'morpho-arb-gauntlet-usdc');

// Encode message with vault address
const message = encodeAbiParameters(
  [
    { type: 'address', name: 'userSafe' },
    { type: 'address', name: 'vaultAddress' }, // <-- Dynamic!
    { type: 'uint256', name: 'minSharesOut' },
  ],
  [
    safeAddress,
    vault.address, // Pass vault address in message
    minSharesOut,
  ]
);

// Call Across with the message
await safeOnBase.sendTransaction([{
  to: ACROSS_SPOKE_POOL_BASE,
  data: encodeFunctionData({
    abi: ACROSS_V3_ABI,
    functionName: 'depositV3',
    args: [
      safeAddress,
      UNIVERSAL_RECEIVER_ARBITRUM, // Same receiver for ALL vaults
      USDC_BASE,
      USDC_ARBITRUM,
      amount,
      amount,
      42161n,
      '0x0000000000000000000000000000000000000000',
      quoteTimestamp,
      fillDeadline,
      0,
      message, // <-- Contains vault address
    ],
  }),
  value: '0',
}]);

// 30 seconds later...
// UniversalVaultReceiver on Arbitrum:
// 1. Decodes message to get vault address
// 2. Deposits to that specific vault
// 3. Shares minted to user's Safe address
```

## Withdrawal Flow (Any Vault)

### Option 1: Deploy Safe When Profitable

```typescript
// User has shares across multiple vaults on Arbitrum:
// - Vault A: 1000 USDC
// - Vault B: 2000 USDC
// - Vault C: 500 USDC
// Total: 3500 USDC worth of shares

// When total > $500-1000, deploy Safe on Arbitrum (~$20)
deployCounterfactualSafe(safeAddress, arbitrum);

// Now Safe can withdraw from ANY vault:
await safeOnArbitrum.sendTransaction([{
  to: VAULT_A_ADDRESS,
  data: encodeFunctionData({
    abi: ERC4626_ABI,
    functionName: 'withdraw',
    args: [amount, safeAddress, safeAddress],
  }),
  value: '0',
}]);

// Or withdraw from Vault B, C, etc - all from same Safe!
```

### Option 2: Universal Withdrawal Helper (Future)

```solidity
// Add to UniversalVaultReceiver:
function withdrawAndBridge(
  address vault, // <-- Dynamic vault address!
  uint256 shares,
  address userSafe,
  bytes memory signature
) external {
  // Verify signature
  require(verifySignature(userSafe, signature), "Invalid");
  
  // Transfer shares from user's address to this contract
  IERC20(vault).transferFrom(userSafe, address(this), shares);
  
  // Redeem from the specified vault
  uint256 assets = IERC4626(vault).redeem(shares, address(this), address(this));
  
  // Bridge back to Base
  bridgeToBase(assets, userSafe);
}
```

## Adding New Vaults: The Magic

### Scenario 1: New Vault on Existing Chain

```
# New Morpho vault launches on Arbitrum
Vault address: 0xNEWVAULT...

# What you need to do:
1. Add to frontend registry ✅ (1 line of code)
2. Deploy new contract? ❌ NO!
3. Cost? $0

# Done! Users can now deposit to it.
```

### Scenario 2: New Chain

```
# You want to support Polygon

# What you need to do:
1. Deploy UniversalVaultReceiver on Polygon (~$1 gas)
2. Configure Base router to know about Polygon receiver
3. Add Polygon vaults to registry

# Cost: ~$5 one-time
# All future Polygon vaults: FREE
```

## Comparison: Old vs New Approach

### Old Approach (Bad)

```
Vault A on Arbitrum → Deploy contract A → $25
Vault B on Arbitrum → Deploy contract B → $25
Vault C on Arbitrum → Deploy contract C → $25
Total: $75 + maintenance hell
```

### New Approach (Good)

```
All vaults on Arbitrum → Deploy once → $25
Add Vault A → Update registry → $0
Add Vault B → Update registry → $0
Add Vault C → Update registry → $0
Add Vault D, E, F, Z... → $0
Total: $25 for UNLIMITED vaults!
```

## Security Considerations

### Option 1: Allow All Vaults (Permissionless)

```solidity
constructor(..., true) // allowAllVaults = true
```

**Pros:**
- ✅ Truly permissionless - works with ANY vault
- ✅ Zero maintenance - just add to registry
- ✅ Maximum flexibility

**Risks:**
- ⚠️ Malicious vaults could drain bridged funds
- ⚠️ Need to trust users only deposit to legit vaults

**Mitigation:**
- Frontend only shows vetted vaults
- Users can still use any vault via direct contract interaction

### Option 2: Whitelist (Curated)

```solidity
constructor(..., false) // allowAllVaults = false

// Manually whitelist each vault
receiver.setVaultAllowed(VAULT_A, true);
receiver.setVaultAllowed(VAULT_B, true);
```

**Pros:**
- ✅ Maximum security - only approved vaults
- ✅ Protects users from malicious vaults

**Cons:**
- ⚠️ Need manual approval for each vault
- ⚠️ Less permissionless

**Recommendation:** Start with whitelist (false), then switch to permissionless (true) once battle-tested.

## Cost Summary

| Action | Old Approach | New Approach | Savings |
|--------|--------------|--------------|---------|
| Deploy receiver on Arbitrum | $25 per vault | $25 once | - |
| Add 2nd vault on Arbitrum | $25 | $0 | $25 |
| Add 3rd vault on Arbitrum | $25 | $0 | $25 |
| Add 10 vaults on Arbitrum | $250 | $25 | **$225** |
| Add 100 vaults on Arbitrum | $2,500 | $25 | **$2,475** |

## Implementation Checklist

### Phase 1: Deploy Core (One-time)
- [ ] Deploy UniversalVaultRouter on Base (~$30)
- [ ] Deploy UniversalVaultReceiver on Arbitrum (~$25)
- [ ] Configure router with receiver address
- [ ] Test with one vault

### Phase 2: Add Vaults (Free!)
- [ ] Add Gauntlet USDC Core to registry
- [ ] Add Steakhouse USDC to registry
- [ ] Add any other Arbitrum vaults
- [ ] No deployment needed!

### Phase 3: Scale to More Chains
- [ ] Deploy UniversalVaultReceiver on Optimism (~$25)
- [ ] Deploy UniversalVaultReceiver on Polygon (~$1)
- [ ] Add vaults from those chains to registry
- [ ] Each chain: one-time cost, unlimited vaults

## The Bottom Line

**Deploy 1 contract per chain → Support unlimited vaults on that chain**

This is the **most scalable** way to support multiple vaults across multiple chains. You'll never need to redeploy for new vaults - just update your frontend registry!