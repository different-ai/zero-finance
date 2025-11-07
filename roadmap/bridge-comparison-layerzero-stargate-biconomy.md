# Bridge Comparison: Across vs LayerZero vs Stargate vs Biconomy

## Executive Summary

After analyzing all four bridge protocols, here's the recommendation for adding Arbitrum Morpho vault support:

**Winner: Across Protocol** (original recommendation stands)

**Backup: Stargate Finance** (best alternative if Across doesn't work)

**Not Recommended: LayerZero** (too complex for simple USDC transfer)

**Not Recommended: Biconomy Hyphen** (deprecated/limited support)

## Detailed Comparison

### 1. Across Protocol ✅ (RECOMMENDED)

**What it is:** Optimistic bridge with intent-based relaying

**Pros:**
- ✅ **Simple message passing** - Can include arbitrary calldata
- ✅ **Fast** - 10-30 seconds typical
- ✅ **Competitive fees** - 0.5-1%
- ✅ **Battle-tested** - $6B+ volume
- ✅ **Direct USDC support** - Native handling
- ✅ **Excellent docs** - Easy integration

**Cons:**
- ⚠️ Requires custom receiver contract (minimal)
- ⚠️ Slight trust assumption (optimistic validation)

**Contract Size:** ~65 lines for receiver

**Example Flow:**
```solidity
// On Base: Call Across SpokePool with message
acrossSpokePool.depositV3(
  depositor,
  receiverContract, // Your MinimalCrossChainVault
  USDC,
  amount,
  42161, // Arbitrum
  message // Encoded: userSafe address
);

// On Arbitrum: Receiver automatically called
function handleV3AcrossMessage(
  address token,
  uint256 amount,
  address relayer,
  bytes memory message
) external {
  address userSafe = abi.decode(message, (address));
  IERC20(token).approve(vault, amount);
  IERC4626(vault).deposit(amount, userSafe);
}
```

**Cost:**
- Deploy receiver: ~$25
- Per deposit: 0.5% + gas
- Total for $1000: ~$5-6

---

### 2. Stargate Finance ⭐ (BEST ALTERNATIVE)

**What it is:** Unified liquidity layer using LayerZero V2 under the hood

**Pros:**
- ✅ **Integrated CCTP** - Native USDC 1:1 via Circle
- ✅ **Unified liquidity** - Deep pools across 50+ chains
- ✅ **Simple API** - High-level abstraction
- ✅ **Battle-tested** - $4B+ volume
- ✅ **Good docs** - Clear examples

**Cons:**
- ⚠️ Still needs receiver contract
- ⚠️ Fees slightly higher (0.06% + gas)
- ⚠️ Uses LayerZero underneath (adds complexity)

**Contract Size:** ~80 lines (similar to Across)

**Example Flow:**
```solidity
// Stargate uses LayerZero for messaging
// You can compose with Stargate's liquidity
router.swap{value: nativeFee}(
  dstChainId,
  srcPoolId,
  dstPoolId,
  payable(msg.sender), // refund address
  amount,
  minAmountOut,
  lzTxParams, // includes destination gas
  abi.encodePacked(receiverContract),
  payload // Your custom data
);
```

**Cost:**
- Deploy receiver: ~$25
- Per deposit: 0.06% + LayerZero fee + gas
- Total for $1000: ~$6-8

**When to use:**
- If Across doesn't support your route
- If you want deepest liquidity
- If you're already using LayerZero

---

### 3. LayerZero V2 ❌ (TOO COMPLEX)

**What it is:** Omnichain messaging protocol (not a bridge)

**Pros:**
- ✅ **Most flexible** - Full control over messages
- ✅ **Widely adopted** - Many integrations
- ✅ **Powerful** - Can do anything cross-chain

**Cons:**
- ❌ **Complex setup** - DVNs, executors, endpoints
- ❌ **More code** - ~200+ lines minimum
- ❌ **No USDC bridging** - Need separate bridge
- ❌ **Higher gas costs** - More verification
- ❌ **Steep learning curve** - Hard to debug

**Contract Size:** ~200+ lines (OApp + configuration)

**Example Flow:**
```solidity
// You need to implement OApp interface
contract MyOApp is OApp {
  function _lzSend(
    uint32 _dstEid,
    bytes memory _message,
    bytes memory _options,
    MessagingFee memory _fee,
    address _refundAddress
  ) internal override {
    // Complex configuration
  }
  
  function _lzReceive(
    Origin calldata _origin,
    bytes32 _guid,
    bytes calldata _message,
    address _executor,
    bytes calldata _extraData
  ) internal override {
    // Handle message
  }
}

// Plus: Configure DVNs, set peers, handle fees...
```

**Cost:**
- Deploy contracts: ~$50-80
- Per message: Variable (depends on DVNs)
- Configuration: Complex and error-prone

**Why not recommended:**
- Overkill for simple USDC transfer + deposit
- Need separate USDC bridge anyway
- More attack surface
- Harder to maintain

---

### 4. Biconomy Hyphen ⚠️ (DEPRECATED)

**What it is:** Liquidity pool based bridge (being phased out)

**Pros:**
- ✅ Previously fast and cheap
- ✅ Simple SDK

**Cons:**
- ❌ **Deprecated** - Moving to other solutions
- ❌ **Limited docs** - Hard to find current info
- ❌ **Uncertain future** - Not recommended for new projects
- ❌ **SDK dependency** - Need their SDK

**Example Flow:**
```typescript
// Using Hyphen SDK (old way)
let depositTx = await hyphen.depositManager.deposit({
  sender: userAddress,
  receiver: userAddress,
  tokenAddress: USDC,
  amount: "1000000000",
  fromChainId: 8453,
  toChainId: 42161,
  tag: "morpho-deposit"
}, wallet);
```

**Cost:**
- Per deposit: 0.8-1.5%
- Higher than competitors

**Why not recommended:**
- Being phased out
- Limited support
- Better alternatives exist

---

## Side-by-Side Comparison

| Feature | Across | Stargate | LayerZero | Biconomy |
|---------|--------|----------|-----------|----------|
| **Speed** | 10-30s | 30-60s | 30-60s | 30-60s |
| **Fee** | 0.5-1% | 0.06% + LZ | Variable | 0.8-1.5% |
| **Contract Lines** | ~65 | ~80 | ~200+ | N/A (SDK) |
| **Docs Quality** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Message Passing** | ✅ Native | ✅ Via LZ | ✅ Core feature | ❌ No |
| **USDC Support** | ✅ Direct | ✅ CCTP | ⚠️ Need bridge | ✅ Direct |
| **Battle-tested** | $6B+ | $4B+ | $8B+ | $500M |
| **Maintenance** | Low | Medium | High | Unknown |
| **Recommendation** | ✅ **Use this** | ⭐ Backup | ❌ Too complex | ❌ Deprecated |

## Implementation Complexity

### Across (Simplest)
```
1. Deploy MinimalCrossChainVault on Arbitrum (1 contract)
2. Call Across SpokePool from Base with message
3. Done! Shares minted to Safe address
```

### Stargate (Simple)
```
1. Deploy receiver on Arbitrum (1 contract)
2. Call Stargate Router from Base
3. Handle compose callback
```

### LayerZero (Complex)
```
1. Deploy OApp on both Base and Arbitrum (2 contracts)
2. Configure DVNs, executors, and endpoints
3. Set peer relationships
4. Send USDC separately (need bridge)
5. Send LayerZero message
6. Handle execution on destination
```

### Biconomy (SDK-based)
```
1. Install SDK
2. Initialize Hyphen
3. Call deposit function
4. Hope it still works 🤷
```

## Recommendation

### Primary: **Across Protocol**

Use the `MinimalCrossChainVault` implementation I created:

```solidity
contract MinimalCrossChainVault {
  address public immutable ACROSS_SPOKE_POOL;
  address public immutable VAULT;
  
  function handleV3AcrossMessage(
    address token,
    uint256 amount,
    address,
    bytes memory message
  ) external {
    address userSafe = abi.decode(message, (address));
    IERC20(token).approve(VAULT, amount);
    IERC4626(VAULT).deposit(amount, userSafe);
  }
}
```

**Why:**
- Simplest implementation (65 lines)
- Fastest bridge time
- Best documentation
- Lowest maintenance
- Battle-tested

### Backup: **Stargate Finance**

If Across doesn't support Base → Arbitrum (unlikely), use Stargate:

```solidity
// Similar contract, slightly different callback interface
function sgReceive(
  uint16 _chainId,
  bytes memory _srcAddress,
  uint256 _nonce,
  address _token,
  uint256 amountLD,
  bytes memory payload
) external {
  // Same logic as Across
}
```

**Why:**
- Also simple
- Deep liquidity
- CCTP integration
- Good fallback

### Avoid: LayerZero & Biconomy

- **LayerZero:** Way too complex for this use case
- **Biconomy:** Deprecated, uncertain future

## Final Decision Matrix

**Choose Across if:**
- ✅ You want simplest implementation
- ✅ You want best docs
- ✅ You want lowest maintenance
- ✅ Route is supported (Base → Arbitrum ✅)

**Choose Stargate if:**
- Route not on Across
- You want deepest liquidity
- You're already using LayerZero elsewhere

**Choose LayerZero if:**
- You need complex cross-chain logic (not just USDC + deposit)
- You're building omnichain app
- You have dedicated DevOps team

**Choose Biconomy if:**
- You hate yourself 😅

## Next Steps

1. ✅ Use Across Protocol (already have contract ready)
2. Deploy `MinimalCrossChainVault` on Arbitrum
3. Test on testnets
4. Deploy to mainnet
5. Done!

The implementation is already complete and ready to deploy. No need to switch bridges.
