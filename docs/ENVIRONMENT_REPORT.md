# BloomBook Environment Report

Audit date: 2026-07-02

## Variable matrix

| Variable | Used in | Required | Client/server | Notes |
| --- | --- | :---: | --- | --- |
| `DATABASE_URL` | `vercel-deploy/api/index.ts`, `drizzle.config.ts`, legacy `lib/db`, smoke scripts | Yes for all data routes/migrations | Server/CLI secret | Use Neon pooled URL with SSL; never expose through `VITE_` |
| `VITE_CLOUDINARY_CLOUD_NAME` | `vercel-deploy/src/components/file-upload.tsx` | Yes for media | Public client value | Embedded into Vite bundle |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Same upload component | Yes for media | Public client value | Must be an unsigned, tightly restricted preset |
| `CORS_ORIGIN` | `vercel-deploy/api/index.ts` | Recommended | Server | Comma-separated origins; absent currently reflects request origins |
| `SESSION_SECRET` | Example/README only | No active reader | Reserved server secret | Authentication is not implemented |
| `PORT` | `vercel-deploy/api/_server.ts`; legacy server/Vite configs | Optional | Local server/build | Local API defaults to 3001 |
| `NODE_ENV` | Vercel convention; legacy logger | Recommended in production | Server | Vite production mode is controlled by build command |
| `LOG_LEVEL` | Legacy artifact logger only | No for production | Legacy server | Production API uses console logging |
| `BASE_PATH` | Legacy artifact/mockup Vite configs | No for production | Legacy build | Production relies on Vite `BASE_URL` |
| `API_BASE_URL` | `scripts/smoke-live-api.ts` | Optional | QA CLI | Defaults to deployed BloomBook URL |
| `BASE_URL` | `App.tsx` via `import.meta.env` | Automatic | Client/Vite | Router base supplied by Vite |
| `PROD` | `main.tsx` via `import.meta.env` | Automatic | Client/Vite | Gates service-worker registration |

## File placement

### Local development

Place secrets at repository root:

```text
Bloom-Book/.env.local
```

Example:

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
VITE_CLOUDINARY_CLOUD_NAME=your-cloud
VITE_CLOUDINARY_UPLOAD_PRESET=your-restricted-unsigned-preset
CORS_ORIGIN=http://localhost:5173
SESSION_SECRET=reserved-for-future-authentication
```

Root Drizzle config explicitly loads `.env.local` followed by `.env`. Existing process variables take precedence because dotenv does not override by default. Vite reads mode-specific root environment files and only exposes variables prefixed with `VITE_`.

The checked-in `.env.production.example` is documentation only and must not contain real values. There are also legacy examples under artifact/production folders; root `.env.local` is the canonical placement for the recommended command/deployment root.

### Vercel

Configure variables in **Project Settings → Environment Variables**. Assign them separately to Production, Preview, and Development scopes.

Required production minimum:

```text
DATABASE_URL
VITE_CLOUDINARY_CLOUD_NAME
VITE_CLOUDINARY_UPLOAD_PRESET
```

Recommended:

```text
CORS_ORIGIN=https://your-canonical-domain.example
NODE_ENV=production
```

`SESSION_SECRET` has no effect until authentication/session middleware exists.

## Exposure rules

- `VITE_*` is public by design; never store API secrets or database credentials there.
- `DATABASE_URL` must exist only in local secret files, CI/Vercel secrets, or the process environment.
- The Cloudinary preset is public and therefore must enforce allowed formats, resource types, file sizes, folder, and quota controls in Cloudinary.
- Do not commit `.env.local` or `.env`; confirm ignore behavior before adding secrets. The current `.gitignore` does not explicitly list `.env*`, so operational discipline is required.

## Missing/unused configuration

- Authentication variables are incomplete because authentication itself is absent.
- No `SENTRY_DSN`, analytics, tracing, or monitoring variables exist.
- No separate database URL for migrations versus pooled runtime access is modeled; some Neon setups prefer a direct migration URL and pooled runtime URL.
- No Cloudinary API secret is needed because uploads are unsigned and direct.
- No explicit API origin is required in production because the client uses same-origin `/api`; `customFetch` can support a remote base URL but none is configured.

## Failure behavior

- Missing `DATABASE_URL`: health works; data routes return a clear 500 configuration message.
- Missing Cloudinary values: UI blocks media upload with a recoverable message; text records remain possible.
- Missing `CORS_ORIGIN`: API remains callable and reflects request origins, which is functional but permissive.
- Missing `PORT`: local API defaults to 3001.
- Missing `API_BASE_URL`: live smoke test targets the configured production URL.

## Recommended environment checklist

1. Add `.env`, `.env.local`, `.env.*.local` to `.gitignore` while keeping examples.
2. Use a pooled Neon URL for Vercel runtime and consider a direct URL for migrations.
3. Isolate Preview data from Production.
4. Restrict `CORS_ORIGIN` to known web/Median origins.
5. Restrict and monitor the unsigned Cloudinary preset.
6. Add authentication secrets only with a complete auth design.
7. Rotate any value ever exposed in logs or commits.

