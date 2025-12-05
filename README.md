# Playwright Test Suite

This container runs Playwright-based end-to-end tests against the Kanban application (or any configured target URL).

## Prerequisites
- Node.js v18+ and npm

## Environment variables
The following variables may be used by tests/configs if needed:
- REACT_APP_API_BASE
- REACT_APP_BACKEND_URL
- REACT_APP_FRONTEND_URL
- REACT_APP_WS_URL
- REACT_APP_NODE_ENV
- REACT_APP_NEXT_TELEMETRY_DISABLED
- REACT_APP_ENABLE_SOURCE_MAPS
- REACT_APP_PORT
- REACT_APP_TRUST_PROXY
- REACT_APP_LOG_LEVEL
- REACT_APP_HEALTHCHECK_PATH
- REACT_APP_FEATURE_FLAGS
- REACT_APP_EXPERIMENTS_ENABLED
- REACT_APP_HOST

Set them in the container's .env file (handled by the orchestrator).

## Setup (non-interactive)
This project is configured to install Playwright browsers and OS deps non-interactively. The install is pinned to Playwright 1.57.0 and uses the local binary.

- First-time setup:
  - npm ci || npm install
  - (auto) playwright install --with-deps
    - This runs via postinstall/prepare hooks with: PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 CI=true

You can run this via:
- npm run init
or it will be invoked on install via:
- npm install (triggers postinstall hook)

We set PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 and CI=true to avoid prompts in CI environments. An .npmrc with yes=true is included to prevent interactive prompts if npm falls back to npx.

## Commands
- npm test                   -> run all tests (headless) using local binary (no npx)
- npm run test:headed        -> run in headed mode
- npm run test:report        -> open HTML report from last run
- npm run test:dryrun        -> list tests (quick verification)

## Notes
- All Playwright commands use the locally installed binary (node_modules/.bin/playwright), avoiding global/npx prompts.
- Browsers and OS dependencies are installed ahead of time to prevent interactive prompts during CI.