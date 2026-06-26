import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, wishlistTable } from "@workspace/db";
import {
  ListWishlistResponse,
  CreateWishBody,
  CreateWishResponse,
  UpdateWishParams,
  UpdateWishBody,
  UpdateWishResponse,
  DeleteWishParams,
  ToggleWishDoneParams,
  ToggleWishDoneResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/wishlist", async (_req, res): Promise<void> => {
  const wishes = await db.select().from(wishlistTable).orderBy(desc(wishlistTable.createdAt));
  res.json(ListWishlistResponse.parse(wishes));
});

router.post("/wishlist", async (req, res): Promise<void> => {
  const parsed = CreateWishBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== null)) as any;
  const [wish] = await db.insert(wishlistTable).values(data).returning();
  res.status(201).json(CreateWishResponse.parse(wish));
});

router.patch("/wishlist/:id", async (req, res): Promise<void> => {
  const params = UpdateWishParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateWishBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== null)) as any;
  const [wish] = await db
    .update(wishlistTable)
    .set(data)
    .where(eq(wishlistTable.id, params.data.id))
    .returning();
  if (!wish) {
    res.status(404).json({ error: "Wish not found" });
    return;
  }
  res.json(UpdateWishResponse.parse(wish));
});

router.delete("/wishlist/:id", async (req, res): Promise<void> => {
  const params = DeleteWishParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [wish] = await db.delete(wishlistTable).where(eq(wishlistTable.id, params.data.id)).returning();
  if (!wish) {
    res.status(404).json({ error: "Wish not found" });
    return;
  }
  res.sendStatus(204);
});

router.patch("/wishlist/:id/toggle", async (req, res): Promise<void> => {
  const params = ToggleWishDoneParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [existing] = await db.select().from(wishlistTable).where(eq(wishlistTable.id, params.data.id));
  if (!existing) {
    res.status(404).json({ error: "Wish not found" });
    return;
  }
  const [wish] = await db
    .update(wishlistTable)
    .set({ isDone: !existing.isDone })
    .where(eq(wishlistTable.id, params.data.id))
    .returning();
  res.json(ToggleWishDoneResponse.parse(wish));
});

export default router;
