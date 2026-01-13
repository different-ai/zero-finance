---
name: 0-finance-cli
description: Keep the 0 Finance CLI aligned with product capabilities.
compatibility: opencode
---

## Purpose

Keep the 0 Finance CLI agent-native: every user-facing capability in 0 Finance
should be mirrored in the CLI. If a feature is added to the product, add the
corresponding CLI command and update docs.

## When to Use

Use this skill whenever modifying the CLI in `packages/cli` (the agent-bank
package) or adding new commands, flags, or authentication flows.

## Workflow

1. Identify the product capability being exposed.
2. Add or update the matching CLI command in `packages/cli/src/index.ts`.
3. Update CLI docs in `packages/docs/cli/` (installation + reference).
4. Update product docs or landing pages if the CLI entrypoint changes.
5. Verify the CLI output examples match actual responses.

## Testing

Run commands from `packages/cli` using either Bun or pnpm:

- `bun --cwd packages/cli run dev -- <command args>`
- `pnpm --filter agent-bank exec tsx src/index.ts <command args>`

## Common Issues

- `pnpm --filter agent-bank dev -- ...` injects a literal `--` argument, which
  Commander treats as end-of-options; use `pnpm --filter agent-bank exec tsx
src/index.ts ...` instead.
- `pnpm exec` prints an extra `undefined` line on non-zero exits; this is a pnpm
  quirk. Use `finance` or Bun for cleaner stderr if needed.

## Documentation Requirements

- Update `packages/docs/cli/reference.mdx` when a command or option changes.
- Update `packages/docs/cli/installation.mdx` when auth or install steps change.
- Keep `packages/docs/index.mdx` quick start in sync with the CLI.

## Completion Criteria

- CLI functionality matches the product capability.
- Docs reflect the latest CLI behavior.
- If the CLI is user-facing, update the landing quick-start copy.
