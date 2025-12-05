import { test, expect } from '@playwright/test';

test.describe('Board Layout @BoardLayout', () => {
  
  test('TC-01: Verify default board load @TC-01', async ({ page }) => {
    await test.step('1. Open the application URL', async () => {
      await page.goto('/product');
    });

    await test.step('2. Observe the initial state', async () => {
      // Verify that the board container is visible
      await expect(page.locator('.kanban-board')).toBeVisible();
      
      // Expect at least some default columns or an empty state
      // Common defaults are To Do, In Progress, Done
      const columns = page.locator('.kanban-column-title');
      await expect(columns).not.toHaveCount(0);
      
      // Optional: check for specific default column names if they are guaranteed
      // await expect(page.locator('.kanban-column-title', { hasText: 'To Do' })).toBeVisible();
    });
  });

});
