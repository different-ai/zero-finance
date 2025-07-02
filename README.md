# Zero Finance

> Get Paid. Pay Bills. Make Money Work.

An open-source bank account built on crypto rails.

## What Zero Finance Does

Zero Finance transforms idle crypto into working capital:

- **Get Paid Easily** - Create invoices in seconds and get paid directly to your personal IBAN
- **Spend Anywhere** - Use a debit card worldwide with 0% conversion fees
- **Optimize Yield** - AI automatically allocates idle funds to highest-yielding opportunities
- **Automate Finances** - Complete accounting system with expense tracking and tax optimization

## Current Status

- [x] Phase 0: invoicing
- [x] Phase 1: iban/usd accounts
- [x] Phase 2: yiel optimization - early access🔜
- [ ] Phase 3: receipts matching/invoice matching - early access🔜
- [ ] Phase 4: debit/credit cards

## 🚢 Deployment

Self-hosting **Zero Finance** is technically possible but not yet plug-and-play. The full stack relies on several third-party services (Privy for authentication, Align for virtual bank accounts, AI inference, RPC endpoints, Postgres, object storage, etc.). Because of these moving parts we do not publish a single-command installer at the moment.

If you only need invoicing and on-chain payments you can run a **lightweight** version that depends solely on **Privy**:

```bash
# from the monorepo root
env PRIVY_APP_ID=<your_app_id> pnpm --filter web dev
```

The thin build disables:

- Align virtual account creation / fiat on-off ramp
- Auto-earn yield strategies
- Debit card integrations

Everything crypto-native still works and you can upgrade later by adding the required environment variables and services.

Need help? Open an issue or reach out – we're happy to guide you through a production deployment.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- [pnpm](https://pnpm.io/installation) package manager


### Installation

```bash
# Clone the repository
git clone https://github.com/different-ai/zero-finance
cd zero-finance

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## 📦 Project Structure

This monorepo contains multiple packages:

- **packages/web**: Invoice management web application (Next.js)



## 🌐 Join Us

- [Join our waitlist](https://0.finance)
- [Contribute on GitHub](https://github.com/different-ai/zero-finance)
