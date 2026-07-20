# What Goes Where

AI-assisted development projects have several places documentation can live. This guide explains how to decide — by audience, by purpose, and by the single test that resolves most ambiguous cases.

---

## The three-audience rule

Different docs serve different readers. Three destinations:

| Reader | Destination |
|---|---|
| AI agent writing code in this repo | `memory-bank/` |
| Teammate understanding architecture, domain, or current work | `memory-bank/` |
| Dev setting up or running this repo locally | `README.md` (per package) |
| Reader outside the code work — another team consuming your API, an external partner, a regulator | external-docs folder (your choice of name) |

### The test that resolves ambiguity

> **"Would I want an AI agent to load this file while writing, reviewing, or debugging code in this repo?"**

- **Yes** → `memory-bank/`. Even if a human could also read it. Even if it's long.
- **No** → external-docs folder.
- **Unsure** → `memory-bank/`. The cost of a file being there and unused is tiny. The cost of it being missing when the AI needs it is real.

**DMB is the default.** The external-docs folder is the narrow exception, not the fallback.

---

## Where things live

Within the "DMB is the default" rule, three destinations matter — two inside your repo, one outside:

```
┌─────────────────────────────────────────────────┐
│  Integration files (in your repo, per-tool)     │
│  Skills, rules, hooks, MCP, instruction files — │
│  reference memory-bank/ from each tool          │
│  .claude/, .cursor/rules/, GEMINI.md, AGENTS.md │
└──────────────────────┬──────────────────────────┘
                       │ references
                       ▼
┌─────────────────────────────────────────────────┐
│  memory-bank/  (in your repo, tool-agnostic)    │
│  Project truth — domain, architecture,          │
│  conventions, in-flight scratchpads, RAM        │
└─────────────────────────────────────────────────┘

  Adjacent (out of DMB's scope):
  ┌───────────────────────────────────────────────┐
  │  Tool auto-memory  (per-user, not committed)  │
  │  Personal preferences, terse-vs-verbose, etc. │
  └───────────────────────────────────────────────┘
```

The integration layer is **whatever your agent offers** — today that's skills, path-scoped rules, hooks, MCP servers, agent-specific entry files. Tomorrow it'll be something else. The split keeps DMB stable while integration features come and go.

> **Where `_index.md` fits.** `memory-bank/_index.md` plays three roles: (1) **inventory** of what's in `memory-bank/`, (2) **authoring source-of-truth for the integration layer** — when you create or update a skill / rule / hook / `AGENTS.md`, you read `_index.md` to see which memory-bank files matter for the operation, then reference those files directly from the integration artefact, and (3) **fallback runtime router** for tools without skills/hooks/path-scoped rules (the generic prompt-snippet path). Capable tools do not traverse `_index.md` at runtime — their integration-layer files name the memory-bank files directly.

---

## Implementation principle — "use what works today"

The integration layer is **pragmatic and evolving**, not principled and uniform. Every modern AI tool offers more than one mechanism for hooking into project context (instruction files, path-scoped rules, skills, hooks, MCP servers, …) — and these mechanisms differ in reliability, scope, and cross-tool coverage. The standing rule:

> **For each tool, lead with the mechanism that is most reliable today. Demote the less-reliable ones to lower-stakes routing. Rebalance when reliability changes.**

Per-tool starter ladders (illustrative, not mandates):

