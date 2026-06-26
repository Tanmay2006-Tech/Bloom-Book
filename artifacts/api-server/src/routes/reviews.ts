import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, reviewsTable } from "@workspace/db";
import {
  ListReviewsResponse,
  CreateReviewBody,
  CreateReviewResponse,
  GetReviewParams,
  GetReviewResponse,
  UpdateReviewParams,
  UpdateReviewBody,
  UpdateReviewResponse,
  DeleteReviewParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/reviews", async (_req, res): Promise<void> => {
  const reviews = await db.select().from(reviewsTable).orderBy(desc(reviewsTable.createdAt));
  res.json(ListReviewsResponse.parse(reviews));
});

router.post("/reviews", async (req, res): Promise<void> => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== null)) as any;
  const [review] = await db.insert(reviewsTable).values(data).returning();
  res.status(201).json(CreateReviewResponse.parse(review));
});

router.get("/reviews/:id", async (req, res): Promise<void> => {
  const params = GetReviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [review] = await db.select().from(reviewsTable).where(eq(reviewsTable.id, params.data.id));
  if (!review) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  res.json(GetReviewResponse.parse(review));
});

router.patch("/reviews/:id", async (req, res): Promise<void> => {
  const params = UpdateReviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== null)) as any;
  const [review] = await db
    .update(reviewsTable)
    .set(data)
    .where(eq(reviewsTable.id, params.data.id))
    .returning();
  if (!review) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  res.json(UpdateReviewResponse.parse(review));
});

router.delete("/reviews/:id", async (req, res): Promise<void> => {
  const params = DeleteReviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [review] = await db.delete(reviewsTable).where(eq(reviewsTable.id, params.data.id)).returning();
  if (!review) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
