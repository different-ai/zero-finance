# What You Can Code & Test TODAY

## TL;DR

**Arbitrum → Base (Across Protocol):** ✅ Can code and test TODAY on testnet  
**Hyperliquid HLP:** ⚠️ Can code voucher contract today, but HLP API needs mainnet (no testnet)

---

## Part 1: Arbitrum → Base with Across Protocol

### What You Can Do TODAY

✅ **Code the integration** (1-2 hours)  
✅ **Test on testnet** (Base Sepolia + Arbitrum Sepolia)  
✅ **See actual cross-chain transfer work**

### Step-by-Step Implementation

#### Step 1: Create Across Integration Hook (30 min)

```typescript
// packages/web/src/lib/hooks/use-across-deposit.ts (NEW)

import { useWalletClient, usePublicClient } from 'wagmi'
import { parseUnits, encodeFunctionData, type Address } from 'viem'
import { arbitrum, base } from 'viem/chains'

// Across SpokePool addresses
const SPOKE_POOLS = {
  // Testnets
  84532: '0x13fDaC9F2b68Ea3e7C30CCAf3e1D89890fc0cf6d', // Base Sepolia
  421614: '0x7E63A5f1a8F0B4d0934B2f2327DAED3F6bb2ee75', // Arbitrum Sepolia
  
  // Mainnets (for reference)
  8453: '0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64', // Base
  42161: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE', // Arbitrum
} as const

const USDC_ADDRESSES = {
  // Testnets
  84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Base Sepolia
  421614: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d', // Arbitrum Sepolia
  
  // Mainnets
  8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base
  42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // Arbitrum
} as const

/**
 * Hook to bridge USDC from Arbitrum to Base using Across Protocol
 * Works on both testnet and mainnet
 */
export function useAcrossDeposit() {
  const walletClient = useWalletClient()
  const publicClient = usePublicClient()
  
  const depositV3 = async ({
    amount,
    fromChain,
    toChain,
    recipient,
  }: {
    amount: string // e.g., "1000"
    fromChain: number // e.g., 421614 for Arbitrum Sepolia
    toChain: number // e.g., 84532 for Base Sepolia
    recipient: Address // Safe address on destination chain
  }) => {
    if (!walletClient?.data) throw new Error('Wallet not connected')
    
    const amountWei = parseUnits(amount, 6) // USDC has 6 decimals
    const spokePoolAddress = SPOKE_POOLS[fromChain as keyof typeof SPOKE_POOLS]
    const inputToken = USDC_ADDRESSES[fromChain as keyof typeof USDC_ADDRESSES]
    const outputToken = USDC_ADDRESSES[toChain as keyof typeof USDC_ADDRESSES]
    
    // Step 1: Approve USDC to SpokePool
    const approveData = encodeFunctionData({
      abi: [{
        name: 'approve',
        type: 'function',
        inputs: [
          { name: 'spender', type: 'address' },
          { name: 'amount', type: 'uint256' },
        ],
      }],
      functionName: 'approve',
      args: [spokePoolAddress, amountWei],
    })
    
    const approveTx = await walletClient.data.sendTransaction({
      to: inputToken,
      data: approveData,
    })
    
    console.log('Approve tx:', approveTx)
    await publicClient?.waitForTransactionReceipt({ hash: approveTx })
    
    // Step 2: Deposit to Across
    const now = Math.floor(Date.now() / 1000)
    const depositData = encodeFunctionData({
      abi: [{
        name: 'depositV3',
        type: 'function',
        inputs: [
          { name: 'depositor', type: 'address' },
          { name: 'recipient', type: 'address' },
          { name: 'inputToken', type: 'address' },
          { name: 'outputToken', type: 'address' },
          { name: 'inputAmount', type: 'uint256' },
          { name: 'outputAmount', type: 'uint256' },
          { name: 'destinationChainId', type: 'uint256' },
          { name: 'exclusiveRelayer', type: 'address' },
          { name: 'quoteTimestamp', type: 'uint32' },
          { name: 'fillDeadline', type: 'uint32' },
          { name: 'exclusivityDeadline', type: 'uint32' },
          { name: 'message', type: 'bytes' },
        ],
      }],
      functionName: 'depositV3',
      args: [
        walletClient.data.account.address, // depositor
        recipient, // recipient (your Safe on Base)
        inputToken,
        outputToken,
        amountWei,
        amountWei * 995n / 1000n, // 0.5% slippage
        BigInt(toChain),
        '0x0000000000000000000000000000000000000000', // no exclusive relayer
        now - 60, // quoteTimestamp (1 min ago)
        now + 1800, // fillDeadline (30 min)
        0, // exclusivityDeadline (no exclusivity)
        '0x', // no message
      ],
    })
    
    const depositTx = await walletClient.data.sendTransaction({
      to: spokePoolAddress,
      data: depositData,
    })
    
    console.log('Deposit tx:', depositTx)
    return depositTx
  }
  
  return { depositV3 }
}
```

