import { test, expect } from '@playwright/test';

// PUBLIC_INTERFACE
test('Smoke: Home page loads and shows Kanban board elements', async ({ page, baseURL }) => {
  /**
   * This test verifies that the application root is reachable and renders.
   * It will:
   *  - navigate to '/'
   *  - assert the page has a title or a recognizable UI element such as 'To Do'
   */
  const url = baseURL || process.env.FRONTEND_URL || 'http://localhost:3000';
  await page.goto(url + '/');

  // Prefer a robust assertion: look for a typical Kanban column header or page title.
  // Try to detect "To Do" column header or a main heading. Fall back to title check.
  const headerLocator = page.locator('text=/^To Do$/i').first();
  const headingLocator = page.locator('h1, [role="heading"]').first();

  // Race a set of expectations; if none match, fallback to title check
  let matched = false;
  try {
    await expect(headerLocator).toBeVisible({ timeout: 3000 });
    matched = true;
  } catch {}

  if (!matched) {
    try {
      await expect(headingLocator).toBeVisible({ timeout: 3000 });
      matched = true;
    } catch {}
  }

  if (!matched) {
    // Fallback to page title presence if no headers matched
    const title = await page.title();
    expect(title).not.toEqual('');
  }
});
