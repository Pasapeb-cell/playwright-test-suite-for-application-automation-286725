import { test, expect } from '@playwright/test';

test.describe('Sanity', () => {
  test('runner is operational', async () => {
    expect(1 + 1).toBe(2);
  });

  test('UI smoke (skips when REACT_APP_FRONTEND_URL is not set)', async ({ page }) => {
    test.skip(!process.env.REACT_APP_FRONTEND_URL, 'REACT_APP_FRONTEND_URL not set; skipping UI smoke test.');
    await page.goto(process.env.REACT_APP_FRONTEND_URL!);
    await expect(page).toHaveURL(/http/);
  });
});
