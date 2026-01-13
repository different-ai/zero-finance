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

The CLI binary is `finance` (aliases: `0`, `zero`).

## Quick start

```bash
# Authenticate
finance auth connect

# Or: finance auth login --api-key sk_live_xxx

# Check balance
finance balance

# Create and send an invoice
finance invoices create \
  --recipient-email client@example.com \
  --amount 1000 \
  --currency USD \
  --description "Consulting services"
finance invoices send --invoice-id inv_xxx
```

## Common commands

- `finance auth connect` — browser-based login
- `finance auth login` — store API key manually
- `finance balance` — check USDC balance
- `finance bank transfers propose` — propose a bank transfer
- `finance invoices create` — create an invoice
- `finance savings positions` — idle + earning balance breakdown

## Local development

Run the CLI without publishing:

```bash
bun install
bun --cwd packages/cli run dev -- auth connect --no-browser
```

To see the resolved base URL and request path:

```bash
finance --debug auth whoami
```

## Docs

- CLI reference: https://docs.0.finance/cli/reference
- Install guide: https://docs.0.finance/cli/installation
- MCP setup: https://docs.0.finance/mcp/overview

## Notes

Transfers and withdrawals create proposals that require dashboard approval.
