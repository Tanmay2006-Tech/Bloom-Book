# BloomBook

BloomBook is a mobile-first personal memory journal built with React 19, Vite, Express, Drizzle, PostgreSQL, and Cloudinary. The production app installs and deploys from the repository root with standard npm.

The detailed architecture, API, database, dependency, and user-flow audit is in [`docs/ARCHITECTURE_AUDIT.md`](docs/ARCHITECTURE_AUDIT.md).

## Local development

Requirements: Node.js 22 and npm 10 or newer.

```bash
npm install
copy .env.production.example .env.local
npm run dev
```

The Vite client runs on `http://localhost:5173`; the local API runs on `http://localhost:3001`. Before a release, run:

```bash
npm run typecheck
npm run build
npm run smoke:api
```

`npm run smoke:api` deliberately passes without database credentials only when the health route remains available and data routes return a clear configuration error.

## Environment variables

- `DATABASE_URL` (required): pooled PostgreSQL connection string. Use the provider's SSL-enabled production URL.
- `SESSION_SECRET` (reserved): at least 32 random bytes for the authentication layer. The current single-journal release has no login/session feature and does not read this value yet.
- `VITE_CLOUDINARY_CLOUD_NAME` (required for media): public Cloudinary cloud name.
- `VITE_CLOUDINARY_UPLOAD_PRESET` (required for media): unsigned preset restricted by MIME type, size, folder, and allowed formats in Cloudinary.
- `CORS_ORIGIN` (recommended): comma-separated trusted web origins. If omitted, the API reflects the request origin for webview compatibility.
- `NODE_ENV`: set to `production` in production.

Never put database passwords, API secrets, or signed Cloudinary credentials in a `VITE_` variable; Vite variables are public browser configuration. Missing media variables show a recoverable message and do not prevent text memories from being saved. Missing `DATABASE_URL` leaves `/api/healthz` operational and returns a clear error from data routes.

## Vercel deployment

1. Import this repository into Vercel and keep the Root Directory at the repository root.
2. Select Node.js 22. `vercel.json` supplies `npm run build` and `vercel-deploy/dist`.
3. Add `DATABASE_URL`, `SESSION_SECRET`, `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`, `CORS_ORIGIN`, and `NODE_ENV=production` to Production and Preview as appropriate.
4. Provision the database schema before directing users to the deployment.
5. Deploy, then verify `/api/healthz`, create/read/delete one disposable record, upload one image and one video, refresh a deep link, and run the mobile checks below.

## Median.co packaging

1. Complete the Vercel deployment and use its canonical HTTPS URL as the Median app URL.
2. Enable iOS photo-library/camera and Android camera/media permissions. Microphone and location are not required.
3. Keep external navigation inside an allowlist containing the Vercel domain and `api.cloudinary.com`.
4. Enable pull-to-refresh only if it does not conflict with journal scrolling. Preserve cookies and DOM storage.
5. Use the light status bar/theme color `#FFF8F0`; the client accounts for all four safe-area insets.
6. Test camera/gallery selection, a 100 MB video, cancellation, offline recovery, keyboard drawers, back navigation, notches, Dynamic Island, and Android system navigation on real devices.

## Production launch checklist

- [ ] `npm install`, `npm run build`, and `npx vite build` pass from a clean checkout on Node 22.
- [ ] Database schema, backups, restore drill, pooling, and provider alerts are configured.
- [ ] Cloudinary preset is unsigned but tightly restricted; upload quota alerts are enabled.
- [ ] A private access layer or authentication is enabled before sharing the URL beyond its intended recipient.
- [ ] Vercel preview and production environment variables are independently verified.
- [ ] CRUD and API failure paths are tested against the production database.
- [ ] iPhone and Android real-device smoke tests pass in Median.
- [ ] Privacy policy, data export, and deletion procedure are documented for real users.
- [ ] Error monitoring and uptime monitoring are connected.

## Current security boundary

The API validates payload shape, uses parameterized Drizzle queries, limits JSON bodies, suppresses framework disclosure, adds defensive response headers, and returns generic internal errors. React escapes displayed text. However, the current data model is a single shared journal and has no authentication or per-user ownership. Do not expose it as a public multi-user service until authentication, authorization, ownership columns, rate limiting, and CSRF protection are implemented.

