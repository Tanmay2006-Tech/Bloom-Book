import express from "express";
import cors from "cors";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import { desc, eq } from "drizzle-orm";
import {
  pgTable, text, boolean, timestamp, date, integer
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const { Pool } = pkg;

const databaseUrl = process.env.DATABASE_URL;
const pool = databaseUrl ? new Pool({ connectionString: databaseUrl }) : null;
const db = (pool ? drizzle(pool) : null) as ReturnType<typeof drizzle>;

const memoriesTable = pgTable("memories", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  mediaUrl: text("media_url"),
  mediaType: text("media_type"),
  date: date("date", { mode: "string" }),
  isFavorite: boolean("is_favorite").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

const cafesTable = pgTable("cafes", {
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

const booksTable = pgTable("books", {
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
});

const moviesTable = pgTable("movies", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  type: text("type"),
  genre: text("genre"),
  rating: integer("rating"),
  whatItReminded: text("what_it_reminded"),
  posterUrl: text("poster_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

const wishlistTable = pgTable("wishlist", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  emoji: text("emoji"),
  title: text("title").notNull(),
  notes: text("notes"),
  isDone: boolean("is_done").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

const capsulesTable = pgTable("capsules", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  message: text("message").notNull(),
  unlockAt: timestamp("unlock_at", { withTimezone: true }).notNull(),
  isUnlocked: boolean("is_unlocked").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

const kitchenEntriesTable = pgTable("kitchen_entries", {
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

const reviewsTable = pgTable("random_reviews", {
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
});

function stripNulls(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null));
}

const CreateMemoryBody = createInsertSchema(memoriesTable).omit({ id: true, createdAt: true });
const UpdateMemoryBody = createInsertSchema(memoriesTable).omit({ id: true, createdAt: true }).partial();
const CreateCafeBody = createInsertSchema(cafesTable).omit({ id: true, createdAt: true });
const UpdateCafeBody = createInsertSchema(cafesTable).omit({ id: true, createdAt: true }).partial();
const CreateBookBody = createInsertSchema(booksTable).omit({ id: true, createdAt: true });
const UpdateBookBody = createInsertSchema(booksTable).omit({ id: true, createdAt: true }).partial();
const CreateMovieBody = createInsertSchema(moviesTable).omit({ id: true, createdAt: true });
const UpdateMovieBody = createInsertSchema(moviesTable).omit({ id: true, createdAt: true }).partial();
const CreateWishBody = createInsertSchema(wishlistTable).omit({ id: true, createdAt: true });
const UpdateWishBody = createInsertSchema(wishlistTable).omit({ id: true, createdAt: true }).partial();
const CreateCapsuleBody = z.object({
  title: z.string(),
  message: z.string(),
  unlockAt: z.string(),
});
const CreateKitchenEntryBody = createInsertSchema(kitchenEntriesTable).omit({ id: true, createdAt: true });
const UpdateKitchenEntryBody = createInsertSchema(kitchenEntriesTable).omit({ id: true, createdAt: true }).partial();
const CreateReviewBody = createInsertSchema(reviewsTable).omit({ id: true, createdAt: true });
const UpdateReviewBody = createInsertSchema(reviewsTable).omit({ id: true, createdAt: true }).partial();

const app = express();
app.disable("x-powered-by");
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",").map(value => value.trim()) ?? true }));
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(self), microphone=(), geolocation=()");
  res.setHeader("Cache-Control", "no-store");
  next();
});
app.use(express.json({ limit: "1mb" }));

app.get("/api/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", (req, res, next) => {
  if (req.path === "/healthz") {
    next();
    return;
  }

  if (!databaseUrl) {
    res.status(500).json({
      error: "Server is not configured. Set DATABASE_URL in Vercel environment variables.",
    });
    return;
  }

  next();
});

app.get("/api/stats", async (_req, res) => {
  const [m, c, b, mv, k, r, w] = await Promise.all([
    db.select().from(memoriesTable),
    db.select().from(cafesTable),
    db.select().from(booksTable),
    db.select().from(moviesTable),
    db.select().from(kitchenEntriesTable),
    db.select().from(reviewsTable),
    db.select().from(wishlistTable),
  ]);
  res.json({ memories: m.length, cafes: c.length, books: b.length, movies: mv.length, kitchen: k.length, reviews: r.length, wishes: w.length });
});

app.get("/api/timeline", async (_req, res) => {
  const [memories, cafes, books, movies, kitchen, reviews] = await Promise.all([
    db.select().from(memoriesTable).orderBy(desc(memoriesTable.createdAt)).limit(6),
    db.select().from(cafesTable).orderBy(desc(cafesTable.createdAt)).limit(6),
    db.select().from(booksTable).orderBy(desc(booksTable.createdAt)).limit(6),
    db.select().from(moviesTable).orderBy(desc(moviesTable.createdAt)).limit(6),
    db.select().from(kitchenEntriesTable).orderBy(desc(kitchenEntriesTable.createdAt)).limit(6),
    db.select().from(reviewsTable).orderBy(desc(reviewsTable.createdAt)).limit(6),
  ]);
  const items = [
    ...memories.map(m => ({ id: m.id, section: "memories", title: m.title, subtitle: m.date ?? null, createdAt: m.createdAt.toISOString() })),
    ...cafes.map(c => ({ id: c.id, section: "cafes", title: c.name, subtitle: c.location ?? null, createdAt: c.createdAt.toISOString() })),
    ...books.map(b => ({ id: b.id, section: "books", title: b.title, subtitle: b.author ?? null, createdAt: b.createdAt.toISOString() })),
    ...movies.map(m => ({ id: m.id, section: "movies", title: m.title, subtitle: m.genre ?? null, createdAt: m.createdAt.toISOString() })),
    ...kitchen.map(k => ({ id: k.id, section: "kitchen", title: k.title, subtitle: k.mood ?? null, createdAt: k.createdAt.toISOString() })),
    ...reviews.map(r => ({ id: r.id, section: "reviews", title: r.subject, subtitle: r.category ?? null, createdAt: r.createdAt.toISOString() })),
  ];
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(items.slice(0, 10));
});

app.get("/api/memories", async (req, res) => {
  const { favorite, search } = req.query as Record<string, string>;
  let rows = await db.select().from(memoriesTable).orderBy(desc(memoriesTable.createdAt));
  if (favorite === "true") rows = rows.filter(r => r.isFavorite);
  if (search) { const s = search.toLowerCase(); rows = rows.filter(r => r.title.toLowerCase().includes(s) || r.description?.toLowerCase().includes(s)); }
  res.json(rows);
});
app.post("/api/memories", async (req, res) => {
  const parsed = CreateMemoryBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(memoriesTable).values(stripNulls(parsed.data as any) as any).returning();
  res.status(201).json(row);
});
app.get("/api/memories/:id", async (req, res) => {
  const [row] = await db.select().from(memoriesTable).where(eq(memoriesTable.id, req.params.id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});
app.patch("/api/memories/:id", async (req, res) => {
  const parsed = UpdateMemoryBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.update(memoriesTable).set(stripNulls(parsed.data as any) as any).where(eq(memoriesTable.id, req.params.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});
app.delete("/api/memories/:id", async (req, res) => {
  await db.delete(memoriesTable).where(eq(memoriesTable.id, req.params.id));
  res.sendStatus(204);
});
app.patch("/api/memories/:id/favorite", async (req, res) => {
  const [existing] = await db.select().from(memoriesTable).where(eq(memoriesTable.id, req.params.id));
  if (!existing) { res.status(404).json({ error: "Not found" }); return; }
  const [row] = await db.update(memoriesTable).set({ isFavorite: !existing.isFavorite }).where(eq(memoriesTable.id, req.params.id)).returning();
  res.json(row);
});

app.get("/api/cafes", async (_req, res) => {
  const rows = await db.select().from(cafesTable).orderBy(desc(cafesTable.createdAt));
  res.json(rows);
});
app.post("/api/cafes", async (req, res) => {
  const parsed = CreateCafeBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(cafesTable).values(stripNulls(parsed.data as any) as any).returning();
  res.status(201).json(row);
});
app.get("/api/cafes/:id", async (req, res) => {
  const [row] = await db.select().from(cafesTable).where(eq(cafesTable.id, req.params.id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});
app.patch("/api/cafes/:id", async (req, res) => {
  const parsed = UpdateCafeBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.update(cafesTable).set(stripNulls(parsed.data as any) as any).where(eq(cafesTable.id, req.params.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});
app.delete("/api/cafes/:id", async (req, res) => {
  await db.delete(cafesTable).where(eq(cafesTable.id, req.params.id));
  res.sendStatus(204);
});

app.get("/api/books", async (req, res) => {
  const { status } = req.query as Record<string, string>;
  let rows = await db.select().from(booksTable).orderBy(desc(booksTable.createdAt));
  if (status) rows = rows.filter(b => b.status === status);
  res.json(rows);
});
app.post("/api/books", async (req, res) => {
  const parsed = CreateBookBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(booksTable).values(stripNulls(parsed.data as any) as any).returning();
  res.status(201).json(row);
});
app.get("/api/books/:id", async (req, res) => {
  const [row] = await db.select().from(booksTable).where(eq(booksTable.id, req.params.id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});
app.patch("/api/books/:id", async (req, res) => {
  const parsed = UpdateBookBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.update(booksTable).set(stripNulls(parsed.data as any) as any).where(eq(booksTable.id, req.params.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});
app.delete("/api/books/:id", async (req, res) => {
  await db.delete(booksTable).where(eq(booksTable.id, req.params.id));
  res.sendStatus(204);
});

app.get("/api/movies", async (_req, res) => {
  const rows = await db.select().from(moviesTable).orderBy(desc(moviesTable.createdAt));
  res.json(rows);
});
app.post("/api/movies", async (req, res) => {
  const parsed = CreateMovieBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(moviesTable).values(stripNulls(parsed.data as any) as any).returning();
  res.status(201).json(row);
});
app.get("/api/movies/:id", async (req, res) => {
  const [row] = await db.select().from(moviesTable).where(eq(moviesTable.id, req.params.id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});
app.patch("/api/movies/:id", async (req, res) => {
  const parsed = UpdateMovieBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.update(moviesTable).set(stripNulls(parsed.data as any) as any).where(eq(moviesTable.id, req.params.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});
app.delete("/api/movies/:id", async (req, res) => {
  await db.delete(moviesTable).where(eq(moviesTable.id, req.params.id));
  res.sendStatus(204);
});

app.get("/api/wishlist", async (_req, res) => {
  const rows = await db.select().from(wishlistTable).orderBy(desc(wishlistTable.createdAt));
  res.json(rows);
});
app.post("/api/wishlist", async (req, res) => {
  const parsed = CreateWishBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(wishlistTable).values(stripNulls(parsed.data as any) as any).returning();
  res.status(201).json(row);
});
app.patch("/api/wishlist/:id", async (req, res) => {
  const parsed = UpdateWishBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.update(wishlistTable).set(stripNulls(parsed.data as any) as any).where(eq(wishlistTable.id, req.params.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});
app.delete("/api/wishlist/:id", async (req, res) => {
  await db.delete(wishlistTable).where(eq(wishlistTable.id, req.params.id));
  res.sendStatus(204);
});
app.patch("/api/wishlist/:id/toggle", async (req, res) => {
  const [existing] = await db.select().from(wishlistTable).where(eq(wishlistTable.id, req.params.id));
  if (!existing) { res.status(404).json({ error: "Not found" }); return; }
  const [row] = await db.update(wishlistTable).set({ isDone: !existing.isDone }).where(eq(wishlistTable.id, req.params.id)).returning();
  res.json(row);
});

app.get("/api/capsules", async (_req, res) => {
  const rows = await db.select().from(capsulesTable).orderBy(desc(capsulesTable.createdAt));
  res.json(rows.map(c => ({ ...c, unlockAt: c.unlockAt.toISOString(), createdAt: c.createdAt.toISOString() })));
});
app.post("/api/capsules", async (req, res) => {
  const parsed = CreateCapsuleBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(capsulesTable).values({ ...parsed.data, unlockAt: new Date(parsed.data.unlockAt) }).returning();
  res.status(201).json({ ...row, unlockAt: row.unlockAt.toISOString(), createdAt: row.createdAt.toISOString() });
});
app.get("/api/capsules/:id", async (req, res) => {
  const [row] = await db.select().from(capsulesTable).where(eq(capsulesTable.id, req.params.id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...row, unlockAt: row.unlockAt.toISOString(), createdAt: row.createdAt.toISOString() });
});
app.delete("/api/capsules/:id", async (req, res) => {
  await db.delete(capsulesTable).where(eq(capsulesTable.id, req.params.id));
  res.sendStatus(204);
});
app.patch("/api/capsules/:id/unlock", async (req, res) => {
  const [row] = await db.update(capsulesTable).set({ isUnlocked: true }).where(eq(capsulesTable.id, req.params.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...row, unlockAt: row.unlockAt.toISOString(), createdAt: row.createdAt.toISOString() });
});

app.get("/api/kitchen", async (req, res) => {
  const { type } = req.query as Record<string, string>;
  let rows = await db.select().from(kitchenEntriesTable).orderBy(desc(kitchenEntriesTable.createdAt));
  if (type) rows = rows.filter(k => k.type === type);
  res.json(rows);
});
app.post("/api/kitchen", async (req, res) => {
  const parsed = CreateKitchenEntryBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(kitchenEntriesTable).values(stripNulls(parsed.data as any) as any).returning();
  res.status(201).json(row);
});
app.get("/api/kitchen/:id", async (req, res) => {
  const [row] = await db.select().from(kitchenEntriesTable).where(eq(kitchenEntriesTable.id, req.params.id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});
app.patch("/api/kitchen/:id", async (req, res) => {
  const parsed = UpdateKitchenEntryBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.update(kitchenEntriesTable).set(stripNulls(parsed.data as any) as any).where(eq(kitchenEntriesTable.id, req.params.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});
app.delete("/api/kitchen/:id", async (req, res) => {
  await db.delete(kitchenEntriesTable).where(eq(kitchenEntriesTable.id, req.params.id));
  res.sendStatus(204);
});

app.get("/api/reviews", async (_req, res) => {
  const rows = await db.select().from(reviewsTable).orderBy(desc(reviewsTable.createdAt));
  res.json(rows);
});
app.post("/api/reviews", async (req, res) => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(reviewsTable).values(stripNulls(parsed.data as any) as any).returning();
  res.status(201).json(row);
});
app.get("/api/reviews/:id", async (req, res) => {
  const [row] = await db.select().from(reviewsTable).where(eq(reviewsTable.id, req.params.id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});
app.patch("/api/reviews/:id", async (req, res) => {
  const parsed = UpdateReviewBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.update(reviewsTable).set(stripNulls(parsed.data as any) as any).where(eq(reviewsTable.id, req.params.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});
app.delete("/api/reviews/:id", async (req, res) => {
  await db.delete(reviewsTable).where(eq(reviewsTable.id, req.params.id));
  res.sendStatus(204);
});

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API route not found" });
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("BloomBook API request failed", error);
  if (res.headersSent) return;
  res.status(500).json({ error: "BloomBook could not complete that request. Please try again." });
});

export default app;
