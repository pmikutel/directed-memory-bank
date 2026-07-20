# Integration: Claude Code

How to wire DMB into a Claude Code project.

This page lays out the **three-tier ladder** Claude Code adopters should think in: hooks first, operation-scoped routing next (skills or path-scoped rules), instruction files last. Each tier serves a different role and has a different reliability profile. For the full reasoning, see [`../integration-architecture.md`](../integration-architecture.md).

> **First time setting up?** Most adopters use the AI-driven install flow. Open Claude Code in your project and say *"follow memory-bank/INSTALL.md to set up my DMB"*. The interview detects Claude Code and offers the right integration tiers (hooks → skills → instruction files) at the appropriate point. The rest of this page is the reference detail behind that flow.

---

## The ladder at a glance

| Tier | Mechanism | Where | Use for |
|---|---|---|---|
| 1 | **Hooks** | `.claude/settings.json` | Highest-stakes routing — runs as code on lifecycle events. Most reliable today. |
| 2 | **Skills _or_ path-scoped rules** | `.claude/skills/<name>/SKILL.md` (intent-triggered) and `.claude/rules/<area>.md` with `paths:` (path-triggered) | Operation-scoped routing — pick the trigger that matches the operation's shape. Both name memory-bank files directly. |
| 3 | **Instruction files** | `CLAUDE.md` (root) + nested `backend/CLAUDE.md`, `frontend/CLAUDE.md` | Passive baseline — project name, hard prohibitions, a pointer at `.claude/skills/` / `.claude/rules/` for operation routing and at `_index.md` as the inventory. |

The principle: **lead with the most reliable mechanism**. Highest-stakes routing goes in tier 1; medium-stakes in tier 2; passive baseline in tier 3. As reliability changes (Claude tightens instruction-following, new hook events ship), rebalance.

Two adjacent mechanisms — **subagent definitions** and **plugins** — sit alongside the ladder rather than inside it; both are described below.

---

## Tier 1 — Hooks

Claude Code's `.claude/settings.json` supports a rich set of lifecycle hooks. Hooks run as code (or HTTP / MCP-tool calls), so they're the most reliable mechanism the harness offers.

