Part 1 — Foundation & System Overview

Version
2.0

Part
1 of 3

Status
Approved

Owner
Founder + Engineering

Table of Contents (Part 1)
1. Executive Summary

2. Architecture Philosophy

3. Product Architecture Principles

4. Engineering Principles

5. Architectural Goals

6. Architectural Non-Goals

7. Repository Map

8. System Context

9. High-Level Architecture

10. Container Architecture

11. Core System Components

12. Domain Model

13. Core Domain Objects

14. Architecture Constraints

15. Technology Stack

16. Future Evolution
1. Executive Summary
Purpose

This document defines the architecture of MAP.

It exists to answer one question:

How should MAP be built so it always fulfills its product promise?

It is the authoritative engineering reference for every implementation decision.

If any implementation conflicts with this document, this document takes precedence until formally updated through an Architecture Decision Record (ADR).

Product Promise

When a creator signs into MAP, they should immediately know exactly what to do next.

Everything in this architecture exists to support that single promise.

MAP is not a task manager.

MAP is not a habit tracker.

MAP is not a dashboard.

MAP is an execution system.

Architectural Philosophy

The architecture deliberately mirrors the creator journey rather than the underlying technology.

Instead of organizing the product around technical layers, MAP is organized around value creation.

Creator

↓

Profile

↓

Decision Engine

↓

30-Day Plan

↓

Today's Focus

↓

Completion

↓

Learning

↓

Improved Tomorrow

Every component exists because it contributes to this journey.

2. Architecture Philosophy
Guiding Principle

Architecture exists to make product behavior predictable.

Technology is replaceable.

The product promise is not.

Design Philosophy

MAP follows five design beliefs.

1. Simplicity wins.

Complex systems eventually become unreliable.

Whenever two solutions exist, choose the simpler one unless measurable evidence justifies additional complexity.

2. The product comes before infrastructure.

MAP is valuable because it reduces cognitive load—not because it uses sophisticated technology.

Infrastructure supports the product.

It never defines it.

3. Replaceability

Every external service should be replaceable.

Examples:

Supabase can later become PostgreSQL.
Gumroad can later become Stripe.
Notion can later become an internal CMS.

The architecture should isolate vendor-specific code.

4. Separation of concerns

Each component owns one responsibility.

Examples:

Decision Engine

Generates recommendations.

Authentication

Identifies users.

Payments

Grant access.

Email

Communicates with users.

No component should perform another component's responsibility.

5. Documentation before implementation

No engineer should guess.

If implementation requires guessing,

documentation is incomplete.

3. Product Architecture Principles

Every implementation must reinforce MAP's product principles.

Principle 1

Reduce cognitive load.

Never increase it.

Principle 2

One recommendation.

Never many.

Principle 3

Momentum matters more than optimization.

Helping someone complete today's work is more valuable than generating the perfect plan.

Principle 4

Protect progress.

Never lose user data.

Principle 5

Trust is cumulative.

Every interaction should increase confidence that MAP will help tomorrow.

Principle 6

Recommendations should feel intentional.

Users should understand why today's action exists.

Principle 7

Execution beats information.

MAP measures completed work,

not consumed advice.

4. Engineering Principles

Engineering decisions should optimize for maintainability.

Principle 1

Readable code.

Principle 2

Predictable behavior.

Principle 3

Loose coupling.

Principle 4

High cohesion.

Principle 5

Observable systems.

Principle 6

Documentation remains synchronized with implementation.

Principle 7

Small deployable changes.

5. Architectural Goals

MAP's architecture exists to achieve the following goals.

Goal 1

Fast onboarding.

Goal 2

Reliable recommendation generation.

Goal 3

Simple deployment.

Goal 4

Easy feature development.

Goal 5

Minimal vendor lock-in.

Goal 6

Scalable personalization.

Goal 7

Safe experimentation.

6. Architectural Non-Goals

MAP intentionally avoids becoming:

A productivity dashboard
A project management suite
An AI writing replacement
A CRM
A social network
An analytics platform
A complex knowledge management system

Every proposed feature should be evaluated against this list.

7. Repository Map
MAP/

├── .claude/
│
├── .trae/
│
├── docs/
│
│   ├── architecture/
│   │
│   ├── company/
│   │
│   ├── engineering/
│   │
│   ├── product/
│   │
│   └── research/
│
├── app/
│
├── components/
│
├── services/
│
├── hooks/
│
├── lib/
│
├── types/
│
├── utils/
│
├── public/
│
├── tests/
│
├── prisma/
│
└── package.json
Repository Responsibilities
docs/

