/**
 * Node.js runner script to execute Playwright tests.
 * - Reads FRONTEND_URL from environment (falls back to http://localhost:3000)
 * - Logs target URL
 * - Spawns Playwright via @playwright/test programmatic API for cleaner exit codes
 * - Forwards CLI args (e.g., node run-tests.js tests/smoke.spec.ts --headed)
 */
const { runCLI } = require('@playwright/test/lib/cli');
const path = require('path');

(async () => {
  try {
    const targetUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    // Ensure env var is visible to Playwright config and tests
    process.env.FRONTEND_URL = targetUrl;

    // Log target to console for visibility in CI logs
    // eslint-disable-next-line no-console
    console.log(`[Playwright Runner] Using baseURL: ${targetUrl}`);

    // Forward all args after the script name
    const argv = process.argv.slice(2);

    // Ensure we run from repo root of this container
    const cwd = path.resolve(__dirname);

    // Execute Playwright CLI programmatically
    const status = await runCLI({
      config: path.join(cwd, 'playwright.config.js'),
      report: undefined
    }, [process.execPath, 'playwright', 'test', ...argv]);

    // runCLI returns a numeric status (0 success, 1+ failures)
    process.exitCode = typeof status === 'number' ? status : (status && status.status ? status.status : 1);
  } catch (err) {
    console.error('[Playwright Runner] Error while running tests:', err);
    process.exitCode = 1;
  }
})();
