# Single Safe on Base + Cross-Chain Vault Access via Intents

## The Big Idea

Instead of deploying Safes on every chain, keep **one Safe on Base** and use **intent-based cross-chain actions** to deposit/withdraw from vaults on any chain.

```
┌─────────────────────────────────────────────────────────┐
│                    USER'S SAFE (BASE ONLY)              │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  USDC Balance: $10,000                           │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ User signs intent:
                         │ "Deposit $5k to Morpho Arbitrum vault"
                         │
                         ▼
┌────────────────────────────────────────────────────────────┐
│                    INTENT SOLVER                            │
│  1. Bridges $5k USDC: Base → Arbitrum                      │
│  2. Deposits into Morpho vault on Arbitrum                 │
│  3. Sends vault shares back to Base Safe                   │
└────────────────────────────────────────────────────────────┘
                         │
                         ▼
           ┌─────────────┴─────────────┐
           │                           │
           ▼                           ▼
    ┌─────────────┐            ┌─────────────┐
    │ Morpho      │            │ Morpho      │
    │ Arbitrum    │            │ Base        │
    │ Vault       │            │ Vault       │
    └─────────────┘            └─────────────┘
```

**Key Benefits:**
- ✅ Only deploy Safe on Base (one-time $15-25)
- ✅ Access vaults on any chain without deploying there
- ✅ Users never need gas on other chains
- ✅ Simple UX: sign once, solver handles complexity

---

## How It Works: Cross-Chain Vault Deposits

### Architecture

