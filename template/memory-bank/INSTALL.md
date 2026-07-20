# DMB — Install Guide

> **Hello, AI agent.** This file is an interview script. Walk the user through it section by section. The user can skip, postpone, or paste source material at any step. Update `memory-bank/_adoption.md` after each section. See the schema in Section 0.
>
> **Hello, human.** Easiest install: open Claude Code / Cursor / Codex / Gemini in this project and say *"follow memory-bank/INSTALL.md to set up my DMB."* Your AI will interview you, accept pastes, and fill the files for you. You can also work through this file by hand if you prefer.

> **A note on paths in this file.** When this file mentions paths like `examples/complete/...`, `docs/integrations/...`, or `template/integrations/...`, those refer to the upstream DMB repo on GitHub — they are *not* paths in your project. After install, your project owns its own `memory-bank/` directory; everything else stays upstream as a reference.

---

## How this works (skim once, then start)

- **Skip anything.** Every section has *skip* and *postpone* options. Nothing is required. DMB works with whatever sections you fill.
- **Paste, don't type.** Got a README, design doc, Notion page, brain-dump notes, even a Slack thread? Paste the raw thing — your AI will extract what it needs and shape it into the DMB format. You don't have to write a single sentence from scratch if you don't want to.
- **Tracked in `_adoption.md`.** Come back any time. Say *"continue DMB install"* — your AI knows where you left off.
- **Examples are reference, not state.** See `examples/complete/memory-bank/` in the upstream DMB repo for "what good looks like." Yours is yours; don't copy verbatim.

---

## Section 0 — Initialize

> **AI:** if `memory-bank/_adoption.md` doesn't exist, create it by copying `memory-bank/_adoption.md.example` to `memory-bank/_adoption.md`, then set `Last updated` to today's date. **If `_adoption.md` already exists**, the user is resuming a prior install — read it, find the highest-priority pending section per the priority order at the bottom of this file, and resume from there instead of starting at Section 1.

### What `_adoption.md` is

A small status file that tracks which install sections are `not_started` / `partial` / `filled` / `postponed` / `skipped`. It lets the AI re-engage on *"continue DMB install"* without re-asking what's done.

The full schema, status legend, and behaviour notes for AI agents live in `memory-bank/_adoption.md.example` — open that file to preview the shape.

> **AI:** after creating `_adoption.md`, ask the user where to start:
>
> *"DMB is ready to fill. The recommended starting point is `project/brief.md` (project name + one-sentence description) — it's the file that gives an immediate quality bump to my answers. We can also start anywhere else, or I can show you the full menu. What would you like?"*

---

## Section 1 — Project brief  *(recommended starting point)*

**File:** `memory-bank/project/brief.md`
**Why fill it:** the one file that pays off immediately — your next AI answer will already be smarter.
**Skip cost:** low. Everything else still works.

> **AI:** offer one of:
>
> - *"What's the project name and one sentence about what it does?"*
> - *"Got a README, deck, design doc, or any prose about this project? Paste it — I'll pull out what I need."*
> - *"Want to skip or come back later? Just say 'skip' or 'postpone'."*
>
> After the user responds:
> - Extract: project name, one-sentence description, primary goal, target users, in-scope / out-of-scope.
> - Fill `brief.md` using the skeleton structure already in place — replace `[FILL_IN: ...]` markers with extracted content.
> - For inspiration on shape and depth, see `examples/complete/memory-bank/project/brief.md` in the upstream DMB repo. Do not copy its content; use it as a pattern.
> - Update `_adoption.md`: status `filled` (or `partial` if some `[FILL_IN]` markers remain).

---

## Section 2 — Business domain  *(optional, often postponed)*

**File:** `memory-bank/project/domain.md`
**Why fill it:** AI gives much better answers about business logic, naming, and edge cases when this exists.
**Skip cost:** low for technical-only projects; medium for domain-heavy ones (fintech, healthtech, marketplaces).
**Common reason to postpone:** you don't have the full domain modelled yet, or the business team hasn't given you the rules.

