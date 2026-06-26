import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, memoriesTable, cafesTable, booksTable, moviesTable, wishlistTable, capsulesTable, kitchenEntriesTable, reviewsTable } from "@workspace/db";
import { GetStatsResponse, GetTimelineResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const [
    memoriesRows,
    cafesRows,
    booksRows,
    moviesRows,
    kitchenRows,
    reviewsRows,
    wishesRows,
  ] = await Promise.all([
    db.select().from(memoriesTable),
    db.select().from(cafesTable),
    db.select().from(booksTable),
    db.select().from(moviesTable),
    db.select().from(kitchenEntriesTable),
    db.select().from(reviewsTable),
    db.select().from(wishlistTable),
  ]);

  res.json(
    GetStatsResponse.parse({
      memories: memoriesRows.length,
      cafes: cafesRows.length,
      books: booksRows.length,
      movies: moviesRows.length,
      kitchen: kitchenRows.length,
      reviews: reviewsRows.length,
      wishes: wishesRows.length,
    })
  );
});

router.get("/timeline", async (_req, res): Promise<void> => {
  const [memories, cafes, books, movies, kitchen, reviews] = await Promise.all([
    db.select().from(memoriesTable).orderBy(desc(memoriesTable.createdAt)).limit(6),
    db.select().from(cafesTable).orderBy(desc(cafesTable.createdAt)).limit(6),
    db.select().from(booksTable).orderBy(desc(booksTable.createdAt)).limit(6),
    db.select().from(moviesTable).orderBy(desc(moviesTable.createdAt)).limit(6),
    db.select().from(kitchenEntriesTable).orderBy(desc(kitchenEntriesTable.createdAt)).limit(6),
    db.select().from(reviewsTable).orderBy(desc(reviewsTable.createdAt)).limit(6),
  ]);

  const items = [
    ...memories.map((m) => ({
      id: m.id,
      section: "memories",
      title: m.title,
      subtitle: m.date ?? null,
      createdAt: m.createdAt.toISOString(),
    })),
    ...cafes.map((c) => ({
      id: c.id,
      section: "cafes",
      title: c.name,
      subtitle: c.location ?? null,
      createdAt: c.createdAt.toISOString(),
    })),
    ...books.map((b) => ({
      id: b.id,
      section: "books",
      title: b.title,
      subtitle: b.author ?? null,
      createdAt: b.createdAt.toISOString(),
    })),
    ...movies.map((m) => ({
      id: m.id,
      section: "movies",
      title: m.title,
      subtitle: m.genre ?? null,
      createdAt: m.createdAt.toISOString(),
    })),
    ...kitchen.map((k) => ({
      id: k.id,
      section: "kitchen",
      title: k.title,
      subtitle: k.mood ?? null,
      createdAt: k.createdAt.toISOString(),
    })),
    ...reviews.map((r) => ({
      id: r.id,
      section: "reviews",
      title: r.subject,
      subtitle: r.category ?? null,
      createdAt: r.createdAt.toISOString(),
    })),
  ];

  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json(GetTimelineResponse.parse(items.slice(0, 6)));
});

export default router;
