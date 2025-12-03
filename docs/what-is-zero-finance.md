# What is Zero Finance?

Zero Finance (0 Finance) is **insured high-yield savings infrastructure for businesses**. We provide safe and easy access to low-risk DeFi yields (6-10% APY vs 3-4% traditional), packaged with insurance, compliance, and a Mercury-like banking UX.

**The One-Liner**: "The Stripe for high-yield savings" - Our API lets any fintech embed insured DeFi yields without building the complexity themselves.

## The Problem We Solve

**Business banking is moving on-chain.** Businesses are already adopting stablecoin rails for cross-border transactions, supplier payments, and settlement. The spend layer is largely solved with on/off-ramp infrastructure.

**What's missing is what they do with idle balances sitting on-chain.**

DeFi yields are 2-3x higher than traditional bank rates. A business with $5M in idle cash earning 3% instead of 8-10% loses $250K-$350K annually. For well-funded startups raising $3-5M rounds, that's meaningful runway sitting idle.

**But building this is hard:**

1. DeFi protocol integrations (technical expertise required)
2. Insurance partnerships (takes 6-12 months to establish)
3. Compliance infrastructure (KYB/AML, self-custody architecture)
4. Vault selection and risk management (requires DeFi expertise)
5. On/off-ramp integration (banking relationships)

**Result:** Most businesses stick with TradFi solutions offering 3-4% instead of DeFi's 8-10%.

## Core Value Propositions

| Feature               | Description                                                             |
| --------------------- | ----------------------------------------------------------------------- |
| **6-10% APY**         | 2-3x traditional rates via vetted DeFi vaults (Morpho, Origin)          |
| **Insured Principal** | Smart contract exploit coverage via Chainproof (Munich Re reinsurance)  |
| **Self-Custodial**    | Users retain control through Gnosis Safe wallets - we can't touch funds |
| **Banking UX**        | ACH, IBAN, email login - no wallets, no gas fees, no crypto complexity  |
| **Instant Liquidity** | On-chain or bank transfer withdrawals, no lock-ups                      |

## The Vision: Platform Infrastructure

**Phase 1 (Current)**: Direct B2B savings product - prove the model with startups
**Phase 2**: Embedded partnerships - API for accelerators, neobanks, expense platforms
**Phase 3**: Platform play - become the default yield infrastructure layer for fintech

The direct savings account validates the infrastructure. The platform API is the $1B+ outcome.

## Product Roadmap

- [x] **Phase 0**: Invoicing
- [x] **Phase 1**: IBAN/ACH accounts
- [x] **Phase 2**: Savings accounts with yield
- [ ] **Phase 3**: Auto-sweep integration (Mercury/Plaid)
- [ ] **Phase 4**: Debit/credit cards
- [ ] **Phase 5**: Platform API for embedded partners

---

# The Platform Play

## Why This is Infrastructure, Not Just a Product

0 Finance is architected as **API-first, white-label-ready** from day one. The direct savings product is Phase 1 validation; the platform API is the real opportunity.

### Every Fintech Wants to Offer Yield

- **Neobanks** (Mercury, Relay, Found) - Need yield to compete
- **Expense platforms** (Ramp, Brex, Divvy) - Sitting on float
- **Payroll providers** (Deel, Remote, Rippling) - Hold funds between payday
- **Accelerators** (YC, Techstars, OrangeDAO) - Want perks for portfolio

**But building this is complex.** We solve the hard problems once:

- DeFi protocol integrations
- Insurance partnerships (Chainproof/Munich Re)
- Compliance infrastructure (self-custody = no MTL needed)
- Vault selection and risk management

### Platform Economics

| Model            | Revenue                        | Margin                  |
| ---------------- | ------------------------------ | ----------------------- |
| **Direct B2B**   | 10% of yield (~90bps AUM)      | Negative at small scale |
| **Platform API** | 20-30% rev share from partners | 50%+ at scale           |

**Network effects compound:**

- More partners → more AUM → better rates from protocols
- More AUM → lower insurance premiums (economy of scale)
- Better rates → more attractive to partners → flywheel

### Platform GTM Strategy

**Phase 1: Direct Validation (Current)**

- Build AUM to $10M-50M to prove infrastructure reliability
- Validate product works at scale
- Build insurance relationships

**Phase 2: Embedded Partnerships (6-12 months)**

- Accelerators (OrangeDAO in progress, residence.xyz inbound)
- Expense management platforms
- Neobank competitors

**Phase 3: Platform Scale (12-24 months)**

- Major neobanks (Mercury, Brex)
- Payroll providers (Deel, Rippling)
- Become default yield infrastructure layer

---

# How People Use Zero Finance

## Target Users

### 1. Startups (Primary ICP)

Crypto-native and AI startups with $3-5M seed rounds:

