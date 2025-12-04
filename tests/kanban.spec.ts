import { test, expect } from '@playwright/test';
import { readCsv } from '../utils/csvHelper';

// Read test cases from CSV
const testCases = readCsv('test_cases.csv');

// Use serial mode to ensure test cases run in order and share state (backend persistence)
test.describe.configure({ mode: 'serial' });

test.describe('Kanban Data-Driven Tests', () => {
  
  test.beforeAll(async ({ browser }) => {
    // Optional: Setup or cleanup before all tests if API access was available
    console.log('Starting Kanban Test Suite in Serial Mode');

    // Create required columns if they don't exist
    const page = await browser.newPage();
    try {
      await page.goto('/product');
      
      // Wait for board to maintain stable state
      await expect(page.getByLabel('Kanban Columns')).toBeVisible({ timeout: 15000 });

      const columnsToEnsure = ['To Do', 'In Progress', 'Done'];
      for (const colName of columnsToEnsure) {
          // Use specific role to avoid ambiguity with content areas
          const col = page.getByRole('listitem', { name: `Column: ${colName}` });
          if (!await col.isVisible()) {
              console.log(`Creating column: ${colName}`);
              await page.getByRole('button', { name: '+ Add Column' }).click();
              const modal = page.locator('.kanban-modal-dialog');
              await expect(modal).toBeVisible();
              await modal.getByPlaceholder('Column Title').fill(colName);
              await modal.getByRole('button', { name: 'Add Column' }).click();
              await expect(col).toBeVisible();
          }
      }
    } catch (e) {
      console.error('Error setting up columns:', e);
      throw e;
    } finally {
      await page.close();
    }
  });

  for (const data of testCases) {
    test(`${data.TestCaseId}: ${data.TestDescription}`, async ({ page }) => {
      console.log(`Running Test Case: ${data.TestCaseId} - ${data.TestDescription}`);
      
      // Ensure we are on the board page
      await page.goto('/product');
      await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();

      const taskTitle = data.TaskTitle;
      const targetColumn = data.TargetColumn;

      if (data.Action === 'CREATE_TASK') {
        const columnName = targetColumn || 'To Do';
        const column = page.getByRole('listitem', { name: `Column: ${columnName}` });
        await expect(column).toBeVisible();

        // Click "+ Add Card" in the specific column
        await column.getByRole('button', { name: '+ Add Card' }).click();

        const form = column.locator('.kanban-add-card-form');
        await expect(form).toBeVisible();
        await form.locator('input[name="feature"]').fill(taskTitle);
        
        // Submit
        await form.getByRole('button', { name: 'Add' }).click();

        // Verify card creation
        await expect(column.getByText(taskTitle)).toBeVisible();

      } else if (data.Action === 'MOVE_TASK') {
        // Find the card by text (using exact: false to be safe, or exact: true if needed)
        // Use .kanban-card selector for precision
        const card = page.locator('.kanban-card').filter({ hasText: taskTitle }).first();
        await expect(card).toBeVisible();

        const targetCol = page.getByRole('listitem', { name: `Column: ${targetColumn}` });
        await expect(targetCol).toBeVisible();

        await card.dragTo(targetCol);

        // Verify move
        await expect(targetCol.locator('.kanban-card').filter({ hasText: taskTitle })).toBeVisible();
        
      } else if (data.Action === 'DELETE_TASK') {
        // 1. Find card and click to open modal (assuming inline click opens modal)
        const card = page.locator('.kanban-card').filter({ hasText: taskTitle }).first();
        await expect(card).toBeVisible();
        await card.click();

        // 2. Wait for modal
        const modal = page.locator('.kanban-modal-dialog');
        await expect(modal).toBeVisible();

        // 3. Click delete button in modal
        // Note: There might be multiple buttons, look for specific delete button/icon or text
        // Based on code: button with aria-label="Delete card" or title="Delete"
        const deleteBtn = modal.locator('button[aria-label="Delete card"]');
        await deleteBtn.click();

        // 4. Confirm deletion if a confirmation dialog appears
        // Code shows a second modal for confirmation: "Delete this card?"
        const confirmModal = page.getByText('Delete this card?');
        if (await confirmModal.isVisible()) {
             await page.getByRole('button', { name: 'Yes, Delete' }).click();
        }

        // 5. Verify card is gone
        // Wait for modal to close
        await expect(modal).not.toBeVisible();
        // Verify card is not in the list
        await expect(page.locator('.kanban-card').filter({ hasText: taskTitle })).not.toBeVisible();

      } else if (data.Action === 'VERIFY_TASK') {
        const targetCol = page.getByRole('listitem', { name: `Column: ${targetColumn}` });
        await expect(targetCol).toBeVisible();
        await expect(targetCol.locator('.kanban-card').filter({ hasText: taskTitle })).toBeVisible();
      }
    });
  }
});
