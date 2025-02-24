# hyprsqrl

> Your AI-Powered Financial Assistant: Privacy-First Automation for High-Volume Transactions

hyprsqrl is an integration-first, financial automation platform designed as your AI assistant, built for freelancers, small businesses, and e-commerce platforms handling numerous daily payments. We streamline administrative and financial tasks by securely monitoring your screen and favorite apps, coordinating workflows like invoicing and payment reconciliation—all while keeping your data private and under your control.

## 🚀 Quick Start

### Prerequisites
- macOS (Apple Silicon or Intel)
- Node.js 18+
- [pnpm](https://pnpm.io/installation) package manager
- [Screenpipe](https://screenpi.pe/) for screen detection features (free & open-source)

### Installation

1. **Download and Install**
   ```bash
   # Clone the repository
   git clone https://github.com/different-ai/hypr-v0
   cd hypr-v0

   # Install dependencies
   pnpm install

   # Start development server
   pnpm dev
   ```

2. **Configure Auto-Pay (Optional)**
   - Install [Screenpipe](https://screenpi.pe/)
   - Add the auto-pay pipe to your Screenpipe installation
   - Configure your Mercury API credentials
   - Start automating payments!

## 🎯 Core Features

### 1. hyprsqrl Desktop
The main application for seamless financial automation:

- **AI Task Detection**
  - Identifies financial tasks from your screen activity
  - Automatically creates and organizes tasks
  - Syncs with Obsidian for Markdown-based task storage

- **Financial Inbox (Human-in-the-Loop)**
  - Detects financial actions needing your review
  - Approve or adjust automated workflows
  - Maintains full user control

- **Invoice Management**
  - Generates invoices automatically via Request Network
  - Tracks payment statuses in real-time
  - Supports multiple currencies

- **Payment Reconciliation**
  - Matches incoming payments to invoices
  - Flags discrepancies for review
  - Provides daily transaction summaries

### 2. Auto-Pay (Screenpipe App)
Privacy-focused payment automation:

- **Smart Detection**
  - Monitors screen for payment triggers (e.g., emails, PDFs, chats)
  - Gathers context for accurate automation
  - Supports high-volume transaction processing

- **Mercury Integration**
  - Prepares ACH transfers seamlessly
  - Manages recipients and verifies details
  - Ensures secure API connectivity

## 🔒 Privacy & Security

- **100% Local Processing**
  - Screen monitoring runs locally
  - [ ] Local AI models (in progress)

- **Human-in-the-Loop**
  - Review all automated actions
  - Approve payments before execution
  - Retain complete oversight

<img width="1312" alt="Screenshot" src="https://github.com/user-attachments/assets/b4b63992-62da-4553-b240-fcd8d0d2e54a" />

## Philosophy

hyprsqrl is built on three core principles:

1. **Integration-First**: Works with your existing payment, invoicing, and accounting tools—no need to switch platforms.
2. **Human-in-the-Loop**: AI detects tasks and queues them in a Financial Inbox for your confirmation before execution.
3. **Eventually Invisible**: Our goal is to save you time on financial admin, letting you focus on growing your business.

## 🤖 AI Agents

Our intelligent agents collaborate to streamline your financial workflows:

- ✅ **Invoice Agent**
  - Creates invoices via Request Network
  - Detects billable events from screen activity
  - Monitors payment statuses

- 🔄 **Reconciliation Agent**
  - Matches payments to invoices
  - Identifies unmatched transactions
  - Generates reconciliation reports

- 🔄 **Task Agent**
  - Produces Obsidian-compatible tasks
  - Tracks screen activity for financial triggers
  - Manages task automation

- 🔄 **Payment Agent**
  - Processes payments through Mercury
  - Automates recurring payments
  - Detects payment details accurately

## Real-World Use Cases

1. **Payment Reconciliation**
   - Matches high volumes of daily payments to invoices
   - Flags discrepancies instantly
   - Simplifies transaction reporting

2. **Invoice Automation**
   - Detects invoice needs from emails or chats
   - Generates and sends invoices automatically
   - Tracks payment deadlines

3. **Recurring Payments**
   - Automates subscription or vendor payments
   - Schedules payments via Mercury
   - Ensures timely execution

## 🔮 Future Roadmap

- **Integration Expansion**
  - QuickBooks for accounting sync
  - Stripe for payment processing
  - Xero for financial reporting
  - Monerium for IBAN transfers

- **Enhanced Features**
  - Multi-account reconciliation
  - Custom automation workflows
  - Advanced reporting tools

## ⚠️ Project Status

hyprsqrl is in **Early Alpha**. Key notes:

- Not production-ready
- Features and APIs may evolve
- We welcome feedback and contributions
- Prioritizing stability and security

## Join Us

Interested in privacy-first financial automation?
- [Join our waitlist](https://hyprsqrl.com)
- [Schedule a demo](https://hyprsqrl.com)
- [Contribute on GitHub](https://github.com/different-ai/hypr-v0)

We’re building hyprsqrl to handle your repetitive financial tasks, so you can focus on what matters—your business.

