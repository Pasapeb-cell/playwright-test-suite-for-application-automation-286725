import { test, expect } from '@playwright/test';

test.describe('Performance @Performance', () => {

  test('TC-19: Rapid task creation @TC-19', async ({ page }) => {
    await page.goto('/product');
    // Ensure col
    const col = page.locator('.kanban-column').first();
    if (await col.count() === 0) {
      await page.getByRole('button', { name: /add column/i }).click();
      await page.getByPlaceholder(/column title/i).fill('Perf');
      await page.getByRole('button', { name: /add/i }).click();
    }

    await test.step('Quickly add 5 tasks in succession', async () => {
      for (let i = 0; i < 5; i++) {
        await col.getByRole('button', { name: /add task/i }).click();
        await col.getByPlaceholder(/task title/i).fill(`Rapid Task ${i}`);
        await col.getByRole('button', { name: /add/i }).click();
      }
    });

    await test.step('Actual Result: App handles gracefully', async () => {
      await expect(page.locator('.kanban-card', { hasText: 'Rapid Task 4' })).toBeVisible();
    });
  });

});
