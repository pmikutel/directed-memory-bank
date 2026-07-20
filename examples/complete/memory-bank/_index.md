# AI Context Discovery Map — BookShelf

**Purpose**: inventory of what's in this `memory-bank/` and which files matter for which kind of work.

> This is a *filled* `_index.md` for the fictional BookShelf app — an example of what the manifest looks like once a real project owns it. For the canonical, fully-annotated template (roles, entry points, loading rules), see `template/memory-bank/_index.md` in the upstream DMB repo.

---

## Directory

### `project/` — project identity (slow-changing)

- `brief.md` — 30-second understanding of BookShelf. **Load first, for every operation.**
- `domain.md` — books, shelves, reading progress, reviews, follows — entities and rules.
- `vision.md` — problem space, target readers, product direction.

### `technical/` — technical knowledge (medium-changing)

- `stack.md` — Django/DRF + React/TS + PostgreSQL/Redis, critical warnings, decisions.
- `architecture.md` — service layout, API design, data flow, key patterns.

### `tasks/` — RAM layer (fast-changing)

- `process.md` — how the `work/`+`log/` scratchpad is maintained (and archived by CI).
- `work/` — in-flight topics. Currently: `add-pagination-to-users-list.md` (active, PR #102), `investigate-slow-dashboard.md` (idea).
- `log/` — completed work, one file per merged PR. Currently: `pr-101-add-user-export.md`.

---

## Context loading rules

### Always load

- `project/brief.md` — project overview.
- Glance at `tasks/work/` to see what's in flight.

### Operation-specific

- **DEVELOPMENT** (feature/bug) → `technical/stack.md`, `technical/architecture.md` if design changes.
- **BUSINESS / DOMAIN** → `project/domain.md`, `project/vision.md`.
- **DATABASE** → `technical/architecture.md`, `project/domain.md`.
- **DEBUGGING** → `technical/stack.md`, `technical/architecture.md`, recent `tasks/log/` entries.

Start narrow, expand on demand. Skip files unrelated to what you're doing.
