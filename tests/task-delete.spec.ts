import { test, expect } from '@playwright/test';
import {
  gotoHome,
  createCardInColumn,
  uniqueTitle,
  getColumn,
  getCardByTitle,
  openCardDetails,
  waitForToast
} from './utils';

test.describe('Task Delete', () => {
  test('deletes a task from its modal and shows confirmation toast', async ({ page }) => {
    await gotoHome(page);

    const title = uniqueTitle('E2E Delete');
    await createCardInColumn(page, 'To Do', title, { status: 'To Do' });

    const todo = getColumn(page, 'To Do');
    const card = getCardByTitle(todo, title);

    await test.step('Open details and initiate delete', async () => {
      await openCardDetails(card);
      await expect(page.locator('.kanban-detail-modal')).toBeVisible();

      // The delete button exists in view mode; use the first match
      await page.getByRole('button', { name: /^Delete card$/i }).first().click();
    });

    await test.step('Confirm in modal', async () => {
      const confirm = page.locator('.kanban-detail-modal', { hasText: 'Delete this card?' });
      await expect(confirm).toBeVisible();
      await confirm.getByRole('button', { name: /^Yes, Delete$/ }).click();
    });

    await test.step('Assert toast appears and card is removed from column', async () => {
      await waitForToast(page, 'Card deleted.');
      await expect(todo.locator('.kanban-card', { hasText: title })).toHaveCount(0);
    });
  });
});
