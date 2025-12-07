import os

path = 'tests/kanban/Tasks/tasks.spec.ts'
with open(path, 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "await expect(page.locator('.kanban-card', { hasText: taskTitle })).toBeVisible({ timeout: 10000 });" in line:
        new_lines.append("      await page.reload();\n")
    new_lines.append(line)

with open(path, 'w') as f:
    f.writelines(new_lines)
