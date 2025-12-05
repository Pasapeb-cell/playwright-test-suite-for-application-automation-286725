import { test, expect } from '@playwright/test';

// PUBLIC_INTERFACE
test.describe('Sample suite', () => {
  test('can open example.com and have title containing Example', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });
});
