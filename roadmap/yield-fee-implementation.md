# Yield Fee Collection & Vault Allocation

## Overview

Implementation plan for 10% protocol fee on generated yield and multi-vault allocation strategy for Zero Finance.

## Architecture

```
User deposits → Safe → FluidkeyEarnModule → ERC4626 Vaults (Aave, Compound, etc.)
                                              ↓
                          On withdraw ← Calculate realized yield
                                         ↓
                          90% to user | 10% to protocol treasury
```

## Current State

- ✅ FluidkeyEarnModule audited by Ackee (March 2025)
- ✅ ERC-4626 vault integration working
- ✅ Config-based vault mapping per token/chain
- ⚠️ No fee collection mechanism
- ⚠️ No yield tracking

## Implementation Strategy

### Phase 1: Add Yield Tracking & Fee Collection

#### Changes to `FluidkeyEarnModule.sol`

**New State Variables:**

```solidity
/// @notice Tracks principal deposits per Safe per token
mapping(address => mapping(address => uint256)) public depositedPrincipal;

/// @notice Protocol treasury address for fee collection
address public treasuryAddress;

/// @notice Protocol fee in basis points (1000 = 10%)
uint256 public constant FEE_BASIS_POINTS = 1000;
```

**Updated `_autoEarn` Function:**

Track principal on deposit:

```solidity
function _autoEarn(address token, uint256 amountToSave, address safe) private {
    // ... existing code ...

    // Track principal after successful deposit
    depositedPrincipal[safe][token] += amountToSave;

    emit AutoEarnExecuted(safe, token, amountToSave);
}
```

**New `autoWithdraw` Function:**

Calculate and collect fees on withdrawal:

```solidity
/**
 * @dev Withdraws assets from vault and collects protocol fee on yield
 * @param token The address of the token to withdraw
 * @param sharesToWithdraw Amount of vault shares to redeem
 * @param safe Address of the user's Safe
 */
function autoWithdraw(
    address token,
    uint256 sharesToWithdraw,
    address safe
) external onlyAuthorizedRelayer {
    if (!isInitialized(safe)) revert ModuleNotInitialized(safe);

    // Get vault address from config
    uint256 configHash_ = accountConfig[safe];
    address vaultAddress = config[configHash_][block.chainid][token];
    if (vaultAddress == address(0)) revert ConfigNotFound(token);

    Safe safeInstance = Safe(safe);
    IERC4626 vault = IERC4626(vaultAddress);

    // Preview withdrawal amount
    uint256 totalAssets = vault.previewRedeem(sharesToWithdraw);
    uint256 principal = depositedPrincipal[safe][token];

    // Calculate yield (only if positive)
    uint256 yield = totalAssets > principal ? totalAssets - principal : 0;
    uint256 protocolFee = (yield * FEE_BASIS_POINTS) / 10000;

    // Redeem shares from vault to Safe
    bool redeemSuccess = safeInstance.execTransactionFromModule(
        address(vault),
        0,
        abi.encodeWithSelector(
            IERC4626.redeem.selector,
            sharesToWithdraw,
            safe,
            safe
        ),
        0
    );
    if (!redeemSuccess) revert("Failed to redeem vault shares");

    // Transfer protocol fee to treasury
    if (protocolFee > 0) {
        bool feeTransferSuccess = safeInstance.execTransactionFromModule(
            token,
            0,
            abi.encodeWithSelector(
                IERC20.transfer.selector,
                treasuryAddress,
                protocolFee
            ),
            0
        );
        if (!feeTransferSuccess) revert("Failed to transfer protocol fee");
    }

    // Update tracked principal
    uint256 withdrawnPrincipal = totalAssets - yield;
    if (withdrawnPrincipal >= depositedPrincipal[safe][token]) {
        depositedPrincipal[safe][token] = 0;
    } else {
        depositedPrincipal[safe][token] -= withdrawnPrincipal;
    }

    emit AutoWithdrawExecuted(safe, token, totalAssets, protocolFee);
}
```

**New Events:**

```solidity
/// @dev Emitted when a withdrawal has been executed from the vault
event AutoWithdrawExecuted(
    address indexed smartAccount,
    address indexed token,
    uint256 totalAmount,
    uint256 protocolFee
);

/// @dev Emitted when treasury address is updated
event TreasuryUpdated(address oldTreasury, address newTreasury);
```

**Treasury Management:**

```solidity
/**
 * @dev Sets the treasury address for fee collection
 * @param newTreasury Address of the protocol treasury
 */
function setTreasury(address newTreasury) external onlyOwner {
    if (newTreasury == address(0)) revert("Invalid treasury address");
    address oldTreasury = treasuryAddress;
    treasuryAddress = newTreasury;
    emit TreasuryUpdated(oldTreasury, newTreasury);
}
```

### Phase 2: Multi-Vault Allocation

#### Strategy Selection (Off-Chain)

The relayer backend determines optimal allocation based on:

1. **Current APY** - Query vault yields from subgraphs/APIs
2. **Liquidity depth** - Ensure vaults can handle deposit size
3. **Risk profile** - Diversify across protocols
4. **Gas costs** - Batch operations when possible

#### Example Allocation Logic (TypeScript)

