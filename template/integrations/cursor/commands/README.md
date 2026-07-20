# Cursor custom slash commands

Cursor supports user-defined slash commands as plain markdown files. **No frontmatter** (key difference from Claude Code) — the filename is the command name, the file body is the prompt template.

Locations:

- **Project:** `.cursor/commands/<name>.md` — committed, shared with the team.
- **User-wide:** `~/.cursor/commands/<name>.md` — your personal commands across all projects.

To install:

```
cp -r template/integrations/cursor/commands/* your-project/.cursor/commands/
```

## What's here

| Command | Invoked as | What it does |
|---|---|---|
| `dmb-resume.md` | `/dmb-resume` | Loads DMB inventory + adoption status + project brief + active branch scratchpad |
| `dmb-status.md` | `/dmb-status` | Reports which DMB sections are filled / partial / postponed; lists current `tasks/work/` files |

## Authoring notes

Cursor commands are plain markdown — no `description:` / `globs:` / `alwaysApply:` frontmatter. The first line of the file is typically the imperative phrasing the agent should execute when the command is invoked.

Verify command format and any new placeholder syntax against the [current Cursor docs](https://cursor.com/docs/cli/reference/slash-commands) before customising.

For richer cross-tool sharing, the same memory-bank operations can also be expressed as a Cursor **skill** (in `.cursor/skills/`) or a Claude / Codex skill (in `.claude/skills/` / `.agents/skills/`). Pick the mechanism that fits the tool best — see `docs/integrations/cursor.md` for the ladder.
