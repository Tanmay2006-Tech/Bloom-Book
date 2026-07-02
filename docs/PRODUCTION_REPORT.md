# BloomBook production report

Date: 2026-07-02

## Live deployment check

The deployment at `https://bloom-book-api-server.vercel.app` returned `200 {"status":"ok"}` from `/api/healthz`, but `/api/stats` and all tested database-backed collection routes timed out without response on 2026-07-02. The repository fix adds five-second connection and ten-second query/statement deadlines and upgrades the nested Vercel package to Express 5 so async database failures reach the JSON error handler. A new `npm run smoke:live-api` command covers every endpoint family with disposable records and guaranteed cleanup.

The deployed `DATABASE_URL` must still be verified in Vercel and these changes redeployed before the live API can pass. A set-but-unreachable database URL is the most likely cause; a missing URL would have produced the application’s immediate configuration error instead of hanging.

## Outcome

BloomBook now has a standard-npm production path from the repository root and an independently installable `vercel-deploy/` path for existing Vercel projects configured with that Root Directory. Both package graphs contain npm lockfiles and neither production manifest uses workspace protocols.

## Fixes applied

- Flattened the root deployment onto npm and removed pnpm workspace metadata.
- Pointed the production client at its local generated API client instead of `@workspace/*`.
- Added Node 22-compatible root build, typecheck, preview, API smoke, and Vercel configuration.
- Added global and route-level React error recovery, Suspense fallbacks, and a safe root bootstrap.
- Lazy-loaded all routes and retained warning-free Vite output.
- Added a common 12-second API timeout, abort propagation, and bounded retries for idempotent GET requests.
- Added API body limits, generic failure responses, a JSON 404, restricted framework disclosure, CORS configuration, and defensive headers.
- Hardened Cloudinary uploads with MIME/size checks, response validation, progress, a 120-second timeout, cancellation, and recoverable missing-configuration UI.
- Added four-edge mobile safe-area handling and horizontal overflow protection.
- Removed three unused, broken generated UI modules and declared previously missing production dependencies.
- Added full architecture and launch documentation.

## Verification

- `npm install`: pass, no warnings.
- `npm run typecheck`: pass, zero TypeScript errors.
- `npm run build`: pass, zero Vite warnings.
- `npx --no-install vite build`: pass, zero Vite warnings.
- API smoke without `DATABASE_URL`: pass; health remains available and data routes fail gracefully.
- Production preview: `/` and `/wall` both return 200 and serve the built application shell.
- `npm install --prefix vercel-deploy`: pass; fixes the Vercel `EUNSUPPORTEDPROTOCOL workspace:*` failure for projects using that directory as Root Directory.

## Mobile readiness

The client is responsive, touch-oriented, webview-compatible, uses `playsInline`, provides safe-area padding, avoids horizontal page overflow, and supports upload cancellation. Median permissions and real-device scenarios are listed in the README. Real iPhone/Android certification still requires physical devices and a deployed HTTPS URL.

## Security report

Payload schemas, parameterized database access, browser output escaping, bounded request bodies, non-disclosing error responses, and security headers provide a reasonable private-app baseline. Cloudinary public values are correctly client-side; server secrets are not bundled.

Critical remaining risk: there is no authentication, authorization, or per-user ownership. The deployment must remain private or sit behind Vercel protection until those product capabilities are designed. Rate limiting, CSRF controls, retention/export/deletion, and production monitoring are also launch requirements for public users.

## Database report

The eight-table Drizzle/PostgreSQL model supports the existing sections and uses primary keys and non-null creation timestamps. It has no checked-in migration history, secondary indexes, user ownership, or database-level rating/enum constraints. Production database behavior could not be integration-tested without `DATABASE_URL`; backups and a restore drill remain operational requirements.

## Performance report

Every page is route-split into a small asynchronous chunk. The largest shared minified chunk is approximately 508 kB (165 kB gzip), with page chunks generally below 11 kB. A numerical Lighthouse score was not claimed because no instrumented browser/Lighthouse run against a deployed URL was available; the requested score must be measured after deployment on representative mobile hardware.

## Production readiness score

**82/100 for a private single-journal deployment.** Installation, compilation, build, missing-environment behavior, API smoke, deep-link serving, mobile safe areas, and failure recovery are verified. The score is intentionally capped by the absent authentication/ownership model, missing migration history, lack of live-database and Cloudinary integration credentials, and lack of real-device/Lighthouse evidence. For a public multi-user launch, treat the application as not ready until those gaps are closed.

# MEDIAN.CO MOBILE READINESS REPORT

## 1. Compatibility score

**92/100 for Median webview compatibility.** The app is designed around a 360–430 px content viewport, uses dynamic viewport units, `viewport-fit=cover`, four-edge safe-area insets, a safe bottom navigation region, 44 px coarse-pointer targets, route splitting, inline video, SPA deep-link rewrites, an offline shell, and lifecycle-aware API refresh.

## 2. Mobile risks

- Physical Median Android/iOS builds were not available in this workspace, so camera/gallery permission prompts, OS back behavior, process eviction, and vendor webview differences require final device certification.
- Cloudinary upload success requires production credentials and an unsigned preset restricted to the intended MIME types and limits.
- A force-killed webview restores the route and offline shell but not an unfinished form draft.
- The largest shared JavaScript chunk is about 510 kB minified (165 kB gzip); acceptable on modern devices, but worth monitoring on low-end Android hardware.
- Authentication remains the critical risk if the Median binary or Vercel URL is distributed beyond the intended private user.

## 3. Required fixes

No code-level blocker remains for creating a Median test build. Before store or broad distribution: configure the production database and Cloudinary preset, add access control, set Median camera/photo permissions and domain allowlists, validate Android back gestures, and run the four requested viewports plus real Samsung, Pixel, and iPhone devices against the deployed HTTPS build.

## 4. Final readiness score

**88/100 for a private Median beta; 65/100 for public distribution.** Build, API fallback, all nine deep links, offline assets, touch/safe-area CSS, retry/cancellation, and lifecycle recovery are verified locally. Scores are capped because a real Median container, production API, Cloudinary credentials, and physical devices were not available for end-to-end certification.
