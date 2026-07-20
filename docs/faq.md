# FAQ

## How is this different from CLAUDE.md / Cursor rules?

CLAUDE.md, `.cursor/rules/*.mdc`, `GEMINI.md`, `AGENTS.md` and similar files are tool-specific entry points — they tell a specific AI tool how to behave. DMB is a tool-agnostic knowledge base that any agent can read.

In practice, you use both: your CLAUDE.md references memory-bank files, and so do your Cursor rules. The knowledge lives once, in `memory-bank/`. The tool configs are the integration layer — skills, rules, hooks, MCP servers — which point at the knowledge instead of duplicating it.

## How is this related to the Cline Memory Bank?

DMB is inspired by the [Cline Memory Bank pattern](https://docs.cline.bot/prompting/cline-memory-bank), which established the idea of structured markdown files for cross-session AI context. Thanks to the Cline team for popularising the pattern.

## How do I install DMB in a new project?

Easiest path:

```bash
npx directed-memory-bank init
```

That scaffolds `memory-bank/` in your project with the standard structure. Then open your AI tool of choice (Claude Code, Cursor, Codex, Gemini) and say:

> *"Follow memory-bank/INSTALL.md to set up my DMB."*

Your AI reads `memory-bank/INSTALL.md` (an interview script) and walks you through filling each section. Skip anything, paste docs instead of typing, postpone what you don't have answers for yet.

**No Node available?** Clone manually:

```bash
git clone https://github.com/pmikutel/directed-memory-bank.git
cp -r directed-memory-bank/template/memory-bank/ your-project/memory-bank/
```

You can also work through `INSTALL.md` by hand — it's written to be readable by humans too — but the AI-driven flow is the path of least resistance.

## How do I come back to install later?

Your install progress is tracked in `memory-bank/_adoption.md`. To pick up where you left off, just say to your AI:

> *"Continue DMB install."*

The AI reads `_adoption.md`, finds the highest-priority pending section, and resumes. Postponed items are surfaced first if you noted blockers; partial items are next; un-started items follow in priority order.

You can also leave install state alone forever — DMB works with whatever sections are filled. The AI's behaviour is to gently surface unfilled sections only when they would directly help your current question, never as periodic nags.

## Do I need the RAM layer (`tasks/`)?

No. The RAM layer is optional. You can use memory-bank for just the knowledge layer (`project/` + `technical/`) and skip `tasks/` entirely.

The RAM layer solves specific problems: losing context between sessions, forgetting discoveries made during focused work, and losing decision rationale over time. If you don't have those problems, skip it.

## Do I need `tasks/work/` for every feature?

No. `tasks/work/` is an **optional scratchpad**. A feature can ship without ever creating a `work/` file. Three valid triggers for creating one:

1. **Idea-first** — you want to capture something for later.
2. **Ticket-first** — you're picking up a Notion / Jira ticket and want scratchpad space.
3. **Mid-flight** — you're splitting implementation across two PRs and want to park context.

If none of those apply, skip it. The `log/` entry gets written automatically on PR merge whether or not a `work/` file existed.

## Why aren't there separate `active/`, `backlog/`, and `specs/` directories?

Those used to be separate in an older version of the standard. They turned out to be different maturity levels of the same thing — a topic file with context. Directory-based separation forced arbitrary moves as topics progressed.

The current standard uses one `work/` directory with a `status:` field in frontmatter. The same file starts as an idea, grows into a plan, and lives on through active work — no move required. On completion it moves to `log/` once.

## Why is `tasks/log/` a directory instead of a single `progressLog.md`?

Single-file appends break under concurrent writers. When multiple developers (and automation) are all adding entries to one file, merge conflicts become constant. A directory with one file per unit of work (`pr-<num>-<slug>.md`) sidesteps the problem entirely — each write targets a unique new file.

## Where do docs for external readers go?

Not in memory-bank. The standard defines three destinations:

- `memory-bank/` — content an AI agent would want to load while coding in this repo.
- `README.md` — setup and run commands.
- An external-docs folder (your choice of name — we suggest `/external-docs/`) — content for readers outside the code work: consumer walkthroughs for other teams, compliance statements, published talks, cross-team SLAs.

The resolving test: **"Would I want an AI agent to load this while writing / reviewing / debugging code in this repo?"** Yes → memory-bank. No → external-docs. Unsure → memory-bank (it's the default).

See `what-goes-where.md` for the full rule.

## Hook, skill, or instruction file — which should I use for X?

Depends on the tool, and on what counts as *most reliable today*. The standing principle: **for each tool, lead with the mechanism that is most reliable today; demote the less-reliable ones to lower-stakes routing.**

For Claude Code today (2026), that ladder reads top to bottom:

1. **Hooks** (`.claude/settings.json` — `SessionStart`, `PreToolUse`, …). Most reliable, because they run as code on lifecycle events. Use for the highest-stakes routing — pre-loading the always-load memory-bank files (`project/brief.md` plus any `tasks/work/*.md` matching the current branch), blocking dangerous writes, enforcing path policy.
2. **Skills** (`.claude/skills/<name>/SKILL.md`). Operation-scoped routing — one skill per operation type (`backend-work`, `frontend-work`, `migration-preview`, etc.), each naming the relevant memory-bank files directly. `_index.md` is the inventory you consult when authoring the skill, not a runtime indirection the skill traverses.
3. **Instruction files** (`CLAUDE.md` at the root, plus nested `backend/CLAUDE.md`, `frontend/CLAUDE.md`). Passive baseline. Use for project name, critical prohibitions, a pointer at `.claude/skills/` for operation routing, and a pointer at `_index.md` as the inventory. Keep terse.

For Cursor today, hooks and skills aren't concepts. Path-scoped rules with `globs:` carry most of the load, plus one always-on rule for essentials.

The ranking is **not permanent**. As Claude's instruction-following improves, instruction files might move up. If Cursor adds hooks, they climb. The principle stays mechanical: pick whatever is most reliable in your tool right now, and rebalance when it changes. The knowledge layer never moves.

For the full model and per-tool ladders, see [`integration-architecture.md`](integration-architecture.md).

## How does DMB interact with Claude Code's auto-memory?

Claude Code maintains its own per-project memory at `~/.claude/projects/<project>/memory/MEMORY.md` (plus topic files). It's loaded automatically each session. That's the **preferences layer** in DMB's three-layer model — personal corrections, workflow tweaks, things specific to you that don't belong in the shared project knowledge base.

- **Knowledge** (shared, tool-agnostic): `memory-bank/` in the project — committed to git.
- **Integration** (Claude-specific): `.claude/settings.json`, `.claude/skills/`, `.claude/rules/`, `.claude/agents/`, `CLAUDE.md`.
- **Preferences** (per-user, machine-local): Claude auto-memory in `~/.claude/projects/<project>/memory/`.

If an auto-memory entry would help every Claude session on the project (not just yours), promote it: move the content into the relevant memory-bank file or into `CLAUDE.md`.

Same framing as Cursor's auto-memory and Gemini's `save_memory` — DMB doesn't write to the preferences layer; that's Claude's territory.

## How does DMB interact with Gemini CLI's built-in memory?

Gemini CLI has a built-in `save_memory` tool that appends facts to the `## Gemini Added Memories` section of `~/.gemini/GEMINI.md` (your home directory, **not** the project). That's the **preferences layer** in DMB's three-layer model — personal corrections, workflow tweaks, things specific to you that don't belong in the shared project knowledge base.

Same framing as Cursor's auto-memory:

- **Knowledge** (shared, tool-agnostic): `memory-bank/` in the project.
- **Integration** (Gemini-specific): project `GEMINI.md`, `.gemini/settings.json`, `.gemini/commands/`.
- **Preferences** (per-user): Gemini auto-memory in `~/.gemini/GEMINI.md`.

If an auto-memory entry would help every Gemini session on the project (not just yours), promote it: move the content into the project's `GEMINI.md`, an area-scoped nested `GEMINI.md`, or the relevant memory-bank file.

## How does DMB work with Claude Code sub-agents?

Sub-agents (the `Task` tool) are regular agent invocations with their own fresh context. Your skills and hooks fire for them exactly the same way they fire for the top-level agent — `_index.md` routing applies identically. DMB has no separate concept of "sub-agent context."

The only nuance: a sub-agent starts with a clean window, so it doesn't inherit anything the parent already loaded. Two ways to handle that, both fine:

- **Let the sub-agent route itself** via the same skills / hooks / `_index.md` the parent used. Costs a few tool calls; works without you thinking about it.
- **Pre-build context in the dispatch prompt** — include the relevant slice (`tasks/work/foo.md`, a constraint from `architecture.md`, whatever the sub-agent needs) so it doesn't re-discover. Faster for narrow operations.

Which to pick is an orchestration choice per task, not a DMB convention.

## How do I keep DMB up to date?

The knowledge layer (`project/`, `technical/`) changes slowly — update it when your architecture, stack, or domain rules change. Not every session.

The RAM layer (`tasks/`) changes more often:

- `work/<slug>.md` — create when useful, update frontmatter as state changes (`status`, `branch`, `updated`), delete or move on completion.
- `log/pr-<num>-<slug>.md` — typically created by automation on PR merge. See `automation-patterns.md` for a reference pattern.

See `tasks/process.md` for the full workflow.

## Can automation write to DMB without causing chaos?

Yes — if you use the file-per-item pattern. The standard is deliberately designed so every write targets a unique file owned by exactly one writer at any moment. No shared-file appends, no merge conflicts.

See `docs/automation-patterns.md` for the reference pattern (branch-name matching, bot identity scoping, loop prevention).

## Won't AI tools make this obsolete?

AI tools are adding features that overlap with parts of memory-bank — path-scoped rules, auto-memory, plan files. But:

1. **No tool does intent-routing natively** — "I'm debugging, load the debugging context" requires either memory-bank's manifest as a runtime router (for tools without skills/hooks) or a per-tool skill / rule that names the right files. Memory-bank gives you both; it's the only thing that stays consistent across all of them.
2. **No tool provides cross-session project state** — auto-memory captures preferences, not "what are we working on and what's blocked."
3. **No tool is fully cross-compatible** — Claude's rules don't work in Cursor, Cursor's rules don't work in Gemini. Memory-bank works everywhere because it's just files.

As tools evolve, memory-bank adapts. Some files may migrate into native features. The framework gets leaner, not obsolete.

## How many files should I start with?

Start with 4: `_index.md`, `project/brief.md`, `technical/stack.md`, `technical/architecture.md`. Add more only when you feel the gap. See the [minimal example](../examples/minimal/).

## Can I use this with multiple AI tools on the same project?

Yes — that's one of the core design goals. Memory-bank is the shared knowledge base. Each tool gets a thin integration that references it. See [docs/integrations/](integrations/) for per-tool setup.
