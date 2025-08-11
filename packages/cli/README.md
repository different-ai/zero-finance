# Zero Finance CLI

Self-custody business banking in your terminal.

## Installation

```bash
# Install dependencies
npm install

# Or with pnpm
pnpm install
```

## Authentication

The CLI uses token-based authentication. To authenticate:

1. Run the auth command:
   ```bash
   npm start auth login
   # or
   node src/index.js auth login
   ```

2. The CLI will open your browser to https://zerofinance.ai/cli-auth
   - If not logged in to Zero Finance, you'll be redirected to sign in first
   - Once logged in, you'll see the CLI authentication page

3. Click "Generate Token" on the web page

4. Copy the generated token

5. Paste the token in your terminal when prompted

6. You're authenticated! The token will be stored securely and used for API calls.

### Check Authentication Status

```bash
node src/index.js auth status
```

### Logout

```bash
node src/index.js auth logout
```

## Usage

### Interactive Mode

Run the CLI without arguments to enter interactive mode:

```bash
npm start
# or
node src/index.js
```

### Command Line Mode

Use specific commands directly:

```bash
# Show help
node src/index.js --help

# Check version
node src/index.js --version

# Check balance
node src/index.js balance

# Quick payment
node src/index.js pay john@example.com 1000

# Company management
node src/index.js company
```

## Available Commands

### Authentication
- `auth login` - Authenticate with Zero Finance
- `auth status` - Check authentication status
- `auth logout` - Log out from the CLI

### Company Management
- `company` - Enter company management menu (interactive)

### Banking Operations
- `balance` - Check account balance
- `accounts list` - List all accounts
- `accounts balance` - Check account balances

### Payments
- `pay <email> <amount>` - Quick payment to contractor

### KYC Verification
- `kyc start` - Start KYC verification process
- `kyc status` - Check KYC status

### QR Codes
- `qr generate --amount 100` - Generate payment QR code
- `qr scan` - Scan a QR code

### Transfers
- `transfers send --to <address> --amount <amount>` - Send funds
- `transfers list` - List recent transfers

## Features

### 🏢 Company Management
- Create new companies (LLC, C-Corp, S-Corp)
- Switch between multiple companies
- View company details and balances

### 🏦 Banking Operations
- Create self-custody bank accounts
- Check balances with real-time APY
- View transaction history
- Transfer funds between accounts

### 💸 Payments & Payroll
- Pay contractors via email
- Run payroll for employees
- Pay invoices
- Quick pay to recent recipients
- Multiple payment methods (USDC, ACH, Wire)

### 🤖 AI & Automation
- Connect Gmail for invoice detection
- Connect Claude AI for financial insights
- Auto-categorize transactions
- Smart payment scheduling
- Spending pattern analysis

### 📊 Analytics Dashboard
- Revenue trends
- Key metrics display
- Recent activity summary
- AI-generated insights

### 📧 Financial Inbox
- Process pending invoices
- Review payment requests
- Batch payment processing
- AI-powered recommendations

## Configuration

The CLI stores configuration data locally using the `conf` package. Data is persisted between sessions including:
- Authentication tokens (encrypted)
- Company information
- Current company selection
- User preferences

To reset configuration:
```bash
# Config is stored in:
# macOS: ~/Library/Preferences/zero-finance-cli-v2-nodejs
# Linux: ~/.config/zero-finance-cli-v2
# Windows: %APPDATA%/zero-finance-cli-v2
```

## Development

```bash
# Run in development mode with auto-reload
npm run dev

# Run tests
npm test

# Run test CLI with mock auth (for development)
node test-cli-full.js
```

## Testing

### Automated Tests
```bash
node test-cli.js
```

### Manual Testing with Mock Auth
For testing without real API connection:
```bash
# Use the test CLI with mock auth
node test-cli-full.js auth login
node test-cli-full.js auth status
node test-cli-full.js company
```

## Troubleshooting

### Config File Corrupted
If you see "Config file corrupted" message, the CLI will automatically create a new config file.

### Authentication Issues
1. Ensure you're logged in to Zero Finance web app
2. Check that your token hasn't expired with `auth status`
3. Try logging out and back in: `auth logout` then `auth login`

### API Connection Issues
- Check your internet connection
- Verify the API URL is correct (defaults to https://zerofinance.ai/api/trpc)
- Check if you're authenticated with `auth status`

## Security

- CLI tokens are hashed with bcrypt before storage in the database
- Tokens expire after 90 days by default
- Each token is shown only once when generated
- Tokens are stored locally with encryption
- You can revoke tokens from the web interface

## License

MIT
