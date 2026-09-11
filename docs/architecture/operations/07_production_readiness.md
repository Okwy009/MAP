# System Architecture v2.0

# Part 3B.7 — External Integrations & Service Architecture

**Document:** `docs/architecture/system-architecture.md`

**Version:** 2.0

**Part:** 3B.7

**Status:** Approved

**Owner:** Engineering

---

# Purpose

This chapter defines how MAP communicates with external services while maintaining reliability, security, and loose coupling.

It answers one question:

> **"How does MAP integrate with third-party services without becoming dependent on them?"**

MAP's competitive advantage is not its integrations.

Its competitive advantage is the Decision Engine.

External services should support the Decision Engine—not define it.

---

# Integration Philosophy

MAP follows six integration principles.

## Principle 1 — Own the Core

The Decision Engine.

Creator Profiles.

Recommendations.

Execution History.

These always belong to MAP.

Never outsource the core product.

---

## Principle 2 — Replaceable Services

Every external provider should be replaceable.

Changing providers should never require rewriting the product.

---

## Principle 3 — Loose Coupling

External services communicate through interfaces.

The application never depends directly on vendor-specific behavior.

---

## Principle 4 — Graceful Failure

If an integration fails:

MAP continues functioning whenever possible.

---

## Principle 5 — Secure by Default

Every external request must:

- authenticate
- validate
- log
- retry safely

---

## Principle 6 — Idempotent Processing

The same webhook should be safe to process multiple times.

Duplicate events must never duplicate business actions.

---

# Integration Landscape

```
                     MAP Application
                           │
      ┌──────────────┬─────┼──────────────┬──────────────┐
      ▼              ▼     ▼              ▼              ▼
 Supabase        Gumroad  Resend       Notion       AI Providers
(Auth/DB)       (Payment) (Email)    (Workspace)  (OpenAI/Claude)
```

Each integration owns a single responsibility.

---

# Core Integrations

| Service | Responsibility |
|----------|----------------|
| Supabase | Authentication, Database, Storage |
| Gumroad | Payments |
| Resend | Transactional Email |
| Notion API | Internal Workspace |
| OpenAI / Anthropic | AI Recommendation Generation |

---

# Integration Ownership

```
Creator

↓

MAP

↓

Integration Layer

↓

External Service
```

External providers never communicate directly with creators.

MAP always sits in the middle.

---

# Integration Layer

Every integration should expose an internal service.

Example:

```
app/services/

    auth/

    payments/

    email/

    notion/

    ai/
```

The application communicates with services—not SDKs directly.

---

# Authentication Service

Responsibilities:

- Login
- Session validation
- User identity
- Profile lookup

Provider:

Supabase Auth

MAP remains provider-agnostic.

---

# Database Service

Responsibilities:

- Store creator data
- Store recommendations
- Store calendars
- Store execution history

Provider:

Supabase PostgreSQL

---

# Payment Service

Responsibilities:

- Verify purchases
- Activate subscriptions
- Process webhooks
- Record transactions

Provider:

Gumroad

---

# Payment Flow

```
Creator

↓

Checkout

↓

Gumroad

↓

Payment Success

↓

Webhook

↓

MAP API

↓

Verify Signature

↓

Create Subscription

↓

Create Creator Account

↓

Trigger Onboarding Email
```

The webhook is the source of truth.

---

# Payment Verification

Every webhook must verify:

- Signature
- Timestamp
- Purchase status
- Product ID

Never trust incoming requests blindly.

---

# Duplicate Webhooks

Webhooks may arrive multiple times.

MAP stores:

```
Webhook ID

↓

Processed?

↓

Ignore Duplicate
```

Processing must be idempotent.

---

# Email Service

Responsibilities:

- Welcome Email
- Magic Links
- Weekly Reviews
- Reminder Emails
- Notification Emails

Provider:

Resend

---

# Email Workflow

```
Business Event

↓

Queue Email

↓

Email Service

↓

Resend API

↓

Creator Inbox
```

Email sending never blocks the user experience.

---

# Email Templates

Templates should be version-controlled.

Examples:

- Welcome
- Purchase Confirmation
- Weekly Review
- Recovery Reminder
- Subscription Renewal

Templates should not live only inside Resend.

---

# Notion Integration

Purpose:

Internal operational workspace.

Examples:

- Creator database
- Editorial planning
- Founder dashboard
- Support workflows

Notion is an internal productivity tool.

It is not the production database.

---

# Notion Synchronization

```
Creator Profile

↓

Database

↓

Sync Job

↓

Notion
```

Synchronization is asynchronous.

Failures should retry automatically.

---

# AI Provider Architecture

Supported providers:

- OpenAI
- Anthropic

Future:

- Local models
- Azure OpenAI
- Additional providers

---

# AI Abstraction Layer

```
Decision Engine

↓

AI Service

↓

Provider Adapter

↓

OpenAI

or

Claude
```

The Decision Engine never calls providers directly.

---

# AI Provider Switching

Switching providers should require changing configuration—not application logic.

Example:

```
AI_PROVIDER=openai

↓

AI_PROVIDER=anthropic
```

Architecture should support provider flexibility.

---

# AI Request Lifecycle

```
Decision Engine

↓

Prompt Builder

↓

AI Service

↓

Provider

↓

Response Validator

↓

Recommendation

↓

Database
```

Every recommendation passes validation before reaching creators.

---

# API Retry Policy

Retry transient failures only.

Examples:

- Timeout
- Temporary network failure
- HTTP 503

Never retry:

- Invalid requests
- Authentication failures
- Validation errors

---

# Timeout Strategy

Recommended timeouts:

| Service | Timeout |
|----------|----------|
| Supabase | 5 seconds |
| Gumroad | 10 seconds |
| Resend | 10 seconds |
| Notion | 10 seconds |
| AI Provider | 30 seconds |

Avoid indefinite waiting.

---

# Rate Limiting

Protect external APIs through:

- request throttling
- exponential backoff
- batching
- caching

Respect provider limits.

---

# Circuit Breakers

If an integration repeatedly fails:

```
Open Circuit

↓

Stop Requests

↓

Cooldown

↓

Retry

↓

Close Circuit
```

Prevent cascading failures.

---

# Error Handling

Every integration should return standardized errors.

Example:

```
SERVICE_UNAVAILABLE

↓

PAYMENT_FAILED

↓

EMAIL_FAILED

↓

AI_TIMEOUT
```

Internal consistency simplifies debugging.

---

# Logging

Every integration logs:

- Request ID
- Provider
- Endpoint
- Duration
- Result
- Error (if applicable)

Never log:

- Secrets
- Tokens
- Payment information
- Personal creator data

---

# Security Requirements

Every integration must:

- Use HTTPS
- Authenticate requests
- Validate payloads
- Rotate secrets
- Limit permissions

Least privilege always applies.

---

# Version Management

External APIs evolve.

Maintain:

- SDK versions
- API version documentation
- Migration plans

Breaking provider changes should not surprise engineering.

---

# Integration Testing

Test:

- Authentication
- Payments
- Email delivery
- Notion sync
- AI responses

Prefer mocked integrations during automated testing.

Use sandbox environments for end-to-end testing.

---

# Operational Dashboard

Engineering monitors:

- Payment success rate
- Email delivery rate
- AI latency
- Sync failures
- API failures
- Retry queues

Operational visibility is essential.

---

# Future Integrations

Potential future services:

- Stripe
- Lemon Squeezy
- Slack
- Discord
- Zapier
- n8n
- Linear
- GitHub
- Google Calendar
- Apple Calendar

All future integrations follow the same architecture.

---

# Guiding Principles

External services should make MAP stronger—not more fragile.

MAP owns the product.

Third-party services provide capabilities.

The architecture ensures that replacing any external provider is an engineering task—not a product rewrite.

---

# Relationship to Other Documents

This chapter complements:

- `decision-engine-spec.md`
- `deployment.md`
- `security-architecture.md`
- `authentication-architecture.md`
- `system-architecture.md`
- `monitoring-observability.md`

Together they define MAP's external systems architecture.

---