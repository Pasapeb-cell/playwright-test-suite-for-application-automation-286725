# Playwright Test Suite for Kanban Application

This project contains automated end-to-end tests for the Kanban application using Playwright.

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Ensure the Kanban application is running at `http://localhost:3000`.

## Running Tests

Tests are configured to run in **serial mode** because the CSV test cases represent a sequential flow (Create -> Move -> Verify).

### Headless Mode (Default)
```bash
npm test
```

### Headed Mode
```bash
npm run test:headed
```

## Configuration

-   **Base URL**: Set `PLAYWRIGHT_BASE_URL` environment variable. Default: `http://localhost:3000`.
-   **Headless**: Set `HEADLESS=false` for headed execution.
-   **CSV Path**: Set `CSV_PATH` to use a custom CSV file. Default: `test_cases.csv`.

## Test Data

The `test_cases.csv` defines the scenario steps. Ensure the steps are logically ordered (e.g., Create a task before moving it).

**Note:** Since the application persists data (via backend), running tests repeatedly may accumulate data unless manually cleaned up.
