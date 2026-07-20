# Migration — from single-file RAM layer to `work/` + `log/`

If you adopted DMB with `activeContext.md` / `progressLog.md` / `backlog.md` / `tasks/specs/` — the previous shape — this page covers the one-off migration to the current shape (`tasks/work/` + `tasks/log/`).

The standard does not maintain backwards-compatibility shims. This migration is intended as a one-off change, landed in a single PR.

---

## What's changing at a glance

| Before | After |
|---|---|
| `tasks/activeContext.md` (single file, everyone appends) | `tasks/work/<slug>.md` with `status: active` (one file per topic) |
| `tasks/backlog.md` (single file, everyone appends) | `tasks/work/<slug>.md` with `status: idea` or `status: planned` |
| `tasks/progressLog.md` (single file, ever-growing) | `tasks/log/pr-<num>-<slug>.md` (one file per merged PR, flat directory) |
| `tasks/specs/` (subdirectory for detailed specs) | `tasks/work/<slug>.md` with `status: planned` (same home, richer body) |
| `tasks/memoryProcess.md` or `tasks/process.md` | `tasks/process.md` (unchanged name if you're on the recent template) |
| `activeContext.md` / `progressLog.md` references in CLAUDE.md, Cursor rules, etc. | Replace with `tasks/work/` and `tasks/log/` |

## Why the change

Single-file append patterns break under concurrent writers. As teams adopted the standard and automations started writing progress logs, merge conflicts on `progressLog.md` / `activeContext.md` became a daily occurrence. The file-per-item layout is conflict-free by design.

Also: in practice, `backlog` / `active` / `spec` turned out to be maturity levels of the same thing (a topic with context), not separate locations. One `work/` directory with a `status:` field in frontmatter is simpler.

---

## One-off migration steps

### 1. Create the new directories

```bash
mkdir -p memory-bank/tasks/work memory-bank/tasks/log
touch memory-bank/tasks/log/.gitkeep
```

### 2. Move specs

Each file in `tasks/specs/*.md` becomes one file in `tasks/work/` with `status: planned` frontmatter. A file called `tasks/specs/user-profiles.md` becomes `tasks/work/user-profiles.md`:

```yaml
---
title: User profiles
status: planned
priority: medium
branch:
pr:
started:
updated: <today>
---

(original body unchanged)
```

If a spec is already shipped, move it straight to `tasks/log/` instead (you'll need to retrofit the PR number).

### 3. Split `backlog.md`

Each backlog entry → one `tasks/work/<slug>.md` file with `status: idea` or `status: planned` depending on how far along planning is. Discard structural headings ("High priority", "Medium priority", "Low priority"); they're replaced by a `priority:` field in frontmatter.

Small entries (two-line bullet points) → two-line `work/` files. Don't pad.

### 4. Split `activeContext.md`

Each in-flight task block in `activeContext.md` → one `tasks/work/<slug>.md` with `status: active`. Fill in `branch:` if you can identify it, so future automation can link it to the PR.

### 5. Archive `progressLog.md`

Two options:

- **Simple (recommended)**: keep the whole file as `tasks/log/_archive-pre-migration.md`. New entries from this point forward go to per-PR files. The archive stays as one big historical record.
- **Thorough (more work)**: split each entry in `progressLog.md` into its own `tasks/log/pr-<num>-<slug>.md`. Usually not worth the effort — git history is still there.

### 6. Delete old files and directories

```bash
git rm memory-bank/tasks/activeContext.md
git rm memory-bank/tasks/backlog.md
# Keep or rename tasks/progressLog.md per step 5
git rm -r memory-bank/tasks/specs  # after all specs have been moved
```

### 7. Refresh integration files

Update any reference to old file names:

- `CLAUDE.md` — copy the latest `template/integrations/claude/CLAUDE-template.md` and re-fill project specifics.
- `.cursor/rules/memory-bank.mdc` — copy the latest `template/integrations/cursor/memory-bank.mdc`.
- Generic agent prompts — refresh from `template/integrations/generic/prompt-snippet.md`.

Grep for any remaining references:

```bash
grep -rn "activeContext\|progressLog\|memoryProcess" .
```

### 8. Update `_index.md`

Copy the latest `template/memory-bank/_index.md` and re-adapt to your project's actual `technical/` files. The manifest now describes `work/` + `log/` instead of the old structure.

### 9. Update `process.md`

Same — copy the latest `template/memory-bank/tasks/process.md`.

### 10. (Optional) Add automation

If you want bot-driven archival on PR merge, see `docs/automation-patterns.md` and the `examples/complete/` example (its `.github/` workflow and `tasks/` layer).

---

## Scripted version

A rough bash script that does steps 1, 5 (simple), and 6:

```bash
#!/usr/bin/env bash
set -euo pipefail
cd memory-bank/tasks

mkdir -p work log
touch log/.gitkeep

if [ -f progressLog.md ]; then
  mv progressLog.md log/_archive-pre-migration.md
fi

# Manual steps remain: splitting backlog / activeContext / specs into work/
echo "Now split backlog.md, activeContext.md, and specs/ into work/*.md by hand or with another script."
echo "Then run: git rm backlog.md activeContext.md && git rm -r specs"
```

The splits in steps 2–4 are deliberately left manual — they require judgement about slug names and frontmatter values that a blind script would get wrong.

---

## After migration

Your DMB is now on the current shape. Going forward:

- New topics → create a `tasks/work/<slug>.md` when a scratchpad helps (optional).
- Merged PRs → `tasks/log/pr-<num>-<slug>.md` (automation or by hand).
- Single-file appends no longer happen anywhere in the RAM layer.

If you later add automation, the file-per-item design lets many writers coexist without conflicts. See `docs/automation-patterns.md`.
