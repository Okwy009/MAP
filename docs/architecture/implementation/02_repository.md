## Part 3A.2 — Repository & Folder Responsibilities

**Document:** `docs/architecture/system-architecture.md`

**Version:** 2.0

**Part:** 3A.2

**Status:** Approved

**Owner:** Engineering

---

# Purpose

This chapter defines the physical organization of the MAP codebase.

It answers one question:

> **"Where does every piece of code belong?"**

A predictable repository structure makes MAP easier to understand, extend, review, and maintain.

Repository organization is an architectural decision—not an implementation detail.

---

# Repository Philosophy

The repository is organized around **business capabilities**, not technologies.

Good examples:

```
Decision Engine

Creator Profile

Daily Focus

Payments
```

Poor examples:

```
Helpers

Misc

Utilities

Stuff
```

Every directory should communicate business intent.

---

# High-Level Repository Structure

```
MAP/

├── .claude/
├── .github/
├── .trae/
│
├── app/
├── components/
├── services/
├── repositories/
├── lib/
├── hooks/
├── providers/
├── types/
├── utils/
├── styles/
├── public/
├── tests/
├── docs/
├── prisma/
├── scripts/
│
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

# Repository Ownership

| Folder | Owner |
|----------|-------|
| app | Frontend |
| components | Frontend |
| services | Backend |
| repositories | Backend |
| docs | Product + Engineering |
| tests | QA |
| prisma | Backend |
| .claude | Product |
| .trae | Engineering |
| scripts | DevOps |

Ownership determines review responsibility.

---

# The app Directory

The `app/` directory contains all Next.js routes.

Example:

```
app/

layout.tsx

page.tsx

login/

dashboard/

settings/

daily/

review/

api/
```

The `app/` folder should contain:

- routes
- layouts
- loading states
- error boundaries
- server actions (when appropriate)

It must **not** contain business logic.

---

# Feature Route Structure

```
app/

daily/

page.tsx

loading.tsx

error.tsx

actions.ts

components/
```

Each feature owns its route-specific UI.

---

# The components Directory

Contains reusable UI components.

```
components/

ui/

layout/

cards/

forms/

navigation/

daily/

review/

shared/
```

---

## ui/

Contains generic design-system components.

Examples:

```
Button

Input

Card

Dialog

Badge

Avatar
```

These components contain **no business logic**.

---

## layout/

Contains layout components.

Examples:

```
Sidebar

Navbar

Footer

PageContainer
```

---

## forms/

Reusable form components.

Examples:

```
CreatorForm

GoalForm

ProfileForm
```

---

## shared/

Cross-feature components.

Examples:

```
LoadingSpinner

ErrorState

EmptyState

ConfirmDialog
```

---

# Services Directory

The services layer contains all business logic.

```
services/

decision/

creator/

daily/

tracking/

payment/

review/

email/

notion/
```

Each folder owns one business capability.

---

## Example

```
services/

decision/

generate-plan.ts

generate-daily.ts

recovery-mode.ts

validator.ts
```

---

# Repository Layer

Repositories abstract persistence.

```
repositories/

creator.repository.ts

plan.repository.ts

review.repository.ts

tracking.repository.ts
```

Repositories:

- fetch data
- save data
- update data

Repositories never contain business rules.

---

# Lib Directory

Shared infrastructure.

Examples

```
supabase.ts

resend.ts

notion.ts

gumroad.ts

logger.ts
```

Lib files configure external systems.

They do not coordinate workflows.

---

# Hooks Directory

Reusable React hooks.

```
hooks/

useSession.ts

useDailyFocus.ts

useCreator.ts

useTheme.ts
```

Hooks never contain business rules.

---

# Providers Directory

Application-wide providers.

```
providers/

ThemeProvider.tsx

SessionProvider.tsx

QueryProvider.tsx
```

---

# Types Directory

Shared TypeScript definitions.

```
types/

creator.ts

plan.ts

review.ts

daily.ts

