# Environment Variable Dependencies Report

## Summary

This report analyzes all environment variable dependencies in the Zero Finance web application codebase to identify which are required vs optional and their impact on functionality.

## CRITICAL - App Won't Start Without These

### 1. **POSTGRES_URL** ⚠️ REQUIRED

- **Service**: PostgreSQL Database (Neon)
- **Usage**: Database connection for all application data
- **Error Handling**: Throws error on startup if missing (`src/db/index.ts:11`)
- **Impact**: App cannot start without database connection

### 2. **NEXT_PUBLIC_PRIVY_APP_ID** ⚠️ REQUIRED

- **Service**: Privy Authentication
- **Usage**: User authentication and wallet management
- **Error Handling**: Throws error in `src/lib/wagmi.ts:9` if missing
- **Impact**: Authentication system completely broken without this

### 3. **PRIVY_APP_SECRET** ⚠️ REQUIRED

- **Service**: Privy Authentication (Server-side)
- **Usage**: Server-side authentication verification
- **Error Handling**: Required for middleware and API routes
- **Impact**: Cannot verify user sessions server-side

## CORE FUNCTIONALITY - Features Break Without These

### 4. **BASE_RPC_URL / NEXT_PUBLIC_BASE_RPC_URL** ⚠️ HIGHLY RECOMMENDED

- **Service**: Base blockchain RPC endpoint
- **Fallback**: Falls back to public `https://mainnet.base.org` with warning
- **Usage**: All blockchain interactions (wallet creation, transactions, balance checks)
- **Impact**: Public RPC is unreliable and may cause transaction failures

### 5. **DEPLOYER_PRIVATE_KEY** ⚠️ REQUIRED for Safe Creation

- **Service**: Safe wallet deployment
- **Usage**: Deploying new Safe wallets for users
- **Error Handling**: Throws error in safe-deployment-service.ts if missing
- **Impact**: Cannot create new Safe wallets

### 6. **NEXT_PUBLIC_USDC_ADDRESS_BASE** ⚠️ REQUIRED for Swaps

- **Service**: Token swaps and transfers
- **Default**: Falls back to hardcoded USDC address
- **Error Handling**: Throws error in swap-service.ts if missing
- **Impact**: Swap functionality broken

## OPTIONAL - Features Degrade Gracefully

### 7. **ALIGN_API_KEY & ALIGN_API_BASE_URL** ✅ OPTIONAL

- **Service**: Align KYC/Compliance
- **Fallback**: Defaults to sandbox URL, warns if key missing
- **Impact**: KYC features disabled, but app still works

### 8. **OPENAI_API_KEY** ✅ OPTIONAL

- **Service**: AI features (invoice extraction, document analysis)
- **Error Handling**: Console error, AI features disabled
- **Impact**: AI-powered features unavailable

### 9. **LOOPS_API_KEY** ✅ OPTIONAL

- **Service**: Email notifications via Loops
- **Error Handling**: Console warning, skips email sending
- **Impact**: No email notifications sent

### 10. **NEXT_PUBLIC_POSTHOG_KEY & NEXT_PUBLIC_POSTHOG_HOST** ✅ OPTIONAL

- **Service**: Analytics tracking via PostHog
- **Fallback**: Defaults provided, tracking may fail silently
- **Impact**: No analytics data collected

### 11. **AUTO_EARN_MODULE_ADDRESS & RELAYER_PK** ✅ OPTIONAL

- **Service**: Auto-earn/savings features
- **Error Handling**: Console warnings, features disabled
- **Impact**: Savings/earn features unavailable

### 14. **CRON_SECRET** ✅ OPTIONAL (Required in Production)

- **Service**: Cron job authentication
- **Usage**: Protects scheduled tasks endpoints
- **Impact**: Cron jobs won't run in production

### 15. **ADMIN_SECRET_TOKEN** ✅ OPTIONAL

- **Service**: Admin panel access
- **Error Handling**: Console error, admin features disabled
- **Impact**: No admin panel access

### 16. **PRIVY_WEBHOOK_SECRET** ✅ OPTIONAL

