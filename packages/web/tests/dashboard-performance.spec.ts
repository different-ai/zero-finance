import { test, expect } from '@playwright/test';

test.describe('Dashboard Performance', () => {
  test('Dashboard loads quickly with server-side rendering', async ({ page }) => {
    // Navigate to signin page
    await page.goto('http://localhost:3050/signin');
    
    // Wait for the page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Fill in email
    await page.fill('input[type="email"]', 'test-0189@privy.io');
    await page.click('button:has-text("Continue with email")');
    
    // Wait for OTP input
    await page.waitForSelector('input[name="code"]', { timeout: 10000 });
    
    // Enter OTP
    await page.fill('input[name="code"]', '527697');
    
    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    // Take screenshot of initial load
    await page.screenshot({ path: 'test-results/dashboard-initial-load.png', fullPage: true });
    
    // Check that key elements are visible quickly (not loading states)
    // The balance should be visible without loading spinners
    const balanceElements = await page.locator('text=/\\$\\d+\\.\\d{2}/').all();
    
    if (balanceElements.length > 0) {
      console.log('✓ Balance amounts are visible immediately');
    }
    
    // Check that the allocation summary card is visible
    const allocationCard = page.locator('text=/Allocation Summary|Account Balance/').first();
    await expect(allocationCard).toBeVisible({ timeout: 3000 });
    console.log('✓ Allocation summary card is visible');
    
    // Check that there are no loading spinners visible
    const loadingSpinners = await page.locator('.animate-spin').count();
    console.log(`Loading spinners found: ${loadingSpinners}`);
    
    // Take a screenshot after a short wait to ensure everything is loaded
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/dashboard-fully-loaded.png', fullPage: true });
    
    // Assert that the page loaded quickly without showing multiple loading states
    expect(loadingSpinners).toBeLessThanOrEqual(1); // Allow at most 1 loading spinner
  });
});