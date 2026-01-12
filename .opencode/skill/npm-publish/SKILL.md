# npm-publish

## What I Do

Publish the 0 Finance CLI to npm with the correct 2FA requirements.

## Prerequisites

- npm account with publish rights to publish `agent-bank`
- A granular token that bypasses 2FA, stored in `.env.skill`
- Built CLI artifacts in `packages/cli/dist`

## Credentials

This skill reads credentials from `.env.skill` in the same directory.

Expected keys:

- `NPM_TOKEN` — npm granular token with publish access and 2FA bypass enabled
- `NPM_SCOPE` — optional npm scope (leave empty for unscoped)

## Workflow

1. Load `.env.skill` and export `NPM_TOKEN`
2. Run `npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN`
3. Run `npm whoami` to confirm auth
4. Build the CLI: `pnpm --filter agent-bank build`
5. Publish from `packages/cli`: `npm publish --access public --workspaces=false`
6. Verify publish: `npm view agent-bank version`

## Common Issues

- **403 with 2FA**: token lacks 2FA bypass — regenerate a granular token with bypass enabled
- **404 scope not found**: scope permissions missing — ensure the token has publish access
- **Interactive login**: avoid `npm login` in automation, use token instead

## Completion Criteria

- `npm view agent-bank version` returns the new version
- CLI install works with `bun add -g agent-bank`
