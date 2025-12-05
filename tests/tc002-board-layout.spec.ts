import { test, expect } from '@playwright/test';

/**
 * PUBLIC_INTERFACE
 * TC002 — Board Layout — Verify default columns are present
 *
 * This spec:
 *  1) Navigates to the app baseURL (configured via playwright.config or E2E_BASE_URL).
 *  2) Navigates to the Product board view.
 *  3) Asserts that the default columns are visible.
 *     - Uses data-testid if such mapping is defined in the app (none detected locally),
 *       otherwise prefers ARIA roles/labels per accessible markup.
 *  4) Performs soft assertions per column, then a final expect for count/visibility.
 *  5) Tagged with @tc002 for easy filtering.
 *
 * Notes about selectors:
 *  - Board container uses role="list" with aria-label="Kanban Columns" (KanbanBoard.js).
 *  - Each column wrapper uses role="listitem" with aria-label="Column: <title>" (KanbanBoard.js).
 *  - Column inner container uses aria-label="Kanban Column: <title>" (Column.js) as a fallback.
 *
 * If a kavia-docs/locator-mapping.md exists with explicit data-testid guidance,
 * prefer those selectors. If not, use the ARIA role/label approach implemented here.
 */

test.describe('@tc002 Board Layout: Default columns are present', () => {
  // Adjust to match documented defaults in locator mapping if it becomes available.
  // Using common defaults: "To Do", "In Progress", "Done".
  const DEFAULT_COLUMNS = ['To Do', 'In Progress', 'Done'];

  // Helper to escape text for regex
  function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  test('should display default columns on the Product board @tc002', async ({ page, baseURL }) => {
    // 1) Navigate to app baseURL root.
    await page.goto('/');

    // Assert we are at baseURL (not strict, allows optional trailing slash)
    if (baseURL) {
      const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
      await expect(page).toHaveURL(new RegExp('^' + escapeRegex(base) + '/?$'));
    }

    // 2) Navigate to Product (board) view via primary nav.
    await page.getByRole('link', { name: /^Product$/ }).click();

    // Wait for the board container to be visible (role=list + aria-label)
    const boardList = page.getByRole('list', { name: 'Kanban Columns' });
    await expect(boardList, 'Kanban board list should be visible').toBeVisible();

    // Helpful load stabilization for remote environments
    await page.waitForLoadState('networkidle').catch(() => { /* tolerate */ });

    // 3) Assert default columns are visible using preferred selectors
    // Try data-testid first if present in future, otherwise ARIA-based locators.
    const results: Array<{ name: string; visible: boolean; reason?: string }> = [];

    for (const name of DEFAULT_COLUMNS) {
      const nameRegex = new RegExp(`^${escapeRegex(name)}$`, 'i');

      // Candidate locators (order = preference). data-testid probes are speculative — will be ignored if not present.
      const candidates = [
        // Hypothetical testid-based anchors (if mapping later defines these, they will resolve)
        page.locator(`[data-testid="kanban-column"][data-title="${name}"]`),
        page.locator(`[data-testid="column"][data-title="${name}"]`),

        // ARIA role/label via KanbanBoard wrapper item
        boardList.getByRole('listitem', { name: new RegExp(`^Column:\\s*${escapeRegex(name)}$`, 'i') }),

        // Fallback: inner column container ARIA label
        page.getByRole('region', { name: new RegExp(`^Kanban Column:\\s*${escapeRegex(name)}$`, 'i') }).first(),

        // Fallback: text of the column title within the board list
        boardList.getByText(nameRegex).first()
      ];

      // Pick the first visible locator among candidates
      let foundVisible = false;
      for (const loc of candidates) {
        try {
          if (await loc.isVisible({ timeout: 2000 }).catch(() => false)) {
            // Soft assert for visibility of the resolved locator
            await expect.soft(loc, `Expected default column "${name}" to be visible`).toBeVisible();
            foundVisible = true;
            break;
          }
        } catch {
          // Ignore selector errors and continue trying other candidates
        }
      }

      if (!foundVisible) {
        // Make a soft assertion failure explicit
        await expect.soft(boardList, `Default column not found: "${name}"`).toBeVisible();
      }
      results.push({ name, visible: foundVisible, reason: foundVisible ? undefined : 'not visible' });
    }

    // 4) Final expect for count/visibility: all expected columns should be visible
    const visibleCount = results.filter(r => r.visible).length;
    const expectedCount = DEFAULT_COLUMNS.length;

    expect(
      visibleCount,
      [
        'One or more default columns are missing on the Product board.',
        `Base URL: ${baseURL || '(not provided)'}`,
        `Expected columns: ${DEFAULT_COLUMNS.join(', ')}`,
        `Visible: ${results.filter(r => r.visible).map(r => r.name).join(', ') || '(none)'}`,
        `Missing: ${results.filter(r => !r.visible).map(r => r.name).join(', ') || '(none)'}`
      ].join('\n')
    ).toBe(expectedCount);

    // Optional: also ensure the board has at least the expected number of columns (tolerates additional columns)
    const totalListItems = await boardList.getByRole('listitem').count().catch(() => 0);
    expect(
      totalListItems >= expectedCount,
      `Board shows ${totalListItems} columns, which is less than the expected minimum ${expectedCount}.`
    ).toBeTruthy();
  });
});