Institutional memory.

Never contains production code.

app/

Application routes.

UI entry points.

components/

Reusable presentation components.

services/

Business logic.

Decision Engine.

External integrations.

hooks/

Reusable React logic.

lib/

Shared helpers.

types/

Shared TypeScript interfaces.

tests/

Automated testing.

.claude/

MAP Creator OS.

Never modified by Engineering unless documentation changes are approved.

.trae/

MAP Builder engineering rules.

8. System Context
Creator

↓

Next.js Application

↓

Application API

↓

Decision Engine

↓

Supabase

↓

External Services

├── Gumroad
├── Notion
├── Resend
External Services
Supabase

Authentication

Database

Storage

Gumroad

Payments

Licensing

Resend

Transactional email.

Notion

Optional planning workspace.

9. High-Level Architecture
Frontend

↓

Application Layer

↓

Business Logic

↓

Persistence

↓

External Integrations

Each layer depends only on the layer directly beneath it.

No shortcuts.

10. Container Architecture
Frontend

Responsibilities

UI
Navigation
User interaction
API Layer

Responsibilities

Validation
Authorization
Orchestration
Decision Engine

Responsibilities

Generate today's recommendation.

Never render UI.

Never manage authentication.

Database

Stores persistent state.

Never generates recommendations.

Integrations

Responsible only for communication with external services.

11. Core System Components

The system consists of the following bounded components:

Authentication Service
Creator Profile Service
Onboarding Service
Decision Engine
Plan Generator
Daily Focus Service
Completion Tracking Service
Input Tracking Service
Weekly Review Service
Notification Service
Payment Service
Notion Synchronization Service

Each component owns its own business responsibility and communicates through well-defined interfaces.

12. Domain Model

MAP's domain is centered on one primary entity:

Creator

Everything else exists to help the creator execute consistently.

Secondary entities include:

Profile
Goal
Recommendation
Plan
Daily Action
Completion
Input
Review
Streak
Notification

Relationships between these entities will be expanded in Part 2.

13. Core Domain Objects
Creator

Represents the authenticated user.

Profile

Captures onboarding preferences and long-term context.

Goal

Defines the creator's desired outcome.

Recommendation

The single next action generated by the Decision Engine.

Plan

A personalized 30-day sequence of recommendations.

Daily Action

The actionable task displayed each day.

Completion

Records whether a Daily Action was completed.

Input

Tracks supporting activities such as reading, commenting, and idea collection.

Review

Summarizes progress over a review period.

14. Architecture Constraints

To preserve maintainability, the following constraints apply:

No business logic inside UI components.
No direct database access from presentation components.
External services must be accessed through service modules.
All feature work must originate from an approved PRD and Implementation Package.
Architecture changes require an Architecture Decision Record (ADR).
15. Technology Stack
Layer	Technology
Frontend	Next.js (App Router)
Language	TypeScript
Styling	Tailwind CSS
UI Components	shadcn/ui
Authentication	Supabase Auth
Database	Supabase PostgreSQL
Email	Resend
Payments	Gumroad Webhooks
Content Integration	Notion API
Hosting	Vercel
Version Control	GitHub

Each technology was selected because it minimizes operational complexity while supporting the product vision.

16. Future Evolution

This architecture is intentionally designed to evolve without major rewrites.

Future capabilities include:

Adaptive Decision Engine
Multi-user accountability groups
Mobile applications
Marketplace for templates and systems
Public API
AI coaching agents
Enterprise workspaces

Each future capability should integrate into the existing architecture through documented interfaces rather than replacing established components.

End of Part 1

Part 2 covers the operational heart of MAP:

Decision Engine Architecture
AI Architecture
Authentication Flow
Payment Flow
Email Automation
Notion Integration
End-to-End User Journey
Sequence Diagrams

Part 3 covers implementation architecture:

API Design
Folder Responsibilities (expanded)
State Management
Security
Performance
Observability
Deployment
ADRs
Architecture Fitness Functions
Engineering Governance


2.5 Guiding Architectural Decisions

These decisions are considered foundational to MAP. They should not be changed without an approved Architecture Decision Record (ADR) because they influence every other part of the system.

AD-001 — Product Before Technology

Technology choices exist to support the product promise.

MAP will never introduce technology solely because it is fashionable.

Every technical decision must make the creator's experience simpler.

AD-002 — Next.js as the Application Framework

