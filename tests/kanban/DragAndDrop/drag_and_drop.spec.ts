import { test, expect } from '@playwright/test';

test.describe('Drag & Drop @DragAndDrop', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/product');
    // Ensure we have at least 2 columns
    while (await page.locator('.kanban-column').count() < 2) {
      await page.getByRole('button', { name: '+ Add Column' }).click();
      await page.getByPlaceholder(/column title/i).fill('Col ' + Date.now());
      await page.getByRole('button', { name: 'Add Column', exact: true }).click();
    }
  });

  test('TC-11: Move task to next column @TC-11', async ({ page }) => {
    const taskName = 'Drag Me ' + Date.now();
    const columns = page.locator('.kanban-column');
    const col1 = columns.nth(0);
    const col2 = columns.nth(1);

    // Create task in Col 1
    await col1.getByRole('button', { name: /\+? ?add card/i }).click();
    await col1.locator('input[name="feature"]').fill(taskName);
    await col1.getByRole('button', { name: 'Add', exact: true }).click();

    const card = page.locator('.kanban-card', { hasText: taskName }).first();

    await test.step('Drag task to next column', async () => {
      await card.dragTo(col2);
    });

    await test.step('Actual Result: Task snaps into In Progress (next) column', async () => {
      // Verify card is now inside col2
      await expect(col2.locator('.kanban-card', { hasText: taskName })).toBeVisible();
      await expect(col1.locator('.kanban-card', { hasText: taskName })).not.toBeVisible();
    });
  });

  test('TC-12: Move task backwards @TC-12', async ({ page }) => {
     const taskName = 'Backwards ' + Date.now();
     const columns = page.locator('.kanban-column');
     const col1 = columns.nth(0);
     const col2 = columns.nth(1);
 
     // Create task in Col 2
     await col2.getByRole('button', { name: /\+? ?add card/i }).click();
     await col2.locator('input[name="feature"]').fill(taskName);
     await col2.getByRole('button', { name: 'Add', exact: true }).click();
 
     const card = page.locator('.kanban-card', { hasText: taskName }).first();
 
     await test.step('Drag task back to previous column', async () => {
       await card.dragTo(col1);
     });
 
     await test.step('Actual Result: Task moves back to first column', async () => {
       await expect(col1.locator('.kanban-card', { hasText: taskName })).toBeVisible();
     });
  });

  test('TC-13: Reorder tasks within column @TC-13', async ({ page }) => {
    // Create a new column to ensure a clean state for ordering
    const colName = 'Order Col ' + Date.now();
    await page.getByRole('button', { name: '+ Add Column' }).click();
    await page.getByPlaceholder(/column title/i).fill(colName);
    await page.getByRole('button', { name: 'Add Column', exact: true }).click();
    
    const column = page.locator('.kanban-column', { hasText: colName });
    const taskA = 'Task A ' + Date.now();
    const taskB = 'Task B ' + Date.now();

    // Create 2 tasks
    await column.getByRole('button', { name: /\+? ?add card/i }).click();
    await column.locator('input[name="feature"]').fill(taskA);
    await column.getByRole('button', { name: 'Add', exact: true }).click();
    
    await column.getByRole('button', { name: /\+? ?add card/i }).click();
    await column.locator('input[name="feature"]').fill(taskB);
    await column.getByRole('button', { name: 'Add', exact: true }).click();

    const cardA = column.locator('.kanban-card', { hasText: taskA });
    const cardB = column.locator('.kanban-card', { hasText: taskB });

    // Initial check to ensure order is A, B
    await expect(column.locator('.kanban-card')).toHaveText([taskA, taskB]);

    await test.step('Drag bottom task to top', async () => {
      // Drag B to A
      await cardB.dragTo(cardA);
    });

    await test.step('Actual Result: Task order changes', async () => {
      // Strictly verify the new order is [Task B, Task A]
      // .toHaveText() on a list locator asserts exact order and contents and waits for DOM to settle
      await expect(column.locator('.kanban-card')).toHaveText([taskB, taskA]);
    });
  });

  test('TC-14: Drop task outside valid area @TC-14', async ({ page }) => {
    const taskName = 'Outside ' + Date.now();
    const col1 = page.locator('.kanban-column').nth(0);
    
    await col1.getByRole('button', { name: /\+? ?add card/i }).click();
    await col1.locator('input[name="feature"]').fill(taskName);
    await col1.getByRole('button', { name: 'Add', exact: true }).click();
    
    const card = page.locator('.kanban-card', { hasText: taskName });

    await test.step('Drag task outside', async () => {
      // Drag to body or somewhere "empty"
      await card.dragTo(page.locator('body'), { targetPosition: { x: 0, y: 0 } });
    });

    await test.step('Actual Result: Task snaps back, no data lost', async () => {
      await expect(card).toBeVisible();
    });
  });

});
