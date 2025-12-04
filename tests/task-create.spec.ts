import { test, expect } from '@playwright/test';
import { gotoHome, getColumn, createCardInColumn, uniqueTitle, getCardByTitle } from './utils';

test.describe('Task Create', () => {
  test('adds a new task to the To Do column via add-card form', async ({ page }) => {
    await gotoHome(page);

    const title = uniqueTitle('E2E Create');
    await test.step('Open add form and create a task', async () => {
      await createCardInColumn(page, 'To Do', title, {
        description: 'Created by Playwright',
        status: 'To Do',
        priority: 'Medium',
        assignee: 'QA Bot'
      });
    });

    await test.step('Verify the new card appears in To Do', async () => {
      const todo = getColumn(page, 'To Do');
      await expect(getCardByTitle(todo, title)).toBeVisible();
    });
  });
});
