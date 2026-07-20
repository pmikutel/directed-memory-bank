---
name: dmb-memory-bank
description: Use when needing to load DMB inventory and project knowledge — for a new operation, when navigating an unfamiliar area of the codebase, or before writing to memory-bank/
---

# dmb-memory-bank

Routing skill for loading DMB context on demand. Loads the inventory and project essentials so the agent knows what exists and how to navigate it.

Load:

- `memory-bank/_index.md` — the inventory of what files exist.
- `memory-bank/project/brief.md` — project overview.
- `memory-bank/project/doc-guide.md` — **required** when writing or editing any memory-bank file (style, length, hygiene rules).
- `memory-bank/tasks/process.md` — RAM-layer workflow for `tasks/work/` and `tasks/log/`.

If a `memory-bank/tasks/work/*.md` file has `branch:` matching the current git branch, also load it as live scratchpad context.

No knowledge in this file — the listed files are the source. Same `SKILL.md` format works in Claude Code (`.claude/skills/`) and Codex CLI (`.agents/skills/`); this skill is portable across tools.
