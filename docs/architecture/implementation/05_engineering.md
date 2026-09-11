# Part 3A.5 — Coding Standards & Implementation Governance

**Document:** `docs/architecture/system-architecture.md`

**Version:** 2.0

**Part:** 3A.5

**Status:** Approved

**Owner:** Engineering

---

# Purpose

This chapter defines the engineering standards that govern every line of code written for MAP.

It answers one question:

> **"What does production-quality engineering look like inside MAP?"**

These standards are mandatory for humans and AI agents (MAP Builder) alike.

---

# Engineering Philosophy

MAP is a long-term software product.

Every engineering decision should optimize for:

- readability
- maintainability
- correctness
- scalability
- security

Code is written for future engineers—not just current ones.

---

# Engineering Principles

Every implementation should embody the following principles.

## 1. Clarity Over Cleverness

Readable code always wins.

Good

```ts
const recommendation = await recommendationService.generateToday(userId);
```

Avoid

```ts
const r = await rs.g(u);
```

---

## 2. Simplicity Before Abstraction

Duplicate once.

Refactor later.

Avoid building generic systems before the need exists.

---

## 3. One Responsibility

Every:

- function
- class
- component
- service
- module

should have one reason to change.

---

## 4. Explicit Beats Implicit

Prefer obvious behavior.

Avoid hidden side effects.

---

## 5. Fail Safely

Unexpected situations should:

- return meaningful errors
- preserve user data
- log diagnostics
- never expose secrets

---

# TypeScript Standards

TypeScript is mandatory.

Never disable type checking.

Forbidden

```ts
any
```

Prefer

```ts
Recommendation

CreatorProfile

EnergyLevel
```

Types communicate intent.

---

# Strict Mode

The repository must always compile with:

```
strict: true
```

No exceptions.

---

# Interfaces

Interfaces describe business concepts.

Good

```ts
interface CreatorProfile
```

Avoid

```ts
interface Data
```

---

# Enums

Prefer enums or string unions for finite values.

Example

```ts
type EnergyLevel =
    | "low"
    | "medium"
    | "high";
```

Never compare arbitrary strings throughout the application.

---

# Naming Standards

Variables

```
creatorProfile

dailyRecommendation

reviewSummary
```

Functions

```
generatePlan()

completeRecommendation()

sendWelcomeEmail()
```

Boolean variables

```
isComplete

hasSubscription

canPublish
```

Constants

```
MAX_PLAN_LENGTH

DEFAULT_TIMEZONE
```

---

# Function Standards

Functions should:

- perform one task
- return one result
- avoid hidden mutations

Recommended length:

< 40 lines

Extract helpers when complexity increases.

---

# Class Standards

Prefer functions over classes unless stateful behavior is required.

Classes are appropriate for:

- adapters
- SDK wrappers
- infrastructure

Business logic should primarily use functions.

---

# Error Handling

Expected failures return structured errors.

Unexpected failures throw exceptions.

Never swallow exceptions silently.

---

# Standard Error Structure

```ts
{
  code: "PLAN_NOT_FOUND",
  message: "No execution plan exists."
}
```

Messages should be understandable.

Codes should remain stable.

---

# Logging Standards

Every production log should answer:

- what happened?
- when?
- who?
- where?
- why?

Never log:

- passwords
- tokens
- secrets
- payment information

---

# Logging Levels

```
DEBUG

INFO

WARN

ERROR

FATAL
```

Use the lowest appropriate level.

---

# Comments

Good comments explain **why**.

Bad comments explain **what**.

Good

```ts
// Prevent duplicate webhook processing.
```

Bad

```ts
// Increment i.
i++;
```

---

# TODO Policy

TODOs require context.

Good

```ts
TODO(MAP-024):
Add burnout detection once adaptive engine ships.
```

Avoid

```ts
TODO
```

Untracked TODOs are prohibited.

---

# Formatting

The repository uses:

- Prettier
- ESLint

Formatting should never be debated during reviews.

Automation handles formatting.

---

# Linting

Every pull request must pass:

```
npm run lint
```

No warnings should be ignored without justification.

---

# Testing Requirements

Every feature should include appropriate tests.

Minimum expectations:

- unit tests
- integration tests (where applicable)
- end-to-end tests for user journeys

Critical business logic requires high coverage.

---

# Code Review Philosophy

Reviews improve software.

They do not judge people.

Review feedback should be:

- respectful
- specific
- actionable
- educational

---

# Pull Request Requirements

Every pull request must include:

- problem statement
- implementation summary
- screenshots (if UI changes)
- testing evidence
- linked PRD
- linked Implementation Package

No undocumented pull requests are accepted.

---

# Pull Request Checklist

Before requesting review:

- [ ] Builds successfully
- [ ] Tests pass
- [ ] Lint passes
- [ ] Documentation updated
- [ ] No debug code remains
- [ ] Acceptance Criteria satisfied
- [ ] Feature flag considered (if applicable)
- [ ] Reviewer assigned

---

# Definition of Production Ready

Code is production-ready when:

✓ Acceptance Criteria satisfied

✓ Tests passing

✓ Documentation complete

✓ Security reviewed

✓ Accessibility validated

✓ Performance acceptable

✓ Product approved

Until then:

Status = In Progress

---

# Refactoring Policy

Refactoring is encouraged when it:

- reduces duplication
- improves readability
- simplifies architecture

Refactoring should not change observable behavior unless explicitly planned.

---

# Technical Debt

Technical debt must be documented.

Every debt item should include:

- description
- reason
- impact
- proposed resolution
- priority

Undocumented debt becomes forgotten debt.

---

# Documentation Requirements

Engineering changes require documentation updates.

Affected documents may include:

- architecture
- PRD
- Implementation Package
- Decision Log
- API documentation

Documentation is part of the feature.

---

# AI-Assisted Development

MAP Builder is an engineering partner.

It must:

- follow repository standards
- obey approved architecture
- refuse unsupported assumptions
- cite governing documents when uncertain

AI may propose improvements.

AI may not redefine architecture independently.

---

# Human Review

All production code requires human review.

AI-generated code is treated identically to human-written code.

No exceptions.

---

# Security Standards

Every implementation must consider:

- authentication
- authorization
- validation
- rate limiting
- secret management
- least privilege

Security reviews occur before release.

---

# Performance Standards

Engineers should consider:

- bundle size
- database queries
- API latency
- rendering performance
- unnecessary re-renders

Performance is a product feature.

---

# Release Governance

A feature cannot be released until:

- Product approves
- Engineering approves
- Tests pass
- Documentation is current
- Deployment succeeds

Release readiness is a shared responsibility.

---

# Architecture Decision Records (ADR)

Significant engineering decisions require an ADR.

Examples include:

- introducing a new framework
- replacing Supabase
- adopting a new state management library
- changing deployment strategy

Architecture evolves intentionally.

---

# Continuous Improvement

Engineering standards are living documents.

Updates require:

1. Proposal
2. Discussion
3. Approval
4. Documentation
5. Adoption

No undocumented process changes.

---

# Engineering Commandments

Every engineer and AI agent working on MAP shall:

1. Protect user trust.
2. Never lose user data.
3. Keep the architecture simple.
4. Build around business capabilities.
5. Prefer clarity over cleverness.
6. Keep business logic out of UI.
7. Test critical workflows.
8. Document important decisions.
9. Leave the codebase better than it was found.
10. Build software that helps creators publish consistently.

---

# Relationship to Other Documents

This chapter complements:

- `coding_standards.md`
- `testing_standards.md`
- `definition_of_done.md`
- `engineering_patterns.md`
- `implementation_package.md`
- `system-architecture.md`

Together they define the engineering culture and implementation standards of MAP.

