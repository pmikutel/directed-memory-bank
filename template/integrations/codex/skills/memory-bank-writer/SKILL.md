---
name: memory-bank-writer
description: Use when updating files in memory-bank/ — adding new technical docs, refining domain notes, or maintaining tasks/work/ and tasks/log/
---

# memory-bank-writer

Routing skill for writes to `memory-bank/`. Loads the inventory and the RAM-layer process so the agent knows what exists and how to maintain it.

Load:

- `memory-bank/project/doc-guide.md` — **required.** Style, length, and hygiene rules for every memory-bank file.
- `memory-bank/_index.md` (the inventory — needed when authoring writes)
- `memory-bank/tasks/process.md`
- `docs/what-goes-where.md` (if this project ships the standard's docs alongside)

Rules of thumb:

- **Follow `doc-guide.md` on every write.** Length budgets, no duplication, bullets over paragraphs, reference don't copy.
- **Decision rationale lives in two places**: inline `**Why:**` in `technical/<topic>.md` (standing rule) and chronologically in `tasks/log/pr-*.md` (the moment). If a log entry's rationale recurs or becomes a coding rule, follow `tasks/process.md` → *promote durable knowledge to `technical/`*. Don't create a `decisions/` directory.
- Knowledge layer files (`project/`, `technical/`) change slowly. Update only when the underlying truth has shifted.
- When you add or rename a memory-bank file, update `_index.md` first, then update any integration-layer artefact (skill, rule, hook, `AGENTS.md`) that should reference the new file.
- `tasks/work/<slug>.md`: update frontmatter (`status`, `branch`, `updated`) as state changes. Don't fabricate scratchpads that won't be useful.
- `tasks/log/pr-<num>-<slug>.md`: typically written by automation on PR merge. Scale length to complexity (3–6 / 8–12 / 15–20 lines). Don't document routine quality checks as achievements.

No knowledge in this file — see the listed files.
