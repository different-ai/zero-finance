# Workspace FK Constraint Fix - Deployment Guide

## Overview

This fix resolves a critical database schema inconsistency where:
- The `users.primary_workspace_id` column is `NOT NULL`
- But the FK constraint uses `ON DELETE SET NULL`
- This causes FK violations when creating users with non-existent workspaces

## What's Included

### 1. Code Fix ✅
**File:** `packages/web/src/server/utils/workspace.ts`

**Changes:**
- Added defensive validation to check if workspace exists before using it
- Automatically cleans up orphaned memberships when detected
- Creates new workspace if orphaned membership is found
- Adds warning logs for monitoring

### 2. Database Migration ✅
**File:** `packages/web/drizzle/0112_fix_workspace_fk_constraint.sql`

**Changes:**
- Updates FK constraint from `ON DELETE SET NULL` to `ON DELETE NO ACTION`
- Prevents workspaces from being deleted if users still reference them
- Maintains `DEFERRABLE INITIALLY DEFERRED` for transaction flexibility

### 3. Cleanup Script ✅
**File:** `scripts/cleanup-orphaned-memberships.ts`

**Purpose:**
- Identifies and removes orphaned workspace memberships
- Can run in dry-run mode (safe) or live mode
- Should be run before/after migration to ensure data integrity

## Deployment Steps

### Pre-Deployment Checks

1. **Verify Current State:**
   ```bash
   cd /Users/benjaminshafii/git/zerofinance
   npx tsx scripts/diagnose-workspace-fk-issue.ts
   npx tsx scripts/check-orphaned-memberships.ts
   ```

2. **Check for Orphaned Data:**
   ```bash
   npx tsx scripts/cleanup-orphaned-memberships.ts
   # This runs in dry-run mode by default
   ```

### Step 1: Deploy Code Fix (Immediate - No Database Changes)

**Priority:** 🔴 **CRITICAL - Deploy ASAP**

1. **Commit the Code Change:**
   ```bash
   git add packages/web/src/server/utils/workspace.ts
   git commit -m "fix: add defensive validation for workspace references in ensureUserWorkspace"
   ```

2. **Deploy to Production:**
   ```bash
   # Push to your deployment branch
   git push origin main
   
   # Or if using Vercel
   vercel --prod
   ```

3. **Verify Deployment:**
   - Monitor logs for `[ensureUserWorkspace] Orphaned workspace membership detected` warnings
   - Check error rates on `/api/trpc/workspace.getOrCreateWorkspaceV2`
   - Test user login flow

**Risk Level:** ✅ **LOW**
- No database changes
- Only adds validation logic
- Backward compatible
- Self-healing (cleans up orphaned data)

### Step 2: Run Cleanup Script (Optional - If Orphaned Data Exists)

**When to Run:** Only if Step 1 monitoring shows orphaned membership warnings

1. **Dry Run First (Safe):**
   ```bash
   npx tsx scripts/cleanup-orphaned-memberships.ts
   ```

2. **Review Output** - Check what will be deleted

3. **Run Live (if needed):**
   ```bash
   npx tsx scripts/cleanup-orphaned-memberships.ts --live
   ```

**Risk Level:** ⚠️ **MEDIUM**
- Deletes orphaned data
- Run in transaction (can rollback)
- Test in staging first if possible

### Step 3: Deploy Database Migration (Scheduled Maintenance)

**Priority:** 🟡 **IMPORTANT - Schedule maintenance window**

1. **Test in Staging First:**
   ```bash
   # On staging environment
   cd packages/web
   dotenv -e .env.staging -- pnpm db:migrate:prod
   
   # Verify constraint updated
   npx tsx ../../scripts/check-constraints.ts
   ```

2. **Schedule Production Deployment:**
   - **Recommended Time:** Low-traffic hours
   - **Estimated Duration:** < 1 minute
   - **Downtime Required:** No (migration runs while app is live)

3. **Run Migration on Production:**
   ```bash
   cd packages/web
   dotenv -e .env.prod.local -- pnpm db:migrate:prod
   ```

