# HyprSQRL

> Your AI-Powered Financial Hub: Bridging Traditional Finance and Crypto for Freelancers and Businesses

HyprSQRL is an all-in-one crypto financial hub designed to help users collect payments, handle expenses, and maximize yield on earnings by bridging the gap between traditional finance and cryptocurrency.

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

## 🎯 Core Features

### Crypto Invoicing
- Create and send invoices for crypto payments
- Receive payments in EURe on Gnosis Chain and USDC on Ethereum
- Manage invoice requests through a simple dashboard
- Request Network integration for decentralized invoices

### Fiat Integration
- Monerium integration for e-money and IBAN connectivity
- Direct bank deposits from crypto payments
- Automated currency conversion

### AI-Powered Features
- ScreenPipe integration for AI document analysis
- Chat with your invoices and financial data
- Automated information extraction

### Auto-Pay Pipe
- Screen monitoring to detect payment information
- Automatic extraction of payment details
- Secure bank transfer initiation via Mercury API

## 🚧 Current Development Focus

We're currently focused on:

1. **Adding mainnet USDC support** for invoice payments
2. **Implementing fiat payment options**
3. **Completing Gnosis Chain integration**
4. **Building towards a personal finance application**

## 🔒 Privacy & Security

- **Privacy-First Design**
  - Screen monitoring runs locally
  - Your data stays under your control
  - No centralized storage of sensitive information

- **Human-in-the-Loop**
  - Review all automated actions
  - Approve payments before execution
  - Maintain complete oversight

## 📋 For Developers

Each package contains its own README.md with specific setup instructions.

- For the web invoice app: `cd packages/request-invoice-web`
- For the landing page: `cd packages/landing-v0`
- For the auto-pay pipe: `cd pipes/auto-pay`

## 🌐 Join Us

Interested in privacy-first financial automation?
- [Join our waitlist](https://hyprsqrl.com)
- [Contribute on GitHub](https://github.com/different-ai/hypr-v0)

We're building HyprSQRL to bridge the gap between traditional finance and cryptocurrency, making it easier for freelancers and businesses to manage their finances.