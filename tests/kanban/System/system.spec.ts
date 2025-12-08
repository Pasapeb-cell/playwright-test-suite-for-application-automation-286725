import { test, expect } from '@playwright/test';

test.describe('System @System', () => {

  test('TC-20: Clear Board / Reset @TC-20 @smoke', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    await test.step('1. Verify Clear Board button exists', async () => {
      const clearBtn = page.getByTestId('clear-board-btn');
      await expect(clearBtn).toBeVisible();
    });

    await test.step('2. Click Clear Board and verify confirmation modal', async () => {
      const clearBtn = page.getByTestId('clear-board-btn');
      await clearBtn.click();
      
      // Verify confirmation modal appears
      const modal = page.getByTestId('clear-board-modal');
      await expect(modal).toBeVisible();
      
      // Verify the modal contains warning text
      await expect(modal).toContainText(/clear board/i);
      await expect(modal).toContainText(/cannot be undone/i);
    });

    await test.step('3. Confirm clear board action', async () => {
      const confirmBtn = page.getByTestId('clear-board-confirm');
      await expect(confirmBtn).toBeVisible();
      await confirmBtn.click();
      
      // Wait for the action to complete
      await page.waitForTimeout(1500);
    });

    await test.step('4. Verify board is empty (no cards remain)', async () => {
      // Wait for any loading to complete
      await page.waitForLoadState('networkidle');
      
      // Check that no kanban cards are present
      const cards = page.locator('.kanban-card');
      await expect(cards).toHaveCount(0);
      
      // Alternatively, check for cards within card lists
      const cardLists = page.locator('.kanban-card-list .kanban-card');
      await expect(cardLists).toHaveCount(0);
    });

    await test.step('5. Verify persistence: Reload page and confirm board remains cleared', async () => {
      // Reload the page
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Wait a bit for data to load from backend
      await page.waitForTimeout(1000);
      
      // Verify no cards are present after reload
      const cardsAfterReload = page.locator('.kanban-card');
      await expect(cardsAfterReload).toHaveCount(0);
      
      // Double check with card list selector
      const cardListsAfterReload = page.locator('.kanban-card-list .kanban-card');
      await expect(cardListsAfterReload).toHaveCount(0);
    });
  });

});
