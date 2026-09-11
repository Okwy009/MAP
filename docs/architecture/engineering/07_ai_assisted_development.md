# Engineering Architecture v2.0

# Part 3C.7 — AI-Assisted Development

**Document:** `docs/architecture/ai-assisted-development.md`

**Version:** 2.0

**Status:** Approved

**Owner:** Product + Engineering

---

# Purpose

This document defines how Artificial Intelligence is used during the development of MAP.

It answers one question:

> **"How do humans and AI work together to build MAP safely, consistently, and at production quality?"**

AI is treated as a senior engineering accelerator—not as an autonomous software company.

Humans remain responsible for every product and engineering decision.

---

# Philosophy

MAP is an AI-assisted software company.

Every significant decision is reviewed by humans.

AI improves:

- speed
- consistency
- documentation
- implementation
- testing
- reviews

Humans provide:

- judgment
- priorities
- product vision
- customer understanding
- final approval

---

# Core Principle

> **AI writes. Humans decide.**

No AI agent may independently change MAP's product direction.

Every implementation traces back to an approved product decision.

---

# AI Development Stack

MAP uses multiple specialized AI systems.

Each has a clearly defined responsibility.

```text
Founder
        │
        ▼
Product (ChatGPT)
        │
        ▼
Architecture
        │
        ▼
Engineering (MAP Builder)
        │
        ▼
Claude (MAP OS)
        │
        ▼
Review
        │
        ▼
Deployment
```

No AI replaces another.

Each has a specialized role.

---

# AI Roles

## Founder

Responsible for:

- Vision
- Strategy
- Customer understanding
- Prioritization
- Product approval
- Final decisions

The Founder owns the product.

---

## ChatGPT

Role:

Head of Product + Technical Program Manager

Responsibilities:

- Product strategy
- PRDs
- Architecture
- Backlog management
- User journeys
- Feature prioritization
- Engineering planning
- Technical reviews
- Program coordination
- Documentation
- Acceptance criteria
- Release planning

ChatGPT decides **what should be built** and **how work is organized.**

---

## MAP Builder (Trae)

Role:

Lead Software Engineer

Responsibilities:

- Code implementation
- Refactoring
- Feature development
- Testing
- Bug fixing
- Performance improvements
- Code reviews
- Repository maintenance

MAP Builder transforms approved specifications into production-ready software.

MAP Builder never changes product behavior without an approved PRD.

---

## Claude (MAP OS)

Role:

Product Reviewer + Systems Reviewer

Responsibilities:

- Product critique
- UX reviews
- Workflow evaluation
- Architecture reviews
- Requirement validation
- Gap identification
- Documentation review
- Mission alignment
- Customer experience audits

Claude protects the product from drifting away from its core promise.

Claude asks:

> "Does this still feel like MAP?"

---

# Responsibility Matrix

| Area | Founder | ChatGPT | MAP Builder | Claude |
|---------|----------|------------|----------------|------------|
| Product Vision | ✅ | Support | ❌ | Review |
| Roadmap | ✅ | ✅ | ❌ | Review |
| PRDs | Review | ✅ | ❌ | Review |
| Architecture | Review | ✅ | Support | Review |
| Coding | ❌ | Review | ✅ | Review |
| Testing | Review | Plan | ✅ | Review |
| UX Review | Review | ✅ | Support | ✅ |
| Deployment | Approve | Plan | ✅ | Review |
| Documentation | Review | ✅ | Support | Review |

Each responsibility has one primary owner.

---

# AI Workflow

Every feature follows the same workflow.

```text
Idea
      ↓
Product Discussion
      ↓
PRD
      ↓
Architecture Review
      ↓
Implementation Package
      ↓
Engineering
      ↓
Testing
      ↓
Product Review
      ↓
Release
```

No AI skips a stage.

---

# Product Development Workflow

Step 1

Founder identifies a customer problem.

↓

Step 2

ChatGPT creates or updates:

- PRD
- User Journey
- Acceptance Criteria
- Architecture

↓