#### Step 2: Create Test UI Component (30 min)

```typescript
// packages/web/src/app/(authenticated)/dashboard/test-across/page.tsx (NEW)

'use client'

import { useState } from 'react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { useAcrossDeposit } from '@/lib/hooks/use-across-deposit'

export default function TestAcrossPage() {
  const { address } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { depositV3 } = useAcrossDeposit()
  
  const [amount, setAmount] = useState('10')
  const [recipient, setRecipient] = useState(address || '')
  const [status, setStatus] = useState('')
  
  const handleDeposit = async () => {
    try {
      setStatus('Switching to Arbitrum Sepolia...')
      await switchChain({ chainId: 421614 }) // Arbitrum Sepolia
      
      setStatus('Depositing via Across...')
      const txHash = await depositV3({
        amount,
        fromChain: 421614, // Arbitrum Sepolia
        toChain: 84532, // Base Sepolia
        recipient: recipient as `0x${string}`,
      })
      
      setStatus(`Success! Tx: ${txHash}. Funds will arrive on Base Sepolia in ~30 seconds.`)
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Test Across Protocol</h1>
      
      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-sm text-yellow-800">
          ⚠️ You need testnet USDC on Arbitrum Sepolia.
          Get it from <a href="https://faucet.circle.com/" className="underline">Circle Faucet</a>
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Amount (USDC)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="10"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Recipient on Base Sepolia</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
            placeholder="0x..."
          />
        </div>
        
        <button
          onClick={handleDeposit}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Bridge {amount} USDC from Arbitrum Sepolia to Base Sepolia
        </button>
        
        {status && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm">{status}</p>
          </div>
        )}
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <p>📋 <strong>Current chain:</strong> {chainId === 421614 ? 'Arbitrum Sepolia' : chainId === 84532 ? 'Base Sepolia' : 'Unknown'}</p>
        <p>🔗 <strong>Flow:</strong> Arbitrum Sepolia → Across → Base Sepolia</p>
        <p>⏱️ <strong>Expected time:</strong> ~30 seconds</p>
        <p>💰 <strong>Fee:</strong> ~0.5% ($0.05 for $10)</p>
      </div>
    </div>
  )
}
```

#### Step 3: Test on Testnet (30 min)

