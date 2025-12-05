/**
 * Basic example test that verifies the application loads at the configured baseURL.
 * This uses page.goto('/') relying on baseURL defined in playwright.config.ts.
 */

import { test, expect } from '@playwright/test';

test.describe('Application smoke test', () => {
  test('should load the app root page and render content', async ({ page, baseURL }) => {
    // Navigate to root using baseURL; ensures environment-driven configuration works.
    await page.goto('/');

    // Assert network successful navigation.
    await expect(page).toHaveURL(new RegExp('^' + (baseURL ?? '') + '/?'));

    // Try to detect a common app container; fall back to checking document title or basic body content.
    // Adjust or extend selectors when actual app is known.
    const appSelectors = [
      '[data-testid="app-root"]',
      '#root',
      'main',
      'header',
      'body'
    ];

    let foundVisible = false;
    for (const selector of appSelectors) {
      const locator = page.locator(selector);
      if (await locator.first().isVisible().catch(() => false)) {
        foundVisible = true;
        break;
      }
    }

    // If none of the common containers are visible, still ensure document has rendered text.
    if (!foundVisible) {
      const bodyText = await page.textContent('body').catch(() => '');
      expect((bodyText ?? '').trim().length).toBeGreaterThan(0);
    } else {
      expect(foundVisible).toBeTruthy();
    }
  });
});
