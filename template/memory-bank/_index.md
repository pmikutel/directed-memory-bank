# AI Context Discovery Map

**Purpose**: inventory of what's in `memory-bank/` and which files matter for which kind of work.

**Not for**: historical logs or "what changed" narratives. Those live in `tasks/log/`.

---

## How this file is used

This file plays three roles:

1. **Inventory** — humans (and AI agents) browsing DMB read it to know what files exist and what they cover.
2. **Authoring source-of-truth for the integration layer** — when you create or update a Claude Code skill, a Cursor rule, a hook, an `AGENTS.md`, or any other per-tool integration artefact, you read this file first. It tells you which memory-bank files matter for the operation you're authoring around. The integration-layer file then references those memory-bank files directly.
3. **Fallback runtime router** — for tools without skills, hooks, or path-scoped rules (truly generic custom agents that only ingest a system prompt), this file can be loaded as the runtime routing table. The generic prompt-snippet uses this path.

For tools with strong harness mechanisms (Claude Code skills/hooks, Cursor rules/hooks/skills, Codex hooks/skills, Gemini hooks), the integration-layer files name the memory-bank files to load directly. Those agents do not traverse this file at runtime — which keeps each integration artefact self-contained and cheap.

---

## Directory

### `memory-bank/project/` — project identity (slow-changing)

- `brief.md` — 30-second project understanding. **Load first, for every operation.**
- `domain.md` — business entities, workflows, rules.
- `vision.md` — problem space, solution approach (optional).
- `doc-guide.md` — style, length, and hygiene rules for every memory-bank file. **Load whenever writing or editing any memory-bank file.**

### `memory-bank/technical/` — technical knowledge (medium-changing)

- `stack.md` — tech stack, critical warnings, design decisions.
- `architecture.md` — system design, patterns, data flow.
- Add as needed: `frontend.md`, `backend.md`, `api.md`, `auth.md`, `deployment.md`, etc.

### `memory-bank/tasks/` — RAM layer (fast-changing, optional)

- `process.md` — how to maintain the files in this directory.
- `work/` — one file per topic (idea, in-flight work, draft spec). **Optional scratchpad.**
- `log/` — one file per completed unit of work (typically one file per merged PR).

Tasks is RAM memory for code work. It is **not** a task management system and does not replace Notion / Jira / Linear. A piece of work can ship without ever creating a `work/*.md` file — the `log/` entry is the only thing written on every completion (typically by automation). See `tasks/process.md`.

---

## Entry points

- **Claude Code**: skills (`.claude/skills/`) and path-scoped rules (`.claude/rules/`) name the memory-bank files for each operation; hooks (`.claude/settings.json`) pre-load context on lifecycle events; subagent definitions (`.claude/agents/`) package Claude-specific tool-restricted workers; root + nested `CLAUDE.md` carry the project-wide essentials. This file is read when authoring or updating any of those.
- **Cursor**: path-scoped rules under `.cursor/rules/` name the memory-bank files per area; hooks (`.cursor/hooks.json`), skills (`.cursor/skills/`), and Agent-Requested rules add per-operation routing; the always-on essentials rule covers project-wide essentials. This file is read when authoring or updating those.
- **Codex CLI**: `AGENTS.md` (root + nested) names the memory-bank files per area; hooks in `.codex/config.toml` and skills in `.agents/skills/` add operation-scoped routing. This file is read when authoring or updating those.
- **Gemini CLI**: `GEMINI.md` (root + nested) names the memory-bank files (or imports them via `@path`); hooks in `.gemini/settings.json` and custom slash commands in `.gemini/commands/` add operation-scoped routing. This file is read when authoring or updating those.
- **Generic agent (custom, system-prompt-only)**: load this file at session start via `template/integrations/generic/prompt-snippet.md` — it acts as the runtime router for tools without skills/hooks/path-scoped rules.

---

## DMB vs READMEs vs external docs

Three audiences, three destinations. Full rule: `docs/what-goes-where.md`.

| Who reads it | Where |
|---|---|
| AI agent writing code in this repo | `memory-bank/` |
| Teammate understanding architecture / current work | `memory-bank/` |
| Dev setting up / running locally | `README.md` (per package) |
| Reader outside the code work (other team, external consumer, regulator) | external-docs folder (your choice of name) |

