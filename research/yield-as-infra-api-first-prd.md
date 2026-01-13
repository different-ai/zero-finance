# PRD: Yield as Infrastructure (API-First, Self-Custody, MCP-First)

## 0) One-sentence Definition
0 Finance is a bank-as-an-API for self-custody yield: a developer gets a workspace API key, discovers curated vaults (insured/uninsured), receives precise deposit/withdraw instructions, and tracks positions without ever handing custody to 0 Finance.

## 1) Product Principles
- Bank is an API: all value lives behind stable REST + MCP tools.
- Self-custody by default: users sign and custody funds; we provide instructions and verification.
- Yield is a third-party integration: vaults are external protocols with strict adapters.
- Sandbox first: new workspaces can integrate in prod using test assets without contacting us.
- Parity across surfaces: API = MCP = CLI = UI.
- Admin policy only toggles insurance access, not custody.

## 2) Goals
- Make yield fully self-serve, no sales contact required.
- Provide a curated vault registry with insurance metadata.
- Provide self-custody deposit/withdraw instructions and verification.
- Enable sandbox testing with a test vault, fake USDC, and faucet.
- Revamp MCP server to reflect the API primitives cleanly.

## 3) Non-Goals (v1)
- Not a full DeFi marketplace.
- Not a custody solution or smart wallet offering.
- Not a claims system for insurance payouts.
- Not a multi-protocol adapter beyond ERC-4626 + Morpho vaults.

## 4) Personas
- Agent Builders: want API/CLI primitives to automate yield.
- API Integrators: need stable endpoints, webhooks, docs.
- Admins: approve insurance activation and monitor usage.

## 5) Conceptual Model
- Workspace: tenant with API key(s).
- Vault Registry: curated vault list with insurance status.
- Sandbox: special mode with fake assets + test vault.
- Insurance Status: workspace-level flag gating insured vaults.
- Position Indexer: reads on-chain positions by address.
- Instruction Builder: builds calldata + allowances for self-custody actions.

## 6) Vault Registry (Curated + Insured/Uninsured)
- Provide a public, filtered list of curated vaults.
- Each vault has: id, chain, asset, protocol, risk tier, curator, insured flag, coverage metadata.
- Insured vaults only actionable when workspace.insurance_status = active.
- Uninsured vaults actionable when workspace.insurance_status in {pending, active}.

### Required Fields
- id
- chain_id
- address
- asset_address
- asset_symbol
- asset_decimals
- protocol
- risk_tier
- curator
- insured
- insurance_provider
- insurance_coverage_usd
- status (active/inactive)
- sandbox_only (true for test vaults)

## 7) Self-Custody Deposit/Withdraw Model
Primary mode is self-custody: the user signs their own on-chain transaction.

### Deposit Flow (Self-Custody)
1. User calls `GET /vaults/{id}/quote?amount=...&direction=deposit`.
2. API returns expected shares, allowances, and minimums.
3. User calls `GET /vaults/{id}/instructions?amount=...&direction=deposit`.
4. API returns calldata + target + value + approval requirements.
5. User signs transaction with their wallet or safe.
6. API verifies on-chain event to update positions.

### Withdraw Flow (Self-Custody)
1. User calls `GET /vaults/{id}/quote?amount=...&direction=withdraw`.
2. API returns expected assets and share burn.
3. User calls `GET /vaults/{id}/instructions?amount=...&direction=withdraw`.
4. User signs transaction.
5. API verifies on-chain and updates positions.

### Managed Mode (Optional)
- `POST /actions/vault-deposit` or `/actions/vault-withdraw` creates a proposal.
- Proposal requires explicit approval via dashboard or admin API.
- Still self-custody in the sense that funds live in user-controlled safe.

## 8) Sandbox Design
Sandbox must work in production with no contact required.

### Sandbox Components
- Fake USDC (zUSDC) token, 6 decimals.
- Test Vault: ERC-4626 vault deployed by us using zUSDC.
- Faucet: unlimited minting with rate limits.

### Sandbox Access Rules
- New workspaces default to `insurance_status=sandbox`.
- Sandbox-only vaults visible and actionable.
- Production vaults visible but read-only.

### Faucet Rules
- Rate limits per workspace/day and per address/day.
- Requires a user-provided address.
- Returns tx hash for audit.

## 9) Insurance Activation
Insurance is an admin-controlled production flag.

