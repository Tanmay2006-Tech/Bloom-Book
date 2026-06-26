import { pgTable, text, boolean, timestamp, date, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const kitchenEntriesTable = pgTable("kitchen_entries", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  type: text("type"),
  recipe: text("recipe"),
  photoUrl: text("photo_url"),
  rating: integer("rating"),
  mood: text("mood"),
  notes: text("notes"),
  wouldMakeAgain: boolean("would_make_again").notNull().default(true),
  date: date("date", { mode: "string" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertKitchenEntrySchema = createInsertSchema(kitchenEntriesTable).omit({ id: true, createdAt: true });
export type InsertKitchenEntry = z.infer<typeof insertKitchenEntrySchema>;
export type KitchenEntry = typeof kitchenEntriesTable.$inferSelect;
