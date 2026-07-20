# Tasks — process & maintenance

> **Purpose**: how to use `tasks/work/` and `tasks/log/`, when to update what, and the rules for maintaining them.
> **When to use**: any time work context needs to be captured, linked to a PR, or archived.
> **See also**: `memory-bank/project/doc-guide.md` — style, length, and hygiene rules that apply to every memory-bank file, including the ones described here.

---

## What `tasks/` is

A **scratchpad** for code work. RAM memory for you and your AI assistant. Two directories:

| Path | Purpose | Who writes |
|---|---|---|
| `tasks/work/` | One file per topic (idea, in-flight work, draft spec). **Optional.** | Humans (and, optionally, automation that links PRs to matching files) |
| `tasks/log/` | One file per completed unit of work (typically one per merged PR). **Permanent.** | Typically automation on PR merge; can also be written on demand (directly or via AI) |

`tasks/` is **not** a task management system. It does not replace Notion, Jira, Linear, or any tool that defines *what* work exists. It captures **working context** while work happens.

---

## `work/` — optional scratchpad

### When to create a file

A `work/<slug>.md` exists only when it's useful. Three valid triggers:

1. **Idea-first.** You captured something worth remembering; it may sit for weeks.
2. **Ticket-first.** You picked up a task from an external system (Notion, Jira) and want a scratchpad while working.
3. **Mid-flight.** You're deep in an implementation and decide to split into two PRs — save context for the next one.

**You can ship a feature without ever creating a `work/` file.** Automation picks up the slack on the log side.

### Naming

