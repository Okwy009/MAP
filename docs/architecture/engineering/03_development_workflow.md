# Engineering Architecture v2.0

# Part 3C.3 — Development Workflow

**Document:** `docs/architecture/development-workflow.md`

**Version:** 2.0

**Status:** Approved

**Owner:** Engineering

---

# Purpose

This document defines the complete software development lifecycle for MAP.

It answers one question:

> **"How does an idea become production software?"**

Every feature follows the same predictable workflow, from backlog to deployment. Standardizing this process ensures consistent quality, reduces delivery risk, and enables effective collaboration between Product, Engineering, AI agents, and Quality Assurance.

---

# Development Philosophy

MAP values disciplined execution over rapid delivery.

Every feature should be:

- Well understood before implementation
- Designed before development
- Reviewed before merging
- Tested before deployment
- Monitored after release

Shipping quickly is valuable.

Shipping correctly is essential.

---

# Software Development Lifecycle

Every feature progresses through the following lifecycle.

```text
Idea
    ↓
Product Discovery
    ↓
Backlog
    ↓
PRD
    ↓
Architecture Review
    ↓
Implementation Package
    ↓
Engineering
    ↓
Self Review
    ↓
Peer Review
    ↓
Testing
    ↓
Product Review
    ↓
Merge
    ↓
Deploy
    ↓
Monitoring
    ↓
Iteration
```

No feature skips a stage.

---

# Stage 1 — Product Discovery

Goal:

Understand the problem before proposing a solution.

Activities include:

- User research
- Problem definition
- Business impact analysis
- Success metrics
- Product validation

Deliverable:

Validated product opportunity.

---

# Stage 2 — Product Backlog

Approved ideas become backlog items.

Each backlog item includes:

- Feature ID
- Priority
- Description
- Business objective
- Dependencies
- Release target

The backlog represents the source of truth for engineering work.

---

# Stage 3 — Product Requirements Document (PRD)

Every feature requires a PRD.

The PRD defines:

- Problem statement
- User stories
- Functional requirements
- Non-functional requirements
- Acceptance criteria
- Success metrics
- Risks
- Open questions

No implementation begins without an approved PRD.

---

# Stage 4 — Architecture Review

Engineering evaluates:

- Technical feasibility
- System impact
- Dependencies
- Scalability
- Security implications

Outputs may include:

- Architecture diagrams
- API changes
- Database changes
- ADRs (Architecture Decision Records)

---

# Stage 5 — Implementation Package

The PRD is translated into an engineering execution plan.

An Implementation Package includes:

- Technical tasks
- File changes
- Database migrations
- API endpoints
- Component updates
- Testing requirements
- Rollout plan

This document guides implementation.

---

# Stage 6 — Development

Engineers implement the feature according to the approved package.

Responsibilities include:

- Writing production-quality code
- Following coding standards
- Updating documentation
- Creating tests
- Keeping commits focused and descriptive

Implementation should remain aligned with the approved design.

---

# Branching Strategy

MAP follows a lightweight Git workflow.

Main branches:

```text
main
```

Production-ready code.

```text
develop
```

Integration branch (optional for larger releases).

Feature branches:

```text
feature/MAP-005-decision-engine

feature/MAP-012-progress-history
```

Bug fixes:

```text
bugfix/MAP-008-completion-tracking
```

Hotfixes:

```text
hotfix/payment-webhook
```

Documentation:

```text
docs/system-architecture
```

Branch names should clearly communicate intent.

---

# Commit Standards

Commits should be:

- Small
- Atomic
- Descriptive

Recommended format:

```text
feat: add onboarding flow

fix: resolve payment verification bug

docs: update repository architecture

refactor: simplify recommendation service

test: add unit tests for decision engine
```

Avoid generic commit messages such as:

```text
update

changes

fixes
```

---

# Self Review

Before opening a pull request, every engineer should verify:

- Code compiles
- Tests pass
- Linting passes
- Documentation updated
- Acceptance criteria satisfied
- No debug code remains

Self-review reduces unnecessary review cycles.

---

# Pull Request Process

Every pull request should include:

- Summary
- Related feature ID
- Related PRD
- Related Implementation Package
- Testing performed
- Screenshots (if UI changes)
- Known limitations

Small pull requests are preferred.

---

# Code Review

Reviewers evaluate:

- Correctness
- Readability
- Product alignment
- Architecture compliance
- Security
- Testing
- Performance
- Documentation

Reviews improve the software—not the reviewer.

---

# Definition of Ready

A feature is ready for development when:

- It exists in the backlog
- PRD approved
- Architecture reviewed
- Implementation Package approved
- Dependencies resolved
- Acceptance criteria complete

Engineering should not begin before these conditions are met.

---

# Definition of Done

A feature is complete only when:

- Code implemented
- Tests passing
- Documentation updated
- Product acceptance completed
- Pull request approved
- Merged successfully
- Deployed successfully
- Monitoring active

Completion is measured by working software—not merged code.

---

# Testing Stage

Testing includes:

- Unit testing
- Integration testing
- End-to-end testing
- Manual QA
- Accessibility verification
- Regression testing

Critical workflows require comprehensive validation.

---

# Product Review

The Product Owner confirms:

- Requirements satisfied
- UX matches product principles
- Acceptance criteria met
- No unnecessary complexity introduced

Product approval is required before release.

---

# Merge Strategy

Preferred strategy:

```text
Squash and Merge
```

Benefits:

- Clean history
- Easier rollback
- Simpler release notes

Merge commits should remain meaningful.

---

# Continuous Integration (CI)

Every pull request automatically runs:

- Dependency installation
- Type checking
- Linting
- Unit tests
- Build validation
- Security scanning

Failed pipelines block merging.

---

# Continuous Delivery (CD)

Deployment pipeline:

```text
Merge to Main
        ↓
Build
        ↓
Automated Tests
        ↓
Preview Deployment
        ↓
Production Approval
        ↓
Production Release
```

Deployments should be repeatable and automated.

---

# Release Strategy

Production releases follow semantic versioning.

Examples:

```text
v0.1.0

v0.2.0

v1.0.0
```

Every release includes:

- Changelog
- Release notes
- Migration instructions (if needed)

---

# Hotfix Workflow

Critical production issues follow an expedited process.

```text
Issue
    ↓
Hotfix Branch
    ↓
Review
    ↓
Testing
    ↓
Production
    ↓
Merge Back
```

Hotfixes receive the same quality standards despite urgency.

---

# Rollback Strategy

Every deployment must support rollback.

Rollback plans include:

- Previous deployment artifact
- Database rollback strategy
- Feature flag disablement
- Recovery validation

Recovery plans should be tested periodically.

---

# AI-Assisted Development Workflow

AI agents support development by:

- Generating boilerplate
- Refactoring code
- Writing tests
- Drafting documentation
- Explaining architecture

AI-generated work always requires human review.

AI cannot approve its own output.

---

# Engineering Responsibilities

| Role | Responsibility |
|------|----------------|
| Product | Define requirements |
| Architecture | Validate system design |
| Engineering | Implement solution |
| QA | Verify correctness |
| DevOps | Deploy safely |
| AI Agents | Assist implementation |
| Founder | Final approval |

Clear ownership prevents ambiguity.

---

# Development Metrics

Engineering should monitor:

- Lead time
- Cycle time
- Deployment frequency
- Change failure rate
- Mean time to recovery
- Test coverage
- Defect escape rate

Metrics support continuous improvement—not individual evaluation.

---

# Workflow Principles

Every feature should:

- Solve a real user problem
- Follow architecture
- Remain simple
- Be fully tested
- Be well documented
- Be observable in production

Discipline enables speed.

---

# Guiding Statement

A great workflow does more than produce software.

It produces confidence.

Every contributor should know:

- what happens next
- who is responsible
- when work is complete
- how quality is maintained

Consistency is one of MAP's engineering advantages.

---

# Relationship to Other Documents

This document complements:

- `engineering-principles.md`
- `repository-architecture.md`
- `coding-standards.md`
- `testing-strategy.md`
- `documentation-standards.md`
- `ai-assisted-development.md`

Together these documents define how MAP is planned, built, reviewed, tested, and released.

---