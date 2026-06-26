import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const capsulesTable = pgTable("capsules", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  message: text("message").notNull(),
  unlockAt: timestamp("unlock_at", { withTimezone: true }).notNull(),
  isUnlocked: boolean("is_unlocked").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCapsuleSchema = createInsertSchema(capsulesTable).omit({ id: true, createdAt: true, isUnlocked: true });
export type InsertCapsule = z.infer<typeof insertCapsuleSchema>;
export type Capsule = typeof capsulesTable.$inferSelect;
