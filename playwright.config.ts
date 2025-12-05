import { defineConfig, devices } from '@playwright/test';

/**
 * PUBLIC_INTERFACE
 * Playwright configuration for the Kanban test suite.
 *
 * - baseURL: Configurable via environment variables. Resolution order:
 *   1) E2E_BASE_URL
 *   2) REACT_APP_FRONTEND_URL
 *   3) http://localhost:3000 (default)
 *
 * - Reports: HTML (stored under playwright-report/)
 * - Tracing: Retained on failure, accessible via `npm run test:trace`
 * - Artifacts: test-results/ for traces/screenshots/videos
 */
const baseURL =
  process.env.E2E_BASE_URL ||
  process.env.REACT_APP_FRONTEND_URL ||
  'http://localhost:3000';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry', // record traces for flaky test retries
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000
  },

  // Configure projects for major browsers.
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'WebKit',
      use: { ...devices['Desktop Safari'] }
    }
  ],

  // Folder for test artifacts such as screenshots, videos, traces, etc.
  outputDir: 'test-results',

  // Optional: web server can be configured here if this container were to start the app.
  // We don't start/modify the frontend from here to respect container boundaries.
  // webServer: {
  //   command: 'npm --prefix ../kanban-task-manager-121675 run start',
  //   url: baseURL,
  //   reuseExistingServer: true,
  //   timeout: 120_000
  // }
});
