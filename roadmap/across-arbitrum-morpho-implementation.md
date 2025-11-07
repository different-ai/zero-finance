# Across Protocol + Arbitrum Morpho Integration

## Overview

This document details the implementation of cross-chain vault deposits using **Across Protocol** to enable users with a Safe on Base to deposit into the Gauntlet USDC Core vault on Arbitrum Morpho.

**Target Vault:** https://app.morpho.org/arbitrum/vault/0x7e97fa6893871A2751B5fE961978DCCb2c201E65/gauntlet-usdc-core

## Why Across Protocol?

### Comparison of Bridge Options

| Feature | Across | Stargate | LayerZero | Biconomy |
|---------|--------|----------|-----------|----------|
| **Speed** | 10-30s | 30-60s | 30-60s | 20-40s |
| **Cost** | 0.5-1% | 0.06% + gas | Variable | 0.8-1.5% |
| **Message Passing** | ✅ Yes | ✅ Yes | ✅ Yes | Limited |
| **Reliability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Integration Ease** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Documentation** | Excellent | Good | Good | Fair |
| **Battle-tested** | ✅ $6B+ | ✅ $4B+ | ✅ $8B+ | ⚠️ $500M |

**Winner: Across Protocol**
- Best balance of speed, reliability, and ease of integration
- Excellent documentation and examples
- Native support for cross-chain calls with arbitrary data
- Lower operational overhead than building custom solver

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    USER'S SAFE (BASE)                            │
│  Balance: 10,000 USDC                                           │
└──────────────────┬───────────────────────────────────────────────┘
                   │
                   │ 1. User signs deposit intent
                   │    Amount: 1,000 USDC
                   │    Target: Arbitrum Morpho Vault
                   │
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│              ACROSS SPOKE POOL (BASE)                            │
│  deposit(                                                        │
│    recipient: CrossChainVaultReceiver (Arbitrum),              │
│    token: USDC,                                                 │
│    amount: 1000e6,                                              │
│    destinationChainId: 42161,                                   │
│    message: encodeFunctionData({                                │
│      functionName: 'depositToVault',                           │
│      args: [userSafe, vaultAddress, minSharesOut]              │
│    })                                                           │
│  )                                                               │
└──────────────────┬───────────────────────────────────────────────┘
                   │
                   │ 2. Across bridges USDC
                   │    (10-30 seconds)
                   │
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│        CROSS CHAIN VAULT RECEIVER (ARBITRUM)                    │
│  handleV3AcrossMessage() called by Across                       │
│  1. Receives USDC from Across                                   │
│  2. Approves Morpho vault                                       │
│  3. Calls vault.deposit(amount, userSafe)                       │
│  4. Emits CrossChainDepositComplete                             │
└──────────────────┬───────────────────────────────────────────────┘
                   │
                   │ 3. Morpho vault shares minted to
                   │    user's Safe address (on Arbitrum)
                   │
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│         MORPHO GAUNTLET USDC CORE (ARBITRUM)                    │
│  0x7e97fa6893871A2751B5fE961978DCCb2c201E65                     │
│  User's shares: 995.5 USDC (after fees)                        │
└──────────────────────────────────────────────────────────────────┘
```

## Smart Contract Implementation

### 1. CrossChainVaultReceiver (Deploy on Arbitrum)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {IERC4626} from "forge-std/interfaces/IERC4626.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title CrossChainVaultReceiver
 * @notice Receives USDC from Across Protocol and deposits into Morpho vaults
 * @dev Deployed on destination chain (Arbitrum)
 */
contract CrossChainVaultReceiver {
    using SafeERC20 for IERC20;

    address public immutable ACROSS_SPOKE_POOL;
    address public owner;
    
    // Mapping of allowed vaults (for security)
    mapping(address => bool) public allowedVaults;
    
    event CrossChainDepositComplete(
        address indexed userSafe,
        address indexed vaultAddress,
        uint256 assetsDeposited,
        uint256 sharesReceived,
        bytes32 indexed messageId
    );
    
    event VaultAllowed(address indexed vaultAddress, bool allowed);
    
    error UnauthorizedCaller();
    error VaultNotAllowed();
    error InsufficientShares();
    
    constructor(address _acrossSpokePoo, address _owner) {
        ACROSS_SPOKE_POOL = _acrossSpokePool;
        owner = _owner;
    }
    
    modifier onlyAcross() {
        if (msg.sender != ACROSS_SPOKE_POOL) revert UnauthorizedCaller();
        _;
    }
    
    modifier onlyOwner() {
        if (msg.sender != owner) revert UnauthorizedCaller();
        _;
    }
    
    /**
     * @notice Called by Across when message is relayed
     * @param tokenSent The token received (USDC)
     * @param amount Amount of tokens received
     * @param relayer Address that relayed the message
     * @param message Encoded call data containing (userSafe, vaultAddress, minSharesOut)
     */
    function handleV3AcrossMessage(
        address tokenSent,
        uint256 amount,
        address relayer,
        bytes memory message
    ) external onlyAcross {
        // Decode the message
        (address userSafe, address vaultAddress, uint256 minSharesOut) = 
            abi.decode(message, (address, address, uint256));
        
        // Security check: only allow whitelisted vaults
        if (!allowedVaults[vaultAddress]) revert VaultNotAllowed();
        
        // Approve vault to spend tokens
        IERC20(tokenSent).forceApprove(vaultAddress, amount);
        
        // Deposit into ERC4626 vault
        // Shares are minted directly to user's Safe on this chain
        uint256 sharesReceived = IERC4626(vaultAddress).deposit(amount, userSafe);
        
        // Verify minimum shares received (slippage protection)
        if (sharesReceived < minSharesOut) revert InsufficientShares();
        
        // Generate message ID from current block
        bytes32 messageId = keccak256(
            abi.encodePacked(block.number, block.timestamp, userSafe, amount)
        );
        
        emit CrossChainDepositComplete(
            userSafe,
            vaultAddress,
            amount,
            sharesReceived,
            messageId
        );
    }
    
    /**
     * @notice Allow or disallow a vault for deposits
     * @param vaultAddress The vault to configure
     * @param allowed Whether the vault is allowed
     */
    function setVaultAllowed(address vaultAddress, bool allowed) external onlyOwner {
        allowedVaults[vaultAddress] = allowed;
        emit VaultAllowed(vaultAddress, allowed);
    }
    
    /**
     * @notice Emergency withdrawal (owner only)
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner, amount);
    }
}
```

