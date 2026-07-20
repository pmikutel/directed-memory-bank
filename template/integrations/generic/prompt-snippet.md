# DMB — Prompt Snippet for Any AI Agent

Copy the text below into your agent's system prompt, instructions file, or configuration.

> **A note before you copy.** A system-prompt snippet is the *baseline* mechanism — fine for any tool, but rarely the strongest one a given tool offers. The standing principle is **"use what works today"**: for each tool, lead with the most reliable mechanism it supports — path-scoped rules in Cursor, hooks and skills in Claude Code, agent-definition files in Codex, and so on. Treat the snippet below as a fallback when no stronger mechanism is available, or as the always-loaded baseline that tier-1 mechanisms build on top of. See `docs/integration-architecture.md` for the model and per-tool ladders.

---

## Snippet

```
## Project Context

This project uses Directed Memory Bank (DMB) for structured project knowledge.

### How to use it

1. **Always read first**: `memory-bank/project/brief.md` (project overview).
2. **Read the manifest**: `memory-bank/_index.md` lists every file that exists and defines
   operation-specific loading rules.
3. **Glance at current work (optional)**: `memory-bank/tasks/work/` may contain
   per-topic scratchpads. If nothing relevant exists, skip.
4. **Load by operation**: follow the manifest for the type of work you're doing
   (development, debugging, deployment, ...). Load only what's relevant.
5. **Don't load everything**: read only what's needed for the current task.

### Updating context files

When explicitly asked to update DMB:
- **First, read `memory-bank/project/doc-guide.md`** — style, length, and hygiene rules for every memory-bank file. Required reading before any write.
- `tasks/work/<slug>.md` — update frontmatter (`status`, `branch`, `updated`) as state changes.
  Create new files only when a scratchpad would actually help.
- `tasks/log/pr-<num>-<slug>.md` — normally written by automation on PR merge.
  Scale entry length to complexity (simple: 3-6 lines, medium: 8-12, major: 15-20).
- Never document routine quality checks as achievements.
- `technical/` and `project/` files — update when architecture, domain, or conventions change.
- If a `log/` entry's rationale is becoming a coding rule (recurs across PRs, or someone cites it as a rule), **promote** it to the relevant `technical/<topic>.md` per `tasks/process.md`. Leave the log entry intact. Do not create a `decisions/` directory.

### Where docs live

- Code-context docs (architecture, domain, conventions): `memory-bank/`
- Setup / run commands: `README.md`
- Docs for readers outside the codebase: external-docs folder (repo-specific name)

Default on ambiguity: memory-bank.
```
