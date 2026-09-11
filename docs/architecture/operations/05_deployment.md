# System Architecture v2.0

# Part 3B.5 — Deployment & Infrastructure Architecture

**Document:** `docs/architecture/system-architecture.md`

**Version:** 2.0

**Part:** 3B.5

**Status:** Approved

**Owner:** Engineering

---

# Purpose

This chapter defines how MAP is deployed, hosted, configured, monitored, and released into production.

It answers one question:

> **"How does MAP move safely from source code to a reliable production application?"**

Deployment is more than publishing code.

It is the repeatable process that transforms approved software into a secure, observable, and recoverable production system.

---

# Architecture Goals

MAP's deployment architecture is designed to be:

- Reliable
- Repeatable
- Secure
- Observable
- Recoverable
- Scalable
- Automated

Every deployment should be predictable.

Every rollback should be simple.

---

# Infrastructure Overview

MAP consists of several managed services working together.

```
                        Users
                          │
                          ▼
                   Vercel Edge Network
                          │
                          ▼
                 Next.js Application
                          │
          ┌───────────────┼────────────────┐
          ▼               ▼                ▼
     Supabase         Resend API      Notion API
(Database/Auth)         (Email)      (Workspace)
          │
          ▼
    Decision Engine
          │
          ▼
  Background Workers
```

Each service has a clearly defined responsibility.

---

# Production Stack

| Layer | Technology |
|---------|------------|
| Frontend | Next.js |
| Hosting | Vercel |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Storage | Supabase Storage |
| Email | Resend |
| Payments | Gumroad |
| Workspace | Notion API |
| AI | OpenAI / Anthropic (Future) |

---

# Deployment Environments

MAP uses three deployment environments.

```
Development

↓

Staging

↓

Production
```

Each environment has isolated resources.

---

# Development

Purpose:

Local engineering work.

Characteristics:

- Local database
- Test credentials
- Mock services allowed
- Fast iteration

Never connected to production data.

---

# Staging

Purpose:

Pre-production validation.

Characteristics:

- Mirrors production
- Production configuration
- Test payment provider
- Test email domain

Every release passes through staging before production.

---

# Production

Purpose:

Serve creators.

Characteristics:

- Live users
- Real payments
- Real email
- Real data

Production changes require review.

---

# Deployment Pipeline

Every deployment follows the same lifecycle.

```
Git Commit

↓

Pull Request

↓

Code Review

↓

Automated Tests

↓

Merge

↓

GitHub

↓

Vercel Build

↓

Deployment

↓

Health Checks

↓

Production
```

No manual production uploads.

---

# Branch Strategy

```
main

↓

Production
```

```
develop

↓

Staging
```

```
feature/*
```

↓

Individual work.

All development begins in feature branches.

---

# Continuous Integration (CI)

Every pull request automatically runs:

- Type checking
- ESLint
- Unit tests
- Build validation
- Dependency checks

A failing pipeline blocks merging.

---

# Continuous Deployment (CD)

Successful merges automatically deploy.

```
main

↓

Production
```

```
develop

↓

Preview Deployment
```

Preview deployments are automatically created by Vercel.

---

# Preview Deployments

Every pull request receives its own deployment.

Benefits:

- Product review
- QA testing
- Stakeholder approval
- Safe experimentation

Production remains unaffected.

---

# Environment Variables

Secrets never exist in source control.

Managed through:

Vercel Environment Variables.

Examples:

```
NEXT_PUBLIC_SUPABASE_URL

SUPABASE_SERVICE_ROLE_KEY

RESEND_API_KEY

NOTION_TOKEN

OPENAI_API_KEY

GUMROAD_WEBHOOK_SECRET
```

Environment variables differ between Development, Staging, and Production.

---

# Secret Management Principles

Secrets must:

- Never be committed
- Never appear in logs
- Never be hardcoded
- Rotate periodically
- Be restricted by least privilege

Compromised secrets are rotated immediately.

---

# Infrastructure Ownership

| Service | Owner |
|----------|-------|
| Next.js | Engineering |
| Vercel | Engineering |
| Supabase | Engineering |
| Notion | Product |
| Resend | Engineering |
| Gumroad | Product |
| AI Providers | Engineering |

Ownership clarifies operational responsibility.

---

# Database Deployment

Database schema changes use migrations.

```
Migration

↓

Review

↓

Apply

↓

Verify

↓

Deploy
```

Schema changes never occur manually in production.

---

# Infrastructure as Code

Where practical, infrastructure configuration should be version controlled.

Examples:

- Vercel configuration
- Middleware
- API routes
- Database migrations
- Environment templates

Configuration changes should be traceable.

---

# Static Assets

Static assets include:

- Images
- Fonts
- Icons
- Logos
- Marketing resources

Served through Vercel's CDN.

---

# CDN Strategy

Public assets are cached globally.

Benefits:

- Lower latency
- Reduced bandwidth
- Faster page loads
- Better user experience

Dynamic data bypasses CDN caching when necessary.

---

# Deployment Verification

After every deployment verify:

- Homepage loads
- Login works
- Authentication succeeds
- Database accessible
- Recommendation endpoint healthy
- Calendar loads
- Emails send
- Payment webhook operational

Deployment is not complete until verification succeeds.

---

# Rollback Strategy

Every deployment must be reversible.

Rollback process:

```
Deployment Fails

↓

Identify Version

↓

Restore Previous Build

↓

Verify Health

↓

Investigate

↓

Patch

↓

Redeploy
```

Rollback should complete within minutes.

---

# Zero-Downtime Deployments

MAP aims for zero downtime.

Strategies:

- Atomic deployments
- Stateless application servers
- Managed database upgrades
- Health checks before traffic switching

Creators should never notice deployments.

---

# Backup Strategy

Supabase manages automated backups.

Engineering additionally exports:

- Database schema
- Configuration
- Documentation
- Critical metadata

Backups are verified regularly.

---

# Disaster Recovery

Recovery priorities:

1. Authentication
2. Database
3. Recommendation Engine
4. Email
5. Calendar
6. Analytics

Recovery procedures are documented and rehearsed.

---

# Recovery Objectives

Target Recovery Time (RTO):

```
< 1 hour
```

Target Recovery Point (RPO):

```
< 15 minutes
```

These objectives guide backup strategy.

---

# Infrastructure Monitoring

Monitor:

- CPU
- Memory
- Database connections
- Storage
- API latency
- Deployment failures
- Build failures
- Error rates

Operational dashboards provide real-time visibility.

---

# Scheduled Maintenance

Maintenance should:

- Be announced in advance
- Avoid peak usage
- Include rollback plans
- Verify system health afterward

Unplanned downtime should be minimized.

---

# Release Strategy

MAP follows semantic versioning.

Example:

```
v0.1.0

↓

v0.2.0

↓

v0.3.0

↓

v1.0.0
```

Major releases require:

- Product approval
- Engineering approval
- QA approval

---

# Release Checklist

Before production:

- All tests pass
- Build succeeds
- Documentation updated
- Migrations reviewed
- Secrets verified
- Monitoring enabled
- Rollback validated
- Product approved

No release proceeds without completing the checklist.

---

# Operational Principles

Every deployment should be:

Predictable.

Repeatable.

Auditable.

Recoverable.

Secure.

If any deployment depends on tribal knowledge, the process is incomplete.

---

# Future Infrastructure

As MAP grows, architecture may expand to include:

- Multi-region deployments
- Edge Functions
- Dedicated worker services
- Event-driven messaging
- Redis caching
- Read replicas
- Object storage optimization
- Kubernetes orchestration (only if justified)

These remain future considerations and should not be implemented prematurely.

---

# Guiding Principles

Infrastructure exists to support creators—not the other way around.

The best deployment is one users never notice.

The best rollback is one engineers rarely need.

---

# Relationship to Other Documents

This chapter complements:

- `system-architecture.md`
- `security-architecture.md`
- `authentication-architecture.md`
- `performance-architecture.md`
- `engineering_patterns.md`
- `testing_standards.md`
- `deployment.md`

Together they define MAP's production infrastructure and deployment strategy.

---