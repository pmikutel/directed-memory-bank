# Tech Stack

## Core

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | Python | 3.11+ |
| Web framework | Flask | 3.x |
| Storage | SQLite | stdlib `sqlite3` |
| Templating | Jinja2 | (bundled with Flask) |
| Server (prod) | Gunicorn | 21.x |
| Tests | pytest | 8.x |

## Key Decisions

- **SQLite, not Postgres**: single-box deployment, low write volume. One file, zero ops. Revisit only if we ever need multiple app instances.
- **No ORM**: three queries total (insert link, resolve slug, bump hits). Raw `sqlite3` in `store.py` is clearer than pulling in SQLAlchemy.
- **302, not 301**: redirects are temporary so we can keep counting hits and change targets later without clients caching the old destination.

## Development

```bash
# Install
pip install -r requirements.txt

# Initialize the database (runs schema.sql)
python -c "import store; store.init_db()"

# Run locally
flask --app app run --debug

# Run tests
pytest
```
