# Automation patterns

DMB is just markdown files, but once a team is writing to it — humans *and* bots — you need a pattern that stays conflict-free. This page documents the patterns the standard is built around. It does not prescribe a specific automation stack; the actual workflows are examples.

---

## The core pattern: file-per-item

The single most important rule:

> **Every write targets a unique file owned by exactly one writer at a time.**

Applied to the RAM layer:

- `tasks/work/<slug>.md` — one file per topic. The topic's author owns it while it's active.
- `tasks/log/pr-<num>-<slug>.md` — one file per completed unit of work. Created by automation on merge (or by a human). Never edited after creation except in rare correction cases.

Appending to a shared file (`progressLog.md`, `activeContext.md`, `backlog.md`) is **not** a valid pattern under concurrent writers. It used to be — the first version of this standard recommended it — but it breaks at any meaningful team size.

---

## Linking external events to `work/` files

When a bot needs to react to an event (PR open, PR merge, CI failure) and link it to a scratchpad file, the canonical matching rule is:

> **Scan `tasks/work/*.md` for frontmatter `branch:` equal to the event's branch. Zero or multiple matches → skip linking.**

Why this works:

- No manual wiring. The developer sets `branch: fix/choppy-audio` in their scratchpad when they start work. The bot finds it on its own.
- Deterministic. Exactly one match or nothing — no fuzzy matching, no heuristics.
- Fails safe. If the developer didn't create a scratchpad, the bot just writes a fresh `log/` entry from event metadata.

Example — PR-merge archiver pseudocode:

```
on pull_request: closed with merged == true:
  matches = scan tasks/work/*.md for frontmatter branch == PR.head_branch
  if len(matches) == 1:
      move matches[0] to tasks/log/pr-<PR.number>-<slug>.md
      append summary section from PR title / body / labels
      set status: done, merged_at: <date>
  else:
      create tasks/log/pr-<PR.number>-<slug>.md from PR metadata
      slug derived from PR title
```

---

## Bot identity and scoping

If you automate writes into DMB, use a **dedicated bot identity** (GitHub App, bot user, whatever your platform provides) with the narrowest possible scope.

Recommended scoping:

- Write access to `memory-bank/tasks/work/**` and `memory-bank/tasks/log/**`.
- **No** write access to `memory-bank/project/**`, `memory-bank/technical/**`, or anything else.

This keeps the bot from ever touching architectural knowledge that needs human judgement, even if it misbehaves.

---

## Loop prevention

A bot that commits to the same repo it runs on can trigger itself. Three controls, use all three:

1. **Actor check.** In the workflow that writes to memory-bank, skip if the triggering actor is the bot: `if: github.actor != 'memory-bot[bot]'`.
2. **Paths-ignore.** In other workflows (tests, lint, etc.), add memory-bank paths to `paths-ignore` so bot commits don't re-trigger unrelated CI.
3. **Branch protection exception.** If `release/develop` or equivalent is protected, scope the bot's exemption to the memory-bank paths only.

---

## Reference: GitHub Actions sketch

This is illustrative, not a prescription. Adapt to your platform.

```yaml
# .github/workflows/memory-bank-archive.yml
name: DMB — archive merged PRs
on:
  pull_request:
    types: [opened, closed]

permissions:
  contents: write
  pull-requests: read

jobs:
  archive:
    if: github.actor != 'memory-bot[bot]'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.MEMORY_BOT_TOKEN }}
      - name: Archive or link scratchpad
        run: scripts/memory-bank-archive.sh
        env:
          EVENT: ${{ github.event.action }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
          PR_BRANCH: ${{ github.event.pull_request.head.ref }}
          PR_TITLE: ${{ github.event.pull_request.title }}
          PR_MERGED: ${{ github.event.pull_request.merged }}
      - name: Commit and push
        run: |
          git config user.name "memory-bot"
          git config user.email "memory-bot@users.noreply.github.com"
          git add memory-bank/tasks/
          if ! git diff --cached --quiet; then
            git commit -m "memory-bot: update tasks for PR #${PR_NUMBER}"
            git push
          fi
```

And in the test / lint workflow:

```yaml
on:
  pull_request:
    paths-ignore:
      - 'memory-bank/tasks/work/**'
      - 'memory-bank/tasks/log/**'
```

---

## What the standard does NOT do

- **Provide a CLI or validation tool.** The standard is deliberately un-opinionated about tooling.
- **Ship production automation.** The example above is a sketch for illustration, not a maintained action.
- **Dictate your choice of version-control host.** The patterns work with GitHub, GitLab, Bitbucket, Gerrit, or anything else that emits events and accepts commits from a bot identity.
- **Mandate automation at all.** Using DMB entirely by hand is a valid adoption level. Automation is opt-in.

---

## When to add automation

Adopters typically add blocks in this order:

1. **Nothing.** DMB maintained by hand, no bots. Fine for small teams.
2. **PR-merge archiver.** Single most valuable automation — every merged PR produces a `log/` entry without human effort.
3. **PR-open linker.** Optional. Links an in-flight scratchpad to the opened PR so the bot knows which file to move on merge.
4. **Stale-scratchpad reminder.** Cron that opens an issue when a `status: active` scratchpad hasn't been updated in a while.
5. **Observability → scratchpad loop.** Production errors auto-open a PR adding a `work/<slug>.md` with `status: idea` for humans to triage.

Each block is independently useful. Stop whenever returns diminish.
