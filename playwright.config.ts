import { defineConfig, devices } from '@playwright/test';

/**
 * PUBLIC_INTERFACE
 * Playwright configuration for the test suite.
 * - Uses HTML reporter
 * - Retries in CI
 * - Installs browsers via package scripts (see package.json)
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  reporter: [['html', { open: 'never' }]],
  retries: process.env.CI ? 2 : 0,
  use: {
    actionTimeout: 0,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: process.env.REACT_APP_FRONTEND_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ],
});
