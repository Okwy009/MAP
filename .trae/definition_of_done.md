# MAP Builder — Definition of Done

Version: 1.0.0

Status: Required

Owner: MAP OS Core

---

# Purpose

This document defines the minimum quality standard that every engineering task must meet before it can be considered complete.

Completion is based on objective criteria rather than opinion.

A task is not "done" because coding has stopped.

A task is done when it satisfies every requirement in this document.

---

# Philosophy

Done means:

- The problem has been solved.
- The approved scope has been implemented.
- The implementation has been verified.
- The software is maintainable.
- MAP OS Core can safely review and release it.

Quality is the responsibility of every engineer.

---

# Definition of Done

A feature is considered complete only when every requirement below has been satisfied.

---

# 1. Scope Complete

✓ Every approved requirement has been implemented.

✓ Nothing outside the approved scope has been added.

✓ Out-of-scope items remain excluded.

Engineering implements exactly what was approved.

---

# 2. Acceptance Criteria Passed

Every acceptance criterion has been verified.

Example

Acceptance Criteria

✓ User can create a goal.

Status

PASS

Acceptance Criteria

✓ Validation errors display correctly.

Status

PASS

No criterion may remain unverified.

---

# 3. Code Quality

Code follows MAP Coding Standards.

Specifically:

✓ Readable

✓ Maintainable

✓ Predictable

✓ Consistent

✓ No unnecessary abstraction

✓ No duplicated logic

✓ Clear naming

✓ Appropriate structure

---

# 4. Architecture

Implementation respects Architecture Principles.

Examples:

✓ Existing patterns followed

✓ No unnecessary dependencies

✓ Correct separation of concerns

✓ Reusable where appropriate

✓ No architectural shortcuts

---

# 5. Testing Complete

Required:

✓ Unit tests pass

✓ Integration tests pass (where applicable)

✓ Manual validation completed

✓ Regression checks completed

✓ Edge cases reviewed

If testing is incomplete:

The task is not done.

---

# 6. Accessibility

If UI changes exist:

✓ Keyboard navigation works

✓ Semantic HTML used

✓ Focus states visible

✓ Labels present

✓ Screen reader compatibility maintained

Accessibility is a release requirement.

---

# 7. Error Handling

Expected failures are handled.

Examples:

✓ Invalid input

✓ API failures

✓ Network interruptions

✓ Empty states

✓ Loading states

No silent failures.

---

# 8. Performance

Implementation introduces no obvious regressions.

Verify:

✓ Efficient rendering

✓ Efficient data loading

✓ No unnecessary requests

✓ No obvious memory leaks

Optimization beyond the current scope is optional.

Performance regressions are not.

---

# 9. Security

Verify:

✓ Input validation

✓ Authorization respected

✓ Authentication unchanged

✓ Sensitive information protected

✓ Secure defaults maintained

Never trade security for convenience.

---

# 10. Documentation

Engineering documentation updated if necessary.

Examples:

Architecture changes

New patterns

Technical debt

Implementation notes

Decision recommendations

Knowledge should grow with the product.

---

# 11. Technical Debt

If technical debt was introduced:

It must be documented.

Include:

Reason

Impact

Suggested resolution

Priority

Hidden technical debt is unacceptable.

---

# 12. Self Review Complete

Engineering confirms:

✓ Scope respected

✓ Simplicity maintained

✓ No unnecessary complexity

✓ Standards followed

✓ Ready for review

Self-review is mandatory.

---

# 13. Handoff Prepared

Engineering provides:

Implementation Summary

Files Modified

Architecture Decisions

Testing Summary

Known Issues

Technical Debt

Recommended Follow-up Work

Ready for Review

MAP OS Core depends on this handoff.

---

# Release Gate

A feature may proceed to MAP OS Core only when every Definition of Done requirement is satisfied.

If any item remains incomplete:

The feature remains In Progress.

No exceptions.

---

# Ready for Review Checklist

Before requesting review:

- Scope complete
- Acceptance criteria verified
- Tests passing
- Accessibility verified
- Performance checked
- Error handling verified
- Documentation updated
- Technical debt documented
- Self-review completed
- Handoff prepared

Every item must be true.

---

# What "Done" Does NOT Mean

The following do NOT mean a task is complete:

The code compiles.

The UI looks correct.

The happy path works.

The feature works on one machine.

The implementation feels finished.

Completion is measured against objective standards—not intuition.

---

# Completion Report Template

Every completed task should end with:

Feature

Status

Completed

Scope

Completed

Acceptance Criteria

PASS

Testing

PASS

Accessibility

PASS

Performance

PASS

Security

PASS

Documentation

Updated

Technical Debt

None / Listed

Ready for Review

YES

---

# Guiding Philosophy

MAP users trust the product because MAP engineers trust the process.

The Definition of Done protects that trust.

Nothing is considered complete until it is demonstrably complete.

Quality is not inspected into software after implementation.

Quality is built into every step of implementation.

That is the MAP Builder standard.