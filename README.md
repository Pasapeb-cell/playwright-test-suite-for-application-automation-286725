# Playwright Test Suite

This repository contains an automated end-to-end test suite using [Playwright](https://playwright.dev).

## Setup

1.  **Install dependencies:**
    ```bash
    npm install
    ```
    This will also install the required browser binaries via the `postinstall` script.

## Running Tests

### Local Execution

*   **Run all tests:**
    ```bash
    npm test
    ```

*   **Run specific tests (e.g., smoke tests):**
    ```bash
    npx playwright test --grep "@smoke"
    ```

*   **Show report:**
    ```bash
    npx playwright show-report
    ```

### CI Execution

In a CI environment, use the dedicated CI script which configures appropriate reporters:

```bash
npm run test:ci
```

To filter by tags in CI:

```bash
npx playwright test --grep "@smoke"
```

## Project Structure

*   `tests/`: Contains the test specification files.
*   `playwright.config.ts`: Main configuration file for Playwright.
*   `playwright-report/`: Generated HTML reports.
*   `test-results/`: Artifacts from test runs (screenshots, traces, XML results).
