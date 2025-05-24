import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3050',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  
  projects: [
    {
      name: 'chromium',
      use: { 
        channel: 'chrome',
        viewport: { width: 1280, height: 720 },
      },
    },
  ],

  webServer: process.env.CI ? undefined : {
    command: 'pnpm dev',
    url: 'http://localhost:3050',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
