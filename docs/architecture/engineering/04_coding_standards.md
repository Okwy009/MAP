# Engineering Architecture v2.0

# Part 3C.4 — Coding Standards

**Document:** `docs/architecture/coding-standards.md`

**Version:** 2.0

**Status:** Approved

**Owner:** Engineering

---

# Purpose

This document defines the coding standards for MAP.

It answers one question:

> **"What does production-quality code look like in MAP?"**

Consistency improves:

- readability
- maintainability
- collaboration
- reliability

Every engineer and AI coding agent must follow these standards.

---

# Coding Philosophy

MAP values code that is:

- Simple
- Predictable
- Explicit
- Testable
- Maintainable

Code is written for humans first and computers second.

Future engineers should understand the code without needing additional explanation.

---

# Technology Stack

MAP is built using:

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- PostgreSQL

Every implementation should follow the best practices of these technologies.

---

# General Principles

Always prefer:

- readability
- simplicity
- composition
- explicitness
- consistency

Avoid:

- clever abstractions
- duplicated logic
- hidden behavior
- unnecessary dependencies

---

# TypeScript Standards

TypeScript is mandatory throughout the project.

## Always

- Use explicit interfaces.
- Prefer `type` for unions and utility types.
- Prefer `interface` for domain models.
- Enable strict mode.

Example:

```typescript
interface Creator {
  id: string;
  name: string;
  platform: Platform;
}
```

---

## Never Use `any`

❌

```typescript
const user: any
```

✔

```typescript
const user: Creator
```

If the type is unknown, use:

```typescript
unknown
```

and narrow it safely.

---

# Naming Conventions

## Components

Use PascalCase.

```text
RecommendationCard.tsx

DailyFocus.tsx

CreatorProfile.tsx
```

---

## Hooks

Prefix with `use`.

```text
useCreator.ts

useRecommendations.ts

useStreak.ts
```

---

## Types

Use singular nouns.

```text
creator.ts

recommendation.ts

subscription.ts
```

---

## Utility Functions

Use descriptive verbs.

```typescript
generatePlan()

calculateStreak()

formatRecommendation()
```

Avoid vague names like:

```typescript
process()

handle()

update()
```

---

## Constants

Use UPPER_SNAKE_CASE.

```typescript
MAX_DAILY_ACTIONS

DEFAULT_SESSION_LENGTH
```

---

# File Naming

Files use kebab-case.

```text
creator-profile.ts

decision-engine.ts

daily-focus.tsx
```

Avoid:

```text
CreatorProfileFinal2.ts

newFile.ts

temp.ts
```

---

# Folder Naming

Folders also use kebab-case.

```text
decision-engine/

creator-profile/

weekly-review/
```

---

# Component Standards

Every component should have one responsibility.

Good:

```text
RecommendationCard
```

Bad:

```text
RecommendationDashboardManager
```

Large components should be split into smaller reusable pieces.

---

# Component Size

Recommended maximum:

- 200–300 lines

If a component grows significantly beyond this, evaluate whether it should be decomposed.

---

# Component Structure

Preferred order:

```typescript
Imports

Types

Constants

Component

Helpers

Exports
```

Maintain a predictable structure.

---

# React Standards

Prefer:

- Functional components
- Hooks
- Composition

Avoid:

- Class components
- Deep prop drilling
- Excessive Context usage

---

# Server Components

Use Server Components whenever possible.

Use Client Components only when required for:

- state
- effects
- browser APIs
- user interaction

Server rendering improves performance.

---

# State Management

Choose the smallest appropriate solution.

| State | Solution |
|--------|----------|
| Local UI | React state |
| Shared UI | Context |
| Server Data | Supabase |
| Persistent Data | Database |

Avoid introducing unnecessary global state.

---

# Business Logic

Business logic belongs inside:

```text
features/

services/

lib/
```

Never inside UI components.

Components should render data—not create business rules.

---

# API Standards

Every endpoint should:

- Validate input
- Authenticate user
- Handle errors
- Return typed responses
- Log failures

Avoid exposing internal implementation details.

---

# Error Handling

Never ignore errors.

Bad:

```typescript
try {

} catch {}
```

Good:

```typescript
try {

} catch (error) {

    logger.error(error)

    throw new AppError(...)
}
```

Errors should be meaningful and actionable.

---

# Logging

Log:

- unexpected failures
- external service calls
- retries
- background jobs

Never log:

- passwords
- API keys
- payment information
- personal creator content

---

# Validation

Never trust client input.

Validate:

- forms
- query parameters
- API payloads
- webhooks

Validation should occur on the server.

---

# Database Standards

Prefer:

- parameterized queries
- indexes
- foreign keys
- transactions where appropriate

Avoid:

- duplicated queries
- unnecessary joins
- N+1 queries

Database performance matters.

---

# Environment Variables

Secrets belong only in:

```text
.env.local
```

Never commit:

- API keys
- tokens
- database credentials

Maintain:

```text
.env.example
```

for onboarding.

---

# Styling Standards

MAP uses:

- Tailwind CSS
- shadcn/ui

Do not create competing styling systems.

---

# Tailwind Guidelines

Prefer reusable utilities.

Avoid excessively long class lists.

If styles repeat across multiple components, extract them.

---

# Design Tokens

Use centralized tokens.

Examples:

```text
Primary Colors

Spacing

Typography

Radius

Shadows
```

Avoid hard-coded values.

---

# Accessibility

Every interface should support:

- keyboard navigation
- focus visibility
- semantic HTML
- screen readers
- sufficient contrast

Accessibility is part of product quality.

---

# Performance

Prefer:

- lazy loading
- memoization when justified
- optimized images
- server rendering
- caching

Measure before optimizing.

---

# Comments

Code should explain itself.

Only comment:

- business reasoning
- complex algorithms
- non-obvious decisions

Avoid comments that repeat the code.

Bad:

```typescript
// increment counter

counter++
```

Good:

```typescript
// Recovery mode intentionally reduces workload after three missed days.
```

---

# Code Duplication

Follow the Rule of Three.

1st occurrence:

Duplicate.

2nd occurrence:

Observe.

3rd occurrence:

Extract.

Do not abstract prematurely.

---

# Dependency Management

Every dependency should have a clear justification.

Before adding a package, ask:

- Can the platform already do this?
- Can existing code solve this?
- Is the maintenance cost worth it?

Fewer dependencies reduce long-term risk.

---

# Security Standards

Always:

- sanitize input
- validate authorization
- escape output
- use HTTPS
- rotate secrets

Never trust external input.

---

# AI-Generated Code

AI-generated code must:

- compile
- pass linting
- include types
- follow naming conventions
- include tests where appropriate
- be reviewed by a human

AI output is a draft—not production-ready by default.

---

# Code Review Checklist

Before approving code, verify:

- Requirements implemented
- Naming consistent
- No duplicated logic
- Strong typing
- Tests added
- Documentation updated
- Security reviewed
- Performance acceptable
- Accessibility considered

---

# Definition of High-Quality Code

High-quality code is:

- Correct
- Readable
- Testable
- Maintainable
- Secure
- Performant
- Documented

Not merely code that "works."

---

# Guiding Statement

Every line of code should make MAP easier to understand, easier to maintain, and more reliable for creators.

The goal is not to write impressive software.

The goal is to build software that quietly helps creators publish consistently for years to come.

---

# Relationship to Other Documents

This document complements:

- `engineering-principles.md`
- `repository-architecture.md`
- `development-workflow.md`
- `testing-strategy.md`
- `documentation-standards.md`
- `ai-assisted-development.md`

Together they define the engineering standards expected across the MAP codebase.

---