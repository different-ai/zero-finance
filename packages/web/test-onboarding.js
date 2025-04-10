// Script to test onboarding flow
const { chromium } = require('playwright');

async function testOnboardingFlow() {
  // Launch a browser instance
  const browser = await chromium.launch({ headless: false });
  
  // Create a new context and page
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Navigate to the dashboard
  await page.goto('http://localhost:3050/dashboard');
  console.log('Navigated to dashboard');
  
  // Wait a moment for potential redirects
  await page.waitForTimeout(3000);
  
  // Take a screenshot
  await page.screenshot({ path: 'dashboard-initial.png' });
  
  const url = page.url();
  console.log('Current URL:', url);
  
  // Check if redirected to sign in (expected if not logged in)
  if (url.includes('/sign-in')) {
    console.log('Redirected to sign in page as expected');
  }
  
  // Check for onboarding flow (should appear if user is logged in but hasn't completed onboarding)
  try {
    const onboardingFlow = await page.waitForSelector('.fixed.inset-0.z-50', { timeout: 5000 });
    if (onboardingFlow) {
      console.log('Onboarding flow detected');
      // Take screenshot of onboarding
      await page.screenshot({ path: 'onboarding-flow.png' });
    }
  } catch (e) {
    console.log('Onboarding flow not detected, might be completed already or user not logged in');
  }
  
  // Wait for user to manually interact and test
  console.log('Keep browser open for 60 seconds for manual testing...');
  await page.waitForTimeout(60000);
  
  // Close browser
  await browser.close();
}

// Run the test function
testOnboardingFlow().catch(console.error); 