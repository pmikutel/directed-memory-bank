# Directed Memory Bank

**Persistent project understanding for AI coding agents.**

Your AI agent starts every session knowing nothing. **Directed Memory Bank (DMB)** gives it structured project knowledge and working state — in plain markdown files that work with any tool.

> Inspired by the [Cline Memory Bank pattern](https://docs.cline.bot/prompting/cline-memory-bank). See [Inspiration](#inspiration) below.

---

## What changes

You know the ritual. Coming back after the weekend, you open a new AI session and burn the first ten minutes re-explaining the stack, the auth flow, the deprecation plan, why library X is off the table — before you can finally ask the actual question. With DMB, that ritual is gone. The AI already knows the project. You just continue.

Concretely:

- **Sessions resume, they don't restart.** Open a new Claude Code or Cursor session and your project context is already in scope. The AI doesn't need to be re-introduced to the codebase before it can help.
- **Switching tools costs nothing.** Start a refactor in Claude Code, finish it in Cursor. Both read the same `memory-bank/` files; both are on the same page about your stack and your conventions.
- **AI recommendations match your team, not the internet.** The model stops suggesting Redis when `technical/stack.md` says you've standardised on Postgres-as-cache. Stops suggesting NestJS when you've committed to FastAPI. Decisions you made once stay made.
- **Knowledge survives turnover.** When a teammate leaves, their understanding of the system doesn't leave with them. The *"why we built it this way"* lives in `technical/architecture.md` next to the decision, not in a Slack thread from eight months ago.
- **Cross-session memory of in-flight work.** You paused a feature to handle an urgent bug. A week later you pick it back up — the AI knows where you left off, what's still open, what was decided. That's `tasks/work/<slug>.md` doing its job.

---

## What it solves

- **Context loss** — stop re-explaining your project every session.
- **AI suggestions miss the mark** — stop fighting recommendations that ignore your team's actual decisions.
- **Discoveries vanish** — stop losing things you noticed during focused work.
- **Tool fragmentation** — stop duplicating conventions across Claude, Cursor, Gemini configs.
- **Decision rationale decays** — stop wondering *"why was this done this way?"* months later.

## What it is

A file convention. No server, no build step, no lock-in. Just markdown files organised so AI agents find what they need, when they need it.

**Tool-agnostic** — works with Claude Code, Cursor, Gemini, Codex, or any LLM-based agent that can read files.

**Adopt what you need** — the knowledge layer and RAM layer are independently valuable. Use the full framework or just the parts that solve your problem.

---

## How it compares

Two angles. First — what your day looks like with DMB vs without. Second — where DMB sits next to context tools you might already use.

### Without DMB / with DMB

| | Without DMB | With DMB |
|---|---|---|
| Start a new AI session | Re-explain the stack, the auth flow, the constraints (5–15 min) | Project context already in scope |
| Switch from Claude Code to Cursor mid-task | Rebuild context in the new tool | Both tools read the same `memory-bank/` files |
| A teammate leaves | Their understanding leaves with them | The *"why"* lives in `technical/architecture.md` |
| AI suggests a library | Whatever's most common in training data | What `technical/stack.md` says you actually use |
| Bot writes to a PR log | Merge conflicts with humans appending to a shared file | Bot writes its own file in `tasks/log/` |
| Pick up a paused feature two weeks later | *"Wait, what did I decide about X?"* | Read `tasks/work/<slug>.md` and continue |

### DMB vs the things you already have

| | Single `CLAUDE.md` / Cursor rules / `AGENTS.md` | Tool's built-in auto-memory | MCP memory servers (mem0, Letta, …) | DMB |
|---|---|---|---|---|
| Works across AI tools | No — one tool only | No — per-user, per-tool | Partial — depends on MCP support | Yes — every tool that reads files |
| Lives in version control | Yes | No | No (in server) | Yes |
| Scales past one big file | No — gets bloated | N/A | Yes | Yes — split by rate of change |
| Operation-scoped loading | No | No | Tool-dependent | Yes — integration layer routes by intent |
| Multi-writer safe (humans + bots) | No — append conflicts | No | Limited | Yes — file-per-item |
| No runtime dependency | Yes | Yes (tool only) | No — needs server | Yes |

DMB doesn't replace any of these. It composes with them: a thin `CLAUDE.md` or Cursor rule references DMB; the tool's auto-memory still captures personal preferences; if you run an MCP memory server, your DMB files can be exposed through it.

### Adjacent: knowledge-base wikis

Karpathy recently described an [LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — same intellectual lineage (file-based markdown, LLM as maintainer, Memex-style associative knowledge) applied to *knowledge accumulation*: research notes, book companions, due diligence, team wikis fed by Slack and meeting transcripts.

DMB applies the substrate to *code project context*. Different problem, different design choices: the codebase is the source of truth (no "raw sources" layer to ingest); file-per-PR log instead of single append-only `log.md` so humans + CI bots can write concurrently; a separate integration layer so the same `memory-bank/` works across Claude Code, Cursor, Gemini and others; a knowledge/RAM split so in-flight work persists across sessions.

Complementary, not competing. A real team can run both — Karpathy-shaped wiki for research/spikes; DMB for the repo they ship from. When a spike concludes, the locked-in tech decision graduates from the wiki into `memory-bank/technical/stack.md`.

---

## Why now

A few trends make a file-based context layer genuinely important in 2026:

- **Context protocols are converging** — Claude Code skills, Cursor rules, Codex Agent Skills, Gemini CLI hooks, MCP servers all assume a readable project knowledge layer exists. DMB gives you one that every tool understands.
- **AI teams are multi-writer** — humans *and* automations write project state now (progress logs, PR status, observability feedback). The standard is designed so multiple writers can coexist without constant merge conflicts.
- **Agentic CI is rising** — LLM-as-reviewer, spec-driven engineering, autonomous triage bots. All of them benefit from a structured, queryable project context they can read and, carefully, write.

The standard stays simple (markdown, no tooling). It just pays close attention to the seams where humans and automations meet.

---

## Quick start

1. **Scaffold DMB in your project:**

   ```bash
   npx directed-memory-bank init
   ```

   No Node? Clone and copy manually:

   ```bash
   git clone https://github.com/pmikutel/directed-memory-bank.git
   cp -r directed-memory-bank/template/memory-bank/ your-project/memory-bank/
   ```

2. **Open your AI tool of choice** (Claude Code / Cursor / Codex / Gemini) **in your project, and say:**
   > "Follow memory-bank/INSTALL.md to set up my DMB."

3. **Answer the questions.** Skip what you're not ready for, paste docs instead of typing where you can. Your progress is tracked in `memory-bank/_adoption.md` — come back any time and say *"continue DMB install"*; your AI will pick up where you left off.

That's it. For more depth see [docs/](docs/).

---

## How it works

### The manifest (`_index.md`)

`_index.md` catalogs what's in `memory-bank/` and which files matter for each kind of work — development, debugging, deployment, etc. It plays three roles:

- **Inventory** — humans and AI agents browsing DMB read it to navigate.
- **Authoring source-of-truth for the integration layer** — when you (or an AI agent acting on your behalf) create or update a Claude Code skill, a Cursor rule, a hook, or any other per-tool integration artefact, you read `_index.md` first to see which memory-bank files matter for the operation. The integration-layer file then references those memory-bank files directly.
- **Fallback runtime router** — for tools without skills, hooks, or path-scoped rules (Codex, Gemini CLI, custom agents), `_index.md` can be loaded as the runtime routing table.

For tools with strong harness mechanisms, the integration layer is where routing happens — skills, hooks, and rules name the memory-bank files directly. `_index.md` keeps them coherent without standing between them and the knowledge at runtime.

### Two layers inside `memory-bank/`

| Layer | What | Changes | Optional? |
|---|---|---|---|
| **Knowledge** | Architecture, domain, conventions, stack decisions | Slowly — when project evolves | Core |
| **RAM** | Current focus, in-flight topics, completed-work log | Every session | Yes |

### Three audiences for project docs

DMB is one of three destinations for documentation. The split:

| Reader | Destination |
|---|---|
| AI agent writing code in this repo | `memory-bank/` |
| Teammate understanding architecture / current work | `memory-bank/` |
| Dev setting up / running locally | `README.md` (per package) |
| Reader outside the code work (other team, external consumer) | external-docs folder (your choice of name) |

The resolving test: **"Would I want an AI agent to load this file while writing / reviewing / debugging code in this repo?"** Yes → memory-bank. No → external-docs. Unsure → memory-bank (the default).

Full guide: [docs/what-goes-where.md](docs/what-goes-where.md).

### Where things live

DMB lives in two destinations inside your repo:

| Destination | Where | What it holds |
|---|---|---|
| **`memory-bank/`** | In your repo | Tool-agnostic project truth — domain, architecture, conventions, in-flight scratchpads |
| **Integration files** | `.claude/`, `.cursor/rules/`, `GEMINI.md`, `AGENTS.md`, etc. | Per-tool wiring — skills, rules, hooks, instruction files that reference memory-bank/ |

Plus your tool's auto-memory, which holds personal preferences (terse-vs-verbose, workflow tweaks) — managed by the tool, never committed, out of DMB's scope.

Visualised:

```
   Claude Code      Cursor       Codex / Gemini / others
        │             │                │
        ▼             ▼                ▼
   ┌──────────────────────────────────────────┐
   │ Integration files (per-tool, in repo)    │
   │ .claude/skills/, .cursor/rules/,         │
   │ CLAUDE.md, GEMINI.md, AGENTS.md          │
   └──────────────────┬───────────────────────┘
                      │ references files in
                      ▼
   ┌──────────────────────────────────────────┐
   │ memory-bank/  (in repo, tool-agnostic)   │
   │                                          │
   │  ┌──────────────┐ ┌────────────────────┐ │
   │  │ Knowledge    │ │ RAM                │ │
   │  │ project/     │ │ tasks/work/        │ │
   │  │ technical/   │ │ tasks/log/         │ │
   │  └──────────────┘ └────────────────────┘ │
   │                                          │
   │  _index.md — inventory of what's in here │
   └──────────────────────────────────────────┘
```

Your AI tools stay unchanged at the top. Per-tool integration files are the only thing you write per-tool — and they're thin pointers. `memory-bank/` is the shared store every tool reads.

**The principle for the integration layer: *use what works today*.** Every modern AI tool offers more than one mechanism for hooking into context (instruction files, path-scoped rules, skills, hooks, MCP servers, …). For each tool, lead with the mechanism that is most reliable today. Demote the less-reliable ones to lower-stakes routing. Rebalance as the tools evolve. `memory-bank/` never moves. Starter templates for Claude Code, Cursor, Codex CLI, and Gemini CLI demonstrate the principle today — each with a per-tool tier ladder (hooks, skills / rules, instruction files). Use them as starting points and adapt as the tools change.

Deep dive — including per-tool starter ladders and concrete file shapes: [docs/integration-architecture.md](docs/integration-architecture.md).

---

## Structure

After install, your `memory-bank/` looks like this:

```
memory-bank/
├── _index.md                  # Inventory — what files exist, when each is relevant
├── INSTALL.md                 # AI-driven install interview (delete or keep after install)
├── _adoption.md               # Install progress tracker (created during install)
│
├── project/                   # Project identity (slow-changing)
│   ├── brief.md               # 30-second overview — always loaded
│   ├── domain.md              # Business entities, rules, workflows
│   ├── vision.md              # Problem space, long-term goals (optional)
│   └── doc-guide.md           # Style, length & hygiene rules — loaded on every memory-bank write
│
├── technical/                 # Technical knowledge (medium-changing)
│   ├── stack.md               # Tech stack, key decisions, gotchas
│   ├── architecture.md        # System design, patterns, data flow
│   └── [topic].md             # Add as needed: auth.md, api.md, deployment.md
│
└── tasks/                     # RAM — fast-changing, optional
    ├── process.md             # How to maintain work/ and log/
    ├── work/                  # One file per topic — idea, in-flight, draft spec
    └── log/                   # One file per merged PR (typically written by automation)
```

---

## Automation-ready

Once multiple writers are involved (humans plus CI automations plus LLM assistants), append-to-single-file patterns break. DMB is deliberately designed so every write targets a unique file owned by exactly one writer at any moment.

If you want to wire up bot-driven writes to `tasks/work/` and `tasks/log/` on CI events, see [docs/automation-patterns.md](docs/automation-patterns.md) for the reference pattern (branch-name matching, bot identity scoping, loop prevention) and the [complete example](examples/complete/) for a worked instance with an illustrative GitHub Actions archiver.

Automation is entirely opt-in. The standard works fully by hand.

---

## Examples

- **[minimal/](examples/minimal/)** — 4 files, no RAM layer. The bare minimum floor, shown with a small real project (TinyLink).
- **[complete/](examples/complete/)** — A fully-filled DMB end-to-end: knowledge layer (`project/` + `technical/`) *plus* the `tasks/` RAM layer (populated `work/` + `log/`) *plus* an optional, illustrative GitHub Actions archiver — all on a fictional book-tracking app. Shape and depth reference, not a starting point.

---

## Migrating from an earlier version?

If you're already using DMB with `activeContext.md` / `progressLog.md` / `backlog.md` single-file appends, see [MIGRATION.md](MIGRATION.md) for the one-off transition to `work/` + `log/`.

---

## FAQ

See [docs/faq.md](docs/faq.md) for common questions including:

- How is this different from CLAUDE.md?
- How is this related to the Cline Memory Bank?
- Do I need the RAM layer?
- Do I need `tasks/work/` for every feature?
- Where do docs for external readers go?
- Hook, skill, or instruction file — which should I use?
- How do I keep it up to date?
- Won't AI tools make this obsolete?

---

## Inspiration

DMB is inspired by the [Cline Memory Bank pattern](https://docs.cline.bot/prompting/cline-memory-bank), which established the core idea: a small set of structured markdown files in the project, read by an AI agent at session start, gives the agent persistent context across sessions. Thanks to the Cline team for popularising the pattern.

---

## License

MIT