### 2. CrossChainVaultManager (Deploy on Base)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IAcrossSpokePool {
    function depositV3(
        address depositor,
        address recipient,
        address inputToken,
        address outputToken,
        uint256 inputAmount,
        uint256 outputAmount,
        uint256 destinationChainId,
        address exclusiveRelayer,
        uint32 quoteTimestamp,
        uint32 fillDeadline,
        uint32 exclusivityDeadline,
        bytes calldata message
    ) external payable;
}

/**
 * @title CrossChainVaultManager
 * @notice Manages cross-chain vault deposits via Across Protocol
 * @dev Deployed on source chain (Base)
 */
contract CrossChainVaultManager {
    using SafeERC20 for IERC20;
    
    address public immutable ACROSS_SPOKE_POOL_BASE;
    address public owner;
    
    // Destination chain receiver contracts
    mapping(uint256 => address) public chainReceivers;
    
    // Events
    event CrossChainDepositInitiated(
        address indexed userSafe,
        address indexed token,
        uint256 amount,
        uint256 destinationChainId,
        address vaultAddress,
        bytes32 indexed depositId
    );
    
    error UnauthorizedSafe();
    error InvalidReceiver();
    error TransferFailed();
    
    constructor(address _acrossSpokePool, address _owner) {
        ACROSS_SPOKE_POOL_BASE = _acrossSpokePool;
        owner = _owner;
    }
    
    modifier onlyOwner() {
        if (msg.sender != owner) revert UnauthorizedSafe();
        _;
    }
    
    /**
     * @notice Initiate cross-chain vault deposit
     * @param token Token to bridge (USDC)
     * @param amount Amount to deposit
     * @param destinationChainId Target chain (42161 for Arbitrum)
     * @param vaultAddress Vault address on destination chain
     * @param minSharesOut Minimum shares to receive (slippage protection)
     */
    function initiateDeposit(
        address token,
        uint256 amount,
        uint256 destinationChainId,
        address vaultAddress,
        uint256 minSharesOut
    ) external returns (bytes32 depositId) {
        address userSafe = msg.sender;
        address receiver = chainReceivers[destinationChainId];
        
        if (receiver == address(0)) revert InvalidReceiver();
        
        // Transfer tokens from Safe to this contract
        IERC20(token).safeTransferFrom(userSafe, address(this), amount);
        
        // Approve Across spoke pool
        IERC20(token).forceApprove(ACROSS_SPOKE_POOL_BASE, amount);
        
        // Encode message for destination contract
        bytes memory message = abi.encode(userSafe, vaultAddress, minSharesOut);
        
        // Calculate quote timestamp (current block - 1 minute for safety)
        uint32 quoteTimestamp = uint32(block.timestamp - 60);
        uint32 fillDeadline = uint32(block.timestamp + 3600); // 1 hour
        uint32 exclusivityDeadline = 0; // No exclusivity
        
        // Deposit to Across
        IAcrossSpokePool(ACROSS_SPOKE_POOL_BASE).depositV3(
            address(this),           // depositor
            receiver,                 // recipient (CrossChainVaultReceiver)
            token,                    // inputToken
            token,                    // outputToken (same token)
            amount,                   // inputAmount
            amount,                   // outputAmount (1:1, fees deducted by Across)
            destinationChainId,       // destinationChainId
            address(0),               // exclusiveRelayer (none)
            quoteTimestamp,           // quoteTimestamp
            fillDeadline,             // fillDeadline
            exclusivityDeadline,      // exclusivityDeadline
            message                   // message
        );
        
        // Generate deposit ID
        depositId = keccak256(
            abi.encodePacked(
                userSafe,
                token,
                amount,
                destinationChainId,
                vaultAddress,
                block.timestamp
            )
        );
        
        emit CrossChainDepositInitiated(
            userSafe,
            token,
            amount,
            destinationChainId,
            vaultAddress,
            depositId
        );
    }
    
    /**
     * @notice Set receiver contract for a chain
     */
    function setChainReceiver(
        uint256 chainId,
        address receiver
    ) external onlyOwner {
        chainReceivers[chainId] = receiver;
    }
}
```

## Frontend Implementation

### 1. Add Arbitrum Vault to Configuration

```typescript
// packages/web/src/server/earn/base-vaults.ts