> **AI:** same pattern — offer typed-answer, paste-friendly, or skip/postpone:
>
> - *"What are the core business entities and how do they relate?"*
> - *"Got a domain model doc, ERD, glossary, or product requirement doc? Paste it."*
> - *"Want to skip or postpone? Tell me a brief reason if you'd like — I'll note it in `_adoption.md` so I remember why."*
>
> If user postpones, write `status: postponed` in `_adoption.md` and capture the reason in `notes`.

---

## Section 3 — Vision  *(optional)*

**File:** `memory-bank/project/vision.md`
**Why fill it:** helps AI suggest features and changes in line with the long-term direction, not just the immediate ticket.
**Skip cost:** low for early-stage / experimental projects; medium for projects with established roadmap.

> **AI:** same pattern.
>
> - *"What's the long-term vision for this project? Where should it be in 1–2 years?"*
> - *"Got a pitch deck, product strategy doc, or VC memo? Paste it."*
> - *"Skip or postpone — your call."*

---

## Section 4 — Tech stack

**File:** `memory-bank/technical/stack.md`
**Why fill it:** AI's tech suggestions match what you actually use — no Rust suggestions in a Python project, no Vue when you've committed to React.
**Skip cost:** medium. Tech-stack ignorance is a common source of AI making technically-correct-but-wrong suggestions.

> **AI:** offer:
>
> - *"What's your tech stack — backend, frontend, infra?"*
> - *"Easiest: paste your `package.json` / `requirements.txt` / `Cargo.toml` / `pom.xml` plus a sentence about hosting. I'll fill it in."*
> - *"Skip or postpone."*
>
> Extract: language + version, framework, database, cache, build tool, key dependencies. Fill `stack.md` using the skeleton structure already in place — replace `[FILL_IN: ...]` markers with extracted content. Update `_adoption.md` accordingly.

---

## Section 5 — Architecture  *(optional, often postponed)*

**File:** `memory-bank/technical/architecture.md`
**Why fill it:** AI's suggestions about cross-cutting changes (auth, observability, error handling) get much better when the system map is in front of it.
**Skip cost:** medium-to-high for systems with non-trivial component boundaries; low for single-binary CLIs.
**Common reason to postpone:** you haven't formalised the architecture yet — it lives in heads.

> **AI:** offer:
>
> - *"How do the major components fit together? An ASCII diagram or a paragraph is fine."*
> - *"Got a C4 diagram, architecture doc, or whiteboard photo? Paste/describe it."*
> - *"Skip or postpone — note your reason if you'd like."*
>
> Fill `architecture.md` using the skeleton structure already in place — replace `[FILL_IN: ...]` markers with extracted content. Update `_adoption.md` accordingly.

---

## Section 6 — Optional: RAM layer (`tasks/`)

**File(s):** `memory-bank/tasks/process.md` (already in template), plus `work/` and `log/` directories.
**Why use it:** captures cross-session context — in-flight topic notes, completed-PR log entries. Helps AI stay oriented across sessions.
**Skip cost:** zero. Many adopters skip this for months and add it only when they hit pain.

> **AI:** ask:
>
> *"Want the RAM layer (`tasks/work/` for in-flight topic notes + `tasks/log/` for completed-PR entries)? Most teams skip this initially and add it later. If yes, I'll create the directories. If no or 'not yet', I'll mark `_adoption.md` accordingly."*
>
> If yes: ensure `tasks/process.md` is in place (it already is, in the template). Create `tasks/work/.gitkeep` and `tasks/log/.gitkeep` if they don't exist.

---

## Section 7 — Optional: tool integrations

> **AI:** detect which tool you're running in (Claude Code / Cursor / Codex / Gemini / other). Offer the matching integration files.

> **AI:** detect which tool(s) the user wants to integrate with. Auto-detect first — scan the project for `.claude/`, `.cursor/`, `.codex/`, `.gemini/` directories and any existing `CLAUDE.md` / `AGENTS.md` / `GEMINI.md` at root. Render matrices only for the tools that are present **OR** the user explicitly names. Skip tools that aren't present without nagging. If nothing is detected and the user hasn't named anything, ask once which tools they use.

