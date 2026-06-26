import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, memoriesTable } from "@workspace/db";
import {
  ListMemoriesResponse,
  CreateMemoryBody,
  CreateMemoryResponse,
  GetMemoryParams,
  GetMemoryResponse,
  UpdateMemoryParams,
  UpdateMemoryBody,
  UpdateMemoryResponse,
  DeleteMemoryParams,
  ToggleMemoryFavoriteParams,
  ToggleMemoryFavoriteResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/memories", async (req, res): Promise<void> => {
  const { favorite, search } = req.query as { favorite?: string; search?: string };
  let query = db.select().from(memoriesTable).orderBy(desc(memoriesTable.createdAt));
  const rows = await query;
  let filtered = rows;
  if (favorite === "true") {
    filtered = filtered.filter((r) => r.isFavorite);
  }
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(s) ||
        (r.description && r.description.toLowerCase().includes(s))
    );
  }
  res.json(ListMemoriesResponse.parse(filtered));
});

router.post("/memories", async (req, res): Promise<void> => {
  const parsed = CreateMemoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== null)) as any;
  const [memory] = await db.insert(memoriesTable).values(data).returning();
  res.status(201).json(CreateMemoryResponse.parse(memory));
});

router.get("/memories/:id", async (req, res): Promise<void> => {
  const params = GetMemoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [memory] = await db.select().from(memoriesTable).where(eq(memoriesTable.id, params.data.id));
  if (!memory) {
    res.status(404).json({ error: "Memory not found" });
    return;
  }
  res.json(GetMemoryResponse.parse(memory));
});

router.patch("/memories/:id", async (req, res): Promise<void> => {
  const params = UpdateMemoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateMemoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== null)) as any;
  const [memory] = await db
    .update(memoriesTable)
    .set(data)
    .where(eq(memoriesTable.id, params.data.id))
    .returning();
  if (!memory) {
    res.status(404).json({ error: "Memory not found" });
    return;
  }
  res.json(UpdateMemoryResponse.parse(memory));
});

router.delete("/memories/:id", async (req, res): Promise<void> => {
  const params = DeleteMemoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [memory] = await db.delete(memoriesTable).where(eq(memoriesTable.id, params.data.id)).returning();
  if (!memory) {
    res.status(404).json({ error: "Memory not found" });
    return;
  }
  res.sendStatus(204);
});

router.patch("/memories/:id/favorite", async (req, res): Promise<void> => {
  const params = ToggleMemoryFavoriteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [existing] = await db.select().from(memoriesTable).where(eq(memoriesTable.id, params.data.id));
  if (!existing) {
    res.status(404).json({ error: "Memory not found" });
    return;
  }
  const [memory] = await db
    .update(memoriesTable)
    .set({ isFavorite: !existing.isFavorite })
    .where(eq(memoriesTable.id, params.data.id))
    .returning();
  res.json(ToggleMemoryFavoriteResponse.parse(memory));
});

export default router;
