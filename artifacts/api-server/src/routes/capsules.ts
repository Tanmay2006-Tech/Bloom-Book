import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, capsulesTable } from "@workspace/db";
import {
  ListCapsulesResponse,
  CreateCapsuleBody,
  CreateCapsuleResponse,
  GetCapsuleParams,
  GetCapsuleResponse,
  DeleteCapsuleParams,
  UnlockCapsuleParams,
  UnlockCapsuleResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/capsules", async (_req, res): Promise<void> => {
  const capsules = await db.select().from(capsulesTable).orderBy(desc(capsulesTable.createdAt));
  const mapped = capsules.map((c) => ({
    ...c,
    unlockAt: c.unlockAt.toISOString(),
    createdAt: c.createdAt.toISOString(),
  }));
  res.json(ListCapsulesResponse.parse(mapped));
});

router.post("/capsules", async (req, res): Promise<void> => {
  const parsed = CreateCapsuleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [capsule] = await db
    .insert(capsulesTable)
    .values({ ...parsed.data, unlockAt: new Date(parsed.data.unlockAt) })
    .returning();
  res.status(201).json(
    CreateCapsuleResponse.parse({
      ...capsule,
      unlockAt: capsule.unlockAt.toISOString(),
      createdAt: capsule.createdAt.toISOString(),
    })
  );
});

router.get("/capsules/:id", async (req, res): Promise<void> => {
  const params = GetCapsuleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [capsule] = await db.select().from(capsulesTable).where(eq(capsulesTable.id, params.data.id));
  if (!capsule) {
    res.status(404).json({ error: "Capsule not found" });
    return;
  }
  res.json(
    GetCapsuleResponse.parse({
      ...capsule,
      unlockAt: capsule.unlockAt.toISOString(),
      createdAt: capsule.createdAt.toISOString(),
    })
  );
});

router.delete("/capsules/:id", async (req, res): Promise<void> => {
  const params = DeleteCapsuleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [capsule] = await db.delete(capsulesTable).where(eq(capsulesTable.id, params.data.id)).returning();
  if (!capsule) {
    res.status(404).json({ error: "Capsule not found" });
    return;
  }
  res.sendStatus(204);
});

router.patch("/capsules/:id/unlock", async (req, res): Promise<void> => {
  const params = UnlockCapsuleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [capsule] = await db
    .update(capsulesTable)
    .set({ isUnlocked: true })
    .where(eq(capsulesTable.id, params.data.id))
    .returning();
  if (!capsule) {
    res.status(404).json({ error: "Capsule not found" });
    return;
  }
  res.json(
    UnlockCapsuleResponse.parse({
      ...capsule,
      unlockAt: capsule.unlockAt.toISOString(),
      createdAt: capsule.createdAt.toISOString(),
    })
  );
});

export default router;
