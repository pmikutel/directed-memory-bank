---
description: Area-scoped routing for [AREA_NAME] (e.g. backend, frontend, migrations)
paths:
  - "[AREA_GLOB]/**"
---

# [AREA_NAME] — Claude Code path-scoped rule

> **Where to put this**: `.claude/rules/<area-name>.md`.
> **Why path-scoped**: Claude loads this rule automatically when files matching `paths:` are in scope. Sits alongside skills as a tier-2 mechanism — skills trigger on user *intent*, path-scoped rules trigger on file *paths*. Pick the trigger that matches the operation's natural shape.
> **Keep it thin**: this rule is a pointer, not a knowledge dump. The full knowledge lives in `memory-bank/`.

---

## When this applies

When editing files matching `paths:` above (typically `[AREA_GLOB]/**`).

## Load this context

Load these memory-bank files when this rule fires:

- `memory-bank/project/brief.md`
- `memory-bank/technical/stack.md`
- `memory-bank/technical/[area-file].md` (if present)
- `memory-bank/technical/quality.md` (if present)

> **Authoring note** (delete after customising): consult `memory-bank/_index.md` to see what else exists in this project's DMB and adjust the list above. `_index.md` is the inventory; this rule names the files directly.

## Critical reminders for this area

> Two or three lines maximum — only the gotchas a fresh session would miss. Examples:
> - "Never run migrations against production without a backup snapshot."
> - "All API responses must use the shared error envelope in `backend/api/errors.py`."
> - "Tests in this area mock the payment provider; do not call it for real."

## In-flight scratchpads

If `memory-bank/tasks/work/` contains a file whose `branch:` matches the current branch, prefer it as live context. Otherwise skip.

---

**Do not duplicate architecture or domain knowledge here.** When you find yourself wanting to, add or update the relevant file in `memory-bank/` and link to it instead. See `docs/what-goes-where.md` for the rule.