Human-readable kebab-case slug. No PR number required (you don't have one until the PR opens). Examples:

- `choppy-audio-issue.md`
- `add-stripe-webhooks.md`
- `style-config-refactor.md`

### Frontmatter

```yaml
---
title: Choppy audio issue            # human-readable title
status: idea                         # idea | planned | active | blocked | paused | done
priority: medium                     # low | medium | high (optional)
branch:                              # set when work begins; enables PR-linking automation
pr:                                  # typically set by automation when a PR opens
started:                             # YYYY-MM-DD when work began
updated: 2026-04-24                  # keep fresh for staleness detection
---
```

### Lifecycle

```
Idea        status: idea         captured, may sit
  ↓
Planned     status: planned      prioritised, detail accrues
  ↓
Active      status: active       branch: set, work underway; automation may set pr: on PR open
  ↓
Done        file moves to log/pr-<num>-<slug>.md  (automation, or on demand)
```

---

## `log/` — the permanent record

### What goes here

One file per completed unit of work. In practice, "unit of work" usually means "one merged PR." If a topic merges in two PRs, you get two log entries.

### Naming

`pr-<number>-<slug>.md`

The slug is typically taken from the matching `work/*.md` (if one existed) or from the PR title.

### Frontmatter

```yaml
---
title: Choppy audio issue
status: done
pr: 398
branch: fix/choppy-audio
started: 2026-04-20
merged_at: 2026-04-23
---
```

### Body

A concise record of **what changed, why, and how** — scaled to complexity.

- **Simple fix (3–6 lines)**: one paragraph, key files.
- **Medium (8–12 lines)**: what changed, why, key decisions, notable files.
- **Major (15–20 lines)**: context, approach, trade-offs, migration notes, links.

**Do not document routine quality checks** (tests passing, lint clean). They're table stakes.

---

## Where decision rationale lives

The *why* behind a decision belongs in two places — they serve different readers:

| Place | Audience | Shape |
|---|---|---|
| `technical/<topic>.md` — inline `**Why:**` near the rule | Future code work (agent loading the file) | Compact, current truth |
| `tasks/log/pr-<n>-<slug>.md` | Historical debugging ("why did we do *that* in PR 147?") | Chronological journal |

They're complementary, not duplicate. `technical/` carries the *standing rule*; `log/` carries the *moment*. When a log entry's rationale stays load-bearing across PRs, promote it (see *Process: promote durable knowledge*). Never delete the log entry — history matters for debugging.

---

## Processes

### Process: capture an idea

1. Create `work/<slug>.md` with `status: idea`.
2. A few lines of context (what, why, where you noticed it).
3. Stop. Let it sit.

### Process: pick up an existing topic

1. Open `work/<slug>.md`.
2. Update frontmatter: `status: planned` or `status: active`, set `branch:` when starting.
3. Grow the body as the plan forms.

### Process: complete a unit of work

Two ways completion happens — pick what suits the project; both are first-class.

**Automated** (recommended where viable — see `docs/automation-patterns.md`):
- On PR merge, a CI hook moves the matching `work/*.md` (by `branch:`) to `log/pr-<num>-<slug>.md`, updates frontmatter (`status: done`, `pr:`, `merged_at:`), and appends a summary scaled to complexity.
- The same hook (or a follow-up step) runs the promotion evaluation in *Process: promote durable knowledge to `technical/`*.

**On-demand** — triggered by the user:
- Edit the files directly, or ask your AI ("complete the work on branch X", "promote this to technical/"). The `memory-bank-writer` skill loads on memory-bank writes and walks the same steps as the automation path: `work/` → `log/` move, then evaluate against the promotion triggers.
- If no `work/*.md` existed, create a fresh `log/` entry from the PR title and changeset.

### Process: promote durable knowledge to `technical/`

When a `log/` entry's rationale will keep mattering, lift the rule into the relevant `technical/<topic>.md`. Promotion is **additive** — the log entry stays.

Trigger any of:

- Same pattern appears in two or more `log/` entries.
- A reviewer or contributor cites the log entry as a coding rule.
- The next similar PR will need the same rationale.

Steps:

1. Identify the load-bearing fact (one rule or one constraint) in the log entry.
2. Open the right `technical/<topic>.md` — or create one if no fit exists, then update `_index.md`.
3. Add a section with the rule and a one-line `**Why:**` explanation. Follow `memory-bank/project/doc-guide.md`.
4. Link back to the source log entry(ies): `See tasks/log/pr-147-stripe-retries.md`.
5. Leave the log entry untouched.

### Process: pause work

1. Update `work/<slug>.md` frontmatter: `status: paused`.
2. Brief note in the body about why and what's next.
3. File stays in `work/` — no move.

### Process: abandon an idea

1. Delete the `work/<slug>.md`. No ceremony.

---

## Matching rule for automation

When a bot needs to link an external event (PR open / close) to a scratchpad, the convention is to scan `work/*.md` for frontmatter `branch:` equal to the event's branch. Zero or multiple matches → the bot skips the linking step. Deterministic, no manual wiring.

See `docs/automation-patterns.md` for implementation guidance.

---

## Quality checks

### Before ending a session

- If you started new work, did you create (or update) a `work/*.md`? Only required if a scratchpad would actually help you or your future self.
- If you finished work, is there a matching `log/pr-*.md` (by automation or on demand)?
- Are any `work/*.md` files with `status: active` stale — last updated weeks ago but no PR progress?

### Periodic review

- Look for `status: active` files with a stale `updated:` field. Flip them to `paused` with a note, or catch them up.
- Look for `status: idea` files older than (say) 6 months. Decide: promote, leave, or delete.

---

## Anti-patterns

- **Don't duplicate Jira.** `work/` is for context during code work, not a task system with deadlines and assignees.
- **Don't over-structure.** No subdirectories in `work/` or `log/`. Flat. If you feel the urge, reach for frontmatter first.
- **Don't append to shared files.** The whole layout is file-per-topic precisely to avoid merge conflicts when many writers are active.
- **Don't use `log/` as an active-work queue.** Active work stays in `work/` with `status: active`. `log/` is archive only.
- **Don't create a `decisions/` directory.** `log/` is already the chronological decision record; `technical/<topic>.md` carries the standing rule. A third location splits the rationale and drifts.
- **Don't delete `log/` entries when promoting.** Promotion copies the load-bearing fact into `technical/`; the log stays as the dated audit trail.
