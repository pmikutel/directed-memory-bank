# Complete example — what a fully-filled DMB looks like end-to-end

This is **reference material**, not a starting point.

The content here is from a fictional book-tracking webapp called *BookShelf*. It's the one place that shows a DMB with all layers filled and composed together — the knowledge layer (`project/` + `technical/`), the RAM layer (`tasks/`), and an optional CI automation sketch. Use it to answer *"what does a mature DMB actually look like?"* — for inspiration, not for copying verbatim.

When you fill your own DMB, your project's content is yours. Don't import BookShelf's domain, stack, or prose. Use this only as a pattern for shape and depth.

## How to use this

- **Manual fillers:** open the relevant file here side-by-side with your own (`memory-bank/project/brief.md` etc.) as a structural pattern.
- **AI-driven install:** the install flow at `memory-bank/INSTALL.md` references these files when offering shape inspiration.

## What's here

```
complete/
├── memory-bank/
│   ├── _index.md                # Filled manifest for BookShelf
│   ├── project/
│   │   ├── brief.md             # Project overview, goals, scope
│   │   ├── domain.md            # Business entities, workflows, rules
│   │   └── vision.md            # Long-term vision, target users, pain points
│   ├── technical/
│   │   ├── stack.md             # Tech stack with rationale
│   │   └── architecture.md      # System design and decisions
│   └── tasks/                   # RAM layer — the fast-changing scratchpad
│       ├── process.md           # How work/ + log/ are maintained
│       ├── work/
│       │   ├── add-pagination-to-users-list.md   # status: active, linked to PR #102
│       │   └── investigate-slow-dashboard.md     # status: idea
│       └── log/
│           └── pr-101-add-user-export.md         # completed work
└── .github/                     # Optional — advanced, not required to use DMB
    └── workflows/
        └── memory-bank.yml.example               # Illustrative CI archiver
```

## The `tasks/` (RAM) layer

The RAM layer is memory for code work — not a task manager, and not a replacement for Jira/Linear/Notion. It shows three maturity levels:

1. **An `idea`** (`investigate-slow-dashboard.md`) — a hunch captured without detail, no branch yet.
2. **An `active` file** (`add-pagination-to-users-list.md`) — carries `branch:` and `pr:` in frontmatter, populated when the PR opens.
3. **A `log/` entry** (`pr-101-add-user-export.md`) — the permanent record of a merged PR.

A piece of work can ship without ever creating a `work/*.md` file — the `log/` entry is the only thing written on every completion (typically by automation). See `tasks/process.md`.

## Optional: the CI automation (`.github/`)

**This part is advanced and entirely optional — DMB works fine without it.** The workflow is *illustrative*, not a maintained action. It sketches a GitHub Actions job that, on PR merge:

- Scans `tasks/work/*.md` for frontmatter `branch:` matching the PR's head branch.
- Moves the matched file to `tasks/log/pr-<num>-<slug>.md` and appends a summary.
- Falls back to creating a fresh log entry from PR title/body if no match.

To adopt it in your own repo:

1. Copy `.github/workflows/memory-bank.yml.example` to `.github/workflows/memory-bank.yml`.
2. Create a `memory-bot` GitHub App with `contents:write` scoped to `memory-bank/tasks/work/**` and `memory-bank/tasks/log/**`. Store its token as `MEMORY_BOT_TOKEN`.
3. Write the archive script `scripts/memory-bank-archive.sh` the workflow invokes — left to you, since it's tailored to your conventions.
4. Add `paths-ignore: ['memory-bank/tasks/work/**', 'memory-bank/tasks/log/**']` to your test/lint workflows so bot commits don't retrigger CI.

See `docs/automation-patterns.md` for the full pattern (branch-name matching, bot identity scoping, loop prevention).

## What's *not* here

- A working app, or any source code. This is a DMB instance only.

---

For the bare minimum floor (4 files, no RAM layer), see `examples/minimal/`.