export const ARBITRUM_CHAIN_ID = 42161;

export const ALL_VAULTS: BaseVault[] = [
  // Existing Base vaults
  ...BASE_USDC_VAULTS,
  
  // NEW: Arbitrum vault
  {
    id: 'gauntletCore',
    name: 'Gauntlet USDC Core',
    displayName: 'Premium Yield (Arbitrum)',
    address: '0x7e97fa6893871A2751B5fE961978DCCb2c201E65',
    risk: 'Balanced',
    curator: 'Morpho × Gauntlet',
    appUrl:
      'https://app.morpho.org/arbitrum/vault/0x7e97fa6893871A2751B5fE961978DCCb2c201E65/gauntlet-usdc-core',
    chainId: ARBITRUM_CHAIN_ID,
  },
];
```

### 2. Across Bridge Constants

```typescript
// packages/web/src/lib/across-constants.ts

import { type Address } from 'viem';

export const ACROSS_SPOKE_POOL_BASE: Address = 
  '0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64';

export const ACROSS_SPOKE_POOL_ARBITRUM: Address = 
  '0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A';

export const CROSS_CHAIN_VAULT_MANAGER_BASE: Address = 
  '0x...'; // Deploy this

export const CROSS_CHAIN_VAULT_RECEIVER_ARBITRUM: Address = 
  '0x...'; // Deploy this

// Across fee estimates (basis points)
export const ACROSS_FEE_BPS = 50; // 0.5%
```

### 3. Cross-Chain Deposit Hook

```typescript
// packages/web/src/lib/hooks/use-cross-chain-deposit.ts

import { useMutation } from '@tanstack/react-query';
import { useWallets } from '@privy-io/react-auth';
import { encodeFunctionData, parseUnits, type Address } from 'viem';
import { base, arbitrum } from 'viem/chains';
import { 
  CROSS_CHAIN_VAULT_MANAGER_BASE,
  ACROSS_FEE_BPS 
} from '@/lib/across-constants';

const CROSS_CHAIN_VAULT_MANAGER_ABI = [
  {
    name: 'initiateDeposit',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'destinationChainId', type: 'uint256' },
      { name: 'vaultAddress', type: 'address' },
      { name: 'minSharesOut', type: 'uint256' },
    ],
    outputs: [{ name: 'depositId', type: 'bytes32' }],
  },
] as const;

