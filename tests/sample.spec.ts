import { test, expect } from '@playwright/test';

// PUBLIC_INTERFACE
test.describe('Sample suite', () => {
  // Mark this as a smoke test to ensure CI grep like @smoke selects it
  test('can open example.com and have title containing Example @smoke', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });
});