MAP is built using Next.js (App Router) because it provides:

Server Components
Route Handlers
Excellent TypeScript support
Incremental adoption
Vercel-native deployment
Long-term ecosystem stability

Changing frameworks requires an ADR.

AD-003 — Supabase as the Backend Platform

Supabase is selected because it provides:

Authentication
PostgreSQL
Row-Level Security
Storage
Edge Functions (future)

MAP intentionally separates business logic from Supabase-specific implementations so that migration remains possible if future requirements change.

## AD-004 — Gumroad for Initial Payments, Stripe as Planned Phase 2

**Status:** Approved
**Decision Log Reference:** See `decision_log.md`, entry dated 2026-09-06 ("MAP-002 payment provider — full decision path")

MAP uses **Gumroad** as its payment provider for Phase 1 (MAP-002, current build), because it minimizes operational overhead and requires no blocking prerequisite to start building.

Responsibilities include:

- Payment processing
- License verification
- Checkout

**Phase 2 (planned, not yet built): Stripe.** Once MAP is registered as a US business entity, Stripe becomes the target payment provider, because it natively supports the recurring-subscription pricing model in `pricing.md` more directly than Gumroad. This migration is tracked here so it isn't lost, but is scoped as its own future PRD — not built as part of MAP-002.

Future migration to Stripe (or any other provider) must preserve the existing Payment Service interface, so the application layer never needs a rewrite — only the provider-specific adapter changes.

**Considered and ruled out:**

- **Grey**, a multi-currency receiving account (not a checkout/webhook API) — evaluated directly and found not to offer the developer infrastructure MAP-002 requires (no evidence of a checkout or subscription-billing API). Not viable as an automated provider.
- **Manual payment via Grey** (creators pay in directly, founder manually confirms) — considered as a stopgap while Stripe was blocked on US registration, then set aside once Gumroad was confirmed to have no such blocker itself. A manual process doesn't scale even as a temporary measure, and wasn't necessary once Gumroad was back on the table.
- **Stripe now** — ruled out for Phase 1 specifically because Stripe does not support direct merchant accounts or payouts for Nigerian-registered businesses, and MAP is not yet a US entity. Remains the confirmed Phase 2 target once that changes.

Changing providers again in the future still requires a new ADR, per the original governance intent of this section.

AD-005 — Resend for Transactional Email

Resend is responsible only for transactional communication.

Examples:

Welcome emails
Weekly reviews
Reminder emails

Email templates remain owned by the product team.

AD-006 — Notion as an Optional Workspace

Notion is an integration—not the primary source of truth.

The authoritative data always resides in MAP's database.

If synchronization fails, MAP continues functioning normally.

AD-007 — Deterministic Decision Engine First

The MVP Decision Engine uses explicit rules.

Adaptive AI recommendations are introduced only after sufficient execution history exists.

This makes recommendations:

Explainable
Predictable
Testable

before optimization through machine learning.

AD-008 — Repository as the Source of Truth

The Git repository contains:

Product knowledge
Engineering knowledge
Architecture
Source code

No critical knowledge should exist exclusively in conversations.

AD-009 — Documentation Before Code

Implementation begins only after:

Approved PRD
Approved Implementation Package
Updated architecture (if required)

Documentation leads engineering—not the reverse.

AD-010 — AI as an Engineering Assistant

AI systems (MAP OS and MAP Builder) accelerate design and implementation but do not replace governance.

Final responsibility for product decisions remains with the Founder.

Part 2 — Operational Architecture

Document: docs/architecture/system-architecture.md
Version: 2.0
Part: 2 of 3

Table of Contents
17. Decision Engine Overview
18. Decision Engine Pipeline
19. Recommendation Rules
20. Recovery Mode
21. AI Architecture
22. Authentication Flow
23. Payment Flow
24. Creator Onboarding
25. Personalized 30-Day Plan
26. Daily Focus Experience
27. Completion Tracking
28. Input Tracking
29. Weekly Review
30. Email Architecture
31. Notion Synchronization
32. End-to-End User Journey
33. Sequence Diagrams
17. Decision Engine Overview

The Decision Engine is the heart of MAP.

Every major feature exists to support it.

Its responsibility is simple:

Produce exactly one meaningful next action for the creator.

It is not:

a scheduler
a dashboard
a content writer
a task manager

It is a recommendation system focused on reducing decision fatigue.

Product Promise

Every recommendation should answer:

"What is the highest-value thing I should do next?"

18. Decision Engine Pipeline
Creator Profile
        │
