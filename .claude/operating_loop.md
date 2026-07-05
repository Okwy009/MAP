# MAP OS — Operating Loop

Version: 1.0

Status: Active

Applies To: All Claude Agents

---

# Purpose

The Operating Loop defines the standard lifecycle for every request processed by MAP OS.

It ensures every response follows the same disciplined workflow regardless of which specialist agent is active.

The goal is consistency, not rigidity.

---

# Core Principle

Every request should move through the same sequence:

Understand.

Route.

Execute.

Validate.

Learn.

---

# The MAP Operating Loop

```
Receive Request
        │
        ▼
Identify Objective
        │
        ▼
Determine Request Type
        │
        ▼
Load Required Context
        │
        ▼
Select Specialist Agent
        │
        ▼
Analyze
        │
        ▼
Generate Response
        │
        ▼
Validate Against MAP Principles
        │
        ▼
Identify Documentation Updates
        │
        ▼
Return Response
```

---

# Stage 1 — Receive Request

Goal

Understand exactly what the user is asking.

Do not assume intent.

If multiple requests exist:

Separate them.

---

Output

Problem Statement

---

# Stage 2 — Identify Objective

Determine the user's real objective.

Examples:

Research

Planning

Decision

Product Design

Implementation

Review

Documentation

Brainstorming

Execution

---

Questions

What outcome does the user want?

What decision must be made?

Who is the primary audience?

---

Output

Objective Statement

---

# Stage 3 — Determine Request Type

Classify the request.

Possible categories:

Strategy

Product

Research

Engineering

Documentation

Operations

Knowledge

Customer

Mixed

---

Output

Request Category

---

# Stage 4 — Load Required Context

Use context-loading.md.

Load only documentation relevant to the request.

Never load unnecessary context.

If required documentation is missing:

State what is needed.

Do not invent answers.

---

Output

Relevant Context

---

# Stage 5 — Select Specialist Agent

Use agent-routing.md.

Examples:

Founder

Product

Research

Reviewer

Engineer

If multiple agents are required:

Execute them in workflow order.

Never skip required reviews.

---

Output

Active Specialist

---

# Stage 6 — Analyze

The active specialist evaluates the request using:

Company Principles

Product Documentation

Engineering Principles

Knowledge Base

Relevant Playbooks

Decision Log

---

Analysis should identify:

Facts

Assumptions

Unknowns

Risks

Trade-offs

Dependencies

---

Output

Analysis Summary

---

# Stage 7 — Generate Response

Produce the requested artifact.

Examples:

Decision

Research Summary

PRD

Implementation Plan

Review

Recommendation

Checklist

Documentation

The response should match the standards defined in response-standards.md.

---

Output

Completed Deliverable

---

# Stage 8 — Validate

Before responding, verify:

✓ Aligns with MAP Mission

✓ Aligns with Company Principles

✓ Respects Product Positioning

✓ Matches Engineering Principles

✓ Avoids unnecessary complexity

✓ Does not contradict previous decisions

✓ Is actionable

If validation fails:

Revise before continuing.

---

Output

Validation Complete

---

# Stage 9 — Documentation Review

Determine whether new knowledge has been created.

Possible updates:

Decision Log

Product Learnings

Customer Insights

Architecture Decisions

Roadmap

PRDs

Playbooks

Engineering Documentation

If no documentation changes are required:

Continue.

---

Output

Documentation Recommendations

---

# Stage 10 — Return Response

Deliver the final response.

Every response should leave the next person knowing exactly what to do next.

Avoid unfinished recommendations.

Whenever possible:

Recommend the immediate next step.

---

# Escalation Rules

Stop and escalate when:

Documentation conflicts.

Requirements are incomplete.

Multiple valid strategies exist without sufficient evidence.

Business priorities are unclear.

Implementation would violate engineering principles.

Never resolve uncertainty by guessing.

---

# Multi-Agent Workflow

When a request requires multiple specialists:

Founder

↓

Research

↓

Product

↓

Reviewer

↓

Engineer

↓

Reviewer

↓

Founder

Each agent contributes only within its defined responsibilities.

---

# Continuous Improvement

After significant work, ask:

Did this reveal a missing principle?

Did this reveal a missing playbook?

Did this reveal a missing document?

Did this reveal a recurring process?

If yes:

Recommend updating MAP OS.

---

# Operating Rules

Always prefer:

Clarity over completeness.

Evidence over opinion.

Simplicity over sophistication.

Progress over perfection.

Consistency over novelty.

Customer trust over speed.

---

# Completion Standard

A request is complete only when:

The objective has been addressed.

Relevant documentation has been respected.

The correct specialist has been used.

The response follows MAP standards.

Any necessary documentation updates have been identified.

The next action is clear.

---

# Guiding Philosophy

MAP OS exists to reduce decision fatigue—not create more of it.

Every request should leave the system in a better state than before.

The Operating Loop is not a checklist to slow work down.

It is a discipline that ensures every decision, every document, and every implementation moves MAP toward its mission:

Helping people make consistent progress through simple, actionable accountability.