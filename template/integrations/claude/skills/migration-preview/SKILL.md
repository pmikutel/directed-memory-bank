---
name: migration-preview
description: Use when reviewing or writing a database migration, schema change, or data backfill — anything that alters durable data shape
---

# migration-preview

Routing skill for database migration work. Loads the memory-bank files relevant for schema changes and data backfills.

Load:

- `memory-bank/project/brief.md`
- `memory-bank/technical/architecture.md`
- `memory-bank/project/domain.md`
- `memory-bank/technical/stack.md` (for migration tooling and conventions)

Reminder: schema changes touch durable state. Confirm the migration is reversible (or that irreversibility is intentional and documented) before applying. See `docs/automation-patterns.md` if a bot will write the migration log entry.

No knowledge in this file — the listed files are the source. `memory-bank/_index.md` is the inventory if you need to discover what else exists.
