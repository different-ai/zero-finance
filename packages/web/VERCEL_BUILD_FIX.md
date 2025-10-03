# Vercel Build & Memory Optimization Guide

## Issues Fixed

### 1. Edge Runtime Crypto Module Error ✅

**Problem**: `@privy-io/server-auth` uses Node.js `crypto` module which isn't supported in Edge Runtime
**Solution**: Changed middleware to use Node.js runtime instead of Edge

```typescript
// packages/web/src/middleware.ts
export const config = {
  runtime: 'nodejs', // Force Node.js runtime
  matcher: [...]
}
```

### 2. Heap Out of Memory ✅

**Problem**: Build exceeding Node.js default memory limits (8GB Vercel limit)
**Solutions Applied**:

- **Next.js config optimizations** (`next.config.js`):

  ```javascript
  experimental: {
    webpackMemoryOptimizations: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  }
  ```

- **Build commands with increased memory**:

  ```json
  "build": "NODE_OPTIONS='--max-old-space-size=4096' pnpm next build"
  ```

- **Vercel.json configuration**:
  ```json
  {
    "buildCommand": "NODE_OPTIONS='--max-old-space-size=4096' pnpm build:vercel",
    "installCommand": "cd ../.. && pnpm install --filter=@zero-finance/web --frozen-lockfile --ignore-scripts --shamefully-hoist"
  }
  ```

### 3. Monorepo Configuration ✅

**Problem**: Conflicting vercel.json files (root vs packages/web)
**Solution**:

- ✅ Removed root `vercel.json`
- ✅ Keep only `packages/web/vercel.json` with proper monorepo settings

## Current Configuration

### Vercel Build Settings

- **Framework**: Next.js (auto-detected)
- **Root Directory**: `packages/web`
- **Build Command**: `NODE_OPTIONS='--max-old-space-size=4096' pnpm build:vercel`
- **Install Command**: `cd ../.. && pnpm install --filter=@zero-finance/web --frozen-lockfile --ignore-scripts --shamefully-hoist`
- **Memory Allocation**: 4GB for build, 8GB max on Pro tier
- **Function Timeout**: 60s for API routes

### Memory Limits by Tier

- **Hobby**: 3GB total (2.5GB allocated to build)
- **Pro**: 8GB total (7GB allocated to build)
- **Enterprise**: 12GB total (10GB allocated to build)

Current setting uses 4GB which works on all tiers.

## Vercel Dashboard Settings

Set these in your Vercel project settings:

1. **Root Directory**: `packages/web`
2. **Framework Preset**: Next.js
3. **Build Command**: Leave as default (uses vercel.json)
4. **Install Command**: Leave as default (uses vercel.json)
5. **Node Version**: 22.x (matches .nvmrc)

## Environment Variables Required

Ensure these are set in Vercel:

```bash
# Privy
NEXT_PUBLIC_PRIVY_APP_ID=
PRIVY_APP_SECRET=
PRIVY_WEBHOOK_SECRET=

# Database
DATABASE_URL=
DIRECT_URL=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Other required vars (check ENV_DEPENDENCIES_REPORT.md)
```

## Build Performance Tips

1. **Use Enhanced Builds (Pro/Enterprise)**:
   - 8 CPUs vs 4 CPUs
   - 16GB memory vs 8GB
   - 58GB disk vs 29GB
   - Enable in project settings

2. **Optimize Dependencies**:

   ```bash
   # Check bundle size
   pnpm --filter @zero-finance/web build -- --experimental-debug-memory-usage
   ```

3. **Split Large Dependencies**:
   - Already configured in `next.config.js` for `circomlibjs` and `ffjavascript`

4. **Monitor Build Diagnostics**:
   - Go to Deployment → Build Diagnostics tab
   - Check memory/CPU usage graphs

## Troubleshooting

### Build still fails with OOM

1. Upgrade to Pro tier for 8GB → 16GB enhanced builds
2. Increase memory: `NODE_OPTIONS='--max-old-space-size=6144'`
3. Check dependency size: `pnpm list --depth=0 --json | jq '.dependencies | length'`

### Typecheck fails but build succeeds

- This is expected when using `ignoreDuringBuilds: true`
- Run `pnpm typecheck` locally to catch issues
- Fix types before deploying

### Edge Runtime still causes issues

- Ensure middleware.ts has `export const config = { runtime: 'nodejs' }`
- API routes with Privy should NOT export `runtime = 'edge'`
- Check all API routes in `app/api/` for edge runtime exports

## Testing Locally

Before deploying:

```bash
# Clean install
pnpm install

# Test build with memory limit
NODE_OPTIONS='--max-old-space-size=4096' pnpm --filter @zero-finance/web build

# Run typecheck
pnpm --filter @zero-finance/web typecheck

# Test locally
pnpm --filter @zero-finance/web dev
```

## Resources

- [Vercel Memory Optimization Guide](https://vercel.com/guides/troubleshooting-sigkill-out-of-memory-errors)
- [Next.js Memory Usage Docs](https://nextjs.org/docs/app/guides/memory-usage)
- [Middleware Runtime Config](https://nextjs.org/docs/app/building-your-application/routing/middleware#runtime)
