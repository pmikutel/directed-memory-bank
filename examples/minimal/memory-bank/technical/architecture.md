# Architecture

## System Overview

One Flask process, one SQLite file. No background workers, no cache, no external services.

```
client ──▶ app.py (routes) ──▶ store.py ──▶ SQLite (links table)
                   │
                   └── slug.py (generate short code on create)
```

Two request paths:

- **Create** — `POST /api/links {url, slug?}` → `store.create_link()` generates a slug (via `slug.py`) if none supplied, inserts the row, returns the short URL.
- **Resolve** — `GET /<slug>` → `store.resolve()` looks up the target, bumps the hit counter, returns a 302. Unknown slug → 404.

## Key Patterns

- **Thin routes, logic in `store.py`**: `app.py` only parses requests and shapes responses; all DB access is in `store.py` so tests can hit the store directly without a request context.
- **Slug collision retry**: `create_link()` retries generation up to 5 times on a UNIQUE constraint violation before giving up with a 500.

## Boundaries

- **App ↔ storage**: everything touching the DB goes through `store.py`. Routes never open a connection or write SQL.
- **Custom vs generated slugs**: custom slugs are validated against `^[a-zA-Z0-9_-]{3,32}$` before insert; generated ones skip validation (already safe by construction).
