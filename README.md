# Playwright Test Suite for Kanban Application

This repository contains a Playwright-based end-to-end test suite for the Kanban task manager frontend.

## Prerequisites
- Node.js 18+ and npm
- The frontend application running and accessible (defaults to http://localhost:3000)

## Installation
```bash
npm i
```

## Running Tests
- Default (headless):  
```bash
npm test
```

- Headed mode (shows browser window):  
```bash
npm run test:headed
```

- Playwright UI mode:  
```bash
npm run test:ui
```

- Override target URL (if different from default):  
```bash
FRONTEND_URL=http://localhost:3000 npm test
```

- Open last HTML report:  
```bash
npm run test:report
```

- Open traces from failures (if any):  
```bash
npm run test:trace
```

## Notes
- Base URL is read from FRONTEND_URL; if not set, tests use `http://localhost:3000`.
- HTML reports are generated under `playwright-report/`.
- Traces, videos, and screenshots on failure are in `test-results/` and can be viewed using `npm run test:trace`.

## Build/CI Path Guidance
- Dockerfile uses `WORKDIR /app` and scripts run from `/app`. Do not add `cd` steps into nested paths.
- Build the image from the container root only:
  ```
  docker build -t kanban-e2e ./playwright-test-suite-for-application-automation-286725
  ```
- Avoid nested duplicate folder paths (e.g., repeating the same container folder name twice) which can cause build failures.
- For more details, see `BUILD_NOTES.md`.