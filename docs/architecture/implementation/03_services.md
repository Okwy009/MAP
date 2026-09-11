# Part 3A.3 — Service Layer, Data Access & State Management

**Document:** `docs/architecture/system-architecture.md`

**Version:** 2.0

**Part:** 3A.3

**Status:** Approved

**Owner:** Engineering

---

# Purpose

This chapter defines how business logic is implemented inside MAP.

It answers one question:

> **Where should business decisions live, and how does data move through the system?**

A consistent service architecture ensures MAP remains maintainable as it grows from a simple MVP into a sophisticated AI-powered product.

---

# Architecture Overview

Business logic always follows the same flow.

```
UI
        ↓
Route Handler
        ↓
Application Service
        ↓
Domain Service
        ↓
Repository
        ↓
Supabase
```

Each layer has exactly one responsibility.

---

# Layer Responsibilities

| Layer | Responsibility |
|---------|----------------|
| UI | Display information |
| Route | Validate & orchestrate |
| Application Service | Coordinate workflows |
| Domain Service | Business rules |
| Repository | Database access |
| Database | Persist state |

No layer should assume another layer's responsibilities.

---

# Application Services

Application Services coordinate complete user workflows.

Examples include:

- Completing onboarding
- Generating today's recommendation
- Completing today's task
- Creating a weekly review
- Synchronizing Notion

Application Services answer:

> **"What sequence of business operations should occur?"**

---

## Example

```
Complete Daily Action

↓

Validate request

↓

Mark recommendation complete

↓

Update streak

↓

Generate tomorrow's recommendation

↓

Persist changes

↓

Publish completion event
```

Notice that the Application Service coordinates work but does not implement recommendation logic.

---

# Domain Services

Domain Services implement business rules.

Examples include:

```
DecisionService

RecoveryService

RecommendationService

WeeklyReviewService

PlanGenerationService
```

Domain Services answer:

> **"What should happen?"**

They never concern themselves with:

- HTTP
- Authentication
- Databases
- React
- API responses

---

# Decision Service

The Decision Service owns the core promise of MAP.

Responsibilities include:

- selecting today's recommendation
- applying execution rules
- respecting creator preferences
- considering publishing cadence
- preventing conflicting recommendations

Every recommendation produced by MAP originates here.

---

# Plan Generation Service

Responsible for creating the initial 30-day execution plan.

Inputs:

- creator profile
- platform
- publishing goals
- cadence
- AI preference

Outputs:

- 30 daily recommendations
- estimated effort
- execution sequence

Plans are deterministic during MVP.

---

# Recovery Service

Recovery Service monitors execution history.

When creators miss multiple days, it:

- reduces workload
- restores momentum
- avoids overwhelming recommendations

Recovery is temporary.

---

# Weekly Review Service

Generates weekly summaries.

Includes:

- completed actions
- missed actions
- publishing consistency
- engagement inputs
- recommended improvements

The Weekly Review Service consumes historical data but never modifies it.

---

# Repository Pattern

Repositories abstract persistence.

Services never interact directly with Supabase.

Example

```
Decision Service

↓

PlanRepository

↓

Supabase
```

Changing databases should never require changing business rules.

---

# Repository Responsibilities

Repositories may:

- fetch records
- insert records
- update records
- delete records
- execute transactions

Repositories never:

- calculate recommendations
- send emails
- enforce product rules

---

# Example Repository Structure

```
repositories/

creator.repository.ts

plan.repository.ts

recommendation.repository.ts

tracking.repository.ts

review.repository.ts

payment.repository.ts
```

Each repository owns one aggregate.

---

# Data Access Rules

Business logic must never contain SQL.

Instead:

```
DecisionService

↓

RecommendationRepository.getToday()
```

Never:

```
SELECT *

FROM recommendations
```

inside a service.

---

# Transaction Management

Some workflows modify multiple tables.

Example

```
Complete Daily Action

↓

Recommendation

↓

Streak

↓

Execution History

↓

Analytics
```

These changes should succeed or fail together.

Repositories coordinate transactions.

---

