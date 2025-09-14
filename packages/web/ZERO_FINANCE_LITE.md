# Zero Finance Lite - Privy-Only Setup Guide

## Overview

Zero Finance Lite is a minimal version of Zero Finance that runs with **ONLY Privy** for authentication. No KYC, no bank transfers, no Align dependency. Perfect for development, demos, or running a crypto-only version.

## What Works vs What Doesn't

### ✅ **Available Features (No Align Required)**

- **Authentication** - Privy login/logout
- **Smart Wallets** - Create and manage Safe wallets
- **Invoicing** - Create, send, and manage crypto invoices
- **Company Management** - Create companies, invite team members
- **Contractors** - Invite and manage contractors
- **Crypto Payments** - Pay and receive in USDC/crypto
- **Dashboard** - View balances and transactions
- **Savings/Earn** - Deposit crypto to earn yield (if configured)
- **Document Upload** - Store invoice documents

### ❌ **Disabled Features (Require Align)**

- **KYC Verification** - Not needed in Lite mode
- **Virtual Bank Accounts** - No ACH/Wire capabilities
- **Fiat Transfers** - No USD bank transfers
- **Bank Account Linking** - No traditional banking
- **Regulated Money Movement** - Crypto only

## Quick Start

### 1. Minimal Environment Setup

Create a `.env.local` file with ONLY these variables:

```bash
# ===== REQUIRED (Absolute Minimum) =====
# Database
POSTGRES_URL=postgresql://user:password@localhost:5432/zero_finance_lite

# Privy Authentication (Get from https://dashboard.privy.io)
NEXT_PUBLIC_PRIVY_APP_ID=clxxxxxxxxxxxxxxxxx
PRIVY_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Wallet Creation (Use any private key for dev, production needs real one)
DEPLOYER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# ===== RECOMMENDED (For Better Experience) =====
# Base Network RPC (Without this, uses unreliable public RPC)
BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY

# USDC Contract Address on Base
NEXT_PUBLIC_USDC_ADDRESS_BASE=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

# ===== OPTIONAL (Nice to Have) =====
# OpenAI for invoice AI extraction
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx

# Analytics (PostHog)
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://us.posthog.com

# Email notifications
LOOPS_API_KEY=xxxxxxxxxxxxxxxxxxxxx

# Price data
COINGECKO_API_KEY=xxxxxxxxxxxxxxxxxxxxx
```

### 2. Database Setup

```bash
# Install dependencies
pnpm install

# Run migrations
pnpm db:migrate

# (Optional) Seed with sample data
pnpm db:seed
```

### 3. Start the Application

```bash
# Development mode
pnpm dev

# Production build
pnpm build
pnpm start
```

## Code Changes Required

### 1. Feature Detection

The app should detect if Align is configured and hide features accordingly:

```typescript
// src/lib/config.ts
export const config = {
  align: {
    enabled: !!(
      process.env.ALIGN_API_KEY &&
      process.env.ALIGN_SECRET &&
      process.env.ALIGN_CLIENT_ID
    ),
  },
  banking: {
    enabled: false, // Always false in Lite mode
  },
  kyc: {
    required: false, // Never required in Lite mode
  },
};
```

### 2. Conditional UI Rendering

Components should check if Align features are enabled:

```typescript
// Example: Dashboard component
import { config } from '@/lib/config';

export function Dashboard() {
  return (
    <>
      {/* Always show */}
      <WalletBalance />
      <InvoiceList />

      {/* Only show if Align is enabled */}
      {config.align.enabled && (
        <>
          <KYCStatus />
          <BankTransfers />
          <VirtualAccountInfo />
        </>
      )}
    </>
  );
}
```

### 3. Router Updates

Update TRPC routers to handle missing Align gracefully:

```typescript
// src/server/routers/align-router.ts
export const alignRouter = router({
  getCustomerStatus: protectedProcedure.query(async ({ ctx }) => {
    if (!config.align.enabled) {
      return {
        kycStatus: 'not_required',
        hasVirtualAccount: false,
        message: 'Banking features not available in Lite mode',
      };
    }
    // ... existing Align code
  }),

  // Other procedures return early if not enabled
  createVirtualAccount: protectedProcedure.mutation(async ({ ctx }) => {
    if (!config.align.enabled) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Banking features not available in Lite mode',
      });
    }
    // ... existing code
  }),
});
```

### 4. Onboarding Flow Changes

Skip KYC in the onboarding flow:

```typescript
// src/app/onboarding/constants.ts
import { config } from '@/lib/config';

export const steps = config.align.enabled
  ? [
      { name: 'Create Safe', path: '/onboarding/create-safe' },
      { name: 'Verify Identity', path: '/onboarding/kyc' },
      { name: 'Complete', path: '/onboarding/complete' },
    ]
  : [
      { name: 'Create Safe', path: '/onboarding/create-safe' },
      { name: 'Complete', path: '/onboarding/complete' },
    ];
```

