import { test, expect } from '@playwright/test';
import {
  gotoHome,
  createCardInColumn,
  uniqueTitle,
  getColumn,
  getCardByTitle,
  openCardDetails,
  saveCardEdit,
  closeAnyModal,
  expectEventuallyCardInColumn
} from './utils';

test.describe('Task Edit', () => {
  test('edits title/description/status and persists changes', async ({ page }) => {
    await gotoHome(page);

    const originalTitle = uniqueTitle('E2E Edit');
    await test.step('Create a card in To Do', async () => {
      await createCardInColumn(page, 'To Do', originalTitle, {
        status: 'To Do',
        description: 'original description'
      });
    });

    await test.step('Open card details', async () => {
      const todo = getColumn(page, 'To Do');
      const card = getCardByTitle(todo, originalTitle);
      await openCardDetails(card);
      await expect(page.locator('.kanban-detail-modal')).toBeVisible();
    });

    await test.step('Switch to edit mode and update fields', async () => {
      // Use the button in view mode to enter edit mode
      await page.getByRole('button', { name: /^Edit Card$/ }).click();

      const editForm = page.locator('form.kanban-edit-card-form');
      await expect(editForm).toBeVisible();

      const newTitle = `${originalTitle} - UPDATED`;
      await editForm.locator('input[name="feature"]').fill(newTitle);
      await editForm.locator('textarea[name="description"]').fill('updated by playwright');
      await editForm.locator('select[name="status"]').selectOption({ label: 'In Progress' });

      await saveCardEdit(page);
    });

    await test.step('Close modal and verify inline card shows new title in new column', async () => {
      await closeAnyModal(page);

      const todo = getColumn(page, 'To Do');
      await expect(todo.locator('.kanban-card', { hasText: 'UPDATED' })).toHaveCount(0);

      // Ensure it appears in In Progress
      await expectEventuallyCardInColumn(page, 'In Progress', 'UPDATED');
    });
  });
});
