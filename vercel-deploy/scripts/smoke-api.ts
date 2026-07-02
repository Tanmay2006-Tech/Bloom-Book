import app from "../api/index";

function fail(message: string): never {
  console.error(`SMOKE FAIL: ${message}`);
  process.exit(1);
}

async function main(): Promise<void> {
  const server = app.listen(0);

  try {
    await new Promise<void>((resolve) => server.once("listening", () => resolve()));
    const addr = server.address();

    if (!addr || typeof addr === "string") {
      fail("Could not determine test server port");
    }

    const baseUrl = `http://127.0.0.1:${addr.port}`;

    const healthResponse = await fetch(`${baseUrl}/api/healthz`);
    const healthText = await healthResponse.text();

    if (healthResponse.status !== 200) {
      fail(`/api/healthz returned ${healthResponse.status}: ${healthText}`);
    }

    if (!healthText.includes('"status":"ok"')) {
      fail(`/api/healthz payload mismatch: ${healthText}`);
    }

    const statsResponse = await fetch(`${baseUrl}/api/stats`);
    const statsText = await statsResponse.text();
    const hasDatabase = Boolean(process.env.DATABASE_URL);

    if (hasDatabase && statsResponse.status !== 200) {
      fail(`/api/stats should return 200 when DATABASE_URL is set, got ${statsResponse.status}: ${statsText}`);
    }

    if (!hasDatabase && statsResponse.status !== 500) {
      fail(`/api/stats should return 500 when DATABASE_URL is missing, got ${statsResponse.status}: ${statsText}`);
    }

    if (!hasDatabase && !statsText.includes("Set DATABASE_URL")) {
      fail("/api/stats misconfiguration message did not mention DATABASE_URL");
    }

    console.log("SMOKE PASS: API health and stats checks completed");
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? `${error.message}\n${error.stack ?? ""}` : String(error);
  fail(message);
});
