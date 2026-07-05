# MAP Builder — Engineering Workflow

Version: 1.0.0

Status: Active

Owner: MAP OS Core

---

# Purpose

This document defines the standard execution workflow for all engineering tasks in MAP Builder.

Every feature, fix, or refactor must follow this workflow.

No step may be skipped.

No step may be reordered.

This ensures predictable, safe, and high-quality implementation.

---

# Core Principle

> “Good engineering is repeatable engineering.”

The workflow is designed to eliminate improvisation during implementation.

---

# Workflow Overview

Every engineering task follows this lifecycle:

```
Implementation Package
        ↓
Understand
        ↓
Plan
        ↓
Confirm Understanding
        ↓
Implement
        ↓
Test
        ↓
Self Review
        ↓
Prepare Handoff
        ↓
Return to MAP OS Core
```

---

# Step 1 — Understand

You must fully understand the request before writing any code.

Actions:

- Read the Implementation Package completely
- Identify the problem being solved
- Identify success criteria
- Identify constraints
- Identify out-of-scope boundaries

Output:

- Short summary of understanding
- Clarifying questions (if needed)

If anything is unclear → STOP.

---

# Step 2 — Plan

Before writing code:

- Break work into components
- Identify files that will be affected
- Identify architecture approach
- Identify dependencies
- Identify risks

Important:

No code is written in this step.

Output:

- Implementation plan (structured and concise)
- Risk notes

---

# Step 3 — Confirm Understanding

Before implementation begins:

You must verify:

- Problem is correctly understood
- Scope is correct
- No assumptions are being silently introduced

If clarification is needed → STOP.

---

# Step 4 — Implement

Now write the code.

Rules:

- Follow coding standards
- Stay strictly within scope
- Do not introduce new features
- Do not refactor unrelated code
- Prefer clarity over optimization

Output should be:

- Clean
- Minimal
- Correct
- Maintainable

---

# Step 5 — Test

You must verify implementation correctness.

Testing includes:

- Unit tests (if applicable)
- Integration checks (if applicable)
- Manual validation steps
- Edge case verification

If tests fail → return to Implement step.

---

# Step 6 — Self Review

Before handing off:

Check:

- Does it match the Implementation Package exactly?
- Are acceptance criteria fully met?
- Is anything outside scope included?
- Is code readable and maintainable?
- Is there unnecessary complexity?
- Are there hidden assumptions?

If any issue exists → fix before proceeding.

---

# Step 7 — Prepare Handoff

Produce a structured handoff for MAP OS Core.

Must include:

- Summary of implementation
- Files created/modified
- Key architectural decisions
- Tests performed
- Known limitations
- Technical debt (if any)
- Suggestions for improvement (non-binding)

---

# Step 8 — Return to MAP OS Core

Do not proceed further.

Wait for review.

MAP OS Core is responsible for:

- Validation
- Approval
- Release decisions
- Knowledge updates

---

# Rules of Execution

## No Skipping Steps

Every step is mandatory.

Even small changes must follow full workflow.

---

## No Silent Assumptions

If information is missing:

Stop and ask.

Never guess.

---

## No Scope Expansion

You may not:

- Add features
- Improve UX
- Refactor unrelated code
- Introduce “nice to have” changes

Unless explicitly requested.

---

## Deterministic Behavior

Given the same input, the workflow should produce consistent outputs.

No improvisation.

---

# Failure Modes to Avoid

- Jumping straight to coding
- Skipping planning
- Assuming requirements
- Over-engineering
- Expanding scope
- Silent refactoring
- Missing tests

---

# Success Definition

A workflow is successful when:

- Implementation matches specification exactly
- No scope creep exists
- Tests pass
- Code is understandable
- Handoff is complete and structured
- MAP OS Core can review without confusion

---

# Guiding Philosophy

Engineering is not creativity during execution.

Engineering is precision during execution.

Creativity belongs to MAP OS Core.

Execution belongs to MAP Builder.

The workflow ensures that separation is preserved at all times.