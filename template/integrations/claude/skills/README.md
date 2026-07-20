# Claude Code skills — operation-scoped routing

Each skill in this directory is **routing only**: frontmatter + a short list of memory-bank files to load. The knowledge itself lives in `memory-bank/`.

To install:

```
cp -r template/integrations/claude/skills/* your-project/.claude/skills/
```

Then customise the file lists to match what your project actually has in `memory-bank/`. Use `memory-bank/_index.md` as the inventory of what exists.

## What's here

| Skill | Triggers when | Loads |
|---|---|---|
| `backend-work/` | Starting / continuing backend code changes | Backend-relevant memory-bank files |
| `frontend-work/` | Starting / continuing frontend code changes | Frontend-relevant memory-bank files |
| `migration-preview/` | Reviewing or writing a database migration | Domain + architecture + stack files |
| `quality-gate-local/` | Before commit / before opening a PR | Quality / testing / stack files |
| `memory-bank-writer/` | Updating files in `memory-bank/` | `project/doc-guide.md` + `_index.md` + `tasks/process.md` |

Each skill is ≤20 lines. If a skill grows beyond routing, the new content belongs in `memory-bank/`, not in the skill.

When you add or rename a memory-bank file, update `_index.md` first (the inventory), then update any skill that should reference the new file. See `docs/integration-architecture.md` for the broader integration-layer model.
