# AGENTS.md — Codex CLI Session Essentials

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
- Operation-scoped routing lives in `.agents/skills/` (enable with `codex --enable skills`) — let the relevant skill fire and load the memory-bank files it names
- Read `memory-bank/_index.md` when you need to discover what knowledge exists in this project

## Current Work

The `memory-bank/tasks/` layer is an **optional scratchpad** — not a task manager. See if anything relevant exists before starting work; don't force-create files that won't be useful.

- In-flight topics (if any): glance at `memory-bank/tasks/work/` (one file per topic)
- Completed units of work (history / debugging context): `memory-bank/tasks/log/` (one file per merged PR)
- Update process: `memory-bank/tasks/process.md`

## Context Discovery

Codex walks the `AGENTS.md` hierarchy automatically (root → ancestors → CWD). Nested `AGENTS.md` files in subdirectories carry area-specific routing; this root file carries the project-wide essentials.

When you need to discover what memory-bank files exist, read `memory-bank/_index.md` (the inventory).

## Where docs go

- Code-context docs (architecture, domain, conventions): `memory-bank/`
- Setup / run commands: `README.md`
- Docs for readers outside this codebase: external-docs folder (check repo conventions)

Default on ambiguity: memory-bank.

**Writing into memory-bank/**: follow `memory-bank/project/doc-guide.md` — style, length, and hygiene rules. Required reading before any memory-bank edit. The `memory-bank-writer` skill loads it automatically when skills are enabled.