interface CrossChainDepositParams {
  vaultAddress: Address;
  amount: string; // In decimal format (e.g., "1000" for 1000 USDC)
  chainId: number;
  slippageBps?: number; // Default 50 = 0.5%
}

export function useCrossChainDeposit() {
  const { wallets } = useWallets();
  
  return useMutation({
    mutationFn: async (params: CrossChainDepositParams) => {
      const { vaultAddress, amount, chainId, slippageBps = 50 } = params;
      const wallet = wallets[0];
      
      if (!wallet?.address) {
        throw new Error('No wallet connected');
      }
      
      // Convert to smallest unit (USDC has 6 decimals)
      const amountInSmallestUnit = parseUnits(amount, 6);
      
      // Calculate minimum shares (apply slippage)
      const minSharesOut = 
        (amountInSmallestUnit * BigInt(10000 - slippageBps)) / 10000n;
      
      // Encode the transaction
      const data = encodeFunctionData({
        abi: CROSS_CHAIN_VAULT_MANAGER_ABI,
        functionName: 'initiateDeposit',
        args: [
          '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
          amountInSmallestUnit,
          BigInt(chainId),
          vaultAddress,
          minSharesOut,
        ],
      });
      
      // Execute via Safe
      const txHash = await wallet.sendTransaction({
        to: CROSS_CHAIN_VAULT_MANAGER_BASE,
        data,
        chain: base,
      });
      
      return { txHash };
    },
  });
}
```

### 4. Cross-Chain Vault Selector UI

```typescript
// packages/web/src/components/vault/cross-chain-vault-selector.tsx

'use client';

import { useState } from 'react';
import { formatUnits } from 'viem';
import { useCrossChainDeposit } from '@/lib/hooks/use-cross-chain-deposit';
import { ALL_VAULTS, BASE_CHAIN_ID, ARBITRUM_CHAIN_ID } from '@/server/earn/base-vaults';
import { ACROSS_FEE_BPS } from '@/lib/across-constants';

