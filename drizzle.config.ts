import { config as loadEnv } from "dotenv";
import { defineConfig } from "drizzle-kit";

loadEnv({ path: [".env.local", ".env"], quiet: true });

const databaseUrl = process.env.DATABASE_URL?.trim();
const requiresDatabase = process.argv.some((argument) => /(?:push|migrate|studio)$/i.test(argument));

if (!databaseUrl && requiresDatabase) {
  throw new Error(
    "DATABASE_URL is required. Set it in the shell, .env.local, or .env before running a database command.",
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/src/schema/index.ts",
  out: "./drizzle",
  dbCredentials: databaseUrl ? { url: databaseUrl } : undefined,
  migrations: {
    schema: "public",
    table: "__drizzle_migrations",
  },
  strict: true,
  verbose: true,
});
