# 0 Finance - AI Agent Guidelines

## What is 0 Finance?

0 Finance is a bank account that automates your finances:

- **Get Paid Easily** - Create invoices in seconds and get paid directly to your personal IBAN
- **Spend Anywhere** - Use a debit card worldwide with 0% conversion fees
- **Optimize Yield** - AI automatically allocates idle funds to highest-yielding opportunities

This is a Next.js application with smart contract automation for savings management.

## External Resources & Knowledge Bases

### Notion MCP - Product Context & Messaging

Use **Notion MCP tools** to access company documentation for:

- **Product copy, phrasing, and messaging** - Search workspace for approved language, tone, and voice guidelines
- **Value propositions and pitching** - Find product positioning documents, sales decks, and marketing materials
- **Feature specifications** - Retrieve detailed product requirements and user stories
- **Brand guidelines** - Access style guides, terminology, and communication standards

Primary tools: `notion_notion_search` for semantic search, `notion_notion_fetch` for specific page/database content.

### Design Language - Visual & UI Standards

**Always reference `packages/web/DESIGN-LANGUAGE.md`** for:

- **Typography scales** - Landing page vs dashboard font sizes, hierarchy, and weights
- **Color tokens** - Brand colors (`#1B29FF`), text colors, borders, backgrounds
- **Component patterns** - Buttons, forms, cards, layout templates with exact Tailwind classes
- **Spacing system** - Gap, padding, margin conventions (8px base unit)
- **Content guidelines** - Banking terminology, number formatting, voice & tone
- **Common mistakes** - Anti-patterns to avoid with correct examples

This document is the single source of truth for all UI implementation decisions.

### Exa MCP - Technical Context & Code

Use **Exa MCP tools** for technical implementation when:

- **New libraries or frameworks** - Not yet in the codebase or poorly understood by LLMs
- **Complex integrations** - Financial APIs, blockchain libraries, or emerging standards
- **Recent best practices** - Latest patterns, security considerations, or performance optimizations
- **Visual inspiration** - Design systems, UI patterns, and component examples

**Available Exa Tools** (use these instead of WebFetch for external research):

| Tool                                                      | Use Case                                                                      |
| --------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `exa_web_search_exa`                                      | General web search - find documentation, articles, tutorials                  |
| `exa_crawling_exa`                                        | Extract content from a specific URL (replaces WebFetch for scraping)          |
| `exa_get_code_context_exa`                                | **Cutting-edge API implementations** - SDK docs, library usage, code examples |
| `exa_company_research_exa`                                | Research companies, competitors, or partners                                  |
| `exa_linkedin_search_exa`                                 | Find professional profiles or company pages                                   |
| `exa_deep_researcher_start` + `exa_deep_researcher_check` | Complex multi-source research tasks                                           |

**When to use each tool**:

- **`exa_crawling_exa`** - When you have a specific URL to extract content from (e.g., Basescan contract page, GitHub README, documentation page). This replaces the built-in WebFetch tool.
- **`exa_web_search_exa`** - When searching for topics, finding documentation, or discovering relevant resources without a specific URL.
- **`exa_get_code_context_exa`** - **Critical for cutting-edge implementations**. Use for:
  - New SDK versions (e.g., "Safe SDK 5.0 executeTransaction")
  - Blockchain library patterns (e.g., "viem encodeFunctionData multicall")
  - DeFi protocol integrations (e.g., "Aerodrome SlipStream exactInputSingle")
  - Any API/library that was released recently or is rapidly evolving

**Workflow**: Check DESIGN-LANGUAGE.md first for UI/visual decisions, Notion for product/messaging context, then Exa for technical implementation details not well-covered in existing codebase or documentation.

### Basescan - On-chain Transaction Analysis

Use **Basescan** (basescan.org) to investigate on-chain activity when:

- **Transaction debugging** - Understanding what happened in a failed or unexpected transaction
- **Token flow tracing** - Following token transfers, swaps, and contract interactions
- **Contract verification** - Checking contract source code, ABIs, and deployment details
- **Balance verification** - Confirming actual on-chain balances vs UI display

**Key URLs**:

- Transaction: `https://basescan.org/tx/{txHash}`
- Address: `https://basescan.org/address/{address}`
- Token: `https://basescan.org/token/{tokenAddress}`

**Common Token Addresses on Base**:

- USDC: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- WETH: `0x4200000000000000000000000000000000000006`
- Super OETH: `0xDBFeFD2e8460a6Ee4955A68582F85708BAEA60A3`
- wsuperOETHb (wrapped): `0x7FcD174E80f264448ebeE8c88a7C4476AAF58Ea6`

**User Safe Address** (for debugging): `0x954A329e1e59101DF529CC54A54666A0b36Cae22`

When investigating transactions, use `exa_crawling_exa` to scrape Basescan pages and analyze transaction logs, internal transactions, and token transfers to understand the full picture.

## Wallet & Safe Architecture

**CRITICAL**: 0 Finance uses a 3-layer wallet hierarchy. Understanding this prevents common bugs.

```
Layer 1: Privy Embedded Wallet (EOA)
    ↓ owns
Layer 2: Privy Smart Wallet (Safe - used for gas sponsorship via ERC-4337)
    ↓ owns
Layer 3: Primary Safe (User's "Bank Account" - WHERE FUNDS RESIDE)
```

### Layer Details

| Layer | What It Is            | Purpose                               | Address Source                                        |
| ----- | --------------------- | ------------------------------------- | ----------------------------------------------------- |
| 1     | Privy Embedded Wallet | Signs transactions                    | `usePrivy()` → `user.wallet.address`                  |
| 2     | Privy Smart Wallet    | Gas sponsorship via bundler/paymaster | `useSmartWallets()` → `client.account.address`        |
| 3     | Primary Safe          | User's bank account with funds        | `getMultiChainPositions` or `settings.userSafes.list` |

### Common Pitfall: Safe Address Mismatch

**There are TWO query methods for Layer 3 Safes that may return DIFFERENT addresses:**

1. **User-scoped** (by Privy DID) - Use for balance/transaction operations:

   ```typescript
   const { data: positions } = trpc.earn.getMultiChainPositions.useQuery();
   const baseSafe = positions?.safes.find(
     (s) => s.chainId === SUPPORTED_CHAINS.BASE,
   );
   ```

2. **Workspace-scoped** (by workspace ID) - Use for workspace-level operations:
   ```typescript
   const { data: safes } = trpc.settings.userSafes.list.useQuery();
   ```

**Rule**: Always use `getMultiChainPositions` for balance queries and transaction execution to ensure consistency.

### Key Files for Safe Operations

| File                                                       | Purpose                                    |
| ---------------------------------------------------------- | ------------------------------------------ |
| `packages/web/src/hooks/use-safe-relay.ts`                 | Transaction relay hook                     |
| `packages/web/src/lib/sponsor-tx/core.ts`                  | Build & relay Safe transactions            |
| `packages/web/src/server/earn/multi-chain-safe-manager.ts` | Server-side Safe CRUD                      |
| `packages/web/src/db/schema/user-safes.ts`                 | Database schema with architecture docs     |
| `.claude/agents/safe-infrastructure.md`                    | **Full documentation for Safe operations** |

### Transaction Flow

```typescript
// 1. Build Safe transaction
const safeTx = await buildSafeTx([{ to, value, data }], {
  safeAddress,
  chainId,
  gas,
});

// 2. Relay via Privy Smart Wallet (Layer 2)
const txHash = await relaySafeTx(
  safeTx,
  smartWalletAddress,
  smartClient,
  safeAddress,
);
```

For detailed implementation patterns, see `.claude/agents/safe-infrastructure.md`.

# Repository Guidelines

