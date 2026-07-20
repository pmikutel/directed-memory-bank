# Integration: Generic (Any AI Agent)

How to use DMB with any LLM-based coding agent.

> **First time setting up?** The simplest path is the AI-driven install flow. Open your agent in the project and tell it *"follow memory-bank/INSTALL.md to set up my DMB"*. The interview script is tool-agnostic — any agent that can read files and have a conversation can run it.

---

## The simple version

If your agent can read files, it can use memory-bank. Add this to your agent's system prompt or instructions:

```
Read `memory-bank/_index.md` to understand what project documentation exists
and when to load each file. Always start by reading `memory-bank/project/brief.md`
for project context. Optionally glance at `memory-bank/tasks/work/` for in-flight
topics (may be empty — that's fine).
```

## The prompt snippet

For a more complete integration, use the prompt snippet from `template/integrations/generic/prompt-snippet.md`. It includes manifest reading instructions, operation-type routing, and update guidelines for `tasks/work/` and `tasks/log/`.

## Works with

This approach works with any agent that can read local files:

- Custom agents built with any SDK
- IDE extensions with file access
- Any tool that only ingests a system prompt

> **For Codex CLI and Gemini CLI, prefer the dedicated integration docs:** [`codex-cli.md`](codex-cli.md) and [`gemini-cli.md`](gemini-cli.md). Both tools have richer mechanisms than a generic prompt snippet (hooks, hierarchical instruction files, slash commands / skills). Use the generic snippet as a fallback only.

## Automation

If you want bot-driven writes to `tasks/work/` and `tasks/log/` on CI events, see `docs/automation-patterns.md`. The pattern is tool-agnostic — works with GitHub Actions, GitLab CI, or anything that can emit events and run a script.