### 5. Invoice Payment Methods

Limit payment methods to crypto only:

```typescript
// src/components/invoice/payment-methods.tsx
export const getAvailablePaymentMethods = () => {
  const methods = [{ value: 'crypto', label: 'Cryptocurrency', enabled: true }];

  if (config.align.enabled) {
    methods.push(
      { value: 'ach', label: 'ACH Transfer', enabled: true },
      { value: 'wire', label: 'Wire Transfer', enabled: true },
    );
  }

  return methods.filter((m) => m.enabled);
};
```

## Navigation Updates

Update the sidebar to hide banking features:

```typescript
// src/components/layout/sidebar.tsx
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Invoices', href: '/dashboard/invoices', icon: FileText },
  { name: 'Contractors', href: '/dashboard/contractors', icon: Users },
  { name: 'Savings', href: '/dashboard/earn', icon: TrendingUp },
  // Conditionally add banking items
  ...(config.align.enabled
    ? [
        { name: 'Transfers', href: '/dashboard/transfers', icon: ArrowUpDown },
        { name: 'Banking', href: '/dashboard/banking', icon: Building },
      ]
    : []),
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];
```

## Database Schema

No changes needed! The existing schema works fine. Align-related tables will simply remain empty:

- `align_customers` - Empty
- `align_virtual_accounts` - Empty
- `align_transfers` - Empty

## Error Handling

All Align-related API calls should fail gracefully:

```typescript
// Example error boundary
export function AlignFeature({ children }) {
  if (!config.align.enabled) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Banking features are not available in Lite mode.
          Upgrade to enable ACH/Wire transfers.
        </AlertDescription>
      </Alert>
    );
  }
  return children;
}
```

## Testing Lite Mode

```bash
# Run with minimal env to test Lite mode
POSTGRES_URL=postgresql://localhost:5432/test \
NEXT_PUBLIC_PRIVY_APP_ID=test_id \
PRIVY_APP_SECRET=test_secret \
DEPLOYER_PRIVATE_KEY=0x0000000000000000000000000000000000000000000000000000000000000001 \
pnpm dev
```

## Migration Path

### From Lite to Full Version

1. Add Align credentials to `.env.local`
2. Restart the application
3. Features automatically enable
4. Users can then complete KYC
5. Virtual accounts become available

### From Full to Lite

1. Remove Align credentials from `.env.local`
2. Restart the application
3. Banking features automatically hide
4. Existing data remains intact

## Deployment Options

### Vercel (Recommended for Lite)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy with minimal env
vercel --env POSTGRES_URL=xxx --env NEXT_PUBLIC_PRIVY_APP_ID=xxx
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build

# Only required env vars
ENV POSTGRES_URL=""
ENV NEXT_PUBLIC_PRIVY_APP_ID=""
ENV PRIVY_APP_SECRET=""
ENV DEPLOYER_PRIVATE_KEY=""

CMD ["pnpm", "start"]
```

## Frequently Asked Questions

### Q: Can I accept fiat payments in Lite mode?

**A:** No, Lite mode is crypto-only. Users can create invoices and receive USDC/crypto payments.

### Q: Do users need to do KYC?

**A:** No! KYC is completely skipped in Lite mode. Users can immediately start using the platform.

### Q: Can I upgrade from Lite to Full later?

**A:** Yes! Just add Align credentials and restart. All existing data is preserved.

### Q: What about the savings/earn feature?

**A:** It works! The earn module is separate from Align and works with crypto deposits.

### Q: Can contractors still submit invoices?

**A:** Yes! The contractor system works perfectly without Align.

### Q: What about invoice document uploads?

**A:** Works fine! Document storage doesn't depend on Align.

## Troubleshooting

### Common Issues

1. **"Cannot read property of undefined" errors**

   - Check if component is trying to access Align data
   - Wrap in config.align.enabled check

2. **Onboarding stuck on KYC**

   - KYC step should be removed in Lite mode
   - Check steps array in onboarding/constants.ts

3. **Payment method showing ACH/Wire**

   - Payment methods should be filtered
   - Check getAvailablePaymentMethods function

4. **Dashboard showing "Setup Required"**
   - Onboarding completion logic needs update
   - Should not check for KYC completion

## Support

For help setting up Zero Finance Lite:

1. Check this documentation
2. Review `.env.example` for all options
3. Open an issue on GitHub
4. Contact support

## License

Same as Zero Finance - see LICENSE file.

---

**Remember:** Zero Finance Lite is a fully functional invoicing and crypto payment platform. It's not a "demo" - it's a production-ready system for crypto-native businesses!