## Project Structure & Module Organization

- pnpm workspace with `packages/web` (Next.js app: routes in `src/app`, shared helpers in `src/lib`, UI in `src/components`), `packages/cli` (operations CLI), and `packages/fluidkey-earn-module` (automation contracts and vendored deps).
- Root holds shared config (`tsconfig.json`, `turbo.json`, `.prettierrc`), environment docs, and automation scripts in `scripts/`; deployment files live in `deployments/`.
- Front-end tests stay in `packages/web/tests` with artefacts in `packages/web/test-artifacts`; match this layout when adding coverage.

## Build, Test, and Development Commands

- `pnpm install` targets Node ≥22.11; rerun after dependency or schema bumps.
- `pnpm dev` runs Turbo’s watchers plus Drizzle Studio; use `pnpm dev:lite` for the lite Docker stack described in `docker-compose.lite.yml`.
- `pnpm --filter @zero-finance/web build` generates a production bundle, while `build:lite` pulls `.env.lite` defaults for self-hosting flows.
- Guard rails: `pnpm lint`, `pnpm format`, `pnpm typecheck`. Auto-format with `pnpm format:fix` before sending code for review.

## Coding Style & Naming Conventions

- Prettier enforces two-space indentation, single quotes, and spaces over tabs; rely on the formatter.
- ESLint extends `next/core-web-vitals`; write TypeScript-first code, documenting any deliberate `any` usage.
- Use PascalCase for React components, camelCase for hooks/utilities, SCREAMING_SNAKE_CASE for env keys. Keep Tailwind classes ordered from layout → spacing → color for readability.

## Testing Guidelines

- Run Vitest via `pnpm --filter @zero-finance/web test` or `test:watch`; keep assertions deterministic and mock remote services in `src/test`.
- End-to-end coverage uses Playwright specs in `packages/web/tests`; execute `pnpm --filter @zero-finance/web exec playwright test --config playwright.config.ts` when verifying flows.
- Database or schema edits require matching Drizzle migrations (`pnpm --filter @zero-finance/web db:migrate:*`) so CI environments stay reproducible.

## Commit & Pull Request Guidelines

- Follow the existing history: short imperative commits (e.g., `Fix demo savings baseline`, `feat: add demo mode`) grouped by feature. Squash scaffolding before review.
- PRs should include a summary, linked issue, verification notes (commands run, UI screenshots when relevant), and any migration or flag toggles.
- Rebase on main instead of merge commits and confirm linting, tests, and type checks pass before requesting review.

## Security & Configuration Tips

- Keep secrets in `.env.local`, `.env.lite`, or `.env.test`; never commit them. Document new variables in `packages/web/ENV_DEPENDENCIES_REPORT.md`.
- Lite mode spawns local Postgres and Privy mocks; shut it down with `pnpm lite:stop` or reset volumes with `pnpm lite:clean`.
- Coordinate contract or vault changes with the on-chain owners and reflect updates in both `packages/fluidkey-earn-module` and the deployment manifests.

## Research Documentation Guidelines

- **All research documents** (integration analyses, upgrade guides, technical investigations, investor memos, fundraising materials, competitive analysis) should be placed in the `research/` directory at the project root.
- The `research/` directory is gitignored to keep the repository clean while preserving local documentation.
- Only keep essential documentation in the root: `README.md`, `CODE_OF_CONDUCT.md`, and this `AGENTS.md` file.
- When creating new research docs (e.g., `THIRDWEB_INTEGRATION_RESEARCH.md`, `NEXTJS_16_UPGRADE.md`), place them directly in `research/` or use subdirectories like `research/investor-memos/` for organized grouping.
- **Important for AI agents**: When researching topics, analyzing competitors, drafting investor materials, or creating any exploratory documents, ALWAYS place the output in the `research/` directory. Never create research files in the project root.
- This keeps the root directory focused on actionable project files while maintaining comprehensive research locally.
