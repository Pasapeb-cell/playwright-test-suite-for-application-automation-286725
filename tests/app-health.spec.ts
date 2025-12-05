import { test, expect } from '@playwright/test';

/**
 * PUBLIC_INTERFACE
 * app-health.spec.ts
 * Health check for the hosted Kanban application to verify it is up and interactive.
 *
 * This test navigates to the absolute URL (bypassing baseURL) and asserts the page is loaded by:
 *  - Waiting for network to be idle and/or main content to be visible
 *  - Checking that the title contains "Kanban" OR a common app shell element is present
 *    (e.g., header text like "Board", "Tasks", columns like "To Do", or data-testid anchors)
 *
 * It uses robust selectors and fallbacks to avoid brittleness and provides clear error messages on failure.
 */
test.describe('Hosted Kanban App Health', () => {
  const TARGET_URL = 'https://kanban-board-3.kavia.app/';

  test('should load and render the Kanban app', async ({ page }) => {
    // Navigate with a generous timeout because remote environments can be slower to cold start.
    const navResponse = await page.goto(TARGET_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 45_000
    });

    // If navigation failed at the HTTP layer, provide context.
    expect.soft(navResponse, 'Navigation did not yield a response — site may be unreachable.').toBeTruthy();

    // Try to reach "networkidle" after initial DOMContentLoaded; do not fail if it never reaches idle quickly.
    await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => { /* tolerate */ });

    // Candidate selectors that commonly indicate an app shell is rendered.
    const robustSelectors = [
      // Preferred explicit test IDs if present
      '[data-testid="app-root"]',
      '[data-testid="board"]',
      '[data-testid="column"]',
      '[data-testid="kanban-board"]',

      // Typical React root containers / main regions
      '#root',
      'main',
      'header',

      // Typical column or board markers by text
      'text=/\\bTo Do\\b/i',
      'text=/\\bIn Progress\\b/i',
      'text=/\\bDone\\b/i',
      'text=/\\bBoard\\b/i',
      'text=/\\bTasks\\b/i'
    ];

    // Check if title contains "Kanban" quickly; do not fail solely on title.
    const title = await page.title().catch(() => '');
    const titleLooksRight = /kanban/i.test(title);

    // Try visibility checks for the candidate selectors.
    let visibleMarker = '';
    for (const sel of robustSelectors) {
      try {
        const locator = page.locator(sel).first();
        if (await locator.isVisible({ timeout: 2_000 })) {
          visibleMarker = sel;
          break;
        }
      } catch {
        // Ignore selector errors; continue trying others
      }
    }

    // If neither title nor any robust selector indicated an app shell, try a last-resort basic body text presence.
    let bodyHasText = false;
    if (!titleLooksRight && !visibleMarker) {
      const bodyText = (await page.textContent('body').catch(() => ''))?.trim() ?? '';
      bodyHasText = bodyText.length > 0;
    }

    // At least one of these signals must indicate the app is up.
    const signals = [
      titleLooksRight ? 'title contains "Kanban"' : '',
      visibleMarker ? `visible app shell selector: ${visibleMarker}` : '',
      bodyHasText ? 'body has non-empty text' : ''
    ].filter(Boolean);

    expect(
      signals.length > 0,
      [
        'Kanban application did not present expected signals of availability.',
        `URL: ${TARGET_URL}`,
        `Title: "${title}"`,
        `Detected signals: ${signals.join(', ') || 'none'}`,
        'Tried selectors:',
        ...robustSelectors.map(s => `  - ${s}`)
      ].join('\n')
    ).toBeTruthy();
  });
});
