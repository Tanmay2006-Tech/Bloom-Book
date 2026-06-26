import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, cafesTable } from "@workspace/db";
import {
  ListCafesResponse,
  CreateCafeBody,
  CreateCafeResponse,
  GetCafeParams,
  GetCafeResponse,
  UpdateCafeParams,
  UpdateCafeBody,
  UpdateCafeResponse,
  DeleteCafeParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/cafes", async (_req, res): Promise<void> => {
  const cafes = await db.select().from(cafesTable).orderBy(desc(cafesTable.createdAt));
  res.json(ListCafesResponse.parse(cafes));
});

router.post("/cafes", async (req, res): Promise<void> => {
  const parsed = CreateCafeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== null)) as any;
  const [cafe] = await db.insert(cafesTable).values(data).returning();
  res.status(201).json(CreateCafeResponse.parse(cafe));
});

router.get("/cafes/:id", async (req, res): Promise<void> => {
  const params = GetCafeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [cafe] = await db.select().from(cafesTable).where(eq(cafesTable.id, params.data.id));
  if (!cafe) {
    res.status(404).json({ error: "Cafe not found" });
    return;
  }
  res.json(GetCafeResponse.parse(cafe));
});

router.patch("/cafes/:id", async (req, res): Promise<void> => {
  const params = UpdateCafeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateCafeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== null)) as any;
  const [cafe] = await db
    .update(cafesTable)
    .set(data)
    .where(eq(cafesTable.id, params.data.id))
    .returning();
  if (!cafe) {
    res.status(404).json({ error: "Cafe not found" });
    return;
  }
  res.json(UpdateCafeResponse.parse(cafe));
});

router.delete("/cafes/:id", async (req, res): Promise<void> => {
  const params = DeleteCafeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [cafe] = await db.delete(cafesTable).where(eq(cafesTable.id, params.data.id)).returning();
  if (!cafe) {
    res.status(404).json({ error: "Cafe not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
