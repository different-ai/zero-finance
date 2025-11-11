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

Primary tools: `exa_get_code_context_exa` for programming context, `exa_web_search_exa` for general technical research.

**Workflow**: Check DESIGN-LANGUAGE.md first for UI/visual decisions, Notion for product/messaging context, then Exa for technical implementation details not well-covered in existing codebase or documentation.

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

- **All research documents** (integration analyses, upgrade guides, technical investigations) should be placed in the `research/` directory at the project root.
- The `research/` directory is gitignored to keep the repository clean while preserving local documentation.
- Only keep essential documentation in the root: `README.md`, `CODE_OF_CONDUCT.md`, and this `AGENTS.md` file.
- When creating new research docs (e.g., `THIRDWEB_INTEGRATION_RESEARCH.md`, `NEXTJS_16_UPGRADE.md`), place them directly in `research/` or move them there before committing.
- This keeps the root directory focused on actionable project files while maintaining comprehensive research locally.
