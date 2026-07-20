# Doc guide — writing & maintaining memory-bank files

> **Purpose**: style, length, and hygiene rules for every file inside `memory-bank/`. Keeps DMB compact, scannable, and free of bloat so AI agents can load just what they need.
> **When to use**: any time a memory-bank file is created or edited — by a human, by an agent, or by automation.

---

## Why this matters

DMB is loaded into AI context windows. Long, redundant, or padded files crowd out the signal the agent actually needs. Every line you don't write is a line another file gets to use.

Three principles drive the rules below:

1. **One purpose per file.** If a file does two things, split it.
2. **Reference, don't copy.** Duplicated content drifts. Link to the source of truth.
3. **Scale length to need.** A 30-line file is not failure. A 600-line file usually is.

---

## File length budgets

Targets, not hard limits. Crossing a budget is a signal to split, prune, or move detail elsewhere — not a violation.

| File | Target | Notes |
|---|---|---|
| `_index.md` | 100–200 lines | Inventory only. No prose, no narrative. |
| `project/brief.md` | 80–150 lines | 30-second project understanding. |
| `project/domain.md` | 150–300 lines | Entities, workflows, business rules. |
| `project/vision.md` | 80–150 lines | Strategic direction. Optional. |
| `project/doc-guide.md` | 120–160 lines | This file. Self-policing. |
| `technical/stack.md` | 80–150 lines | Quick tech reference. |
| `technical/architecture.md` | 150–300 lines | System design, data flow. |
| `technical/<topic>.md` (added) | 100–250 lines | Per-area deep dive (frontend, backend, auth, …). |
| `tasks/process.md` | 100–200 lines | Process for `work/` and `log/`. |
| `tasks/work/<slug>.md` | 30–150 lines | Grows during work, archived on merge. |
| `tasks/log/pr-<n>-<slug>.md` | 3–20 lines | Scale to complexity (see `tasks/process.md`). |

When a file approaches the upper bound, ask: is this two topics? Can older context move to a `tasks/log/` entry? Can examples move to `examples/` outside memory-bank?

---

## File structure

Every memory-bank file starts the same way:

```markdown
# <Title>

> **Purpose**: <one line — what this file is for>
> **When to use**: <one line — when an agent should load it>

---

<content with scannable headers>
```

- Scannable `##` headers. No 200-word paragraphs.
- Tables for anything comparable (rules, file types, decisions).
- Code blocks for commands, frontmatter, structure examples.
- No "last updated" stamps inside file bodies — git tracks that.

---

## Content discipline

### Do

- **Bullets over paragraphs.** Three short bullets beat one long sentence.
- **One purpose per file.** Split when a second topic emerges.
- **Reference, don't copy.** Use `memory-bank/<path>/<file>.md` — relative, no `@` prefix.
- **Cover the *why*.** Decisions and rationale belong in DMB; obvious *what* belongs in the code.
- **One canonical example.** If a pattern needs an example, show it once well — not five times.

### Don't

- **Don't duplicate content across files.** Link instead. Duplication drifts.
- **Don't repeat the same example with minor variations.** One example, then a list of variants if needed.
- **Don't write marketing language.** "Powerful," "seamless," "robust" — strip them.
- **Don't include personal opinions as facts.** Either back it with rationale or omit it.
- **Don't restate the code.** If a reader can learn it from the file, leave it out.
- **Don't document what's table stakes** (tests pass, lint clean, formatter ran). Achievements live elsewhere.

---

## What does NOT belong in memory-bank

- Quality-check results (tests, linters, formatters — always required).
- Routine maintenance ("bumped dep X", "renamed file Y") — git history covers it.
- Step-by-step recipes for things the agent can derive from the code.
- Setup/run commands aimed at humans — those live in `README.md`.
- External-team docs — those live in your external-docs folder.

If in doubt, apply the test from `docs/what-goes-where.md`: *"Would I want an AI agent to load this file while writing code in this repo?"* No → it doesn't belong.

---

## When to split a file

Trigger any of these → split or prune:

1. **Two distinct purposes** have emerged. Split by purpose, not by length.
2. **Length budget exceeded** and the content is genuinely needed → split into `<topic>-<subtopic>.md` files and update `_index.md`.
3. **Scrolling fatigue** when you (a human) try to find something. The agent feels it too.
4. **Repeated section titles.** If `## Authentication` shows up in three technical files, it probably wants its own file.

Splitting checklist:

- Create the new file with the standard header (Purpose + When to use).
- Move the content. Don't leave it duplicated.
- Update `_index.md` to list the new file.
- Update any integration-layer artefact (skill, rule, hook, prompt-snippet) that loads the original.

---

## Cross-references

Always relative paths from repo root:

```markdown
See `memory-bank/technical/architecture.md`.
Details in `memory-bank/project/domain.md` under "Workflows".
```

- No `@`-prefixed paths (tool-specific, breaks portability).
- No bare filenames — full path so future readers (and grep) can find it.
- Link to a section when the file is large: `memory-bank/technical/architecture.md` → `Data flow`.

---

## Editing rhythm

- **Slow-changing layers** (`project/`, `technical/`): edit when the underlying truth shifts. Not on every PR.
- **Fast-changing layer** (`tasks/`): edit during and after work. See `tasks/process.md`.
- **`_index.md`**: edit immediately when you add, rename, or remove a memory-bank file. Stale inventory is worse than no inventory.

---

## Anti-patterns

- **Padding to look thorough.** Length signals nothing. Cut.
- **"Comprehensive" guides that repeat the docs.** Link to the upstream docs and capture only what's project-specific.
- **Decisions buried in prose.** Use a small table or `Decision: … / Reason: …` block.
- **Files that exist because the template had them.** Empty or boilerplate files cost loading attention. Delete or fill.
- **Long examples that drift from real code.** Either keep examples small enough to maintain, or move them under `examples/`.

---

## Self-check before saving

Ask three questions:

1. Is anything here already said elsewhere in `memory-bank/`? → link instead.
2. Could a reader skim headers and tables and still get the point? → if no, restructure.
3. Would removing this paragraph change what the agent does? → if no, remove it.
