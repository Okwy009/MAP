# Product Requirements Document (PRD)

> Every feature in MAP begins with a PRD.
>
> The purpose of this document is to ensure the problem is understood before a solution is built.
>
> Engineering should never begin without an approved PRD.

---

# PRD Information

**Title:**

**Author:**

**Date:**

**Version:**

**Status:**

- Draft
- Under Review
- Approved
- In Development
- Completed

---

# Executive Summary

Describe the feature in one paragraph.

Answer:

> What are we building?

> Why does it matter?

---

# Problem Statement

Describe the user problem.

Do NOT describe the solution.

Use evidence whenever possible.

Answer:

- What problem exists?
- Who experiences it?
- Why is it important?
- How do users solve this today?

---

# Customer

Primary User

Secondary User

Jobs To Be Done

What is the user trying to accomplish?

Example:

"I want to know exactly what to do next so I can stop overthinking and keep making progress."

---

# Desired Outcome

After using this feature, what changes?

Describe the user outcome.

Not the software output.

---

# Success Metrics

How will success be measured?

Examples:

- Feature adoption
- Completion rate
- Retention
- Time saved
- Reduced decision time
- Increased publishing consistency

Must include:

Primary Metric

Secondary Metrics

---

# User Story

As a...

I want...

So that...

Example

As a creator,

I want MAP to recommend one clear next action,

so that I can continue publishing even when I'm overwhelmed.

---

# User Journey

Describe the complete experience.

Starting State

↓

User Action

↓

MAP Response

↓

User Response

↓

Completion

Include happy path and failure paths.

---

# Functional Requirements

List everything the system must do.

Example

FR1

The system shall allow users to define a goal.

---

FR2

The system shall capture available time.

---

FR3

The system shall recommend exactly one next action.

---

FR4

The recommendation shall include:

- estimated duration
- explanation
- completion button

---

Each requirement should be:

Specific

Testable

Unambiguous

---

# Non-Functional Requirements

Performance

Security

Accessibility

Reliability

Scalability

Maintainability

Privacy

Example

Recommendation should appear within two seconds.

---

# Acceptance Criteria

Define what "done" means.

Example

Given a user has created a goal,

When they open MAP,

Then they receive one recommended action within two seconds.

---

Every acceptance criterion should follow:

Given

When

Then

---

# UX Requirements

Screens involved

Wireframes

States

Loading

Empty

Error

Offline

Accessibility considerations

---

# AI Requirements

Does this feature use AI?

Yes / No

If yes:

What information is sent?

What context is required?

How should the AI behave?

What happens if AI fails?

How is hallucination prevented?

How are recommendations explained?

---

# Data Requirements

New database tables

Existing tables

Relationships

Events emitted

Analytics tracked

Data retention

Privacy implications

---

# API Requirements

Endpoints

Inputs

Outputs

Authentication

Rate limits

Versioning

---

# Edge Cases

What happens if:

The user has no goals?

The user has no internet?

AI is unavailable?

The recommendation cannot be generated?

The user skips today's task?

The user changes their goal?

List every known edge case.

---

# Risks

Technical Risks

Product Risks

Business Risks

User Experience Risks

Mitigations

---

# Alternatives Considered

Describe alternative approaches.

Why were they rejected?

Never assume the first idea is the best.

---

# Dependencies

Internal dependencies

External services

APIs

Infrastructure

Feature flags

---

# Out of Scope

Clearly state what this feature does NOT do.

This prevents scope creep.

---

# Rollout Strategy

Internal testing

Alpha

Beta

Public release

Success criteria for each phase

Rollback plan

---

# Documentation Updates

Which documentation must change?

Examples

product.md

mechanism.md

website.md

decision-log.md

engineering documentation

---

# Open Questions

List unanswered questions.

Each question should have:

Owner

Priority

Status

---

# Reviewer Checklist

Before approval, verify:

- [ ] The problem is clearly defined.
- [ ] The solution addresses the problem.
- [ ] Success metrics are measurable.
- [ ] Functional requirements are complete.
- [ ] Acceptance criteria are testable.
- [ ] Edge cases have been considered.
- [ ] Risks have been documented.
- [ ] Documentation updates are identified.
- [ ] Product Principles are respected.
- [ ] Engineering Principles are respected.
- [ ] Architecture Principles are respected.

---

# Founder Decision

Decision

Approved

Approved with Changes

Rejected

Reasoning

Date

Owner

---

# Post-Launch Review

Launch Date

Metrics

Customer Feedback

Lessons Learned

Unexpected Outcomes

Follow-up Work

Decision

Keep

Improve

Remove

---

# MAP Product Principles Validation

Before this PRD can be approved, answer these questions:

## Does this feature reduce cognitive load?

Yes / No

Explain.

---

## Does it help users take meaningful action?

Yes / No

Explain.

---

## Does it protect momentum?

Yes / No

Explain.

---

## Does it respect different levels of time and energy?

Yes / No

Explain.

---

## Is it simpler than the alternative?

Yes / No

Explain.

---

## Final Question

If this feature did not exist...

Would users be significantly less likely to make progress?

If the answer is **No**, reconsider building it.

---

# MAP Philosophy Check

This feature should leave users feeling:

> "I know exactly what to do next."

If it doesn't...

It probably isn't a MAP feature.