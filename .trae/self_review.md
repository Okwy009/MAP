# MAP Builder — Self Review

Version: 1.0.0

Status: Required

Owner: MAP OS Core

---

# Purpose

This document defines the mandatory self-review process that every engineering task must complete before it is handed back to MAP OS Core.

Self-review is the engineer's final quality gate.

Its purpose is to identify mistakes, reduce rework, and improve engineering quality before formal review begins.

No implementation is considered ready until self-review has been completed.

---

# Philosophy

The first reviewer should always be the engineer who wrote the code.

Good engineers assume they have missed something.

Self-review exists to find it.

The goal is not perfection.

The goal is confidence.

---

# Self Review Workflow

Every implementation follows this sequence:

Implement

↓

Run Tests

↓

Review Against PRD

↓

Review Against Definition of Done

↓

Review Code Quality

↓

Review User Experience

↓

Review Risks

↓

Prepare Handoff

↓

Return to MAP OS Core

No step should be skipped.

---

# Step 1 — Review the Implementation Package

Before reviewing code, reread the Implementation Package.

Verify:

- Problem Statement
- Scope
- Out of Scope
- Acceptance Criteria
- Technical Constraints
- Definition of Done

Question:

"Did I build what was requested?"

Not:

"Did I build something better?"

---

# Step 2 — Scope Review

Ask:

Did I implement anything outside the approved scope?

Did I silently improve unrelated code?

Did I add extra functionality?

Did I introduce new dependencies?

Did I change product behavior?

If the answer is yes:

Remove it or escalate.

Engineering does not expand scope.

---

# Step 3 — Acceptance Criteria Review

Review every acceptance criterion individually.

Example:

Acceptance Criterion

User can create a goal.

Status

PASS

Acceptance Criterion

Validation errors display correctly.

Status

PASS

Never assume.

Verify.

---

# Step 4 — Code Quality Review

Review the implementation against Coding Standards.

Check:

✓ Naming is clear.

✓ Functions have one responsibility.

✓ Components are appropriately sized.

✓ No duplicated logic.

✓ No unnecessary abstraction.

✓ Readability maintained.

✓ Comments explain why, not what.

If something can be simplified, simplify it.

---

# Step 5 — Architecture Review

Confirm:

Existing architecture respected.

Patterns remain consistent.

No unnecessary coupling.

Dependencies minimized.

Folder structure maintained.

No architectural shortcuts introduced.

---

# Step 6 — Testing Review

Verify:

Unit tests pass.

Integration tests pass (if applicable).

Manual validation completed.

Regression checks completed.

Edge cases reviewed.

Accessibility verified.

Performance checked.

Testing evidence should support confidence.

---

# Step 7 — User Experience Review

Even though Engineering does not own UX, verify that implementation matches the approved design.

Check:

Expected interactions.

Loading states.

Error states.

Empty states.

Responsiveness.

Accessibility.

If implementation differs from the approved UX:

Escalate.

Do not redesign.

---

# Step 8 — Risk Review

Ask:

Did I introduce technical debt?

Did I create future maintenance problems?

Could another engineer understand this?

Would I confidently maintain this six months from now?

If the answer is no:

Improve the implementation.

---

# Step 9 — Documentation Review

Determine whether documentation updates are required.

Examples:

Architecture decision

New engineering pattern

Technical debt

Implementation note

Decision recommendation

Knowledge should grow alongside software.

---

# Step 10 — Prepare Engineering Handoff

Every completed task should include:

## Summary

What was implemented?

---

## Files Changed

List all modified files.

---

## Key Engineering Decisions

Document implementation decisions that future engineers should understand.

---

## Testing Summary

Unit Tests

Integration Tests

Manual Validation

Accessibility

Performance

---

## Known Limitations

List anything intentionally deferred.

---

## Technical Debt

Document any debt introduced.

Include:

Reason

Impact

Suggested follow-up

---

## Ready for Review

YES / NO

Only answer YES if every self-review step has passed.

---

# Self Review Checklist

Before requesting review, confirm:

- I solved the correct problem.
- I stayed within scope.
- Every acceptance criterion passed.
- Code follows coding standards.
- Architecture remains consistent.
- Tests pass.
- Accessibility maintained.
- Performance acceptable.
- Documentation updated.
- Technical debt documented.
- Handoff completed.

Every answer should be YES.

---

# Common Failure Modes

Watch for:

Building more than requested.

Skipping tests.

Refactoring unrelated code.

Adding unnecessary abstractions.

Ignoring accessibility.

Leaving undocumented technical debt.

Assuming "it probably works."

Self-review exists to prevent these mistakes.

---

# Escalation Rules

Stop and escalate if:

Requirements appear incorrect.

Acceptance criteria conflict.

Architecture constraints prevent implementation.

Unexpected product decisions are required.

Business logic is unclear.

Engineering should never guess.

---

# Guiding Philosophy

Engineering quality begins before code review.

A thorough self-review demonstrates professionalism, reduces defects, and respects the time of reviewers.

Every implementation should be in a state where the engineer would be comfortable deploying it to production after approval.

MAP Builder engineers do not submit unfinished work.

They submit work they are proud to stand behind.