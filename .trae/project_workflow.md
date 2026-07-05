# MAP Builder — Project Structure

Version: 1.0.0

Status: Active

Owner: MAP OS Core

---

# Purpose

This document defines the canonical structure of the MAP codebase.

Every engineer and AI agent should organize code according to this document.

Consistency is more valuable than personal preference.

The repository should feel predictable.

A new engineer should be able to find any piece of functionality without guessing.

---

# Guiding Principles

## Feature Before File

Organize around features rather than technologies whenever practical.

Users experience features.

Developers should build around them.

---

## One Home

Every file should have one obvious location.

If multiple locations seem correct, improve the structure.

Do not duplicate responsibility.

---

## Separation of Concerns

Separate:

- User Interface
- Business Logic
- Data Access
- Infrastructure
- Configuration

Each layer should have one responsibility.

---

## Keep the Root Clean

The repository root should remain minimal.

Only top-level project configuration belongs here.

Avoid dumping miscellaneous files into the root directory.

---

# Recommended Repository Structure

```
map/

├── app/
│
├── components/
│
├── features/
│
├── lib/
│
├── services/
│
├── hooks/
│
├── types/
│
├── utils/
│
├── styles/
│
├── public/
│
├── tests/
│
├── docs/
│
├── scripts/
│
├── prisma/ (or database/)
│
├── .github/
│
└── package.json
```

---

# Directory Responsibilities

## app/

Application routes.

Pages.

Layouts.

Server Components.

Route handlers.

Contains application entry points.

Business logic should remain minimal.

---

## components/

Reusable UI components.

Examples

```
Button

Card

Modal

Input

LoadingSpinner

Navbar
```

These components should be presentation-focused.

Avoid feature-specific business logic.

---

## features/

Feature-specific modules.

Example

```
goal/

daily-action/

onboarding/

accountability/
```

Each feature may contain:

```
components/

hooks/

services/

validation/

types/

tests/
```

Everything required for that feature lives together.

---

## lib/

Shared infrastructure.

Examples

```
database

authentication

api client

logger

analytics

configuration
```

Infrastructure supports features.

It does not contain product logic.

---

## services/

Business logic shared across multiple features.

Examples

```
GoalService

ActionGenerator

ReminderService

ProgressCalculator
```

Services implement application behavior.

---

## hooks/

Reusable custom hooks.

Examples

```
useGoal()

useUser()

useSession()

useCountdown()
```

Hooks should remain focused.

Avoid embedding large business workflows.

---

## types/

Shared TypeScript types.

Examples

```
Goal

User

DailyAction

Session
```

Avoid duplicate type definitions.

---

## utils/

Pure helper functions.

Examples

```
date formatting

string formatting

validation helpers

calculations
```

Utilities should not contain business decisions.

---

## styles/

Global styling.

Theme configuration.

Design tokens.

Shared CSS.

---

## public/

Static assets.

Examples

```
images

icons

logos

fonts
```

---

## tests/

Integration tests.

End-to-end tests.

Shared testing utilities.

Feature-specific unit tests should remain close to the feature whenever practical.

---

## docs/

Project documentation.

Architecture.

Decisions.

Migration notes.

Technical references.

---

## scripts/

Automation scripts.

Examples

```
database seed

migration helpers

release automation

maintenance scripts
```

---

# Feature Module Structure

Example

```
features/

goal/

├── components/
├── hooks/
├── services/
├── validation/
├── types/
├── tests/
└── index.ts
```

A feature should contain everything required for that feature.

Avoid scattering related code throughout the repository.

---

# Component Organization

Large components may use:

```
GoalCard/

GoalCard.tsx

GoalCard.test.tsx

GoalCard.types.ts

GoalCard.styles.ts
```

Small components may exist as a single file.

Choose the simplest structure appropriate for the component.

---

# Import Rules

Prefer:

```
Feature

↓

Shared Services

↓

Infrastructure

↓

Utilities
```

Avoid circular dependencies.

A lower layer should never depend on a higher layer.

---

# Configuration

Configuration belongs in dedicated configuration files.

Avoid scattered configuration values.

Use environment variables where appropriate.

Never hardcode secrets.

---

# Documentation

Every significant architectural change should update:

- Architecture documentation
- Engineering patterns
- Decision log (if applicable)

Documentation is part of the implementation.

---

# Repository Health

A healthy repository is:

Predictable.

Consistent.

Easy to navigate.

Easy to refactor.

Easy to extend.

Engineers should spend time solving problems—not searching for files.

---

# Growth Policy

As MAP grows:

Prefer extending existing patterns before creating new ones.

Only introduce a new directory when the current structure becomes genuinely insufficient.

Avoid premature organization.

---

# Review Checklist

Before creating a new file, ask:

- Does a similar file already exist?
- Does this belong in an existing feature?
- Is there one obvious location?
- Am I introducing duplication?
- Will another engineer immediately understand where this belongs?

If the answer is no, reconsider the structure.

---

# Guiding Philosophy

A project structure should reduce thinking, not increase it.

The best repository is one where engineers instinctively know where to place new code and where to find existing code.

Consistency compounds.

A predictable structure is an engineering advantage.

That is the MAP Builder standard.