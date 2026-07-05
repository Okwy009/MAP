# MAP Builder — Implementation Package

Version: 1.0.0

Status: Required

Owner: MAP OS Core

---

# Purpose

The Implementation Package is the formal contract between MAP OS Core and MAP Builder.

Engineering work may only begin after an approved Implementation Package has been delivered.

This document exists to eliminate ambiguity, prevent scope creep, and ensure engineering focuses on implementation rather than product discovery.

If an Implementation Package is incomplete, engineering must stop and request clarification.

---

# Philosophy

Engineering should never guess.

Every engineering task should begin with a complete understanding of:

- The problem
- The desired outcome
- The approved scope
- The success criteria
- The constraints

The better the package, the faster and safer implementation becomes.

---

# Workflow Position

The Implementation Package is created after:

Founder Approval

↓

Research Complete

↓

Product PRD Approved

↓

Reviewer Approval

↓

Founder Approval to Build

↓

Implementation Package

↓

MAP Builder

Engineering never receives work directly from a conversation.

Engineering receives an Implementation Package.

---

# Required Sections

Every Implementation Package must contain the following sections.

---

## 1. Feature Information

Feature Name

Feature ID (optional)

Sprint

Priority

Owner

Example

Feature Name:
Goal Creation

Priority:
High

Sprint:
Sprint 1

---

## 2. Problem Statement

Clearly describe:

What problem exists?

Who experiences it?

Why does it matter?

Example

Creators often know what they want to achieve but delay taking action because deciding the first step creates unnecessary cognitive load.

---

## 3. Business Goal

What business outcome should this feature support?

Examples

Increase activation

Improve onboarding

Reduce abandonment

Increase consistency

Improve retention

Engineering should understand why the feature exists.

---

## 4. User Outcome

Describe the change from the user's perspective.

Example

"When I create a goal, I immediately know what to do next."

Avoid describing implementation.

Describe the experience.

---

## 5. Scope

Describe exactly what Engineering should build.

Include:

Pages

Components

APIs

Data changes

Validation

Interactions

State management

Only approved work belongs here.

---

## 6. Out of Scope

List everything intentionally excluded.

Example

Notifications

Analytics

Streak tracking

Dashboard updates

Authentication changes

Anything not listed here may not be added during implementation.

---

## 7. User Stories

Use standard format.

Example

As a creator,

I want to define one meaningful goal,

So that MAP can generate my next action.

Multiple stories may exist.

---

## 8. Acceptance Criteria

Acceptance Criteria define completion.

Every criterion must be:

Specific

Observable

Testable

Example

User can enter a goal.

Goal is validated.

Goal is saved.

Confirmation is displayed.

Errors are handled gracefully.

No ambiguity should remain.

---

## 9. Technical Constraints

Anything engineering must respect.

Examples

Use existing design system.

No new dependencies.

Maintain accessibility.

Support mobile layouts.

Use existing authentication.

Avoid database schema changes.

---

## 10. Dependencies

List anything required before implementation.

Examples

Authentication

API availability

Existing components

Feature flags

Database migrations

---

## 11. Risks

Identify known implementation risks.

Example

Users may enter extremely long goal descriptions.

Offline state may cause duplicate submissions.

Existing API rate limits.

Engineering should prepare before coding.

---

## 12. Definition of Done

The feature is complete when:

Acceptance criteria pass

Tests pass

Accessibility maintained

No critical bugs

Documentation updated

Ready for review

---

# Engineering Responsibilities

Upon receiving an Implementation Package, MAP Builder must:

Read the package completely.

Identify ambiguities.

Request clarification if needed.

Produce an implementation plan.

Only then begin coding.

---

# Invalid Packages

Engineering must reject packages that:

Lack acceptance criteria.

Contain conflicting requirements.

Mix implementation with product decisions.

Leave major questions unanswered.

Have undefined scope.

Contain contradictory success metrics.

Returning a package for clarification is considered correct engineering behavior.

---

# Change Requests During Development

If scope changes after implementation begins:

Stop.

Return the request to MAP OS Core.

Do not modify the Implementation Package yourself.

MAP OS Core owns product scope.

Engineering owns implementation.

---

# Implementation Summary

When implementation is complete, Engineering returns:

Feature Name

Summary

Files Changed

Architecture Decisions

Testing Summary

Known Limitations

Technical Debt

Ready for Review

This becomes the official handoff back to MAP OS Core.

---

# Example Package

Feature Name

Goal Creation

Problem

Users delay getting started because deciding what to do first is mentally exhausting.

Business Goal

Increase successful onboarding completion.

User Outcome

Users leave onboarding with one clearly defined goal.

Scope

Goal creation page

Input validation

Save goal

Confirmation screen

Out of Scope

Dashboard

Progress tracking

Notifications

Acceptance Criteria

Goal can be created.

Validation errors display correctly.

Goal persists after refresh.

Confirmation screen appears.

Tests pass.

---

# Guiding Principle

A good Implementation Package answers every important engineering question before implementation begins.

If engineering has to guess, the package is incomplete.

If the package is complete, engineering should be able to focus entirely on building excellent software.

That is the purpose of the Implementation Package.