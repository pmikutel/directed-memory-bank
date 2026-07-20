# CLAUDE.md (Quick Reference)

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

[PROJECT_NAME] - [ONE_LINE_DESCRIPTION]

**Key Architecture:**

- **Frontend**: [FRONTEND_STACK]
- **Backend**: [BACKEND_STACK]
- **Database**: [DATABASE]
- **Infrastructure**: [INFRASTRUCTURE]

## Essential Commands

### Development Workflow

```bash
# Install dependencies
[INSTALL_COMMAND]

# Start full application
[START_COMMAND]

# Code quality checks (MANDATORY after changes)
[QUALITY_FIX_COMMAND]          # Fix code quality and formatting
[QUALITY_CHECK_COMMAND]        # Verify all quality checks

# Database operations
[DB_MIGRATE_COMMAND]

# Testing
[TEST_COMMAND]
```

## Project Structure

```
[PROJECT_ROOT]/
├── [BACKEND_DIR]/           # Backend application
├── [FRONTEND_DIR]/          # Frontend application
├── [TESTS_DIR]/             # Test files
└── [CONFIG_DIR]/            # Configuration
```

## Technology Stack Guidelines

### Frontend

- **Styling**: [STYLING_APPROACH]
- **Components**: [COMPONENT_LIBRARY]
- **State**: [STATE_MANAGEMENT]
- **Forms**: [FORM_HANDLING]

### Backend

- **Models**: [ORM/DATABASE_ACCESS]
- **API**: [API_APPROACH]
- **Authentication**: [AUTH_APPROACH]
- **Validation**: [VALIDATION_APPROACH]

### Database Workflow

1. **Model Changes**: Edit models
2. **Generate Migration**: [MIGRATION_COMMAND]
3. **Apply Migration**: [APPLY_MIGRATION_COMMAND]

## Critical Quality Requirements

### MANDATORY: Always Run After Changes

```bash
# After any code changes
[FORMAT_COMMAND]
[LINT_COMMAND]
```

### Git Workflow

- **NEVER commit without explicit permission**
- Use Conventional Commits format: `type(scope): description`
- Types: feat, fix, docs, style, refactor, perf, test, chore

## Domain Context

[BRIEF_DOMAIN_DESCRIPTION]

Key concepts:
- **[CONCEPT_1]**: [DESCRIPTION]
- **[CONCEPT_2]**: [DESCRIPTION]
- **[CONCEPT_3]**: [DESCRIPTION]

## Common Patterns

### Adding New Features

1. **Backend**: Create models → migrations → API endpoints
2. **Frontend**: Create components → integrate with API
3. **Testing**: Write tests for both backend and frontend
4. **Quality**: Run all quality checks before completion

## Important Restrictions

- **ALWAYS ask before git commits**
- **MUST run quality checks after every change**

## Quick Reference

```bash
# Essential daily commands:
[START_COMMAND]                    # Start development
[QUALITY_FIX_COMMAND]              # Fix all quality issues
[QUALITY_CHECK_COMMAND]            # Verify quality
[DB_MIGRATE_COMMAND]               # After model changes
```

## Documentation and Rules

- **DMB** (project knowledge): `memory-bank/`. Operation-scoped routing lives in `.claude/skills/`; `memory-bank/_index.md` is the inventory of what exists
- **Writing into DMB**: follow `memory-bank/project/doc-guide.md` — style, length, and hygiene rules. Required reading before editing any memory-bank file
- **In-flight scratchpads** (optional): `memory-bank/tasks/work/` — one file per topic
- **Completed work log**: `memory-bank/tasks/log/` — one file per merged PR
- **Update process**: `memory-bank/tasks/process.md`

## Where docs go

- Code-context docs (architecture, domain, conventions): `memory-bank/`
- Setup / run commands: `README.md`
- Docs for readers outside this codebase: external-docs folder (check repo conventions)

Default on ambiguity: memory-bank.
