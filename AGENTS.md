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