```typescript
interface VaultStrategy {
  token: string;
  vaults: Array<{
    address: string;
    protocol: string;
    weight: number; // percentage 0-100
    currentAPY: number;
  }>;
}

const USDC_STRATEGY: VaultStrategy = {
  token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  vaults: [
    {
      address: '0xAave_USDC_Vault',
      protocol: 'Aave',
      weight: 40,
      currentAPY: 3.2,
    },
    {
      address: '0xCompound_USDC_Vault',
      protocol: 'Compound',
      weight: 35,
      currentAPY: 3.5,
    },
    {
      address: '0xYearn_USDC_Vault',
      protocol: 'Yearn',
      weight: 25,
      currentAPY: 4.1,
    },
  ],
};

async function allocateDeposit(
  token: string,
  amount: bigint,
  safeAddress: string,
) {
  const strategy = getStrategyForToken(token);

  for (const vault of strategy.vaults) {
    const allocatedAmount = (amount * BigInt(vault.weight)) / 100n;

    await fluidkeyModule.autoEarn(
      token,
      allocatedAmount,
      safeAddress,
      vault.address,
    );
  }
}
```

#### Rebalancing Strategy

Periodic rebalancing to maintain optimal yield:

```solidity
/**
 * @dev Rebalances assets between vaults
 * @param token Token to rebalance
 * @param safe User's Safe address
 * @param fromVault Source vault to withdraw from
 * @param toVault Destination vault to deposit to
 * @param shares Amount of shares to move
 */
function rebalance(
    address token,
    address safe,
    address fromVault,
    address toVault,
    uint256 shares
) external onlyAuthorizedRelayer {
    // Withdraw from source vault
    // Deposit to destination vault
    // No fee taken during rebalancing
}
```

## Implementation Timeline

### Week 1: Core Fee Logic

- [ ] Add state variables for principal tracking
- [ ] Implement `autoWithdraw` function
- [ ] Add treasury management functions
- [ ] Unit tests for fee calculations

### Week 2: Multi-Vault Support

- [ ] Update config schema to support multiple vaults per token
- [ ] Implement allocation logic in relayer
- [ ] Add rebalancing function
- [ ] Integration tests

### Week 3: Security & Audit Prep

- [ ] Edge case testing (losses, partial withdrawals)
- [ ] Gas optimization
- [ ] Prepare audit documentation
- [ ] Internal security review

### Week 4: Deployment

- [ ] Deploy updated module to testnet
- [ ] Run end-to-end tests
- [ ] Deploy to mainnet
- [ ] Monitor first transactions

## Security Considerations

### Critical Checks

1. **Principal Tracking Accuracy**
   - Principal must be tracked per-deposit
   - Handle multiple deposits before withdrawal
   - Account for partial withdrawals

2. **Fee Calculation Safety**
   - Only charge fees on positive yield
   - Protect against vault losses
   - Prevent fee double-counting

3. **Reentrancy Protection**
   - All external calls are through Safe's `execTransactionFromModule`
   - Safe provides reentrancy protection

4. **Access Control**
   - Only authorized relayers can trigger withdrawals
   - Treasury updates require owner role

### Edge Cases

**Scenario 1: Vault Loss**

```
Principal: 1000 USDC
Withdrawal: 950 USDC (vault lost 5%)
Fee: 0 (no yield generated)
User receives: 950 USDC
```

**Scenario 2: Multiple Deposits**

```
Deposit 1: 1000 USDC → Principal: 1000
Deposit 2: 500 USDC  → Principal: 1500
Withdraw: 1600 USDC  → Yield: 100 USDC
Fee: 10 USDC
User receives: 1590 USDC
```

**Scenario 3: Partial Withdrawal**

```
Principal: 1000 USDC
Current Value: 1100 USDC
Withdraw 50% shares → 550 USDC
Yield on this withdrawal: 50 USDC
Fee: 5 USDC
Remaining Principal: 500 USDC
```

## Alternative Approaches Considered

### Option 2: Fee-Taking Wrapper Vault

**Pros:**

- More transparent for users
- Composable with other protocols
- Could be used by other projects

**Cons:**

- Requires new audit (expensive)
- More complex to maintain
- Extra gas costs from wrapper layer
- Breaks compatibility with existing module

**Verdict:** Not recommended. Option 1 (module-based fees) is simpler and leverages existing audited code.

## Open Questions

1. **Fee Withdrawal Frequency**
   - Collect on every user withdrawal? (simple)
   - Batch collect periodically? (gas efficient but complex)

2. **Fee Token Handling**
   - Always collect in deposited token?
   - Auto-swap to stablecoin?
   - Auto-compound to treasury vault?

3. **Governance**
   - Should fee % be adjustable?
   - Should require timelock/governance vote?

4. **User Experience**
   - Show estimated fees in UI before withdrawal?
   - Separate "Withdraw" vs "Withdraw All"?
   - Display yield vs principal breakdown?

## Success Metrics

- [ ] No security incidents in first 3 months
- [ ] Average yield optimization: >20% APY improvement vs single-vault
- [ ] Fee collection: $X per month by month 3
- [ ] User satisfaction: >4.5/5 on fee transparency
- [ ] Gas costs: <5% of transaction value

## References

- [ERC-4626 Standard](https://eips.ethereum.org/EIPS/eip-4626)
- [Ackee Audit Report](/packages/fluidkey-earn-module/audits/ackee-blockchain-fluidkey-earn-module-report.pdf)
- [FluidkeyEarnModule Source](/packages/fluidkey-earn-module/src/FluidkeyEarnModule.sol)
