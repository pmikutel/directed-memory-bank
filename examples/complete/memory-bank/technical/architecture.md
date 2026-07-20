# System Architecture

> **Purpose**: System design patterns, component relationships, and architectural decisions.
> **When to Use**: Understanding system design, making architectural changes.

---

## Overall Architecture

### High-Level Design

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Workers       │
│   (React/TS)    │◄──►│   (Django/DRF)  │◄──►│   (Celery)      │
│   + UI          │    │   + REST API    │    │   + Background  │
│   Components    │    │   Endpoints     │    │   Processing    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Database      │    │   Redis Queue   │
                       │   (PostgreSQL)  │    │   (Cache/Queue) │
                       └─────────────────┘    └─────────────────┘
```

### Request Flow

```
User → Frontend → API Request → Backend → Database
  ↑        ↓           ↓           ↓          ↓
  └─── Response ←── JSON ←── Serializer ←── Query
```

---

## Backend Architecture

### Django Application Structure

```
backend/
├── apps/                    # Feature-based Django apps
│   ├── users/              # User management
│   ├── books/              # Book catalog
│   ├── reading/            # Reading progress & lists
│   └── social/             # Social features
├── common/                 # Shared utilities
│   ├── models.py          # Abstract base models
│   ├── serializers.py     # Base serializers
│   └── exceptions.py      # Custom exceptions
└── config/                # Django configuration
    ├── settings/          # Environment settings
    ├── urls.py           # Root URL config
    └── wsgi.py           # WSGI config
```

### API Design Patterns

**RESTful Endpoints**:

```python
# Resource-based URL structure
GET    /api/books/              # List books
POST   /api/books/              # Create book
GET    /api/books/{id}/         # Get book detail
PUT    /api/books/{id}/         # Update book
DELETE /api/books/{id}/         # Delete book

# Nested resources
GET    /api/books/{id}/reviews/ # Book reviews
POST   /api/users/{id}/follow/  # Follow user
```

**Response Format**:

```json
{
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 20
  }
}
```

---

## Frontend Architecture

### React Application Structure

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base components (buttons, inputs)
│   │   └── features/      # Feature-specific components
│   ├── pages/             # Page components (routes)
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API client and services
│   ├── store/             # Global state (if needed)
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
└── public/                # Static assets
```

### State Management Pattern

```
┌─────────────────────────────────────────────────┐
│                  React Query                     │
│   (Server State: API data, caching, sync)       │
└─────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────┐
│               React Context                      │
│   (Global UI State: theme, user preferences)    │
└─────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────┐
│             Component State                      │
│   (Local State: form inputs, toggles)           │
└─────────────────────────────────────────────────┘
```

---

## Database Architecture

### Schema Design Principles

1. **Normalized Core Data**: Books, users, authors properly normalized
2. **Denormalized for Performance**: Counts and aggregates cached
3. **Soft Deletes**: Important records use `deleted_at` instead of hard delete
4. **Timestamps**: All tables have `created_at`, `updated_at`

### Key Relationships

```
User (1) ─────── (*) UserBook (*) ─────── (1) Book
  │                    │                      │
  │                    └── ReadingProgress    │
  │                                           │
  ├──── Review ───────────────────────────────┤
  │                                           │
  └──── ReadingList ──────────────────────────┘
                                              │
                                        Author (*)
```

### Index Strategy

```python
# Performance indexes
class Book(models.Model):
    class Meta:
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['created_at']),
        ]

# Unique constraints
class UserBook(models.Model):
    class Meta:
        unique_together = ['user', 'book']
```

---

## Authentication Architecture

### Token-Based Auth Flow

```
Login Request → Validate Credentials → Generate Tokens
                                            ↓
                                   Access Token (short-lived)
                                   Refresh Token (long-lived)
                                            ↓
API Request + Access Token → Validate → Process Request
                                ↓
                        Token Expired?
                                ↓
               Yes → Use Refresh Token → New Access Token
               No  → Continue
```

### Security Patterns

- **Password Hashing**: Argon2 or bcrypt
- **Token Storage**: HTTP-only cookies (recommended) or secure localStorage
- **CORS**: Configured for frontend origin only
- **Rate Limiting**: On authentication endpoints

---

## Caching Architecture

### Cache Layers

```
Request → Application Cache (Redis) → Database
              ↓
    ┌─────────────────────┐
    │  Cached Data Types  │
    │  - Session data     │
    │  - Query results    │
    │  - Rate limit data  │
    └─────────────────────┘
```

### Cache Strategy

```python
# Cache-aside pattern
def get_book(book_id):
    cache_key = f"book:{book_id}"
    book = cache.get(cache_key)

    if book is None:
        book = Book.objects.get(id=book_id)
        cache.set(cache_key, book, timeout=300)

    return book
```

---

## Background Processing

### Celery Task Architecture

```
API Request → Queue Task → Redis → Celery Worker → Process
                              ↓
                    ┌──────────────────┐
                    │   Task Types     │
                    │  - Email sending │
                    │  - Data import   │
                    │  - Recommendations│
                    └──────────────────┘
```

### Task Patterns

```python
# Async task definition
@app.task
def send_recommendation_email(user_id, book_id):
    user = User.objects.get(id=user_id)
    book = Book.objects.get(id=book_id)
    send_email(user.email, "Book Recommendation", ...)

# Calling from view
send_recommendation_email.delay(user.id, book.id)
```

---

## Error Handling Architecture

### Backend Error Handling

```python
# Custom exception handler
class APIException(Exception):
    status_code = 400
    default_message = "An error occurred"

    def __init__(self, message=None, code=None):
        self.message = message or self.default_message
        self.code = code

class NotFoundError(APIException):
    status_code = 404
    default_message = "Resource not found"
```

### Frontend Error Handling

```typescript
// Global error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Log error to service
    logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

---

## Performance Patterns

### Database Optimization

```python
# Use select_related for ForeignKey
books = Book.objects.select_related('author')

# Use prefetch_related for reverse relationships
users = User.objects.prefetch_related('reviews')

# Combine for complex queries
books = Book.objects.select_related('author').prefetch_related(
    'reviews__user'
)
```

### Frontend Optimization

- **Code Splitting**: Dynamic imports for routes
- **Memoization**: `useMemo`, `useCallback` for expensive operations
- **Virtualization**: For long lists (react-window)
- **Image Optimization**: Lazy loading, appropriate sizes

---

## Testing Architecture

### Test Pyramid

```
         /\
        /  \     E2E Tests (few)
       /────\
      /      \   Integration Tests (some)
     /────────\
    /          \ Unit Tests (many)
   /────────────\
```

### Test Organization

```
tests/
├── unit/              # Pure function tests
├── integration/       # API endpoint tests
└── e2e/              # Full user flow tests
```

---

## Deployment Architecture

See `memory-bank/technical/deployment.md` for detailed deployment procedures.

### Environment Separation

```
Development → Staging → Production
    │            │           │
  Local DB   Test DB    Managed DB
  Hot Reload  CI Tests   Monitoring
```
