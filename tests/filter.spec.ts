import { test, expect } from '@playwright/test';
import {
  gotoHome,
  createCardInColumn,
  uniqueTitle,
  getCardByTitle,
  getColumn
} from './utils';

test.describe('Filter usage', () => {
  test('filters by Status and can reset filters', async ({ page }) => {
    await gotoHome(page);

    const titleA = uniqueTitle('E2E Filter A');
    const titleB = uniqueTitle('E2E Filter B');

    await test.step('Create two cards with differing statuses', async () => {
      await createCardInColumn(page, 'To Do', titleA, { status: 'To Do' });
      await createCardInColumn(page, 'In Progress', titleB, { status: 'In Progress' });
    });

    await test.step('Apply Status filter: To Do', async () => {
      // The Status filter input is an MUI Autocomplete TextField with placeholder "Status"
      const statusBox = page.getByPlaceholder('Status').first();
      await statusBox.click();
      await statusBox.fill('To Do');
      await page.getByRole('option', { name: /^To Do$/ }).click();

      // Expect the "In Progress" card to disappear from the board
      await expect(page.locator('.kanban-card', { hasText: titleB })).toHaveCount(0);
      // And the To Do card remains visible (in its column)
      const todo = getColumn(page, 'To Do');
      await expect(getCardByTitle(todo, titleA)).toBeVisible();
    });

    await test.step('Reset filters', async () => {
      await page.getByRole('button', { name: 'Reset all filters' }).click();

      // After reset, both cards should be visible again in their respective columns
      const todo = getColumn(page, 'To Do');
      const inProgress = getColumn(page, 'In Progress');

      await expect(getCardByTitle(todo, titleA)).toBeVisible();
      await expect(getCardByTitle(inProgress, titleB)).toBeVisible();
    });
  });
});
