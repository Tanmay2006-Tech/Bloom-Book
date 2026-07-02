# BloomBook architecture audit

Audit date: 2026-07-02

## Architecture

BloomBook is a TypeScript monorepo whose production surface is `vercel-deploy/`. It contains a React 19/Vite 7 single-page client and a Vercel Express serverless entry. The canonical API implementation lives in `artifacts/api-server`; generated React Query clients and Zod contracts live in `lib/api-client-react` and `lib/api-zod`; PostgreSQL/Drizzle schema and connection code live in `lib/db`. `api/index.ts` bridges root-level Vercel requests to the production API.

The client uses Wouter for nine routes, TanStack Query for server state, React Hook Form for forms, and Cloudinary unsigned uploads for media. There is no authentication or user/session model in the current product: all records belong to one shared journal. This is acceptable only for a private, access-controlled deployment and is a launch risk for a public URL.

## API report

The API exposes health, aggregate stats, timeline, and CRUD routes for memories, cafes, books, movies, wishes, capsules, kitchen entries, and reviews. Requests and responses are described in `lib/api-spec/openapi.yaml`; generated Zod schemas validate route parameters, request payloads, and serialized responses. All persistence routes use Drizzle parameterized queries.

Baseline risks: async route failures rely on framework behavior instead of a single error envelope; request body size and server timeouts are not explicitly bounded; CORS is unrestricted; toggle endpoints perform read-then-write and can race; no authentication, authorization, rate limiting, or CSRF strategy exists.

## Database report

PostgreSQL is accessed through a shared `pg.Pool` and Drizzle. Eight independent tables use UUID text primary keys and timezone-aware creation timestamps. There are no foreign keys because the domain records are independent. There are no migration files, ownership columns, secondary indexes, uniqueness constraints, or archival strategy. Ratings and enum-like text values are only constrained at the API schema layer. The database module currently throws during import when `DATABASE_URL` is absent, which prevents even the health route from loading.

## Dependency report

The repository contains pnpm workspace metadata and several duplicated artifact clients. The deployed package references `@workspace/api-client-react` through `workspace:*`; the serverless bundle reaches `@workspace/db`, `@workspace/api-zod`, and the API artifact through workspace packages. This works in the pnpm workspace but is not a standalone standard-npm deployment. The production client also carries a large UI component set, while routes are eagerly imported, increasing its initial bundle.

## User-flow report

Users land on a dashboard, browse nine journal sections through the persistent layout, open a form drawer, optionally upload media, submit a record, and return to the refreshed collection. Memories can be favorited/deleted, wishes completed, and capsules unlocked. Existing UI has loading and empty states but lacks consistent query-error recovery, offline feedback, global crash recovery, and durable handling for uploads when Cloudinary is not configured.

## Baseline production blockers

1. Root install/build is pnpm-specific despite the npm requirement.
2. Missing database configuration can crash module initialization and the health endpoint.
3. No global or route-level React error recovery.
4. Network requests have no common timeout/retry policy.
5. Uploads lack size/type validation, cancellation, timeout, response-status validation, and durable fallback.
6. No authentication boundary exists; a public deployment exposes a shared writable journal.
7. Database migrations, indexes, and constraints are not represented in the repository.
8. Routes are eagerly bundled and error states are inconsistent.

