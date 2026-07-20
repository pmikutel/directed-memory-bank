---
title: Add pagination to users list
status: active
priority: medium
branch: feat/users-pagination
pr: 102
started: 2026-04-20
updated: 2026-04-23
---

# Add pagination to users list

## Context

`/admin/users` renders the full user list in a single HTML page. At 5k users this is already noticeably slow; customer support has flagged 10+ seconds on tenants with heavier seat counts.

## Approach

- Add cursor-based pagination to `GET /api/users/` (page size 50, cursor = last user id).
- Update the admin UI to use the new paginated response with "Load more" at the bottom.
- Keep the existing un-paginated response behind a `?legacy=1` query flag for one release cycle — internal tooling (reporting scripts) consumes it today.

## Open questions

- Should sorting move server-side? Currently the client sorts after fetch — won't work with partial pages.
- Do we keep the count? Full count is expensive; approximate is fine.

## Links

- PR: #102 (open)
- Related: `memory-bank/technical/api-standards.md` — pagination conventions
