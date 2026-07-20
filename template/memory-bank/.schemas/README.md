# Frontmatter schemas

JSON Schemas that describe the YAML frontmatter of `tasks/work/*.md` and `tasks/log/*.md` files.

| File | Validates | Required fields |
|---|---|---|
| `work-frontmatter.schema.json` | `tasks/work/*.md` | `title`, `status` |
| `log-frontmatter.schema.json` | `tasks/log/pr-*.md` | `title`, `status`, `pr`, `merged_at` |

These are pure data files. Using them is **optional** — the memory bank works fine without ever pointing a validator at them. They exist so the structure can be enforced where you want enforcement (editor, CI).

---

## Use case 1 — editor support

The schemas are plain JSON-Schema documents. Most editors can be wired up with one config change.

**VS Code with the [Red Hat YAML extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)** — point `yaml.schemas` at the files. Validation applies to standalone `.yaml`/`.yml` files matching the glob; for markdown YAML frontmatter, the experience depends on which markdown-frontmatter helper extension you have installed. Sample `.vscode/settings.json`:

```json
{
  "yaml.schemas": {
    "./memory-bank/.schemas/work-frontmatter.schema.json": [
      "memory-bank/tasks/work/*.md"
    ],
    "./memory-bank/.schemas/log-frontmatter.schema.json": [
      "memory-bank/tasks/log/pr-*.md"
    ]
  }
}
```

**Other editors** (JetBrains, Neovim, Helix) — most have a JSON Schema/YAML language-server integration; point it at these files. Concrete syntax varies per editor.

When wired up, the editor:

- Autocompletes valid values for `status` (`idea`, `planned`, `active`, `blocked`, `paused`, `done`).
- Flags typos (e.g. `status: actiev`).
- Warns when required fields are missing.

If your editor doesn't validate markdown frontmatter natively, the CI path below still gives you full coverage.

---

## Use case 2 — CI validation

Validate every work and log file in CI with one step. Example (GitHub Actions):

```yaml
- name: Validate memory-bank frontmatter
  run: |
    npx --yes ajv-cli@5 validate \
      -s memory-bank/.schemas/work-frontmatter.schema.json \
      -d 'memory-bank/tasks/work/*.md' \
      --data-file-format=yaml-frontmatter
    npx --yes ajv-cli@5 validate \
      -s memory-bank/.schemas/log-frontmatter.schema.json \
      -d 'memory-bank/tasks/log/pr-*.md' \
      --data-file-format=yaml-frontmatter
```

(`ajv-cli` doesn't read YAML frontmatter out of markdown natively — you may need a tiny shim that extracts the `---` block first. Several open implementations exist. The future `dmb lint` command will wrap this end-to-end.)

---

## What these schemas do NOT do

- They do **not** validate the markdown body of work/log files. Frontmatter only.
- They do **not** check semantic rules (stale `active` items, broken `_index.md` references, etc.). Those need a linter that goes beyond schema validation — coming in a future `dmb lint` release.

---

## When schemas drift

These schemas track the conventions documented in `memory-bank/tasks/process.md`. If you adopt local conventions (e.g., an extra `assignee` field), copy the schema, set `additionalProperties: true` or add the field explicitly, and use your local copy. Don't expect upstream releases to silently respect deviations.
