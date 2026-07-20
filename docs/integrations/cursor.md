# Integration: Cursor

How to wire DMB into a Cursor project.

This page lays out the **four-tier ladder** Cursor adopters should think in: hooks first, then path-scoped rules, then skills / agent-requested rules, then always-on essentials as the minimum baseline. Cursor expanded its integration surface significantly in 2025–2026; if you've used DMB with an older Cursor version, the shape below is what's available today. For the full reasoning, see [`../integration-architecture.md`](../integration-architecture.md).

> **First time setting up?** Most adopters use the AI-driven install flow. Open Cursor in your project and say *"follow memory-bank/INSTALL.md to set up my DMB"*. The interview detects Cursor and offers the right tiers at the appropriate point. The rest of this page is the reference detail behind that flow.

---

## The ladder at a glance

| Tier | Mechanism | Where | Use for |
|---|---|---|---|
| 1 | **Hooks** | `.cursor/hooks.json` (GA since v1.7) | Highest-stakes routing — runs as a subprocess on lifecycle events. Most reliable today. |
| 2 | **Path-scoped rules** | `.cursor/rules/<area>.mdc` with `globs:` (Auto-Attached) | Per-area routing on file matches — strongest deterministic mechanism for "load X when editing Y". |
| 3 | **Skills / Agent-Requested rules** | `.cursor/skills/<name>/SKILL.md` + `.cursor/rules/<name>.mdc` with `description:` only | On-demand routing — the agent decides relevance from the description. Best for intent-scoped context like memory-bank entry points. |
| 4 | **Always-on essentials** | `.cursor/rules/essentials.mdc` with `alwaysApply: true` | The minimum that must always be in scope — kept deliberately tiny. |

The principle: **lead with the most reliable mechanism**. Highest-stakes routing goes in tier 1; deterministic per-area in tier 2; intent-scoped in tier 3; always-loaded minimum in tier 4. As reliability shifts (skills mature, new hook events ship), rebalance.

Two adjacent mechanisms — **custom slash commands** and native **`AGENTS.md`** — sit alongside the ladder rather than inside it; both are described below.

---

## Tier 1 — Hooks

Cursor Hooks (GA since v1.7, Oct 2025) live in `.cursor/hooks.json` (project) or `~/.cursor/hooks.json` (user). Hooks run as subprocesses communicating over stdio with JSON, so they're the most reliable mechanism the harness offers.

The `command` field accepts **any executable** — shell scripts, Python, Node / Bun, compiled binaries — invoked directly (no `bash -c` wrapper required). A per-hook `timeout` field caps execution in seconds; the default is platform-dependent, so set it explicitly if execution time matters.

Available events include `sessionStart`, `sessionEnd`, `beforeSubmitPrompt`, `preToolUse`, `postToolUse`, `beforeShellExecution`, `beforeMCPExecution`, `beforeReadFile`, `afterFileEdit`, `subagentStart` / `subagentStop`, `preCompact`, `workspaceOpen`, plus Tab-specific hooks.

Use hooks for the things you cannot afford the agent to forget:

- **`sessionStart`** — pre-load `memory-bank/project/brief.md` and any `tasks/work/*.md` whose `branch:` matches the current git branch. stdout is injected as context for the session.
- **`beforeSubmitPrompt`** — surface live in-flight work just before the user's prompt is submitted. Useful for injecting active `tasks/work/<branch>.md` without the user `@`-mentioning it.
- **`preToolUse`** — gate dangerous operations. Block writes to `memory-bank/project/**` and `memory-bank/technical/**` from automation, refuse destructive git ops, etc.
- **`afterFileEdit`** — fast feedback after edits. Trigger lint or type-check; surface failures back into the session.

Reference shape: `template/integrations/cursor/hooks.json`.

Two rules of thumb:

- **Read, don't write.** Hooks should consume memory-bank context, not modify it. Writes to `tasks/work/` and `tasks/log/` belong to the developer or to a dedicated bot identity (see [`../automation-patterns.md`](../automation-patterns.md)).
- **Verify against current Cursor docs.** Hook event names and schema may evolve. Cross-check against [https://cursor.com/docs/hooks](https://cursor.com/docs/hooks) before customising. Project-scope hooks may require team trust settings.

---

## Tier 2 — Path-scoped rules (Auto-Attached)

Each rule activates when the editor is touching files matching its `globs:`. Use one rule per area: backend, frontend, migrations, etc. Each rule names the memory-bank files relevant for that area directly.

Reference template: `template/integrations/cursor/area-rule-template.mdc`.

A typical rule:

```markdown
---
description: Backend area routing
globs:
  - "backend/**/*.py"
alwaysApply: false
---

# Backend work

Load:

- `memory-bank/project/brief.md`
- `memory-bank/technical/stack.md`
- `memory-bank/technical/backend.md` (if present)
- `memory-bank/technical/quality.md` (if present)

Critical reminders: [2–3 lines, only the gotchas].
```

Same shape as a nested Claude `CLAUDE.md` or a nested `AGENTS.md` — pointer-only, no duplicated knowledge. `_index.md` is the inventory you consult when authoring this rule, not a file the rule traverses at runtime.

Cursor 2.2 introduced rule **folders** at `.cursor/rules/<name>/` that bundle prompts and scripts together. Single-file `.mdc` continues to work and is **not deprecated** — pick what suits your project.

---

## Tier 3 — Skills and Agent-Requested rules

This tier handles **intent-scoped routing** — the agent picks what to load based on a description rather than a file path or always-on flag. Two interchangeable forms:

**Skills** — `.cursor/skills/<name>/SKILL.md`. Same frontmatter as Claude Code skills (`name:` + `description:`). Agent-triggered on demand when the description matches the current operation. Project-scoped only (no `~/.cursor/skills/` yet). Reference template: `template/integrations/cursor/skills/dmb-memory-bank/SKILL.md`.

**Agent-Requested rules** — `.cursor/rules/<name>.mdc` with `description:` set but no `globs:` and no `alwaysApply: true`. Same intent-triggered behaviour, in rule form. Reference template: `template/integrations/cursor/memory-bank.mdc`.

Use this tier for entry points the agent should pull only when relevant — DMB inventory loading, doc-guide consultation before memory-bank writes, etc. Cheaper than `alwaysApply: true` and cleaner than overloading path-scoped rules.

The same `SKILL.md` format works across Claude Code, Codex CLI, and Cursor — skills are cross-tool portable.

---

## Tier 4 — Always-on essentials

The `alwaysApply: true` rule loads on every action, so it must stay short. Use it for:

- Project name and tech stack one-liner.
- Pointer at the path-scoped rules under `.cursor/rules/` — area routing happens there.
- Pointer at `memory-bank/_index.md` as the inventory, for navigation when an unfamiliar file is needed.
- Hard prohibitions (no commits without explicit permission, etc.).

Templates: `template/integrations/cursor/essentials.mdc` (always-on minimum) and `template/integrations/cursor/memory-bank.mdc` (Agent-Requested workflow / inventory entry — note: lives at tier 3, not tier 4).

Keep this file under 30 lines. Anything operation-scoped belongs in a path-scoped rule (tier 2) or a skill / agent-requested rule (tier 3).

---

## Custom slash commands

Cursor supports user-defined slash commands as plain markdown files. **No frontmatter** (key difference from Claude Code) — the filename is the command name, the body is the prompt.

Reference templates: `template/integrations/cursor/commands/`.

Locations:

- **Project:** `.cursor/commands/<name>.md` — committed, shared.
- **User-wide:** `~/.cursor/commands/<name>.md` — personal across projects.

Two starter commands ship:

| Command | Use for |
|---|---|
| `/dmb-resume` | Load DMB inventory + adoption status + project brief + active branch scratchpad |
| `/dmb-status` | Report which DMB sections are filled / partial / postponed; list current `tasks/work/` files |

Slash commands are user-triggered, not auto-fired on intent — they sit alongside the tier ladder rather than inside it, useful as power-user shortcuts.

---

## Native `AGENTS.md` support

Cursor reads `AGENTS.md` natively — from the project root and nested subdirectories — as documented in Cursor's [rules docs](https://cursor.com/docs/rules). The official changelog doesn't pin a specific version, so treat the docs page as the source of truth. Legacy `.cursorrules` is deprecated.

Precedence on conflict:

```
Team Rules (cloud/enterprise) → Project Rules (.cursor/rules/) → User Rules
                              → AGENTS.md (nearest to the edited file wins)
                              → User chat overrides everything
```

This matters if your project already uses `AGENTS.md` for Codex CLI or other tools — Cursor will see and apply it too. The two surfaces can coexist: keep area-specific routing in `.cursor/rules/<area>.mdc` (where `globs:` gives deterministic file-match scoping), and keep project-wide guidance in `AGENTS.md` (where Codex / other tools also read it).

DMB's recommendation: lead with `.cursor/rules/` for Cursor-specific routing (path-scoped, deterministic), and use `AGENTS.md` only if you want the same file to feed Codex / other AGENTS.md-aware tools.

---

## Putting it together

```
.cursor/
├── hooks.json                      # tier 1 — sessionStart / preToolUse / etc.
├── rules/
│   ├── essentials.mdc              # tier 4 — alwaysApply: true (minimum)
│   ├── memory-bank.mdc             # tier 3 — Agent-Requested (description-only)
│   ├── backend.mdc                 # tier 2 — globs: ["backend/**"]
│   ├── frontend.mdc                # tier 2 — globs: ["frontend/**"]
│   └── migrations.mdc              # tier 2 — globs: ["migrations/**", "**/*.sql"]
├── skills/
│   └── dmb-memory-bank/SKILL.md    # tier 3 — agent-triggered
├── commands/
│   ├── dmb-resume.md               # slash command — /dmb-resume
│   └── dmb-status.md               # slash command — /dmb-status
└── mcp.json                        # MCP servers (if DMB or anything else ships one)
```

All four tiers reference `memory-bank/` files directly. `_index.md` is the inventory consulted when authoring or updating any of them — not a runtime indirection they traverse. None of these files duplicate knowledge from `memory-bank/`.

---

## A note on `.cursorignore`

Cursor supports `.cursorignore` (blocks files from AI access and indexing) and `.cursorindexingignore` (blocks indexing only — the AI can still read on demand). Both use gitignore syntax.

**Do not add `memory-bank/` to `.cursorignore`.** Memory-bank is exactly the content you want the AI to read. If you have local-only or sensitive files that happen to live nearby, scope the ignore rule narrowly — don't blanket-block the whole directory.

---

## Coexistence with Claude Code / Codex / Gemini

If your project uses multiple AI tools, memory-bank is the shared knowledge base:

- Claude Code reads memory-bank via `CLAUDE.md` + skills + hooks (`.claude/`).
- Cursor reads memory-bank via `.cursor/rules/` + hooks + skills + commands.
- Codex reads memory-bank via `AGENTS.md` + hooks (`.codex/`) + skills (`.agents/skills/`).
- Gemini reads memory-bank via `GEMINI.md` + hooks (`.gemini/`) + slash commands.

All get the same project knowledge. Tool-specific behaviour goes in tool-specific config, not memory-bank.

The `SKILL.md` format is shared with Claude Code and Codex — Cursor's `.cursor/skills/dmb-memory-bank/SKILL.md` and Claude's `.claude/skills/memory-bank-writer/SKILL.md` are essentially the same file (different names, same shape). Copy or symlink as suits your repo.

---

## Will this ranking change?

Yes — that's the point of the ladder. Cursor's `Agent Requested` rule type and skills are newer than the path-scoped tier; hooks newer still. As Cursor refines each mechanism, the ranking rebalances. The principle stays mechanical: lead with whatever is most reliable today, demote the less-reliable mechanisms to lower-stakes routing. The knowledge layer never moves.

A long-term distribution path: Cursor's Plugin marketplace (Feb 2026) bundles rules + skills + hooks + MCP + subagents into one installable. DMB may eventually ship as a Cursor plugin — tracked as a backlog item.

---

## Automation

For bot-driven writes to `tasks/work/` and `tasks/log/`, see [`../automation-patterns.md`](../automation-patterns.md). That pattern is independent of which AI tool reads DMB.
