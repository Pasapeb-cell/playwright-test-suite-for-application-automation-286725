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