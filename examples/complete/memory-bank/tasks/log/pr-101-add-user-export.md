---
title: Add user export to CSV
status: done
pr: 101
branch: feat/user-export
started: 2026-04-15
merged_at: 2026-04-19
---

# Add user export to CSV

## Summary

Added a `GET /api/users/export/` endpoint that streams a CSV of all users visible to the caller. Admin UI gets a new "Export users" button on the users page.

## What shipped

- **Backend**: `UserExportView` uses Django's `StreamingHttpResponse` + `csv.writer` to avoid loading the whole queryset. Ordering mirrors the admin list view.
- **Frontend**: button in `<UserListHeader />` triggers a download with the current filter state preserved as query params.
- **Permissions**: reuses the existing `CanManageUsers` permission class — no new role.

## Decisions

- Streaming over materialising to memory. At current seat counts we'd be fine either way; streaming avoids the question as we grow.
- CSV only for v1. JSON / XLSX can follow if asked.

## Notable files

- `apps/users/views.py` (new view)
- `apps/users/serializers.py` (`UserExportSerializer`)
- `frontend/src/components/users/UserListHeader.tsx`
