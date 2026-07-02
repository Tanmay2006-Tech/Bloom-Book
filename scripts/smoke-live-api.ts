const baseUrl = (process.env.API_BASE_URL ?? "https://bloom-book-api-server.vercel.app").replace(/\/$/, "");
const tag = `Codex API check ${new Date().toISOString()}`;
const created: Array<{ collection: string; id: string }> = [];

async function request(path: string, init: RequestInit = {}, expected: number[] = [200]) {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}/api${path}`, {
      ...init,
      headers: { "content-type": "application/json", ...init.headers },
      signal: AbortSignal.timeout(20_000),
    });
  } catch (error) {
    throw new Error(`${init.method ?? "GET"} ${path} did not respond within 20 seconds`, { cause: error });
  }
  const text = await response.text();
  if (!expected.includes(response.status)) {
    throw new Error(`${init.method ?? "GET"} ${path}: expected ${expected.join("/")}, received ${response.status}: ${text.slice(0, 300)}`);
  }
  return text ? JSON.parse(text) as Record<string, unknown> | Array<Record<string, unknown>> : null;
}

async function create(collection: string, body: Record<string, unknown>) {
  const row = await request(`/${collection}`, { method: "POST", body: JSON.stringify(body) }, [201]) as Record<string, unknown>;
  const id = String(row.id);
  if (!id) throw new Error(`POST /${collection} did not return an id`);
  created.push({ collection, id });
  return id;
}

async function main() {
  await request("/healthz");
  await request("/stats");
  await request("/timeline");

  const memory = await create("memories", { title: tag, description: "Disposable automated verification" });
  await request(`/memories/${memory}`);
  await request(`/memories/${memory}`, { method: "PATCH", body: JSON.stringify({ description: "Updated verification" }) });
  await request(`/memories/${memory}/favorite`, { method: "PATCH" });

  const cafe = await create("cafes", { name: tag });
  await request(`/cafes/${cafe}`);
  await request(`/cafes/${cafe}`, { method: "PATCH", body: JSON.stringify({ location: "Automated test" }) });

  const book = await create("books", { title: tag });
  await request(`/books/${book}`);
  await request(`/books/${book}`, { method: "PATCH", body: JSON.stringify({ author: "BloomBook QA" }) });

  const movie = await create("movies", { title: tag });
  await request(`/movies/${movie}`);
  await request(`/movies/${movie}`, { method: "PATCH", body: JSON.stringify({ genre: "Test" }) });

  const wish = await create("wishlist", { title: tag });
  await request(`/wishlist/${wish}`, { method: "PATCH", body: JSON.stringify({ notes: "Updated verification" }) });
  await request(`/wishlist/${wish}/toggle`, { method: "PATCH" });

  const capsule = await create("capsules", { title: tag, message: "Disposable verification", unlockAt: "2020-01-01T00:00:00.000Z" });
  await request(`/capsules/${capsule}`);
  await request(`/capsules/${capsule}/unlock`, { method: "PATCH" });

  const kitchen = await create("kitchen", { title: tag });
  await request(`/kitchen/${kitchen}`);
  await request(`/kitchen/${kitchen}`, { method: "PATCH", body: JSON.stringify({ notes: "Updated verification" }) });

  const review = await create("reviews", { subject: tag, review: "Disposable verification" });
  await request(`/reviews/${review}`);
  await request(`/reviews/${review}`, { method: "PATCH", body: JSON.stringify({ review: "Updated verification" }) });

  for (const collection of ["memories", "cafes", "books", "movies", "wishlist", "capsules", "kitchen", "reviews"]) {
    await request(`/${collection}`);
  }

  console.log(`LIVE API PASS: all endpoint families passed at ${baseUrl}`);
}

main()
  .finally(async () => {
    for (const item of created.reverse()) {
      try {
        await request(`/${item.collection}/${item.id}`, { method: "DELETE" }, [204]);
      } catch (error) {
        console.error(`Cleanup failed for ${item.collection}/${item.id}`, error);
      }
    }
  })
  .catch((error: unknown) => {
    console.error("LIVE API FAIL", error);
    process.exitCode = 1;
  });
