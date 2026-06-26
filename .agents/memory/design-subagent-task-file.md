---
name: Design subagent task file
description: Writing large task strings to a file avoids backtick conflicts in code_execution JavaScript template literals.
---

When launching a design subagent via `startAsyncSubagent()` in `code_execution`, the task string must NOT contain backtick characters (they conflict with the JS template literal that code_execution uses internally).

**Fix:** Write the task content to a temp file first, then read it:
```javascript
const fs = await import('fs');
const task = fs.readFileSync('.local/my_task.txt', 'utf-8');
const result = await startAsyncSubagent({ specialization: "DESIGN", task, relevantFiles: [...] });
```

**Why:** code_execution wraps code in a template literal; any backtick in the code string causes "Unexpected token" parse errors.

**How to apply:** Any large subagent task that contains code blocks (markdown backtick fences) or template literals — write to file first.
