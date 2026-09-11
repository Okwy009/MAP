# Engineering Architecture v2.0

# Part 3C.2 — Repository Architecture

**Document:** `docs/architecture/repository-architecture.md`

**Version:** 2.0

**Status:** Approved

**Owner:** Engineering

---

# Purpose

This document defines how the MAP codebase is organized.

It answers one question:

> **"Where does every piece of code belong?"**

A predictable repository enables predictable engineering.

Every engineer and AI coding agent should be able to locate, understand, and extend the codebase without guesswork.

---

# Repository Philosophy

MAP follows a **feature-first architecture**.

The repository is organized around business capabilities rather than technical layers.

This means features own their:

- UI
- business logic
- validation
- services
- tests
- documentation

This minimizes coupling and improves maintainability.

---

# Repository Goals

The repository should be:

- Easy to navigate
- Easy to extend
- Easy to refactor
- Easy to test
- Easy for AI agents to understand

The repository should remain understandable as MAP grows from MVP to production scale.

---

# High-Level Structure

```text
MAP/

├── app/
├── components/
├── features/
├── services/
├── lib/
├── hooks/
├── types/
├── styles/
├── public/
├── docs/
├── tests/
├── scripts/
├── supabase/
└── package.json
```

Every top-level directory has a clearly defined responsibility.

---

# app/

Purpose:

Defines application routes using the Next.js App Router.

Contains:

- layouts
- pages
- route handlers
- loading states
- error boundaries

Example:

```text
app/

    login/

    dashboard/

    onboarding/

    today/

    settings/
```

Rules:

- No business logic
- No database queries
- No AI logic

Routes orchestrate—they do not implement.

---

# components/

Purpose:

Shared UI components used across multiple features.

Examples:

```text
Button

Card

Modal

Dialog

Badge

Avatar

ProgressBar

Input

Textarea
```

Rules:

- Presentation only
- No business rules
- Reusable across features

---

# features/

Purpose:

Contains feature-specific business functionality.

Every major capability owns its own folder.

Example:

```text
features/

    authentication/

    onboarding/

    creator-profile/

    decision-engine/

    recommendations/

    execution/

    engagement/

    reviews/

    analytics/
```

Each feature may contain:

```text
components/

hooks/

services/

validators/

types/

tests/

README.md
```

Business logic stays inside the feature.

---

# services/

Purpose:

Interfaces with external providers.

Examples:

```text
services/

    ai/

    email/

    payments/

    notion/

    storage/
```

Responsibilities:

- API communication
- retries
- authentication
- provider abstraction

Never expose vendor-specific SDKs to the rest of the application.

---

# lib/

Purpose:

Shared internal utilities.

Examples:

```text
helpers/

constants/

date/

validation/

formatting/

errors/
```

Rules:

Must remain framework-independent whenever possible.

---

# hooks/

Purpose:

Reusable React hooks.

Examples:

```text
useCreator()

useRecommendation()

useSession()

useStreak()
```

Hooks should encapsulate reusable client-side behavior.

---

# types/

Purpose:

Shared TypeScript definitions.

Examples:

```text
Creator

Recommendation

ContentPlan

Subscription

ExecutionRecord
```

Never duplicate shared interfaces.

---

# styles/

Purpose:

Global styling resources.

Contains:

- Tailwind configuration
- design tokens
- typography
- animations

Avoid component-specific styles here.

---

# public/

Purpose:

Static assets.

Examples:

```text
images/

icons/

logos/

fonts/
```

Never store source design files.

---

# docs/

Purpose:

The engineering and product knowledge base.

Structure:

```text
docs/

    architecture/

    product/

    engineering/

    adr/

    decisions/

    api/
```

Documentation evolves alongside the codebase.

---

# tests/

Purpose:

Project-wide testing resources.

Examples:

```text
unit/

integration/

e2e/

fixtures/

mocks/
```

Feature-specific tests should remain inside their feature directory where practical.

---

# scripts/

Purpose:

Automation utilities.

Examples:

- database seeding
- migrations
- maintenance
- data imports
- code generation

Scripts should be idempotent whenever possible.

---

# supabase/

Purpose:

Backend infrastructure.

Contains:

```text
migrations/

functions/

seed/

config/
```

This directory mirrors the production backend.

---

# Feature Organization

Every feature follows the same structure.

Example:

```text
features/

    decision-engine/

        components/

        services/

        validators/

        hooks/

        tests/

        types/

        README.md
```

Consistency reduces onboarding time.

---

# Shared vs Feature Code

Shared code belongs in:

- components/
- lib/
- hooks/
- types/

Feature-specific code belongs inside its feature.

Rule:

If only one feature uses it,

keep it inside that feature.

---

# Dependency Direction

Allowed:

```text
app
↓

features
↓

services
↓

lib
```

Not allowed:

```text
lib

↓

features
```

Lower-level modules should never depend on higher-level modules.

---

# Import Rules

Prefer aliases.

Example:

```typescript
import { Button } from "@/components/button";
```

Avoid long relative imports.

Example:

```text
../../../../components/Button
```

Aliases improve readability.

---

# Naming Conventions

Folders:

```text
kebab-case
```

Files:

```text
kebab-case.ts

creator-profile.ts

decision-engine.ts
```

Components:

```text
PascalCase

RecommendationCard.tsx
```

Hooks:

```text
useCreator.ts

useRecommendation.ts
```

Types:

```text
creator.ts

recommendation.ts
```

---

# Documentation Requirements

Each feature should include:

```text
README.md
```

Containing:

- Purpose
- Responsibilities
- Dependencies
- Public Interfaces
- Known Limitations

Documentation lives beside the code.

---

# Asset Management

Images:

```text
public/images/
```

Icons:

```text
public/icons/
```

Logos:

```text
public/logos/
```

Avoid scattering assets across the repository.

---

# Configuration Files

Root configuration includes:

```text
package.json

tsconfig.json

next.config.ts

tailwind.config.ts

eslint.config.js

.prettierrc

.env.example
```

Configuration should remain centralized.

---

# Environment Variables

Secrets belong only in:

```text
.env.local
```

Never commit:

- API keys
- service tokens
- database passwords
- private credentials

Provide an `.env.example` file for onboarding.

---

# Repository Ownership

Each major area has a clear owner.

| Area | Owner |
|------|-------|
| Product Docs | Product |
| Architecture | Engineering |
| Features | Engineering |
| Infrastructure | DevOps |
| Database | Backend |
| AI Services | AI Engineering |
| UI Components | Frontend |

Ownership improves accountability.

---

# Future Scalability

The repository should support:

- additional AI providers
- multiple payment providers
- multiple authentication providers
- mobile applications
- public API
- enterprise features

Without major reorganization.

---

# Repository Health Checklist

A healthy repository should have:

- Consistent naming
- Clear ownership
- No duplicated business logic
- Predictable structure
- Updated documentation
- Strong typing
- Passing tests

If contributors cannot quickly understand the repository, it needs improvement.

---

# Guiding Statement

A repository is more than a collection of files.

It is the shared mental model of the engineering team.

The structure should communicate intent, encourage consistency, and make the correct implementation path the easiest one to follow.

---

# Relationship to Other Documents

This document complements:

- `engineering-principles.md`
- `development-workflow.md`
- `coding-standards.md`
- `testing-strategy.md`
- `documentation-standards.md`
- `ai-assisted-development.md`

Together they define how MAP is organized, developed, and maintained.

---