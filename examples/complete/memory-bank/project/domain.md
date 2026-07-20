# Domain Context: BookShelf Reading Tracker Business Domain

**Purpose**: Business domain knowledge, entities, relationships, workflows, and business rules.

---

## Business Overview

### Industry Context

BookShelf operates in the **personal productivity** and **social reading** space. The platform helps readers organize their book collections, track reading progress, and connect with other readers.

### Target Market

- **Avid Readers**: People who read 10+ books per year
- **Book Collectors**: Individuals with physical or digital book collections
- **Reading Goals Enthusiasts**: People tracking reading challenges
- **Book Club Members**: Groups coordinating shared reading
- **Casual Readers**: Anyone wanting to remember and discover books

### Business Problem

Readers lack a unified system to track their reading history, progress, and preferences. Information is scattered across spreadsheets, notes, and memory, leading to forgotten books, abandoned reads, and missed discoveries.

**Detailed Pain Points**: See `memory-bank/project/product-vision.md` → "Current Pain Points"

## Domain Entities and Relationships

### Core Business Entities

#### 1. User (Account Entity)

- **Definition**: A registered reader with a personal account
- **Business Role**: The entity that owns books, creates reviews, and interacts socially
- **Attributes**: Username, email, display name, profile picture, bio, reading preferences
- **Business Rules**:
  - Each user has a unique username and email
  - Users can make their profile public or private
  - Users can follow other users (if public)
  - Users can have multiple reading lists

#### 2. Book (Catalog Entity)

- **Definition**: A book in the system catalog with metadata
- **Business Role**: The central content entity that users interact with
- **Attributes**: Title, ISBN, author(s), publisher, publication year, genre, page count, cover image, description
- **Business Rules**:
  - Books can have multiple authors
  - Books can belong to series with ordering
  - Books are shared across users (single catalog entry)
  - Book metadata can be enriched from external APIs

#### 3. Author (Catalog Entity)

- **Definition**: A book author with biographical information
- **Business Role**: Organizes books and enables author-based discovery
- **Attributes**: Name, biography, nationality, birth year, photo, website
- **Business Rules**:
  - Authors can have multiple books
  - Books can have multiple authors (co-authors)
  - Author names may have variations (pen names)

#### 4. UserBook (Ownership Entity)

- **Definition**: A user's personal copy/instance of a book
- **Business Role**: Tracks individual user's relationship with a book
- **Attributes**: User reference, book reference, reading status, progress, date added, date started, date finished
- **Business Rules**:
  - Each user can have one UserBook per Book
  - Reading status: Want to Read, Currently Reading, Finished, Abandoned
  - Progress tracked as page number or percentage
  - Timestamps track when status changes occur

#### 5. Review (Content Entity)

- **Definition**: A user's written review and rating of a book
- **Business Role**: Provides user-generated content for discovery and community
- **Attributes**: User reference, book reference, rating (1-5), review text, date created, contains spoilers flag, visibility
- **Business Rules**:
  - One review per user per book
  - Rating is required, text is optional
  - Reviews can be public or private
  - Spoiler flag hides content behind warning

#### 6. ReadingList (Organization Entity)

- **Definition**: A curated collection of books created by a user
- **Business Role**: Enables organization and sharing of book collections
- **Attributes**: Name, description, user reference, visibility, book references, order
- **Business Rules**:
  - Users have default lists: "Want to Read", "Currently Reading", "Finished"
  - Users can create custom lists
  - Lists can be public or private
  - Books can be in multiple lists
  - List order is user-controlled

#### 7. ReadingProgress (Tracking Entity)

- **Definition**: A progress update entry for a book
- **Business Role**: Historical record of reading progress
- **Attributes**: UserBook reference, page number/percentage, timestamp, notes
- **Business Rules**:
  - Progress entries are append-only (historical record)
  - Latest entry determines current progress
  - Optional notes can capture reading thoughts
  - Progress cannot exceed book page count

## Business Workflows

### Primary Workflows

#### 1. Book Discovery and Addition

```
User → Search/Browse → Find Book → Add to Library → Set Status
  ↓         ↓            ↓            ↓              ↓
Query    Book List    Selection   UserBook       Initial State
```

**Business Rules**:

- Search matches title, author, ISBN
- Books not in catalog can be added manually
- Default status is "Want to Read"
- Adding creates UserBook relationship

#### 2. Reading Progress Tracking

```
Start Reading → Update Progress → Finish Book → Write Review
     ↓               ↓               ↓             ↓
Status Change   Page Updates   Status Change   Optional Rating
```

**Business Rules**:

- Moving to "Currently Reading" records start date
- Progress updates create historical entries
- Finishing records completion date
- Reviews can be added at any time

#### 3. Social Interaction

```
Discover User → Follow → View Activity → Interact
     ↓            ↓          ↓            ↓
  Search      Follow      Activity     Like/Comment
             Request       Feed       Recommend
```

**Business Rules**:

- Private users require follow approval
- Activity feed shows followed users' updates
- Users can recommend books to followers
- Interactions respect privacy settings

### Secondary Workflows

#### 4. Reading List Management

```
Create List → Add Books → Organize Order → Share (Optional)
     ↓            ↓            ↓               ↓
 Name/Desc   Select Books   Drag/Drop     Set Public
```

**Business Rules**:

- List names must be unique per user
- Default lists cannot be deleted
- Book order is manually controlled
- Public lists appear on user profile

#### 5. Reading Goals

```
Set Goal → Track Progress → Receive Updates → Complete
   ↓            ↓               ↓              ↓
 Target    Books Finished   Notifications   Achievement
```

**Business Rules**:

- Goals are typically annual (books per year)
- Progress calculated from finished books
- Optional notifications at milestones
- Historical goals preserved for comparison

## Data Relationships

### Entity Relationship Summary

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

### Key Relationships

- **User → UserBook → Book**: User's personal book collection
- **User → Review → Book**: User's reviews for books
- **User → ReadingList → Book**: User's curated collections
- **Book → Author**: Books written by authors
- **UserBook → ReadingProgress**: Progress history for a book

## Business Metrics and KPIs

### User Engagement Metrics

- **Books per User**: Average collection size
- **Monthly Active Readers**: Users updating progress
- **Reviews per User**: Content contribution
- **Social Connections**: Average followers/following

### Platform Health Metrics

- **Catalog Size**: Total unique books
- **User Retention**: Month-over-month active users
- **Feature Adoption**: Usage of social features
- **API Response Time**: Search and load performance

### Reading Metrics

- **Books Finished**: Completed books per period
- **Reading Velocity**: Pages per day/week
- **Abandonment Rate**: Started but not finished
- **Goal Completion**: Users meeting reading goals

## Integration Points

### External Systems

- **Book Metadata APIs**: Google Books, Open Library for book data
- **Cover Images**: External sources for book covers
- **Social Auth**: OAuth providers for login
- **Email Service**: Notifications and updates

### Internal Systems

- **User Management**: Authentication and profiles
- **Notification System**: Reading reminders, social updates
- **Search Service**: Full-text search across catalog
- **Analytics**: Usage tracking and insights
