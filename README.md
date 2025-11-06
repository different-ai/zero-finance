
<br />
<br />
<a href="https://vercel.com/oss">
  <img alt="Vercel OSS Program" src="https://vercel.com/oss/program-badge.svg" />
</a>


# 0 Finance

> Your business savings account is now open source. 0 finance is a stablecoin bank that works like a regular bank. You can send & receive money out via ACH, earn 2-3x the yield compared to regular savings accounts, and fork it!



<img width="3680" height="2390" alt="image" src="https://github.com/user-attachments/assets/92fe569d-f8bd-4568-b896-f89dc40c7ac0" />



## What Zero Finance Does

0 Finance is a bank account that automates your finances:

- **Get Paid Easily** - Create invoices in seconds and get paid directly to your personal IBAN
- **Spend Anywhere** - Use a debit card worldwide with 0% conversion fees
- **Optimize Yield** - AI automatically allocates idle funds to highest-yielding opportunities

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

```bash
# Clone the repository
git clone https://github.com/different-ai/zero-finance
cd zero-finance

# Install dependencies
pnpm install

# For local development (with Docker)
pnpm lite

# For production development
pnpm dev
```

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

- **packages/web**: The bank web app
- **packages/fluidkey-earn-module/**: The smart contract that help with securely automating savings.

## 🌐 Join Us

- [Join our waitlist](https://0.finance)
- [Contribute on GitHub](https://github.com/different-ai/zero-finance)