- **Service**: Privy webhook verification
- **Impact**: Cannot verify webhook authenticity

### 17. **NEXT_PUBLIC_1INCH_API_KEY** ✅ OPTIONAL

- **Service**: 1inch DEX aggregator for swaps
- **Impact**: Swap functionality may be limited

### 18. **NEXT_PUBLIC_SWAP_SLIPPAGE** ✅ OPTIONAL

- **Service**: Swap slippage tolerance
- **Default**: 0.5%
- **Impact**: Uses default slippage

## Storage & Infrastructure

### 19. **R2\_\*** Variables ✅ OPTIONAL

- **Service**: Cloudflare R2 storage
- **Variables**: R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_ENDPOINT, R2_PUBLIC_URL
- **Impact**: File upload/storage features unavailable

### 20. **BLOB_READ_WRITE_TOKEN** ✅ OPTIONAL

- **Service**: Vercel Blob storage
- **Impact**: Alternative storage method unavailable

### 21. **NEON_API_KEY & NEON_PROJECT_ID** ✅ OPTIONAL

- **Service**: Neon database branching
- **Impact**: Database branching features unavailable

### 22. **SENTRY\_\*** Variables ✅ OPTIONAL

- **Service**: Error tracking via Sentry
- **Impact**: No error tracking in production

## Environment-Specific Variables

### 23. **NODE_ENV** ✅ OPTIONAL

- **Values**: development, production
- **Default**: development
- **Impact**: Affects various behaviors (security, logging, etc.)

### 24. **NEXTAUTH_URL** ✅ OPTIONAL

- **Service**: Next.js authentication
- **Default**: http://localhost:3050
- **Impact**: Used for OAuth callbacks

### 25. **VERCEL_OIDC_TOKEN** ✅ OPTIONAL

- **Service**: Vercel deployment authentication
- **Impact**: Vercel-specific features unavailable

## Recommendations

### Minimum Required for Basic Functionality:

```env
# Database (REQUIRED)
POSTGRES_URL=

# Authentication (REQUIRED)
NEXT_PUBLIC_PRIVY_APP_ID=
PRIVY_APP_SECRET=

# Blockchain (HIGHLY RECOMMENDED)
NEXT_PUBLIC_BASE_RPC_URL=
BASE_RPC_URL=

# Safe Deployment (REQUIRED for wallet creation)
DEPLOYER_PRIVATE_KEY=
```

### Recommended for Production:

```env
# Add to minimum:
CRON_SECRET=
PRIVY_WEBHOOK_SECRET=
ADMIN_SECRET_TOKEN=

# KYC/Compliance
ALIGN_API_KEY=
ALIGN_API_BASE_URL=

# Email notifications
LOOPS_API_KEY=

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Error tracking
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=
```

### Feature-Specific (Enable as Needed):

```env
# AI Features
OPENAI_API_KEY=

# Gmail Integration
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Savings/Earn Features
AUTO_EARN_MODULE_ADDRESS=
RELAYER_PK=

# Advanced Swaps
NEXT_PUBLIC_1INCH_API_KEY=

# File Storage
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
```

## Error Handling Patterns

### Hard Failures (Throw Errors):

- `POSTGRES_URL` - Database connection
- `DEPLOYER_PRIVATE_KEY` - When deploying safes
- `NEXT_PUBLIC_USDC_ADDRESS_BASE` - When performing swaps
- `NEXT_PUBLIC_PRIVY_APP_ID` - In wagmi configuration

### Soft Failures (Console Warnings):

- `ALIGN_API_KEY` - KYC features disabled
- `LOOPS_API_KEY` - Email sending skipped
- `OPENAI_API_KEY` - AI features disabled
- `AUTO_EARN_MODULE_ADDRESS` - Earn features disabled

### Silent Failures:

- PostHog analytics - Falls back to defaults
- Google OAuth - Feature simply unavailable
- Sentry - No error tracking

## Next Steps

1. **Create .env.example file** with all variables documented
2. **Implement better error messages** for missing required variables
3. **Add startup validation** to check all required variables at once
4. **Consider feature flags** to explicitly disable optional features
5. **Document minimum requirements** in README.md
