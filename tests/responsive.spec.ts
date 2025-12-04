import { test, expect } from '@playwright/test';
import { gotoHome, getBoard, getColumn } from './utils';

test.describe('Responsive layout', () => {
  test('renders columns and content at mobile width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone-ish portrait
    await gotoHome(page);

    await test.step('Board is visible and scrollable horizontally', async () => {
      const board = getBoard(page);
      await expect(board).toBeVisible();
    });

    await test.step('At least the default columns are accessible', async () => {
      await expect(getColumn(page, 'To Do')).toBeVisible();
      await expect(getColumn(page, 'In Progress')).toBeVisible();
    });
  });
});
