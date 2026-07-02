import { pgTable, text, boolean, timestamp, integer, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const booksTable = pgTable("books", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  author: text("author"),
  status: text("status"),
  rating: integer("rating"),
  quote: text("quote"),
  reflection: text("reflection"),
  coverUrl: text("cover_url"),
  isStayed: boolean("is_stayed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("books_created_at_idx").on(table.createdAt),
  index("books_status_idx").on(table.status),
]);

export const insertBookSchema = createInsertSchema(booksTable).omit({ id: true, createdAt: true });
export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof booksTable.$inferSelect;
