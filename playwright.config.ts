import { defineConfig } from '@playwright/test';

/**
 * PUBLIC_INTERFACE
 * This is the Playwright test runner configuration for the Kanban test suite.
 *
 * - Headless is always true for CI-friendly runs.
 * - Retries are enabled on CI to increase stability.
 * - Base URL is configurable via environment variables:
 *   REACT_APP_FRONTEND_URL (preferred) or BASE_URL; falls back to http://127.0.0.1:3000.
 * - Reporter is set from the npm script (--reporter=list), but can be changed here if needed.
 *
 * Environment variables used (must be provided by orchestrator via .env):
 * - REACT_APP_FRONTEND_URL: URL of the frontend under test (e.g., http://localhost:3000)
 * - BASE_URL: Optional alternative for base URL if REACT_APP_FRONTEND_URL is not set.
 */
const baseURL =
  process.env.REACT_APP_FRONTEND_URL ||
  process.env.BASE_URL ||
  'http://127.0.0.1:3000';

export default defineConfig({
  testDir: './tests',
  /* Fail the build if accidental test.only is committed */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt for a single worker on CI to improve stability; use default locally */
  workers: process.env.CI ? 1 : undefined,
  /* Keep timeouts reasonable for CI */
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  /* Use list reporter from the npm script; can be overridden on CLI. */
  reporter: [['list']],
  use: {
    baseURL,
    headless: true,
    actionTimeout: 0,
    /* Keep useful artifacts for debugging */
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
