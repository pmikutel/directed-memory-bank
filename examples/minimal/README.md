# Minimal Example

The bare minimum memory-bank setup. 4 files, no RAM layer. Suitable for small projects or when you're just getting started.

## Structure

```
memory-bank/
├── _index.md          # Manifest — simplified routing
├── project/
│   └── brief.md       # What the project does
└── technical/
    ├── stack.md        # Tech choices
    └── architecture.md # System design
```

## When to grow

Add `tasks/` (RAM layer) when you start losing context between sessions. Add more `technical/` files (auth.md, api.md, deployment.md) when the project grows beyond what fits in stack.md and architecture.md.
