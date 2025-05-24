# Test Automation Setup

## Overview
Set up comprehensive automated testing with GitHub Actions for the hypr-v0 monorepo covering both backend and frontend tests.

## Current Test Status

### Web Package (`packages/web`)
- **Backend Tests**: ✅ Working (1 vitest test passing)
  - Test: `src/test/healthcheck.test.ts`
  - Uses vitest with tRPC healthcheck test
  - Requires PostgreSQL database connection
- **Frontend Tests**: ✅ Working (1 Playwright test passing)  
  - Test: `tests/landing.spec.ts`
  - Tests landing page heading visibility
  - Runs on port 3050

### Deep Yield Package (`packages/deep-yield`)
- **Tests**: Complex Playwright setup with authentication
  - Multiple test files: auth.test.ts, chat.test.ts, reasoning.test.ts, artifacts.test.ts
  - Requires setup tests for authentication
  - Runs on port 3060 (different from web package)
  - Has webServer config in playwright.config.ts

## GitHub Actions Workflow

Created `.github/workflows/test.yml` with 4 jobs:

1. **test-web-backend**: Runs vitest tests for web package
2. **test-web-frontend**: Runs Playwright tests for web package  
3. **test-deep-yield**: Runs Playwright tests for deep-yield package
4. **lint-and-typecheck**: Runs linting and TypeScript checks

### Key Features:
- PostgreSQL service container for database tests
- Playwright browser installation (chromium only for CI speed)
- Proper environment variables setup
- Artifact upload for failed test reports
- Separate port handling for different packages (3050 vs 3060)

## Dependencies Added:
- `wait-on: ^8.0.1` in root package.json for CI server readiness checks

## Configuration Improvements:
- Enhanced `packages/web/playwright.config.ts` with CI-specific settings
- Deep yield package already had comprehensive playwright config

## Test Commands:
- Web backend: `pnpm --filter web vitest run`
- Web frontend: `pnpm --filter web playwright test` 
- Deep yield: `pnpm --filter deep-yield test`
- All linting: `pnpm lint`
- All typecheck: `pnpm typecheck`

## Next Steps:
- Consider adding more comprehensive test coverage
- Monitor CI performance and adjust worker counts if needed
- Add integration tests between packages if needed 