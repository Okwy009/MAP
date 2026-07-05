# MAP Builder — Coding Standards

Version: 1.0.0

Status: Required

Owner: MAP OS Core

---

# Purpose

This document defines the coding standards used throughout MAP.

These standards exist to ensure every engineer—human or AI—writes code that is consistent, readable, maintainable, and easy to extend.

Good code should be understandable before it is impressive.

The primary audience is the next engineer who reads the code.

---

# Core Philosophy

Code is a long-term asset.

Every line should make the codebase easier—not harder—to maintain.

Before writing code, ask:

> "Will another engineer understand this six months from now without asking me?"

If the answer is "no", simplify it.

---

# Guiding Principles

## 1. Readability First

Readable code is preferred over shorter code.

Avoid clever tricks.

Prefer explicit intent.

Good:

```ts
const hasCompletedGoal = goal.status === "completed";
```

Avoid:

```ts
const done = goal.s === 2;
```

---

## 2. Simplicity Before Abstraction

Do not create abstractions until there is clear repetition.

Avoid building generic systems for hypothetical future use.

Rule:

Three real use cases before abstraction.

---

## 3. One Responsibility

Every function should do one thing.

Every component should have one responsibility.

Every file should have one clear purpose.

If a file needs extensive explanation, it is probably doing too much.

---

## 4. Prefer Composition

Compose small pieces.

Avoid deeply nested inheritance or overly complex component trees.

Small reusable components are preferred.

---

## 5. Explicit Over Implicit

Avoid hidden behavior.

Function names should explain intent.

Good:

```ts
calculateNextAction()
```

Better than:

```ts
process()
```

---

# Naming Standards

## Variables

Names should describe meaning.

Good

```ts
remainingActions
```

Avoid

```ts
arr
```

---

## Functions

Functions should begin with verbs.

Examples

```ts
createGoal()

calculateProgress()

generateDailyAction()

validateInput()

saveGoal()
```

Avoid generic names like

```ts
handle()

run()

execute()

process()
```

---

## Components

Use PascalCase.

Examples

```tsx
GoalCard

DailyAction

ProgressIndicator

OnboardingStep
```

---

## Files

Use consistent naming.

Examples

```
goal-card.tsx

daily-action.tsx

goal-service.ts

validation.ts
```

---

# Function Standards

Functions should:

- Do one thing
- Be small
- Return predictable results
- Avoid side effects unless expected

If a function exceeds roughly 50 lines, consider splitting it.

---

# Component Standards

Components should:

Receive data through props.

Avoid unnecessary internal state.

Keep business logic outside UI where practical.

Separate presentation from application logic.

---

# Error Handling

Errors should never fail silently.

Every expected error should:

Be handled.

Provide useful feedback.

Be traceable.

Never hide failures.

Never swallow exceptions.

---

# Comments

Code should explain itself.

Use comments only when explaining:

Why something exists.

Why a decision was made.

Why an unusual implementation is necessary.

Never comment what the code already clearly says.

Good:

```ts
// API requires UTC timestamps to prevent timezone drift.
```

Avoid:

```ts
// Increment counter
counter++;
```

---

# Constants

Avoid magic numbers and hard-coded strings.

Use named constants.

Good:

```ts
const MAX_GOAL_LENGTH = 120;
```

Avoid:

```ts
if (goal.length > 120)
```

---

# State Management

State should be:

Minimal

Predictable

Local whenever possible

Avoid duplicated state.

Derive values instead of storing redundant data.

---

# Validation

Validate all external input.

Never trust:

User input

API responses

Query parameters

Local storage

Validation belongs close to the boundary where data enters the system.

---

# Accessibility

Accessibility is a requirement.

Every UI must support:

Keyboard navigation

Visible focus states

Semantic HTML

Screen readers where appropriate

Accessible labels

Accessibility is never postponed.

---

# Performance

Optimize only after correctness.

Rules:

Avoid unnecessary renders.

Avoid unnecessary network requests.

Lazy-load where appropriate.

Do not sacrifice readability for micro-optimizations.

---

# Dependencies

Before adding a dependency, ask:

Does the platform already solve this?

Can we build this simply ourselves?

Does this increase long-term maintenance?

Prefer fewer dependencies.

---

# Refactoring

Refactor when it improves:

Readability

Maintainability

Consistency

Do not refactor unrelated code during feature implementation.

Stay within scope.

---

# Testing Mindset

Code should be easy to test.

Favor pure functions.

Avoid tightly coupled logic.

Design with testability in mind.

---

# Security

Never trust client input.

Validate everything.

Avoid exposing sensitive information.

Protect user data by default.

Prefer secure defaults.

---

# Logging

Logs should help diagnose problems.

Avoid noisy logging.

Never log:

Passwords

Tokens

Sensitive user information

Personally identifiable information

---

# Technical Debt

If technical debt is introduced:

Document it.

Explain why.

Estimate impact.

Recommend follow-up work.

Never hide it.

---

# Code Review Checklist

Before considering work complete, verify:

- Naming is clear.
- Functions have one responsibility.
- Components are appropriately sized.
- No duplicated logic.
- No unnecessary abstraction.
- Errors are handled.
- Accessibility maintained.
- Tests updated.
- Scope respected.
- Code is easier to understand than before.

---

# Guiding Philosophy

The purpose of engineering is not to write code.

The purpose of engineering is to create software that people can confidently build upon.

Every commit should leave the codebase slightly better than it was before.

Optimize for clarity.

Optimize for maintainability.

Optimize for trust.

That is the MAP engineering standard.