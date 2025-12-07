import { test, expect } from '@playwright/test';

test.describe('System @System', () => {

  test('TC-20: Clear Board / Reset @TC-20', async ({ page }) => {
    await page.goto('/product');

    await test.step('1. Look for Clear Board button', async () => {
      const clearBtn = page.getByRole('button', { name: /clear board|reset/i });
      await expect(clearBtn).toBeVisible();
      await clearBtn.click();
        
      // Confirm
      await page.getByRole('button', { name: /confirm|yes/i }).click();
        
      // Verify
      await expect(page.locator('.kanban-column')).toHaveCount(0);
    });
  });

});
