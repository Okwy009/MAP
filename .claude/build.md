# MAP OS Build Process

Version: 1.0

Status: Active

Owner: Founder

---

# Purpose

The Build Process defines how MAP OS is assembled before being deployed to a Claude Project.

The source Markdown files are the canonical source of truth.

Claude Project Instructions are the compiled runtime.

Never edit the runtime directly.

Always update the source documents first.

---

# Build Philosophy

MAP OS is engineered.

Not prompt engineered.

The repository defines the operating system.

The Claude Project executes it.

Every change should originate in version-controlled documentation.

---

# Source of Truth

The following governance documents define MAP OS.

```
/claude

constitution.md
decision-framework.md
operating-loop.md
context-loading.md
agent-routing.md
response-standards.md
escalation-rules.md
memory-policy.md
```

These documents are never copied individually into Claude.

They are synthesized into a single runtime instruction.

---

# Build Artifacts

Source Documents

↓

MAP OS Constitution

↓

Master Project Prompt

↓

Claude Project Instructions

↓

Running MAP OS

---

# Build Order

The governance layer should always be reviewed in the following order.

## Step 1

Review Constitution

Verify:

Mission

Identity

Principles

Authority

Decision hierarchy

---

## Step 2

Review Decision Framework

Verify:

Evaluation criteria

Trade-offs

Decision scorecard

Confidence model

---

## Step 3

Review Operating Loop

Verify:

Workflow

Stages

Completion standard

Escalation points

---

## Step 4

Review Context Loading

Verify:

Required documentation

Context boundaries

Loading rules

---

## Step 5

Review Agent Routing

Verify:

Responsibilities

Authority

Escalation paths

Workflow order

---

## Step 6

Review Response Standards

Verify:

Structure

Quality

Actionability

Consistency

---

## Step 7

Review Escalation Rules

Verify:

Conflict handling

Approval paths

Confidence thresholds

---

## Step 8

Review Memory Policy

Verify:

Knowledge ownership

Memory updates

Institutional learning

---

# Compile Phase

After validation, synthesize the governance layer into a single Project Instruction.

The compiled instruction should:

Represent the Constitution.

Reference the Operating Loop.

Apply the Decision Framework.

Route work correctly.

Respect Response Standards.

Use Escalation Rules.

Treat Knowledge as institutional memory.

The compiled instruction should remain concise.

Do not concatenate every document.

Distill them.

---

# Deployment

Deployment consists of two actions.

## Update Project Instructions

Replace the previous runtime with the newly compiled Master Project Prompt.

---

## Verify Project Knowledge

Confirm the following folders are uploaded.

```
/company
/design
/docs
/engineering
/knowledge
/operations
/playbooks
/product
```

The `/claude` folder is **not** uploaded.

It remains the engineering specification for MAP OS.

---

# Validation Checklist

Before deployment confirm:

✓ Constitution is current.

✓ Governance documents are synchronized.

✓ No conflicting principles exist.

✓ Decision Framework is current.

✓ Context-loading rules match repository structure.

✓ Agent responsibilities are unchanged or intentionally updated.

✓ Response standards remain consistent.

✓ Memory policy reflects current knowledge strategy.

✓ Documentation hierarchy is correct.

Only deploy after all checks pass.

---

# Versioning

Every governance change should increment the version.

Suggested format:

Major.Minor.Patch

Examples:

1.0.0

1.1.0

1.1.1

Major

Breaking governance changes.

Minor

New capabilities.

Patch

Clarifications and corrections.

---

# Release Notes

Every release should record:

Version

Date

Summary

Reason for change

Affected governance documents

Migration notes (if required)

---

# Rollback

If a governance update causes degraded performance:

Restore the previous Constitution.

Restore the previous Master Project Prompt.

Document the issue.

Create a Product Learning.

Never leave MAP OS in an unknown state.

---

# Continuous Improvement

Governance should evolve only when supported by evidence.

Sources of evidence include:

Repeated user requests.

Agent failures.

Documentation conflicts.

Workflow bottlenecks.

Engineering feedback.

Customer insights.

Avoid speculative governance.

---

# Definition of Done

A build is complete when:

The Constitution reflects current strategy.

Governance documents are synchronized.

The Master Project Prompt has been regenerated.

Claude Project Instructions have been updated.

Knowledge folders are current.

The system behaves consistently across Founder, Product, Researcher, Reviewer, and Engineer modes.

---

# Guiding Principle

MAP OS is a living operating system.

Its quality is determined not by the number of documents it contains, but by the consistency with which every decision, every agent, and every implementation follows the same principles.

Build deliberately.

Deploy confidently.

Improve continuously.