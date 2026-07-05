# MAP Builder — Engineering Patterns

Version: 1.0.0

Status: Living Document

Owner: MAP OS Core

---

# Purpose

This document records the approved engineering patterns used throughout MAP.

Unlike coding standards, these patterns are not theoretical.

Every pattern in this document must already exist in the production codebase or be approved during architecture review.

This document grows as MAP grows.

It should never become a collection of speculative ideas.

---

# Philosophy

Patterns exist to reduce decision fatigue.

Once MAP solves a problem well, future engineers should solve the same problem the same way.

Consistency is more valuable than novelty.

When engineers encounter a familiar problem, they should reuse an existing pattern before creating a new one.

---

# Pattern Lifecycle

Every engineering pattern follows the same lifecycle.

```
Problem Identified
        ↓
Solution Implemented
        ↓
Validated in Production
        ↓
Reviewed
        ↓
Added to Engineering Patterns
        ↓
Becomes Preferred Pattern
```

Patterns are earned through experience.

They are never invented prematurely.

---

# Pattern Template

Every approved pattern should use the following format.

---

## Pattern Name

Short descriptive name.

---

### Problem

What recurring engineering problem does this solve?

---

### Context

When should this pattern be used?

When should it not be used?

---

### Solution

Describe the approved implementation.

Focus on principles rather than framework-specific details.

---

### Benefits

Why was this pattern adopted?

Examples:

- Simpler
- More maintainable
- Easier to test
- Better performance
- More readable

---

### Trade-offs

Every pattern has costs.

Document them honestly.

---

### Related Patterns

Reference other approved patterns.

---

# Pattern Selection Rules

Before introducing a new pattern, ask:

Has this problem already been solved?

Can an existing pattern be reused?

Does the proposed pattern reduce complexity?

Will future engineers immediately understand it?

Would adopting this pattern make the codebase more consistent?

If the answer is no, do not create a new pattern.

---

# Anti-Patterns

The following practices are discouraged.

## Premature Abstraction

Avoid creating generic systems before real repetition exists.

Rule:

Three real use cases before abstraction.

---

## Hidden Business Logic

Business decisions should not be embedded inside UI components.

Keep presentation separate from application logic.

---

## God Components

Avoid components that:

- Fetch data
- Validate forms
- Manage state
- Render UI
- Handle navigation

Split responsibilities.

---

## Utility Creep

Utility functions should remain generic.

Business logic belongs in services or feature modules.

---

## Silent Error Handling

Errors should never disappear.

Handle them explicitly.

Log them appropriately.

Return meaningful feedback.

---

## Circular Dependencies

Features should not depend on one another in circular ways.

Dependencies should always flow in one direction.

---

## Framework Lock-In

Prefer application architecture over framework-specific features whenever practical.

The business logic of MAP should survive a framework migration.

---

# Current Approved Patterns

At the start of the project, there are intentionally very few approved patterns.

This is expected.

Patterns will be added only after they have demonstrated value.

Current catalog:

- Feature-based organization
- Composition over inheritance
- Explicit error handling
- One responsibility per function
- Thin UI, rich services
- Accessibility by default

This list will expand over time.

---

# Candidate Patterns

Ideas may be recorded here before approval.

Examples:

- Server Action pattern
- Validation pipeline
- Repository pattern
- Optimistic update pattern
- Offline synchronization
- AI action generation pipeline

Candidate patterns are not standards.

They require implementation, validation, and review before becoming approved.

---

# Pattern Governance

New patterns require:

1. Real implementation.
2. Successful use.
3. Engineering review.
4. Documentation.
5. MAP OS Core approval.

Only then may they become preferred patterns.

---

# Documentation Responsibilities

Whenever a new recurring solution emerges, engineers should recommend updating this document.

The goal is to preserve institutional knowledge.

Patterns should represent MAP's accumulated engineering experience.

---

# Relationship to Other Documents

This document complements, but does not replace:

- Coding Standards
- Testing Standards
- Project Structure
- Architecture Principles
- Engineering Principles

Those documents define rules.

This document records proven solutions.

---

# Guiding Philosophy

The best engineering organizations are not distinguished by clever code.

They are distinguished by consistent decisions.

Every approved pattern should make future engineering faster, simpler, and more reliable.

If a pattern does not reduce future decision-making, it does not belong here.

MAP Builder should learn from every implementation.

This document is where those lessons become institutional knowledge.