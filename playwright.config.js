/**
 * Playwright configuration for Kanban E2E tests.
 * Uses FRONTEND_URL environment variable as baseURL or defaults to http://localhost:3000
 * Generates HTML reports and collects trace/screenshot/video artifacts on failures.
 */
const { devices } = require('@playwright/test');

const baseURL = process.env.FRONTEND_URL || 'http://localhost:3000';

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  retries: 1,
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
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
  ]
};

module.exports = config;
