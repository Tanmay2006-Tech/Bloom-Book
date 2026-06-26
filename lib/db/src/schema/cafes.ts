import { pgTable, text, boolean, timestamp, date, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const cafesTable = pgTable("cafes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  location: text("location"),
  date: date("date", { mode: "string" }),
  rating: integer("rating"),
  whatWeAte: text("what_we_ate"),
  photoUrl: text("photo_url"),
  reflection: text("reflection"),
  wouldVisitAgain: boolean("would_visit_again").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCafeSchema = createInsertSchema(cafesTable).omit({ id: true, createdAt: true });
export type InsertCafe = z.infer<typeof insertCafeSchema>;
export type Cafe = typeof cafesTable.$inferSelect;
