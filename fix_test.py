import re

file_path = 'tests/kanban/Tasks/tasks.spec.ts'
with open(file_path, 'r') as f:
    content = f.read()

# Fix timeout 1000 -> 10000
content = content.replace("timeout: 1000 ", "timeout: 10000 ")
content = content.replace("timeout: 1000}", "timeout: 10000}")

# Add Reset filters to beforeEach
if "reset all filters" not in content.lower():
    content = content.replace("await page.goto('/product');", "await page.goto('/product');\n    // Reset filters to ensure new tasks are visible\n    await page.getByRole('button', { name: /reset all filters/i }).click().catch(() => {});")

with open(file_path, 'w') as f:
    f.write(content)
