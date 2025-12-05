import { test, expect } from '@playwright/test';

test('has title @smoke', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Kanban/i);
});