Step 3

MAP Builder implements.

↓

Step 4

Claude reviews.

↓

Step 5

Founder approves.

↓

Step 6

Release.

---

# Prompt Engineering Standards

AI prompts should include:

- Goal
- Context
- Constraints
- Expected Output
- Acceptance Criteria

Avoid vague prompts.

Good prompts produce predictable software.

---

# AI Context

Every AI should receive:

- Relevant architecture documents
- Current PRD
- Coding standards
- Repository architecture
- Engineering principles

Never ask an AI to implement features without context.

---

# AI Guardrails

AI must never:

- invent requirements
- invent customer behavior
- remove security
- ignore documentation
- bypass testing
- contradict approved PRDs
- change architecture without approval

When uncertain:

Stop.

Ask for clarification.

---

# Human Review Requirements

Every AI-generated change requires human review before release.

Review includes:

- Product alignment
- Code quality
- Security
- Performance
- Documentation
- Testing

AI accelerates engineering.

Humans remain accountable.

---

# Code Generation Standards

Generated code should:

- compile
- follow coding standards
- include strong typing
- be documented
- pass tests
- be production ready

Prototype-quality code should never reach production.

---

# Documentation Standards

Whenever AI changes software it should also update:

- Architecture
- PRDs
- Decision Logs
- Changelog
- API documentation
- README (when appropriate)

Code and documentation evolve together.

---

# AI Review Checklist

Before accepting AI output verify:

✓ Requirements implemented

✓ Naming consistent

✓ Architecture respected

✓ Tests included

✓ Documentation updated

✓ No duplicated logic

✓ Security maintained

✓ Performance acceptable

✓ Product experience unchanged

---

# AI Review Questions

Every implementation should answer:

- Does this solve the correct problem?
- Does it simplify the creator's experience?
- Is this consistent with MAP's principles?
- Does it increase technical debt?
- Could another engineer understand this?

---

# AI Quality Gates

Implementation cannot proceed if:

- PRD missing
- Architecture unclear
- Acceptance criteria incomplete
- Testing undefined
- Security unreviewed

Quality gates prevent expensive mistakes.

---

# AI Memory

AI should rely on:

- Approved documentation
- Repository structure
- Existing architecture
- Decision logs

AI should not rely on assumptions.

Documentation is the institutional memory.

---

# Continuous Learning

After each release record:

- What worked
- What failed
- Customer feedback
- Engineering lessons
- Product decisions

These become future guidance.

MAP improves through continuous learning.

---

# AI Limitations

AI cannot replace:

- Customer interviews
- Founder intuition
- Product vision
- Business strategy
- Ethical judgment

These remain human responsibilities.

---

# Governance

Major decisions require Founder approval.

Examples:

- Product positioning
- Pricing
- Architecture changes
- Database redesign
- AI provider changes
- Authentication strategy
- Payment provider
- Public releases

AI may recommend.

Humans decide.

---

# Escalation Rules

If an AI detects:

- conflicting documentation
- missing requirements
- unclear architecture
- security concerns
- broken assumptions

It must:

1. Stop implementation.
2. Explain the issue.
3. Request clarification.
4. Wait for approval.

Never guess.

---

# Definition of Successful AI Collaboration

Successful collaboration means:

- Product remains consistent.
- Engineering moves faster.
- Documentation stays current.
- Bugs decrease.
- Releases become more predictable.
- Creators receive a better experience.

AI is valuable only if it improves outcomes.

---

# Guiding Statement

MAP is not being built by AI.

MAP is being built by a disciplined product and engineering process that uses AI to eliminate repetitive work while preserving human judgment.

Every AI agent exists to strengthen the product—not redefine it.

---

# Relationship to Other Documents

This document complements:

- `system-architecture.md`
- `repository-architecture.md`
- `development-workflow.md`
- `engineering-principles.md`
- `coding-standards.md`
- `testing-strategy.md`
- `documentation-standards.md`

Together these documents form the complete Engineering Architecture v2.0 for MAP.

---
