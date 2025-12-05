import { test, expect } from '@playwright/test';

test.describe('Tasks @Tasks', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/product');
    // Ensure at least one column exists
    if (await page.locator('.kanban-column').count() === 0) {
      await page.getByRole('button', { name: '+ Add Column' }).click();
      await page.getByPlaceholder(/column title/i).fill('To Do');
      await page.getByRole('button', { name: 'Add Column', exact: true }).click();
    }
  });

  test('TC-06: Create a new task @TC-06', async ({ page }) => {
    const taskTitle = 'New Task ' + Date.now();
    const firstColumn = page.locator('.kanban-column').first();

    await test.step('1. Click "Add Task" in the column', async () => {
      // Correct selector for "+ Add Card" button
      await firstColumn.getByRole('button', { name: /\+? ?add card/i }).click();
    });

    await test.step('2. Enter task title', async () => {
      // Input name="feature"
      await firstColumn.locator('input[name="feature"]').fill(taskTitle);
    });

    await test.step('3. Save', async () => {
      // "Add" button
      await firstColumn.getByRole('button', { name: 'Add', exact: true }).click();
    });

    await test.step('Actual Result: A new task card appears', async () => {
      await expect(page.locator('.kanban-card', { hasText: taskTitle })).toBeVisible();
    });
  });

  test('TC-07: Add empty task @TC-07', async ({ page }) => {
    const firstColumn = page.locator('.kanban-column').first();

    await test.step('1. Click "Add Task"', async () => {
      await firstColumn.getByRole('button', { name: /\+? ?add card/i }).click();
    });

    await test.step('2. Leave title empty and Attempt to save', async () => {
      // Do not fill input
      await firstColumn.getByRole('button', { name: 'Add', exact: true }).click();
    });

    await test.step('Actual Result: System should disable button or show error', async () => {
      // The app behavior is to ignore the click if empty, so the form remains open.
      // We verify the input is still visible.
      await expect(firstColumn.locator('input[name="feature"]')).toBeVisible();
    });
  });

  test('TC-08: Edit task details @TC-08', async ({ page }) => {
    // Create task first
    const taskName = 'Edit Me ' + Date.now();
    const firstColumn = page.locator('.kanban-column').first();
    await firstColumn.getByRole('button', { name: /\+? ?add card/i }).click();
    await firstColumn.locator('input[name="feature"]').fill(taskName);
    await firstColumn.getByRole('button', { name: 'Add', exact: true }).click();
    
    const card = page.locator('.kanban-card', { hasText: taskName }).first();
    const newDesc = 'Updated Description ' + Date.now();

    await test.step('1. Click on an existing task', async () => {
      await card.click(); // Opens modal
    });

    await test.step('2. Modify the description', async () => {
      // Click "Edit Card" button at the bottom of the modal
      await page.getByRole('button', { name: 'Edit Card' }).click();
      await page.locator('textarea[name="description"]').fill(newDesc);
    });

    await test.step('3. Save changes', async () => {
      await page.getByRole('button', { name: 'Save', exact: true }).click();
    });

    await test.step('Actual Result: The task card reflects updated info', async () => {
      // Close modal by clicking the close button (x)
      await page.getByRole('button', { name: 'Close' }).click();
      
      // Verify updated description is visible on card (assuming not compact view or prominent display)
      // Or check by opening modal again.
      // The previous test logic checked .kanban-detail-desc-prominent which is in modal view mode.
      // So we should verify BEFORE closing or open again.
      // Let's open again to verify.
      await card.click();
      await expect(page.locator('.kanban-detail-desc-prominent')).toContainText(newDesc);
      await page.getByRole('button', { name: 'Close' }).click();
    });
  });

  test('TC-09: Delete a task @TC-09', async ({ page }) => {
    const taskName = 'Delete Me ' + Date.now();
    const firstColumn = page.locator('.kanban-column').first();
    await firstColumn.getByRole('button', { name: /\+? ?add card/i }).click();
    await firstColumn.locator('input[name="feature"]').fill(taskName);
    await firstColumn.getByRole('button', { name: 'Add', exact: true }).click();

    const card = page.locator('.kanban-card', { hasText: taskName }).first();

    await test.step('1. Click the delete icon', async () => {
      await card.click(); // Open modal
      // Delete icon in header: aria-label="Delete card"
      await page.getByRole('button', { name: 'Delete card' }).click();
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
    await firstColumn.getByRole('button', { name: /\+? ?add card/i }).click();
    await firstColumn.locator('input[name="feature"]').fill(taskName);
    await firstColumn.getByRole('button', { name: 'Add', exact: true }).click();

    await test.step('2. Refresh the browser page', async () => {
      await page.reload();
    });

    await test.step('Actual Result: Task is still visible', async () => {
      await expect(page.locator('.kanban-card', { hasText: taskName })).toBeVisible();
    });
  });

});
