# Engineering Architecture v2.0

# Part 3C.6 — Documentation Standards

**Document:** `docs/architecture/documentation-standards.md`

**Version:** 2.0

**Status:** Approved

**Owner:** Engineering + Product

---

# Purpose

This document defines the documentation standards for MAP.

It answers one question:

> **"How do we ensure MAP remains understandable five years from now?"**

Documentation is a product.

It is maintained with the same discipline as production code.

Good documentation enables engineers, product managers, designers, AI agents, and future contributors to work confidently without relying on tribal knowledge.

---

# Documentation Philosophy

Documentation exists to reduce ambiguity.

It should explain:

- Why something exists
- What it does
- How it works
- When it should change
- Who owns it

Documentation should never simply repeat the code.

Code explains implementation.

Documentation explains intent.

---

# Documentation Principles

Every document should be:

- Accurate
- Current
- Actionable
- Concise
- Searchable
- Versioned
- Reviewed

Documentation that is outdated is more harmful than documentation that does not exist.

---

# Documentation Hierarchy

MAP documentation is organized into five layers.

```text
Vision
    ↓
Product
    ↓
Architecture
    ↓
Engineering
    ↓
Operations
```

Each layer answers different questions.

---

# Documentation Categories

MAP maintains the following documentation groups.

## Product Documentation

Defines:

- Vision
- Positioning
- User Journey
- Product Principles
- Decision Engine
- Roadmap
- Backlog

Location:

```text
docs/product/
```

---

## Architecture Documentation

Defines:

- System Architecture
- Repository Architecture
- Database Design
- API Design
- Infrastructure
- Security
- AI Architecture

Location:

```text
docs/architecture/
```

---

## Engineering Documentation

Defines:

- Coding Standards
- Development Workflow
- Testing Strategy
- AI Development Standards
- Documentation Standards

Location:

```text
docs/architecture/
```

---

## Operations Documentation

Defines:

- Deployment
- Monitoring
- Incident Response
- Disaster Recovery
- Maintenance

Location:

```text
docs/operations/
```

---

## Reference Documentation

Defines:

- ADRs
- Decision Logs
- Changelog
- Release Notes
- Known Issues

Location:

```text
docs/reference/
```

---

# Standard Document Structure

Every document should follow the same structure.

```text
Title

Metadata

Purpose

Overview

Main Content

Guidelines

Relationships

Next Steps
```

Consistency improves discoverability.

---

# Required Metadata

Every document begins with:

```text
Title

Version

Status

Owner

Last Updated
```

Example:

```text
Version: 2.0

Status: Approved

Owner: Engineering

Last Updated: July 2026
```

---

# Status Values

Documents may have one of the following statuses.

| Status | Meaning |
|---------|---------|
| Draft | Work in progress |
| Review | Awaiting approval |
| Approved | Current source of truth |
| Deprecated | Replaced by another document |
| Archived | Historical reference only |

Only Approved documents should guide implementation.

---

# Versioning

Major changes increment the major version.

Examples:

```text
1.0

2.0

3.0
```

Minor edits increment the minor version.

Examples:

```text
2.1

2.2

2.3
```

Version history should be recorded when appropriate.

---

# Product Requirements Documents (PRDs)

Every feature requires a PRD.

Each PRD includes:

- Problem Statement
- User Stories
- Business Goal
- Requirements
- Acceptance Criteria
- Risks
- Dependencies
- Success Metrics

PRDs describe what should be built.

They never describe implementation details.

---

# Implementation Packages

Implementation Packages translate PRDs into engineering work.

They include:

- Technical approach
- File changes
- API updates
- Database migrations
- Testing requirements
- Deployment considerations

Implementation Packages describe how the feature will be built.

---

# Architecture Decision Records (ADRs)

Major technical decisions require ADRs.

Examples:

- Why Next.js was selected
- Why Supabase was chosen
- Why PostgreSQL was preferred
- Why Server Components are used

ADRs prevent repeated architectural debates.

Location:

```text
docs/reference/adrs/
```

---

# Decision Logs

Product decisions should also be documented.

Examples:

- Dashboard renamed to Daily Focus
- Recovery Mode added
- Decision Engine simplified

Each decision should include:

- Context
- Decision
- Alternatives considered
- Rationale
- Date
- Owner

Location:

```text
docs/reference/decision-log.md
```

---

# Changelog

Every release updates the changelog.

Example:

```text
Added

Changed

Fixed

Removed

Deprecated
```

This provides a historical record of product evolution.

---

# Release Notes

Release Notes communicate changes to users.

Include:

- New Features
- Improvements
- Bug Fixes
- Known Issues

Release Notes should be written in user-friendly language.

---

# Known Issues

Maintain a central list of known problems.

Each issue should include:

- Description
- Severity
- Workaround
- Status
- Owner
- Planned Fix

Transparency improves engineering efficiency.

---

# API Documentation

Every public endpoint must document:

- URL
- Method
- Authentication
- Request Body
- Response
- Errors
- Examples

API documentation should remain synchronized with implementation.

---

# Database Documentation

Every table should document:

- Purpose
- Relationships
- Constraints
- Indexes
- Owner

Database documentation prevents accidental schema drift.

---

# AI Documentation

AI systems should document:

- Model Provider
- Prompt Strategy
- Decision Logic
- Guardrails
- Fallback Behavior
- Monitoring
- Evaluation Metrics

AI should never become a black box.

---

# Diagram Standards

Architecture diagrams should use consistent notation.

Preferred diagrams include:

- System Context
- Data Flow
- Sequence Diagrams
- Component Diagrams
- Deployment Diagrams

Each diagram should include:

- Title
- Version
- Description

---

# Writing Style

Documentation should use:

- Clear headings
- Short paragraphs
- Active voice
- Plain language
- Consistent terminology

Avoid unnecessary jargon.

Write for future teammates.

---

# Markdown Standards

Use consistent Markdown formatting.

Example:

```markdown
# Title

## Section

### Subsection

- Bullet
- Bullet

| Table | Example |
|--------|---------|
```

Consistency improves readability.

---

# File Naming Standards

Use kebab-case.

Examples:

```text
system-architecture.md

testing-strategy.md

decision-engine-spec.md

repository-architecture.md
```

Avoid spaces or version numbers in filenames.

---

# Documentation Ownership

Every document has a primary owner.

| Document Type | Owner |
|---------------|-------|
| Product | Product |
| Architecture | Engineering |
| Operations | DevOps |
| AI | AI Engineering |
| Security | Engineering |

Ownership ensures accountability.

---

# Documentation Review

Documentation should be reviewed when:

- Features change
- Architecture changes
- Releases occur
- Dependencies change
- Bugs reveal missing knowledge

Documentation is maintained continuously—not periodically.

---

# Documentation Lifecycle

Every document follows the same lifecycle.

```text
Draft
    ↓
Review
    ↓
Approved
    ↓
Maintained
    ↓
Deprecated
    ↓
Archived
```

---

# AI Agent Responsibilities

AI agents must:

- Read documentation before coding
- Update documentation after implementation
- Never contradict approved documents
- Flag outdated documentation

Documentation is the source of truth.

---

# Documentation Checklist

Before approving a document verify:

✓ Purpose is clear

✓ Ownership defined

✓ Status assigned

✓ Formatting consistent

✓ Links valid

✓ Related documents referenced

✓ No conflicting information

✓ Actionable guidance included

---

# Definition of Complete Documentation

Documentation is complete when someone unfamiliar with the project can:

- Understand the purpose
- Navigate the system
- Make safe changes
- Answer common questions
- Extend the product confidently

Documentation exists to transfer understanding.

---

# Guiding Statement

Great software is built twice.

First in documentation.

Then in code.

Every hour spent improving documentation saves many hours of engineering effort in the future.

Documentation is one of MAP's long-term competitive advantages.

---

# Relationship to Other Documents

This document complements:

- `engineering-principles.md`
- `repository-architecture.md`
- `development-workflow.md`
- `coding-standards.md`
- `testing-strategy.md`
- `ai-assisted-development.md`

Together these documents define how MAP is designed, built, documented, maintained, and scaled.

---