---
name: Drizzle-Zod boolean null
description: createInsertSchema from drizzle-zod generates boolean|null|undefined for notNull().default() columns, but Drizzle insert won't accept null for those fields.
---

When using `createInsertSchema` from drizzle-zod on a table with `.notNull().default(false)` boolean columns, the generated type includes `boolean | null | undefined`. Drizzle's `.values()` and `.set()` reject `null` with TS2769.

**Fix:** Strip nulls before passing to Drizzle and cast with `as any`:
```typescript
const data: unknown = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== null));
const [row] = await db.insert(table).values(data as any).returning();
```

**Why:** drizzle-zod's `createInsertSchema` doesn't know which fields have DB defaults, so it marks all optional booleans as nullable. The runtime null-strip handles it safely.

**How to apply:** Any route that uses `createInsertSchema` output directly with `.values()` or `.set()` — check for boolean notNull columns and apply this pattern.
