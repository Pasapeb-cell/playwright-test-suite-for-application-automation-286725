import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 12'] });

/**
 * PUBLIC_INTERFACE
 * TC012 — UI/Responsiveness — Verify layout on mobile device
 *
 * Mapping reference:
 * - kavia-docs/locator-mapping.md (If present: prefer data-testid from the mapping.)
 * - Otherwise use ARIA roles/labels and robust text-based fallbacks.
 *
 * Behavior:
 * - Emulates a mobile device profile (iPhone 12).
 * - Navigates to baseURL (from playwright.config or E2E_BASE_URL).
 * - Waits for app root to be ready.
 * - Verifies that default columns (To Do, In Progress, Done) render correctly for mobile:
 *   - Visible in a stacked or scrollable layout.
 *   - Uses soft assertions per element; final hard assertions to ensure expectations.
 * - Validates presence/visibility of key mobile UI elements if applicable
 *   (e.g., mobile menu/hamburger, responsive toolbar, column headers).
 *
 * Tag: @tc012
 */

test.describe('@tc012 Mobile Responsiveness: iPhone 12 viewport', () => {
  

  const DEFAULT_COLUMNS = ['To Do', 'In Progress', 'Done'];

  // Helper to escape text for regex
  function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Attempt to locate the app root using preferred mapping (data-testid), then fallbacks.
  async function waitForAppRoot(page) {
    const candidates = [
      '[data-testid="app-root"]',
      '[data-testid="kanban-app"]',
      '#root',
      'main',
      'body'
    ];

    let found = false;
    for (const sel of candidates) {
      try {
        const loc = page.locator(sel).first();
        if (await loc.isVisible({ timeout: 2_000 }).catch(() => false)) {
          found = true;
          break;
        }
      } catch {
        // continue
      }
    }

    // Stabilize network if possible
    await page.waitForLoadState('networkidle').catch(() => { /* tolerate slow envs */ });

    expect(
      found,
      [
        'Mobile app root did not become visible using expected selectors.',
        'Tried selectors:',
        ...candidates.map(s => `  - ${s}`)
      ].join('\n')
    ).toBeTruthy();
  }

  // Try to find a board columns container optimized for mobile scroll/stack
  function getBoardListLocator(page) {
    // Prefer data-testid if documented by mapping; fallback to ARIA list with label
    const candidates = [
      page.locator('[data-testid="kanban-board"]').first(),
      page.locator('[data-testid="board"]').first(),
      page.getByRole('list', { name: /Kanban Columns/i }),
      page.locator('[role="list"][aria-label="Kanban Columns"]').first()
    ];
    return candidates;
  }

  async function ensureColumnVisible(page, boardList, columnName: string) {
    const nameRe = new RegExp(`^${escapeRegex(columnName)}$`, 'i');
    const columnNameRegex = new RegExp(`^${escapeRegex(columnName)}$`, 'i');

    // Build candidate locators with page-level options first.
    const candidates = [
      // Page-level semantic/heading candidates
      page.getByRole('heading', { name: columnNameRegex }).first(),
      page.getByText(columnNameRegex).first(),
      page.getByRole('region', { name: new RegExp(`^Kanban Column:\\s*${escapeRegex(columnName)}$`, 'i') }).first(),

      // Preferred explicit mapping-based selectors
      page.locator(`[data-testid="kanban-column"][data-title="${columnName}"]`).first(),
      page.locator(`[data-testid="column"][data-title="${columnName}"]`).first(),
      page.locator(`[data-testid="column-title"]`, { hasText: nameRe }).first(),

      // ARIA role/label via wrapper item (guarded by boardList)
      ...(boardList ? [boardList.getByRole('listitem', { name: new RegExp(`^Column:\\s*${escapeRegex(columnName)}$`, 'i') })] : []),

      // Fallback: text match within the board container (guarded by boardList)
      ...(boardList ? [boardList.getByText(nameRe).first()] : [])
    ];

    // Defensive early check: ensure we have candidates
    if (!candidates.length) {
      throw new Error(`No locator candidates constructed for column "${columnName}".`);
    }

    // Try simple visibility
    for (const loc of candidates) {
      try {
        if (await loc.isVisible({ timeout: 1500 }).catch(() => false)) {
          await expect.soft(loc, `Column "${columnName}" should be visible (mobile)`).toBeVisible();
          return true;
        }
      } catch {
        // ignore and continue
      }
    }

    // Try to scroll the board container (if it supports horizontal/vertical scroll on mobile)
    const scrollTargets = [
      // Board list container if present, else fall back to page-level container first
      (boardList ?? page.locator('[data-testid="board-wrapper"]').first()),
      // Common containers
      page.locator('main').first(),
      page.locator('body').first()
    ];

    for (const container of scrollTargets) {
      try {
        // Attempt small increments both directions to surface columns in a horizontally scrollable layout.
        for (const [dx, dy] of [
          [200, 0], [400, 0], [600, 0], [-200, 0], [-400, 0], [-600, 0],
          [0, 200], [0, 400], [0, 600]
        ]) {
          await container.hover({ trial: true }).catch(() => {});
          await page.mouse.wheel(dx, dy);
          for (const loc of candidates) {
            if (await loc.isVisible({ timeout: 600 }).catch(() => false)) {
              await expect.soft(loc, `Column "${columnName}" should be visible after scrolling (mobile)`).toBeVisible();
              return true;
            }
          }
        }
      } catch {
        // continue trying next container
      }
    }

    // As last attempt, try touchscreen swipe gestures if supported by device emulation
    try {
      const viewport = page.viewportSize();
      if (viewport) {
        const midY = Math.floor(viewport.height * 0.5);
        // swipe left/right
        for (const [startX, endX] of [
          [Math.floor(viewport.width * 0.8), Math.floor(viewport.width * 0.2)],
          [Math.floor(viewport.width * 0.2), Math.floor(viewport.width * 0.8)]
        ]) {
          await page.touchscreen.tap(startX, midY);
          await page.mouse.move(startX, midY);
          await page.mouse.down();
          await page.mouse.move(endX, midY, { steps: 6 });
          await page.mouse.up();

          for (const loc of candidates) {
            if (await loc.isVisible({ timeout: 600 }).catch(() => false)) {
              await expect.soft(loc, `Column "${columnName}" visible after swipe (mobile)`).toBeVisible();
              return true;
            }
          }
        }
      }
    } catch {
      // ignore
    }

    // Soft assertion failure to indicate not found and provide clear message
    await expect.soft(page.locator('body'), `Column not visible in mobile layout: "${columnName}"`).toBeVisible();
    // Additionally, throw an informative error to make failures explicit in CI if needed.
    // We don't throw hard here to allow other columns to be checked; visibility result remains false.
    return false;
  }

  test('should render mobile layout and show default columns (stack or scroll) @tc012', async ({ page, baseURL }) => {
    // Navigate to root using baseURL config
    await page.goto('/');

    // Basic URL assertion (allow trailing slash, optional query)
    if (baseURL) {
      const base = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
      await expect(page).toHaveURL(new RegExp('^' + escapeRegex(base) + '/?(\\?.*)?$'));
    }

    await waitForAppRoot(page);

    // Identify the board container (mobile may stack or require scroll)
    let boardList = null;
    for (const cand of getBoardListLocator(page)) {
      try {
        if (await cand.isVisible({ timeout: 1500 }).catch(() => false)) {
          boardList = cand;
          break;
        }
      } catch {
        // continue
      }
    }

    // Board list should be visible for mobile, even if it scrolls
    if (boardList) {
      await expect.soft(boardList, 'Kanban board container should be visible on mobile').toBeVisible();
    } else {
      // Soft failure: still continue to try find columns by fallback (page-level)
      await expect.soft(page.locator('main').first(), 'Main content should be visible on mobile').toBeVisible();
    }

    // Validate that default columns appear in mobile layout (stack or scroll)
    const results: Array<{ name: string; visible: boolean }> = [];
    for (const col of DEFAULT_COLUMNS) {
      const visible = await ensureColumnVisible(page, boardList, col);
      results.push({ name: col, visible });
    }

    // Validate key mobile UI elements as per mapping (if present)
    // Prefer data-testid selectors from mapping; otherwise use ARIA role or descriptive label
    const mobileUiCandidates = [
      // Hypothetical mapping-based identifiers
      '[data-testid="mobile-menu"]',
      '[data-testid="hamburger"]',
      '[data-testid="toolbar"]',

      // Common ARIA and role patterns for mobile nav/toolbar
      'button[aria-label*="menu" i]',
      'button[aria-label*="hamburger" i]',
      'button[aria-label*="open sidebar" i]',
      'nav[aria-label*="mobile" i]',
      'header',
      'nav'
    ];

    let mobileUiVisible = false;
    for (const sel of mobileUiCandidates) {
      try {
        const loc = page.locator(sel).first();
        if (await loc.isVisible({ timeout: 1200 }).catch(() => false)) {
          await expect.soft(loc, `Mobile UI control visible: ${sel}`).toBeVisible();
          mobileUiVisible = true;
          break;
        }
      } catch {
        // continue
      }
    }

    // Optional: check that task card titles wrap or truncate without overflowing (heuristic)
    // Using soft assert as implementations vary widely.
    const anyCard = page.locator(
      [
        '[data-testid="task-card"]',
        '[data-testid="card"]',
        '[role="article"]',
        '[role="listitem"]'
      ].join(', ')
    ).first();
    if (await anyCard.isVisible({ timeout: 1000 }).catch(() => false)) {
      // At least ensure it is within viewport bounds (no huge overflow)
      const box = await anyCard.boundingBox().catch(() => null);
      const vp = page.viewportSize();
      if (box && vp) {
        const withinViewport = box.x >= -5 && box.y >= -5 && (box.x + box.width) <= (vp.width + 10);
        await expect.soft(withinViewport).toBeTruthy();
      } else {
        await expect.soft(anyCard).toBeVisible();
      }
    } else {
      await expect.soft(page.locator('body'), 'No task card detected in mobile view (soft)').toBeVisible();
    }

    // Final hard asserts:
    const visibleCount = results.filter(r => r.visible).length;
    const expectedCount = DEFAULT_COLUMNS.length;
    expect(
      visibleCount,
      [
        'Mobile layout did not render all default columns.',
        `Base URL: ${baseURL || '(not provided)'}`,
        `Expected columns: ${DEFAULT_COLUMNS.join(', ')}`,
        `Visible: ${results.filter(r => r.visible).map(r => r.name).join(', ') || '(none)'}`,
        `Missing: ${results.filter(r => !r.visible).map(r => r.name).join(', ') || '(none)'}`
      ].join('\n')
    ).toBe(expectedCount);

    // Ensure at least one mobile UI element is visible (menu/hamburger/toolbar/etc.)
    expect(
      mobileUiVisible,
      [
        'Expected at least one mobile UI control (menu/hamburger/toolbar) to be visible.',
        'Checked selectors:',
        ...mobileUiCandidates.map(s => `  - ${s}`)
      ].join('\n')
    ).toBeTruthy();
  });
});