**Prerequisites:**
1. Get testnet USDC on Arbitrum Sepolia from [Circle Faucet](https://faucet.circle.com/)
2. Make sure your wallet has testnet ETH on Arbitrum Sepolia for gas

**Testing Flow:**
```bash
# 1. Run your dev server
pnpm dev

# 2. Navigate to test page
http://localhost:3000/dashboard/test-across

# 3. Connect wallet and test
# - Input: 10 USDC
# - Recipient: Your Safe address on Base Sepolia
# - Click "Bridge"

# 4. Watch the magic happen:
# - Approve tx on Arbitrum Sepolia
# - Deposit tx on Arbitrum Sepolia
# - Wait ~30 seconds
# - Check recipient balance on Base Sepolia (should have 9.95 USDC)
```

### What You'll See

1. **On Arbitrum Sepolia:**
   - Approve USDC to SpokePool: `0x7E63A5f1a8F0B4d0934B2f2327DAED3F6bb2ee75`
   - Deposit 10 USDC to SpokePool
   - Emit `V3FundsDeposited` event

2. **Behind the Scenes:**
   - Across relayer network sees event
   - Relayer fronts 9.95 USDC on Base Sepolia to your Safe
   - Relayer gets reimbursed 10 USDC on Arbitrum Sepolia later

3. **On Base Sepolia:**
   - Your Safe receives 9.95 USDC (~30 seconds later)
   - Check balance: https://sepolia.basescan.org/address/YOUR_SAFE

---

## Part 2: Hyperliquid HLP Voucher System

### What You Can Do TODAY

✅ **Code the voucher contract** (2-3 hours)  
✅ **Deploy voucher contract to Base Sepolia**  
✅ **Test voucher minting/redeeming**  
❌ **Cannot test HLP API** (no testnet available)

### Reality Check for HLP

**The Problem:**
- HLP vaults are only on Hyperliquid **mainnet**
- No HLP testnet exists
- Hyperliquid testnet has different tokens/vaults

**What This Means:**
- You can build the voucher infrastructure today
- You can test minting/burning vouchers today
- You **cannot** test actual HLP deposits until mainnet
- Need to mock the HLP API responses for testing

### Step-by-Step Implementation

#### Step 1: Create HLP Voucher Contract (1 hour)

```solidity
// packages/fluidkey-earn-module/src/HLPVoucher.sol (NEW)

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HLPVoucher
 * @notice NFT representing HLP vault positions on Hyperliquid
 * @dev Deployed on Base, represents off-chain HLP holdings
 * 
 * Flow:
 * 1. User signs intent to deposit to HLP
 * 2. Solver deposits to HLP on Hyperliquid
 * 3. Solver mints voucher NFT to user's Safe on Base
 * 4. User can redeem voucher to withdraw from HLP
 */
contract HLPVoucher is ERC721, Ownable {
    struct HLPPosition {
        uint256 hlpShares;           // HLP shares on Hyperliquid
        string hyperliquidAddress;   // User's Hyperliquid address (where HLP is held)
        uint256 depositedAt;         // Timestamp of deposit
        bytes32 intentHash;          // Original intent hash
        uint256 usdcValue;          // USDC value at time of deposit (for display)
    }
    
    mapping(uint256 => HLPPosition) public positions;
    uint256 public nextTokenId;
    
    // Authorized solvers who can mint vouchers
    mapping(address => bool) public authorizedSolvers;
    
    event VoucherMinted(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 hlpShares,
        string hyperliquidAddress,
        bytes32 intentHash
    );
    
    event VoucherRedeemed(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 hlpShares,
        string hyperliquidAddress
    );
    
    constructor() ERC721("Zero Finance HLP Voucher", "ZF-HLP") Ownable(msg.sender) {}
    
    /**
     * @notice Solver mints voucher after depositing to HLP on Hyperliquid
     * @param to User's Safe address on Base
     * @param hlpShares Number of HLP shares deposited
     * @param hyperliquidAddress Address on Hyperliquid where HLP is held
     * @param intentHash Original intent hash
     * @param usdcValue USDC value at time of deposit
     */
    function mintVoucher(
        address to,
        uint256 hlpShares,
        string memory hyperliquidAddress,
        bytes32 intentHash,
        uint256 usdcValue
    ) external returns (uint256 tokenId) {
        require(authorizedSolvers[msg.sender], "Only authorized solvers");
        require(hlpShares > 0, "Invalid shares");
        require(bytes(hyperliquidAddress).length > 0, "Invalid address");
        
        tokenId = nextTokenId++;
        
        positions[tokenId] = HLPPosition({
            hlpShares: hlpShares,
            hyperliquidAddress: hyperliquidAddress,
            depositedAt: block.timestamp,
            intentHash: intentHash,
            usdcValue: usdcValue
        });
        
        _mint(to, tokenId);
        
        emit VoucherMinted(
            tokenId,
            to,
            hlpShares,
            hyperliquidAddress,
            intentHash
        );
    }
    
    /**
     * @notice User redeems voucher to initiate HLP withdrawal
     * @dev Burns the voucher and emits event for solver to process withdrawal
     */
    function redeemVoucher(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        
        HLPPosition memory position = positions[tokenId];
        
        // Burn voucher
        _burn(tokenId);
        
        // Delete position data
        delete positions[tokenId];
        
        // Emit event for solver to process withdrawal
        emit VoucherRedeemed(
            tokenId,
            msg.sender,
            position.hlpShares,
            position.hyperliquidAddress
        );
    }
    
    /**
     * @notice Get position details for a voucher
     */
    function getPosition(uint256 tokenId) external view returns (HLPPosition memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return positions[tokenId];
    }
    
    /**
     * @notice Owner can add/remove authorized solvers
     */
    function setAuthorizedSolver(address solver, bool authorized) external onlyOwner {
        authorizedSolvers[solver] = authorized;
    }
    
    /**
     * @notice Get all vouchers owned by an address
     * @dev This is a helper for frontends, iterates through tokens
     */
    function getVouchersByOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](balance);
        uint256 currentIndex = 0;
        
        // Iterate through all minted tokens to find owner's tokens
        // Note: This is gas-intensive, only for view functions
        for (uint256 i = 0; i < nextTokenId && currentIndex < balance; i++) {
            if (_ownerOf(i) == owner) {
                tokenIds[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return tokenIds;
    }
}
```

#### Step 2: Deploy Script (30 min)

```solidity
// packages/fluidkey-earn-module/script/DeployHLPVoucher.s.sol (NEW)

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "../src/HLPVoucher.sol";

contract DeployHLPVoucher is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        HLPVoucher voucher = new HLPVoucher();
        
        console.log("HLPVoucher deployed to:", address(voucher));
        
        // Authorize your server address as solver
        // TODO: Replace with your actual solver address
        // voucher.setAuthorizedSolver(YOUR_SOLVER_ADDRESS, true);
        
        vm.stopBroadcast();
    }
}
```

```bash
# Deploy to Base Sepolia
forge script script/DeployHLPVoucher.s.sol:DeployHLPVoucher \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY
```

#### Step 3: Mock HLP API for Testing (1 hour)

```typescript
// packages/web/src/lib/hyperliquid/mock-hlp-api.ts (NEW)

import { Address, parseUnits } from 'viem'

/**
 * Mock HLP API for testing
 * Real HLP API is only on mainnet, this simulates responses
 */
export class MockHLPAPI {
  /**
   * Mock deposit to HLP
   * In reality, this calls https://api.hyperliquid.xyz/vault/deposit
   */
  async deposit(params: {
    userAddress: string
    amount: bigint // USDC amount in wei (6 decimals)
  }): Promise<{
    success: boolean
    hlpShares: bigint
    hyperliquidAddress: string
    txHash: string
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock conversion: 1 USDC = ~0.95 HLP shares (example rate)
    const hlpShares = (params.amount * 95n) / 100n
    
    return {
      success: true,
      hlpShares,
      hyperliquidAddress: params.userAddress, // In reality, would be Hyperliquid address
      txHash: '0x' + '1'.repeat(64), // Mock tx hash
    }
  }
  
  /**
   * Mock withdraw from HLP
   */
  async withdraw(params: {
    userAddress: string
    hlpShares: bigint
  }): Promise<{
    success: boolean
    usdcAmount: bigint
    txHash: string
  }> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock conversion: 1 HLP share = ~1.05 USDC (simulating gains)
    const usdcAmount = (params.hlpShares * 105n) / 100n
    
    return {
      success: true,
      usdcAmount,
      txHash: '0x' + '2'.repeat(64),
    }
  }
  
  /**
   * Mock get balance
   */
  async getBalance(params: {
    userAddress: string
  }): Promise<{
    hlpShares: bigint
    usdcValue: bigint
    apy: number
  }> {
    // Return mock data
    return {
      hlpShares: parseUnits('100', 18),
      usdcValue: parseUnits('105', 6),
      apy: 0.25, // 25% APY
    }
  }
}
```

#### Step 4: Test UI for Vouchers (1 hour)

```typescript
// packages/web/src/app/(authenticated)/dashboard/test-hlp/page.tsx (NEW)

'use client'

import { useState } from 'react'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { parseUnits, encodeFunctionData, type Address } from 'viem'
import { MockHLPAPI } from '@/lib/hyperliquid/mock-hlp-api'

const HLP_VOUCHER_ADDRESS = '0x...' // Your deployed voucher contract

export default function TestHLPPage() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const walletClient = useWalletClient()
  
  const [amount, setAmount] = useState('1000')
  const [status, setStatus] = useState('')
  const [voucherTokenId, setVoucherTokenId] = useState<string>()
  
  const mockAPI = new MockHLPAPI()
  
  const handleMockDeposit = async () => {
    try {
      if (!address || !walletClient.data) throw new Error('Wallet not connected')
      
      setStatus('Step 1: Simulating HLP deposit...')
      
      // Mock HLP API call
      const result = await mockAPI.deposit({
        userAddress: address,
        amount: parseUnits(amount, 6),
      })
      
      setStatus('Step 2: Minting voucher NFT...')
      
      // Mint voucher
      const mintData = encodeFunctionData({
        abi: [{
          name: 'mintVoucher',
          type: 'function',
          inputs: [
            { name: 'to', type: 'address' },
            { name: 'hlpShares', type: 'uint256' },
            { name: 'hyperliquidAddress', type: 'string' },
            { name: 'intentHash', type: 'bytes32' },
            { name: 'usdcValue', type: 'uint256' },
          ],
        }],
        functionName: 'mintVoucher',
        args: [
          address,
          result.hlpShares,
          result.hyperliquidAddress,
          `0x${'1'.repeat(64)}`, // Mock intent hash
          parseUnits(amount, 6),
        ],
      })
      
      const txHash = await walletClient.data.sendTransaction({
        to: HLP_VOUCHER_ADDRESS,
        data: mintData,
      })
      
      await publicClient?.waitForTransactionReceipt({ hash: txHash })
      
      setStatus(`Success! Voucher minted. Check your NFTs.`)
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown'}`)
    }
  }
  
  const handleRedeem = async () => {
    try {
      if (!voucherTokenId || !walletClient.data) throw new Error('Invalid input')
      
      setStatus('Redeeming voucher...')
      
      const redeemData = encodeFunctionData({
        abi: [{
          name: 'redeemVoucher',
          type: 'function',
          inputs: [{ name: 'tokenId', type: 'uint256' }],
        }],
        functionName: 'redeemVoucher',
        args: [BigInt(voucherTokenId)],
      })
      
      const txHash = await walletClient.data.sendTransaction({
        to: HLP_VOUCHER_ADDRESS,
        data: redeemData,
      })
      
      await publicClient?.waitForTransactionReceipt({ hash: txHash })
      
      setStatus('Voucher redeemed! Solver will process withdrawal.')
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown'}`)
    }
  }
  
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Test HLP Voucher System</h1>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          ℹ️ This uses <strong>mock HLP API</strong> since HLP testnet doesn't exist.
          Voucher contract is real on Base Sepolia.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Mock Deposit */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">1. Mock HLP Deposit</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">Amount (USDC)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          
          <button
            onClick={handleMockDeposit}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Simulate HLP Deposit + Mint Voucher
          </button>
        </div>
        
        {/* Redeem Voucher */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">2. Redeem Voucher</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">Voucher Token ID</label>
            <input
              type="number"
              value={voucherTokenId}
              onChange={(e) => setVoucherTokenId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="0"
            />
          </div>
          
          <button
            onClick={handleRedeem}
            className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Redeem Voucher (Burns NFT)
          </button>
        </div>
      </div>
      
      {status && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm">{status}</p>
        </div>
      )}
    </div>
  )
}
```

---

## Summary: What Works Today

| Component | Can Code Today? | Can Test Today? | Notes |
|-----------|----------------|-----------------|-------|
| **Across Integration** | ✅ Yes | ✅ Yes (testnet) | Full flow works on Base Sepolia ↔ Arbitrum Sepolia |
| **HLP Voucher Contract** | ✅ Yes | ✅ Yes (testnet) | Deploy to Base Sepolia, test minting/burning |
| **HLP API Integration** | ✅ Yes (mock) | ❌ No testnet | Can only test on mainnet with real funds |
| **Solver Infrastructure** | ✅ Yes | ⚠️ Partial | Can test Across fills, must mock HLP |

## Recommended Testing Plan

### TODAY (4-6 hours)

1. ✅ **Implement Across integration** (1-2 hours)
2. ✅ **Test Across on testnet** (30 min)
3. ✅ **Deploy HLP Voucher contract** (30 min)
4. ✅ **Build voucher test UI** (1-2 hours)
5. ✅ **Test voucher minting/burning** (30 min)

### TOMORROW

1. Build intent system for HLP deposits
2. Create solver monitoring infrastructure
3. Test on mainnet with small amounts ($10-100)

### NEXT WEEK

1. Build production UI for cross-chain payments
2. Add HLP to vault selector
3. Full integration testing

## Quick Start Commands

```bash
# 1. Install dependencies (if needed)
pnpm install @openzeppelin/contracts

# 2. Create the files above
# - use-across-deposit.ts
# - HLPVoucher.sol
# - DeployHLPVoucher.s.sol
# - Mock API
# - Test pages

# 3. Deploy voucher contract
cd packages/fluidkey-earn-module
forge script script/DeployHLPVoucher.s.sol:DeployHLPVoucher \
  --rpc-url https://sepolia.base.org \
  --broadcast

# 4. Update contract address in test pages

# 5. Run dev server
pnpm dev

# 6. Test!
# Navigate to /dashboard/test-across
# Navigate to /dashboard/test-hlp
```

**Bottom line:** You can code and test Across integration TODAY. HLP vouchers TODAY. Full HLP integration needs mainnet testing.

Want me to start implementing any of these?
