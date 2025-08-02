# Zero Finance CLI

A bleeding-edge terminal interface for self-custody business banking. Manage your entire business finances from the command line.

## Features

- 🏢 **Company Management** - Create and manage LLCs, C-Corps
- 🏦 **Self-Custody Banking** - Your keys, your control
- 💸 **Smart Payments** - Pay contractors instantly with USDC or traditional methods
- 🤖 **AI Integration** - Claude AI for intelligent financial automation
- 📧 **Financial Inbox** - Process invoices from Gmail automatically
- 📊 **Analytics** - Real-time financial insights in your terminal
- 🔐 **Secure** - All funds stored as USDC in wallets you control

## Installation

```bash
# From the packages/cli directory
npm install

# Or using pnpm
pnpm install
```

## Usage

### Interactive Mode

```bash
node src/index.js
```

This launches the interactive CLI with a beautiful menu system.

### Command Mode

```bash
# Check balance
node src/index.js balance

# Quick payment
node src/index.js pay alex@example.com 5000

# Company management
node src/index.js company
```

## Key Commands

### Company Management
- Create new LLC or C-Corp
- Switch between companies
- View company details

### Banking
- Create self-custody bank accounts
- Check balances (USDC)
- View transactions
- Transfer funds
- Configure auto-yield (5.2% APY)

### Payments
- Pay contractors (USDC/ACH/Wire)
- Run payroll
- Pay invoices
- Quick pay to recent recipients

### AI & Automation
- Connect Gmail for invoice detection
- Enable Claude AI assistant
- Set automation rules
- View AI performance stats

### Financial Inbox
- View pending invoices
- One-click payment processing
- AI-powered insights

## Configuration

The CLI stores configuration in:
- macOS: `~/Library/Preferences/zero-finance-cli-nodejs`
- Linux: `~/.config/zero-finance-cli-nodejs`
- Windows: `%APPDATA%\zero-finance-cli-nodejs\Config`

## Development

```bash
# Run in development mode with auto-reload
npm run dev
```

## Architecture

- Built with modern ES modules
- Uses Inquirer.js for interactive prompts
- Chalk for beautiful terminal colors
- Ora for elegant loading spinners
- Boxen for styled terminal boxes
- Commander for CLI argument parsing
- Conf for persistent configuration

## Security

- All funds stored as USDC in self-custody wallets
- You control the private keys
- No bank can freeze your account
- Traditional banking rails via partners

## License

MIT