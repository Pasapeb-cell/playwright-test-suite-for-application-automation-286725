import { test, expect } from '@playwright/test';

test.describe('Columns @Columns', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/product');
  });

  test('TC-02: Add a new column @TC-02', async ({ page }) => {
    const colName = 'Review ' + Date.now();

    await test.step('1. Click on "Add Column" or "+" button', async () => {
      // Assuming a button with "Add Column" text or similar in Toolbar
      await page.getByRole('button', { name: '+ Add Column' }).click();
    });

    await test.step('2. Enter column name', async () => {
      await page.getByPlaceholder(/column title/i).fill(colName);
    });

    await test.step('3. Confirm', async () => {
      await page.getByRole('button', { name: 'Add Column', exact: true }).click();
    });

    await test.step('Actual Result: A new column appears on the board', async () => {
      await expect(page.locator('.kanban-column-title', { hasText: colName })).toBeVisible();
    });
  });

  test('TC-03: Rename an existing column @TC-03', async ({ page }) => {
    // Pre-req: Ensure a column exists to rename
    const firstColumnTitle = page.locator('.kanban-column-title').first();
    const newText = 'Backlog ' + Date.now();

    await test.step('1. Click on a column title', async () => {
      // Code uses onDoubleClick to trigger edit
      await firstColumnTitle.dblclick({ force: true });
    });

    await test.step('2. Change text', async () => {
      const input = page.locator('input[aria-label="Edit column title"]');
      await input.fill(newText);
      
      // 3. Press Enter or click away (Save button exists in code)
      await input.press('Enter');
    });

    await test.step('Actual Result: The column title updates', async () => {
      await expect(page.locator('.kanban-column-title', { hasText: newText })).toBeVisible();
    });
  });

  test('TC-04: Delete a column @TC-04', async ({ page }) => {
    // Pre-req: Create a temp column to delete to avoid destroying default board state
    await page.getByRole('button', { name: '+ Add Column' }).click();
    await page.getByPlaceholder(/column title/i).fill('Delete Me');
    await page.getByRole('button', { name: 'Add Column', exact: true }).click();
    const colLocator = page.locator('.kanban-column', { hasText: 'Delete Me' });
    await expect(colLocator).toBeVisible();

    await test.step('1. Locate the delete/trash icon on a column', async () => {
      // Using class from code analysis: .kanban-column-delbtn
      await colLocator.locator('.kanban-column-delbtn').click();
    });

    await test.step('2. Confirm warning if applicable', async () => {
      await page.getByRole('button', { name: 'Yes, Delete' }).click();
    });

    await test.step('Actual Result: The column is removed', async () => {
      await expect(colLocator).not.toBeVisible();
    });
  });

  test('TC-05: Duplicate column names @TC-05', async ({ page }) => {
    const dupName = 'Duplicate Test';

    await test.step('1. Create a column named "Duplicate Test"', async () => {
      await page.getByRole('button', { name: '+ Add Column' }).click();
      await page.getByPlaceholder(/column title/i).fill(dupName);
      await page.getByRole('button', { name: 'Add Column', exact: true }).click();
    });

    await test.step('2. Create another column named "Duplicate Test"', async () => {
      await page.getByRole('button', { name: '+ Add Column' }).click();
      await page.getByPlaceholder(/column title/i).fill(dupName);
      await page.getByRole('button', { name: 'Add Column', exact: true }).click();
    });

    await test.step('Expected Result: System should either allow it or show a validation error', async () => {
      // We check if either 2 columns exist OR an error toast is shown
      const count = await page.locator('.kanban-column-title', { hasText: dupName }).count();
      const errorToast = page.locator('.kanban-toast-error');
      
      if (await errorToast.isVisible()) {
        // Pass: Validation error shown
        expect(true).toBe(true);
      } else {
        // Pass: System allows it
        expect(count).toBeGreaterThanOrEqual(2);
      }
    });
  });

});
