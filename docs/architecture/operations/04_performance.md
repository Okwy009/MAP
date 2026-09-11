# System Architecture v2.0

# Part 3B.4 — Performance & Scalability Architecture

**Document:** `docs/architecture/system-architecture.md`

**Version:** 2.0

**Part:** 3B.4

**Status:** Approved

**Owner:** Engineering

---

# Purpose

This chapter defines how MAP delivers a fast, responsive, and scalable experience for creators as the platform grows from a handful of users to hundreds of thousands.

It answers one question:

> **"How does MAP remain fast as more creators, AI requests, and data are added?"**

Performance is a product feature.

Scalability is an architectural property.

Both must be designed from the beginning—not added later.

---

# Engineering Philosophy

MAP follows five performance principles.

## Principle 1 — Fast by Default

Every interaction should feel instantaneous whenever possible.

Users should spend time creating content—not waiting for software.

---

## Principle 2 — Optimize the Critical Path

Only optimize what directly affects the creator experience.

Focus on:

- Login
- Today's Recommendation
- Content Calendar
- Completing today's task

Everything else is secondary.

---

## Principle 3 — Cache Aggressively

Never recompute information unnecessarily.

If something can be cached safely, cache it.

---

## Principle 4 — Scale Horizontally

MAP should grow by adding infrastructure—not rewriting architecture.

---

## Principle 5 — AI Should Never Block the UI

Creators should never stare at a loading spinner because an AI model is thinking.

AI belongs in asynchronous workflows whenever possible.

---

# Performance Goals

| Feature | Target |
|----------|---------|
| Initial Page Load | < 2 seconds |
| Dashboard Load | < 1 second |
| API Response | < 300 ms |
| Authentication | < 500 ms |
| Recommendation Retrieval | < 500 ms |
| Calendar Display | < 1 second |
| AI Recommendation Generation | < 2 seconds |
| Email Trigger | < 5 seconds |

---

# Performance Budget

MAP establishes a strict performance budget.

## JavaScript

Maximum:

```
250 KB (gzipped)
```

---

## CSS

Maximum:

```
100 KB
```

---

## Images

Maximum hero image:

```
300 KB
```

SVG preferred whenever possible.

---

## Fonts

Maximum:

```
2 font families
```

Use:

- Inter
- Instrument Serif

---

# Rendering Strategy

MAP uses different rendering techniques depending on the page.

---

## Marketing Pages

Use:

Static Site Generation (SSG)

Benefits:

- Fast
- SEO
- CDN cached

Examples:

- Home
- Pricing
- About

---

## Authenticated Pages

Use:

Server Components

Examples:

- Today's Focus
- Calendar
- Profile

Benefits:

- Less JavaScript
- Better security
- Faster rendering

---

## Interactive Components

Use:

Client Components only where necessary.

Examples:

- Checkboxes
- Forms
- Timers
- Drag-and-drop
- Calendar interactions

---

# Next.js Performance Strategy

Preferred architecture:

```
Server Components

↓

Small Client Components

↓

API Routes

↓

Supabase
```

Large client-side applications should be avoided.

---

# Data Fetching Strategy

Prefer:

Server-side fetching.

Avoid:

Multiple sequential API requests from the browser.

Instead:

```
Browser

↓

Next.js Server

↓

Supabase

↓

Return hydrated page
```

---

# Database Performance

Supabase should be optimized through:

- indexes
- query optimization
- pagination
- Row-Level Security
- connection pooling

Avoid:

```
SELECT *
```

Always fetch only required fields.

---

# Indexing Strategy

Primary indexes:

- User ID
- Email
- Recommendation Date
- Calendar Date
- Created At

Additional indexes are introduced only when supported by performance data.

---

# Pagination

Lists should never load unlimited rows.

Use cursor-based pagination where appropriate.

Examples:

- Input history
- Weekly reviews
- Notifications
- Activity logs

---

# Caching Strategy

MAP uses caching at multiple levels.

---

## Browser Cache

Static assets:

- Images
- Fonts
- Icons

---

## CDN Cache

Marketing pages.

Documentation.

Public assets.

---

## Next.js Cache

Server-rendered pages.

Static layouts.

Metadata.

---

## Database Cache

Frequently requested queries.

Examples:

- Today's recommendation
- Creator profile
- Calendar summary

