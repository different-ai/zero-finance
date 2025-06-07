import { test, expect } from '@playwright/test';

test.describe('Auth Flow Improvements', () => {
  test('Landing page shows loading state before auth check', async ({ page }) => {
    // Navigate to landing page
    await page.goto('http://localhost:3050/');
    
    // Take immediate screenshot to see if loading state is visible
    await page.screenshot({ path: 'test-results/landing-initial-state.png', fullPage: false });
    
    // Wait for auth state to be ready (button should change from loading)
    await page.waitForSelector('button:not(:disabled)', { timeout: 5000 });
    
    // Take screenshot after auth state is determined
    await page.screenshot({ path: 'test-results/landing-after-auth-check.png', fullPage: false });
    
    // Check that we have either "join waitlist" or "go to dashboard" button, not "loading..."
    const buttonText = await page.locator('nav button').textContent();
    expect(buttonText).toMatch(/join waitlist|go to dashboard/);
    expect(buttonText).not.toBe('loading...');
  });

  test('Sign out redirects properly', async ({ page }) => {
    // First, navigate to signin page
    await page.goto('http://localhost:3050/signin');
    
    // Sign in
    await page.fill('input[type="email"]', 'test-0189@privy.io');
    await page.click('button:has-text("Continue with email")');
    await page.waitForSelector('input[name="code"]', { timeout: 10000 });
    await page.fill('input[name="code"]', '527697');
    
    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    // Take screenshot of dashboard
    await page.screenshot({ path: 'test-results/dashboard-signed-in.png', fullPage: false });
    
    // Click sign out button in sidebar
    await page.click('button:has-text("Sign Out")');
    
    // Wait for redirect to landing page
    await page.waitForURL('http://localhost:3050/', { timeout: 5000 });
    
    // Take screenshot after sign out
    await page.screenshot({ path: 'test-results/after-sign-out.png', fullPage: false });
    
    // Verify we're on the landing page and see "join waitlist" button
    await expect(page).toHaveURL('http://localhost:3050/');
    await expect(page.locator('button:has-text("join waitlist")')).toBeVisible({ timeout: 5000 });
  });
});