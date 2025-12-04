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
   - Set `REACT_APP_FRONTEND_URL` in your environment or `.env` to the frontend you wish to test.
   - Default baseURL if not provided: `http://127.0.0.1:3000`.

### Running against a local or preview URL

- Local dev server example:
  - `export REACT_APP_FRONTEND_URL=http://localhost:3000`
  - `npm test`

- Preview/staging example:
  - `export REACT_APP_FRONTEND_URL=https://your-preview.example.com`
  - `npm test`

The baseURL is read from:
- `process.env.REACT_APP_FRONTEND_URL` (preferred)
- `process.env.BASE_URL` (optional fallback)
- Defaults to `http://127.0.0.1:3000` if neither is set.

## Test organization

Specs are grouped by feature:

- `tests/board.spec.ts`: verifies initial board render, columns presence (To Do, In Progress, Done), and status counts.
- `tests/task-create.spec.ts`: creates a task using the column-scoped "+ Add Card" form and asserts it appears in the correct column.
- `tests/task-move.spec.ts`: drags a task card from "To Do" to "In Progress" using Playwright drag-and-drop and asserts the new column.
- `tests/task-edit.spec.ts`: opens a card modal, edits title/description/status, saves, and verifies the changes.
- `tests/task-delete.spec.ts`: deletes a task via confirmation modal and asserts removal and toast message.
- `tests/filter.spec.ts`: applies a Status filter and verifies visible cards update, then clears the filter.
- `tests/responsive.spec.ts`: tests a smaller viewport to ensure columns/cards are still usable.

Shared helpers live in `tests/utils.ts`: navigation, stable locators (roles/labels/classes), dnd helpers, and polling assertions.

## Locator strategy

Selectors are chosen from the actual frontend codebase:
- Columns: `role=list` (Kanban board), `role=listitem` for each column with `aria-label="Column: <Title>"`.
- Column container: `.kanban-column` internally for stable scoping.
- Cards: `.kanban-card` with child `.kanban-card-inner` clickable for modal.
- Add Card: column-scoped button `+ Add Card` opens a form with named inputs.
- Edit/Delete: within the modal view/edit forms and confirmation dialogs.
- Filters: MUI Autocomplete inputs identified by placeholder text (e.g., "Status"), and a "Reset all filters" button.

If a `data-testid` is present in code, prefer it; otherwise, rely on ARIA roles, labels, and stable class names/text based on the app’s structure.

For reference, see the locator mapping guide:
- `kavia-docs/kanban-e2e-playwright-locator-mapping.md` (if available in the repository/docs).

## CI behavior

- Headless: true
- Retries: 2 on CI, 0 locally
- Workers: 1 on CI for stability, default locally
- Reporter: list (via npm script)
- Artifacts: traces, videos, and screenshots are retained on failure for debugging.

## Repository structure

- `package.json`: scripts and devDependencies (`playwright` and `@playwright/test`).
- `playwright.config.ts`: CI-friendly Playwright configuration (reads baseURL from env vars).
- `tests/`: test specifications per feature and shared utilities.
- `tsconfig.json`: TypeScript configuration for tests.

## Notes

- Tests create and manipulate cards during execution to ensure determinism and independence between specs.
- Drag-and-drop uses Playwright’s `locator.dragTo()` interacting with the app’s `react-dnd` HTML5 backend.
- If your app is not reachable at the configured baseURL, tests will fail early; ensure the frontend is up before running tests.
