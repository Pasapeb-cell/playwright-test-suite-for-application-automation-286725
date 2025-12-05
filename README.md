# Playwright Test Suite for Kanban Task Manager

This container hosts the Playwright-based end-to-end test suite for validating the Kanban task manager application UI and workflows.

## Prerequisites
- Node.js >= 18
- The frontend application running and accessible (default expected at `http://localhost:3000`), or a reachable URL.

## Installation
```bash
# From this container's folder
npm install
```
This triggers Playwright browser installation automatically via the `postinstall` script.

## Configuring baseURL
The test suite resolves the base URL in the following order:
1. `E2E_BASE_URL`
2. `REACT_APP_FRONTEND_URL`
3. `http://localhost:3000` (default)

Set one of these environment variables if your frontend runs on a different URL/port.

Examples:
```bash
# macOS/Linux
export E2E_BASE_URL="http://localhost:5173"
npm test
```
```powershell
# Windows PowerShell
$env:E2E_BASE_URL="http://localhost:5173"
npm test
```

## Available Scripts
- `npm test` — Run Playwright tests in headless mode.
- `npm run test:headed` — Run tests in headed mode (easier to observe interactions).
- `npm run test:ui` — Open Playwright UI mode for interactive debugging.
- `npm run test:report` — Open the HTML report from the last run.
- `npm run test:trace` — Open the Playwright trace viewer (expects trace zips under `test-results/`).

## Running Tests
Make sure the frontend is already running, then:
```bash
npm test
```
To run interactively:
```bash
npm run test:ui
```

## Test Structure
- `playwright.config.ts` — Central configuration including `baseURL`, reporters, tracing, and projects.
- `tests/` — All test specs (e.g., `example.spec.ts`).
- Artifacts:
  - `test-results/` — Traces, videos, screenshots.
  - `playwright-report/` — HTML report.

## Notes
- This container does not start or modify the frontend application. Configure the `baseURL` to point to your running frontend instance.
- For CI, ensure the frontend is available before running the test job, or configure a webServer hook as needed.

## Docker Usage
A Dockerfile is provided to run this test suite in a container with the correct working directory.

- Build:
  docker build -t kanban-playwright-tests .

- Run (headless tests by default):
  docker run --rm \
    -e E2E_BASE_URL="http://localhost:3000" \
    kanban-playwright-tests

- Override command (e.g., UI mode):
  docker run --rm -it \
    -e E2E_BASE_URL="http://localhost:3000" \
    kanban-playwright-tests sh -lc "npm run test:ui"

Important:
- The image sets the working directory to:
  /home/kavia/workspace/code-generation/playwright-test-suite-for-application-automation-286725
  Ensure any external tooling does not attempt to cd into a duplicated path segment (e.g., appending the folder name twice).
  In particular, do NOT cd into:
  /home/kavia/workspace/code-generation/playwright-test-suite-for-application-automation-286725/playwright-test-suite-for-application-automation-286725
  The correct project root is exactly:
  /home/kavia/workspace/code-generation/playwright-test-suite-for-application-automation-286725

Preview/CI metadata note:
- The workspace-level .project_manifest.yaml sets this container's container_root to '.' to avoid duplicated path concatenation by preview harnesses.
- If a separate preview system uses container.json, it points workingDirectory to the absolute path above and context to '.'.

CI Note:
- In CI pipelines, use the repository root of this container as the Docker build context:
    docker build -t kanban-playwright-tests .
  and run without cd inside the container; the WORKDIR is already set.
- You can also use the provided helper script:
    ./scripts/build_and_run.sh

## Running Without Docker (local environment)
If Docker is unavailable in your environment, you can run the tests locally:

- One-time dependency install (also triggers Playwright browsers install):
  npm install

- Run tests against the external URL directly:
  npm run test:external
  # or
  E2E_BASE_URL="https://kanban-board-3.kavia.app/" ./scripts/run_playwright_local.sh

This approach uses the same Playwright configuration and avoids any duplicated path issues during build.