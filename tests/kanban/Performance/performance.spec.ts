import { test, expect } from '@playwright/test';

test.describe('Performance @Performance', () => {

  test('TC-19: Rapid task creation @TC-19', async ({ page }) => {
    await page.goto('/');
    // Ensure col
    const col = page.locator('.kanban-column').first();
    if (await col.count() === 0) {
      await page.getByRole('button', { name: '+ Add Column' }).click();
      await page.getByPlaceholder(/column title/i).fill('Perf');
      await page.getByRole('button', { name: 'Add Column', exact: true }).click();
    }

    await test.step('Quickly add 5 tasks in succession', async () => {
      for (let i = 0; i < 5; i++) {
        await col.getByRole('button', { name: /\+? ?add card/i }).click();
        await col.locator('input[name="feature"]').fill(`Rapid Task ${i}`);
        await col.getByRole('button', { name: 'Add', exact: true }).click();
      }
    });

    await test.step('Actual Result: App handles gracefully', async () => {
      await expect(page.locator('.kanban-card', { hasText: 'Rapid Task 4' })).toBeVisible();
    });
  });



});
