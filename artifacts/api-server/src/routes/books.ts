import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, booksTable } from "@workspace/db";
import {
  ListBooksResponse,
  CreateBookBody,
  CreateBookResponse,
  GetBookParams,
  GetBookResponse,
  UpdateBookParams,
  UpdateBookBody,
  UpdateBookResponse,
  DeleteBookParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/books", async (req, res): Promise<void> => {
  const { status } = req.query as { status?: string };
  const books = await db.select().from(booksTable).orderBy(desc(booksTable.createdAt));
  const filtered = status ? books.filter((b) => b.status === status) : books;
  res.json(ListBooksResponse.parse(filtered));
});

router.post("/books", async (req, res): Promise<void> => {
  const parsed = CreateBookBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== null)) as any;
  const [book] = await db.insert(booksTable).values(data).returning();
  res.status(201).json(CreateBookResponse.parse(book));
});

router.get("/books/:id", async (req, res): Promise<void> => {
  const params = GetBookParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [book] = await db.select().from(booksTable).where(eq(booksTable.id, params.data.id));
  if (!book) {
    res.status(404).json({ error: "Book not found" });
    return;
  }
  res.json(GetBookResponse.parse(book));
});

router.patch("/books/:id", async (req, res): Promise<void> => {
  const params = UpdateBookParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateBookBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== null)) as any;
  const [book] = await db
    .update(booksTable)
    .set(data)
    .where(eq(booksTable.id, params.data.id))
    .returning();
  if (!book) {
    res.status(404).json({ error: "Book not found" });
    return;
  }
  res.json(UpdateBookResponse.parse(book));
});

router.delete("/books/:id", async (req, res): Promise<void> => {
  const params = DeleteBookParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [book] = await db.delete(booksTable).where(eq(booksTable.id, params.data.id)).returning();
  if (!book) {
    res.status(404).json({ error: "Book not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
