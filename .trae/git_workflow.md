# MAP Builder — Git Workflow

Version: 1.0.0

Status: Required

Owner: MAP OS Core

---

# Purpose

This document defines the Git workflow used by MAP Builder.

A consistent Git workflow makes development predictable, simplifies code reviews, and provides a reliable history of how MAP evolves.

Git is not just version control.

It is part of MAP's institutional memory.

---

# Philosophy

Every commit should represent a meaningful unit of work.

Every branch should have a clear purpose.

Every merge should improve the product.

Git history should explain **how** MAP was built.

---

# Branch Strategy

MAP Builder uses a simple branch model.

```
main
│
├── feature/*
├── fix/*
├── refactor/*
├── chore/*
├── docs/*
└── hotfix/*
```

---

# Main Branch

The `main` branch always represents production-ready code.

Rules:

- Never commit directly to `main`
- Every change is reviewed before merging
- `main` should always be deployable

---

# Branch Naming

Use descriptive names.

Examples:

```
feature/goal-creation

feature/daily-action-generator

fix/goal-validation

refactor/onboarding-service

docs/update-engineering-patterns

hotfix/login-timeout
```

Avoid:

```
feature/test

feature/new

feature/update

fix/stuff
```

---

# Commit Philosophy

A commit should represent one logical change.

Avoid mixing unrelated work.

Good:

```
Add goal creation form validation

Extract onboarding service

Fix mobile layout overflow

Update testing standards
```

Avoid:

```
Changes

Update

Fix stuff

Misc

Final
```

---

# Commit Format

Preferred format:

```
<type>: <description>
```

Examples:

```
feat: add goal creation form

fix: prevent duplicate submissions

refactor: simplify onboarding service

test: add validation tests

docs: update coding standards

chore: upgrade dependencies
```

---

# Pull Requests

Every Pull Request should answer:

What problem is being solved?

Why is this change necessary?

What was implemented?

How was it tested?

Are there known limitations?

Link to the Implementation Package whenever possible.

---

# Merge Requirements

A branch may only be merged when:

✓ Implementation complete

✓ Definition of Done satisfied

✓ Tests passing

✓ Self-review complete

✓ Handoff completed

✓ MAP OS Core review approved

No exceptions.

---

# Hotfix Workflow

Hotfixes bypass normal prioritization but not quality.

Workflow:

Issue Identified

↓

Hotfix Branch

↓

Implement

↓

Test

↓

Self Review

↓

Review

↓

Merge

↓

Postmortem

↓

Decision Log Update

Every hotfix requires a documented lesson learned.

---

# Conflict Resolution

When merge conflicts occur:

Understand the conflict before resolving it.

Never overwrite changes without understanding why they exist.

If product intent is unclear:

Stop and consult MAP OS Core.

---

# Versioning

MAP follows Semantic Versioning.

```
MAJOR.MINOR.PATCH
```

Examples:

```
1.0.0

1.1.0

1.1.3

2.0.0
```

Meaning:

Major

Breaking architectural or product changes.

Minor

New backward-compatible functionality.

Patch

Bug fixes, documentation updates, and small improvements.

---

# Release Tags

Every production release should be tagged.

Examples:

```
v1.0.0

v1.1.0

v1.2.3
```

Tags create permanent release milestones.

---

# Commit Discipline

Before committing, verify:

- Scope respected
- Tests passing
- No debugging code
- No commented-out code
- No temporary files
- No secrets or credentials
- Documentation updated if necessary

A commit should leave the repository in a healthier state.

---

# What Never Belongs in Git

Never commit:

- API keys
- Passwords
- Tokens
- Environment secrets
- Personal credentials
- Temporary debugging files
- Generated build artifacts (unless intentionally versioned)

Protect the repository as a production asset.

---

# Engineering Responsibility

Git history should make it possible to answer:

Why was this change made?

When was it introduced?

Who introduced it?

What problem did it solve?

A clean history reduces future engineering effort.

---

# Guiding Philosophy

Git is the story of how MAP was built.

Every branch represents an idea.

Every commit represents progress.

Every merge represents an improvement.

Leave a history that future engineers will trust.