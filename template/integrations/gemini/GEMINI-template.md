# GEMINI.md — Gemini CLI Session Essentials

## Project Context

[PROJECT_NAME] ([TECH_STACK_SUMMARY])

## Essential Commands

```bash
[START_COMMAND]              # Start development
[QUALITY_COMMAND]            # Fix all quality issues
[DB_MIGRATE_COMMAND]         # Apply database changes
```

## Critical Rules

- NEVER commit without explicit permission
- ALWAYS run quality checks after changes
- Operation-specific commands live in `.gemini/commands/` — invoke via `/dmb:<name>`
- Read `memory-bank/_index.md` when you need to discover what knowledge exists

## Current Work

The `memory-bank/tasks/` layer is an **optional scratchpad** — not a task manager. See if anything relevant exists before starting work; don't force-create files that won't be useful.

- In-flight topics (if any): glance at `memory-bank/tasks/work/` (one file per topic)
- Completed units of work (history / debugging context): `memory-bank/tasks/log/` (one file per merged PR)
- Update process: `memory-bank/tasks/process.md`

## Imports

Gemini's `@path` syntax modular-loads other markdown into this prompt. Pull the DMB inventory at session start:

@memory-bank/_index.md

Add more imports as your project grows (e.g. `@memory-bank/technical/quality.md`). Use `/memory show` to inspect what's loaded; `/memory reload` to refresh after editing.

## Where docs go

- Code-context docs (architecture, domain, conventions): `memory-bank/`
- Setup / run commands: `README.md`
- Docs for readers outside this codebase: external-docs folder (check repo conventions)

Default on ambiguity: memory-bank.

**Writing into memory-bank/**: follow `memory-bank/project/doc-guide.md` — style, length, and hygiene rules. Required reading before any memory-bank edit.

---

## A note on Gemini auto-memory

Gemini CLI has a built-in `save_memory` tool that appends facts to the `## Gemini Added Memories` section of `~/.gemini/GEMINI.md` (your home directory, **not** this project). That's the **preferences layer** in DMB's three-layer model — personal corrections, workflow tweaks, things that don't belong in the shared project knowledge base.

- **Knowledge** (shared, tool-agnostic): `memory-bank/` in the project
- **Integration** (Gemini-specific): this file, `.gemini/settings.json`, `.gemini/commands/`
- **Preferences** (per-user): Gemini auto-memory in `~/.gemini/GEMINI.md`

If an auto-memory entry would help every Gemini session on this project (not just yours), promote it — move the content into this `GEMINI.md`, an area-scoped nested `GEMINI.md`, or the relevant memory-bank file.
