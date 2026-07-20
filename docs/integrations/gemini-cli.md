# Integration: Gemini CLI

How to wire DMB into a Gemini CLI project.

This page lays out the **tier ladder** Gemini CLI adopters should think in: hooks first, instruction files next, slash commands as power-user supplements. Each tier serves a different role and has a different reliability profile. For the full reasoning, see [`../integration-architecture.md`](../integration-architecture.md).

> **First time setting up?** Most adopters use the AI-driven install flow. Open Gemini CLI in your project and say *"follow memory-bank/INSTALL.md to set up my DMB"*. The interview detects Gemini and offers the right integration tiers at the appropriate point. The rest of this page is the reference detail behind that flow.

---

## The ladder at a glance

| Tier | Mechanism | Where | Use for |
|---|---|---|---|
| 1 | **Hooks** | `.gemini/settings.json` (v0.26+, on by default) | Highest-stakes routing — runs as code on lifecycle events. Most reliable today. |
| 2 | **Instruction files** | `GEMINI.md` (root) + nested `backend/GEMINI.md`, plus `@imports` | Passive baseline — Gemini walks the hierarchy automatically and resolves `@path` imports. Richer than Claude's `CLAUDE.md` because of modular imports. |
| 3 | **Custom slash commands** | `.gemini/commands/<namespace>/<name>.toml` | Power-user shortcuts — user-triggered (`/dmb:refresh`), not auto-fired. Useful for explicit ops like "refresh DMB context". |

The principle: **lead with the most reliable mechanism**. Hooks first; instruction files (with imports for richer routing) second; slash commands as supplements. As reliability changes (just-in-time loading ships, slash commands gain triggers), rebalance.

In practice, most Gemini projects start with `GEMINI.md` and `@imports` (tier 2), then add `SessionStart` hooks (tier 1) for must-have preload and slash commands (tier 3) for repeat operations. That progression is fine.

---

## Tier 1 — Hooks

Gemini CLI Hooks (stable since v0.26, on by default) live in `.gemini/settings.json` (project) or `~/.gemini/settings.json` (user-wide). Hooks run as code, so they're the most reliable mechanism the harness offers.

Available events include `SessionStart`, `BeforeAgent`, `BeforeModel` / `AfterModel`, `BeforeTool` / `AfterTool`, `BeforeToolSelection`, and `SessionEnd`.

Use hooks for the things you cannot afford the agent to forget:

- **`SessionStart`** — pre-load `memory-bank/project/brief.md` and any `tasks/work/*.md` whose `branch:` matches the current git branch. stdout is prepended to the user prompt (non-interactive mode) or otherwise injected into context.
- **`BeforeTool`** — gate dangerous operations. Block `git push --force` to protected branches, refuse writes to `memory-bank/project/**` and `memory-bank/technical/**` from automation, etc.
- **`AfterTool`** — fast feedback after edits. Trigger lint or type-check; surface failures back into the session.

Reference shape: `template/integrations/gemini/settings-template.json`.

Two rules of thumb:

- **Read, don't write.** Hooks should consume memory-bank context, not modify it. Writes to `tasks/work/` and `tasks/log/` belong to the developer or to a dedicated bot identity (see [`../automation-patterns.md`](../automation-patterns.md)).
- **Verify against current Gemini docs.** Hook field names and event semantics may evolve. Cross-check against [https://geminicli.com/docs/hooks/](https://geminicli.com/docs/hooks/) before customising.

---

## Tier 2 — Instruction files

`GEMINI.md` is the passive baseline. Gemini walks the hierarchy automatically:

1. `~/.gemini/GEMINI.md` (user-wide, all projects)
2. Ancestors from repo root down to CWD — each directory may have one `GEMINI.md`
3. Subdirectory scan from CWD

Files are concatenated with every prompt. `/memory show` inspects what's loaded; `/memory reload` refreshes after editing.

What makes Gemini's instruction tier stronger than most: **`@path` modular imports.** Inside `GEMINI.md` you can write:

```
@memory-bank/_index.md
@memory-bank/project/brief.md
@memory-bank/technical/quality.md
```

Each `@import` pulls the referenced file's content into the prompt. This means `GEMINI.md` can stay short while still loading rich context — closer to a Claude Code skill's behaviour than a static instruction file.

Templates:

- **Root:** `template/integrations/gemini/GEMINI-template.md`.
- **Nested:** `template/integrations/gemini/nested-GEMINI-template.md`.

Both are pointer-only. Two or three lines of critical reminders, then a list of `@imports` or named memory-bank files. The full knowledge stays in memory-bank.

The default filename is configurable — set `context.fileName` in `settings.json` if your project uses a different convention.

---

## Tier 3 — Custom slash commands

Slash commands are TOML files declaring a description and a prompt template with placeholders (`{{args}}`, shell `!{...}`, file `@{...}`). Subdirectories create namespaces — `dmb/refresh.toml` is invoked as `/dmb:refresh`.

Reference template: `template/integrations/gemini/commands/dmb/refresh.toml`.

Locations:

- **Project:** `.gemini/commands/` — committed, shared with the team.
- **User-wide:** `~/.gemini/commands/` — personal commands across all projects.

Unlike Claude Code skills, slash commands are **user-triggered**, not auto-fired on intent. That's why they sit in tier 3 — they're supplements to hooks/instruction-files, not a replacement for either.

For a more reusable bundle (commands + MCP config + `GEMINI.md` + tool restrictions), Gemini supports **Extensions**. Worth considering once you have more than a handful of commands.

---

## Putting it together

A typical Gemini CLI project ends up with this shape:

```
.gemini/
├── settings.json                       # tier 1 — hooks + MCP config
└── commands/
    └── dmb/
        └── refresh.toml                # tier 3 — /dmb:refresh

GEMINI.md                               # tier 2 — root baseline with @imports
backend/GEMINI.md                       # tier 2 — area-scoped
frontend/GEMINI.md                      # tier 2 — area-scoped
```

All three tiers reference `memory-bank/` files directly (or via `@imports`). `_index.md` is the inventory consulted when authoring or updating any of them — not a runtime indirection they traverse. None of these files duplicate knowledge from `memory-bank/`.

---

## Auto-memory and the preferences layer

Gemini CLI has a built-in `save_memory` tool that appends facts to the `## Gemini Added Memories` section of `~/.gemini/GEMINI.md` (your home directory, **not** the project). This is the **preferences layer** in DMB's three-layer model:

- **Knowledge** (shared, tool-agnostic): `memory-bank/` in the project.
- **Integration** (Gemini-specific): `GEMINI.md`, `.gemini/settings.json`, `.gemini/commands/`.
- **Preferences** (per-user): Gemini auto-memory in `~/.gemini/GEMINI.md`.

Keep personal corrections and workflow tweaks in auto-memory. If an entry would help every Gemini session on the project (not just yours), promote it: move the content into the project's `GEMINI.md`, an area-scoped nested `GEMINI.md`, or the relevant memory-bank file.

Same framing as Cursor's auto-memory.

---

## Coexistence with Claude Code / Cursor / Codex

If your project uses multiple AI tools, memory-bank is the shared knowledge base:

- Claude Code reads memory-bank via `CLAUDE.md` + skills + hooks (`.claude/`).
- Cursor reads memory-bank via `.cursor/rules/` (path-scoped + always-on).
- Codex reads memory-bank via `AGENTS.md` + hooks (`.codex/`) + skills (`.agents/skills/`).
- Gemini reads memory-bank via `GEMINI.md` + hooks (`.gemini/`) + slash commands.

All get the same project knowledge. Tool-specific behaviour goes in tool-specific config, not memory-bank.

---

## Automation

For bot-driven writes to `tasks/work/` and `tasks/log/`, see [`../automation-patterns.md`](../automation-patterns.md). That pattern is independent of the integration ladder above — it's about *how a bot writes to memory-bank*, not how Gemini reads it.
