# First User Experience

**Document:** first-user-experience.md

**Version:** 2.0

**Owner:** Product

**Status:** Approved

---

# Purpose

This document defines the user's experience during the first moments of using MAP.

It answers one question:

> **"What should happen immediately after a user enters MAP?"**

The goal is simple:

**Reduce uncertainty. Create immediate momentum.**

MAP should never overwhelm users with dashboards, menus, statistics, or options before helping them take action.

---

# Core Principle

When someone opens MAP, they should never ask:

> **"What do I do now?"**

Instead, MAP should immediately answer:

> **"Here's your next step."**

Everything else is secondary.

---

# Experience Philosophy

The first interaction should feel like an accountability partner—not project management software.

MAP does not introduce features.

MAP creates momentum.

The experience should move the user from:

**Uncertainty → Clarity → Action → Progress**

within seconds.

---

# Two Entry Experiences

MAP has two primary entry points.

1. First Session (after onboarding)
2. Daily Session (returning users)

Each has a different objective.

---

# First Session Experience

## Goal

Help the creator begin immediately.

MAP already knows the creator because onboarding has been completed.

The creator should **not** repeat information already collected.

---

## Screen

```text
Welcome, [Name]

Your personalized 30-day execution plan is ready.

Today's Focus

Write your introductory Note.

Estimated time:
20 minutes

Why this?

Publishing today starts your consistency journey.

[Start]
```

---

## User Action

The user clicks:

> Start

---

## MAP Response

MAP opens the writing workflow (or linked editor).

No additional setup.

No tutorials.

No dashboard exploration.

The creator begins creating.

---

## Success

The user starts their first meaningful action within the first minute.

---

# Daily Session Experience

## Goal

Remove decision fatigue.

The creator returns expecting one thing:

> What should I do today?

MAP should answer immediately.

---

## Screen

```text
Welcome back, [Name]

Today's Focus

Write today's Note.

Estimated time:
20 minutes

Why this?

Today's Note keeps your publishing streak alive.

[Start]
```

---

The recommendation is produced by the Decision Engine.

No competing priorities appear above it.

---

# When Context Is Missing

Sometimes MAP may need additional context before making a recommendation.

Examples:

- available time
- energy level

Only then should MAP ask questions.

---

## Context Check

```text
How much time do you have today?

○ 10 minutes

○ 20 minutes

○ 30+ minutes
```

---

```text
How's your energy today?

○ Low

○ Medium

○ High
```

---

If the creator skips these questions:

MAP assumes:

- Medium energy
- Default available time

The user is never blocked.

---

# Decision Engine

After receiving any needed context:

```text
Creator Profile
        +
Goals
        +
Current Progress
        +
Today's Context
        ↓
Decision Engine
        ↓
Today's Focus
```

---

# Recommendation Format

Every recommendation contains five parts.

## 1. Today's Focus

The primary action.

Example:

> Write today's Note.

---

## 2. Estimated Time

Example:

> 20 minutes

---

## 3. Why

Explain why this action matters.

Example:

> This keeps your publishing consistency intact.

---

## 4. Success Condition

Example:

> Mark today's Note as published.

---

## 5. Primary CTA

```text
[Start]
```

Only one primary button.

---

# Execution Loop

Once the user completes the action:

MAP asks:

```text
Did you complete today's action?

[Yes]

[Not Yet]
```

---

## If Yes

MAP records completion.

Updates progress.

Then chooses one of two outcomes.

### Outcome A

The session ends.

```text
Great work.

You're done for today.

See you tomorrow.
```

---

### Outcome B

A supporting action is offered.

Example:

```text
Optional

Reply to five comments.

Estimated time:

10 minutes
```

Supporting actions are always optional.

---

## If Not Yet

MAP simply returns the creator to the current task.

No guilt.

No punishment.

---

# First Session Rules

The first screen must never contain:

- Analytics
- Streaks
- Progress charts
- Monthly reports
- Leaderboards
- Multiple navigation choices
- Feature tours

The only priority is helping the creator begin.

---

# Daily Session Rules

The first screen should contain:

- Welcome message
- Today's Focus
- Estimated time
- Why
- Start button

Everything else belongs below the fold or behind secondary navigation.

---

# Recovery Experience

If the creator missed days:

MAP never says:

> You're behind.

Instead:

```text
Welcome back.

Let's rebuild momentum.

Today's Focus

Write one simple Note.

Estimated time:
10 minutes.
```

MAP reduces pressure.

It never creates guilt.

---

# Emotional Journey

## First Session

"I know exactly how to begin."

---

## Daily Use

"I don't have to think about what comes next."

---

## Missed Days

"I can recover without feeling overwhelmed."

---

## Long-Term

"I trust MAP to guide my daily execution."

---

# Success Criteria

The first experience succeeds when the creator:

- Understands today's objective within seconds.
- Starts meaningful work immediately.
- Never feels overwhelmed.
- Trusts the recommendation.
- Leaves with momentum.

---

# Failure Conditions

The experience has failed if the creator:

- Doesn't know what to do next.
- Sees multiple competing priorities.
- Spends more time navigating than creating.
- Feels guilty after missing days.
- Encounters unnecessary setup before taking action.

---

# Relationship to Other Product Documents

This document works alongside:

- **product.md** — Defines what MAP is.
- **mechanism.md** — Explains how MAP creates value.
- **decision-engine-spec.md** — Defines how MAP selects today's recommendation.
- **user-journey.md** — Defines the complete lifecycle from discovery to long-term usage.

This document focuses on a single moment:

> **What should the creator experience in the first few moments of every MAP session?**

Every design decision should reinforce MAP's promise:

**Clarity → Action → Momentum.**