### Workspace Fields
- insurance_status: sandbox | pending | active | suspended
- insurance_activated_at
- insurance_activated_by

### Rules
- sandbox: only sandbox vault actions
- pending: uninsured vault actions allowed
- active: insured + uninsured vault actions allowed
- suspended: read-only

## 10) API as First-Class Citizen
All core features have stable endpoints and versioning.

### Vaults
- GET /v1/vaults
- GET /v1/vaults/{vault_id}
- GET /v1/vaults/{vault_id}/quote
- GET /v1/vaults/{vault_id}/instructions

### Positions
- GET /v1/positions
- GET /v1/positions/{vault_id}

### Sandbox
- GET /v1/sandbox/status
- GET /v1/sandbox/vaults
- POST /v1/sandbox/faucet

### Actions (Managed)
- POST /v1/actions/vault-deposit
- POST /v1/actions/vault-withdraw

### Admin
- POST /v1/admin/workspaces/{id}/insurance-activate
- POST /v1/admin/workspaces/{id}/insurance-suspend

### Webhooks
- vault.position.updated
- vault.action.created
- vault.action.completed
- insurance.status.changed

## 11) MCP Server Revamp
The MCP server must mirror the API primitives.

### MCP Tool Surface
- vaults.list({ insured?, chainId?, sandbox? })
- vaults.get({ vaultId })
- vaults.quote({ vaultId, amount, direction })
- vaults.instructions({ vaultId, amount, direction })
- positions.list({})
- positions.get({ vaultId })
- actions.deposit({ vaultId, amount, mode })
- actions.withdraw({ vaultId, amount, mode })
- sandbox.status({})
- sandbox.faucet({ address, amount })
- workspace.status({})

### MCP Refactor
- Split `packages/web/src/app/api/mcp/route.ts` into domain modules.
- Add a registry to map tool names to handlers.
- Ensure consistent error shapes across MCP/API/CLI.

## 12) Checkpoint Map (End-to-End)
These are checkpoints that the app must traverse for full API-first yield.

1. API Key issuance
2. Workspace creation
3. Workspace sandbox status
4. KYC status check
5. Safe creation / address provisioning
6. Vault registry listing
7. Insurance gating
8. Vault quote calculation
9. Instruction generation
10. Allowance check
11. Self-custody signing
12. On-chain execution
13. Position indexing
14. APY snapshot retrieval
15. Webhook emission
16. Audit logging
17. Admin insurance activation

## 13) Error States and Recovery
- No vaults available → return curated default list + guidance.
- Insurance inactive → block insured actions with structured error.
- KYC incomplete → deny actions, allow read-only.
- Vault not supported → suggest closest supported vault.
- Chain mismatch → return expected chain and RPC hints.
- Faucet exhausted → return retry window.

## 14) Simplifications / Refactors
- Consolidate vault registry into a single source of truth.
- Introduce a Vault Adapter interface and isolate protocol-specific logic.
- Remove vault metadata scattered across multiple files.
- Standardize error payloads across API, MCP, and CLI.
- Move insurance gating into a central policy layer.

## 15) File Touchpoints (Current Code)
These are the likely files to refactor or extend.

- Vault registry: packages/web/src/server/earn/tracked-vaults-config.ts
- Vault analytics: packages/web/src/server/routers/vault-analytics-router.ts
- Earn API + actions: packages/web/src/server/routers/earn-router.ts
- MCP server: packages/web/src/app/api/mcp/route.ts
- CLI API gateway: packages/web/src/app/api/cli/[...slug]/route.ts
- Workspace schema: packages/web/src/db/schema/workspaces.ts
- Vault APY service: packages/web/src/server/earn/vault-apy-service.ts
- Multi-chain safes: packages/web/src/server/earn/multi-chain-safe-manager.ts

## 16) Data Model Additions
- workspaces.insurance_status (enum)
- workspaces.insurance_activated_at
- workspaces.insurance_activated_by
- sandbox_tokens
- sandbox_faucet_events
- vaults (registry)
- vault_assets
- vault_insurance

## 17) Metrics
- Sandbox conversions to active.
- Vault list fetch latency.
- Deposit instruction fetch latency.
- Position sync lag.
- Action success rate.

## 18) Open Questions
- Which chain hosts the sandbox vault (Base Sepolia vs dedicated sandbox chain)?
- Should sandbox be default or opt-in?
- How strict should insurance gating be (KYC + admin vs admin only)?
- Should we surface a “recommended vault” ranking?
