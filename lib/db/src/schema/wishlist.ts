import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const wishlistTable = pgTable("wishlist", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  emoji: text("emoji"),
  title: text("title").notNull(),
  notes: text("notes"),
  isDone: boolean("is_done").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertWishSchema = createInsertSchema(wishlistTable).omit({ id: true, createdAt: true });
export type InsertWish = z.infer<typeof insertWishSchema>;
export type Wish = typeof wishlistTable.$inferSelect;
