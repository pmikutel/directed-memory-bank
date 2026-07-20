# Project Brief: TinyLink

> 30-second overview of the project. Always loaded by AI agents.

## What It Is

TinyLink is a self-hosted URL shortener. You POST a long URL and get back a short slug; hitting `/<slug>` 302-redirects to the original. It's a single small Flask service backed by SQLite — meant to run on one box for a team or personal use, not a public multi-tenant product.

## Key Concepts

- **Link**: a stored mapping of `slug → target URL`, with a hit counter and created-at timestamp.
- **Slug**: the short identifier in the path (`/gh2x`). Auto-generated (base62, 6 chars) unless the caller supplies a custom one.
- **Redirect**: `GET /<slug>` issues a 302 to the target and increments the hit counter.

## Repo Structure

```
tinylink/
├── app.py            # Flask app: routes + request handling
├── store.py          # SQLite access layer (create link, resolve slug, bump hits)
├── slug.py           # base62 slug generation
├── schema.sql        # single `links` table
├── templates/        # minimal HTML form + result page
└── tests/            # pytest: store + route tests
```
