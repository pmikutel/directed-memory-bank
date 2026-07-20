# Gemini CLI custom slash commands

Gemini CLI supports user-defined slash commands as TOML files. Subdirectories create namespaces (e.g. `dmb/refresh.toml` → `/dmb:refresh`).

Locations:

- **Project:** `.gemini/commands/` — committed, shared with the team.
- **User-wide:** `~/.gemini/commands/` — your personal commands across all projects.

To install the starter set:

```
cp -r template/integrations/gemini/commands/* your-project/.gemini/commands/
```

## What's here

| Command | Invoked as | What it does |
|---|---|---|
| `dmb/refresh.toml` | `/dmb:refresh` | Reloads Gemini memory and re-reads memory-bank inventory + brief |

## Authoring notes

Each command is small — a description + a prompt template. Supported placeholders include `{{args}}`, shell injection `!{...}`, and file injection `@{...}`. Verify TOML schema against [Gemini CLI custom-commands docs](https://geminicli.com/docs/cli/custom-commands/) before customising.

If you want a more reusable bundle (commands + MCP config + GEMINI.md + tool restrictions), Gemini supports **Extensions**. See the Gemini CLI docs for the extension format — Extensions are the right path once you have more than a handful of commands.