4. **Verify Migration:**
   ```bash
   npx tsx ../../scripts/check-constraints.ts
   
   # Expected output:
   # ON DELETE: NO ACTION
   # ON UPDATE: NO ACTION
   # DEFERRABLE: INITIALLY DEFERRED
   ```

**Risk Level:** ⚠️ **MEDIUM**
- Database schema change
- Cannot be rolled back easily
- Test in staging first
- Minimal impact (just changes FK behavior)

### Step 4: Post-Deployment Verification

1. **Check Constraint:**
   ```bash
   npx tsx scripts/check-constraints.ts
   ```
   
   Verify `users.primary_workspace_id` shows:
   - `ON DELETE: NO ACTION`
   - `ON UPDATE: NO ACTION`

2. **Test Workspace Deletion:**
   - Try deleting a workspace that has users
   - Should be prevented with FK constraint error
   - This is expected behavior

3. **Monitor Logs:**
   - Check for any new FK violations
   - Monitor error rates
   - Look for orphaned membership warnings (should be rare/zero)

4. **Run Final Diagnosis:**
   ```bash
   npx tsx scripts/diagnose-workspace-fk-issue.ts
   ```
   
   Should show: ✅ No foreign key constraint violations found!

## Rollback Plans

### If Code Fix Causes Issues

**Rollback:** Revert the git commit
```bash
git revert <commit-hash>
git push origin main
```

**Risk:** None - code is backward compatible

### If Migration Causes Issues

**Rollback Migration:**
```sql
-- Restore original constraint
ALTER TABLE "users" 
  DROP CONSTRAINT IF EXISTS "users_primary_workspace_id_workspaces_id_fk";

ALTER TABLE "users"
  ADD CONSTRAINT "users_primary_workspace_id_workspaces_id_fk"
  FOREIGN KEY ("primary_workspace_id") 
  REFERENCES "workspaces"("id") 
  ON DELETE SET NULL
  DEFERRABLE INITIALLY DEFERRED;
```

**Note:** This brings back the original inconsistency, but code fix will still prevent errors

## Monitoring Checklist

### Day 1 (After Code Deployment)
- [ ] No increase in error rates
- [ ] Check logs for orphaned membership warnings
- [ ] Verify user login flow works
- [ ] Monitor `/api/trpc/workspace.getOrCreateWorkspaceV2` endpoint

### Day 2-7 (After Migration)
- [ ] No FK constraint violations in logs
- [ ] Workspace creation/deletion works as expected
- [ ] No user login issues
- [ ] Run weekly diagnosis check

### Long-term
- [ ] Set up automated check for orphaned memberships (monthly)
- [ ] Add unit tests for workspace creation edge cases
- [ ] Consider adding database integrity checks to CI/CD

## Success Criteria

✅ **Code Fix Successful:**
- Users can log in without 500 errors
- Orphaned memberships are automatically cleaned up
- Warning logs show detection and cleanup

✅ **Migration Successful:**
- FK constraint shows `ON DELETE NO ACTION`
- No new FK violations in logs
- Workspace deletion properly blocked when users reference it

✅ **Overall Success:**
- Zero FK constraint violation errors
- No user login failures
- Data integrity maintained
- Monitoring shows stable system

## Support & Troubleshooting

### Common Issues

**Issue:** Migration fails with "constraint is being used"
- **Solution:** Run during low-traffic period, or use `CONCURRENTLY` if supported

**Issue:** Orphaned memberships keep appearing
- **Solution:** Investigate workspace deletion code paths, ensure proper cleanup

**Issue:** Users can't delete workspaces
- **Solution:** Expected behavior after migration - workspaces with active users can't be deleted

### Debug Commands

```bash
# Check current constraint
npx tsx scripts/check-constraints.ts

# Check for orphaned data
npx tsx scripts/check-orphaned-memberships.ts

# Full diagnosis
npx tsx scripts/diagnose-workspace-fk-issue.ts

# Check specific user
# Edit scripts to add user-specific queries
```

## Questions?

Contact: Development team  
Escalation: Database administrator  
Documentation: This file + `WORKSPACE_FK_ISSUE_FINAL_DIAGNOSIS.md`

---

**Last Updated:** October 8, 2025  
**Version:** 1.0  
**Status:** Ready for Deployment
