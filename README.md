# Playwright Test Suite for Kanban Application

This repository contains end-to-end tests for the Kanban task management application using Playwright.

## Configuration

The test suite is configured to run on three browsers:
- **Chromium** (Chrome/Edge)
- **Firefox**
- **WebKit** (Safari)

### Base URL
Tests now target `http://localhost:3000` by default. This can be overridden using the `BASE_URL` environment variable.

**Important:** All tests have been updated to navigate to `/` (root route) instead of `/product`.

## Test Structure

Tests are organized by feature area under `tests/kanban/`:
- `BoardLayout/` - Board initialization and layout tests
- `Columns/` - Column management (add, rename, delete)
- `Tasks/` - Task CRUD operations
- `DragAndDrop/` - Drag and drop functionality
- `SearchFilter/` - Filtering and search features
- `Performance/` - Performance and load tests
- `System/` - System-level operations (clear board, etc.)
- `UI_UX/` - UI/UX edge cases and responsiveness

## Smoke Tests

A subset of critical tests have been tagged with `@smoke` for quick validation:
- **TC-01**: Verify default board load
- **TC-06**: Create a new task
- **TC-20**: Clear Board / Reset

### Running Smoke Tests

```bash
# Run smoke tests on all browsers
npm run test:smoke

# Run smoke tests on specific browser
npm run test:smoke:chromium
npm run test:smoke:firefox
npm run test:smoke:webkit
```

## Running Tests

```bash
# Install dependencies and browsers
npm install

# Run all tests
npm test

# Run tests in CI mode
npm run test:ci

# List all tests without running
npm run test:dryrun

# Run tests with grep pattern
npx playwright test --grep @Tasks

# Run tests on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Environment Variables

- `BASE_URL` - Override the base URL (default: `http://localhost:3000`)
- `CI` - Enable CI mode (retries, headless, etc.)
- `SMOKE` - Set to `true` to run only smoke tests

## Test Tags

Tests are tagged for easy filtering:
- `@smoke` - Critical smoke tests for quick validation
- `@BoardLayout` - Board layout tests
- `@Columns` - Column management tests
- `@Tasks` - Task management tests
- `@DragAndDrop` - Drag and drop tests
- `@SearchFilter` - Search and filter tests
- `@Performance` - Performance tests
- `@System` - System-level tests
- `@UI_UX` - UI/UX tests

## Reports

Test results are available in multiple formats:
- **HTML Report**: `playwright-report/index.html`
- **JUnit XML**: `test-results/results.xml`
- **Console Output**: Real-time during test execution

## Browser Configuration

All browsers are configured to run in headless mode with appropriate flags for containerized environments:
- Chromium: `--no-sandbox`, `--disable-setuid-sandbox`, `--disable-gpu`
- Firefox: `-headless`
- WebKit: `--headless`

## Cross-Browser Testing

The suite runs tests across all three browser engines to ensure compatibility:
```bash
# Run all tests on all browsers (default)
npm test

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Debugging

```bash
# Run tests in headed mode (UI visible)
npx playwright test --headed

# Run with Playwright Inspector
npx playwright test --debug

# View trace for failed tests
npx playwright show-trace test-results/<test-name>/trace.zip
```

## Best Practices

1. **Resilient Selectors**: Tests use accessible selectors (roles, labels, ARIA attributes) where possible
2. **No Hardcoded URLs**: All navigation uses relative paths from baseURL
3. **Test Isolation**: Each test can run independently
4. **Cross-Browser**: Tests validated on Chromium, Firefox, and WebKit
5. **Smoke Subset**: Critical paths tagged for rapid validation

## Notes

- The application must be running on port 3000 before tests execute
- Tests use localStorage for state management (some tests may affect each other if run in sequence)
- Drag-and-drop tests may have different behavior across browsers
- Mobile responsiveness tests resize the viewport to 375x667
