import { test, expect } from '@playwright/test';

test('smoke test - app loads @smoke', async ({ page }) => {
  await page.goto('/');
  // Simple assertion to verify page loads (expecting some title)
  await expect(page).toHaveTitle(/./);
});
