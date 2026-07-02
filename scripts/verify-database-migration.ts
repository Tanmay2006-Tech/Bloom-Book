import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";

const expectedTables = [
  "books",
  "cafes",
  "capsules",
  "kitchen_entries",
  "memories",
  "movies",
  "random_reviews",
  "wishlist",
];

const migrationDirectory = path.resolve("drizzle");
const migrationFiles = (await readdir(migrationDirectory))
  .filter((file) => file.endsWith(".sql"))
  .sort();

if (migrationFiles.length === 0) {
  throw new Error("No SQL migrations found. Run npm run db:generate first.");
}

const database = new PGlite();

try {
  for (const file of migrationFiles) {
    const sql = await readFile(path.join(migrationDirectory, file), "utf8");
    for (const statement of sql.split("--> statement-breakpoint")) {
      if (statement.trim()) await database.exec(statement);
    }
  }

  const result = await database.query<{ table_name: string }>(`
    select table_name
    from information_schema.tables
    where table_schema = 'public' and table_type = 'BASE TABLE'
    order by table_name
  `);
  const actualTables = result.rows.map((row) => row.table_name);
  const missing = expectedTables.filter((table) => !actualTables.includes(table));

  if (missing.length > 0) {
    throw new Error(`Migration verification failed; missing tables: ${missing.join(", ")}`);
  }

  const indexes = await database.query<{ count: string }>(`
    select count(*)::text as count
    from pg_indexes
    where schemaname = 'public' and indexname not like '%_pkey'
  `);

  console.log(
    `DATABASE MIGRATION PASS: ${expectedTables.length} tables and ${indexes.rows[0]?.count ?? "0"} secondary indexes created successfully.`,
  );
  console.log(actualTables.join(", "));
} finally {
  await database.close();
}
