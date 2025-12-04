import { expect, Locator, Page } from '@playwright/test';

/**
 * PUBLIC_INTERFACE
 * gotoHome
 * Navigate to the Product board page and wait for the board to be ready.
 */
export async function gotoHome(page: Page) {
  // Go to the Product route (board is under /product)
  await page.goto('/product', { waitUntil: 'domcontentloaded' });

  // Wait for the Kanban Columns list to be present
  const board = getBoard(page);
  await expect(board).toBeVisible();

  // Ensure at least one column listitem renders eventually
  await expect
    .poll(async () => await board.getByRole('listitem').count())
    .toBeGreaterThan(0);
}

/**
 * PUBLIC_INTERFACE
 * getBoard
 * Returns the main board list element (role=list, aria-label="Kanban Columns").
 */
export function getBoard(page: Page): Locator {
  return page.getByRole('list', { name: 'Kanban Columns' });
}

/**
 * PUBLIC_INTERFACE
 * getColumn
 * Return a locator for the column by its title.
 * Prefers the outer draggable wrapper with role=listitem and aria-label 'Column: <name>'.
 */
export function getColumn(page: Page, columnName: string): Locator {
  const board = getBoard(page);
  const exact = new RegExp(`^Column: ${escapeRegex(columnName)}$`, 'i');
  let col = board.getByRole('listitem', { name: exact });

  // Fallback: aria-label match
  col = col.or(board.locator(`[aria-label="Column: ${cssEscape(columnName)}"]`));

  // Fallback: find .kanban-column that has header/title text matching
  col = col.or(
    board.locator('.kanban-column').filter({
      has: page.locator('.kanban-column-title', { hasText: columnName }),
    })
  );

  return col.first();
}

/**
 * PUBLIC_INTERFACE
 * getColumnCardList
 * Returns the .kanban-card-list inside a given column wrapper.
 */
export function getColumnCardList(column: Locator): Locator {
  return column.locator('.kanban-card-list').first();
}

/**
 * PUBLIC_INTERFACE
 * getCardByTitle
 * Returns a card locator under the provided scope (page or column) matching the given title.
 */
export function getCardByTitle(scope: Page | Locator, title: string): Locator {
  const base = isLocator(scope) ? scope : scope.locator(':root');
  // Target card container by class with text matching title
  return base.locator('.kanban-card', { hasText: title }).first();
}

/**
 * PUBLIC_INTERFACE
 * openAddCardForm
 * Click the "+ Add Card" button within the provided column to open the card form.
 */
export async function openAddCardForm(column: Locator) {
  await column.getByRole('button', { name: '+ Add Card' }).click();
  // Wait for the add form to appear under this column
  await expect(column.locator('form.kanban-add-card-form')).toBeVisible();
}

/**
 * PUBLIC_INTERFACE
 * createCardInColumn
 * Create a card in the specified column, filling available fields.
 */
export async function createCardInColumn(
  page: Page,
  columnName: string,
  title: string,
  opts?: {
    description?: string;
    status?: 'To Do' | 'In Progress' | 'Review' | 'Done' | 'On Hold' | '';
    priority?: 'Low' | 'Medium' | 'High' | 'Critical' | '';
    assignee?: string;
    dueDate?: string; // yyyy-mm-dd
  }
) {
  const column = getColumn(page, columnName);
  await expect(column).toBeVisible();

  await openAddCardForm(column);

  const form = column.locator('form.kanban-add-card-form');
  await form.locator('input[name="feature"]').fill(title);
  if (opts?.assignee !== undefined) {
    await form.locator('input[name="assignee"]').fill(opts.assignee);
  }
  if (opts?.priority !== undefined) {
    await form.locator('select[name="priority"]').selectOption({ label: opts.priority || '' }).catch(() => undefined);
  }
  if (opts?.status !== undefined) {
    await form.locator('select[name="status"]').selectOption({ label: opts.status || '' }).catch(() => undefined);
  }
  if (opts?.dueDate) {
    await form.locator('input[name="due_date"]').fill(opts.dueDate);
  }
  if (opts?.description) {
    await form.locator('textarea[name="description"]').fill(opts.description);
  }

  await form.getByRole('button', { name: /^Add$/ }).click();

  // Wait until card appears in the target column
  await expectEventuallyCardInColumn(page, columnName, title);
}

/**
 * PUBLIC_INTERFACE
 * dragAndDropCard
 * Drags a card with the given title from one column to another.
 * If the target column is empty, drops onto the list container; otherwise onto the first card.
 */
export async function dragAndDropCard(
  page: Page,
  fromColumnName: string,
  toColumnName: string,
  title: string
) {
  const fromCol = getColumn(page, fromColumnName);
  const toCol = getColumn(page, toColumnName);
  await expect(fromCol).toBeVisible();
  await expect(toCol).toBeVisible();

  const card = getCardByTitle(fromCol, title);
  await expect(card).toBeVisible();

  const toColCardCount = await toCol.locator('.kanban-card').count();
  const dropTarget =
    toColCardCount > 0
      ? toCol.locator('.kanban-card').first()
      : getColumnCardList(toCol);

  // Try native drag and drop first
  await card.dragTo(dropTarget);

  // Verify move: eventually present in target and absent in source
  await expectEventuallyCardInColumn(page, toColumnName, title);
  await expect
    .poll(async () => await fromCol.locator('.kanban-card', { hasText: title }).count())
    .toBe(0);
}

/**
 * PUBLIC_INTERFACE
 * openCardDetails
 * Clicks the card to open its modal detail view.
 */
export async function openCardDetails(card: Locator) {
  // Click inner content to open the modal
  const inner = card.locator('.kanban-card-inner').first();
  await inner.click();
}

/**
 * PUBLIC_INTERFACE
 * saveCardEdit
 * Click the Save button in the edit form inside the modal.
 */
export async function saveCardEdit(page: Page) {
  const editForm = page.locator('form.kanban-edit-card-form');
  await expect(editForm).toBeVisible();
  await editForm.getByRole('button', { name: /^Save$/ }).click();
}

/**
 * PUBLIC_INTERFACE
 * closeAnyModal
 * Closes an open modal via the '×' button.
 */
export async function closeAnyModal(page: Page) {
  const closeBtn = page.locator('.kanban-modal-close').first();
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
  }
}

/**
 * PUBLIC_INTERFACE
 * waitForToast
 * Wait for a toast message to appear with the specified text.
 */
export async function waitForToast(page: Page, text: string) {
  const toast = page.locator('.kanban-toast-modal', { hasText: text });
  await expect(toast).toBeVisible();
}

/**
 * PUBLIC_INTERFACE
 * expectEventuallyCardInColumn
 * Poll until a card with the given title is present in the specified column.
 */
export async function expectEventuallyCardInColumn(
  page: Page,
  columnName: string,
  title: string
) {
  const col = getColumn(page, columnName);
  await expect
    .poll(async () => await col.locator('.kanban-card', { hasText: title }).count())
    .toBeGreaterThan(0);
}

/**
 * PUBLIC_INTERFACE
 * uniqueTitle
 * Generates a unique title for tests.
 */
export function uniqueTitle(prefix = 'E2E'): string {
  return `${prefix} ${new Date().toISOString()} ${Math.random().toString(36).slice(2, 7)}`;
}

/* ------------------------- internal helpers ------------------------- */

function isLocator(x: any): x is Locator {
  return typeof x === 'object' && typeof (x as Locator).locator === 'function';
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function cssEscape(s: string) {
  // Minimal CSS escape for use in attribute selectors
  return s.replace(/"/g, '\\"');
}