### Matrix install — for each selected tool

Install templates ship with `dmb init` and live at `memory-bank/.install/integrations/<tool>/` in this project. The matrix data for each supported tool is inlined below — the AI renders the matching table verbatim during install.

> **AI:** for each tool the user picks, run these five steps in order. Don't bundle. Don't default silently. Each tier is a discrete decision.
>
> **Step a — Render the matrix.** Show the user the full table for their tool (verbatim from the matrices below) — columns *Option / Path / Pre-selected / Why*. The ✓ marks are DMB's recommended canonical ladder; — marks are adjacent or optional.
>
> **Step b — Get confirmation.** Ask:
>
> > *"Confirm with 'looks good' to install everything pre-selected (the ✓ items), or adjust — e.g. 'skip skills', 'add subagent', 'only the instruction file'."*
>
> - If the user says *"looks good"* → final install set = all ✓ items.
> - If they adjust (skip / add / replace) → apply the changes against the ✓ set, then **re-confirm the final list** before proceeding.
>
> **Step c — Install each selected option.** Copy the matching template from `memory-bank/.install/integrations/<tool>/` to the option's path in the user's project. Customise filenames and placeholder content as the option requires (e.g. `<area>` placeholders in path-scoped rules become real area names; skill descriptions get tuned to the project's vocabulary; instruction-file `[FILL_IN]` markers get filled from the knowledge-layer content gathered in Sections 1–6).
>
> **Step d — Echo back what landed.** Say *"Installed: [list]. Declined: [list of ✓ items the user explicitly said no to]."* This is the inline verify — surface the real outcome rather than assuming success.
>
> **Step e — Update `_adoption.md`** for that tool's row, following the rules in `_adoption.md.example` § *Status legend* and § *How the AI fills the status for integration sections*. In short:
> - All ✓ items installed, or each explicitly declined → **filled** (notes capture any declines).
> - Any ✓ item neither installed nor explicitly declined → **partial** (notes enumerate what's missing).
>
> Repeat the five steps for every additional tool the user picked. Don't shortcut — the canonical ladder differs per tool.

#### Claude Code matrix

| Option | Path | Pre-selected | Why |
|---|---|---|---|
| Hooks | `.claude/settings.json` | ✓ | Most reliable mechanism — deterministic on lifecycle events. |
| Skills | `.claude/skills/<name>/SKILL.md` | ✓ | Operation-scoped routing fired by user intent. |
| Path-scoped rules | `.claude/rules/<area>.md` | ✓ | Auto-loads memory-bank files when editing matching paths. |
| Instruction file | `CLAUDE.md` (root + optional nested) | ✓ | Project-wide essentials. Always loaded passively. |
| Subagent — `memory-bank-curator` | `.claude/agents/memory-bank-curator.md` | — | Optional: read-only DMB hygiene audits on demand. |

Templates: `memory-bank/.install/integrations/claude/`.

#### Cursor matrix

| Option | Path | Pre-selected | Why |
|---|---|---|---|
| Hooks | `.cursor/hooks.json` | ✓ | GA since v1.7 — deterministic on lifecycle events. |
| Path-scoped rules (Auto-Attached) | `.cursor/rules/<area>.mdc` (with `globs:`) | ✓ | Auto-loads memory-bank files when editing matching paths. |
| Always-on essentials | `.cursor/rules/essentials.mdc` | ✓ | Minimum project-wide rules loaded on every action. |
| Skills / Agent-Requested rules | `.cursor/skills/<name>/SKILL.md` | — | Optional intent-triggered routing. Cross-tool portable format. |
| Custom slash commands | `.cursor/commands/<name>.md` | — | Optional power-user shortcuts (e.g. `/dmb-resume`). |

Templates: `memory-bank/.install/integrations/cursor/`.

#### Codex CLI matrix

| Option | Path | Pre-selected | Why |
|---|---|---|---|
| Hooks | `.codex/config.toml` (`[[hooks]]`) | ✓ | Stable since v0.124 — deterministic on lifecycle events. |
| Instruction file | `AGENTS.md` (root + optional nested) | ✓ | Codex walks the hierarchy automatically. Project-wide essentials. |
| Skills | `.agents/skills/<name>/SKILL.md` | — | Behind `--enable skills` flag. Cross-tool portable format. |

Templates: `memory-bank/.install/integrations/codex/`. Cursor reads `AGENTS.md` natively too — if the user maintains one for Codex, it doubles as Cursor's instruction file.

#### Gemini CLI matrix

| Option | Path | Pre-selected | Why |
|---|---|---|---|
| Hooks | `.gemini/settings.json` (`hooks` block) | ✓ | Stable since v0.26, on by default. Deterministic on lifecycle events. |
| Instruction file | `GEMINI.md` (root + optional nested) | ✓ | Gemini walks the hierarchy. Supports `@path` modular imports. |
| Custom slash commands | `.gemini/commands/<namespace>/<name>.toml` | — | Optional user-triggered shortcuts (e.g. `/dmb:refresh`). |

Templates: `memory-bank/.install/integrations/gemini/`.

### Auto-memory boundary — flag once

> **AI:** during Section 7, mention once that the user's AI tool likely has a built-in auto-memory mechanism separate from DMB:
> - Claude Code → `~/.claude/projects/<project>/memory/MEMORY.md`
> - Cursor → tool-managed auto-memory
> - Gemini → `~/.gemini/GEMINI.md` (`## Gemini Added Memories` section)
> - Codex CLI → no first-class auto-memory today
>
> These are the **per-user preferences layer** in DMB's three-layer model. DMB doesn't write to them; they coexist.

### Cross-tool `AGENTS.md` note

> **AI:** if the user picks both Cursor and Codex (or just one and is considering the other), mention that Cursor reads `AGENTS.md` natively. They can use one `AGENTS.md` as the canonical instruction file for both tools, or maintain `CLAUDE.md` + `AGENTS.md` + `GEMINI.md` separately. User's call — flag the choice; don't push a default. See `docs/integration-architecture.md` § *Cross-tool instruction file tradeoffs* for the three approaches.

### After Section 7 — `.install/` cleanup

> **AI:** once all selected tool matrices are installed (and `_adoption.md` reflects what landed), mention to the user:
>
> > *"The `memory-bank/.install/` directory holds reference templates I used during install. You can keep it (useful if you add another tool's integration later via `continue DMB install`), add it to `.gitignore` (recommended — it's install-time scaffolding, not runtime content), or delete it. Either way, the integrations themselves are installed and working without it."*
>
> Don't auto-delete or auto-gitignore — the choice belongs to the user.

### Other tools

See `memory-bank/.install/integrations/generic/prompt-snippet.md`. Add the snippet to the tool's instruction file or system prompt. Single-tier install — the matrix flow doesn't apply.

---

## Section 8 — Done

> **AI:** summarise:
>
> *"DMB is set up. Status:*
> *— **Filled:** [list]*
> *— **Partial:** [list with what's pending]*
> *— **Postponed:** [list with reasons]*
> *— **Skipped:** [list]*
>
> *One next thing I'd suggest: [pick the highest-leverage pending item — usually the partial one if any, otherwise the highest-impact unfilled].*
>
> *Anytime you want to continue, just say 'continue DMB install' and I'll pick up from where we left off."*
>
> Also update the `Next suggestion` field in `_adoption.md` with that same suggestion.

---

## Re-engagement (when user says "continue install")

> **AI:** read `memory-bank/_adoption.md`. Find the highest-priority pending item by this order:
>
> 1. `partial` items (already started, easiest to finish)
> 2. `postponed` items (user wanted to come back) — if there's a note about waiting on something, ask whether the blocker has resolved
> 3. `not_started` items in section order
>
> Resume the INSTALL.md flow at that section.
