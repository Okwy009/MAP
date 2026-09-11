**Document:** `docs/architecture/system-architecture.md`

**Version:** 2.0

**Part:** 3A.1

**Status:** Approved

**Owner:** Engineering

---

# Purpose

This document defines the API architecture of MAP.

It answers one question:

> **How do components communicate safely, predictably, and consistently?**

Every endpoint, service, integration, and future feature must follow these rules.

The API exists to expose business capabilities—not database tables.

---

# Guiding Principles

MAP APIs follow eight principles.

## 1. APIs expose business actions

Good

```
POST /api/onboarding
```

Bad

```
POST /api/creator_profile_table
```

Users think in workflows.

Not tables.

---

## 2. One responsibility per endpoint

Every endpoint should perform exactly one action.

Good

```
POST /api/daily/complete
```

Bad

```
POST /api/dashboard
```

that:

- updates streak
- creates recommendation
- sends email
- updates profile
- logs analytics

---

## 3. APIs never expose implementation details

Clients never know:

- SQL schema
- database structure
- internal IDs
- service implementation

The API represents business language.

---

## 4. Stateless by default

Every request contains enough information to execute.

Servers should not rely on previous requests.

---

## 5. Idempotent where possible

Repeated requests should produce the same result.

Example

```
POST /api/payment/webhook
```

must safely ignore duplicate webhook deliveries.

---

## 6. Validation before execution

Incoming data is validated before business logic runs.

Invalid requests fail immediately.

---

## 7. Business logic never lives inside route handlers

Route handlers should orchestrate.

They do not decide.

---

## 8. Version intentionally

Breaking changes require API versioning.

---

# API Layers

```
Client

↓

Route Handler

↓

Application Service

↓

Domain Service

↓

Repository

↓

Database
```

Each layer has one responsibility.

---

# Layer Responsibilities

## Client

Responsible for

- rendering UI
- collecting input
- displaying results

Never

- access database
- implement business rules

---

## Route Handler

Responsible for

- authentication
- validation
- orchestration

Never

- generate recommendations
- write SQL
- call multiple unrelated services

---

## Application Service

Coordinates workflows.

Example

```
Complete Daily Action
```

may require

- update completion

- update streak

- generate tomorrow

- send notification

---

## Domain Service

Owns business logic.

Examples

Decision Engine

Recommendation Generator

Recovery Mode

Weekly Review

---

## Repository

Responsible for persistence.

No business rules.

---

## Database

Stores state.

Nothing else.

---

# API Categories

The API is organized by business capability.

```
Authentication

Creator

Onboarding

Decision Engine

Daily Focus

Completion

Tracking

Review

Payments

Notifications

Integrations

Administration
```

This mirrors the product architecture.

---

# Route Structure

```
app/

└── api/

    ├── auth/

    ├── creator/

    ├── onboarding/

    ├── decision/

    ├── daily/

    ├── tracking/

    ├── review/

    ├── payment/

    ├── email/

    ├── integrations/

    └── admin/
```

Every folder represents one bounded capability.

---

# Authentication Routes

```
POST /api/auth/register

POST /api/auth/login

POST /api/auth/logout

POST /api/auth/reset-password

GET /api/auth/session
```

Responsibilities

- authentication
- session creation
- account lifecycle

---

# Creator Routes

```
GET /api/creator

PATCH /api/creator

DELETE /api/creator
```

Responsible only for creator information.

---

# Onboarding Routes

```
POST /api/onboarding/start

POST /api/onboarding/complete

GET /api/onboarding/status
```

No recommendation logic belongs here.

---

# Decision Engine Routes

```
POST /api/decision/generate

GET /api/decision/today

POST /api/decision/regenerate
```

These routes expose the Decision Engine.

They do not expose implementation.

---

# Daily Focus Routes

```
GET /api/daily

POST /api/daily/complete

POST /api/daily/skip
```

The client only knows today's recommendation.

---

# Tracking Routes

```
POST /api/tracking/input

GET /api/tracking/history

DELETE /api/tracking/{id}
```

Tracking remains independent from recommendations.

---

# Weekly Review Routes

```
GET /api/review/latest

GET /api/review/history

POST /api/review/generate
```

---

# Payment Routes

```
POST /api/payment/webhook

GET /api/payment/status
```

Webhook endpoints never return sensitive information.

---

# Email Routes

Internal only.

```
POST /api/email/send

POST /api/email/welcome

POST /api/email/review
```

Clients should never call these directly.

---

# Integration Routes

```
POST /api/integrations/notion/sync

GET /api/integrations/notion/status
```

Every external integration receives its own namespace.

---

# Administration Routes

```
GET /api/admin/users

GET /api/admin/system

POST /api/admin/reindex
```

Protected by elevated authorization.

---

# Standard Request Lifecycle

Every request follows the same flow.

```
Request

↓

Authentication

↓

Authorization

↓

Validation

↓

Business Service

↓

Repository

↓

Database

↓

Response
```

No shortcuts.

---

# Standard Response Format

Successful responses use one structure.

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Errors use another.

```json
{
  "success": false,
  "error": {
    "code": "ONBOARDING_INCOMPLETE",
    "message": "Complete onboarding first."
  }
}
```

Consistency simplifies client development.

---

# Error Codes

Every API returns standardized codes.

Examples

```
UNAUTHORIZED

FORBIDDEN

NOT_FOUND

VALIDATION_ERROR

PAYMENT_REQUIRED

PROFILE_INCOMPLETE

PLAN_NOT_GENERATED

UNKNOWN_ERROR
```

Never rely on parsing messages.

---

# Validation Standards

Every endpoint validates:

- authentication
- authorization
- schema
- required fields
- business rules

Validation order never changes.

---

# API Security Rules

Every endpoint must:

✓ Require HTTPS

✓ Validate authentication

✓ Authorize access

✓ Validate payload

✓ Log failures

✓ Rate limit where appropriate

✓ Never expose internal errors

---

# Idempotency Rules

The following endpoints must be idempotent.

```
Payment Webhook

Welcome Email

Generate Plan

Complete Daily Action
```

Repeated execution must never corrupt state.

---

# API Versioning

Current version

```
v1
```

Future versions

```
/api/v2/
```

Breaking changes require a new version.

Existing clients must continue functioning.

---

# Logging Requirements

Every API request logs:

- request id
- authenticated user
- endpoint
- duration
- status
- errors

Sensitive information must never be logged.

---

# Performance Targets

Authentication

<200 ms

Decision Engine

<500 ms

Daily Focus

<300 ms

Onboarding

<500 ms

Webhook

<2 seconds

These are engineering targets.

---

# Forbidden Practices

Never:

❌ Query Supabase directly from React components

❌ Put SQL in route handlers

❌ Call external APIs from UI components

❌ Duplicate validation

❌ Mix business domains

❌ Return database models directly

❌ Expose secrets

❌ Trust client-side validation

---

# Architecture Review Checklist

Every new endpoint must answer:

- What business capability does this expose?
- Does another endpoint already solve this?
- Is business logic inside a service?
- Is validation complete?
- Is authorization enforced?
- Is the response standardized?
- Is logging implemented?
- Is the endpoint documented?
- Are automated tests included?

If any answer is "No," implementation is incomplete.

---

# Relationship to Other Documents

This chapter works alongside:

- `decision-engine-spec.md`
- `engineering_patterns.md`
- `coding_standards.md`
- `testing_standards.md`
- `implementation_package.md`

It defines **how every future API in MAP must be designed**.

---

# Next Chapter

# System Architecture v2.0
