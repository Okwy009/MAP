# User Journey

**Document:** user-journey.md

**Version:** 1.0

**Owner:** Product

**Status:** Approved

---

# Purpose

This document defines the complete MAP user experience from first discovery through long-term usage.

It answers one question:

> **"What should the user experience from the moment they discover MAP until they become a consistent creator?"**

This is the product contract for the customer journey.

It does **not** define implementation details.

It defines the experience.

---

# Design Principles

Every stage of the journey must:

- Reduce cognitive load.
- Remove unnecessary decisions.
- Protect momentum.
- Build trust.
- Create small wins quickly.
- Make progress visible.
- Never overwhelm the user.

Every screen must answer:

> **What is the one thing the user should do next?**

---

# Journey Overview

```text
Discover MAP
        ↓
Learn About MAP
        ↓
Join MAP
        ↓
Complete Onboarding
        ↓
Generate Personalized Plan
        ↓
Today's Focus
        ↓
Execute
        ↓
Track Progress
        ↓
Weekly Review
        ↓
Decision Engine Adjusts
        ↓
Repeat Daily
```

---

# Stage 1 — Discovery

## Goal

Help the visitor understand what MAP does.

## User Questions

- What is MAP?
- Is this for me?
- Why is it different?

## User Sees

Landing page.

MAP positioning.

Problem statement.

Social proof.

CTA.

## User Action

Clicks:

> Start My 30-Day System

## Success

User believes MAP can help them become more consistent.

---

# Stage 2 — Registration

## Goal

Create a MAP account.

## User Sees

Registration page.

User enters:

- Name
- Email
- Password

Or signs in with Google.

## MAP Does

Creates a user account.

Starts onboarding.

## Success

Authenticated user.

---

# Stage 3 — Payment

## Goal

Unlock MAP.

## User Sees

Pricing.

Checkout.

## User Action

Purchases MAP.

## MAP Does

Confirms payment.

Unlocks onboarding.

Triggers welcome email.

## Success

Paid account.

---

# Stage 4 — Creator Onboarding

## Goal

Understand the creator.

MAP asks questions about:

### Creator Profile

- Creator type
- Platform
- Audience
- Topics
- Tone

### Goals

- 30-day success definition

### Publishing Preferences

- Posting frequency
- Newsletter cadence

### AI Preferences

- AI writing assistance

### Review Preferences

- Weekly review schedule

## MAP Does

Stores profile.

Creates creator workspace.

## Success

Complete creator profile.

---

# Stage 5 — Build the 30-Day Plan

## Goal

Generate an execution plan.

## MAP Uses

- Creator profile
- Goals
- Publishing schedule
- Decision Engine rules

## MAP Generates

A personalized 30-day execution plan.

Each day includes:

- Primary task
- Optional supporting task
- Estimated time
- Success condition

## User Sees

> Your personalized MAP is ready.

## Success

Creator receives a personalized plan.

---

# Stage 6 — First Login

## Goal

Deliver immediate clarity.

## User Sees

```text
Welcome, [Name]

Today's Focus

Write today's Note.

Estimated time:
20 minutes

Why this?

Today's note builds momentum toward your
30-day publishing goal.

[Start]
```

The user should never see an overwhelming dashboard first.

## Success

User immediately knows what to do.

---

# Stage 7 — Execute

## Goal

Complete today's action.

Examples:

- Write today's Note
- Publish newsletter
- Reply to comments
- Read creator inspiration
- Review analytics

Only ONE primary action is shown.

## User Marks Complete

MAP records completion.

Updates progress.

## Success

Today's action completed.

---

# Stage 8 — Supporting Actions

After the primary action is complete,
MAP may suggest optional actions.

Examples:

- Reply to 5 comments
- Read one article
- Engage with subscribers
- Record an idea

These are never shown before the primary action.

## Success

Optional work completed without distracting from the primary objective.

---

# Stage 9 — Daily Tracking

MAP automatically records:

- Completed actions
- Publishing streak
- Inputs
- Engagement
- Notes published
- Newsletters sent

The user should spend minimal time tracking.

Tracking should feel effortless.

## Success

Progress recorded.

---

# Stage 10 — Weekly Review

## Goal

Reflection.

MAP asks:

- What worked?
- What didn't?
- What felt difficult?
- What generated momentum?

MAP summarizes:

- Wins
- Challenges
- Trends

## Success

Creator understands their week.

---

# Stage 11 — Decision Engine Update

Using:

- completed work
- missed work
- weekly review
- publishing behavior

The Decision Engine adjusts future recommendations.

Examples:

Missed multiple days

↓

Reduce workload.

Strong consistency

↓

Increase challenge.

High engagement

↓

Recommend repeating successful content.

## Success

MAP becomes increasingly personalized.

---

# Stage 12 — Long-Term Growth

As creators continue using MAP:

The system begins recommending:

- Better publishing cadence
- Better engagement timing
- Content experiments
- Workflow improvements
- AI assistance
- Growth opportunities

MAP evolves from accountability system into execution partner.

---

# Daily Experience

Every day follows the same loop.

```text
Open MAP
        ↓
See Today's Focus
        ↓
Complete Today's Action
        ↓
Record Progress
        ↓
Receive Confirmation
        ↓
Come Back Tomorrow
```

The loop should take seconds to understand.

---

# Emotional Journey

## Day 1

"I know exactly where to start."

---

## Week 1

"I'm actually following through."

---

## Week 2

"I'm becoming consistent."

---

## Week 3

"I trust MAP."

---

## Day 30

"I don't overthink anymore."

---

# Failure States

The experience has failed if users:

- Don't know what to do next.
- Feel overwhelmed.
- Lose progress.
- Stop trusting recommendations.
- Spend more time managing MAP than creating.
- Feel guilty after missing days.

---

# Success Metrics

MAP succeeds when users:

- Complete today's action.
- Publish consistently.
- Return tomorrow.
- Finish the 30-day program.
- Feel less overwhelmed.
- Report increased consistency.

MAP does **not** optimize for:

- Time spent in the app.
- Number of clicks.
- Dashboard visits.
- Vanity engagement metrics.

Execution is the primary measure of success.

---

# Product Rules

The journey must always:

- Show one primary action.
- Explain why it matters.
- Preserve user progress.
- Respect user constraints.
- Reward consistency.
- Encourage recovery after missed days.

The journey must never:

- Punish missed days.
- Present multiple competing priorities.
- Reward busyness over execution.
- Turn MAP into a productivity dashboard.
- Increase cognitive load.

---

# Relationship to Other Product Documents

This document works alongside:

- **product.md** — Defines what MAP is and its positioning.
- **mechanism.md** — Defines how MAP creates value.
- **decision-engine-spec.md** — Defines how recommendations are generated.
- **roadmap.md** — Defines when capabilities are delivered.
- **principles.md** — Defines the product's guiding principles.

This document answers one question:

> **What should the user experience, from first visit to becoming a consistently executing creator?**

Every future feature, PRD, and engineering implementation must strengthen this journey rather than introduce unnecessary complexity or decision fatigue.