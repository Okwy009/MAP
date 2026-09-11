# System Architecture v2.0

# Part 3B.2 — Authentication & Identity Architecture

**Document:** `docs/architecture/system-architecture.md`

**Version:** 2.0

**Part:** 3B.2

**Status:** Approved

**Owner:** Engineering

---

# Purpose

This chapter defines how creators authenticate with MAP, how identities are managed, and how access is protected throughout the platform.

It answers one question:

> **"How does MAP securely identify users and ensure they can only access their own data?"**

Authentication is the foundation of trust.

Identity is the foundation of personalization.

---

# Design Principles

The authentication system must:

- Be secure by default.
- Minimize user friction.
- Never expose credentials.
- Support persistent sessions.
- Scale from individual creators to teams.
- Integrate cleanly with Supabase.

---

# Authentication Goals

MAP authentication should allow a creator to:

- Create an account.
- Purchase access.
- Verify ownership of their email.
- Sign in securely.
- Stay signed in across sessions.
- Sign out safely.
- Recover access if needed.

---

# Identity Model

Every creator has exactly one MAP identity.

```
Creator
     │
     ▼
Supabase User
     │
     ▼
Creator Profile
     │
     ▼
Execution History
     │
     ▼
Recommendations
     │
     ▼
Content Calendar
```

Authentication establishes identity.

Identity unlocks personalization.

---

# Identity Components

Each account consists of:

## Authentication Identity

Managed by Supabase.

Contains:

- User ID
- Email
- Authentication provider
- Session metadata

---

## Creator Profile

Managed by MAP.

Contains:

- Name
- Creator Type
- Platform
- Topics
- Tone
- Goals
- Posting Frequency
- Audience
- AI Preferences

---

## Product Data

Associated with the creator.

Examples:

- Daily recommendations
- Input logs
- Completion history
- Weekly reviews
- Content calendar

---

# Authentication Provider

MAP uses:

**Supabase Authentication**

Reasons:

- Secure
- Well-tested
- Passwordless support
- JWT support
- Row-Level Security integration
- Session management
- Email verification

Authentication is never implemented manually.

---

# Authentication Methods

## Phase 1

Supported:

- Magic Link
- Email Verification

---

## Future

Supported:

- Google
- GitHub
- Apple
- Microsoft

OAuth providers plug into the same identity model.

---

# Account Creation Flow

```
User

↓

Enter Email

↓

Supabase creates account

↓

Verification Email

↓

Email Confirmed

↓

Create Creator Profile

↓

Redirect to Onboarding
```

A user cannot access MAP until their email is verified.

---

# Sign-In Flow

```
Creator

↓

Enter Email

↓

Magic Link Sent

↓

Open Email

↓

Click Link

↓

Supabase validates token

↓

Session created

↓

Redirect to Dashboard
```

No passwords are required.

---

# Session Lifecycle

```
Login

↓

JWT Created

↓

Stored Securely

↓

Session Active

↓

Refresh Token

↓

Session Renewed

↓

Logout

↓

Session Destroyed
```

Sessions are managed entirely by Supabase.

---

# Session Duration

Default session duration:

30 days

Sessions refresh automatically while active.

Inactive sessions expire.

---

# JWT Tokens

JWTs contain:

- User ID
- Session ID
- Expiration
- Issuer
- Audience

Applications must never manually modify JWTs.

---

# Refresh Tokens

Refresh tokens remain server-managed.

Clients request refreshed sessions automatically.

Engineering should never implement custom refresh logic unless required by Supabase.

---

# Email Verification

Every account must verify ownership of its email.

Verification occurs before:

- payment access
- onboarding
- recommendation generation

Unverified accounts remain inactive.

---

# Passwordless Philosophy

MAP intentionally avoids passwords.

Benefits:

- fewer forgotten passwords
- reduced attack surface
- simpler onboarding
- better user experience

Magic Links become the default authentication experience.

