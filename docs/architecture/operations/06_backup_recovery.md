# System Architecture v2.0

# Part 3B.6 — Backup, Disaster Recovery & Business Continuity

**Document:** `docs/architecture/system-architecture.md`

**Version:** 2.0

**Part:** 3B.6

**Status:** Approved

**Owner:** Engineering

---

# Purpose

This chapter defines how MAP protects creator data, recovers from failures, and continues operating during unexpected events.

It answers one question:

> **"If something goes wrong, how do we protect our creators and restore MAP safely?"**

Creators trust MAP with their goals, plans, execution history, and accountability data.

That trust depends on our ability to never lose their work.

---

# Business Continuity Philosophy

MAP follows five continuity principles.

## Principle 1 — Never Lose Creator Progress

A creator should never lose:

- their profile
- their 30-day plan
- today's recommendation
- completed work
- execution history

User progress is more valuable than code.

---

## Principle 2 — Failure Is Expected

Servers fail.

Networks fail.

Providers fail.

People make mistakes.

The architecture assumes failures will occur.

---

## Principle 3 — Recovery Is Designed

Recovery is not improvised.

Every recovery procedure must already exist before production.

---

## Principle 4 — Small Failures Should Stay Small

A single service failure should not bring down the entire platform.

Isolation is preferred over cascading failures.

---

## Principle 5 — Documentation Is Part of Recovery

Every recovery process must be documented.

No critical recovery should rely on memory.

---

# Recovery Objectives

MAP defines measurable recovery targets.

## Recovery Time Objective (RTO)

Maximum downtime.

```
< 1 hour
```

---

## Recovery Point Objective (RPO)

Maximum acceptable data loss.

```
< 15 minutes
```

These objectives guide infrastructure decisions.

---

# What Must Be Protected

The following assets are considered critical.

## Creator Accounts

- authentication
- profile
- subscription status

---

## Creator Plans

- 30-day plans
- recommendations
- content calendar

---

## Creator History

- completed tasks
- streaks
- reviews
- engagement logs
- input tracker

---

## System Configuration

- environment variables
- deployment configuration
- API integrations
- infrastructure configuration

---

## Documentation

All product and engineering documentation must remain recoverable.

Includes:

- PRDs
- Architecture
- Decision Logs
- Roadmaps
- Engineering Standards

---

# Backup Strategy

Backups occur at multiple levels.

```
Application

↓

Database

↓

Configuration

↓

Documentation

↓

Source Code
```

Each layer has its own backup strategy.

---

# Database Backups

Supabase provides automated backups.

Backup frequency:

- Continuous WAL logging
- Daily snapshots

Retention:

According to the selected Supabase production plan.

Engineering periodically validates restore capability.

---

# Source Code Backup

Source code resides in GitHub.

Every commit creates version history.

Protected branches prevent accidental deletion.

Repository cloning provides an additional recovery mechanism.

---

# Documentation Backup

Documentation is stored inside the repository.

Critical documentation also exists in:

- Notion
- GitHub
- Local repository

No critical document should have a single storage location.

---

# Configuration Backup

Back up:

- Vercel configuration
- Environment templates
- Database migrations
- Deployment scripts

Secrets themselves are not exported into backups.

Only their configuration.

---

# Asset Backup

Protect:

- logos
- illustrations
- icons
- static assets
- uploaded creator files (future)

Storage redundancy depends on Supabase Storage.

---

# Backup Frequency

| Asset | Frequency |
|---------|-----------|
| Source Code | Every Commit |
| Database | Continuous + Daily |
| Documentation | Every Merge |
| Assets | Daily |
| Configuration | Every Release |

---

# Recovery Priorities

If recovery is required:

Priority 1

Authentication

↓

Priority 2

Database

↓

Priority 3

Decision Engine

↓

Priority 4

30-Day Plans

↓

Priority 5

Today's Recommendation

↓

Priority 6

Email

↓

Priority 7

Analytics

Creators should regain productivity before secondary systems.

---

# Disaster Scenarios

MAP prepares for multiple failure types.

## Scenario 1 — Application Failure

Symptoms:

- website unavailable
- deployment broken

Recovery:

