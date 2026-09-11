# System Architecture v2.0

# Part 3B.3 — Monitoring & Observability Architecture

**Document:** `docs/architecture/system-architecture.md`

**Version:** 2.0

**Part:** 3B.3

**Status:** Approved

**Owner:** Engineering

---

# Purpose

This chapter defines how MAP monitors the health of the platform, detects problems, measures product performance, and provides visibility into the system.

It answers one question:

> **"How do we know MAP is healthy, reliable, and delivering its promise to creators?"**

If security protects the system, observability allows us to understand it.

Every production service must be observable.

---

# Observability Philosophy

MAP follows three principles.

## Principle 1 — Everything Important is Observable

If a critical business event occurs, it must be measurable.

Examples:

- User signs in
- User completes onboarding
- Decision Engine generates today's task
- 30-day plan created
- Email delivered
- Payment completed
- User finishes today's action

Nothing mission-critical should happen silently.

---

## Principle 2 — Problems Should Be Detected Before Users Report Them

Monitoring exists to identify issues proactively.

The engineering team should know something is broken before customers notice.

---

## Principle 3 — Every Incident Leaves Evidence

Every request, workflow, and background job should produce enough information to investigate failures without exposing sensitive user data.

---

# The Three Pillars of Observability

MAP's observability strategy consists of three pillars.

```
Logs
      ↓
Metrics
      ↓
Traces
```

Together they provide complete visibility into production.

---

# Logging Architecture

Every application writes structured logs.

Applications include:

- Next.js Frontend
- API Routes
- Decision Engine
- Background Jobs
- Webhook Processors
- Email Service
- AI Services

Logs should be machine-readable.

Preferred format:

```json
{
  "timestamp": "...",
  "service": "...",
  "level": "...",
  "message": "...",
  "requestId": "...",
  "userId": "..."
}
```

---

# Log Levels

MAP uses five log levels.

## DEBUG

Development information.

Disabled in production.

---

## INFO

Normal application behavior.

Examples:

- User logged in
- Calendar generated
- Recommendation created

---

## WARN

Unexpected but recoverable events.

Examples:

- Slow API response
- Retry triggered
- Missing optional field

---

## ERROR

A request failed.

Examples:

- Database unavailable
- Email failed
- AI timeout

---

## FATAL

Critical production failure.

Examples:

- Authentication unavailable
- Database inaccessible
- System startup failure

Immediate investigation required.

---

# Structured Logging

Every log should include:

- Timestamp
- Request ID
- User ID (if authenticated)
- Service Name
- Environment
- Severity
- Message
- Error Code (if applicable)

Avoid free-form logging whenever possible.

---

# Request Correlation

Every incoming request receives a unique Request ID.

```
Browser

↓

Request ID

↓

API

↓

Database

↓

Email

↓

Logs
```

This allows engineering to trace a request across the entire platform.

---

# Error Tracking

Production errors should be captured automatically.

Track:

- JavaScript exceptions
- API failures
- Database failures
- AI service failures
- Webhook failures
- Authentication errors

Every production error should generate sufficient context for debugging.

---

# Metrics

Metrics measure long-term platform health.

Metrics are numerical and aggregated over time.

Examples include:

- Active users
- Daily logins
- Decision Engine success rate
- Average response time
- Error rate
- Email delivery success
- Calendar generation time

---

# Product Metrics

MAP measures product success through creator outcomes.

Core metrics include:

- Daily Active Creators
- Weekly Active Creators
- 30-Day Retention
- Average Daily Completions
- Recommendation Completion Rate
- Average Session Length
- Weekly Review Completion Rate

These metrics indicate whether creators are consistently using MAP.

---

# Engineering Metrics

Engineering focuses on platform reliability.

Track:

- API latency
- Database latency
- Build duration
- Deployment frequency
- Error rate
- Availability
- Recovery time

---

# AI Metrics

Decision Engine metrics include:

- Recommendation generation time
- AI request latency
- AI failure rate
- Recommendation acceptance rate
- Recommendation completion rate

The Decision Engine is only valuable if recommendations are acted upon.

---

# Business Metrics

