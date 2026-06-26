import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, moviesTable } from "@workspace/db";
import {
  ListMoviesResponse,
  CreateMovieBody,
  CreateMovieResponse,
  GetMovieParams,
  GetMovieResponse,
  UpdateMovieParams,
  UpdateMovieBody,
  UpdateMovieResponse,
  DeleteMovieParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/movies", async (_req, res): Promise<void> => {
  const movies = await db.select().from(moviesTable).orderBy(desc(moviesTable.createdAt));
  res.json(ListMoviesResponse.parse(movies));
});

router.post("/movies", async (req, res): Promise<void> => {
  const parsed = CreateMovieBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [movie] = await db.insert(moviesTable).values(parsed.data).returning();
  res.status(201).json(CreateMovieResponse.parse(movie));
});

router.get("/movies/:id", async (req, res): Promise<void> => {
  const params = GetMovieParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [movie] = await db.select().from(moviesTable).where(eq(moviesTable.id, params.data.id));
  if (!movie) {
    res.status(404).json({ error: "Movie not found" });
    return;
  }
  res.json(GetMovieResponse.parse(movie));
});

router.patch("/movies/:id", async (req, res): Promise<void> => {
  const params = UpdateMovieParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateMovieBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [movie] = await db
    .update(moviesTable)
    .set(parsed.data)
    .where(eq(moviesTable.id, params.data.id))
    .returning();
  if (!movie) {
    res.status(404).json({ error: "Movie not found" });
    return;
  }
  res.json(UpdateMovieResponse.parse(movie));
});

router.delete("/movies/:id", async (req, res): Promise<void> => {
  const params = DeleteMovieParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [movie] = await db.delete(moviesTable).where(eq(moviesTable.id, params.data.id)).returning();
  if (!movie) {
    res.status(404).json({ error: "Movie not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
