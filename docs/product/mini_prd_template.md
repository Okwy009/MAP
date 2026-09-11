# Mini Product Requirements Document (Mini PRD)

> Use this template for small features, UI improvements, bug fixes, and low-risk product changes.
>
> If the change affects core product behavior, architecture, onboarding, pricing, or user workflows, use the full `prd-template.md` instead.

---

# PRD Information

**Title:**

**Author:**

**Date:**

**Status:**

- Draft
- Approved
- In Development
- Completed

---

# Change Summary

Describe the change in one or two paragraphs.

Answer:

- What are we changing?
- Why are we changing it?

---

# User Problem

What user problem does this solve?

Keep it concise.

Example:

Users don't know whether today's task was successfully completed.

---

# Proposed Solution

Describe the proposed solution.

Avoid implementation details.

Example:

Display a confirmation message and automatically generate the next recommended action after a task is completed.

---

# User Story

As a...

I want...

So that...

Example:

As a creator,

I want immediate feedback after completing a task,

so that I know I'm making progress.

---

# Success Metric

How will we know this change worked?

Examples:

- Increased completion rate
- Reduced user confusion
- Fewer support requests
- Faster task completion

Primary Metric:

---

# Acceptance Criteria

Use the Given / When / Then format.

Example:

Given a completed task,

When the user clicks "Done",

Then MAP confirms completion and displays the next recommended action.

---

# Edge Cases

Consider:

- Empty states
- Network failures
- AI unavailable
- Invalid input

Only include relevant edge cases.

---

# Impact Assessment

Check all that apply.

- [ ] UI only
- [ ] Backend logic
- [ ] AI behavior
- [ ] Database
- [ ] API
- [ ] Analytics
- [ ] Documentation
- [ ] Accessibility

---

# Risks

What could go wrong?

Examples:

- User confusion
- Unexpected behavior
- Performance impact

---

# Out of Scope

Clearly state what this change does NOT include.

Example:

Does not redesign the recommendation engine.

---

# Documentation Updates

Which documents need updating?

Examples:

- product.md
- mechanism.md
- website.md
- decision-log.md

Leave blank if none.

---

# Reviewer Checklist

Before approval, verify:

- [ ] The user problem is clear.
- [ ] The solution is proportional to the problem.
- [ ] Acceptance criteria are testable.
- [ ] Edge cases were considered.
- [ ] Risks are acceptable.
- [ ] Documentation updates are identified.

---

# Founder Approval

Decision:

- Approved
- Approved with Changes
- Rejected

Reasoning:

Date:

Owner:

---

# Product Principles Check

Before approval, answer:

- Does this reduce cognitive load?
- Does this help users take meaningful action?
- Does this protect momentum?
- Is this simpler than the alternative?

If most answers are **No**, reconsider making the change.

---

# Decision

If this change did not exist...

Would users be noticeably worse off?

- Yes → Build it.
- No → Don't build it.

---

# Engineering Notes (Optional)

Implementation considerations:

Dependencies:

Testing notes:

Deployment notes: