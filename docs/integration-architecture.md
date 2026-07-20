# Integration architecture

How DMB meets the AI tool. The deep dive behind the three-layer model and the *use what works today* principle introduced in `what-goes-where.md`.

This page exists because the standard's tool-agnostic promise — *"file-based knowledge any agent can read"* — only holds if there is also a clean answer to *"how does my tool actually pick those files up?"*. That answer is the integration layer.

---

## Where things live

```
┌─────────────────────────────────────────────────┐
│  Integration files (in your repo, per-tool)     │
│  Skills, rules, hooks, instruction files —      │
│  each one references memory-bank/ from its tool │
│  Rate of change: medium                         │
│  Lifetime: months — follows tool capability     │
└──────────────────────┬──────────────────────────┘
                       │ references
                       ▼
┌─────────────────────────────────────────────────┐
│  memory-bank/  (in your repo, tool-agnostic)    │
│  Project truth — domain, architecture,          │
│  conventions, in-flight scratchpads, RAM        │
│  Rate of change: slow                           │
│  Lifetime: years                                │
└─────────────────────────────────────────────────┘

  Adjacent (out of DMB's scope):
  ┌───────────────────────────────────────────────┐
  │  Tool auto-memory  (per-user, not committed)  │
  │  Personal preferences, terse-vs-verbose, etc. │
  │  Rate of change: fast                         │
  │  Lifetime: as long as the relationship        │
  └───────────────────────────────────────────────┘
```

Each destination answers a different question:

| Destination | Answers | Owner | Committed? |
|---|---|---|---|
| `memory-bank/` | *What is true about this project?* | The team | Yes |
| Integration files | *How does my tool find and use that knowledge?* | The team, per tool | Yes |
| Tool auto-memory | *How does this user like to work?* | The user | No — local to the tool |

The split is what keeps the standard tool-agnostic. `memory-bank/` is the same regardless of which agent you point at it. Integration files are where tools differ. Auto-memory never enters version control at all and is mentioned here only to make the boundary clear — personal preferences belong there, not in `memory-bank/`.

---

## Why the integration layer is its own concept

A naive setup puts knowledge directly into a tool's instruction file — a 500-line `CLAUDE.md`, a `.cursor/rules/everything.mdc`, an `AGENTS.md` containing the entire project history. Two failure modes follow:

1. **Drift.** The same content gets duplicated across `CLAUDE.md`, Cursor rules, and Gemini's instructions. One copy gets updated; the others rot.
2. **Lock-in.** The team tries a second tool and discovers the project knowledge isn't portable — it lives inside one tool's syntax.

The integration layer solves both by being **a thin routing layer that points at the knowledge layer**. Tool-specific files say *when* and *how* to load memory-bank files. The knowledge itself never leaves `memory-bank/`.

---

## `_index.md` plays three roles

`memory-bank/_index.md` catalogs what's in `memory-bank/` and which files matter for each operation type. It is **not** the runtime router for capable tools. Three distinct roles:

1. **Inventory** — humans and AI agents browsing DMB read it to know what exists and what each file covers.
2. **Authoring source-of-truth for the integration layer** — when you create or update a Claude Code skill, a Cursor rule, a hook, an `AGENTS.md`, or any other per-tool integration artefact, you read `_index.md` first. It tells you which memory-bank files matter for the operation you're authoring around. The integration-layer file then references those memory-bank files directly.
3. **Fallback runtime router** — for tools without skills, hooks, or path-scoped rules (truly generic custom agents that only ingest a system prompt), `_index.md` can be loaded as the runtime routing table. The generic prompt-snippet under `template/integrations/generic/` uses this path.

For capable tools, the integration layer is where routing happens at runtime:

- A Claude Code skill names the memory-bank files to load directly. Twenty lines, no scope indirection.
- A Cursor rule with `globs: ["backend/**/*.py"]` names the memory-bank files to load directly.
- A `SessionStart` hook pre-loads the project-wide essentials directly. It can also consult `_index.md` if it needs to discover what exists, but it doesn't traverse it for every operation.

This means each integration artefact is self-contained — fewer post-trigger failure points, lower token spend, and skills stay portable to a marketplace because they don't depend on a project-local routing table at runtime.

The trade-off: file references live in N places (one per integration artefact that uses them). When you rename or move a memory-bank file, you update `_index.md` first, then re-read the integration artefacts that reference the affected operation. Conformance lint (when available) catches drift.

---

## The principle: use what works today

> **For each tool, lead with the mechanism that is most reliable today. Demote the less-reliable ones to lower-stakes routing. Rebalance when reliability changes.**

Every modern AI coding tool offers more than one way to inject context: instruction files, path-scoped rules, skills, lifecycle hooks, MCP servers. They differ in:

- **Reliability** — does the tool actually follow the instruction, every time?
- **Scope** — does it apply globally, per path, per operation, on cue?
- **Cost** — token spend, latency, maintenance.
- **Cross-tool coverage** — does only this tool support it?

The principle is not a permanent ranking. It says: **lead with whatever is most reliable in your tool right now**, and rebalance as the tools evolve. The knowledge layer never moves; only the integration layer rebalances.

### What "lead with" means in practice

Integration mechanisms aren't either-or. A real project uses several at once. *Leading* means: the **highest-stakes routing** — the bits you cannot afford the agent to miss — uses the most reliable mechanism. Less-stakes routing falls to lower tiers.

For example, in Claude Code today (2026):
- *"Pre-load `project/brief.md` and any `tasks/work/*.md` matching the current branch at session start"* — high stakes; goes in a hook (runs as code).
- *"When working on backend code, load these memory-bank files"* — medium stakes; goes in an operation-scoped skill that names the files directly.
- *"Don't commit without explicit permission"* — passive baseline; goes in `CLAUDE.md`.

If hooks didn't exist, item one would move down to a skill. If instruction-file reliability improves, item two might move up to `CLAUDE.md`. The principle is mechanical: the mechanism follows the reliability.

---

## Per-tool starter ladders

These are illustrative starting points. Your project's needs will shift the balance.

### Claude Code (today)

```
Tier 1 — Hooks                .claude/settings.json
                              SessionStart, UserPromptSubmit, PreToolUse,
                              PostToolUse, PreCompact, SessionEnd (+ ~25
                              more events available).
                              Most reliable: runs as code on lifecycle events.
                              Use for: pre-loading the always-load memory-bank
                              files, intent-matched injects, blocking dangerous
                              commands, re-injecting refs before /compact,
                              opt-in session journaling.

Tier 2 — Operation-scoped:    Skills (.claude/skills/<name>/SKILL.md) —
                              intent-triggered via description match.
                              Path-scoped rules (.claude/rules/<area>.md with
                              paths:) — file-path-triggered.
                              Pick the trigger that matches the operation's
                              shape; ship both if the operation has both.
                              Use for: per-operation context loading
                              (backend-work, frontend-work, migration-preview,
                              memory-bank-writer, …).

Tier 3 — Instruction files     CLAUDE.md (root)
                              backend/CLAUDE.md, frontend/CLAUDE.md (nested)
                              Passive baseline. Root survives /compact;
                              nested do not.
                              Use for: project name, critical rules, a pointer
                              at .claude/skills/ + .claude/rules/ for operation
                              routing and at _index.md as the inventory. Keep
                              terse.
```

Adjacent: subagent definitions (`.claude/agents/<name>.md`) — Claude-specific tool-restricted workers (e.g. `memory-bank-curator` for read-only hygiene audits). Plugins (`.claude-plugin/plugin.json`) bundle the above for distribution via the community marketplace — backlog item for DMB. Claude auto-memory at `~/.claude/projects/<project>/memory/MEMORY.md` is the per-user preferences layer; DMB doesn't write here.

Templates for each tier ship under `template/integrations/claude/`. See [`integrations/claude-code.md`](integrations/claude-code.md) for the full guide.

### Cursor (today)

```
Tier 1 — Hooks                 .cursor/hooks.json (GA since v1.7, Oct 2025)
                              sessionStart, beforeSubmitPrompt, preToolUse,
                              afterFileEdit, beforeMCPExecution, …
                              Runs as a subprocess. Most reliable today.
                              Use for: pre-loading memory-bank files,
                              gating dangerous operations, fast post-edit
                              checks.

Tier 2 — Path-scoped rules     .cursor/rules/<area>.mdc with globs:
                              Auto-Attached on file matches. Deterministic.
                              Use for: backend / frontend / migrations /
                              etc., one rule per area, each naming the
                              relevant memory-bank files directly.

Tier 3 — Skills / Agent-       .cursor/skills/<name>/SKILL.md
        Requested rules        .cursor/rules/<name>.mdc with description:
                              only (no globs, no alwaysApply).
                              Agent-triggered on intent matching the
                              description. Same SKILL.md format as Claude
                              Code / Codex — cross-tool portable.
                              Use for: DMB inventory entry, doc-guide
                              consultation before memory-bank writes.

Tier 4 — Always-on rule        .cursor/rules/essentials.mdc with
                              alwaysApply: true.
                              The minimum that must always be in scope.
                              Use for: project name, hard prohibitions,
                              and a pointer at .cursor/rules/ for area
                              routing and at _index.md as the inventory.
```

Native `AGENTS.md` is read by Cursor (project root + nested) per [Cursor's rules docs](https://cursor.com/docs/rules) — coexists with `.cursor/rules/` and uses precedence Team Rules → Project Rules → User Rules → nearest `AGENTS.md`. Templates for each tier ship under `template/integrations/cursor/`. See [`integrations/cursor.md`](integrations/cursor.md) for the full guide.

### Codex CLI (today)

```
Tier 1 — Hooks                .codex/config.toml ([[hooks]] blocks)
                              SessionStart, PreToolUse, PostToolUse, …
                              Stable since v0.124. Most reliable today.
                              Use for: pre-loading memory-bank files,
                              gating dangerous operations, fast post-edit
                              checks.

Tier 2 — Skills                .agents/skills/<skill-name>/SKILL.md
                              Enable with `codex --enable skills` until
                              default-on. Same SKILL.md format as Claude
                              Code — cross-tool portable.
                              Use for: per-operation context loading.

Tier 3 — Instruction files     AGENTS.md (root) + nested AGENTS.md
                              Codex walks the hierarchy automatically.
                              The most commonly adopted Codex mechanism
                              today.
                              Use for: project-wide essentials, area-
                              specific routing pointers.
```

Templates for each tier ship under `template/integrations/codex/`. See [`integrations/codex-cli.md`](integrations/codex-cli.md) for the full guide.

### Gemini CLI (today)

```
Tier 1 — Hooks                .gemini/settings.json (hooks block)
                              SessionStart, BeforeTool, AfterTool, …
                              Stable since v0.26, on by default.
                              Use for: pre-loading memory-bank files,
                              gating dangerous operations.

Tier 2 — Instruction files     GEMINI.md (root) + nested GEMINI.md, plus
                              @path modular imports.
                              Gemini walks the hierarchy automatically;
                              @imports inline other markdown into the
                              prompt. Richer than CLAUDE.md.
                              Use for: project-wide essentials, area
                              routing, modular context loading.

Tier 3 — Slash commands        .gemini/commands/<namespace>/<name>.toml
                              User-triggered (e.g. /dmb:refresh), not
                              auto-fired. Useful for repeat ops.
                              Use for: explicit context-refresh,
                              standardised review prompts, etc.
```

Templates for each tier ship under `template/integrations/gemini/`. See [`integrations/gemini-cli.md`](integrations/gemini-cli.md) for the full guide.

### Other tools

Same logic, different syntax. For tools that only support a system prompt (custom agents, IDE extensions without rule/hook mechanisms), the generic prompt snippet at `template/integrations/generic/prompt-snippet.md` gives a baseline. Identify the strongest reliable mechanism the tool offers, use it for the highest-stakes routing, and translate *for this operation, load these memory-bank files* into the tool's syntax. Use `_index.md` as the inventory when authoring the artefact, not as a runtime indirection.

---

## Recommended install ladders

For the install-time decision matrix (what gets installed where during `dmb init` → Section 7 of `INSTALL.md`), see [`template/memory-bank/INSTALL.md`](../template/memory-bank/INSTALL.md) § *Matrix install*. That's the canonical home of the per-tool install matrix — it ships into adopters' projects so the install AI can render it locally without round-tripping to upstream docs.

This architecture doc retains the *conceptual* tier prose above (Claude Code / Cursor / Codex CLI / Gemini CLI ladders) — useful for understanding *what* each tier does and *why* it's positioned where it is on the reliability spectrum. The install matrix tables in `INSTALL.md` derive their recommendations from that conceptual framing.

---

## Cross-tool instruction file tradeoffs

If your project uses more than one AI tool, you'll accumulate always-on content (project name, hard rules, contracts, prohibitions) across each tool's instruction file: `CLAUDE.md`, `AGENTS.md` (read natively by Codex *and* Cursor), `GEMINI.md`, and so on. That content overlaps by design — multiple tools need to know the same hard rules.

Three reasonable approaches; no clear winner:

| Approach | What it looks like | Tradeoff |
|---|---|---|
| **(a) Accept duplication** | Maintain `CLAUDE.md` + `AGENTS.md` + `GEMINI.md` separately with overlapping content. Treat any divergence as a bug. | Simplest setup. Drift is inevitable on every change — add a periodic consistency check or accept the maintenance tax. |
| **(b) Canonical + imports** | Pick one (often `AGENTS.md`, since Cursor + Codex both read it natively). Have the others import or symlink to it where the tool supports it. | Lower drift. Depends on each tool's import / symlink support — not all do this reliably. |
| **(c) Single instruction file only** | Keep only your primary tool's file. Rely on `AGENTS.md` cross-tool reach (Cursor + Codex) for the rest; other tools fall back on the generic prompt snippet. | Smallest surface to maintain. Loses coverage if a non-`AGENTS.md`-aware tool joins later. |

DMB doesn't prescribe an approach. The Section 7 install matrix ships one instruction file per tool by default — effectively (a). When duplication starts to drift, evaluate (b) or (c) for your context.

`memory-bank/` stays unchanged regardless. The knowledge layer never moves; only the integration-layer pattern shifts.

---

## Concrete file shapes

### A nested instruction file (Claude Code)

```markdown
# backend/CLAUDE.md

For backend work in this directory, load:

- `memory-bank/project/brief.md`
- `memory-bank/technical/stack.md`
- `memory-bank/technical/backend.md` (if present)
- `memory-bank/technical/quality.md` (if present)

Critical reminders: [2–3 lines, only the gotchas a fresh session would miss].
```

No frontmatter. Pointer only. The full knowledge lives in the listed memory-bank files.

### A path-scoped Cursor rule

```markdown
---
description: Backend area routing
globs:
  - "backend/**/*.py"
---

# Backend work

Load:

- `memory-bank/project/brief.md`
- `memory-bank/technical/stack.md`
- `memory-bank/technical/backend.md` (if present)
- `memory-bank/technical/quality.md` (if present)

Critical reminders: [2–3 lines, only the gotchas].
```

Same shape as the nested CLAUDE.md, in Cursor syntax.

### A micro-skill (Claude Code)

```markdown
---
name: backend-work
description: Use when starting or continuing backend code changes
---

# backend-work

For backend changes, load these memory-bank files:

- memory-bank/project/brief.md
- memory-bank/technical/stack.md
- memory-bank/technical/backend.md   # if present
- memory-bank/technical/quality.md   # if present
```

≤20 lines. No knowledge — just routing. When you add or rename a memory-bank file, update `_index.md` first (the inventory) and then update any skill that should reference the new file.

### A SessionStart hook (Claude Code)

```json
{
  "hooks": {
    "SessionStart": [
      {
        "type": "command",
        "command": "scripts/load-memory-bank-context.sh"
      }
    ]
  }
}
```

The script emits the always-load memory-bank files (typically `project/brief.md` plus any `tasks/work/*.md` whose `branch:` matches the current git branch) as context. It can also read `_index.md` if it needs to discover what exists. Adopters write their own — the standard provides the shape, not the script.

---

## Anti-patterns

| Anti-pattern | Failure mode | Do this instead |
|---|---|---|
| Putting full architecture into `CLAUDE.md` | Drift across tools; lock-in | Put it in `memory-bank/`, reference from `CLAUDE.md` |
| One giant always-on Cursor rule | Token spend on every action; hard to maintain | Several path-scoped rules, one always-on essentials rule |
| Knowledge inside skills or hooks | Skills/hooks are integration plumbing, not project memory | Skills point at `memory-bank/` files; never restate them |
| File lists drifting between `_index.md` and integration artefacts | Inventory and integration go out of sync; agents load wrong or missing files | When you add or rename a memory-bank file, update `_index.md` first, then update any integration artefact that should reference it. Conformance lint (when available) catches stragglers |
| Treating the integration layer as permanent | Falls behind when the tool ships new features | Rebalance when reliability changes — the principle is mechanical, not tribal |

---

## Evolving the integration layer

Plan to revisit it. Tools ship new mechanisms (Cursor adds hooks, Claude tightens instruction-following, Codex Skills exit the feature flag, Gemini adds just-in-time hierarchical loading) — when they do, the integration layer rebalances. Two rules of thumb:

1. **Move routing toward the most reliable tier as soon as it exists.** Don't wait for permission. The knowledge layer doesn't move, so a rebalance is low cost.
2. **Don't fragment.** If two skills do nearly the same thing, merge them. If three Cursor rules cover overlapping globs, consolidate. The integration layer should be small.

The standard does not version the integration layer. Adopters version it themselves through commits, the same as any other code.
