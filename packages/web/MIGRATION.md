# Bank and Web Integration Migration Guide

This document outlines the process of merging the `packages/bank` application into `packages/web` to create a unified application.

## Overview

The goal is to consolidate two NextJS applications (`packages/bank` and `packages/web`) into a single codebase, while maintaining all functionality and ensuring a seamless user experience.

Key changes:
- Switched from Clerk to Privy for authentication
- Unified database schema and connection using node-postgres (pg)
- Integrated Bank UI components into Web
- Created a shared dashboard layout with a combined sidebar
- Migrated bank components to `/dashboard/bank` route

## Getting Started

### 1. Install Dependencies

Run the following command at the workspace root:

```bash
pnpm install
```

### 2. Environment Variables

Ensure these environment variables are set in `.env.local` of `packages/web`:

```
# Database connection
POSTGRES_URL="postgresql://username:password@host:port/database"

# Privy Authentication
NEXT_PUBLIC_PRIVY_APP_ID="your-privy-app-id"
PRIVY_APP_SECRET="your-privy-app-secret"

# Other required variables from bank app
...
```

## Migration Progress Tracker

- [x] Merge package.json dependencies
- [x] Update configuration files (tailwind, next.config.js, etc)
- [x] Unify database schema
- [x] Replace Clerk with Privy authentication
- [x] Create a unified dashboard layout
- [x] Set up `/dashboard/bank` route
- [ ] Migrate all components from bank:
  - [ ] actions
    - [ ] get-user-funding-sources
    - [ ] get-unmasked-source-identifier
    - [ ] other actions...
  - [ ] components
    - [ ] dashboard/*
    - [ ] layout/*
    - [ ] allocation-management
    - [ ] other components...
  - [ ] hooks
    - [ ] use-user-safes
    - [ ] other hooks...
  - [ ] lib utilities

## Migration Helper

We've created a script to assist with migrating components, hooks, and actions from the bank package:

```bash
# Migrate a component directory
pnpm migrate-from-bank component dashboard

# Migrate a hook
pnpm migrate-from-bank hook use-user-safes

# Migrate an action
pnpm migrate-from-bank action get-user-funding-sources
```

After using the script, you'll need to:
1. Update imports to match the new project structure
2. Resolve any missing dependencies
3. Fix TypeScript errors
4. Test the migrated component

## Manual Steps Required

1. Update all imports in migrated files to match the web package structure
2. Ensure all UI components use the correct theme
3. Test thoroughly with the Privy authentication flow
4. Verify all bank functionality works as expected

## Known Issues

- UI components might require additional Radix UI component setup
- Some styling differences may exist between the two applications
- DB migrations need to be handled carefully to avoid data loss 