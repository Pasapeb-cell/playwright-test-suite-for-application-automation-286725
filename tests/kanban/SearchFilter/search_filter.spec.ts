/**
 * TC-18: FilterPanel Tests
 * 
 * This test suite validates the FilterPanel component's filtering functionality.
 * The FilterPanel provides structured filters for:
 * - Assignee (multi-select autocomplete)
 * - Priority (multi-select autocomplete)
 * - Status (multi-select autocomplete)
 * - Column (multi-select autocomplete)
 * - Due Date Range (date inputs)
 * 
 * Tests interact with MUI Autocomplete components and verify that:
 * 1. Filtering by status shows only matching tasks
 * 2. Filtering by column shows only tasks in that column
 * 3. Reset button clears all filters and shows all tasks
 * 
 * Selectors use accessible roles, labels, and ARIA attributes where possible.
 */

import { test, expect } from '@playwright/test';

test.describe('Search/Filter @SearchFilter', () => {

  test('TC-18: Filter tasks using FilterPanel @TC-18', async ({ page }) => {
    const timestamp = Date.now();
    
    await page.goto('/product');
    
    // Wait for the page to be ready
    await page.waitForLoadState('networkidle');
    
    await test.step('Setup: Create test columns and tasks with different statuses', async () => {
      // Ensure we have at least two columns for testing
      const columns = page.locator('.kanban-column');
      const columnCount = await columns.count();
      
      if (columnCount < 2) {
        // Create first column if needed
        const addColumnBtn = page.getByRole('button', { name: /add column/i });
        if (await addColumnBtn.count() > 0) {
          await addColumnBtn.click();
          await page.locator('input[placeholder*="column" i], input[name="title"]').first().fill(`TestCol1-${timestamp}`);
          await page.getByRole('button', { name: 'Add Column', exact: true }).click();
          await page.waitForTimeout(500);
        }
        
        // Create second column
        if (await addColumnBtn.count() > 0) {
          await addColumnBtn.click();
          await page.locator('input[placeholder*="column" i], input[name="title"]').first().fill(`TestCol2-${timestamp}`);
          await page.getByRole('button', { name: 'Add Column', exact: true }).click();
          await page.waitForTimeout(500);
        }
      }
      
      // Get references to the first two columns
      const col1 = columns.nth(0);
      const col2 = columns.nth(1);
      
      // Create Task 1 in Column 1 with "In Progress" status
      const addCardBtn1 = col1.getByRole('button', { name: /add card/i });
      await addCardBtn1.click();
      await col1.locator('input[name="feature"]').fill(`Task-InProgress-${timestamp}`);
      
      // Set status to "In Progress" in the add card form
      const statusSelect1 = col1.locator('select[name="status"]');
      if (await statusSelect1.count() > 0) {
        await statusSelect1.selectOption('In Progress');
      }
      
      await col1.getByRole('button', { name: 'Add', exact: true }).click();
      await page.waitForTimeout(800);
      
      // Create Task 2 in Column 1 with "To Do" status
      await addCardBtn1.click();
      await col1.locator('input[name="feature"]').fill(`Task-ToDo-${timestamp}`);
      
      const statusSelect2 = col1.locator('select[name="status"]');
      if (await statusSelect2.count() > 0) {
        await statusSelect2.selectOption('To Do');
      }
      
      await col1.getByRole('button', { name: 'Add', exact: true }).click();
      await page.waitForTimeout(800);
      
      // Create Task 3 in Column 2 with "Done" status
      const addCardBtn2 = col2.getByRole('button', { name: /add card/i });
      await addCardBtn2.click();
      await col2.locator('input[name="feature"]').fill(`Task-Done-${timestamp}`);
      
      const statusSelect3 = col2.locator('select[name="status"]');
      if (await statusSelect3.count() > 0) {
        await statusSelect3.selectOption('Done');
      }
      
      await col2.getByRole('button', { name: 'Add', exact: true }).click();
      await page.waitForTimeout(800);
      
      // Verify all three tasks are visible initially
      await expect(page.locator('.kanban-card').filter({ hasText: `Task-InProgress-${timestamp}` })).toBeVisible();
      await expect(page.locator('.kanban-card').filter({ hasText: `Task-ToDo-${timestamp}` })).toBeVisible();
      await expect(page.locator('.kanban-card').filter({ hasText: `Task-Done-${timestamp}` })).toBeVisible();
    });

    await test.step('Filter by Status: "In Progress"', async () => {
      // Locate the FilterPanel - it should be visible on the page
      const filterPanel = page.locator('section[aria-label*="Filter" i], form[aria-label*="Filter" i]').first();
      await expect(filterPanel).toBeVisible({ timeout: 5000 });
      
      // Find the Status autocomplete input
      // The FilterPanel uses MUI Autocomplete with a TextField that has placeholder "Status"
      const statusInput = page.locator('input[placeholder*="Status" i]').first();
      await expect(statusInput).toBeVisible();
      
      // Click to open the autocomplete dropdown
      await statusInput.click();
      await page.waitForTimeout(300);
      
      // Select "In Progress" from the dropdown options
      // MUI Autocomplete renders options in a listbox with checkboxes
      const inProgressOption = page.locator('li[role="option"]').filter({ hasText: 'In Progress' });
      await expect(inProgressOption).toBeVisible({ timeout: 3000 });
      await inProgressOption.click();
      
      // Close the dropdown by clicking outside or pressing Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      
      // Verify filtering: Only "In Progress" task should be visible
      await expect(page.locator('.kanban-card').filter({ hasText: `Task-InProgress-${timestamp}` })).toBeVisible();
      await expect(page.locator('.kanban-card').filter({ hasText: `Task-ToDo-${timestamp}` })).toBeHidden();
      await expect(page.locator('.kanban-card').filter({ hasText: `Task-Done-${timestamp}` })).toBeHidden();
      
      // Verify filter chip is displayed
      const filterChip = page.locator('.filter-chip, .MuiChip-root').filter({ hasText: 'In Progress' });
      await expect(filterChip.first()).toBeVisible();
    });

    await test.step('Clear Status filter and verify all tasks visible', async () => {
      // Click the Reset button to clear all filters
      const resetBtn = page.getByRole('button', { name: /reset/i }).filter({ hasText: /reset/i });
      await expect(resetBtn).toBeVisible();
      await resetBtn.click();
      await page.waitForTimeout(500);
      
      // Verify all three tasks are visible again
      await expect(page.locator('.kanban-card').filter({ hasText: `Task-InProgress-${timestamp}` })).toBeVisible();
      await expect(page.locator('.kanban-card').filter({ hasText: `Task-ToDo-${timestamp}` })).toBeVisible();
      await expect(page.locator('.kanban-card').filter({ hasText: `Task-Done-${timestamp}` })).toBeVisible();
    });

    await test.step('Filter by Column', async () => {
      // Get the second column's title for filtering
      const col2Title = await page.locator('.kanban-column').nth(1).locator('.column-title, h2, h3').first().textContent();
      
      if (!col2Title) {
        console.warn('Could not determine column 2 title, skipping column filter test');
        return;
      }
      
      // Find the Column autocomplete input
      const columnInput = page.locator('input[placeholder*="Column" i]').first();
      await expect(columnInput).toBeVisible();
      
      // Click to open the autocomplete dropdown
      await columnInput.click();
      await page.waitForTimeout(300);
      
      // Select the second column from the dropdown
      const columnOption = page.locator('li[role="option"]').filter({ hasText: col2Title.trim() });
      await expect(columnOption).toBeVisible({ timeout: 3000 });
      await columnOption.click();
      
      // Close the dropdown
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      
      // Verify filtering: Only tasks in column 2 should be visible
      // Task-Done is in column 2, the other two are in column 1
      await expect(page.locator('.kanban-card').filter({ hasText: `Task-Done-${timestamp}` })).toBeVisible();
      await expect(page.locator('.kanban-card').filter({ hasText: `Task-InProgress-${timestamp}` })).toBeHidden();
      await expect(page.locator('.kanban-card').filter({ hasText: `Task-ToDo-${timestamp}` })).toBeHidden();
      
      // Verify filter chip is displayed
      const filterChip = page.locator('.filter-chip, .MuiChip-root').filter({ hasText: col2Title.trim() });
      await expect(filterChip.first()).toBeVisible();
    });

    await test.step('Clear all filters and verify final state', async () => {
      // Click the Reset button to clear all filters
      const resetBtn = page.getByRole('button', { name: /reset/i }).filter({ hasText: /reset/i });
      await resetBtn.click();
      await page.waitForTimeout(500);
      
      // Verify all three tasks are visible
      await expect(page.locator('.kanban-card').filter({ hasText: `Task-InProgress-${timestamp}` })).toBeVisible();
      await expect(page.locator('.kanban-card').filter({ hasText: `Task-ToDo-${timestamp}` })).toBeVisible();
      await expect(page.locator('.kanban-card').filter({ hasText: `Task-Done-${timestamp}` })).toBeVisible();
      
      // Verify no filter chips are displayed
      const filterChips = page.locator('.filter-chip, .filter-chipbar .MuiChip-root');
      await expect(filterChips).toHaveCount(0);
    });
  });

});
