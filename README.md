# Playwright Test Suite

This container provides a Playwright-based end-to-end test suite for the Kanban task management application.

## Quick start (non-interactive)

1. Install dependencies and browsers (non-interactive):
   - Automatically via postinstall:
     - `npm install`
   - Or explicitly:
     - `npm run pw:install`

   Notes:
   - We install Chromium only by default to minimize CI footprint:
     - `PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install --with-deps chromium`
     - If `--with-deps` is not permitted in your environment, the script falls back to `npx playwright install chromium`.

2. Run tests headlessly in CI-friendly mode:
   - `npm test`

   The test script runs:
   - `playwright test --config=playwright.config.ts --reporter=list`

3. Configure the target application URL:
   - Set `REACT_APP_FRONTEND_URL` in your environment or .env to the frontend you wish to test.
   - Default baseURL if not provided: `http://127.0.0.1:3000`.

## Environment variables

- REACT_APP_FRONTEND_URL: URL of the frontend (e.g., http://localhost:3000)
- BASE_URL: Optional alternative for base URL if REACT_APP_FRONTEND_URL is not set.

These variables are read by `playwright.config.ts`.

## CI behavior

- Headless: true
- Retries: 2 on CI, 0 locally
- Workers: 1 on CI for stability, default locally
- Reporter: list (via npm script)
- Artifacts (trace, video, screenshots) are retained on failure for debugging.

## Repository structure

- `package.json`: scripts and devDependencies (`playwright` and `@playwright/test`).
- `playwright.config.ts`: CI-friendly Playwright configuration.
- `tests/`: test specifications.
- `tsconfig.json`: TypeScript configuration for tests.
