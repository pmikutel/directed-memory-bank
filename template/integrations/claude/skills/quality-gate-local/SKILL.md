---
name: quality-gate-local
description: Use before commit or before opening a PR — runs the project's local quality gate (format, lint, type, test) and confirms output
---

# quality-gate-local

Routing skill for the local quality gate (format, lint, type, test). Loads the memory-bank files that document the project's quality commands.

Load:

- `memory-bank/technical/quality.md` (if present)
- `memory-bank/technical/testing-strategy.md` (if present)
- `memory-bank/technical/stack.md` (for tool configuration)

Run the project's quality commands as documented in the loaded files. Report each step's exit status; do not claim "passes" without showing the output. Evidence before assertions.

No knowledge in this file — the listed files are the source. `memory-bank/_index.md` is the inventory if you need to discover what else exists.
