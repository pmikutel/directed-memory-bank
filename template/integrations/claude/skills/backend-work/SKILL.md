---
name: backend-work
description: Use when starting or continuing backend code changes — server, API, database access, business logic on the server side
---

# backend-work

Routing skill for backend code work. Loads the memory-bank files relevant for backend changes.

Load:

- `memory-bank/project/brief.md`
- `memory-bank/technical/stack.md`
- `memory-bank/technical/backend.md` (if present)
- `memory-bank/technical/api-standards.md` (if present)
- `memory-bank/technical/quality.md` (if present)

If a `memory-bank/tasks/work/*.md` file has `branch:` matching the current git branch, also load it.

No knowledge in this file — the listed files are the source. `memory-bank/_index.md` is the inventory if you need to discover what else exists.
