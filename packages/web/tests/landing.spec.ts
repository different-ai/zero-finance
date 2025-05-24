import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

// Simple front-end test to ensure landing page renders
// Assumes the Next.js server is running on port 3050

test('landing page shows heading', async ({ page }: { page: Page }) => {
  await page.goto('/');
  await page.screenshot({ path: 'test-artifacts/landing.png' });
  await expect(
    page.getByRole('heading', { name: /banking for the remote world/i })
  ).toBeVisible();
});