- **Claude Code (today):** hooks first (`.claude/settings.json` — most reliable, runs as code on lifecycle events) → skills next (`.claude/skills/` — operation-scoped routing, reliable when triggers match the user's phrasing) → instruction files last (root `CLAUDE.md`, nested `backend/CLAUDE.md`, `frontend/CLAUDE.md` — passive baseline; lowest historical reliability for instruction-following).
- **Cursor (today):** path-scoped rules (`.cursor/rules/*.mdc` with `globs:`) carry most of the load — the strongest mechanism Cursor offers, since hooks/skills aren't concepts there. An `alwaysApply: true` rule covers the always-on essentials.
- **Gemini CLI / Codex / others:** the same logic — pick the strongest reliable mechanism the tool offers and translate the routing intent into its syntax.

This is **not** a permanent ranking. As Claude's instruction-following improves, instruction files might move up. If Cursor adds a hook concept, it climbs. The principle stays the same: **always pick the most reliable mechanism the tool offers right now**, and rebalance as the tools evolve. The knowledge layer never moves.

For a deeper treatment of the model, including concrete file shapes for each tier, see `integration-architecture.md`.

## Decision guide

| Information type | Where | Why |
|---|---|---|
| Business domain rules | `memory-bank/project/domain.md` | Tool-agnostic, rarely changes, needed by any agent |
| Tech stack and decisions | `memory-bank/technical/stack.md` | Tool-agnostic shared knowledge |
| Architecture patterns | `memory-bank/technical/architecture.md` | Tool-agnostic shared knowledge |
| Style/length/hygiene rules for memory-bank files | `memory-bank/project/doc-guide.md` | Tool-agnostic; loaded by every memory-bank write |
| In-flight topic / idea / draft spec | `memory-bank/tasks/work/<slug>.md` | Cross-session RAM, tool-agnostic, optional |
| Completed unit of work | `memory-bank/tasks/log/pr-<num>-<slug>.md` | Permanent record, tool-agnostic |
| API contract you own and evolve | `memory-bank/technical/` | AI needs it when changing the API |
| Integration walkthrough for another team | external-docs folder | Not reference material for your coding |
| "When editing .py files, follow these rules" | `.claude/rules/backend.md`, `.cursor/rules/backend.mdc`, etc. | Integration-layer routing to memory-bank files |
| "Run lint after every file edit" | Tool hooks (e.g. `.claude/settings.json`) | Integration-layer automation; can read DMB, doesn't write to it |
| "Load skill X when working on Y" | Tool skills / MCP config | Integration-layer feature; references DMB for knowledge |
| "I prefer terse responses" | Tool auto-memory | Personal, per-user |
| "Don't run global lint, only on changed files" | Tool auto-memory | Personal workflow correction |

---

## Splitting docs with mixed audiences

Some documents serve two audiences at once. The clearest example: a guide for another team using your backend. It typically contains:

- **Contract bits** — endpoints, request / response shapes, auth flow, error codes. You care about these when evolving the API → memory-bank.
- **Consumer walkthrough** — "how to authenticate from your frontend, sample code, getting started." You don't need it to evolve the API; only your consumer does → external-docs folder.

A 30–70 split is common. Don't fight it — the split itself is a signal that two audiences need two files.

Pattern:
- `memory-bank/technical/api-contract-<consumer>.md` — the bits Claude would want to load.
- `external-docs/integrations/<consumer>.md` — the walkthrough.
- Cross-link between them.

---

## The rule for tool-specific configs

**If two tools would need the same information, it goes in memory-bank.**

Tool-specific configs should be thin routing layers that reference memory-bank files, not copies of the same knowledge.

### Example: Claude Code rule referencing memory-bank

```markdown
---
paths:
  - "backend/**/*.py"
---
# Backend conventions
Read `memory-bank/technical/stack.md` and `memory-bank/technical/architecture.md` for full context.
Key reminders: [2–3 lines of the most critical gotchas]
```

The rule is a pointer with a few highlights. The full knowledge lives in DMB where Cursor, Gemini, or any other agent can also read it.

---

## Anti-patterns

| Anti-pattern | Why it's wrong | Do this instead |
|---|---|---|
| Duplicating architecture docs in `.claude/rules/` AND `memory-bank/` | They drift. You update one, forget the other. | Put knowledge in `memory-bank/`, reference it from rules |
| Putting personal preferences in DMB | DMB is shared project knowledge, not your personal config | Use the tool's auto-memory for preferences |
| Putting tool-specific hooks in DMB | DMB is tool-agnostic | Keep hooks in the tool-specific config |
| Writing a 500-line CLAUDE.md instead of using DMB | Becomes unmaintainable, doesn't work with other tools | Use CLAUDE.md for essentials, reference DMB for depth |
| Dumping all "non-DMB" docs into `external-docs/` | Turns it into a junk drawer | Apply the test: if an AI agent would want to load it, it belongs in DMB |
| Appending to a single `progressLog.md` or `activeContext.md` | Merge conflicts under concurrent writers | Use `tasks/work/` + `tasks/log/` — one file per topic / one per unit of work |

---

## A note on naming the external-docs folder

The standard describes the **category** — content that isn't reference material for code work in this repo — and leaves the folder name to you. Common choices:

- `/external-docs/` — clear about audience. Recommended.
- `/public-docs/` — clear if the content is truly published externally.
- `/docs/` — familiar but risks becoming a junk drawer. If you pick this, put a README at the top of the folder that states the rule.

Whichever name you pick, put a `README.md` at the folder root with the "would an AI want to load this" test. Reviewers can point at it in PRs.
