# publish-cli

## What I Do

Publish the 0 Finance CLI (`agent-bank`) to npm and keep the CLI version in sync.

## Prerequisites

- npm account with publish rights for `agent-bank`
- `packages/cli` builds successfully

## Workflow

1. Bump `packages/cli/package.json` version.
2. Update `packages/cli/src/index.ts` `.version()` to match.
3. Build: `pnpm --filter ./packages/cli build`.
4. Publish from `packages/cli`: `npm publish --tag latest`.
5. Verify: `npm view agent-bank version`.
6. Sanity check install: `bun add -g agent-bank@latest` then `finance --version`.

## Optional Script

- `packages/cli/package.json` includes `publish:cli` for step 3–4.

## Common Issues

- Version prints old number: `.version()` not updated in `src/index.ts`.
- npm rejects publish: bump package.json version.
- bun shows older version: clear cache or reinstall globally.

## Completion Criteria

- `npm view agent-bank version` shows the new version.
- `finance --version` matches the published version.
