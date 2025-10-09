# Workspace V2 Simplification - Welcome Screen Fix

## Problem

The welcome screen was calling `workspace.getOrCreateWorkspace` which:

1. Tries to set `user.primaryWorkspaceId` during context creation
2. Creates circular FK dependency issues
3. Causes error: `insert or update on table "users" violates foreign key constraint "users_primary_workspace_id_workspaces_id_fk"`

The error occurred because `ensureUserWorkspace()` was:

- Creating user with `primaryWorkspaceId` BEFORE creating the workspace
- Being called on every TRPC request during context creation
- Failing when workspace didn't exist yet

## Solution

Created `workspace.getOrCreateWorkspaceV2` that:

1. **Ignores `primaryWorkspaceId` completely** - doesn't read or write it
2. **Uses `workspace_members.isPrimary` instead** - the right place for this data
3. **Works in a single transaction** - all-or-nothing guarantees
4. **Bootstrap logic**: Creates workspace → creates membership with `isPrimary: true`

## Flow

1. Check if user has membership with `isPrimary=true` → return that
2. Check if user has any membership → mark it primary and return it
3. No membership at all → create workspace + membership (bootstrap) in one transaction

## Changes Made

- `src/server/routers/workspace-router.ts`: Added `getOrCreateWorkspaceV2` procedure
- `src/app/(onboarding)/welcome/page.tsx`: Changed from `getOrCreateWorkspace` to `getOrCreateWorkspaceV2`

## Key Differences from V1

| V1 (getOrCreateWorkspace)           | V2 (getOrCreateWorkspaceV2)             |
| ----------------------------------- | --------------------------------------- |
| Updates `user.primaryWorkspaceId`   | Never touches `user.primaryWorkspaceId` |
| Called during TRPC context creation | Only called when explicitly needed      |
| Multiple separate DB operations     | Single transaction                      |
| Creates user before workspace       | Creates workspace before membership     |
| Can fail with FK constraint errors  | Cannot fail with FK errors              |

## What's NOT Changed

- Still using `user.primaryWorkspaceId` everywhere else (74 references)
- `ensureUserWorkspace()` in context creation still has the bug
- Old `getOrCreateWorkspace` still exists and is used elsewhere

## Future Work (Optional)

Consider fully removing `primaryWorkspaceId` column and updating all 74 references to use `workspace_members.isPrimary` instead. This would:

- Eliminate circular dependencies
- Simplify the data model
- Make workspace relationships clearer
- Require significant refactoring across routers

## Testing

Should now be able to:

1. Load `/welcome` page without errors
2. Create a workspace by submitting the form
3. See workspace created with user as owner with `isPrimary=true`
