# Technology Stack Quick Reference

> **Purpose**: Tech stack overview, critical warnings, and design decisions.
> **When to Use**: Starting development, understanding tech choices.

---

## Core Technologies

### Backend Stack

- **Language**: Python 3.11+
- **Framework**: Django 4.x with Django REST Framework
- **API Layer**: REST API (primary)
- **Database**: PostgreSQL 15+ (primary data store)
- **Cache**: Redis 7+ (session data, query caching)
- **Task Queue**: Celery with Redis broker (async jobs)
- **Container**: Docker with multi-stage builds

### Frontend Stack

- **Language**: TypeScript 5+
- **Framework**: React 18+ with hooks
- **Build Tool**: Vite with hot module replacement
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Query + Context API
- **Forms**: React Hook Form with validation
- **Testing**: Jest + React Testing Library

### Infrastructure Stack

- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions / GitLab CI / Bitbucket Pipelines
- **Database**: PostgreSQL (local via Docker, managed in production)
- **Cache**: Redis (local via Docker, managed in production)

---

## Development Environment

### Required Tools

```bash
# Core development tools
Node.js 18+              # Frontend development
Python 3.11+             # Backend development
pnpm or npm              # Package manager
Docker Desktop           # Local containerized environment
Git                      # Version control
```

### Quick Start Commands

```bash
# Install dependencies
npm install              # or pnpm install

# Start local development environment
docker compose up -d     # Start services
npm run dev              # Start frontend

# Access services
# - Backend API: http://localhost:8000
# - Frontend: http://localhost:3000
# - Admin: http://localhost:8000/admin
```

**For detailed setup procedures**: See `memory-bank/technical/deployment.md`

---

## Package Management

### Backend Packages (Key Dependencies)

```python
# Core framework
Django>=4.2
djangorestframework>=3.14

# Database & caching
psycopg2-binary>=2.9
redis>=4.5
celery>=5.3

# Authentication
djangorestframework-simplejwt>=5.2
django-cors-headers>=4.0
```

### Frontend Packages (Key Dependencies)

```json
{
  "react": "^18.2.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.0.0",
  "@tanstack/react-query": "^5.0.0",
  "react-hook-form": "^7.45.0"
}
```

---

## Key Design Decisions

### Why This Stack?

1. **Django + Python**: Rapid development, excellent ecosystem, strong ORM
2. **React + TypeScript**: Type safety, component reusability, large ecosystem
3. **Tailwind CSS**: Rapid UI development, consistent design system
4. **PostgreSQL**: Robust relational database, JSON support for flexibility
5. **Redis**: Fast caching, Celery broker, session storage

### Technology Trade-offs

**REST API**:

- Simpler to understand and debug
- Excellent tooling (Swagger, Postman)
- Clear resource-based structure

**Tailwind CSS**:

- Utility-first, rapid iteration
- No runtime CSS overhead
- Requires learning utility classes

**React Query**:

- Handles server state caching automatically
- Reduces boilerplate for API calls
- Steep learning curve initially

---

## Development Workflow References

### Code Quality

**Quality standards**: `memory-bank/technical/quality.md`
**Frontend tools**: `memory-bank/technical/frontend.md`
**Backend tools**: `memory-bank/technical/backend.md`

### Deployment

**Local development**: `memory-bank/technical/deployment.md`
**CI/CD pipeline**: `memory-bank/technical/deployment.md`

### Architecture

**System design**: `memory-bank/technical/architecture.md`
**Business domain**: `memory-bank/project/business-domain.md`
