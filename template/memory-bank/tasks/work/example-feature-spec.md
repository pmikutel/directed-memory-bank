---
title: Social reading features
status: planned
priority: high
branch:
pr:
started:
updated: 2026-04-24
---

# Social reading features

> **Example file** showing how a detailed feature spec lives inside `work/`. Same file would start life as a few lines at `status: idea`, grow into this shape once prioritised, and move to `log/` on merge.

---

## Overview

Enable users to connect with other readers through following, activity feeds, and book recommendations. This creates a social layer on top of personal library management features.

## Problem statement

Readers want to:

- Discover what friends and trusted readers are enjoying
- Share their reading journey
- Get personalised recommendations from people with similar tastes
- Coordinate reading with book clubs

Currently this requires external tools (social media, messaging apps) that don't integrate with reading data.

## Proposed solution

A social layer that respects privacy preferences. Users can:

1. Follow other readers (with permission for private accounts)
2. See activity from followed users in a dedicated feed
3. Recommend books directly to connections
4. Optionally participate in reading groups / book clubs

## Requirements

### Functional

- [ ] **FR-1**: Users can follow / unfollow other users
- [ ] **FR-2**: Users can approve / deny follow requests (if private)
- [ ] **FR-3**: Users can see a feed of activity from followed users
- [ ] **FR-4**: Users can recommend a book to specific followers
- [ ] **FR-5**: Users can see follower / following counts on profiles
- [ ] **FR-6**: Users can set their profile to public or private
- [ ] **FR-7**: Activity includes: started reading, finished, rated, reviewed

### Non-functional

- [ ] **NFR-1**: Activity feed loads in under 2 seconds
- [ ] **NFR-2**: Support users following up to 1000 accounts
- [ ] **NFR-3**: Activity feed is paginated (20 items per page)
- [ ] **NFR-4**: Privacy settings take effect immediately

## Technical design

### Data model

```python
class Follow(models.Model):
    follower = models.ForeignKey(User, related_name='following')
    followed = models.ForeignKey(User, related_name='followers')
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(choices=['pending', 'accepted', 'rejected'])

    class Meta:
        unique_together = ['follower', 'followed']

class Activity(models.Model):
    user = models.ForeignKey(User)
    activity_type = models.CharField(choices=[
        'started_reading', 'finished', 'rated', 'reviewed', 'added_to_list'
    ])
    book = models.ForeignKey(Book)
    created_at = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict)

class BookRecommendation(models.Model):
    from_user = models.ForeignKey(User, related_name='sent_recommendations')
    to_user = models.ForeignKey(User, related_name='received_recommendations')
    book = models.ForeignKey(Book)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
```

### API endpoints

```
POST   /api/users/{id}/follow/
DELETE /api/users/{id}/follow/
POST   /api/follow-requests/{id}/accept/
POST   /api/follow-requests/{id}/reject/
GET    /api/users/{id}/followers/
GET    /api/users/{id}/following/

GET    /api/feed/
GET    /api/users/{id}/activity/

POST   /api/recommendations/
GET    /api/recommendations/
PATCH  /api/recommendations/{id}/
```

### Privacy model

```
User.is_private = True:
  - Follow requires approval
  - Activity only visible to followers
  - Profile details hidden from non-followers

User.is_private = False:
  - Anyone can follow
  - Activity publicly visible
  - Full profile visible
```

## Implementation plan

### Phase 1: Following system

- [ ] `Follow` model + migrations
- [ ] Follow / unfollow endpoints
- [ ] Follower / following counts on profiles
- [ ] Approval flow for private accounts
- [ ] Privacy settings on user profile

### Phase 2: Activity feed

- [ ] `Activity` model + migrations
- [ ] Generate activities on user actions (signals)
- [ ] Activity feed endpoint with pagination
- [ ] Feed UI component
- [ ] Filtering options

### Phase 3: Recommendations

- [ ] `BookRecommendation` model
- [ ] Recommendation endpoints
- [ ] Sending UI
- [ ] Inbox
- [ ] Notification hook

## Testing strategy

- **Unit**: follow/unfollow logic, privacy checks, activity generation
- **Integration**: follow flow (request → approval → feed access), feed pagination, recommendation flow end-to-end
- **Performance**: feed generation with 1000 followed users

## Success metrics

- **Adoption**: % users with ≥1 follow
- **Engagement**: DAU checking feed
- **Retention**: return rate for social feature users
- **Recommendations**: average sent / received per user

## Open questions

1. Blocking functionality?
2. Activity history retention?
3. Editable / deletable activities?
4. Rate limiting for follow requests?

## Related

- `memory-bank/project/domain.md` — user entity
- `memory-bank/technical/architecture.md` — API patterns
