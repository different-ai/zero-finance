# Vercel Memory Optimization Fixes

## Problem
Vercel build was failing with SIGKILL (Forced termination) error during `pnpm build:remote`, indicating memory exhaustion during the build process.

## Root Cause
The build process was running out of memory due to:
1. Database migrations running before build
2. Large dependencies (circomlibjs, ffjavascript) being loaded during webpack compilation
3. No memory limits configured for Node.js processes
4. No timeouts or fallbacks for failing operations

## Solutions Implemented

### 1. Next.js Configuration Optimizations (`next.config.js`)
- Added `webpackMemoryOptimizations: true` experimental flag
- Configured code splitting for large dependencies (circomlibjs, ffjavascript)
- Optimized webpack bundling for memory efficiency

### 2. Build Process Improvements
- Created `build:vercel` script with memory-optimized Node.js settings
- Added timeout mechanisms for migrations (90 seconds)
- Implemented fallback: if migrations fail, build continues
- Set Node.js memory limit to 4GB for builds, 2GB for migrations

### 3. Migration Script Optimizations (`scripts/migrate.ts`)
- Added connection cleanup after migrations
- Implemented timeout protection (2 minutes)
- Better error handling with cleanup on failure
- Memory-optimized database connection management

### 4. Vercel Build Optimizations
- Created `.vercelignore` to exclude unnecessary files
- Added fallback build script (`build:safe`) that continues even if migrations fail
- Created custom Vercel build script (`scripts/build-vercel.js`) with:
  - Memory limit configuration
  - Migration timeout handling
  - Error recovery mechanisms

## Recommended Vercel Configuration

In Vercel dashboard, use one of these build commands:
1. `pnpm build:vercel` (recommended - custom optimized script)
2. `pnpm build:safe` (fallback - continues if migrations fail)
3. Set environment variable: `NODE_OPTIONS=--max-old-space-size=4096`

## Files Modified
- `packages/web/next.config.js` - Webpack memory optimizations
- `packages/web/scripts/migrate.ts` - Migration timeout and cleanup
- `packages/web/scripts/build-vercel.js` - Custom Vercel build script
- `packages/web/.vercelignore` - Exclude unnecessary files
- `packages/web/package.json` - Added new build scripts

## Testing
The optimizations should resolve SIGKILL errors by:
1. Reducing memory pressure during compilation
2. Preventing builds from hanging on failed migrations  
3. Providing graceful fallbacks for deployment scenarios 