# tRPC Migration Guide

This document outlines the implementation of tRPC in the Hypr web package and the steps to migrate the existing server actions to tRPC endpoints.

## What's Been Implemented

We've set up a complete tRPC infrastructure:

1. ✅ Core tRPC server setup
   - Context creation
   - Router setup with middleware for authentication
   - API endpoint handler for App Router

2. ✅ Type-safe client integration
   - tRPC client utilities
   - React provider for tRPC
   - Example implementation

3. ✅ Invoice creation endpoint
   - Migrated the existing `create-invoice.ts` server action to tRPC
   - Added proper input validation with Zod
   - Created client-side example for using the tRPC endpoint

## Setup Problems to Resolve

There are some issues that need to be addressed:

1. ⚠️ Version compatibility issues between libraries
   - Ensure all tRPC packages are using compatible versions
   - Resolve issues with React Query vs TanStack Query

2. ⚠️ Conflict between App Router and Pages Router
   - We should use only App Router for API routes
   - Remove any Pages Router tRPC implementations

## How to Use tRPC

### Server-Side

1. Define your router in `src/server/routers/your-router.ts`:

```typescript
import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../create-router';

export const yourRouter = router({
  // Query example
  getItems: publicProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ input }) => {
      // Your implementation
      return { items: [] };
    }),

  // Mutation example
  createItem: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Your implementation using ctx.user
      return { success: true };
    }),
});
```

2. Add your router to the app router in `src/server/routers/app-router.ts`:

```typescript
import { yourRouter } from './your-router';

export const appRouter = router({
  // Add your router
  yourFeature: yourRouter,
  // ...
});
```

### Client-Side

Use the tRPC client in your React components:

```typescript
'use client';

import { trpc } from '@/utils/trpc';

export function YourComponent() {
  // For queries
  const { data, isLoading } = trpc.yourFeature.getItems.useQuery({ limit: 10 });

  // For mutations
  const mutation = trpc.yourFeature.createItem.useMutation();
  
  const handleCreate = () => {
    mutation.mutate({ name: 'New Item' });
  };

  return (
    // Your component JSX
  );
}
```

## Migration Plan

To fully migrate from server actions to tRPC:

1. Identify all server actions that need migration
2. For each action:
   - Create a corresponding tRPC procedure
   - Move business logic to the tRPC implementation
   - Update client components to use tRPC instead of form actions
   - Add input validation with Zod

3. Test each endpoint thoroughly
4. Update documentation

## Benefits of tRPC

- Type safety across client and server
- Automatic input validation
- Better developer experience
- More structured API surface
- Easier to test
- Better error handling 