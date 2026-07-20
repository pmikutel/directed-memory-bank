---
title: Investigate slow dashboard load
status: idea
priority: medium
branch:
pr:
started:
updated: 2026-04-18
---

# Investigate slow dashboard load

## Observation

Dashboard (`/`) takes 3-4 seconds to first paint on tenants with >500 users. Suspected N+1 in the activity feed query, but not confirmed.

## Next step

Drop a `django-silk` profile on the endpoint in a staging tenant and capture the query count. If it is indeed N+1, likely fixable with `select_related`/`prefetch_related` on `activity_set` → `user` → `profile`.

## Not doing yet

Not starting implementation until the profiling confirms the hypothesis. Could easily be a different bottleneck (frontend render, image assets, CDN cold cache).