export function CrossChainVaultSelector() {
  const [selectedVault, setSelectedVault] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const crossChainDeposit = useCrossChainDeposit();
  
  const handleDeposit = async () => {
    if (!selectedVault || !amount) return;
    
    const vault = ALL_VAULTS.find(v => v.id === selectedVault);
    if (!vault) return;
    
    try {
      await crossChainDeposit.mutateAsync({
        vaultAddress: vault.address,
        amount,
        chainId: vault.chainId || BASE_CHAIN_ID,
      });
    } catch (error) {
      console.error('Deposit failed:', error);
    }
  };
  
  const estimateFee = (amount: string) => {
    const amountNum = parseFloat(amount) || 0;
    return (amountNum * ACROSS_FEE_BPS) / 10000;
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Select Vault</h2>
      
      <div className="space-y-2">
        {ALL_VAULTS.map((vault) => {
          const isArbitrum = vault.chainId === ARBITRUM_CHAIN_ID;
          
          return (
            <button
              key={vault.id}
              onClick={() => setSelectedVault(vault.id)}
              className={`
                w-full p-4 rounded-lg border-2 text-left transition
                ${selectedVault === vault.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{vault.displayName}</div>
                  <div className="text-sm text-gray-600">
                    {vault.curator} • {vault.risk} Risk
                  </div>
                  {isArbitrum && (
                    <div className="mt-1 text-xs text-blue-600">
                      🌉 Cross-chain deposit via Across (~30 sec)
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {isArbitrum ? 'Arbitrum' : 'Base'}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {selectedVault && (
        <div className="space-y-3 pt-4 border-t">
          <div>
            <label className="block text-sm font-medium mb-1">
              Amount (USDC)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
              className="w-full p-3 border rounded-lg"
            />
          </div>
          
          {amount && (
            <div className="text-sm space-y-1 text-gray-600">
              <div className="flex justify-between">
                <span>Bridge Fee (0.5%):</span>
                <span>${estimateFee(amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>You'll receive:</span>
                <span className="font-semibold">
                  ${(parseFloat(amount) - estimateFee(amount)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Estimated time:</span>
                <span>10-30 seconds</span>
              </div>
            </div>
          )}
          
          <button
            onClick={handleDeposit}
            disabled={!amount || crossChainDeposit.isPending}
            className="
              w-full py-3 bg-blue-600 text-white rounded-lg
              hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {crossChainDeposit.isPending ? 'Processing...' : 'Deposit'}
          </button>
        </div>
      )}
    </div>
  );
}
```

## Backend: Track Cross-Chain Deposits

```typescript
// packages/web/src/server/earn/cross-chain-tracker.ts

import { createPublicClient, http, parseAbi, type Address } from 'viem';
import { arbitrum } from 'viem/chains';
import { db } from '@/db';
import { earnDeposits } from '@/db/schema';

const CROSS_CHAIN_RECEIVER_ABI = parseAbi([
  'event CrossChainDepositComplete(address indexed userSafe, address indexed vaultAddress, uint256 assetsDeposited, uint256 sharesReceived, bytes32 indexed messageId)',
]);

const arbitrumClient = createPublicClient({
  chain: arbitrum,
  transport: http(process.env.ARBITRUM_RPC_URL),
});

/**
 * Monitor CrossChainDepositComplete events on Arbitrum
 * and record them in our database
 */
export async function trackCrossChainDeposits(
  receiverAddress: Address,
  fromBlock: bigint
) {
  const logs = await arbitrumClient.getLogs({
    address: receiverAddress,
    event: CROSS_CHAIN_RECEIVER_ABI[0],
    fromBlock,
    toBlock: 'latest',
  });
  
  for (const log of logs) {
    const { userSafe, vaultAddress, assetsDeposited, sharesReceived, messageId } = 
      log.args;
    
    // Check if already recorded
    const existing = await db.query.earnDeposits.findFirst({
      where: (tbl, { eq }) => eq(tbl.txHash, log.transactionHash!),
    });
    
    if (existing) continue;
    
    // Find user by safe address
    const safeRecord = await db.query.userSafes.findFirst({
      where: (tbl, { eq }) => eq(tbl.safeAddress, userSafe!),
    });
    
    if (!safeRecord) {
      console.warn(`Safe ${userSafe} not found in database`);
      continue;
    }
    
    // Record deposit
    await db.insert(earnDeposits).values({
      id: messageId!,
      userDid: safeRecord.userDid,
      workspaceId: safeRecord.workspaceId,
      safeAddress: userSafe!,
      vaultAddress: vaultAddress!,
      tokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC on Arbitrum
      assetsDeposited: assetsDeposited!.toString(),
      sharesReceived: sharesReceived!.toString(),
      txHash: log.transactionHash!,
      timestamp: new Date(),
      depositPercentage: null, // Manual deposit
      apyBasisPoints: null, // Will be fetched separately
      assetDecimals: 6,
    });
    
    console.log(`Recorded cross-chain deposit: ${log.transactionHash}`);
  }
}

// Cron job to run every 5 minutes
export async function startCrossChainTracker() {
  const RECEIVER_ADDRESS = process.env.CROSS_CHAIN_VAULT_RECEIVER_ARBITRUM as Address;
  let lastBlock = BigInt(process.env.CROSS_CHAIN_TRACKER_START_BLOCK || 0);
  
  setInterval(async () => {
    try {
      await trackCrossChainDeposits(RECEIVER_ADDRESS, lastBlock);
      lastBlock = await arbitrumClient.getBlockNumber();
    } catch (error) {
      console.error('Cross-chain tracker error:', error);
    }
  }, 5 * 60 * 1000); // 5 minutes
}
```

## Deployment Steps

### 1. Deploy Contracts

```bash
# Deploy CrossChainVaultReceiver on Arbitrum
cd packages/fluidkey-earn-module
forge create \
  --rpc-url $ARBITRUM_RPC_URL \
  --private-key $DEPLOYER_PRIVATE_KEY \
  src/CrossChainVaultReceiver.sol:CrossChainVaultReceiver \
  --constructor-args \
    0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A \ # Across Spoke Pool Arbitrum
    $OWNER_ADDRESS

# Deploy CrossChainVaultManager on Base
forge create \
  --rpc-url $BASE_RPC_URL \
  --private-key $DEPLOYER_PRIVATE_KEY \
  src/CrossChainVaultManager.sol:CrossChainVaultManager \
  --constructor-args \
    0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64 \ # Across Spoke Pool Base
    $OWNER_ADDRESS
```

### 2. Configure Contracts

```bash
# Allow Morpho vault on receiver
cast send \
  --rpc-url $ARBITRUM_RPC_URL \
  --private-key $OWNER_PRIVATE_KEY \
  $RECEIVER_ADDRESS \
  "setVaultAllowed(address,bool)" \
  0x7e97fa6893871A2751B5fE961978DCCb2c201E65 \ # Morpho vault
  true

# Set receiver address on manager
cast send \
  --rpc-url $BASE_RPC_URL \
  --private-key $OWNER_PRIVATE_KEY \
  $MANAGER_ADDRESS \
  "setChainReceiver(uint256,address)" \
  42161 \ # Arbitrum
  $RECEIVER_ADDRESS
```

### 3. Environment Variables

```bash
# .env
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
CROSS_CHAIN_VAULT_MANAGER_BASE=0x...
CROSS_CHAIN_VAULT_RECEIVER_ARBITRUM=0x...
CROSS_CHAIN_TRACKER_START_BLOCK=...
```

## Testing

### Unit Tests

```typescript
// packages/web/src/lib/__tests__/cross-chain-deposit.test.ts

import { describe, it, expect } from 'vitest';
import { parseUnits } from 'viem';

describe('Cross-chain deposit calculations', () => {
  it('calculates fees correctly', () => {
    const amount = parseUnits('1000', 6); // 1000 USDC
    const feeBps = 50n; // 0.5%
    const fee = (amount * feeBps) / 10000n;
    
    expect(fee).toBe(parseUnits('5', 6)); // 5 USDC fee
  });
  
  it('calculates minimum shares with slippage', () => {
    const amount = parseUnits('1000', 6);
    const slippageBps = 50n; // 0.5%
    const minShares = (amount * (10000n - slippageBps)) / 10000n;
    
    expect(minShares).toBe(parseUnits('995', 6));
  });
});
```

### Integration Tests

```bash
# Test on testnet first
# 1. Deploy to Base Sepolia and Arbitrum Sepolia
# 2. Fund test Safe with test USDC
# 3. Execute cross-chain deposit
# 4. Verify shares on destination chain
# 5. Monitor for CrossChainDepositComplete event
```

## Cost Analysis

### Initial Deployment Costs
- CrossChainVaultReceiver (Arbitrum): ~$20-30
- CrossChainVaultManager (Base): ~$15-25
- Configuration transactions: ~$5-10
- **Total: $40-65**

### Operational Costs (per deposit)
- Across Protocol fee: 0.5% (~$5 on $1000 deposit)
- Gas on Base: ~$0.10-0.50
- Gas on Arbitrum: ~$0.50-1.00
- **Total per $1000 deposit: $5.60-6.50**

### Break-even Analysis
- 100 users × 5 deposits/month × $1000 avg = $500k volume
- Total fees: $2,800-3,250/month
- This is **5-10x cheaper** than deploying individual Safes on Arbitrum

## Monitoring & Alerts

```typescript
// packages/web/src/server/monitoring/cross-chain-alerts.ts

import { createPublicClient, http } from 'viem';
import { arbitrum } from 'viem/chains';

export async function monitorCrossChainDeposits() {
  const client = createPublicClient({
    chain: arbitrum,
    transport: http(),
  });
  
  // Monitor for failed deposits
  client.watchBlockNumber({
    onBlockNumber: async (blockNumber) => {
      // Check for pending deposits older than 5 minutes
      // Alert if Across bridge is slow
      // Log successful completions
    },
  });
}
```

## Next Steps

1. **Week 1**: Deploy contracts to testnets, test basic flow
2. **Week 2**: Add UI components, integrate with existing dashboard
3. **Week 3**: Deploy to mainnet with low limits ($1000 max)
4. **Week 4**: Monitor, optimize, increase limits
5. **Future**: Add more chains (Optimism, Polygon) using same pattern

## Future Enhancements

- **Multi-vault support**: Allow deposits to multiple vaults in one transaction
- **Automated rebalancing**: Move funds between chains based on APY
- **Batch deposits**: Aggregate multiple users' deposits for lower fees
- **Native withdrawals**: Use Across for withdrawing back to Base

## Resources

- [Across Protocol Docs](https://docs.across.to/)
- [Morpho Vaults](https://docs.morpho.org/vaults)
- [ERC-4626 Standard](https://eips.ethereum.org/EIPS/eip-4626)
