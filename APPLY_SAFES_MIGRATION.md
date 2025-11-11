# Apply Safes Table Migration

## Error

```
relation "safes" does not exist
```

## Cause

The `safes` table migration exists (`0113_create_multi_chain_safes.sql`) but hasn't been applied to your database yet.

## Solution

Run the database migration to create the table:

### For Local Development

```bash
cd packages/web
pnpm db:migrate
```

### For Lite Docker Environment

```bash
cd packages/web
pnpm db:migrate:lite
```

### For Production

```bash
cd packages/web
pnpm db:migrate:prod
```

## What This Creates

The migration creates two tables:

### 1. `safes` table
```sql
CREATE TABLE IF NOT EXISTS "safes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "workspace_id" uuid NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
  "address" varchar(42) NOT NULL,
  "chain_id" integer NOT NULL,
  "owners" jsonb NOT NULL,
  "threshold" integer NOT NULL,
  "salt" varchar(66) NOT NULL,
  "is_primary" boolean DEFAULT false NOT NULL,
  "deployment_tx" varchar(66),
  "deployed_at" timestamp with time zone,
  "deployed_by" varchar(42),
  "synced_at" timestamp with time zone,
  "sync_status" text DEFAULT 'synced',
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
```

**Purpose:** Tracks Safe deployments across multiple chains (Base, Arbitrum, etc.)

### 2. `safe_owner_sync_operations` table
```sql
CREATE TABLE IF NOT EXISTS "safe_owner_sync_operations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "workspace_id" uuid NOT NULL REFERENCES "workspaces"("id") ON DELETE CASCADE,
  "operation_type" text NOT NULL,
  "owner_address" varchar(42),
  "threshold" integer,
  "base_tx_hash" varchar(66),
  "base_executed_at" timestamp with time zone,
  "chains_to_sync" jsonb NOT NULL,
  "sync_results" jsonb,
  "status" text DEFAULT 'pending' NOT NULL,
  "retry_count" integer DEFAULT 0 NOT NULL,
  "max_retries" integer DEFAULT 3 NOT NULL,
  "next_retry_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
```

**Purpose:** Tracks async owner synchronization across chains (for future use)

## Verification

After running the migration, verify the tables exist:

```bash
# Connect to your database
psql $DATABASE_URL

# Check tables
\dt safes
\dt safe_owner_sync_operations

# Should show:
#  Schema |          Name              | Type  |  Owner
# --------+----------------------------+-------+---------
#  public | safes                      | table | postgres
#  public | safe_owner_sync_operations | table | postgres

# Exit psql
\q
```

## Alternative: Check Migration Status

If you want to see which migrations have been applied:

```bash
# Using psql
psql $DATABASE_URL -c "SELECT * FROM drizzle.__drizzle_migrations ORDER BY created_at DESC LIMIT 5;"

# Using Drizzle Studio (GUI)
cd packages/web
pnpm db:studio
# Opens at http://localhost:4983
```

## Troubleshooting

### Migration Already Applied Error

If you get an error that the tables already exist:

```sql
-- Manually check if tables exist
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'safes'
);
```

If they exist, the migration is already applied and the error is something else.

### Connection Error

If you can't connect to the database:

```bash
# Check your .env.local file has DATABASE_URL
cat packages/web/.env.local | grep DATABASE_URL

# For lite mode, check docker is running
docker ps | grep postgres
```

### Permission Error

If you get permission errors:

```bash
# Make sure your database user has CREATE TABLE permissions
# Or run as superuser
```

## After Migration

Once the migration is applied:

1. **Restart your dev server** if it's running
   ```bash
   # Kill the dev server (Ctrl+C)
   # Restart it
   pnpm dev
   ```

2. **Test the auto-deploy feature**
   - Try depositing into Morpho Arbitrum vault
   - Should trigger automatic Safe deployment
   - Watch console for deployment logs

3. **Check the database**
   ```sql
   -- See if Safe was created
   SELECT * FROM safes ORDER BY created_at DESC LIMIT 1;
   ```

## What Happens During Auto-Deploy

When a user tries to deposit to Arbitrum for the first time:

1. System checks if Safe exists on Arbitrum
2. If not, calls `ensureSafeOnChain` mutation
3. Backend deploys Safe using multi-chain service
4. **Saves to `safes` table** ← This is where it needs the table!
5. Continues with deposit

Without the `safes` table, step 4 fails with "relation does not exist".