- rollback deployment
- verify health
- investigate root cause

---

## Scenario 2 — Database Failure

Symptoms:

- failed queries
- missing data
- connection errors

Recovery:

- restore database
- validate integrity
- reconnect services

---

## Scenario 3 — Email Provider Failure

Symptoms:

- onboarding emails fail
- reminder emails fail

Recovery:

- queue emails
- retry automatically
- fail gracefully

The product continues functioning.

---

## Scenario 4 — AI Provider Failure

Symptoms:

- recommendation generation unavailable

Recovery:

Serve the most recently generated recommendation.

Never leave the creator without guidance.

---

## Scenario 5 — Payment Provider Failure

Symptoms:

- purchases unavailable

Recovery:

- queue webhook retries
- verify transactions later
- notify founder if outage persists

---

## Scenario 6 — Notion API Failure

Symptoms:

- workspace sync unavailable

Recovery:

Continue using the database.

Sync later when Notion becomes available.

Notion should never become a production dependency for the creator experience.

---

# Regional Failure

If a hosting region becomes unavailable:

- Vercel reroutes traffic
- Database recovery procedures begin
- Monitoring escalates incident

Future versions may support multi-region databases.

---

# Data Integrity Validation

After recovery verify:

- creator accounts
- onboarding data
- recommendations
- calendars
- completed tasks
- payments

Recovery is incomplete until data integrity passes.

---

# Recovery Workflow

```
Failure Detected

↓

Alert Triggered

↓

Incident Created

↓

Impact Assessed

↓

Recovery Procedure Selected

↓

System Restored

↓

Health Verified

↓

Data Validated

↓

Incident Closed

↓

Postmortem Written
```

---

# Incident Communication

For significant outages:

Engineering informs:

- Founder
- Product
- Support

If creators are affected:

Status updates should explain:

- what happened
- current impact
- expected resolution
- next update time

Transparency builds trust.

---

# Business Continuity Plan

If a critical provider becomes unavailable:

Alternative operation should continue where possible.

Examples:

If AI unavailable

↓

Serve cached recommendation.

If email unavailable

↓

Queue delivery.

If Notion unavailable

↓

Continue using Supabase.

Business continuity prioritizes uninterrupted creator progress.

---

# Manual Recovery Procedures

Engineering maintains documented procedures for:

- restoring production
- restoring staging
- restoring database
- regenerating recommendations
- reprocessing failed webhooks
- resending onboarding emails

Procedures should be executable by any engineer.

---

# Recovery Testing

Recovery plans should be tested periodically.

Verify:

- backup restoration
- deployment rollback
- database recovery
- webhook replay
- AI fallback
- email retry

An untested backup is not a backup.

---

# Dependency Failure Matrix

| Dependency | Failure Impact | Fallback |
|------------|----------------|----------|
| Vercel | Site unavailable | Rollback / Redeploy |
| Supabase | Core unavailable | Restore backups |
| Resend | Emails delayed | Queue & Retry |
| Gumroad | Purchases delayed | Replay webhooks |
| Notion | Sync unavailable | Continue using database |
| AI Provider | Recommendations unavailable | Cached recommendation |

---

# Operational Readiness Checklist

Before launch verify:

- Database backups enabled
- Restore process documented
- Rollback tested
- Incident runbooks written
- Recovery objectives defined
- Monitoring operational
- Documentation backed up
- Source code protected

---

# Future Improvements

As MAP scales:

- Multi-region database replication
- Cross-region backups
- Secondary email provider
- AI provider failover
- Automated disaster recovery testing
- Immutable infrastructure
- Active-active deployments

These enhancements should be introduced based on operational needs.

---

# Guiding Principles

Creators should never worry about whether MAP remembers their work.

The platform must be resilient enough that failure becomes an engineering event—not a customer experience.

Business continuity exists to preserve momentum.

The creator's next step should always be waiting for them.

---

# Relationship to Other Documents

This chapter complements:

- `system-architecture.md`
- `deployment.md`
- `security-architecture.md`
- `performance-architecture.md`
- `monitoring-observability.md`
- `engineering_patterns.md`

Together they define MAP's operational resilience strategy.

---