- Understand the value prop (8% = extra headcount)
- Have high idle cash ratios (need 18-24 months runway)
- Are more risk-forward (VCs may be crypto funds)
- Care about product velocity

**The math**: A startup with $5M earning 8% instead of 3% gains $250K/year - that's an extra engineer.

### 2. Platform Partners (Future)

- Accelerators offering yield as a portfolio perk
- Neobanks wanting to compete on yield
- Expense platforms earning on float

### 3. Contractors/Freelancers

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

**Vault Selection Criteria:**

- Past performance and track record
- Well-capitalized with significant TVL
- Limited exposure to exotic assets
- Over-collateralized lending only (ETH/BTC collateral)

APY fetched from:

- Morpho GraphQL: `https://blue-api.morpho.org/graphql`
- Origin API: `https://api.originprotocol.com/api/v2/superoethb/apr/trailing/7`

## 7. Insurance & Risk Model

### Chainproof Insurance Partnership

**Insurer**: Chainproof (licensed IIGB Bermuda)
**Reinsurance**: Munich Re ($300B+ reinsurer) and Sompo ($20B+ Japanese insurer)
**Cost**: Under 2% of principal annually
**Coverage**: 100% of principal currently

### What's Covered

**Covered (Smart Contract Exploits):**

- Reentrancy attacks
- Flash loan attacks
- Direct smart contract technical failures in vault code

**NOT Covered:**

- Strategy failures (vault manager bad decisions)
- Market risks (crypto price volatility)
- Stablecoin depegs (USDC losing peg)
- Oracle failures or governance attacks

### Risk Mitigation Strategy

| Risk Type             | Mitigation                                              |
| --------------------- | ------------------------------------------------------- |
| **Smart Contract**    | Chainproof insurance (Munich Re backing)                |
| **Stablecoin Depeg**  | Regulatory frameworks (Genius Act, MiCA)                |
| **Bank Run**          | Self-custody - users always own funds                   |
| **Custodian Failure** | If 0 Finance shuts down, users still control their Safe |
| **Market/Strategy**   | Blue-chip collateral only, no exotic assets             |

### Why Chainproof Over Alternatives

- **vs Nexus Mutual**: DeFi protocols have real solvency risk from crypto pools
- **vs Traditional (Marsh, Aon)**: Charge 5%+ if they'll even quote on DeFi
- **Chainproof**: Traditional insurance backing at sub-2% premiums

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

# Business Model

## Revenue Streams

### Direct B2B (Current)

- **Model**: 10% of yield generated = ~90 basis points of AUM annually
- **Example**: $2M deposit × 9% yield × 10% = $18K/year per customer

### Platform API (Future)

- **Small fintechs**: 20-30% revenue share of yield generated
- **Mid-market**: Fixed API fee ($5K-$10K/month) + 15-20% rev share
- **Enterprise**: Custom licensing deals

### Why Platform Economics Win

At $100M partner AUM:

- 9% gross yield = $9M annual yield generated
- 20% rev share = $1.8M revenue to 0 Finance
- Insurance cost: 2% → drops to 1.5% with volume
- **Gross margin: 50%+ at scale**

---

# Competitive Positioning

## Why Mercury/Coinbase Won't Build This

**Mercury**:

- Technical debt - not built for DeFi integration
- Economics conflict - they make money on float (your deposits)
- Pushing customers to higher yield hurts their business model

**Coinbase**:

- B2C focus - billions in retail trading fees
- Brand perception - "where you buy crypto" not "where you bank"

**If they validate the market, that's a win.** We're creating a category, not stealing share.

## Our Moat

1. **First-mover on insurance** - Chainproof partnership took months to establish
2. **Self-custody architecture** - Partners avoid MTL requirements by using us
3. **Network effects** - More AUM = better rates = more partners
4. **Team expertise** - Built $75M infrastructure at Gnosis Pay

---

# Summary

Zero Finance is **infrastructure for embedded DeFi yields**, not just a savings product.

**What we provide:**

1. **Insured high-yield savings** (6-10% vs 3-4% traditional)
2. **Self-custody** via Gnosis Safe (no custodian failure risk)
3. **Banking UX** with ACH/IBAN (no crypto complexity)
4. **Platform API** for fintechs to embed yields

**The architecture:**

- 3-layer wallet hierarchy (Privy EOA → Smart Wallet → Primary Safe)
- Gasless transactions via ERC-4337
- FluidkeyEarnModule for automated vault deposits
- Multi-chain support (Base primary, Arbitrum, Gnosis)

**The vision:**

- Phase 1: Direct B2B validates the infrastructure
- Phase 2: Embedded partnerships scale distribution
- Phase 3: Become the default yield layer for fintech

**The thesis**: By 2030, every business will bank on-chain—not because they care about blockchain, but because instant global payments beat 3-day wires, programmable money beats manual treasury, and 8% yield beats 4%.
