# Codex CLI skills — operation-scoped routing

Codex Agent Skills (shipped Dec 2025, enable with `codex --enable skills`) use the same `SKILL.md` format as Claude Code skills. Each skill is **routing only**: frontmatter + a short list of memory-bank files to load. The knowledge itself lives in `memory-bank/`.

To install:

```
cp -r template/integrations/codex/skills/* your-project/.agents/skills/
```

Project location is `.agents/skills/` (not `.codex/skills/`); user-wide location is `~/.codex/skills/`. Codex walks the project tree to discover `.agents/skills/` directories.

## What's here

| Skill | Triggers when | Loads |
|---|---|---|
| `memory-bank-writer/` | Updating files in `memory-bank/` | `project/doc-guide.md` + `_index.md` + `tasks/process.md` |

Only one starter skill ships here. The same `SKILL.md` format works across Claude Code, Codex, and Gemini, so you can also copy any of the additional skills from `template/integrations/claude/skills/` (`backend-work`, `frontend-work`, `migration-preview`, `quality-gate-local`) — they work unchanged in Codex.

## Authoring notes

Each skill is ≤20 lines. If a skill grows beyond routing, the new content belongs in `memory-bank/`, not in the skill.

When you add or rename a memory-bank file, update `_index.md` first (the inventory), then update any skill that should reference the new file. See `docs/integration-architecture.md` for the broader integration-layer model.

Codex Skills are currently behind a flag — adopters need to run `codex --enable skills` (or set the equivalent in `~/.codex/config.toml`). Check current Codex docs for default-on status before relying on the skill tier for production work.
