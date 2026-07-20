# Technology Stack Quick Reference

> **Purpose**: Tech stack overview, critical warnings, and design decisions.
> **When to Use**: Starting development, understanding tech choices.

> **For shape inspiration**, see `examples/complete/memory-bank/technical/stack.md` in the upstream DMB repo. Use it as a pattern; don't copy verbatim.

---

## Core Technologies

### Backend Stack

- **Language**: [FILL_IN: language + version, e.g. "Python 3.11+"]
- **Framework**: [FILL_IN: framework + version, or "n/a" if no backend]
- **API Layer**: [FILL_IN: REST / GraphQL / gRPC / n/a]
- **Database**: [FILL_IN: database + version, or "n/a"]
- **Cache**: [FILL_IN: Redis / Memcached / n/a]
- **Task Queue**: [FILL_IN: Celery / Sidekiq / n/a]
- **Container**: [FILL_IN: Docker / podman / n/a]

### Frontend Stack

- **Language**: [FILL_IN: language + version, or "n/a"]
- **Framework**: [FILL_IN: framework + version, or "n/a"]
- **Build Tool**: [FILL_IN: Vite / Webpack / n/a]
- **Styling**: [FILL_IN: Tailwind / styled-components / CSS modules / n/a]
- **State Management**: [FILL_IN: state library, or "local component state only"]
- **Testing**: [FILL_IN: Jest + RTL / Vitest / Playwright / n/a]

### Infrastructure Stack

- **Containerization**: [FILL_IN: Docker / Kubernetes / serverless / n/a]
- **CI/CD**: [FILL_IN: GitHub Actions / GitLab CI / CircleCI / Jenkins]
- **Database hosting**: [FILL_IN: managed (RDS / Cloud SQL) / self-hosted]
- **Cache hosting**: [FILL_IN: managed / self-hosted / n/a]

---

## Development Environment

### Required Tools

```bash
[FILL_IN: required local tools and versions, one per line]
```

### Quick Start Commands

```bash
[FILL_IN: install + run commands]
```

**For detailed setup procedures**: See `memory-bank/technical/deployment.md` (if filled).

---

## Package Management

### Backend Packages (Key Dependencies)

[FILL_IN: paste your `package.json` / `requirements.txt` / `Cargo.toml` / `pom.xml`, or list 5–10 core dependencies with one-line purpose each.]

### Frontend Packages (Key Dependencies)

[FILL_IN: same shape as backend.]

---

## Key Design Decisions

### Why This Stack?

[FILL_IN: 3–5 numbered points — the WHY behind each major tech choice. Future-you will appreciate the rationale.]

### Technology Trade-offs

[FILL_IN: where you intentionally chose convenience over performance, simplicity over flexibility, etc. Capture the trade-offs accepted at each major fork.]

---

## Development Workflow References

### Code Quality

**Quality standards**: `memory-bank/technical/quality.md` (if filled)
**Frontend tools**: `memory-bank/technical/frontend.md` (if filled)
**Backend tools**: `memory-bank/technical/backend.md` (if filled)

### Deployment

**Local development**: `memory-bank/technical/deployment.md` (if filled)
**CI/CD pipeline**: `memory-bank/technical/deployment.md` (if filled)

### Architecture

**System design**: `memory-bank/technical/architecture.md` (if filled)
**Business domain**: `memory-bank/project/domain.md` (if filled)
