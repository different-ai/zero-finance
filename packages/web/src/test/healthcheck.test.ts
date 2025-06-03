import { test, expect } from 'vitest';
import { appRouter } from '@/server/routers/_app';

// Basic back-end test calling the healthcheck procedure

test('healthcheck returns yay', async () => {
  const { db } = await import('@/db'); // Import db instance
  const caller = appRouter.createCaller({ log: console, userId: null, db });
  const result = await caller.healthcheck();
  expect(result).toBe('yay!');
});
