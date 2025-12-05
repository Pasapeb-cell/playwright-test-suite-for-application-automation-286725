# CSV Test Case Conversion Plan

## 1. CSV Analysis & Schema Inference

The provided CSV file (`20251205_181513_Test_cases.csv`) contains the following columns:

*   **ID:** Unique identifier for the test case (e.g., `TC-01`).
*   **Module:** The functional area of the application (e.g., `Board Layout`, `Columns`, `Tasks`). This is used for grouping tests into folders.
*   **Test Scenario:** A brief title/summary of what is being tested.
*   **Test Steps:** Numbered steps describing the user actions.
*   **Expected Result:** The expected outcome after performing the steps.
*   **Actual Result:** Empty in source (used for manual execution logging).
*   **Status:** Empty in source.

### Mapping Strategy

We map these fields to Playwright concepts as follows:

| CSV Field       | Playwright Mapping                                      |
| :-------------- | :------------------------------------------------------ |
| **ID**          | Included in the test title and used as a grep tag (e.g., `@TC-01`). |
| **Module**      | Used for directory structure (`tests/kanban/<Module>/`) and `describe` block titles. |
| **Test Scenario**| Used as the main test title.                            |
| **Test Steps**  | Converted into `test.step()` blocks within the test body. |
| **Expected Result**| Converted into `expect()` assertions.                   |

## 2. Conversion Plan

The test cases will be converted into the following file structure under `playwright-test-suite-for-application-automation-286725/tests/kanban/`:

1.  **BoardLayout** (`board_layout.spec.ts`): Covers TC-01.
2.  **Columns** (`columns.spec.ts`): Covers TC-02 to TC-05.
3.  **Tasks** (`tasks.spec.ts`): Covers TC-06 to TC-10.
4.  **DragAndDrop** (`drag_and_drop.spec.ts`): Covers TC-11 to TC-14.
5.  **UI_UX** (`ui_ux.spec.ts`): Covers TC-15 to TC-17.
6.  **SearchFilter** (`search_filter.spec.ts`): Covers TC-18.
7.  **Performance** (`performance.spec.ts`): Covers TC-19.
8.  **System** (`system.spec.ts`): Covers TC-20.

## 3. Execution Instructions

To execute these specific tests, you can use the standard Playwright CLI commands with the tags derived from the CSV.

### Run all Kanban CSV tests
```bash
npx playwright test tests/kanban
```

### Run a specific module
```bash
npx playwright test tests/kanban/Columns
```

### Run a specific test case by ID
```bash
npx playwright test --grep "@TC-05"
```

### Run tests for a specific module tag
```bash
npx playwright test --grep "@Columns"
```
