# Part 3A.4 — Component Architecture & Dependency Rules

**Document:** `docs/architecture/system-architecture.md`

**Version:** 2.0

**Part:** 3A.4

**Status:** Approved

**Owner:** Engineering

---

# Purpose

This chapter defines how user interfaces are built inside MAP.

It answers one question:

> **How do we build UI that remains consistent, reusable, accessible, and maintainable as MAP grows?**

Every screen, component, and interaction must follow these standards.

---

# UI Philosophy

MAP is **not** a dashboard product.

It is a decision-support system.

The interface should always reduce cognitive load rather than increase it.

Every screen should answer one primary question.

Examples:

- **Landing Page:** What is MAP?
- **Onboarding:** Tell us about yourself.
- **Daily Focus:** What should I do today?
- **Review:** What did I accomplish this week?

Never attempt to answer multiple questions on the same screen.

---

# Component Hierarchy

```
Application

↓

Layouts

↓

Pages

↓

Feature Components

↓

Shared Components

↓

Design System Components

↓

HTML Elements
```

Higher layers compose lower layers.

Lower layers never depend on higher layers.

---

# Design System

MAP uses **shadcn/ui** as its design system foundation.

Custom components should extend—not replace—the design system.

The design system provides:

- Buttons
- Inputs
- Cards
- Dialogs
- Sheets
- Badges
- Tabs
- Tooltips
- Toasts
- Dropdowns

Custom styling should remain minimal.

---

# Component Categories

Every component belongs to exactly one category.

## 1. Design System Components

Examples

```
Button

Input

Badge

Card

Dialog

Tooltip
```

Reusable across every feature.

No business logic.

---

## 2. Shared Components

Reusable application components.

Examples

```
LoadingState

EmptyState

ErrorState

PageHeader

PageTitle

SectionDivider
```

---

## 3. Layout Components

Responsible for application structure.

Examples

```
Sidebar

Navigation

TopBar

Footer

Shell

Container
```

Layouts never contain business logic.

---

## 4. Feature Components

Specific to one business capability.

Examples

```
Today's Recommendation Card

Weekly Review Summary

Recovery Mode Banner

Progress Timeline
```

These remain inside their feature folder.

---

## 5. Page Components

Represent complete pages.

Examples

```
Dashboard

Review

Settings

Onboarding
```

Pages compose feature components.

Pages should contain very little logic.

---

# Smart vs Presentational Components

MAP separates behavior from presentation.

## Smart Components

Responsible for:

- fetching data
- calling services
- coordinating child components

Example

```
DailyFocusContainer
```

---

## Presentational Components

Responsible only for rendering.

Inputs:

- props

Outputs:

- UI

Example

```
DailyRecommendationCard
```

Presentational components never call APIs.

---

# Component Composition

Prefer composition over inheritance.

Good

```
<Card>

<CardHeader>

<CardContent>

<CardFooter>

</Card>
```

Avoid deeply nested inheritance trees.

---

# Single Responsibility Principle

Every component should have one reason to change.

Good

```
RecommendationCard
```

Bad

```
DashboardWithRecommendationAndAnalyticsAndReview
```

---

# Props Design

Props should be:

- explicit
- typed
- minimal

Good

```ts
interface RecommendationCardProps {

recommendation: Recommendation

onComplete: () => void

}
```

Avoid large generic objects.

---

# Component Naming

Component names describe intent.

Examples

```
DailyRecommendationCard

WeeklySummary

CreatorAvatar

NavigationSidebar
```

Avoid names like:

```
Thing

Container2

Widget

ComponentA
```

---

# Folder Structure

```
components/

daily/

RecommendationCard/

RecommendationCard.tsx

RecommendationCard.test.tsx

RecommendationCard.stories.tsx

README.md
```

Each reusable component owns its implementation.

---

# Styling Standards

MAP uses:

- Tailwind CSS
- Design Tokens
- CSS Variables

Avoid:

- inline styles
- duplicated utility classes
- arbitrary spacing

---

# Design Tokens

Centralize visual values.

Examples

```
Primary

Secondary

Accent

Danger

Success

Warning

Radius

Spacing

Typography
```

Never hardcode colors repeatedly.

---

# Typography

MAP typography prioritizes readability.

Hierarchy

```
Heading

Subheading

Section

Body

Caption
```

Typography should reinforce clarity.

---

# Icons

Use one icon system consistently.

Preferred:

```
Lucide React
```

Avoid mixing multiple icon libraries.

---

# Forms

All forms should use:

- React Hook Form
- Zod validation

Validation occurs:

- client-side
- server-side

Never rely solely on browser validation.

---

# Loading States

Every async action requires feedback.

Examples

```
Skeleton

Spinner

Progress Indicator
```

Never leave users guessing.

---

# Empty States

Every empty page must explain:

- why it's empty
- what happens next
- what action to take

Example

"No recommendations yet.

Complete onboarding to generate your first 30-day plan."

---

# Error States

Every recoverable error should provide:

- explanation
- recovery action
- retry option

Avoid exposing technical messages.

---

# Accessibility Standards

Every component must support:

✓ keyboard navigation

✓ visible focus

✓ semantic HTML

✓ ARIA labels where appropriate

✓ sufficient color contrast

✓ screen readers

Accessibility is not optional.

---

# Responsive Design

MAP is mobile-first.

Breakpoints

```
Mobile

Tablet

Desktop

Wide
```

Components should gracefully adapt.

---

# Performance Rules

Avoid:

- unnecessary re-renders
- expensive calculations
- oversized bundles

Prefer:

- memoization
- lazy loading
- server rendering
- code splitting

---

# Animation Philosophy

Animations communicate state.

Never decorate unnecessarily.

Good examples

- modal opening
- toast notification
- loading transition

Bad examples

- excessive motion
- distracting effects

---

# Dependency Rules

Dependencies always flow downward.

```
Page

↓

Feature

↓

Shared

↓

UI
```

Never reverse this flow.

---

# Allowed Imports

Feature Components may import:

- shared components
- ui components
- hooks
- types

Shared Components may import:

- ui
- utilities

UI Components import nothing business-specific.

---

# Forbidden Imports

UI → Services

❌

UI → Database

❌

Shared → Feature

❌

Feature A → Feature B internal files

❌

Component → Repository

❌

Business logic belongs elsewhere.

---

# Component Testing

Every reusable component should include:

- rendering tests
- interaction tests
- accessibility checks

Critical components also require visual regression testing.

---

# Storybook (Future)

Reusable UI components should eventually be documented using Storybook.

Benefits:

- isolated development
- visual documentation
- design review
- regression detection

---

# Reusability Guidelines

Extract a component when:

- used three or more times
- represents one business concept
- simplifies maintenance

Do not abstract prematurely.

---

# Definition of a Good Component

A good component is:

- understandable in isolation
- independently testable
- visually consistent
- reusable
- accessible
- documented

---

# Architecture Fitness Checklist

Every new component should answer:

- Does it have one responsibility?
- Is business logic separated?
- Is it accessible?
- Is it responsive?
- Is it typed?
- Is styling consistent?
- Is it reusable?
- Is it tested?
- Is it documented?

If any answer is "No," the component is not production-ready.

---

# Relationship to Other Documents

This chapter complements:

- `coding_standards.md`
- `engineering_patterns.md`
- `testing_standards.md`
- `system-architecture.md`

It defines **how every user interface in MAP is designed, composed, and maintained**.

---
