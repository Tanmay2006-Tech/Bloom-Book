import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, kitchenEntriesTable } from "@workspace/db";
import {
  ListKitchenEntriesResponse,
  CreateKitchenEntryBody,
  CreateKitchenEntryResponse,
  GetKitchenEntryParams,
  GetKitchenEntryResponse,
  UpdateKitchenEntryParams,
  UpdateKitchenEntryBody,
  UpdateKitchenEntryResponse,
  DeleteKitchenEntryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/kitchen", async (req, res): Promise<void> => {
  const { type } = req.query as { type?: string };
  const entries = await db.select().from(kitchenEntriesTable).orderBy(desc(kitchenEntriesTable.createdAt));
  const filtered = type ? entries.filter((e) => e.type === type) : entries;
  res.json(ListKitchenEntriesResponse.parse(filtered));
});

router.post("/kitchen", async (req, res): Promise<void> => {
  const parsed = CreateKitchenEntryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== null)) as any;
  const [entry] = await db.insert(kitchenEntriesTable).values(data).returning();
  res.status(201).json(CreateKitchenEntryResponse.parse(entry));
});

router.get("/kitchen/:id", async (req, res): Promise<void> => {
  const params = GetKitchenEntryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [entry] = await db.select().from(kitchenEntriesTable).where(eq(kitchenEntriesTable.id, params.data.id));
  if (!entry) {
    res.status(404).json({ error: "Kitchen entry not found" });
    return;
  }
  res.json(GetKitchenEntryResponse.parse(entry));
});

router.patch("/kitchen/:id", async (req, res): Promise<void> => {
  const params = UpdateKitchenEntryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateKitchenEntryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== null)) as any;
  const [entry] = await db
    .update(kitchenEntriesTable)
    .set(data)
    .where(eq(kitchenEntriesTable.id, params.data.id))
    .returning();
  if (!entry) {
    res.status(404).json({ error: "Kitchen entry not found" });
    return;
  }
  res.json(UpdateKitchenEntryResponse.parse(entry));
});

router.delete("/kitchen/:id", async (req, res): Promise<void> => {
  const params = DeleteKitchenEntryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [entry] = await db.delete(kitchenEntriesTable).where(eq(kitchenEntriesTable.id, params.data.id)).returning();
  if (!entry) {
    res.status(404).json({ error: "Kitchen entry not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
