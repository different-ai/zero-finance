---
name: debug prod issues
description: Debug production issues on Vercel using logs, database inspection, and proper deployment waiting
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: debugging
---

## What I Do

- Debug production issues on Vercel
- View and filter Vercel function logs
- Wait for deployments correctly
- Connect to production Neon database
- Inspect tables and data for debugging

## Vercel Debugging (0 Finance)

**IMPORTANT**: Always use `--scope prologe` for the 0 Finance project:

```bash
# All Vercel commands need --scope prologe
vercel logs www.0.finance --scope prologe
vercel ls --scope prologe
vercel env ls --scope prologe
```

### Viewing Logs

```bash
# Stream live logs (waits for new logs)
vercel logs www.0.finance --scope prologe

# Logs since a specific time
vercel logs www.0.finance --scope prologe --since 5m
vercel logs www.0.finance --scope prologe --since 1h

# Filter logs (pipe to grep)
vercel logs www.0.finance --scope prologe 2>&1 | grep -i "error"
vercel logs www.0.finance --scope prologe 2>&1 | grep "ai-email"
```

**Note**: `vercel logs` can be slow/hang. Use `timeout` or Ctrl+C if needed:

```bash
timeout 30 vercel logs www.0.finance --scope prologe --since 5m 2>&1 | head -100
```

### Checking Deployments

```bash
# List recent deployments
vercel ls --scope prologe | head -10

# Check specific deployment status
vercel inspect <deployment-url> --scope prologe

# Get latest deployment URL
vercel ls --scope prologe 2>/dev/null | head -1
```

### Waiting for Deployments

**DO NOT** just `sleep` and hope. Use `vercel inspect --wait`:

```bash
# Get the latest deployment URL
LATEST=$(vercel ls --scope prologe 2>/dev/null | head -1)

# Wait for it to be ready (up to 5 minutes)
vercel inspect "$LATEST" --scope prologe --wait --timeout 5m

# Check the status in the output:
#   status: ● Building  -> still building
#   status: ● Ready     -> deployed and live!
#   status: ● Error     -> build failed
```

**Full workflow after pushing code:**

```bash
# 1. Push your changes
git push origin main

# 2. Wait a few seconds for Vercel to pick it up
sleep 5

# 3. Get the new deployment URL
LATEST=$(vercel ls --scope prologe 2>/dev/null | head -1)
echo "Waiting for: $LATEST"

# 4. Wait for it to complete
vercel inspect "$LATEST" --scope prologe --wait --timeout 5m

# 5. Now your changes are live!
```

**Check deployment details:**

```bash
# See build info, aliases, and status
vercel inspect <deployment-url> --scope prologe

# See build logs if something failed
vercel inspect <deployment-url> --scope prologe --logs
```

### Triggering a Redeploy

```bash
# Redeploy production from current state
vercel --prod --scope prologe

# Or push to git and wait
git push origin main
# Then use the waiting method above
```

### Environment Variables

```bash
# List env vars
vercel env ls --scope prologe

# Add an env var (will prompt for value)
echo "value" | vercel env add VAR_NAME production --scope prologe

# Pull env vars to local .env
vercel env pull .env.local --scope prologe
```

## Database Debugging

### Environment Setup

**CRITICAL**: Always load `.env.production.local` for production database:

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

### Database Locations

Zero Finance uses **Neon Postgres**:

| Environment | Host Pattern                   | Used By                      |
| ----------- | ------------------------------ | ---------------------------- |
| Development | `ep-aged-cherry-*`             | Local dev, some scripts      |
| Production  | `ep-wispy-recipe-*` or similar | Vercel deployment, prod data |

**Always verify which database you're connecting to**:

```
[DB] Connecting to database host: ep-xxxxx-pooler.us-east-1.aws.neon.tech
```

### Key Tables

| Table                | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| `user_safes`         | Safe addresses linked to users/workspaces      |
| `incoming_deposits`  | Incoming USDC transfers (synced from Safe API) |
| `outgoing_transfers` | Outgoing transactions from Safes               |
| `users`              | User records with `primaryWorkspaceId`         |
| `workspace_members`  | User-workspace membership                      |
| `earn_deposits`      | Vault deposit records                          |
| `ai_email_sessions`  | AI email agent conversation sessions           |

### Script Template

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

## Common Issues

### 1. "Internal server error" from API endpoint

**Debug steps**:

1. Check Vercel logs for the specific endpoint
2. Look for stack traces or error messages
3. Test with curl to see response:
   ```bash
   curl -s -X POST "https://www.0.finance/api/endpoint" \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```

### 2. Code changes not taking effect

**Causes**:

- Deployment not complete yet
- Environment variables not updated (need redeploy)
- Caching issues

**Fix**:

1. Verify new deployment exists: `vercel ls --scope prologe | head -3`
2. Check deployment time matches your push
3. Force redeploy if needed: `vercel --prod --scope prologe`

### 3. Safe Not Found for Workspace

**Debug**:

```typescript
const safe = await db.query.userSafes.findFirst({
  where: eq(userSafes.safeAddress, '0x...'),
});
const user = await db.query.users.findFirst({
  where: eq(users.privyDid, safe.userDid),
});
console.log('Safe workspace:', safe.workspaceId);
console.log('User primary workspace:', user.primaryWorkspaceId);
```

### 4. Environment variable not working

```bash
# Check it's set in Vercel
vercel env ls --scope prologe | grep VAR_NAME

# Check which environments it's set for (production, preview, development)
# May need to redeploy for changes to take effect
```

## When to Use This Skill

- Investigating production API errors
- Checking if deployments completed
- Viewing function logs
- Debugging database/data issues
- Verifying environment variables
- Running one-off database scripts
