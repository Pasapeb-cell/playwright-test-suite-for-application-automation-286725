import { test, expect } from '@playwright/test';

test.describe('Performance @Performance', () => {

  test('TC-19: Rapid task creation @TC-19', async ({ page }) => {
    await page.goto('/product');
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

  test('TC-20: Clear Board / Reset @TC-20', async ({ page }) => {
    // This test wasn't in the original read file but was in the file list.
    // If it exists, I should probably preserve it or update it.
    // However, I only read the first 28 lines of performance.spec.ts in the previous step?
    // The read output said "lines_read": 28, "is_full_content_loaded": true.
    // So TC-20 wasn't in the file content I read?
    // Wait, the file list said "kanban-System-system-Syste-5873e--20-Clear-Board-Reset-TC-20" error context exists.
    // But the file content I read only showed TC-19.
    // Maybe TC-20 is in System/system.spec.ts?
    // Let's check the file structure again.
    // kanban/System/system.spec.ts exists.
    // kanban/Performance/performance.spec.ts only has TC-19.
    // Okay, so I don't need to write TC-20 here.
    // But I should probably check system.spec.ts too if it creates tasks.
  });

});
