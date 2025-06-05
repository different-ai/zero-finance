# Next.js Build Fixes Applied

## Issues Fixed

### 1. useSearchParams() Suspense Boundary Error
**File**: `/packages/web/src/app/(public)/oauth-debug/page.tsx`
**Error**: `useSearchParams() should be wrapped in a suspense boundary`
**Fix**: Wrapped the component using `useSearchParams()` in a Suspense boundary

### 2. Dynamic Server Usage Error
**File**: `/packages/web/src/app/(authenticated)/layout.tsx`
**Error**: `Route /dashboard/transfer couldn't be rendered statically because it used cookies`
**Fix**: Added `export const dynamic = 'force-dynamic'` to the authenticated layout since it uses cookies for authentication

### 3. Critical Dependency Warning
**File**: `/packages/web/next.config.js`
**Error**: `Critical dependency: the request of a dependency is an expression` from web-worker module
**Fix**: Added webpack ContextReplacementPlugin to suppress the critical dependency warning

## Summary of Changes

1. **OAuth Debug Page**: Refactored to use a separate component wrapped in Suspense for search params access
2. **Authenticated Layout**: Forced dynamic rendering to properly handle authentication cookies
3. **Next.js Config**: Modified webpack configuration to suppress web-worker critical dependency warnings

All build errors have been resolved and the application builds successfully.