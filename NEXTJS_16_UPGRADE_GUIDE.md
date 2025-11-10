# Next.js 16 Upgrade Guide

## Status

✅ Configuration files updated
⏳ Pending: pnpm install and codemod

## What Was Changed

### 1. pnpm-workspace.yaml
```yaml
# Changed from:
next: ^15.3.5
eslint-config-next: ^15.3.3

# To:
next: ^16.0.1
eslint-config-next: ^16.0.1
```

### 2. packages/web/package.json
```json
// Removed --turbo flags (Turbopack is now default):
{
  "scripts": {
    "dev": "PORT=3050 dotenv -e .env.development.local.bak -- next dev",
    "dev:prod": "PORT=3050 dotenv -e .env.production.local -- next dev",
    "dev:lite": "dotenv -e .env.lite -- next dev"
  }
}
```

## Manual Steps Required

### Step 1: Install Dependencies
```bash
cd /Users/benjaminshafii/git/zerofinance
pnpm install
```

This will upgrade:
- next: 15.3.5 → 16.0.1
- eslint-config-next: 15.3.3 → 16.0.1

### Step 2: Run the Official Next.js 16 Codemod
```bash
cd packages/web
npx @next/codemod@canary upgrade latest
```

The codemod will automatically:
- ✅ Update `next.config.js` turbopack configuration (move from experimental)
- ✅ Migrate from `next lint` to ESLint CLI (if needed)
- ✅ Migrate deprecated middleware to proxy (if applicable)
- ✅ Remove `unstable_` prefixes from stabilized APIs
- ✅ Remove `experimental_ppr` Route Segment Config

### Step 3: Fix Breaking Changes

#### a) Async Request APIs (CRITICAL)
All of these APIs are now fully async with NO synchronous fallback:

**Before (Next.js 15 - still worked):**
```typescript
// ❌ This will break in Next.js 16
export default function Page({ params, searchParams }) {
  const slug = params.slug; // synchronous access
  const query = searchParams.q;
  // ...
}
```

**After (Next.js 16 - required):**
```typescript
// ✅ Must await params and searchParams
export default async function Page(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const slug = params.slug;
  const query = searchParams.q;
  // ...
}
```

**APIs that require await:**
- `cookies()` - Must await before calling `.get()`, `.set()`, etc.
- `headers()` - Must await before accessing headers
- `draftMode()` - Must await
- `params` - In layout.js, page.js, route.js, default.js, metadata files
- `searchParams` - In page.js

#### b) Image Metadata Functions
```typescript
// Before
export default function Image({ params, id }) {
  const slug = params.slug;
  const imageId = id; // string
  // ...
}

// After
export default async function Image({ params, id }) {
  const { slug } = await params;
  const imageId = await id; // now Promise
  // ...
}
```

#### c) Sitemap Functions
```typescript
// Before
export default async function sitemap({ id }) {
  const start = id * 50000; // id is number
  // ...
}

// After
export default async function sitemap({ id }) {
  const resolvedId = await id; // id is Promise
  const start = resolvedId * 50000;
  // ...
}
```

### Step 4: Update next.config.ts (if you have custom config)

If you have `experimental.turbopack` configuration:

```typescript
// Before (Next.js 15)
const nextConfig = {
  experimental: {
    turbopack: {
      // options
    },
  },
}

// After (Next.js 16)
const nextConfig = {
  turbopack: {
    // options - now at top level
  },
}
```

### Step 5: Check for Webpack Config Issues

If you have custom webpack configuration, the build will FAIL by default.

Options:
1. **Use Turbopack anyway**: `next build` (uses Turbopack, ignores webpack)
2. **Migrate to Turbopack**: Convert webpack config to turbopack options
3. **Keep Webpack**: Use `next build --webpack` flag

Update package.json if keeping webpack:
```json
{
  "scripts": {
    "build": "next build --webpack"
  }
}
```

### Step 6: Test the Build
```bash
cd packages/web
pnpm typecheck
pnpm build
```

## Known Issues to Watch For

### 1. Sass Imports from node_modules
```scss
// Before (worked in webpack)
@import '~bootstrap/dist/css/bootstrap.min.css';

// After (required for turbopack)
@import 'bootstrap/dist/css/bootstrap.min.css';
```

### 2. Resolve Alias Fallback (fs, path, etc.)
If you get errors like `Module not found: Can't resolve 'fs'`:

```typescript
// next.config.ts
const nextConfig = {
  turbopack: {
    resolveAlias: {
      fs: { browser: './empty.ts' },
    },
  },
}
```

But preferably, refactor code to not import Node.js modules on client side.

### 3. React 19.2 Features Available
Next.js 16 uses React 19.2, which includes:
- View Transitions
- `useEffectEvent`
- Activity component

Update React types if needed:
```bash
pnpm add -D @types/react@latest @types/react-dom@latest
```

## Migration Checklist

- [x] Update pnpm-workspace.yaml to Next.js 16
- [x] Remove --turbo flags from package.json scripts
- [ ] Run `pnpm install`
- [ ] Run Next.js 16 codemod
- [ ] Make all params/searchParams async with await
- [ ] Make cookies(), headers(), draftMode() async
- [ ] Update image metadata functions (opengraph, icon, etc.)
- [ ] Update sitemap function if using generateSitemaps
- [ ] Move experimental.turbopack to top-level turbopack
- [ ] Fix Sass imports (remove ~ prefix)
- [ ] Run typecheck
- [ ] Test build
- [ ] Test dev server
- [ ] Commit changes

## Files to Check

### High Priority (Likely Need Changes)
```
packages/web/src/app/**/page.tsx      - params, searchParams
packages/web/src/app/**/layout.tsx    - params
packages/web/src/app/**/route.ts      - params
packages/web/src/app/api/**/route.ts  - cookies(), headers()
packages/web/src/middleware.ts        - cookies(), headers()
```

### Medium Priority
```
packages/web/src/app/**/opengraph-image.tsx
packages/web/src/app/**/icon.tsx
packages/web/src/app/**/sitemap.ts
packages/web/next.config.ts
```

## Quick Command Reference

```bash
# Install dependencies
pnpm install

# Run codemod
cd packages/web && npx @next/codemod@canary upgrade latest

# Check for errors
pnpm typecheck

# Test build
pnpm --filter @zero-finance/web build

# If build fails with webpack config
pnpm --filter @zero-finance/web build --webpack

# Start dev server
pnpm dev
```

## After Successful Upgrade

1. Test all pages in development
2. Test build succeeds
3. Test production build locally with `pnpm build && pnpm start`
4. Commit changes with proper message
5. Create PR or merge to main

## Rollback Plan

If the upgrade causes issues:

```bash
# Revert pnpm-workspace.yaml
git checkout HEAD -- pnpm-workspace.yaml

# Revert package.json
git checkout HEAD -- packages/web/package.json

# Reinstall old versions
pnpm install

# Remove any codemod changes
git checkout HEAD -- packages/web/src
```

## Resources

- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- [Turbopack Documentation](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack)
- [Async Request APIs Guide](https://nextjs.org/docs/app/guides/upgrading/version-16#async-request-apis-breaking-change)
