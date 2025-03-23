# hyprsqrl

> Get Paid. Pay Bills. Make Money Work.

An open-source bank account built on crypto rails.

## What hyprsqrl Does

hyprsqrl transforms idle crypto into working capital:

- **Get Paid Easily** - Create invoices in seconds and get paid directly to your personal IBAN
- **Spend Anywhere** - Use a debit card worldwide with 0% conversion fees
- **Optimize Yield** - AI automatically allocates idle funds to highest-yielding opportunities
- **Automate Finances** - Complete accounting system with expense tracking and tax optimization

## Current Status

- Phase 0: [invoicing app](https://invoices.hyprsqrl.com)
- Phase 1: iban/usd accounts - in progress
- Phase 2: yiel optimization - soon🔜
- Phase 3: automatin via ai agents


## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- [pnpm](https://pnpm.io/installation) package manager
- [Screenpipe](https://screenpi.pe/) for screen detection features (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/different-ai/hypr-v0
cd hypr-v0

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## 📦 Project Structure

This monorepo contains multiple packages:

- **packages/landing-v0**: Marketing website and user onboarding (Next.js)
- **packages/web**: Invoice management web application (Next.js)
- **packages/shared**: Shared components and utilities
- **pipes/auto-pay**: Automated payment detection and processing

## Pipeline Overview

1. **Invoice Creation** - Generate crypto invoices through the web app
2. **Payment Processing** - Receive payments in EURe (Gnosis Chain) with Request Network integration
3. **Automated Detection** - Screen monitoring to detect payment information (via Auto-Pay Pipe)
4. **Financial Management** - AI tools for expense tracking and yield optimization

## Security & Privacy

- Screen monitoring runs locally
- Human review of all automated actions
- No centralized storage of sensitive information

## 🌐 Join Us

- [Join our waitlist](https://hyprsqrl.com)
- [Contribute on GitHub](https://github.com/different-ai/hypr-v0)
