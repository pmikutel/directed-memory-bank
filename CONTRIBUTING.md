# Contributing to Directed Memory Bank

Hello, and thanks for thinking about contributing! DMB is a small but opinionated project, and outside perspectives genuinely make it better. This file describes what kinds of contributions fit, how to propose changes, and what to expect after you submit one.

If anything below feels unclear, the safest move is to open an issue and ask — friendly questions are always welcome.

## What we welcome

- **Integration template improvements** — keeping `template/integrations/<tool>/` current as Claude Code, Cursor, Codex, and Gemini ship new mechanisms.
- **Documentation clarity** — better wording, missing examples, fixed cross-references, broken links.
- **New example projects** — well-shaped, realistic but not domain-locked. The current set is `minimal/` and `complete/`; a monorepo example is on the wishlist.
- **CLI features and fixes** — the `dmb` TypeScript CLI lives under `cli/`. Currently ships `dmb init`; `dmb lint`, `dmb new work`, and `dmb archive` are on the roadmap.
- **Bug reports and design feedback** — even *"I tried adopting this and bounced off step X"* is genuinely useful.

## What we don't take in core

- **Per-stack starters** — *"DMB for Next.js"*, *"DMB for Django"*, etc. These belong in your own repo or eventually as community-maintained plugins. Keeping the core stack-agnostic is deliberate.
- **Per-domain memory-bank content** in the standard examples. Examples ship structural shape, not specific business knowledge.
- **MCP server** — we've thought about it and chosen to defer; the read path is already covered by deterministic skills / hooks / path-rules. See `decisions.md` in our planning notes for the full reasoning.

If you're unsure whether your idea fits, please open an issue first. We'd rather have the conversation upfront than ask you to rework a PR afterwards.

## Before you start coding

- **For typos, broken links, or other small fixes:** just open a PR — no need to ask first.
- **For anything bigger** (new template, new doc, CLI feature, design change) **please open an issue first** so we can align on the approach. Saves you wasted effort on something that doesn't fit.
- **Check existing issues** — your idea might already be tracked.

## Local development

```bash
git clone https://github.com/pmikutel/directed-memory-bank.git
cd directed-memory-bank
```

**For doc and template edits:** open the files in your editor and that's it. There's no build step for markdown.

**For CLI development:**

```bash
cd cli
npm install
npm run build      # compile TypeScript + copy template files
npm test           # run the test suite (vitest)
```

After `npm run build`, you can run the CLI directly: `./bin/index.js init` (or `npm link` to install it globally as `dmb` while you develop). The CLI is TypeScript in strict mode. Tests live alongside the source under `cli/src/`. See `cli/README.md` for end-user usage.

## Conventions

- **Commit messages:** [Conventional Commits](https://www.conventionalcommits.org/) format — `type(scope): subject`. Common types: `feat`, `fix`, `docs`, `chore`, `refactor`. The scope is optional (e.g. `feat(cli):`, `docs(integrations):`). Examples from this repo's history make good reference.
- **PR title:** match the commit subject. Keep it under ~70 characters.
- **Sign-off (optional but appreciated):** `git commit -s` adds a [Developer Certificate of Origin](https://developercertificate.org/) trailer. Helps if we ever need to relicense or transfer ownership down the road.
- **Branch naming:** anything reasonable — `feat/dmb-lint`, `fix/cursor-rule-typo`, `docs/contributing`. No strict template required.

## Style and voice

DMB is opinionated about its own writing — that's part of what makes it useful as a knowledge layer.

- **For files under `template/memory-bank/`** (and the examples that mirror them), please follow [`doc-guide.md`](template/memory-bank/project/doc-guide.md). It carries length budgets per file, content-discipline rules (bullets over paragraphs, one canonical example, no padding), and the "reference don't copy" principle.
- **For integration-layer files** (`template/integrations/<tool>/*`, `docs/integrations/<tool>.md`), the load-bearing principle is **thin pointers, not duplicated knowledge** — every template should *name* memory-bank files for an operation, never copy their content. See [`docs/integration-architecture.md`](docs/integration-architecture.md) for the full model.

In general: bullets over paragraphs; no marketing language (*"powerful"*, *"seamless"*, *"robust"* — strip them); don't restate the code; don't document table-stakes achievements (tests passing, lint clean).

## AI-generated PRs

We love that AI assistance makes contribution faster — many of us use it daily. Two simple asks:

1. **Disclose** that you used AI assistance — a one-line note in the PR description is plenty. *"Drafted with Claude / Cursor / Copilot, then reviewed and adjusted."*
2. **You remain responsible** for the changes. Be ready to explain decisions and respond to review comments yourself. Style-matched, doc-guide-following, principle-aligned PRs are great regardless of how they were drafted.

Slop PRs (verbose, off-style, contradicting the very docs they edit) we'll close politely with a pointer to this section. If your AI suggests a change that violates `doc-guide.md` or `integration-architecture.md`, push back on the AI — those docs are the source of truth.

## What happens after you submit

- **Initial response:** we aim for within a week. We may ask clarifying questions or suggest changes before doing a full review.
- **Review:** focuses on principle alignment first, then implementation details. Expect comments — they're meant to land the contribution cleanly, not to gatekeep.
- **Merging:** we squash PRs into `main`. The PR title becomes the merge commit subject.

## Recognition

Contributors are credited in release notes and on the project page. Non-code contributions count just as much — documentation improvements, design feedback, real-world bug reports, example projects. We're happy to add you to a `CONTRIBUTORS` file or an all-contributors table once that's set up.

## Code of Conduct

We aim for a friendly, professional space — be kind to each other. A formal Code of Conduct (likely [Contributor Covenant](https://www.contributor-covenant.org/)) will land soon. Until then, the same standard applies in spirit: no harassment, no personal attacks, treat people with respect.

## Questions?

- **Usage questions** ("how do I use this?", "is this a good fit for my project?") → open a [discussion](https://github.com/pmikutel/directed-memory-bank/discussions).
- **Bugs and proposals** → open an [issue](https://github.com/pmikutel/directed-memory-bank/issues).
- **Security concerns** → see [`SECURITY.md`](SECURITY.md).

Thanks again for being here — we're glad you're considering helping out.