Available events today include `SessionStart`, `SessionEnd`, `UserPromptSubmit`, `UserPromptExpansion`, `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PostToolBatch`, `Stop`, `StopFailure`, `SubagentStart`, `SubagentStop`, `PreCompact`, `PostCompact`, `Notification`, `PermissionRequest`, `PermissionDenied`, `TaskCreated`, `TaskCompleted`, `FileChanged`, `CwdChanged`, `ConfigChange`, `WorktreeCreate`, `WorktreeRemove`, `InstructionsLoaded`, `Elicitation`, `ElicitationResult`, `Setup`. Handler types include `command`, `http`, `mcp_tool`, `prompt`, and `agent` — the `agent` handler is **experimental** per the [hooks reference](https://code.claude.com/docs/en/hooks), which recommends `command` hooks for production.

Use hooks for the things you cannot afford the agent to forget. DMB's reference template (`template/integrations/claude/settings-template.json`) ships six:

| Event | DMB use |
|---|---|
| **`SessionStart`** | Pre-load `memory-bank/project/brief.md` and any `tasks/work/*.md` whose `branch:` matches the current git branch. |
| **`UserPromptSubmit`** | Intent-matched memory-bank inject — when user phrasing suggests an operation, surface the relevant slice without forcing a skill / `@`-mention. Catches phrasings the skill descriptions don't match exactly. |
| **`PreToolUse`** | Gate dangerous operations. Block `git push --force` to protected branches, refuse writes to `memory-bank/project/**` and `memory-bank/technical/**` from automation. |
| **`PostToolUse`** | Fast feedback after edits. Trigger lint or type-check; surface failures back into the session. |
| **`PreCompact`** | Re-inject memory-bank refs before Claude compacts the context window. Without this, `/compact` can drop the inventory and the user has to re-prime. Surface `_index.md` pointers + active `tasks/work/<branch>.md`. |
| **`SessionEnd`** | Opt-in: write a short session summary back to `tasks/work/<branch>.md` or a daily journal file. Aligns with DMB's RAM-layer pattern (one file per topic). Disable for headless / CI runs. |

Three rules of thumb:

- **Read, don't write (mostly).** Hooks should consume memory-bank context. `SessionEnd` is the deliberate exception, and it writes only to the RAM layer (`tasks/work/` / `tasks/log/`), never to `project/` or `technical/`. Writes from automation belong to a dedicated bot identity (see [`../automation-patterns.md`](../automation-patterns.md)).
- **Team-shared vs personal.** Commit `.claude/settings.json` for the team-shared shape. Personal hooks (your own preferences, machine-specific paths) belong in `.claude/settings.local.json`, which stays gitignored.
- **`/compact` survivability.** Root `CLAUDE.md` survives `/compact`; nested `CLAUDE.md` files do not. Put anything load-bearing in the root file, in a `SessionStart` hook (re-runs after `/clear`), or in a `PreCompact` hook (fires before each compaction).

---

## Tier 2 — Skills _or_ path-scoped rules

This tier handles **operation-scoped routing** — the bulk of the integration layer. Two interchangeable forms, depending on whether the operation is naturally triggered by user intent or by file paths.

### Skills (intent-triggered)

`.claude/skills/<name>/SKILL.md` with `name:` + `description:` frontmatter. The agent fires the skill when user phrasing matches the description. Best for operations defined by *what the user is doing* (backend work, frontend work, writing into memory-bank, etc.).

Reference templates: `template/integrations/claude/skills/`.

The shipped starter set:

| Skill | Triggers when | Loads |
|---|---|---|
| `backend-work` | Starting / continuing backend code changes | Backend-relevant memory-bank files |
| `frontend-work` | Starting / continuing frontend code changes | Frontend-relevant memory-bank files |
| `migration-preview` | Reviewing or writing a database migration | Domain + architecture + stack files |
| `quality-gate-local` | Before commit / before opening a PR | Quality / testing / stack files |
| `memory-bank-writer` | Updating files in `memory-bank/` | `_index.md` + `tasks/process.md` |

Each skill is ≤20 lines: frontmatter + a list of files to load. **No knowledge inside the skill** — knowledge belongs in `memory-bank/`. When you add or rename a memory-bank file, update `_index.md` first (the inventory), then update any skill that should reference the new file.

The same `SKILL.md` format works in Codex CLI (`.agents/skills/`) and Cursor (`.cursor/skills/`) — skills are cross-tool portable.

### Path-scoped rules (path-triggered)

`.claude/rules/<area>.md` with optional `paths:` glob frontmatter. The rule fires when the agent is touching files matching `paths:`. Best for operations defined by *where the work is happening* (any change under `backend/**`, any SQL file edit, etc.).

Reference template: `template/integrations/claude/rules/area-rule-template.md`.

Shape mirrors a nested `CLAUDE.md` or a Cursor area-rule: frontmatter `paths:` glob + a list of memory-bank files to load + 2–3 lines of critical reminders.

### Skills _or_ rules — which to use?

| Pick | When |
|---|---|
| **Skill** | Operation is defined by user intent ("I'm refactoring", "let's review this PR"). Trigger is phrasing. |
| **Path-scoped rule** | Operation is defined by file location (any edit under `backend/`, any `*.sql` write). Trigger is paths. |
| **Both** | If the operation has both triggers — fine, ship both. Don't duplicate content; have the rule and the skill name the same memory-bank files. |

---

## Tier 3 — Instruction files

`CLAUDE.md` at the project root is the **passive baseline**. Claude reads the closest `CLAUDE.md` for any file, so nested files (`backend/CLAUDE.md`, `frontend/CLAUDE.md`, `migrations/CLAUDE.md`) give area-specific routing without bloating the root.

Templates:

- **Root**: `template/integrations/claude/CLAUDE-template.md` (or `CLAUDE-quick-template.md` for the briefer variant).
- **Nested**: `template/integrations/claude/nested-CLAUDE-template.md`.

Both are pointer-only. Two or three lines of critical reminders, then a list naming the memory-bank files this area should load. The full knowledge stays one indirection away in memory-bank.

Claude Code supports `@path/to/file` imports inside `CLAUDE.md` (up to four levels of recursion). Useful for splitting a large project-wide essentials file into smaller composable pieces while keeping the root file thin.

This tier is last because instruction-following is the lowest-reliability mechanism. As reliability improves, `CLAUDE.md` carries more weight.

---

## Subagent definitions (`.claude/agents/`)

Claude Code supports **named subagent definitions** — markdown files in `.claude/agents/` (project) or `~/.claude/agents/` (user) that pre-package a worker with its own system prompt, tool whitelist, model choice, and optional persistent memory directory. Description-triggered like skills, but with stronger sandboxing.

This is a **Claude-specific** mechanism — no exact equivalent in Cursor, Gemini, or Codex. DMB ships one starter agent and positions named agents as a Claude-only *complement* to the cross-tool skills, not a replacement.

Reference template: `template/integrations/claude/agents/memory-bank-curator.md`.

| Agent | Use for | Why a subagent, not a skill |
|---|---|---|
| `memory-bank-curator` | Auditing DMB hygiene — stale `tasks/work/` files, broken `@`-references, untracked files, frontmatter gaps | Tool-restricted (read-only — cannot write even by accident), cheaper model (`haiku` for structured listing), isolated context (audit output doesn't pollute the main session) |

The cross-tool `memory-bank-writer` skill still covers the *make-changes* side. The pair — curator audits, writer fixes — is the canonical pattern.

Use `/agents` (the TUI) to inspect what's loaded, switch between definitions, or temporarily disable an agent.

---

## Plugins (`.claude-plugin/plugin.json`)

Claude Code has a plugin system that bundles skills, agents, commands, hooks, MCP servers, LSP, and monitors into one installable unit. The community marketplace (`anthropics/claude-plugins-community`) accepts contributions.

DMB as a Claude Code plugin is a **future distribution play** — ship `dmb-claude-code` so `/plugin install dmb` drops the whole template tree in one step. The file-based core stays the source of truth; the plugin is a thin packaging shim. Tracked as a backlog item, not in scope for v0.1.

---

## Auto-memory (`~/.claude/projects/<project>/memory/MEMORY.md`)

Claude Code maintains its own per-project memory at `~/.claude/projects/<project>/memory/MEMORY.md` (plus topic files). Loaded automatically each session. This is **Claude's preferences layer** in DMB's three-layer model:

- **Knowledge** (shared, tool-agnostic): `memory-bank/` in the project — committed to git.
- **Integration** (Claude-specific): `.claude/settings.json`, `.claude/skills/`, `.claude/rules/`, `.claude/agents/`, root + nested `CLAUDE.md`.
- **Preferences** (per-user, machine-local): Claude auto-memory in `~/.claude/projects/<project>/memory/`.

Personal corrections, workflow tweaks, and *"don't suggest X for me"* notes go in auto-memory. Things every Claude session on the project should know (project conventions, architecture decisions) go in `memory-bank/`. If an auto-memory entry would help every Claude session on the project, promote it — move the content into the relevant memory-bank file or into `CLAUDE.md`.

Same three-layer split as Cursor auto-memory and Gemini's `save_memory` — DMB doesn't write to the preferences layer; that's Claude's territory.

---

## Output styles — intentionally not shipped

Claude Code supports custom **output styles** (`.claude/output-styles/<name>.md`) that modify the system prompt directly. DMB **intentionally doesn't ship one**: output styles are Claude-only, modify behaviour at a layer where every other DMB-supported tool (Codex, Gemini, Cursor) has no equivalent, and would duplicate `CLAUDE.md` instructions in a less portable format. Cross-tool portability is the whole point of DMB's integration layer — shipping a Claude-only system-prompt override would break that premise.

If you want a project-wide output style, write one yourself; DMB just won't ship a default.

---

## MCP — file-based stays canonical

Claude Code reads `.mcp.json` at the project root (committed) and `~/.claude.json` for user-scope MCP servers. Plugins can also ship `.mcp.json`. DMB intentionally **stays file-only**: the read path is already covered by deterministic skills / hooks / path-rules; MCP triggers on probabilistic model judgement; and adding a server blurs the "just files in your repo" pitch.

DMB will revisit MCP when an adopter signal genuinely warrants it. Until then, the file-based path is the canonical one.

---

## Putting it together

A typical Claude Code project ends up with this shape:

```
.claude/
├── settings.json                       # tier 1 — hooks (team-shared)
├── settings.local.json                 # tier 1 — personal hooks (gitignored)
├── skills/                             # tier 2 — intent-triggered
│   ├── backend-work/SKILL.md
│   ├── frontend-work/SKILL.md
│   ├── migration-preview/SKILL.md
│   ├── quality-gate-local/SKILL.md
│   └── memory-bank-writer/SKILL.md
├── rules/                              # tier 2 — path-triggered
│   ├── backend.md                      # paths: ["backend/**"]
│   ├── frontend.md                     # paths: ["frontend/**"]
│   └── migrations.md                   # paths: ["migrations/**", "**/*.sql"]
├── agents/                             # adjacent — Claude-specific subagents
│   └── memory-bank-curator.md
└── (.mcp.json if used)

CLAUDE.md                               # tier 3 — root baseline
backend/CLAUDE.md                       # tier 3 — area-scoped
frontend/CLAUDE.md                      # tier 3 — area-scoped
```

All three tiers reference `memory-bank/` files directly. `_index.md` is the inventory consulted when authoring or updating any of them — not a runtime indirection they traverse. None of these files duplicate knowledge from `memory-bank/`.

---

## Coexistence with Cursor / Codex / Gemini

If your project uses multiple AI tools, memory-bank is the shared knowledge base:

- Claude Code reads memory-bank via `CLAUDE.md` + skills + rules + hooks + agents (`.claude/`).
- Cursor reads memory-bank via `.cursor/rules/` + hooks + skills + commands.
- Codex reads memory-bank via `AGENTS.md` + hooks (`.codex/`) + skills (`.agents/skills/`).
- Gemini reads memory-bank via `GEMINI.md` + hooks (`.gemini/`) + slash commands.

All get the same project knowledge. Tool-specific behaviour (subagent definitions, output styles, slash commands) goes in tool-specific config, not memory-bank.

---

## Automation

For bot-driven writes to `tasks/work/` and `tasks/log/`, see [`../automation-patterns.md`](../automation-patterns.md). That pattern is independent of the integration ladder above — it's about *how a bot writes to memory-bank*, not how Claude reads it.
