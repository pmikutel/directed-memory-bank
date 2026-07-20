# Security Policy

DMB is a file convention — markdown templates, JSON schemas, and a small TypeScript CLI (`dmb init`). It has no server, no runtime daemon, and stores no secrets of its own. The attack surface is small but not zero: integration templates execute as hooks in users' AI tools, JSON schemas are parsed by editors and CI, and our docs steer users toward configuration choices that could be misused.

## Reporting a vulnerability

Please report security-relevant issues privately via [GitHub's security advisory mechanism](https://github.com/pmikutel/directed-memory-bank/security/advisories/new). We'll acknowledge within 7 days and coordinate disclosure with you.

In scope:

- **Integration templates** (`template/integrations/<tool>/`) that could leak credentials, escalate privileges, or enable arbitrary command execution when adopted as-is.
- **JSON schemas** (`template/memory-bank/.schemas/`) with parser-denial-of-service potential.
- **Docs** that mislead users into unsafe hook / skill / rule configurations.
- **`dmb` CLI** under `cli/` — anything that processes user input or writes to the filesystem.

## Out of scope

- **Vulnerabilities in the AI tools DMB integrates with** (Claude Code, Cursor, Codex CLI, Gemini CLI). Report those to the respective projects.
- **Issues in your own integration configuration.** See [docs/integrations/](docs/integrations/) for guidance, or open a regular issue.
- **Theoretical concerns about LLM behavior when reading memory-bank content** (prompt injection, jailbreaks, etc.). Those belong upstream with the model providers.

## Disclosure

Once a fix is ready, we publish a security advisory on the repo with credit to the reporter (unless you prefer to remain anonymous).
