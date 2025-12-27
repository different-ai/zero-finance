---
name: debug-prod-data
description: Debug production database issues by connecting to the correct Neon database and inspecting/fixing data
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: debugging
---

## What I Do

- Connect to the **production** Neon database (not dev)
- Inspect tables and data for debugging
- Run cleanup scripts and migrations
- Diagnose workspace/Safe mismatches

## Environment Setup

**CRITICAL**: Always load `.env.production.local` from the `packages/web` folder:

```typescript
import * as dotenv from 'dotenv';
import path from 'path';

// Load production env
dotenv.config({
  path: path.resolve(__dirname, '../.env.production.local'),
});
```

Or in a script:

```bash
cd /path/to/zerofinance/packages/web
pnpm tsx -e "
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.production.local' });

// Now use db...
import { db } from './src/db';
"
```

## Common Database Locations

Zero Finance uses **Neon Postgres**. There are typically two databases:

| Environment | Host Pattern                   | Used By                      |
| ----------- | ------------------------------ | ---------------------------- |
| Development | `ep-aged-cherry-*`             | Local dev, some scripts      |
| Production  | `ep-wispy-recipe-*` or similar | Vercel deployment, prod data |

**Always verify which database you're connecting to** by checking the console output:

```
[DB] Connecting to database host: ep-xxxxx-pooler.us-east-1.aws.neon.tech
```

## Key Tables for Debugging

| Table                | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| `user_safes`         | Safe addresses linked to users/workspaces      |
| `incoming_deposits`  | Incoming USDC transfers (synced from Safe API) |
| `outgoing_transfers` | Outgoing transactions from Safes               |
| `users`              | User records with `primaryWorkspaceId`         |
| `workspace_members`  | User-workspace membership                      |
| `earn_deposits`      | Vault deposit records                          |

## Common Issues

### 1. Safe Not Found for Workspace

**Symptom**: `Safe not found for the active workspace` error

**Debug steps**:

```typescript
// Check if Safe exists
const safe = await db.query.userSafes.findFirst({
  where: eq(userSafes.safeAddress, '0x...'),
});

// Check user's primary workspace
const user = await db.query.users.findFirst({
  where: eq(users.privyDid, safe.userDid),
});

// Verify they match
console.log('Safe workspace:', safe.workspaceId);
console.log('User primary workspace:', user.primaryWorkspaceId);
```

### 2. Vault Redemptions Showing as "Received"

**Symptom**: Transfers FROM vault addresses appear as incoming deposits

**Fix**: Filter by known vault addresses from `all-vault-addresses.ts`:

```typescript
import { ALL_VAULT_ADDRESSES } from './src/server/earn/all-vault-addresses';

// Check if address is a vault
const isVault = ALL_VAULT_ADDRESSES.has(fromAddress.toLowerCase());
```

### 3. Empty Transaction Tables

**Symptom**: `incomingDeposits` or `outgoingTransfers` tables are empty

**Cause**: The `syncSafeTransactions` mutation hasn't been called, or migrations weren't run.

**Fix**:

1. Check if migration `0120_flashy_devos.sql` was applied
2. Trigger a sync from the UI or call the mutation directly

## Running Migrations on Production

```bash
cd packages/web

# Load prod env and run migrations
POSTGRES_URL="$(grep POSTGRES_URL .env.production.local | cut -d'=' -f2 | tr -d '"')" \
  pnpm tsx scripts/migrate.ts
```

## Script Template

```typescript
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.production.local' });

import { db } from './src/db';
import { userSafes, incomingDeposits } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  // Your debugging code here
  const safes = await db.select().from(userSafes);
  console.log('Total safes:', safes.length);
}

main()
  .then(() => process.exit(0))
  .catch(console.error);
```

## When to Use This Skill

- Investigating production data issues
- Running one-off cleanup scripts
- Debugging workspace/Safe mismatches
- Checking if migrations were applied
- Syncing transaction data manually
