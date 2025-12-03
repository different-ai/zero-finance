# What is Zero Finance?

Zero Finance (0 Finance) is an **open-source stablecoin bank** that combines traditional banking UX with DeFi-level yields. It's a Next.js application with smart contract automation for savings management.

## The Problem We Solve

Traditional banks offer ~0.5% APY on deposits while crypto yield opportunities offer 5-10%+. But accessing DeFi is complex: wallets, gas fees, protocols, smart contract risk. Zero Finance abstracts this complexity behind a familiar banking interface.

## Core Value Propositions

| Feature                | Description                                                                       |
| ---------------------- | --------------------------------------------------------------------------------- |
| **Get Paid Easily**    | Create invoices in seconds and get paid directly to your personal IBAN            |
| **Spend Anywhere**     | Use a debit card worldwide with 0% conversion fees (Phase 3 - Planned)            |
| **Optimize Yield**     | AI automatically allocates idle funds to highest-yielding opportunities (8%+ APY) |
| **Non-Custodial**      | Users retain self-custody through Gnosis Safe wallets                             |
| **Insurance Coverage** | Up to $1M coverage from licensed insurer (Chainproof)                             |

## Product Roadmap

- [x] **Phase 0**: Invoicing
- [x] **Phase 1**: IBAN/ACH accounts
- [x] **Phase 2**: Savings accounts
- [ ] **Phase 3**: Debit/credit cards

---

# How People Use Zero Finance

## Target Users

### 1. Startups (Primary)

- Treasury management for idle runway ($100K+ earning 8% instead of 0.5%)
- Invoice creation and payment collection
- Team collaboration via workspaces

### 2. Contractors/Freelancers

- Invoice submission to clients
- Crypto payment reception
- Yield earning on received payments

## Key User Flows

### Onboarding Flow

```
1. Sign in via Privy (email/social)
   ↓
2. Create workspace (team container)
   ↓
3. Deploy Primary Safe (smart wallet)
   ↓
4. Complete KYC (if banking features needed)
   ↓
5. Virtual bank account provisioned
```

### Invoice Flow

```
1. Create invoice with seller/buyer details
   ↓
2. Share invoice link with client
   ↓
3. Client pays via crypto or bank transfer
   ↓
4. Payment auto-deposited to Safe
   ↓
5. Optional: Auto-earn sweeps to yield vault
```

### Yield/Savings Flow

```
1. Configure auto-earn percentage (e.g., 80%)
   ↓
2. Deposit USDC to Safe
   ↓
3. System auto-deposits to selected vault
   ↓
4. Yield compounds automatically
   ↓
5. Withdraw anytime (no lock-ups)
```

---

# Architecture (Inverted Pyramid)

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE                           │
│  Next.js App • Banking UX • Technical Mode Toggle           │
├─────────────────────────────────────────────────────────────┤
│                    APPLICATION LAYER                        │
│  tRPC Routers • Workspace Management • Invoice System       │
├─────────────────────────────────────────────────────────────┤
│                    WALLET INFRASTRUCTURE                    │
│  Privy Auth • Smart Wallets • Gnosis Safe                   │
├─────────────────────────────────────────────────────────────┤
│                    SMART CONTRACTS                          │
│  FluidkeyEarnModule • ERC-4626 Vaults • Multi-chain Safes   │
├─────────────────────────────────────────────────────────────┤
│                    EXTERNAL INTEGRATIONS                    │
│  Align (Banking) • Morpho (Yield) • Origin • LiFi (Bridge)  │
└─────────────────────────────────────────────────────────────┘
```

## The 3-Layer Wallet Hierarchy

**CRITICAL**: Understanding this prevents common bugs.

```
Layer 1: Privy Embedded Wallet (EOA)
    ↓ owns
Layer 2: Privy Smart Wallet (Safe - gas sponsorship via ERC-4337)
    ↓ owns
