---
title: Example topic — delete me
status: idea
priority: medium
branch:
pr:
started:
updated: 2026-04-24
---

# Example topic — delete me

> **This file is a template.** Replace or delete it when you add real content to `work/`.

---

## What is this file?

A scratchpad for a single topic — an idea, a piece of work, an in-flight investigation. One file per topic, named with a human-readable kebab-case slug (e.g., `choppy-audio-issue.md`, `add-stripe-webhooks.md`).

## Frontmatter

| Field | Purpose | Required? |
|---|---|---|
| `title` | Human-readable title (can differ from slug) | Yes |
| `status` | `idea` / `planned` / `active` / `blocked` / `paused` / `done` | Yes |
| `priority` | `low` / `medium` / `high` | Optional |
| `branch` | Git branch name. Set when work begins. Enables automation to link this file to a PR. | Optional |
| `pr` | PR number. Typically set by automation when a PR opens. | Optional |
| `started` | Date work began (`YYYY-MM-DD`) | Optional |
| `updated` | Last updated date. Keep fresh if you want tooling to flag staleness. | Optional |

## Body

Free-form markdown. Typical structure as the topic matures:

- **Why / context** — what problem, why it matters, how you stumbled on it.
- **Approach / plan** — rough or detailed, depending on maturity.
- **Open questions** — things you don't know yet.
- **Links** — to tickets, PRs, discussions, related files in `technical/` or `project/`.

Keep it small. When a topic graduates from "scribble" to "full spec," the same file simply grows — no rename, no move.

## Lifecycle

1. **Idea** — file created, a few lines, `status: idea`. May sit for weeks.
2. **Planned** — prioritised, detail accrues, `status: planned`.
3. **Active** — work begins, `branch:` set, `status: active`. Automation may set `pr:` when a PR opens.
4. **Done** — PR merges → automation (or you) moves this file to `log/pr-<num>-<slug>.md`.

See `tasks/process.md` for the full workflow and the optionality clause (you can skip `work/` entirely if you don't need a scratchpad for a given piece of work).
