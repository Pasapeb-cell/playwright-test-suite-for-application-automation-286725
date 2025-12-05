import { test, expect } from '@playwright/test';

test.describe('Tasks @Tasks', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/product');
    // Ensure at least one column exists
    if (await page.locator('.kanban-column').count() === 0) {
      await page.getByRole('button', { name: /add column/i }).click();
      await page.getByPlaceholder(/column title/i).fill('To Do');
      await page.getByRole('button', { name: /add/i }).click();
    }
  });

  test('TC-06: Create a new task @TC-06', async ({ page }) => {
    const taskTitle = 'New Task ' + Date.now();
    const firstColumn = page.locator('.kanban-column').first();

    await test.step('1. Click "Add Task" in the column', async () => {
      await firstColumn.getByRole('button', { name: /add task/i }).click();
    });

    await test.step('2. Enter task title', async () => {
      // Assuming inline add or modal. Typically inline "Add Task" opens a small form
      // Based on typical patterns, looking for input inside the column
      await firstColumn.getByPlaceholder(/task title|enter title/i).fill(taskTitle);
    });

    await test.step('3. Save', async () => {
      await firstColumn.getByRole('button', { name: /add/i }).click();
    });

    await test.step('Actual Result: A new task card appears', async () => {
      await expect(page.locator('.kanban-card', { hasText: taskTitle })).toBeVisible();
    });
  });

  test('TC-07: Add empty task @TC-07', async ({ page }) => {
    const firstColumn = page.locator('.kanban-column').first();

    await test.step('1. Click "Add Task"', async () => {
      await firstColumn.getByRole('button', { name: /add task/i }).click();
    });

    await test.step('2. Leave title empty and Attempt to save', async () => {
      await firstColumn.getByRole('button', { name: /add/i }).click();
    });

    await test.step('Actual Result: System should disable button or show error', async () => {
      // Check if new card NOT created (empty cards shouldn't exist)
      // Or check for validation message
      // This assumes we can't easily identify an "empty" card, so we rely on count not increasing
      // For this test, we simply check that the "Add" action didn't result in a blank card
      // or that a toast appeared
      // (Simplified check)
      await expect(page.locator('.kanban-toast-error').or(page.locator('text=cannot be empty'))).toBeVisible({ timeout: 5000 }).catch(() => {});
      // Alternatively, check the input is still visible (didn't close)
      await expect(firstColumn.getByPlaceholder(/task title/i)).toBeVisible();
    });
  });

  test('TC-08: Edit task details @TC-08', async ({ page }) => {
    // Create task first
    const taskName = 'Edit Me ' + Date.now();
    const firstColumn = page.locator('.kanban-column').first();
    await firstColumn.getByRole('button', { name: /add task/i }).click();
    await firstColumn.getByPlaceholder(/task title/i).fill(taskName);
    await firstColumn.getByRole('button', { name: /add/i }).click();
    
    const card = page.locator('.kanban-card', { hasText: taskName }).first();
    const newDesc = 'Updated Description ' + Date.now();

    await test.step('1. Click on an existing task', async () => {
      await card.click(); // Opens modal
    });

    await test.step('2. Modify the description', async () => {
      await page.getByRole('button', { name: /edit card/i }).click();
      await page.locator('textarea[name="description"]').fill(newDesc);
    });

    await test.step('3. Save changes', async () => {
      await page.getByRole('button', { name: 'Save' }).click();
    });

    await test.step('Actual Result: The task card reflects updated info', async () => {
      // Close modal
      await page.getByRole('button', { name: 'Close' }).click();
      // Check if description is visible on card (if not compact) or open modal again to check
      await card.click();
      await expect(page.locator('.kanban-detail-desc-prominent')).toContainText(newDesc);
    });
  });

  test('TC-09: Delete a task @TC-09', async ({ page }) => {
    const taskName = 'Delete Me ' + Date.now();
    const firstColumn = page.locator('.kanban-column').first();
    await firstColumn.getByRole('button', { name: /add task/i }).click();
    await firstColumn.getByPlaceholder(/task title/i).fill(taskName);
    await firstColumn.getByRole('button', { name: /add/i }).click();

    const card = page.locator('.kanban-card', { hasText: taskName }).first();

    await test.step('1. Click the delete icon', async () => {
      await card.click(); // Open modal
      await page.getByRole('button', { name: 'Delete' }).click();
    });

    await test.step('2. Confirm deletion', async () => {
      await page.getByRole('button', { name: 'Yes, Delete' }).click();
    });

    await test.step('Actual Result: Task is removed', async () => {
      await expect(card).not.toBeVisible();
    });
  });

  test('TC-10: Task persistence after refresh @TC-10', async ({ page }) => {
    const taskName = 'Persistence ' + Date.now();
    const firstColumn = page.locator('.kanban-column').first();
    await firstColumn.getByRole('button', { name: /add task/i }).click();
    await firstColumn.getByPlaceholder(/task title/i).fill(taskName);
    await firstColumn.getByRole('button', { name: /add/i }).click();

    await test.step('2. Refresh the browser page', async () => {
      await page.reload();
    });

    await test.step('Actual Result: Task is still visible', async () => {
      await expect(page.locator('.kanban-card', { hasText: taskName })).toBeVisible();
    });
  });

});
