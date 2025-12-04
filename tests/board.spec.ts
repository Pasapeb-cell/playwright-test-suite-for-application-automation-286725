import { test, expect } from '@playwright/test';
import { gotoHome, getBoard, getColumn } from './utils';

test.describe('Board: initial render and structure', () => {
  test('renders Kanban board with standard columns and shows status counts', async ({ page }) => {
    await test.step('Navigate to product board', async () => {
      await gotoHome(page);
    });

    await test.step('Verify board container is present', async () => {
      await expect(getBoard(page)).toBeVisible();
    });

    await test.step('Verify standard columns are present', async () => {
      await expect(getColumn(page, 'To Do')).toBeVisible();
      await expect(getColumn(page, 'In Progress')).toBeVisible();
      await expect(getColumn(page, 'Done')).toBeVisible();
    });

    await test.step('Verify status summary counters render numeric values', async () => {
      const summary = page.getByRole('region', { name: 'Live status summary' });
      await expect(summary).toBeVisible();

      const chips = summary.locator('.status-chip');
      await expect(chips).toHaveCount(4);

      const counts = summary.locator('.status-count');
      await expect(counts.nth(0)).toHaveText(/\d+/); // To Do
      await expect(counts.nth(1)).toHaveText(/\d+/); // In Progress
      await expect(counts.nth(2)).toHaveText(/\d+/); // Done
      await expect(counts.nth(3)).toHaveText(/\d+/); // On Hold
    });
  });
});
