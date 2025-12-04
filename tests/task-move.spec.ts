import { test, expect } from '@playwright/test';
import { gotoHome, createCardInColumn, uniqueTitle, dragAndDropCard, getColumn, getCardByTitle } from './utils';

test.describe('Task Move (Drag & Drop)', () => {
  test('moves a task from To Do to In Progress', async ({ page }) => {
    await gotoHome(page);

    const title = uniqueTitle('E2E Move');
    await test.step('Create a source card in To Do', async () => {
      await createCardInColumn(page, 'To Do', title, {
        status: 'To Do',
        priority: 'Low'
      });
    });

    await test.step('Drag and drop the card to In Progress', async () => {
      await dragAndDropCard(page, 'To Do', 'In Progress', title);
    });

    await test.step('Assert card is in In Progress and not in To Do', async () => {
      const inProgress = getColumn(page, 'In Progress');
      await expect(getCardByTitle(inProgress, title)).toBeVisible();

      const todo = getColumn(page, 'To Do');
      await expect(todo.locator('.kanban-card', { hasText: title })).toHaveCount(0);
    });
  });
});
