# Test Execution Instructions

These tests were generated from `20251205_181513_Test_cases.csv`.

## Prerequisites

Ensure the frontend application is running. The tests are configured to point to the running environment by default, or you can set `BASE_URL`.

## Running the Tests

### 1. Run All Generated Tests
To run all tests generated from the CSV:
```bash
npx playwright test tests/kanban
```

### 2. Run by Module
You can target specific modules by folder or tag:

**By Folder:**
```bash
npx playwright test tests/kanban/Tasks
```

**By Tag:**
Each test file describes a module tagged with the module name (e.g., `@Tasks`).
```bash
npx playwright test --grep "@Tasks"
```

### 3. Run Specific Test Cases
Each test is tagged with its ID from the CSV (e.g., `TC-01`).

```bash
npx playwright test --grep "@TC-01"
```

### 4. Headed Mode
To verify visually (locally):
```bash
npx playwright test tests/kanban --headed
```