Goals
        │
Execution History
        │
Time Available
        │
Energy Level
        │
Platform Rules
        │
Decision Rules
        │
Recommendation Generator
        │
Validation
        │
Daily Focus

Every stage has a single responsibility.

Inputs

Required:

Creator profile
Platform
Content goal
Posting frequency
Current day

Optional:

Time available
Energy level
Recent inputs
Missed days
Output

Exactly one recommendation containing:

Title
Description
Estimated duration
Reason
Success criteria

Example:

Write five rough bullet points for tomorrow's Note. Estimated time: 15 minutes.

19. Recommendation Rules

The MVP uses deterministic business rules.

Examples:

If onboarding is incomplete → finish onboarding.
If today's task is unfinished → resume it.
If newsletter day → prioritize newsletter.
If energy is low → reduce task scope.
If review day → replace creation with reflection.

Rules must be explainable and testable.

20. Recovery Mode

Recovery Mode activates after consecutive missed actions.

Objectives:

Restore momentum.
Reduce pressure.
Avoid guilt.

Instead of increasing workload, MAP temporarily recommends smaller, achievable actions.

Recovery ends automatically after consistent completion resumes.

21. AI Architecture

AI augments the system but does not control it.

AI Responsibilities
Expand ideas
Suggest outlines
Draft content
Generate summaries
Explain recommendations
Non-AI Responsibilities
Authentication
Authorization
Payments
Persistence
Business rules

Prompts should be versioned and documented to ensure consistent behavior.

22. Authentication Flow
Visitor
   │
Sign Up
   │
Supabase Auth
   │
Email Verification
   │
Authenticated Session
   │
Protected Application

All protected routes require a valid authenticated session.

23. Payment Flow
Creator
   │
Gumroad Checkout
   │
Payment Success
   │
Webhook Verification
   │
Grant Access
   │
Welcome Email

Access is never granted until webhook verification succeeds.

Webhook signatures must be validated before processing.

24. Creator Onboarding

The onboarding experience collects:

Creator type
Platform
Audience
Topics
Tone
Publishing cadence
Goals
AI preference
Review cadence

The onboarding service creates the Creator Profile consumed by the Decision Engine.

25. Personalized 30-Day Plan

After onboarding:

Analyze profile.
Generate a structured 30-day execution plan.
Store recommendations.
Display Day 1 immediately.

The plan serves as a baseline and may evolve based on future features.

26. Daily Focus Experience

The first screen after sign-in answers:

"What should I do today?"

Primary elements:

Welcome message
Today's action
Estimated time
Why this matters
Complete button

Secondary information remains hidden until requested.

27. Completion Tracking

When an action is completed:

Record timestamp.
Update streak.
Unlock next recommendation (if appropriate).
Refresh progress metrics.

Completion data becomes an input to future recommendations.

28. Input Tracking

Creators may log:

Ideas
Reading
Comments
Replies
Inspiration

Inputs enrich future recommendations but never interrupt the Daily Focus flow.

29. Weekly Review

Each review summarizes:

Actions completed
Publishing consistency
Engagement inputs
Missed opportunities
Suggested improvements

Reviews encourage reflection without overwhelming the user.

30. Email Architecture

Email is event-driven.

Core events:

Welcome
Onboarding reminder
Weekly review
Recovery encouragement
Account notifications

Email delivery failures should be logged and retried.

31. Notion Synchronization

Notion is optional.

Synchronization includes:

Creator profile
Content calendar
Generated 30-day plan

Failures never block the core MAP experience.

MAP remains the system of record.

32. End-to-End User Journey
Landing Page
      │
Register
      │
Payment
      │
Onboarding
      │
Creator Profile
      │
Decision Engine
      │
30-Day Plan
      │
Today's Focus
      │
Completion
      │
Tracking
      │
Weekly Review
      │
Tomorrow's Focus

The journey is cyclical, reinforcing consistent execution.

33. Sequence Diagrams
Initial Onboarding
Visitor
   │
Register
   │
Purchase
   │
Verify Payment
   │
Complete Onboarding
   │
Generate Profile
   │
Run Decision Engine
   │
Generate 30-Day Plan
   │
Display Day 1
Daily Session
Creator
   │
Sign In
   │
Load Today's Action
   │
Complete Action
   │
Persist Progress
   │
Update Recommendation Context
   │
Session Ends
Weekly Review
Review Trigger
      │
Aggregate Progress
      │
Generate Summary
      │
Display Review
      │
Update Future Context

