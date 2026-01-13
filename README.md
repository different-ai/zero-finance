<br />
<br />
<a href="https://vercel.com/oss">
  <img alt="Vercel OSS Program" src="https://vercel.com/oss/program-badge.svg" />
</a>

# 0 Finance

> CLI-first banking for AI agents. Give your agents access to a bank account to create invoices, propose bank transfers, and match receipts purely from the CLI. Forkable and self-hostable.

<img width="1840" height="1195" alt="Screenshot 2025-12-28 at 18 06 16" src="https://github.com/user-attachments/assets/c0b68eb2-1c53-4af5-b452-d78836f10cc3" />

## Agent Capabilities

0 Finance gives agents a real bank account with a CLI-first workflow:

- **CLI-first banking** - Every workflow is scriptable via the `zero` CLI.
- **Invoices** - Create and send invoices from the terminal.
- **Bank transfers** - Propose ACH/IBAN transfers with approval gates.
- **Receipt matching** - Attach receipts to transactions and reconcile via CLI.
- **Optimize yield** - Idle funds auto-earn higher yield.
- **Forkable** - Run your own instance or customize workflows.

## CLI Quick Start

CLI-first banking for agents starts with the `zero` CLI.

```bash
curl -fsSL https://zerofinance.ai/install | bash

# Authenticate
zero auth connect

# Or: zero auth login --api-key sk_live_xxx

# Check balance
zero balance
```

The CLI package is `agent-bank`, and the binary is `zero` (alias: `zero-bank`) for agent workflows.

## Current Status

- [x] Phase 0: invoicing
- [x] Phase 1: iban/ach accounts
- [x] Phase 2: savings accounts
- [ ] Phase 3: debit/credit cards

## 🚀 Deployment Options

### Option 1: Use Our Hosted Version

- Visit [0.finance](https://0.finance)
- Full features, managed infrastructure
- Insurance available via contact

### Option 2: Self-Host (Advanced Users)

- Full control over your instance
- Manage your own funds
- See [LITE_MODE.md](./LITE_MODE.md) for setup

## Development

### Quick Start (Recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/different-ai/zero-finance/main/scripts/bootstrap.sh | bash
```

This one-liner will:

1. Install Node.js, pnpm, and OpenCode (if missing)
2. Clone the repository
3. Install dependencies
4. Launch an AI agent to guide you through setup

### Manual Setup

```bash
# Clone the repository
git clone https://github.com/different-ai/zero-finance.git
cd zero-finance

# Install dependencies
pnpm install

# For local development (with Docker)
pnpm lite

# For production development
pnpm dev
```

### AI-Assisted Development

This repo includes [OpenCode](https://opencode.ai) configuration for AI-assisted development:

```bash
# Install OpenCode
curl -fsSL https://opencode.ai/install | bash

# Run in the repo
opencode

# Type @bootstrap for guided setup
# Type @debug-workspace to diagnose issues
```

See [AGENTS.md](./AGENTS.md) for full AI agent documentation.

### 🔄 Self-Hosted Migration Guide

Want to migrate from hosted to self-hosted?

1. **Set up lite mode** (see [LITE_MODE.md](./LITE_MODE.md))
2. **Add yourself as Safe owner** on current account
3. **Transfer funds** via Safe UI to new instance
4. **Configure insurance** if needed (contact raghav@0.finance)

⚠️ Self-hosted instances with real funds require:

- Proper Privy configuration
- Safe wallet setup
- Understanding of gas fees
- Security best practices

## 📦 Project Structure

This monorepo contains multiple packages:

- **packages/cli**: The `zero` CLI built for agents
- **packages/web**: The bank web app
- **packages/fluidkey-earn-module/**: The smart contract that helps with securely automating savings.

## 🌐 Join Us

- [Join our waitlist](https://0.finance)
- [Contribute on GitHub](https://github.com/different-ai/zero-finance)