# State Management Philosophy

MAP has three categories of state.

| State | Storage |
|---------|----------|
| UI State | React |
| Session State | Supabase Auth |
| Business State | Database |

Each category has one owner.

---

# UI State

Examples:

- modal visibility
- selected tab
- loading indicators
- toast messages

UI state disappears when the page closes.

---

# Session State

Managed entirely through Supabase Authentication.

Contains:

- authenticated user
- access token
- refresh token
- permissions

Never duplicate session state inside React.

---

# Business State

Business state persists forever.

Examples:

- creator profile
- recommendations
- plans
- completed actions
- streaks
- reviews

Business state belongs exclusively in the database.

---

# Client State Rules

Client components may cache data for responsiveness.

They must never become the source of truth.

If data conflicts:

Database wins.

---

# Server Components

Whenever possible:

Read data on the server.

Benefits:

- improved security
- faster initial load
- reduced client JavaScript
- easier caching

MAP should default to Server Components unless client interactivity is required.

---

# Server Actions

Server Actions are appropriate when:

- updating profile
- completing tasks
- submitting onboarding
- generating plans

Server Actions should call Application Services—not repositories directly.

---

# Caching Strategy

Three cache levels exist.

## Browser Cache

For:

- images
- fonts
- static assets

---

## Next.js Cache

For:

- public content
- static pages
- documentation

---

## Application Cache

For:

- creator profile
- recommendation history
- dashboard summaries

Cached data must be invalidated after writes.

---

# Cache Invalidation

When today's task completes:

Invalidate:

- Daily Focus
- Dashboard
- Streak
- Progress Summary

Never display stale recommendations.

---

# Error Handling

Every service returns structured results.

Example

```
Success

↓

Data
```

or

```
Failure

↓

Business Error
```

Unexpected exceptions should be logged and translated into safe API responses.

---

# Domain Events

Business events describe important occurrences.

Examples:

```
CreatorRegistered

PlanGenerated

RecommendationCompleted

WeeklyReviewCreated

RecoveryModeActivated
```

Events allow future integrations without tightly coupling services.

---

# Event Consumers

Future consumers include:

- Email Service
- Analytics
- Notifications
- AI Insights
- Audit Logs

Services publish events.

Consumers react independently.

---

# External Integrations

Services never call third-party APIs directly.

Instead:

```
DecisionService

↓

NotionService

↓

Notion API
```

or

```
PaymentService

↓

GumroadClient

↓

Gumroad
```

Integration boundaries remain isolated.

---

# Dependency Injection

Services depend on interfaces.

Example

```
RecommendationRepository

EmailService

PlanGenerator
```

Concrete implementations are injected.

Benefits:

- easier testing
- replaceable implementations
- loose coupling

---

# Testing Services

Every Application Service should have:

- unit tests
- integration tests
- failure tests

Critical business logic (Decision Engine, Recovery Mode) should achieve near-complete coverage.

---

# Service Design Rules

Every service should:

✓ Have one responsibility

✓ Be deterministic where possible

✓ Return predictable results

✓ Avoid side effects

✓ Be independently testable

✓ Log important failures

✓ Publish business events

---

# Forbidden Practices

Never:

❌ Query Supabase from React components

❌ Place business logic inside route handlers

❌ Call repositories from UI components

❌ Mix unrelated domains

❌ Duplicate business rules

❌ Build "God Services"

❌ Make services depend on React

❌ Skip repository abstractions

---

# Fitness Checklist

Before approving a service:

- Does it have one responsibility?
- Is persistence delegated to repositories?
- Is business logic isolated?
- Are integrations abstracted?
- Is error handling consistent?
- Is the service testable?
- Does it publish domain events where appropriate?
- Is it documented?

If any answer is "No," the implementation requires revision.

---

# Relationship to Other Documents

This chapter complements:

- `decision-engine-spec.md`
- `engineering_patterns.md`
- `coding_standards.md`
- `testing_standards.md`
- `implementation_package.md`

Together they define **how business logic is implemented, how data is persisted, and how application state is managed throughout MAP.**

---
