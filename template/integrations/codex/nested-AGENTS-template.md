# [AREA_NAME] — Codex area scope

> **Where to put this**: `[AREA_DIR]/AGENTS.md` (e.g. `backend/AGENTS.md`, `frontend/AGENTS.md`, `migrations/AGENTS.md`).
> **Why nested**: Codex walks the `AGENTS.md` chain from repo root down to CWD, concatenating each file. A nested file gives area-specific routing without polluting the root entry point. Closer files win on conflict; `AGENTS.override.md` at the same level outranks `AGENTS.md`.
> **Keep it thin**: this file is a pointer, not a knowledge dump. The full knowledge lives in `memory-bank/`.

---

## When this applies

Working on files under `[AREA_DIR]/`.

## Load this context

Load these memory-bank files when working in this area:

- `memory-bank/project/brief.md`
- `memory-bank/technical/stack.md`
- `memory-bank/technical/[area-file].md` (if present)
- `memory-bank/technical/quality.md` (if present)

> **Authoring note** (delete after customising): consult `memory-bank/_index.md` to see what else exists in this project's DMB and adjust the list above. `_index.md` is the inventory; this file names the memory-bank files directly.

## Critical reminders for this area

> Two or three lines maximum — only the gotchas a fresh session would miss. Examples:
> - "Never run migrations against production without a backup snapshot."
> - "All API responses must use the shared error envelope in `backend/api/errors.py`."
> - "Tests in this area mock the payment provider; do not call it for real."

## In-flight scratchpads

If `memory-bank/tasks/work/` contains a file whose `branch:` matches the current branch, prefer it as live context. Otherwise skip.

---

**Do not duplicate architecture or domain knowledge here.** When you find yourself wanting to, add or update the relevant file in `memory-bank/` and link to it instead. See `docs/what-goes-where.md` for the rule.
