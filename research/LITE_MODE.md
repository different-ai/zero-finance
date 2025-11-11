# Zero Finance Lite Mode 🚀

Run Zero Finance locally with zero external dependencies (except Docker).

## Two Ways to Use Lite Mode

### 1. Development Mode (Default)

- Local testing only
- No real funds
- No insurance needed

### 2. Self-Hosted Production (Advanced)

- Can handle REAL FUNDS
- Full control over your instance
- Requires proper configuration

## ⚠️ Insurance & Real Funds Notice

**Development Use:**

- No insurance available or needed
- Use test funds only

**Self-Hosted Production Use:**

- Can manage real funds after proper setup
- No automatic insurance
- Contact raghav@0.finance for coverage options
- YOU are responsible for security

## ⚠️ Important: Privy Smart Wallet Setup

**Before running the app**, you need to configure smart wallets in your Privy dashboard:

1. **Go to your Privy Dashboard**: https://dashboard.privy.io
2. **Navigate to**: Wallets → Smart Wallets
3. **Enable Smart Wallets** and configure:
   - **Chain**: Base (8453)
   - **Smart Account Type**: Safe
   - **Paymaster**: Choose "None" for lite mode (users pay gas)
   - Or configure a paymaster for gasless transactions

Without this setup, users won't be able to create wallets in the app.

📖 Full documentation: https://docs.privy.io/wallets/using-wallets/evm-smart-wallets/setup/configuring-dashboard

## Quick Start (One Command)

```bash
pnpm lite
```

That's it! This will:

1. Start a local PostgreSQL database in Docker
2. Run database migrations
3. Start the app on http://localhost:3055

## Manual Steps (if you prefer)

```bash
# 1. Start database
docker-compose -f docker-compose.lite.yml up -d

# 2. Run migrations
pnpm --filter web db:migrate:lite

# 3. Start the app
pnpm dev:lite
```

## Stop Everything

```bash
pnpm lite:stop
```

## Reset Database

```bash
pnpm lite:clean
```

## What's Included?

- ✅ Local PostgreSQL database (no cloud signup needed)
- ✅ Privy authentication (using app ID: cmfjvrjol0084js0dbnz6qu69)
- ✅ Crypto wallet functionality
- ✅ Base network integration
- ❌ Banking features (no Align API in lite mode)
- ❌ KYC features (no Align API in lite mode)

## Configuration

All settings are in `.env.lite` - it's pre-configured and ready to go!

## Troubleshooting

**Docker not running?**

- Mac: Start Docker Desktop or run `colima start`
- Linux: `sudo systemctl start docker`

**Port 5433 already in use?**

- Edit `docker-compose.lite.yml` and change the port

**Database connection issues?**

- Check Docker is running: `docker ps`
- Check logs: `docker-compose -f docker-compose.lite.yml logs`

## Why Lite Mode?

Lite mode is perfect for:

- Local development without cloud services
- Testing crypto-only features
- Contributing to the project
- Running demos
- Self-hosting with full control (advanced users)

## 🔄 Migrating from Hosted to Self-Hosted

If you're currently using app.0.finance and want to self-host:

### Prerequisites

1. Technical knowledge of Safe wallets
2. Understanding of blockchain transactions
3. Ability to manage infrastructure

### Migration Steps

1. **Set up your instance:**

   ```bash
   pnpm lite
   ```

2. **Configure Privy** with YOUR credentials:

   - Create your own Privy app at https://dashboard.privy.io
   - Update `.env.lite` with your keys
   - Enable Smart Wallets for Base chain

3. **Transfer ownership:**

   - Go to your Safe on app.0.finance
   - Add your new self-hosted wallet as owner
   - Remove Zero Finance as owner (optional)

4. **Move funds:**

   - Use Safe UI to transfer
   - Or keep same Safe, new interface

5. **Insurance (optional):**
   - Email raghav@0.finance
   - Discuss self-hosted coverage options
