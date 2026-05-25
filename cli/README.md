# directed-memory-bank

[Directed Memory Bank (DMB)](https://github.com/pmikutel/directed-memory-bank) — persistent project understanding for AI coding agents.

> **Status: name reservation in progress (v0.0.1 placeholder).**
> The real installer ships at v0.1.0. Until then, this package only holds the name on npm.

## Future usage

```bash
npx directed-memory-bank init
```

Creates `memory-bank/` in your project with the standard structure. After install, open your AI tool of choice (Claude Code, Cursor, Codex, Gemini) and say:

> "follow memory-bank/INSTALL.md to set up my DMB"

The AI walks you through filling the structured markdown files — `project/brief.md`, `technical/stack.md`, `technical/architecture.md`, and so on — tailored to your project. No server, no lock-in, just files.

## Why not `memory-bank` directly?

`memory-bank` is also reserved by this project as a defensive alias — `npx memory-bank` prints a redirect to `npx directed-memory-bank init`. The "Directed" qualifier in the canonical name reflects that DMB extends the broader [Cline Memory Bank](https://docs.cline.bot/prompting/cline-memory-bank) pattern with operation-scoped routing.

## License

MIT
