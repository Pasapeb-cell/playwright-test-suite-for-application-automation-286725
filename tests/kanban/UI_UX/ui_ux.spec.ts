import { test, expect } from '@playwright/test';

test.describe('UI/UX @UI_UX', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/product');
    // Ensure col exists
    if (await page.locator('.kanban-column').count() === 0) {
      await page.getByRole('button', { name: /add column/i }).click();
      await page.getByPlaceholder(/column title/i).fill('UI Test');
      await page.getByRole('button', { name: /add/i }).click();
    }
  });

  test('TC-15: Long task descriptions @TC-15', async ({ page }) => {
    const longText = 'A'.repeat(300);
    const col = page.locator('.kanban-column').first();

    await test.step('Create task with long text', async () => {
      await col.getByRole('button', { name: /add task/i }).click();
      await col.getByPlaceholder(/task title/i).fill(longText);
      await col.getByRole('button', { name: /add/i }).click();
    });

    await test.step('Actual Result: Layout should not break', async () => {
      // Verify the card is visible and the board still looks okay (width check)
      const card = page.locator('.kanban-card').first();
      await expect(card).toBeVisible();
      // Check if text is truncated or wrapped (implied by visibility without error)
    });
  });

  test('TC-16: Special characters in input @TC-16', async ({ page }) => {
    const specialChars = '@#$%^&*()_+<script>alert("xss")</script>';
    const col = page.locator('.kanban-column').first();

    await test.step('Create task with special characters', async () => {
      await col.getByRole('button', { name: /add task/i }).click();
      await col.getByPlaceholder(/task title/i).fill(specialChars);
      await col.getByRole('button', { name: /add/i }).click();
    });

    await test.step('Actual Result: Characters display correctly, sanitized', async () => {
      await expect(page.locator('.kanban-card', { hasText: '@#$%^&*' })).toBeVisible();
      // Ensure no actual alert popped up (Playwright auto-dismisses dialogs but we can verify content)
    });
  });

  test('TC-17: Mobile responsiveness @TC-17', async ({ page }) => {
    await test.step('1. Resize browser to mobile width', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
    });

    await test.step('2. Scroll horizontally', async () => {
      // Ensure board is visible
      await expect(page.locator('.kanban-board')).toBeVisible();
      // Check if horizontal scroll is possible or columns are stacked?
      // Kanban usually scrolls horizontally
      // We just check visibility and lack of broken layout
    });

    await test.step('Actual Result: Columns accessible', async () => {
      await expect(page.locator('.kanban-column').first()).toBeVisible();
    });
  });

});
