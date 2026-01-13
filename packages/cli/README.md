# agent-bank

0 Finance CLI for automated banking workflows.

## Install

```bash
curl -fsSL https://zerofinance.ai/install | bash
```

Or with Bun:

```bash
bun add -g agent-bank
```

The CLI binary is `zero` (alias: `zero-bank`).

## Quick start

```bash
# Authenticate
zero auth connect

# Or: zero auth login --api-key sk_live_xxx

# Check balance
zero balance

# Create and send an invoice
zero invoices create \
  --recipient-email client@example.com \
  --amount 1000 \
  --currency USD \
  --description "Consulting services"
zero invoices send --invoice-id inv_xxx
```

## Common commands

- `zero auth connect` — browser-based login
- `zero auth login` — store API key manually
- `zero balance` — spendable, earning, and idle balances
- `zero bank transfers propose` — propose a bank transfer
- `zero invoices create` — create an invoice
- `zero savings positions` — vault positions + balances

## Local development

Run the CLI without publishing:

```bash
bun install
bun --cwd packages/cli run dev -- auth connect --no-browser
```

To see the resolved base URL and request path:

```bash
zero --debug auth whoami
```

## Docs

- CLI reference: https://docs.0.finance/cli/reference
- Install guide: https://docs.0.finance/cli/installation
- MCP setup: https://docs.0.finance/mcp/overview

## Notes

Transfers and withdrawals create proposals that require dashboard approval.