---

# Cache Invalidation

Cached data should refresh when:

- creator profile changes
- recommendation changes
- today's task completed
- onboarding completed

Avoid stale creator experiences.

---

# AI Performance Strategy

AI should not execute on every page request.

Instead:

```
Profile Updated

↓

Background Job

↓

Generate Plan

↓

Save Results

↓

User Opens MAP

↓

Instant Recommendation
```

This keeps the application responsive.

---

# Background Processing

Long-running tasks execute asynchronously.

Examples:

- AI generation
- Calendar creation
- Email sending
- Analytics processing
- Weekly review generation

Background workers prevent UI blocking.

---

# Lazy Loading

Load only what users need.

Examples:

- Analytics
- Historical charts
- Weekly reports
- Account settings

Today's recommendation should never wait for secondary features.

---

# Code Splitting

Every route loads only its required code.

Avoid shipping:

- admin code
- analytics
- AI tooling

to pages that do not require them.

---

# Image Optimization

Use Next.js Image Optimization.

Requirements:

- responsive images
- lazy loading
- automatic resizing
- modern formats

Avoid oversized assets.

---

# Font Optimization

Use:

```
next/font
```

Benefits:

- self-hosting
- no layout shift
- improved Lighthouse score

---

# API Performance

API routes should:

- validate quickly
- execute efficiently
- avoid unnecessary database calls
- return minimal payloads

Target latency:

```
<300 ms
```

---

# Network Optimization

Reduce network requests by:

- batching
- caching
- server rendering
- parallel fetching

Avoid waterfall loading.

---

# Scalability Model

Current architecture supports:

```
1 User

↓

100 Users

↓

1,000 Users

↓

10,000 Users

↓

100,000+ Users
```

without architectural redesign.

---

# Horizontal Scaling

Stateless services allow horizontal scaling.

```
Load Balancer

↓

App Instance A

↓

App Instance B

↓

App Instance C
```

Sessions remain managed by Supabase.

---

# Database Scaling

Growth strategy:

Phase 1

Single Supabase instance.

↓

Phase 2

Read replicas.

↓

Phase 3

Database partitioning if required.

Scaling should be driven by real usage—not premature optimization.

---

# AI Scaling

Decision Engine requests should queue independently.

```
Creator Request

↓

Queue

↓

AI Worker

↓

Recommendation

↓

Database
```

Workers scale independently from the web application.

---

# Email Scaling

Email generation should never occur inside the request lifecycle.

Instead:

```
User Pays

↓

Webhook

↓

Queue Email

↓

Worker

↓

Resend

↓

Delivered
```

---

# Performance Monitoring

Track:

- Largest Contentful Paint (LCP)
- First Contentful Paint (FCP)
- Interaction to Next Paint (INP)
- Time to First Byte (TTFB)
- Cumulative Layout Shift (CLS)

These metrics form MAP's Core Web Vitals dashboard.

---

# Performance Regression Policy

Every release should compare:

- page load time
- API latency
- bundle size
- Lighthouse score

No release should significantly degrade user experience without explicit approval.

---

# Capacity Planning

Infrastructure should remain below:

- 70% CPU
- 70% Memory
- 70% Database utilization

This provides headroom during traffic spikes.

---

# Future Scaling

Future optimizations may include:

- Edge Functions
- Global CDN optimization
- Distributed AI workers
- Multi-region deployments
- Event-driven architecture
- Read replicas
- Dedicated analytics warehouse

These are intentionally deferred until justified by usage.

---

# Performance Checklist

Before release verify:

- Performance budget met.
- Bundle size reviewed.
- Images optimized.
- Fonts optimized.
- Database queries indexed.
- Caching configured.
- API latency acceptable.
- Lighthouse score ≥ 90.
- Core Web Vitals pass.
- No blocking AI operations.

---

# Guiding Principles

MAP should always feel:

- Fast
- Predictable
- Responsive
- Lightweight

Creators should never think:

> "This app is slow."

Instead, they should feel:

> "MAP is always ready before I am."

---

# Relationship to Other Documents

This chapter complements:

- `system-architecture.md`
- `security-architecture.md`
- `authentication-architecture.md`
- `deployment.md`
- `engineering_patterns.md`
- `testing_standards.md`

Together they define MAP's production-grade performance strategy.

---