Layer 3: Primary Safe (User's "Bank Account" - WHERE FUNDS RESIDE)
```

| Layer | What It Is            | Purpose                               | Address Source                                        |
| ----- | --------------------- | ------------------------------------- | ----------------------------------------------------- |
| 1     | Privy Embedded Wallet | Signs transactions                    | `usePrivy()` → `user.wallet.address`                  |
| 2     | Privy Smart Wallet    | Gas sponsorship via bundler/paymaster | `useSmartWallets()` → `client.account.address`        |
| 3     | Primary Safe          | User's bank account with funds        | `getMultiChainPositions` or `settings.userSafes.list` |

### Why Three Layers?

1. **Layer 1 (EOA)**: Created instantly by Privy on sign-up. Used for signing.
2. **Layer 2 (Privy Smart Wallet)**: Enables gasless transactions via ERC-4337 paymaster.
3. **Layer 3 (Primary Safe)**: The actual "bank account" where user funds live. Owned by Layer 2, enabling sponsored transactions on user's Safe.

## Multi-Chain Support

| Chain    | Chain ID | Primary Use                          |
| -------- | -------- | ------------------------------------ |
| Base     | 8453     | **Default** - All primary operations |
| Arbitrum | 42161    | Cross-chain vaults                   |
| Gnosis   | 100      | sDAI vaults                          |
| Ethereum | 1        | Limited support                      |

**Deterministic Deployment**: Safes use CREATE2 with salt = lowercase Base Safe address, ensuring same address across all chains.

---

# Core Systems Deep Dive

## 1. Authentication (Privy)

- Email/social login (Google, etc.)
- Automatic embedded wallet creation
- Smart wallet (ERC-4337) for gas sponsorship
- Session management

**Key Files**:

- `src/components/auth/privy-provider.tsx`
- `src/hooks/use-smart-wallet.ts`

## 2. Workspace System

Multi-tenant architecture for teams:

```
Workspace
├── Owner (creator)
├── Members (invited users)
├── Companies (billing entities)
├── Safes (linked wallets)
└── KYC Status (workspace-scoped, not user-scoped)
```

**Key Insight**: KYC is done at the workspace level. A user can be KYC'd in one workspace but not another.

## 3. Safe Transaction Flow

```typescript
// 1. Build Safe transaction
const safeTx = await buildSafeTx(txs, { safeAddress, chainId, gas });

// 2. Relay via Privy Smart Wallet (Layer 2)
const txHash = await relaySafeTx(safeTx, signerAddr, smartClient, safeAddress);
```

**How Gas Sponsorship Works**:

1. Transaction is encoded for Safe's `execTransaction`
2. Privy Smart Wallet submits via ERC-4337 bundler
3. Paymaster covers gas costs
4. Safe executes the actual transaction

**Key Files**:

- `src/lib/sponsor-tx/core.ts` - Transaction building/relaying
- `src/hooks/use-safe-relay.ts` - React hook for UI

## 4. FluidkeyEarnModule (Auto-Earn)

Smart contract that automates yield deposits:

**Contract Address**: `0x3BDb857AFe9b51d8916D80240d2ADe40D4d3f2f9` (Base)

```solidity
// Authorized relayer triggers auto-earn on incoming deposits
function autoEarn(address token, uint256 amountToSave, address safe) external;
```

**Flow**:

```
1. Deposit detected in Safe
   ↓
2. Server checks user's auto-earn config (e.g., 80%)
   ↓
3. Relayer calls FluidkeyEarnModule.autoEarn()
   ↓
4. Module executes on behalf of Safe:
   - Approve vault to spend tokens
   - Deposit into ERC-4626 vault
   ↓
5. Shares recorded in earnDeposits table
```

## 5. Virtual Banking (Align Integration)

Provides traditional banking rails:

- **US**: ACH routing numbers
- **EU**: SEPA IBANs
- **Global**: Wire transfers

**Flow**:

```
1. Create Align customer (on workspace)
   ↓
2. Complete hosted KYC flow
   ↓
3. Virtual account provisioned
   ↓
4. Incoming transfers auto-convert to USDC
   ↓
5. USDC deposited to user's Safe
```

## 6. Yield Vaults (ERC-4626)

Supported vaults on Base:

| Vault                  | Asset | Risk Level  | Curator           |
| ---------------------- | ----- | ----------- | ----------------- |
| Gauntlet USDC Frontier | USDC  | Optimized   | Morpho x Gauntlet |
| Seamless USDC          | USDC  | Balanced    | Gauntlet          |
| Steakhouse USDC        | USDC  | Balanced    | Steakhouse        |
| Super OETH             | ETH   | Market Risk | Origin Protocol   |

APY fetched from:

- Morpho GraphQL: `https://blue-api.morpho.org/graphql`
- Origin API: `https://api.originprotocol.com/api/v2/superoethb/apr/trailing/7`

---

# Database Schema Overview

## Core Tables

| Table                              | Purpose                         |
| ---------------------------------- | ------------------------------- |
| `users`                            | User accounts (Privy DID as PK) |
| `workspaces`                       | Multi-tenant containers         |
| `workspaceMembers`                 | User-workspace relationships    |
| `userSafes`                        | Safe wallets per user per chain |
| `userFundingSources`               | Linked bank accounts            |
| `earnDeposits` / `earnWithdrawals` | Vault transaction tracking      |
| `autoEarnConfigs`                  | Auto-sweep percentage settings  |
| `companies`                        | Company profiles for invoicing  |
| `userRequestsTable`                | Invoices/payment requests       |

## Key Relationships

```
User (Privy DID)
├── belongs to → Workspaces (via workspaceMembers)
├── owns → Safes (userSafes)
└── creates → Invoices (userRequestsTable)

Workspace
├── has → Members
├── has → Companies
├── has → KYC Status (alignCustomerId)
└── has → Virtual Bank Account (alignVirtualAccountId)

Safe
├── belongs to → User
├── optionally linked to → Workspace
├── has → EarnDeposits
└── has → AutoEarnConfig
```

---

# Key Files Reference

| File                                          | Purpose                          |
| --------------------------------------------- | -------------------------------- |
| `src/lib/sponsor-tx/core.ts`                  | Build & relay Safe transactions  |
| `src/hooks/use-safe-relay.ts`                 | React hook for transaction relay |
| `src/hooks/use-primary-account-setup.ts`      | Onboarding Safe deployment       |
| `src/server/earn/multi-chain-safe-manager.ts` | Server-side Safe CRUD            |
| `src/server/routers/earn-router.ts`           | Earn module tRPC router          |
| `src/server/routers/align-router.ts`          | Banking integration router       |
| `src/server/routers/workspace-router.ts`      | Workspace management             |
| `src/db/schema/user-safes.ts`                 | Safe wallet schema               |
| `packages/fluidkey-earn-module/`              | Auto-earn smart contracts        |

---

# Design Philosophy

## Abstraction-First UX

- **Never expose** blockchain addresses, private keys, tx hashes in primary flows
- **Use banking terminology**: "account" not "wallet", "transfer" not "send tx"
- **Progressive disclosure**: Advanced users can toggle technical details

## Bimodal Interface ("DeFi Mullet")

Two modes with instant toggle:

| Banking View (Default) | Technical View       |
| ---------------------- | -------------------- |
| Serif fonts            | Monospace fonts      |
| Warm canvas background | Blueprint grid       |
| Outcomes-focused       | Architecture-focused |
| "Your balance"         | "Safe: 0x..."        |

## Three-Tier Information Architecture

- **Level 0** (Always Visible): Value props, banking language
- **Level 1** (Click to Reveal): Account details, balances
- **Level 2** (Deliberate Toggle): Contract addresses, protocols, tx hashes

---

# Deployment Options

## 1. Hosted Version

Visit [0.finance](https://0.finance)

## 2. Self-Hosted (Lite Mode)

Minimal setup without Align banking:

```bash
# Required
POSTGRES_URL=postgresql://...
NEXT_PUBLIC_PRIVY_APP_ID=...
PRIVY_APP_SECRET=...
DEPLOYER_PRIVATE_KEY=0x...

# Run
pnpm install
pnpm dev:lite
```

See `ZERO_FINANCE_LITE.md` for full instructions.

## 3. Full Features

Add Align for banking, yield protocols, multi-chain support:

```bash
# Banking
ALIGN_API_KEY=...
ALIGN_SECRET=...
ALIGN_CLIENT_ID=...

# Multi-chain
BASE_RPC_URL=...
ARBITRUM_RPC_URL=...

# Auto-earn
AUTO_EARN_MODULE_ADDRESS=0x3BDb857AFe9b51d8916D80240d2ADe40D4d3f2f9
RELAYER_PK=0x...
```

---

# Summary

Zero Finance bridges traditional banking and DeFi by:

1. **Abstracting complexity** behind familiar banking UX
2. **Maintaining self-custody** via Gnosis Safe wallets
3. **Automating yield** through smart contract modules
4. **Providing banking rails** via virtual accounts
5. **Supporting teams** with workspace-based access control

The 3-layer wallet architecture (Privy EOA → Privy Smart Wallet → Primary Safe) enables gasless transactions while keeping user funds in non-custodial smart wallets.
