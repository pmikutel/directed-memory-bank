# directed-memory-bank

Install [Directed Memory Bank (DMB)](https://github.com/pmikutel/directed-memory-bank) — persistent project understanding for AI coding agents.

## Usage

```bash
npx directed-memory-bank init
```

Creates `memory-bank/` in the current directory with the standard structure. After install, open your AI tool of choice (Claude Code, Cursor, Codex, Gemini) and say:

> "follow memory-bank/INSTALL.md to set up my DMB"

The AI walks you through filling the structured markdown files — `project/brief.md`, `technical/stack.md`, `technical/architecture.md`, and so on — tailored to your project. No server, no lock-in, just files.

## Flags

- `--force` — overwrite an existing `memory-bank/` directory

## License

MIT
