import { pgTable, text, boolean, timestamp, date, integer, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const reviewsTable = pgTable("random_reviews", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  subject: text("subject").notNull(),
  category: text("category"),
  rating: integer("rating"),
  vibeCheck: text("vibe_check"),
  review: text("review").notNull(),
  photoUrl: text("photo_url"),
  wouldRecommend: boolean("would_recommend").notNull().default(true),
  date: date("date", { mode: "string" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("random_reviews_created_at_idx").on(table.createdAt)]);

export const insertReviewSchema = createInsertSchema(reviewsTable).omit({ id: true, createdAt: true });
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviewsTable.$inferSelect;