---

# Sign-Out Flow

```
Creator

↓

Logout

↓

Supabase destroys session

↓

Cookies removed

↓

Redirect Home
```

Logout should invalidate all active session tokens.

---

# Protected Routes

Public routes:

```
/

Pricing

About

Privacy

Terms
```

Protected routes:

```
/app

/app/today

/app/calendar

/app/profile

/app/settings

/app/review
```

Access requires authentication.

---

# Middleware

Next.js middleware protects private routes.

Responsibilities:

- validate session
- refresh session
- redirect unauthenticated users
- prevent unauthorized access

---

# Route Authorization

Authentication checks:

> Is the user logged in?

Authorization checks:

> Can this user access this resource?

Example:

```
GET /api/profile

↓

User ID extracted

↓

Database lookup

↓

Return own profile only
```

---

# Ownership Rules

Creators may access only:

- their profile
- their recommendations
- their calendar
- their reviews
- their execution history

Cross-account access is prohibited.

---

# User Roles

Phase 1 supports one role.

```
Creator
```

---

## Future Roles

```
Creator

Coach

Support

Administrator

Founder
```

Permissions remain role-based.

---

# Permission Matrix

| Resource | Creator | Admin |
|-----------|---------|-------|
| Own Profile | ✅ | ✅ |
| Other Profiles | ❌ | Limited |
| Own Calendar | ✅ | ✅ |
| Other Calendars | ❌ | Limited |
| Settings | ✅ | ✅ |
| User Management | ❌ | ✅ |

---

# Authentication State

Client applications recognize:

```
Loading

Authenticated

Unauthenticated

Expired

Error
```

UI must gracefully handle every state.

---

# Onboarding State

Authentication alone does not complete onboarding.

Possible states:

```
Authenticated

↓

Profile Missing

↓

Onboarding Required

↓

Decision Engine

↓

Calendar Generated

↓

Daily Experience Ready
```

---

# Returning User Flow

```
Creator

↓

Open MAP

↓

Session Valid

↓

Load Recommendation

↓

Show Today's Action
```

No onboarding screens appear again.

---

# Identity Recovery

Creators who lose access can:

- request a new Magic Link
- verify email ownership
- resume previous session

No creator data is lost.

---

# Multi-Device Support

Creators may use:

- desktop
- tablet
- mobile

Sessions synchronize automatically.

---

# Future Team Accounts

Future architecture supports:

```
Workspace

↓

Team

↓

Creator

↓

Permissions
```

Current MVP remains single-user.

---

# Security Requirements

Authentication must:

- require HTTPS
- validate JWTs
- verify sessions
- enforce expiration
- rotate refresh tokens
- protect cookies
- prevent session fixation

---

# Authentication Logging

Record:

- login
- logout
- failed login
- expired session
- revoked session

Never log:

- tokens
- secrets
- authentication headers

---

# Failure Handling

If authentication fails:

Return:

```
401 Unauthorized
```

If authorization fails:

Return:

```
403 Forbidden
```

If a resource does not exist:

Return:

```
404 Not Found
```

Responses should never reveal internal implementation details.

---

# Authentication Checklist

Before release:

- Magic Links work.
- Email verification required.
- Sessions refresh correctly.
- Logout clears sessions.
- Middleware protects routes.
- Unauthorized requests rejected.
- Protected pages inaccessible without login.
- JWT validation passes.
- RLS policies verified.

---

# Guiding Principles

Authentication exists to reduce friction while protecting trust.

Creators should think:

> "Logging into MAP is effortless."

Engineering should ensure:

> "Every request is authenticated, authorized, and secure."

---

# Relationship to Other Documents

This chapter complements:

- `decision-engine-spec.md`
- `user-journey.md`
- `system-architecture.md`
- `security-architecture.md`
- `engineering_patterns.md`
- `deployment.md`

Together they define MAP's identity and access management architecture.

---
