# BloomBook Database Report

Audit date: 2026-07-02  
Database: PostgreSQL / Neon  
ORM: Drizzle ORM  
Migration tool: Drizzle Kit

## Source of truth
  
The canonical schema is the barrel `lib/db/src/schema/index.ts`, which exports eight schema modules. Root `drizzle.config.ts` reads that barrel and generates migrations into `drizzle/`.

The old nested `lib/db/drizzle.config.ts` is deleted in the current worktree so only the root migration path remains. `lib/db/src/index.ts` is a legacy reusable pool/client, while the deployed API creates a separate pool and duplicates table definitions inline.

## Entity model

All domain tables are independent. There is no `timeline` table: timeline entries are synthesized from six tables by the API.

```mermaid
erDiagram
  MEMORIES { text id PK text title text description text media_url text media_type date date boolean is_favorite timestamptz created_at }
  CAFES { text id PK text name text location date date integer rating text what_we_ate text photo_url text reflection boolean would_visit_again timestamptz created_at }
  BOOKS { text id PK text title text author text status integer rating text quote text reflection text cover_url boolean is_stayed timestamptz created_at }
  MOVIES { text id PK text title text type text genre integer rating text what_it_reminded text poster_url timestamptz created_at }
  WISHLIST { text id PK text emoji text title text notes boolean is_done timestamptz created_at }
  CAPSULES { text id PK text title text message timestamptz unlock_at boolean is_unlocked timestamptz created_at }
  KITCHEN_ENTRIES { text id PK text title text type text recipe text photo_url integer rating text mood text notes boolean would_make_again date date timestamptz created_at }
  RANDOM_REVIEWS { text id PK text subject text category integer rating text vibe_check text review text photo_url boolean would_recommend date date timestamptz created_at }
```

## Tables

### `memories`

| Column | Type | Null/default |
| --- | --- | --- |
| `id` | text PK | application-generated UUID |
| `title` | text | required |
| `description` | text | nullable |
| `media_url` | text | nullable |
| `media_type` | text | nullable |
| `date` | date | nullable |
| `is_favorite` | boolean | required, default false |
| `created_at` | timestamptz | required, default now |

Indexes: `memories_created_at_idx`, `memories_favorite_idx`.

### `cafes`

Columns: `id` PK, required `name`, optional `location`, `date`, `rating`, `what_we_ate`, `photo_url`, `reflection`, required `would_visit_again` default true, required `created_at` default now.

Index: `cafes_created_at_idx`.

### `books`

Columns: `id` PK, required `title`, optional `author`, `status`, `rating`, `quote`, `reflection`, `cover_url`, required `is_stayed` default false, required `created_at` default now.

Indexes: `books_created_at_idx`, `books_status_idx`.

### `movies`

Columns: `id` PK, required `title`, optional `type`, `genre`, `rating`, `what_it_reminded`, `poster_url`, required `created_at` default now.

Index: `movies_created_at_idx`.

### `wishlist`

Columns: `id` PK, optional `emoji`, required `title`, optional `notes`, required `is_done` default false, required `created_at` default now.

Index: `wishlist_created_at_idx`.

### `capsules`

Columns: `id` PK, required `title`, `message`, and `unlock_at`, required `is_unlocked` default false, required `created_at` default now.

Indexes: `capsules_created_at_idx`, `capsules_unlock_at_idx`.

### `kitchen_entries`

Columns: `id` PK, required `title`, optional `type`, `recipe`, `photo_url`, `rating`, `mood`, `notes`, required `would_make_again` default true, optional `date`, required `created_at` default now.

Indexes: `kitchen_entries_created_at_idx`, `kitchen_entries_type_idx`.

### `random_reviews`

Columns: `id` PK, required `subject` and `review`, optional `category`, `rating`, `vibe_check`, `photo_url`, required `would_recommend` default true, optional `date`, required `created_at` default now.

Index: `random_reviews_created_at_idx`.

## Relationships and constraints

- No foreign keys or explicit relations.
- No user/owner column.
- No unique business constraints.
- No check constraints for ratings or enum-like fields.
- No database-side default for IDs; `$defaultFn(crypto.randomUUID)` runs in application code.
- No soft delete, updated timestamp, revision, or audit trail.
- Nullable fields can be stored, but production `stripNulls` prevents clearing a field via PATCH by sending null.

## Connection architecture

Production creates a module-level `pg.Pool` with at most five connections. Connection timeout is 5 seconds; query and statement timeouts are 10 seconds; idle connections close after 30 seconds. Drizzle wraps that pool. In a Vercel warm function instance, the module-level pool can be reused.

`lib/db/src/index.ts` creates a simpler shared pool but is used by the legacy artifact backend, not the active production API.

## Migrations

Files:

- `drizzle.config.ts`
- `drizzle/0000_mute_karen_page.sql`
- `drizzle/meta/_journal.json`
- `drizzle/meta/0000_snapshot.json`

The initial migration creates all eight tables and twelve secondary indexes. `npm run db:verify` executes the migration in embedded PGlite and confirms the expected objects.

### Neon production command

Place the Neon pooled connection string in root `.env.local`:

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
```

Then run:

```bash
npm run db:migrate
```

Applied migration history is stored in `public.__drizzle_migrations`.

### Other commands

```bash
npm run db:generate  # derive SQL after schema changes
npm run db:verify    # execute migrations locally and inspect objects
npm run db:push      # direct development/empty-database synchronization
npm run db:studio    # Drizzle Studio
```

Use migrations in production. Do not mutate Neon from every Vercel build; run migration as an explicit release step.

## Database risks

1. No ownership/multi-tenancy model.
2. Production table definitions are duplicated outside the canonical schema.
3. Weak data invariants for ratings, statuses, media types, and URLs.
4. No relationships or referential integrity.
5. No audit history or recoverable soft delete.
6. No schema for upload assets/orphan cleanup.
7. Aggregate queries load entire tables.
8. Toggle operations are not atomic.
9. Backup, point-in-time recovery, and restore drills are operational rather than repository-controlled.
10. Migration execution is manual and not enforced by a release pipeline.