Business health indicators include:

- Trial conversions
- Paid users
- Revenue
- Churn
- Refund rate
- Email open rate
- Community participation

These metrics guide product strategy.

---

# Health Checks

Every service should expose a health endpoint.

Example:

```
GET /api/health
```

Checks include:

- Database connectivity
- Authentication availability
- AI provider availability
- Email service
- Storage
- Background jobs

---

# Health Status

Every service reports one of:

```
Healthy

↓

Degraded

↓

Unavailable
```

Engineering dashboards display current platform status.

---

# Performance Monitoring

Critical performance metrics include:

## Page Load Time

Target:

< 2 seconds

---

## API Response Time

Target:

< 300ms

---

## Recommendation Generation

Target:

< 2 seconds

---

## Calendar Generation

Target:

< 10 seconds

---

## Email Delivery

Target:

< 30 seconds

---

# Audit Logs

Audit logs record important business events.

Examples:

- Account created
- Profile updated
- Payment completed
- Subscription cancelled
- Recommendation completed
- Weekly review submitted

Audit logs cannot be modified.

---

# User Activity Logs

MAP records creator activity.

Examples:

- Logged in
- Completed today's task
- Viewed calendar
- Updated goals
- Added content idea

These logs improve personalization.

---

# Background Job Monitoring

Monitor jobs including:

- Calendar generation
- Email sending
- AI processing
- Weekly review creation
- Webhook processing

Every background job records:

- Start time
- End time
- Duration
- Result
- Retry count

---

# Queue Monitoring

Future asynchronous queues should monitor:

- Queue size
- Processing time
- Failure rate
- Retry count

Large queue growth may indicate production problems.

---

# Alerting

Alerts should trigger only for actionable issues.

Examples:

- Database unavailable
- Authentication failures exceed threshold
- Error rate exceeds 5%
- Decision Engine unavailable
- Payment failures spike
- Email delivery fails repeatedly

Avoid alert fatigue.

---

# Incident Severity

MAP classifies incidents into four levels.

## P1

Platform unavailable.

Immediate response.

---

## P2

Core feature unavailable.

Response within one hour.

---

## P3

Partial degradation.

Scheduled investigation.

---

## P4

Minor issue.

Address during normal development.

---

# Dashboards

Engineering dashboards include:

## Platform Dashboard

- Availability
- Error rate
- Response times
- Deployments

---

## Product Dashboard

- Active creators
- Completion rate
- Retention
- Daily usage

---

## Decision Engine Dashboard

- Recommendations generated
- Completion percentage
- AI latency
- Failure rate

---

## Business Dashboard

- Revenue
- Payments
- Churn
- Growth

---

# Incident Response Workflow

```
Alert

↓

Detection

↓

Investigation

↓

Containment

↓

Resolution

↓

Verification

↓

Postmortem

↓

Documentation

↓

Improvement
```

Every major incident results in documented lessons learned.

---

# Postmortems

Every significant production incident should answer:

- What happened?
- Why did it happen?
- How was it detected?
- Why wasn't it detected sooner?
- What was the customer impact?
- What changes prevent recurrence?

Blameless postmortems are encouraged.

---

# Privacy Considerations

Monitoring must never expose:

- Authentication tokens
- Passwords
- Payment details
- API keys
- Private creator content

User privacy always takes precedence over debugging convenience.

---

# Production Readiness Checklist

Before deployment verify:

- Logging enabled
- Metrics collected
- Health checks working
- Error tracking configured
- Alerts configured
- Dashboards updated
- Audit logging enabled
- Performance monitored

No production service should launch without observability.

---

# Guiding Principles

A healthy platform is one that can explain itself.

Engineers should never ask:

> "What happened?"

Instead, the system should provide enough evidence to answer:

- What happened?
- Why did it happen?
- Who was affected?
- How quickly can we recover?

---

# Relationship to Other Documents

This chapter complements:

- `security-architecture.md`
- `authentication-architecture.md`
- `deployment.md`
- `engineering_patterns.md`
- `testing_standards.md`
- `system-architecture.md`

Together they define MAP's operational excellence strategy.

---