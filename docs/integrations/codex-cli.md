# Integration: Codex CLI

How to wire DMB into a Codex CLI project.

This page lays out the **three-tier ladder** Codex adopters should think in: hooks first, skills next, instruction files last. Each tier serves a different role and has a different reliability profile. For the full reasoning, see [`../integration-architecture.md`](../integration-architecture.md).

> **First time setting up?** Most adopters use the AI-driven install flow. Open Codex CLI in your project and say *"follow memory-bank/INSTALL.md to set up my DMB"*. The interview detects Codex and offers the right integration tiers (hooks → skills → instruction files) at the appropriate point. The rest of this page is the reference detail behind that flow.

---

## The ladder at a glance

| Tier | Mechanism | Where | Use for |
|---|---|---|---|
| 1 | **Hooks** | `.codex/config.toml` (stable as of v0.124+) | Highest-stakes routing — runs as code on lifecycle events. Most reliable today. |
| 2 | **Skills** | `.agents/skills/<name>/SKILL.md` (enable with `codex --enable skills`) | Operation-scoped routing — name the memory-bank files relevant for the operation at hand. |
| 3 | **Instruction files** | `AGENTS.md` (root) + nested `backend/AGENTS.md`, `frontend/AGENTS.md` | Passive baseline — Codex walks the hierarchy automatically. The most commonly adopted tier today. |

The principle: **lead with the most reliable mechanism**. Highest-stakes routing goes in tier 1; medium-stakes in tier 2; passive baseline in tier 3. As reliability changes (skills exit the feature flag, new hook events ship), rebalance.

In practice, most Codex projects start at tier 3 (a single root `AGENTS.md`) and add hooks/skills as the project matures. That's fine — `AGENTS.md` is mature, well-documented, and the most widely adopted Codex mechanism today.

---

## Tier 1 — Hooks

Codex Hooks (stable since v0.124) live in `~/.codex/config.toml` (user-wide) or `.codex/config.toml` (project-level, requires the project to be marked trusted). Hooks run as code, so they're the most reliable mechanism the harness offers.

Available events include `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `PreCompact`, `Stop`, and `SubagentStart` / `SubagentStop`.

Use hooks for the things you cannot afford the agent to forget:

- **`SessionStart`** — pre-load `memory-bank/project/brief.md` and any `tasks/work/*.md` whose `branch:` matches the current git branch. stdout (or JSON `hookSpecificOutput.additionalContext`) is appended as developer context for the session.
- **`PreToolUse`** — gate dangerous operations. Block `git push --force` to protected branches, refuse writes to `memory-bank/project/**` and `memory-bank/technical/**` from automation, etc.
- **`PostToolUse`** — fast feedback after edits. Trigger lint or type-check; surface failures back into the session.

Reference shape: `template/integrations/codex/config-template.toml`.

Two rules of thumb:

- **Read, don't write.** Hooks should consume memory-bank context, not modify it. Writes to `tasks/work/` and `tasks/log/` belong to the developer or to a dedicated bot identity (see [`../automation-patterns.md`](../automation-patterns.md)).
- **Verify against current Codex docs.** The hook format has evolved since v0.124. Cross-check against [https://developers.openai.com/codex/hooks](https://developers.openai.com/codex/hooks) before customising.

---

## Tier 2 — Skills

Codex Agent Skills (shipped Dec 2025) handle **operation-scoped routing** — one skill per operation type, each naming the memory-bank files relevant for that operation. The `SKILL.md` format is identical to Claude Code skills, so skills are cross-tool portable.

Reference templates: `template/integrations/codex/skills/` (one starter skill) plus everything in `template/integrations/claude/skills/` (works unchanged).

Skills live in two places:

- **Project:** `.agents/skills/<name>/SKILL.md` — committed, shared with the team. (Note: `.agents/`, not `.codex/`.)
- **User-wide:** `~/.codex/skills/<name>/SKILL.md` — personal skills across all projects.

Codex walks the project tree from CWD up to find `.agents/skills/` directories.

The starter set (mostly from Claude Code's directory — same format works here):

| Skill | Triggers when | Loads |
|---|---|---|
| `backend-work` | Starting / continuing backend code changes | Backend-relevant memory-bank files |
| `frontend-work` | Starting / continuing frontend code changes | Frontend-relevant memory-bank files |
| `migration-preview` | Reviewing or writing a database migration | Domain + architecture + stack files |
| `quality-gate-local` | Before commit / before opening a PR | Quality / testing / stack files |
| `memory-bank-writer` | Updating files in `memory-bank/` | `_index.md` + `tasks/process.md` |

Each skill is ≤20 lines: frontmatter (`name`, `description`) + a list of files to load. **No knowledge inside the skill** — knowledge belongs in `memory-bank/`.

Codex Skills are currently behind a flag — adopters need `codex --enable skills`. Check current Codex docs for default-on status before relying on skills for production work.

---

## Tier 3 — Instruction files

`AGENTS.md` is the passive baseline and the most commonly adopted Codex mechanism today. Codex walks the hierarchy automatically:

1. `~/.codex/AGENTS.md` (global, all projects)
2. Ancestors from repo root down to CWD — each directory may have one `AGENTS.md`
3. `AGENTS.override.md` outranks `AGENTS.md` at the same level

Files are concatenated root→leaf and injected as user-role messages headed `# AGENTS.md instructions for <dir>`.

Templates:

- **Root:** `template/integrations/codex/AGENTS-template.md`.
- **Nested:** `template/integrations/codex/nested-AGENTS-template.md`.

Both are pointer-only. Two or three lines of critical reminders, then a list naming the memory-bank files this area should load. The full knowledge stays one indirection away in memory-bank.

The fallback filename is configurable — set `project_doc_fallback_filenames` in `~/.codex/config.toml` if your project uses a different convention.

---

## Putting it together

A typical Codex CLI project ends up with this shape:

```
.codex/
└── config.toml                         # tier 1 — hooks (project, requires trust)

.agents/
└── skills/
    ├── backend-work/SKILL.md           # tier 2 — operation-scoped
    ├── frontend-work/SKILL.md
    ├── migration-preview/SKILL.md
    ├── quality-gate-local/SKILL.md
    └── memory-bank-writer/SKILL.md

AGENTS.md                               # tier 3 — root baseline
backend/AGENTS.md                       # tier 3 — area-scoped
frontend/AGENTS.md                      # tier 3 — area-scoped
```

All three tiers reference `memory-bank/` files directly. `_index.md` is the inventory consulted when authoring or updating any of them — not a runtime indirection they traverse. None of these files duplicate knowledge from `memory-bank/`.

---

## Coexistence with Claude Code / Cursor / Gemini

If your project uses multiple AI tools, memory-bank is the shared knowledge base:

- Claude Code reads memory-bank via `CLAUDE.md` + skills + hooks (`.claude/`).
- Cursor reads memory-bank via `.cursor/rules/` (path-scoped + always-on).
- Codex reads memory-bank via `AGENTS.md` + hooks (`.codex/`) + skills (`.agents/skills/`).
- Gemini reads memory-bank via `GEMINI.md` + hooks (`.gemini/`) + slash commands.

All get the same project knowledge. Tool-specific behaviour goes in tool-specific config, not memory-bank.

Codex's `SKILL.md` format is shared with Claude Code — you can keep one set of skills under either tool's directory and (via symlinks or build-step copies) have both tools use them.

---

## Automation

For bot-driven writes to `tasks/work/` and `tasks/log/`, see [`../automation-patterns.md`](../automation-patterns.md). That pattern is independent of the integration ladder above — it's about *how a bot writes to memory-bank*, not how Codex reads it.