**Default: memory-bank.** When unsure, put it here. External-docs is a narrow exception.

---

## Context loading rules

### Always load

- `memory-bank/project/brief.md` — project overview.
- (If using the RAM layer) glance at `memory-bank/tasks/work/` to see what's in flight. Skip if empty.

### Operation-specific

Load only what's relevant to what you're doing.

#### DEVELOPMENT — features, bugs, code changes

- `memory-bank/technical/stack.md` — tech stack reference.
- `memory-bank/technical/[frontend|backend].md` (if those files exist) — area-specific patterns.
- `memory-bank/technical/quality.md` (if present) — coding standards, testing expectations.

If API-related: `memory-bank/technical/api-standards.md` (if present).
If architecture changes: `memory-bank/technical/architecture.md`.

#### BUSINESS / DOMAIN — requirements, business logic

- `memory-bank/project/domain.md`
- `memory-bank/project/vision.md` (if present)

#### DATABASE / DATA — schema, migrations, data modelling

- `memory-bank/technical/architecture.md` — data flow, system data architecture.
- `memory-bank/project/domain.md` — entities, business rules.

#### DEBUGGING — issues, troubleshooting, performance

- `memory-bank/technical/stack.md` — environment, known issues.
- `memory-bank/technical/architecture.md` — component relationships, data flow.
- `memory-bank/project/domain.md` — only if the issue is domain-related.

#### DEPLOYMENT — infrastructure, CI/CD

- `memory-bank/technical/deployment.md` (if present).
- `memory-bank/technical/architecture.md` — for major infrastructure changes.

#### CODE_QUALITY — testing, linting, formatting

- `memory-bank/technical/quality.md` (if present).
- `memory-bank/technical/testing-strategy.md` (if present) — when writing tests.
- `memory-bank/technical/stack.md` — quality-tool configuration.

#### DOCUMENTATION — writing READMEs, updating DMB, deciding where a doc goes

- `memory-bank/project/doc-guide.md` — style, length, and hygiene rules. **Required when writing or editing any memory-bank file.**
- `docs/what-goes-where.md` in this standard's documentation, or your project's equivalent rule — the three-audience guide.
- `memory-bank/tasks/process.md` — update workflow for the RAM layer.

---

## Examples

### Example 1 — Adding a new frontend component

Operation: DEVELOPMENT (frontend).

Load:
1. `memory-bank/project/brief.md`
2. `memory-bank/technical/stack.md`
3. `memory-bank/technical/frontend.md` (if present)
4. `memory-bank/technical/quality.md` (if present)

### Example 2 — Adding a backend API endpoint

Operation: DEVELOPMENT (backend).

Load:
1. `memory-bank/project/brief.md`
2. `memory-bank/technical/stack.md`
3. `memory-bank/technical/backend.md` (if present)
4. `memory-bank/technical/api-standards.md` (if present)

### Example 3 — Database schema change

Operation: DATABASE.

Load:
1. `memory-bank/project/brief.md`
2. `memory-bank/technical/architecture.md`
3. `memory-bank/project/domain.md`

### Example 4 — Debugging a production issue

Operation: DEBUGGING.

Load:
1. `memory-bank/project/brief.md`
2. `memory-bank/technical/stack.md`
3. `memory-bank/technical/architecture.md`
4. `memory-bank/project/domain.md` (if domain-related)
5. Recent entries in `memory-bank/tasks/log/` (if recent merged work may be the cause).

---

## Tips

- **Start narrow**: load only what the operation needs.
- **Expand on demand**: add optional files when you hit a gap, not pre-emptively.
- **Skip unrelated files**: frontend files for backend work are just noise.
- **`work/*.md` is optional**: if there's nothing there for the topic at hand, that's fine — don't invent one.
- **Cross-link related files**: when a knowledge file references concepts covered elsewhere (e.g. `technical/architecture.md` mentions a domain entity defined in `project/domain.md`), add a plain markdown link. Helps both humans and agents navigate without re-reading everything.
