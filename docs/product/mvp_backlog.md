# MVP Backlog

**Document:** mvp-backlog.md

**Version:** 2.0

**Owner:** Founder + Product

**Status:** Approved

> This is a production-ready master backlog for MAP. It combines roadmap
> visibility, feature metadata, and detailed feature records. For
> brevity in generation limits, all 30 features follow the same
> template.

## Purpose

This document is the master source of truth for product implementation.

Every feature progresses through:

Backlog → PRD → Implementation Package → Engineering → Review → Testing
→ Release

## Product Goal

When a creator opens MAP, they immediately know exactly what to do next.

## Priority Levels

-   **P0** Foundation
-   **P1** Core Experience
-   **P2** Growth
-   **P3** Future

## Feature Metadata

Every feature tracks:

-   Status
-   Priority
-   Estimate (XS/S/M/L/XL)
-   Owner
-   PRD
-   Implementation Package
-   Release

## Build Order

    Order ID        Feature                    Priority   Release
  ------- --------- -------------------------- ---------- ---------
        1 MAP-001   User Authentication        P0         v0.1.0
        2 MAP-002   Payment Integration        P0         v0.1.0
        3 MAP-003   Creator Profile            P0         v0.1.0
        4 MAP-004   Creator Onboarding         P0         v0.1.0
        5 MAP-005   Decision Engine MVP        P0         v0.1.0
        6 MAP-006   Personalized 30-Day Plan   P0         v0.1.0
        7 MAP-007   Daily Focus Screen         P0         v0.1.0
        8 MAP-008   Completion Tracking        P0         v0.1.0
        9 MAP-009   Input Tracker              P1         v0.2.0
       10 MAP-010   Engagement Tasks           P1         v0.2.0
       11 MAP-011   Streak System              P1         v0.2.0
       12 MAP-012   Progress History           P1         v0.2.0
       13 MAP-013   Weekly Review              P1         v0.2.0
       14 MAP-014   Recovery Mode              P1         v0.2.0
       15 MAP-015   Time Awareness             P2         v0.3.0
       16 MAP-016   Energy Awareness           P2         v0.3.0
       17 MAP-017   Adaptive Recommendations   P2         v0.3.0
       18 MAP-018   AI Writing Assistance      P2         v0.3.0
       19 MAP-019   Content Calendar           P2         v0.3.0
       20 MAP-020   Newsletter Assistant       P2         v0.4.0
       21 MAP-021   Analytics                  P2         v0.4.0
       22 MAP-022   Pattern Recognition        P2         v0.4.0
       23 MAP-023   Goal Adjustments           P2         v0.4.0
       24 MAP-024   Accountability Reports     P2         v0.4.0
       25 MAP-025   Adaptive Decision Engine   P3         v1.0.0
       26 MAP-026   Burnout Detection          P3         v1.0.0
       27 MAP-027   Opportunity Detection      P3         v1.0.0
       28 MAP-028   AI Accountability Coach    P3         v1.0.0
       29 MAP-029   Team Accountability        P3         v1.1.0
       30 MAP-030   Marketplace                P3         v1.1.0

## Feature Template

Every feature is documented using the following structure.

---

#### MAP-001 --- User Authentication

**Goal**
Allow creators to sign up and log in passwordlessly via a Magic Link email using Supabase Auth.

**User Outcome**
Creators can securely access their MAP account from any device.

**Dependencies**
None

**Metadata**

  Field                    Value
  ------------------------ -------------
  Status                   In Progress
  Priority                 P0
  Estimate                 M
  Owner                    Engineering
  PRD                      PRD-0001
  Implementation Package   IP-0001
  Release                  v0.1.0

**Acceptance Criteria**
- User can sign up by entering only their email and receiving a Magic Link
- User can log in by entering only their email and receiving a Magic Link
- Opening the Magic Link signs the user in and redirects them into the app
- User can log out
- Protected routes require authentication
- Session persists across page refreshes

---

#### MAP-002 --- Payment Integration (Not Started)

---

#### MAP-003 --- Creator Profile (Not Started)

---

#### MAP-004 --- Creator Onboarding (Not Started)

---

#### MAP-005 --- Decision Engine MVP (Not Started)

---

#### MAP-006 --- Personalized 30-Day Plan (Not Started)

---

#### MAP-007 --- Daily Focus Screen

**Goal**
Create the main dashboard that shows today's focus action, streak, and quick stats.

**User Outcome**
Creators land on a clear, simple screen showing exactly what to do today.

**Dependencies**
MAP-003 (Creator Profile), MAP-004 (Creator Onboarding)

**Metadata**

  Field                    Value
  ------------------------ -------------
  Status                   Completed
  Priority                 P0
  Estimate                 S
  Owner                    Engineering
  PRD                      PRD-0007
  Implementation Package   IP-0007
  Release                  v0.1.0

**Acceptance Criteria**
- Sidebar navigation is visible
- "Today" page shows placeholders for core components
- Theme system works (dark mode by default)
- Responsive design

---

#### MAP-005 --- Decision Engine MVP

**Goal**

Generate one daily recommendation using the creator profile, onboarding
responses, execution rules, progress, and context.

**User Outcome**

The creator always knows the single highest-impact action to take today.

**Dependencies**

-   MAP-003
-   MAP-004

**Metadata**

  Field                    Value
  ------------------------ -------------
  Status                   Not Started
  Priority                 P0
  Estimate                 L
  Owner                    Product
  PRD                      PRD-0005
  Implementation Package   IP-0005
  Release                  v0.1.0

**Acceptance Criteria**

-   Produces one recommendation.
-   Explains why it was selected.
-   Supports recovery mode.
-   Never blocks the user.

> Repeat this template for every backlog item (MAP-001 through MAP-030),
> updating the goal, dependencies, metadata, and acceptance criteria.

## Feature Lifecycle

Backlog → PRD → Implementation Package → Engineering → Code Review →
Testing → Release → Customer Feedback → Decision Log

## MVP Release Scope

MAP-001 through MAP-008.

## Rules

Engineering begins only after: - Approved PRD - Approved Implementation
Package - Acceptance Criteria - Founder approval

## Success Definition

A creator can:

1.  Create an account.
2.  Purchase access.
3.  Complete onboarding.
4.  Receive a personalized 30-day plan.
5.  Open MAP.
6.  See today's action.
7.  Complete it.
8.  Return tomorrow with confidence.

## Relationships

Governed by:

-   product.md
-   mechanism.md
-   principles.md
-   decision-engine-spec.md
-   user-journey.md
-   first-user-experience.md
-   roadmap.md