api.ts
```

Interfaces should be organized by domain.

---

# Utils Directory

Pure utility functions.

```
utils/

date.ts

string.ts

time.ts

validation.ts
```

Utilities must:

- be deterministic
- have no side effects

---

# Styles Directory

Global styling.

```
styles/

globals.css

variables.css

animations.css
```

Component-specific styling belongs beside components.

---

# Public Directory

Static assets.

```
public/

images/

logos/

icons/

fonts/
```

Never place source code here.

---

# Tests Directory

```
tests/

unit/

integration/

e2e/

fixtures/
```

Tests mirror the application structure.

---

# Docs Directory

Institutional knowledge.

```
docs/

architecture/

engineering/

product/

research/

company/
```

Documentation must evolve with implementation.

---

# Scripts Directory

Developer automation.

Examples:

```
seed.ts

reset-db.ts

generate-types.ts
```

Scripts should be idempotent where possible.

---

# Feature Module Structure

Each major feature follows the same structure.

```
services/

decision/

index.ts

service.ts

types.ts

validator.ts

repository.ts

tests/
```

Consistency reduces cognitive load.

---

# Dependency Direction

Dependencies always flow inward.

```
UI

↓

Application

↓

Services

↓

Repositories

↓

Database
```

Lower layers never depend on higher layers.

---

# Allowed Dependencies

UI may depend on:

- hooks
- components
- types

Services may depend on:

- repositories
- types
- lib

Repositories may depend on:

- lib
- database client

---

# Forbidden Dependencies

UI → Database

❌

UI → SQL

❌

Component → External API

❌

Repository → React

❌

Utility → Supabase

❌

Business Service → JSX

❌

---

# Naming Conventions

Folders

```
daily-focus/

creator-profile/
```

Files

```
generate-plan.ts

review.service.ts

creator.repository.ts
```

Components

```
DailyCard.tsx

WelcomeBanner.tsx
```

Hooks

```
useCreator.ts

useDailyPlan.ts
```

Interfaces

```
Creator

Plan

DailyRecommendation
```

Enums

```
RecommendationType

EnergyLevel

Platform
```

---

# Import Rules

Prefer absolute imports.

Good

```ts
import { DecisionService } from "@/services/decision";
```

Avoid

```ts
../../../services/decision
```

---

# Shared Code Rules

If code is used:

- once → keep local
- twice → evaluate
- three times → extract

Do not prematurely generalize.

---

# Component Placement Rules

Reusable?

↓

Yes

↓

components/

Feature-specific?

↓

Keep inside feature.

Never move components simply to "tidy up."

---

# File Size Guidelines

Recommended maximums:

| File | Limit |
|------|-------|
| React Component | 250 lines |
| Service | 400 lines |
| Route Handler | 100 lines |
| Utility | 150 lines |
| Hook | 200 lines |

Large files should be decomposed.

---

# Module Boundaries

Every feature owns:

- UI
- service
- repository
- types
- tests

Features should communicate through public interfaces.

Never import internal implementation files across domains.

---

# Circular Dependency Policy

Circular imports are prohibited.

If detected:

- extract shared abstraction
- introduce interface
- redesign ownership

Never ignore circular dependency warnings.

---

# Documentation Requirements

Every feature module should contain:

```
README.md
```

Documenting:

- purpose
- responsibilities
- public API
- dependencies
- examples

---

# Repository Fitness Checklist

Every pull request should preserve:

✓ Predictable folder structure

✓ Clear ownership

✓ No duplicate business logic

✓ No circular dependencies

✓ Absolute imports

✓ Feature isolation

✓ Documentation updates

---

# Future Repository Evolution

As MAP grows, additional directories may be introduced:

```
packages/

mobile/

workers/

analytics/

ai/

sdk/
```

New top-level folders require an approved ADR.

---

# Relationship to Other Documents

This chapter complements:

- `coding_standards.md`
- `engineering_patterns.md`
- `system-architecture.md`
- `implementation_package.md`

It defines **where code belongs**, while other documents define **how code is written**.

---