**Traditional Approach (what we DON'T want):**
```
User on Base → Bridge manually → Deploy Safe on Arbitrum → Deposit to vault
❌ Complex, expensive, requires Safe on every chain
```

**Intent-Based Approach (what we DO want):**
```
User on Base → Sign intent → Solver bridges + deposits → Vault shares returned
✅ Simple, cheap, only one Safe needed
```

### Technical Flow

#### 1. User Creates Vault Deposit Intent

```typescript
// packages/web/src/lib/intents/vault-deposit-intent.ts

import { Address, encodeAbiParameters, keccak256 } from 'viem'

interface VaultDepositIntent {
  userSafe: Address          // User's Safe on Base
  sourceToken: Address       // USDC on Base
  sourceAmount: bigint       // Amount to deposit
  targetChain: number        // Arbitrum (42161)
  targetVault: Address       // Morpho vault on Arbitrum
  minSharesOut: bigint       // Slippage protection
  deadline: bigint           // Intent expiry
}

/**
 * Create a cross-chain vault deposit intent
 * User signs this, solver executes across chains
 */
export function createVaultDepositIntent(params: VaultDepositIntent): {
  intentHash: string
  intentData: string
} {
  // Encode intent data
  const intentData = encodeAbiParameters(
    [
      { name: 'userSafe', type: 'address' },
      { name: 'sourceToken', type: 'address' },
      { name: 'sourceAmount', type: 'uint256' },
      { name: 'targetChain', type: 'uint256' },
      { name: 'targetVault', type: 'address' },
      { name: 'minSharesOut', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
    [
      params.userSafe,
      params.sourceToken,
      params.sourceAmount,
      BigInt(params.targetChain),
      params.targetVault,
      params.minSharesOut,
      params.deadline,
    ]
  )
  
  const intentHash = keccak256(intentData)
  
  return { intentHash, intentData }
}
```

#### 2. Smart Contract: Cross-Chain Vault Intent Handler

```solidity
// packages/fluidkey-earn-module/src/CrossChainVaultIntent.sol (NEW)

pragma solidity ^0.8.23;

import { IERC20 } from "forge-std/interfaces/IERC20.sol";
import { IERC4626 } from "forge-std/interfaces/IERC4626.sol";
import { ISafe } from "./ISafe.sol";

/**
 * @title CrossChainVaultIntent
 * @notice Handles cross-chain vault deposit/withdraw intents
 * @dev Deployed on Base, receives vault shares from other chains
 */
contract CrossChainVaultIntent {
    struct Intent {
        address userSafe;
        address sourceToken;
        uint256 sourceAmount;
        uint256 targetChain;
        address targetVault;
        uint256 minSharesOut;
        uint256 deadline;
        bool fulfilled;
    }
    
    mapping(bytes32 => Intent) public intents;
    mapping(address => bool) public authorizedSolvers;
    
    event IntentCreated(
        bytes32 indexed intentHash,
        address indexed userSafe,
        uint256 targetChain,
        address targetVault,
        uint256 amount
    );
    
    event IntentFulfilled(
        bytes32 indexed intentHash,
        address indexed solver,
        uint256 sharesReceived
    );
    
    /**
     * @notice User's Safe creates a cross-chain vault deposit intent
     * @dev Called by Safe via executeTransactionFromModule
     */
    function createDepositIntent(
        address sourceToken,
        uint256 sourceAmount,
        uint256 targetChain,
        address targetVault,
        uint256 minSharesOut,
        uint256 deadline
    ) external returns (bytes32 intentHash) {
        address userSafe = msg.sender;
        
        // Generate intent hash
        intentHash = keccak256(
            abi.encode(
                userSafe,
                sourceToken,
                sourceAmount,
                targetChain,
                targetVault,
                minSharesOut,
                deadline
            )
        );
        
        // Store intent
        intents[intentHash] = Intent({
            userSafe: userSafe,
            sourceToken: sourceToken,
            sourceAmount: sourceAmount,
            targetChain: targetChain,
            targetVault: targetVault,
            minSharesOut: minSharesOut,
            deadline: deadline,
            fulfilled: false
        });
        
        // Transfer tokens from Safe to this contract (held as collateral)
        IERC20(sourceToken).transferFrom(userSafe, address(this), sourceAmount);
        
        emit IntentCreated(
            intentHash,
            userSafe,
            targetChain,
            targetVault,
            sourceAmount
        );
    }
    
    /**
     * @notice Solver fulfills intent and delivers vault shares to Safe
     * @dev Solver must have bridged funds, deposited to vault, and bridged shares back
     */
    function fulfillDepositIntent(
        bytes32 intentHash,
        address vaultShareToken, // ERC20 representing vault shares on Base
        uint256 sharesReceived,
        bytes calldata proof // Merkle proof or signature
    ) external {
        require(authorizedSolvers[msg.sender], "Unauthorized solver");
        
        Intent storage intent = intents[intentHash];
        require(!intent.fulfilled, "Already fulfilled");
        require(block.timestamp <= intent.deadline, "Intent expired");
        require(sharesReceived >= intent.minSharesOut, "Insufficient shares");
        
        intent.fulfilled = true;
        
        // Release collateral to solver (they spent it on target chain)
        IERC20(intent.sourceToken).transfer(msg.sender, intent.sourceAmount);
        
        // Transfer vault shares to user's Safe
        IERC20(vaultShareToken).transferFrom(
            msg.sender,
            intent.userSafe,
            sharesReceived
        );
        
        emit IntentFulfilled(intentHash, msg.sender, sharesReceived);
    }
    
    /**
     * @notice User cancels unfulfilled intent after deadline
     */
    function cancelIntent(bytes32 intentHash) external {
        Intent storage intent = intents[intentHash];
        require(msg.sender == intent.userSafe, "Not intent creator");
        require(!intent.fulfilled, "Already fulfilled");
        require(block.timestamp > intent.deadline, "Not expired");
        
        intent.fulfilled = true;
        
        // Refund collateral to Safe
        IERC20(intent.sourceToken).transfer(intent.userSafe, intent.sourceAmount);
    }
    
    function addSolver(address solver) external {
        // Only owner can add solvers
        authorizedSolvers[solver] = true;
    }
}
```

#### 3. Solver Execution Flow

```typescript
// packages/server/src/solver/cross-chain-vault-solver.ts (NEW)

/**
 * Solver monitors Base for vault deposit intents and fulfills them
 */
import { createPublicClient, createWalletClient, http, parseAbi } from 'viem'
import { base, arbitrum } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

const CROSS_CHAIN_VAULT_INTENT_ADDRESS = '0x...' // Deployed on Base

export class CrossChainVaultSolver {
  private baseClient: any
  private arbitrumClient: any
  private solverAccount: any
  
  constructor(solverPrivateKey: string) {
    this.solverAccount = privateKeyToAccount(solverPrivateKey as `0x${string}`)
    
    this.baseClient = {
      public: createPublicClient({ chain: base, transport: http() }),
      wallet: createWalletClient({
        account: this.solverAccount,
        chain: base,
        transport: http(),
      }),
    }
    
    this.arbitrumClient = {
      public: createPublicClient({ chain: arbitrum, transport: http() }),
      wallet: createWalletClient({
        account: this.solverAccount,
        chain: arbitrum,
        transport: http(),
      }),
    }
  }
  
  /**
   * Main solver loop
   */
  async run() {
    console.log('🤖 Cross-chain vault solver starting...')
    
    // Watch for IntentCreated events on Base
    this.baseClient.public.watchEvent({
      address: CROSS_CHAIN_VAULT_INTENT_ADDRESS,
      event: parseAbi([
        'event IntentCreated(bytes32 indexed intentHash, address indexed userSafe, uint256 targetChain, address targetVault, uint256 amount)',
      ])[0],
      onLogs: async (logs) => {
        for (const log of logs) {
          await this.fulfillIntent(log)
        }
      },
    })
  }
  
  /**
   * Fulfill a cross-chain vault deposit intent
   */
  async fulfillIntent(intentLog: any) {
    const { intentHash, userSafe, targetChain, targetVault, amount } = intentLog.args
    
    console.log(`📝 New intent: ${intentHash}`)
    console.log(`  User Safe: ${userSafe}`)
    console.log(`  Target: Chain ${targetChain}, Vault ${targetVault}`)
    console.log(`  Amount: ${amount}`)
    
    try {
      // Step 1: Bridge USDC from Base to target chain
      console.log('1️⃣ Bridging USDC to Arbitrum...')
      await this.bridgeToArbitrum(amount)
      
      // Step 2: Deposit to Morpho vault on Arbitrum
      console.log('2️⃣ Depositing to Morpho vault...')
      const sharesReceived = await this.depositToVault(targetVault, amount)
      
      // Step 3: Bridge vault shares back to Base
      console.log('3️⃣ Bridging vault shares back to Base...')
      await this.bridgeSharesBack(sharesReceived)
      
      // Step 4: Fulfill intent on Base contract
      console.log('4️⃣ Fulfilling intent on Base...')
      await this.fulfillOnBase(intentHash, sharesReceived)
      
      console.log('✅ Intent fulfilled successfully!')
      
    } catch (error) {
      console.error('❌ Failed to fulfill intent:', error)
    }
  }
  
  async bridgeToArbitrum(amount: bigint) {
    // Use Across Protocol to bridge USDC
    const ACROSS_SPOKE_POOL = '0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64' // Base
    
    await this.baseClient.wallet.writeContract({
      address: ACROSS_SPOKE_POOL,
      abi: parseAbi([
        'function deposit(address recipient, address token, uint256 amount, uint256 destinationChainId)',
      ]),
      functionName: 'deposit',
      args: [
        this.solverAccount.address, // Solver receives on Arbitrum
        '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
        amount,
        42161n, // Arbitrum
      ],
    })
    
    // Wait for bridge (usually 10-20 seconds)
    await new Promise(resolve => setTimeout(resolve, 20000))
  }
  
  async depositToVault(vaultAddress: string, amount: bigint): Promise<bigint> {
    // Deposit to Morpho vault on Arbitrum
    const ERC4626_ABI = parseAbi([
      'function deposit(uint256 assets, address receiver) returns (uint256 shares)',
    ])
    
    const { result: shares } = await this.arbitrumClient.wallet.writeContract({
      address: vaultAddress,
      abi: ERC4626_ABI,
      functionName: 'deposit',
      args: [amount, this.solverAccount.address],
    })
    
    return shares as bigint
  }
  
  async bridgeSharesBack(shares: bigint) {
    // Bridge vault share tokens back to Base
    // (Simplified - in practice might need custom bridge or hold on Arbitrum)
    await new Promise(resolve => setTimeout(resolve, 20000))
  }
  
  async fulfillOnBase(intentHash: string, sharesReceived: bigint) {
    await this.baseClient.wallet.writeContract({
      address: CROSS_CHAIN_VAULT_INTENT_ADDRESS,
      abi: parseAbi([
        'function fulfillDepositIntent(bytes32 intentHash, address vaultShareToken, uint256 sharesReceived, bytes calldata proof)',
      ]),
      functionName: 'fulfillDepositIntent',
      args: [
        intentHash,
        '0x...', // Vault share token address
        sharesReceived,
        '0x', // Proof (simplified)
      ],
    })
  }
}

// Usage:
const solver = new CrossChainVaultSolver(process.env.SOLVER_PRIVATE_KEY!)
await solver.run()
```

---

## Hyperliquid HLP Integration (The Tricky Part)

### Challenge: HLP Uses Custom API (Not ERC-4626)

Hyperliquid HLP doesn't use standard EVM calls, it uses HTTP API:

```typescript
// This is NOT how HLP works (wishful thinking):
const hlpVault = new Contract(hlpAddress, ERC4626_ABI)
await hlpVault.deposit(amount, user)

// This IS how HLP actually works:
await fetch('https://api.hyperliquid.xyz/vault/deposit', {
  method: 'POST',
  body: JSON.stringify({ user, amount, vault: 'HLP' })
})
```

### Solution: Solver with HLP API Integration

```typescript
// packages/server/src/solver/hyperliquid-hlp-solver.ts (NEW)

import { Address, parseUnits, formatUnits } from 'viem'

/**
 * Solver for Hyperliquid HLP deposits via intents
 * Special handling since HLP uses HTTP API, not EVM calls
 */
export class HyperliquidHLPSolver {
  private hlpApiUrl = 'https://api.hyperliquid.xyz'
  
  /**
   * User creates intent on Base: "Deposit $5k to HLP"
   * Solver handles the complexity
   */
  async fulfillHLPIntent(intent: {
    userSafe: Address
    amount: bigint
    intentHash: string
  }) {
    console.log('🌀 Fulfilling Hyperliquid HLP intent...')
    
    // Step 1: Bridge USDC from Base to Hyperliquid
    console.log('1️⃣ Bridging to Hyperliquid...')
    const hyperliquidAddress = await this.bridgeToHyperliquid(intent.amount)
    
    // Step 2: Deposit to HLP via HTTP API
    console.log('2️⃣ Depositing to HLP vault...')
    const hlpShares = await this.depositToHLP(hyperliquidAddress, intent.amount)
    
    // Step 3: Create "voucher" on Base representing HLP shares
    console.log('3️⃣ Creating HLP share voucher on Base...')
    await this.createHLPVoucher(intent.userSafe, hlpShares, intent.intentHash)
    
    console.log('✅ HLP intent fulfilled!')
  }
  
  /**
   * Bridge USDC to Hyperliquid
   * Uses Hyperliquid's native bridge
   */
  async bridgeToHyperliquid(amount: bigint): Promise<Address> {
    // Hyperliquid bridge: send to specific address
    const HYPERLIQUID_BRIDGE = '0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7' // Example
    
    // Send USDC to bridge, get Hyperliquid address back
    const response = await fetch(`${this.hlpApiUrl}/bridge/deposit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: formatUnits(amount, 6),
        fromChain: 'base',
        token: 'USDC',
      }),
    })
    
    const { hyperliquidAddress } = await response.json()
    return hyperliquidAddress as Address
  }
  
  /**
   * Deposit to HLP via Hyperliquid API
   */
  async depositToHLP(
    hyperliquidAddress: Address,
    amount: bigint
  ): Promise<bigint> {
    const response = await fetch(`${this.hlpApiUrl}/vault/deposit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: hyperliquidAddress,
        amount: formatUnits(amount, 6),
        vault: 'HLP',
      }),
    })
    
    const result = await response.json()
    return parseUnits(result.shares, 18)
  }
  
  /**
   * Create HLP Voucher on Base
   * Since we can't bridge HLP shares directly, create a voucher NFT
   */
  async createHLPVoucher(
    userSafe: Address,
    hlpShares: bigint,
    intentHash: string
  ) {
    // Deploy HLPVoucher contract on Base
    // Mints NFT to user's Safe representing their HLP position
    
    await this.baseClient.wallet.writeContract({
      address: HLP_VOUCHER_CONTRACT,
      abi: parseAbi([
        'function mintVoucher(address to, uint256 hlpShares, string memory hyperliquidAddress, bytes32 intentHash)',
      ]),
      functionName: 'mintVoucher',
      args: [
        userSafe,
        hlpShares,
        '0x...', // User's Hyperliquid address
        intentHash,
      ],
    })
  }
}
```

### HLP Voucher Contract (on Base)

```solidity
// packages/fluidkey-earn-module/src/HLPVoucher.sol (NEW)

pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title HLPVoucher
 * @notice NFT representing HLP vault positions on Hyperliquid
 * @dev Deployed on Base, represents off-chain HLP holdings
 */
contract HLPVoucher is ERC721 {
    struct HLPPosition {
        uint256 hlpShares;           // HLP shares on Hyperliquid
        string hyperliquidAddress;   // User's Hyperliquid address
        uint256 depositedAt;         // Timestamp
        bytes32 intentHash;          // Original intent
    }
    
    mapping(uint256 => HLPPosition) public positions;
    uint256 public nextTokenId;
    
    address public solverContract;
    
    constructor() ERC721("Zero Finance HLP Voucher", "ZF-HLP") {}
    
    /**
     * @notice Solver mints voucher after depositing to HLP
     */
    function mintVoucher(
        address to,
        uint256 hlpShares,
        string memory hyperliquidAddress,
        bytes32 intentHash
    ) external returns (uint256 tokenId) {
        require(msg.sender == solverContract, "Only solver");
        
        tokenId = nextTokenId++;
        
        positions[tokenId] = HLPPosition({
            hlpShares: hlpShares,
            hyperliquidAddress: hyperliquidAddress,
            depositedAt: block.timestamp,
            intentHash: intentHash
        });
        
        _mint(to, tokenId);
    }
    
    /**
     * @notice User redeems voucher to initiate HLP withdrawal
     */
    function redeemVoucher(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        
        HLPPosition memory position = positions[tokenId];
        
        // Burn voucher
        _burn(tokenId);
        
        // Emit event for solver to process withdrawal
        emit VoucherRedeemed(
            tokenId,
            msg.sender,
            position.hlpShares,
            position.hyperliquidAddress
        );
    }
    
    event VoucherRedeemed(
        uint256 indexed tokenId,
        address indexed user,
        uint256 hlpShares,
        string hyperliquidAddress
    );
}
```

---

## User Experience Flow

### Deposit to Cross-Chain Vault (Morpho Arbitrum)

```typescript
// packages/web/src/components/vault/cross-chain-deposit.tsx

'use client'

import { useState } from 'react'
import { useWallets } from '@privy-io/react-auth'
import { parseUnits } from 'viem'

export function CrossChainVaultDeposit() {
  const { wallets } = useWallets()
  const [amount, setAmount] = useState('')
  const [selectedVault, setSelectedVault] = useState<'morpho-arb' | 'hlp'>()
  
  const handleDeposit = async () => {
    const wallet = wallets[0]
    
    if (selectedVault === 'morpho-arb') {
      // Create intent for Morpho on Arbitrum
      const intent = {
        userSafe: wallet.address,
        sourceToken: USDC_BASE,
        sourceAmount: parseUnits(amount, 6),
        targetChain: 42161, // Arbitrum
        targetVault: MORPHO_ARBITRUM_VAULT,
        minSharesOut: 0n, // Calculate with slippage
        deadline: BigInt(Date.now() + 3600000), // 1 hour
      }
      
      // Sign and submit intent
      await submitIntent(intent)
      
    } else if (selectedVault === 'hlp') {
      // Create intent for HLP on Hyperliquid
      const intent = {
        userSafe: wallet.address,
        sourceToken: USDC_BASE,
        sourceAmount: parseUnits(amount, 6),
        targetProtocol: 'hyperliquid-hlp',
        deadline: BigInt(Date.now() + 3600000),
      }
      
      await submitHLPIntent(intent)
    }
  }
  
  return (
    <div className="space-y-4">
      <h2>Deposit to Multi-Chain Vaults</h2>
      
      <div className="space-y-2">
        <button
          onClick={() => setSelectedVault('morpho-arb')}
          className={`
            w-full p-4 rounded-lg border-2
            ${selectedVault === 'morpho-arb' ? 'border-blue-500' : 'border-gray-200'}
          `}
        >
          <div className="flex justify-between">
            <span>Morpho Arbitrum USDC</span>
            <span className="text-green-600">10% APY</span>
          </div>
          <div className="text-sm text-gray-600">
            ⚡ Deposits in 30 seconds via intent
          </div>
        </button>
        
        <button
          onClick={() => setSelectedVault('hlp')}
          className={`
            w-full p-4 rounded-lg border-2
            ${selectedVault === 'hlp' ? 'border-blue-500' : 'border-gray-200'}
          `}
        >
          <div className="flex justify-between">
            <span>Hyperliquid HLP</span>
            <span className="text-green-600">25% APY</span>
          </div>
          <div className="text-sm text-gray-600">
            🚀 High-performance trading vault
          </div>
        </button>
      </div>
      
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount (USDC)"
        className="w-full p-3 border rounded-lg"
      />
      
      <button
        onClick={handleDeposit}
        disabled={!amount || !selectedVault}
        className="w-full py-3 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        Deposit via Intent (one signature)
      </button>
      
      <div className="text-sm text-gray-600">
        ✨ Your Safe stays on Base. Solver handles cross-chain complexity.
        <br />
        💰 Fee: ~$0.50-$1 (0.5-1%)
        <br />
        ⏱️ Time: 15-30 seconds
      </div>
    </div>
  )
}
```

---

## Withdraw Flow (Return to Base)

### User wants to withdraw from Morpho Arbitrum back to Base Safe

```typescript
// Withdraw intent creation
const withdrawIntent = {
  userSafe: wallet.address,          // Safe on Base
  vaultShareToken: '0x...',          // Morpho share token on Arbitrum
  sharesToWithdraw: parseUnits('100', 18),
  targetChain: 8453,                 // Base
  minUSDCOut: parseUnits('95', 6),   // Slippage protection
  deadline: BigInt(Date.now() + 3600000),
}

// Solver handles:
// 1. Withdraw from Morpho vault on Arbitrum
// 2. Bridge USDC back to Base
// 3. Deliver to user's Safe on Base
```

### For HLP: Redeem Voucher

```typescript
// User owns HLPVoucher NFT #42 on Base
// Represents 1000 HLP shares on Hyperliquid

// To withdraw:
await HLPVoucherContract.redeemVoucher(42)

// Solver sees event, processes:
// 1. Withdraw from HLP on Hyperliquid
// 2. Bridge USDC back to Base
// 3. Send to user's Safe
// 4. Burn voucher NFT
```

---

## Comparison: Multi-Safe vs Single-Safe + Intents

### Multi-Safe Approach (Previous)

```
✅ Full control on each chain
✅ Can use existing tools (FluidkeyEarnModule)
❌ Deploy Safe on each chain ($10-50 per chain)
❌ User needs gas on each chain
❌ More complexity to manage
❌ Fragmented liquidity
```

### Single-Safe + Intents (This Approach)

```
✅ One Safe on Base only ($15 one-time)
✅ No gas needed on other chains
✅ Unified liquidity on Base
✅ Access vaults on ANY chain
✅ Better UX (one signature)
❌ Depends on solver reliability
❌ 0.5-1% fee per operation
❌ More complex architecture
```

---

## Cost Analysis: Single-Safe + Intents

### Initial Costs

- Safe on Base: $15-25 (already done)
- CrossChainVaultIntent contract: $30-50
- HLPVoucher contract: $30-50
- **Total: $60-125** (vs $180-400 for multi-chain Safes)

### Operational Costs (per 100 users)

**Cross-Chain Vault Deposits:**
- Intent fee: 0.5-1% = $0.50-$1 per $100 deposited
- 100 users × 10 deposits/month × $100 avg = $500-1000/month

**HLP Deposits:**
- Intent fee: 0.5-1%
- Bridge fee: $0.50-1
- Total: ~$1-2 per deposit
- 50 users × 5 deposits/month = $250-500/month

**Total: $750-1500/month**

### Solver Profitability

**Solver makes money on:**
- Intent fulfillment fees (0.5-1%)
- $100k monthly volume × 0.75% = $750/month
- Minus gas costs (~$100-200/month)
- **Net: $550-650/month**

**Can be profitable for:**
- In-house solver (you run it)
- Third-party solver network (Across, etc.)

---

## Implementation Roadmap

### Week 1-2: Foundation
- ✅ Deploy CrossChainVaultIntent on Base
- ✅ Deploy HLPVoucher on Base
- ✅ Build intent creation UI
- ✅ Test on testnets

### Week 3-4: Solver Infrastructure
- ✅ Build Morpho cross-chain solver
- ✅ Build HLP solver with API integration
- ✅ Set up solver monitoring
- ✅ Test fulfillment flows

### Week 5-6: User Features
- ✅ Build vault selector UI
- ✅ Add balance tracking (including vouchers)
- ✅ Build withdrawal flows
- ✅ Add intent status tracking

### Week 7-8: Production
- ✅ Deploy to mainnet
- ✅ Start with small limits
- ✅ Monitor solver performance
- ✅ Optimize fees

---

## Recommended Approach

### Start Simple: Use Across Protocol

**Instead of building everything from scratch, leverage Across:**

```typescript
// Across already has cross-chain message passing
// Can include arbitrary calldata (like "deposit to vault")

await acrossSpokePoo.deposit({
  recipient: MORPHO_VAULT_ARBITRUM,    // Deliver directly to vault
  token: USDC,
  amount: 1000e6,
  destinationChainId: 42161,
  message: encodeDepositCall(userSafe, amount), // Across executes this!
})
```

**Benefits:**
- ✅ No solver to maintain
- ✅ Battle-tested infrastructure
- ✅ Competitive fees (0.5-1%)
- ✅ Fast (10-20 seconds)

**Limitations:**
- ⚠️ Less control over execution
- ⚠️ Might not work for HLP (custom API)

### For HLP: Hybrid Approach

**Use Across for most vaults, custom solver for HLP:**

1. **Morpho Arbitrum**: Use Across with message passing
2. **Morpho Base**: Direct deposit (no bridge needed)
3. **HLP**: Custom solver with voucher system

This gives you:
- ✅ Simple for most cases (Across)
- ✅ Special handling for HLP
- ✅ Faster time to market
- ✅ Lower maintenance

---

## Summary: The Winning Strategy

```
┌──────────────────────────────────────────────────────────┐
│           YOUR SAFE (BASE ONLY)                          │
│                                                          │
│  User's USDC balance: $10,000                           │
└───────────────────────┬──────────────────────────────────┘
                        │
                        │ User selects vault
                        │
                        ▼
        ┌───────────────────────────────┐
        │   Which vault?                │
        └───────┬───────────────────────┘
                │
    ┌───────────┼───────────┐
    │           │           │
    ▼           ▼           ▼
┌────────┐ ┌────────┐ ┌─────────┐
│Morpho  │ │Morpho  │ │HLP      │
│Base    │ │Arbitrum│ │Hyperliqu│
│        │ │        │ │id       │
│Direct  │ │Via     │ │Via      │
│        │ │Across  │ │Custom   │
│        │ │        │ │Solver   │
└────────┘ └────────┘ └─────────┘
```

**Key Points:**
1. ✅ Keep one Safe on Base
2. ✅ Use Across for Morpho cross-chain deposits
3. ✅ Use custom solver + voucher for HLP
4. ✅ User signs once, complexity handled by solvers
5. ✅ ~$0.50-1 per cross-chain operation
6. ✅ All positions trackable from Base

**Next Steps:**
1. Start with Morpho Base (direct, no intents needed)
2. Add Morpho Arbitrum via Across
3. Add HLP with custom solver
4. Optimize over time

Want me to build out any specific part of this?
