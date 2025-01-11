# hyprsqrl

> Privacy-first finance automation for your business, powered by AI agents

hyprsqrl is an integration-first, financial automation tool designed to work with (not replace) the tools you already trust. We automate away administrative and financial tasks by using context from your screen & your favoriates apps (like emails, slack, and github) and coordinating end-to-end workflows.

Think of it as an AI-powered personal assistant that integrates seamlessly with your tool of choice (Mercury, Xero, etc.), so you can keep your processes exactly how you like them—only faster.

> **Note**: This is NOT production-ready. Please explore, experiment, and share your feedback as we build.  
> **Source code**: [github.com/different-ai/hypr-v0](https://github.com/different-ai/hypr-v0)

<img width="1312" alt="Screenshot" src="https://github.com/user-attachments/assets/b4b63992-62da-4553-b240-fcd8d0d2e54a" />

## Philosophy

hyprsqrl is built on three core principles:

1. **Integration-First**: We plug into your existing payments, invoicing, and accounting stacks—no need to abandon your favorite tools!
2. **Local-First**: File-over-app means your data stays in Markdown files on your local drive—giving you privacy and control.
3. **AI That Just Works**: Our AI "watches" for tasks and queues them in a Financial Inbox—a single place where you confirm or tweak details before anything final happens.

## Features

### 1. auto-pay
Our flagship feature that makes payments effortless:
- **Smart Detection**: Automatically spots payment information on your screen (invoices, agreements, etc.)
- **Mercury Integration**: Seamlessly prepares ACH transfers through your Mercury account
- **Human Control**: Review and approve payments before they're sent
- **Progressive Updates**: AI continuously improves payment details as it finds more context
- **Multi-Source Support**: Works with PDFs, emails, chat messages, and more

### 2. AI Task Insights
- Get an overview of your most important tasks
- Automate away recurring tasks
- Sync seamlessly with Obsidian (tasks stored as Markdown files)

### 3. Financial Inbox (Human in the Loop)
- **Spot**: AI detects financial tasks on your screen
- **Queue**: Generates items in your Financial Inbox
- **Approve**: You confirm or edit details before execution

## Agents

We use AI agents to watch for opportunities and act on your behalf:

- [x] **Task Agent**: Creates tasks in Obsidian-compatible Markdown from screen activity
- [x] **Payment Agent**: Detects and processes payments through Mercury
- [x] **Calendar Agent**: Creates calendar events from screen triggers
- [ ] **Invoice Agent**: Generates invoices via Request Network (in progress)

## Connects to Data From

- [x] **Obsidian**
- [x] **[Screenpipe](https://screenpi.pe/)** (Local screen monitoring)
- [x] **Mercury** (ACH transfers)
- [ ] **Emails**
- [ ] **GitHub**
- [ ] **Linear**
- [ ] **Telegram**
- [ ] **Slack**

## Real-World Use Cases

1. **Payment Processing**
   - Detect payment triggers from meetings, emails, or documents
   - Automate recurring payments through Mercury
   - Multi-currency support
   - Recipient verification and management

2. **Invoice Management**
   - Automatically detect and categorize invoices
   - Generate payment requests
   - Track payment status

3. **Treasury Management**
   - Monitor and optimize DeFi yields
   - Manage USDC/fiat allocations
   - Track treasury performance

## Installing

We're continually publishing new releases.  
[Pick the latest release](https://github.com/different-ai/hypr-v0/tags) and follow the instructions to install.

### Development Setup

**_Only tested on macOS with pnpm_**

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start development server**
   ```bash
   pnpm dev
   ```

### System Requirements

- macOS (Apple Silicon or Intel)
- Node.js 18+
- pnpm

## Future Integrations

- **QuickBooks** (Accounting automation)
- **Stripe** (Payment processing)
- **Xero** (Financial reporting)
- **Monerium** (IBAN transfers)
- **Aave** & **Compound** (DeFi yield optimization)

## State of the Product

- **Integration-First**: We connect with your existing finance stack—no tool-switching needed
- **Local-First**: Your data lives where you do, not in someone else's cloud
- **Open Source**: Explore and contribute at [github.com/different-ai/hypr-v0](https://github.com/different-ai/hypr-v0)
- **Early Alpha**: This is NOT production-ready. We're actively developing and welcome feedback

## Join Us

If local-first, integration-heavy automation intrigues you:
- [Join our waitlist](https://hyprsqrl.com)
- [Schedule a demo](https://hyprsqrl.com)
- [Contribute on GitHub](https://github.com/different-ai/hypr-v0)

We're building hyprsqrl to let you focus on real business challenges while AI handles the boring finance tasks in the background.

