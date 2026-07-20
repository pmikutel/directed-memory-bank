# System Architecture

> **Purpose**: System design, patterns, data flow, key architectural decisions.
> **When to Use**: Architecture changes, new features that touch multiple components, debugging cross-component issues.

> **For shape inspiration**, see `examples/complete/memory-bank/technical/architecture.md` in the upstream DMB repo. Use it as a pattern; don't copy verbatim.

---

## High-level Architecture

[FILL_IN: 1–2 paragraphs — the big picture.]

```
[FILL_IN: ASCII diagram showing major components, services, and data stores]
```

## Component Map

### [FILL_IN: component 1 name]

- **Purpose**: [FILL_IN: what it does]
- **Inputs**: [FILL_IN: what it consumes — events, requests, data]
- **Outputs**: [FILL_IN: what it produces — responses, events, side effects]
- **Owners**: [FILL_IN: who's responsible — team / individual / external]

### [FILL_IN: component 2 name]

- **Purpose**: [FILL_IN]
- **Inputs**: [FILL_IN]
- **Outputs**: [FILL_IN]
- **Owners**: [FILL_IN]

[FILL_IN: add more components as your system has them.]

## Data Flow

[FILL_IN: how data moves between components. Describe 1–3 key flows that span multiple components — e.g. "user request → frontend → API → DB → cache → response".]

## Key Architectural Decisions

[FILL_IN: numbered list of major decisions. For each:

- **Decision**: what was chosen
- **Context**: what forced the choice
- **Alternatives considered**: what was rejected and why
- **Trade-offs accepted**: what we gave up to get the upside

This is the "why" history future-you will need.]

## Cross-cutting Concerns

### Authentication & Authorization

[FILL_IN: auth model overview. Detail in `memory-bank/technical/auth.md` if it grows.]

### Logging & Observability

[FILL_IN: logging stack, metrics, tracing — how to find out what's happening in prod.]

### Error Handling

[FILL_IN: error envelope conventions, retry/backoff strategy, user-facing error display.]

### Security

[FILL_IN: high-level security posture. Detail elsewhere if sensitive.]

## Operational Concerns

[FILL_IN: deploy frequency, rollback strategy, on-call model, runbook pointers.]
