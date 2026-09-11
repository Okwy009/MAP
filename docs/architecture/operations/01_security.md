# System Architecture v2.0

# Part 3B.1 — Security Architecture

**Document:** `docs/architecture/system-architecture.md`

**Version:** 2.0

**Part:** 3B.1

**Status:** Approved

**Owner:** Engineering

---

# Purpose

This chapter defines the security architecture of MAP.

It answers one question:

> **How does MAP protect its users, their data, and the integrity of the platform?**

Security is not a feature.

It is a foundational property of the entire system.

Every feature, service, API, and deployment must comply with this architecture.

---

# Security Philosophy

MAP is built on four principles.

## Principle 1 — Protect User Trust

Creators trust MAP with:

- personal information
- publishing goals
- execution history
- business plans
- AI preferences

Protecting this information is the platform's highest engineering responsibility.

---

## Principle 2 — Assume Breach

Every system should behave as if attackers already exist.

Never assume:

- users are honest
- requests are valid
- networks are safe
- APIs are trusted

Everything must be verified.

---

## Principle 3 — Least Privilege

Every user, service, and API receives only the permissions it needs.

Nothing more.

---

## Principle 4 — Defense in Depth

Security is implemented in multiple layers.

Failure of one layer must not compromise the system.

---

# Security Layers

```
Internet

↓

Cloudflare / CDN

↓

Vercel

↓

Next.js Middleware

↓

Authentication

↓

Authorization

↓

Validation

↓

Business Services

↓

Supabase RLS

↓

Database
```

Each layer protects the next.

---

# Threat Model

MAP is designed to defend against:

- Unauthorized access
- Credential theft
- SQL Injection
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- Broken Authentication
- API abuse
- Webhook forgery
- Data leakage
- Session hijacking
- Excessive API requests
- Privilege escalation

Threats are reviewed as the platform evolves.

---

# Zero Trust Architecture

MAP follows a Zero Trust model.

Every request must prove:

- identity
- authorization
- validity
- integrity

Nothing is trusted automatically.

---

# Authentication

Authentication is handled exclusively through Supabase Auth.

Supported methods:

- Magic Link
- Email Authentication

Future:

- Google OAuth
- GitHub OAuth
- Apple Sign In

Passwords are never stored by MAP.

---

# Authorization

Authentication answers:

> Who are you?

Authorization answers:

> What are you allowed to do?

Every request must verify ownership before accessing data.

Example:

```
User A

↓

GET /api/creator

↓

Only User A's profile is returned.
```

Cross-user access is impossible.

---

# Row-Level Security (RLS)

Supabase Row-Level Security is mandatory.

Every table containing user data must have RLS enabled.

Policies enforce:

```
User

↓

Own Rows Only
```

Even if an API fails, the database remains protected.

---

# Data Classification

Data is classified into four levels.

## Public

Examples:

- documentation
- marketing pages

---

## Internal

Examples:

- logs
- operational metrics

---

## Confidential

Examples:

- creator profile
- recommendations
- execution history

---

## Sensitive

Examples:

- authentication tokens
- API keys
- webhook secrets

Sensitive data receives the highest level of protection.

---

# Secrets Management

Secrets are never stored in source code.

Secrets include:

- Supabase Service Key
- Resend API Key
- Notion Token
- Gumroad Secret
- Encryption Keys

Secrets are managed through Vercel Environment Variables.

---

# Environment Variables

Variables are separated by environment.

Development

```
.env.local
```

Production

Managed by Vercel.

Never commit:

```
.env
```

to Git.

---

# Encryption

All communication uses HTTPS.

TLS is mandatory.

Data at rest is encrypted by Supabase.

Sensitive tokens remain encrypted.

---

# Session Security

Sessions are managed by Supabase.

Features include:

- secure cookies
- token rotation
- expiration
- refresh tokens

Applications never manually manage authentication tokens.

---

# CSRF Protection

Mutating requests require CSRF protection.

Examples:

```
POST

PATCH

PUT

DELETE
```

Read-only requests do not require CSRF tokens.

---

# XSS Protection

User-generated content is treated as untrusted.

MAP never renders raw HTML supplied by users.

Output should always be escaped or sanitized.

---

# SQL Injection Prevention

Repositories use parameterized queries.

Never build SQL using string concatenation.

Forbidden

```ts
"SELECT * FROM users WHERE id = " + id
```

Always use database clients or query builders.

---

# Input Validation

Every request validates:

- required fields
- types
- length
- formats
- business rules

Validation occurs before business logic.

---

# API Rate Limiting

Rate limiting protects against abuse.

Suggested limits:

Authentication

10 requests / minute

General API

100 requests / minute

Webhook

Verified by signature instead.

---

# Webhook Security

Incoming webhooks must verify:

- signature
- timestamp
- source

Only trusted providers may trigger actions.

Failed verification returns:

```
401 Unauthorized
```

---

# File Upload Security

Future uploads must validate:

- MIME type
- extension
- size
- virus scan (future)

Executable files are prohibited.

---

# Logging Security

Logs must never contain:

- passwords
- tokens
- payment details
- secrets

Sensitive information is redacted before storage.

---

# Error Handling

Users receive safe error messages.

Good

```
Unable to complete request.

Please try again.
```

Avoid

```
Supabase connection failed on port 5432...
```

Internal errors remain internal.

---

# Secure Headers

Production responses should include:

- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Strict-Transport-Security

These headers reduce browser-based attacks.

---

# Third-Party Integrations

Every external provider is treated as untrusted.

Integrations must:

- validate responses
- retry safely
- log failures
- timeout appropriately

No third-party failure should crash MAP.

---

# Dependency Security

Dependencies should:

- be actively maintained
- receive security updates
- avoid unnecessary packages

Unused dependencies are removed promptly.

---

# Security Reviews

Major features require a security review before release.

Checklist includes:

- authentication
- authorization
- validation
- secrets
- logging
- data exposure
- permissions

---

# Security Monitoring

Engineering monitors:

- failed logins
- unusual API activity
- repeated webhook failures
- elevated error rates
- suspicious access patterns

Critical incidents trigger alerts.

---

# Incident Response

If a security incident occurs:

1. Detect
2. Contain
3. Investigate
4. Recover
5. Document
6. Improve

Every incident produces a postmortem.

---

# Security Checklist

Every feature must answer:

- Is authentication required?
- Is authorization enforced?
- Is input validated?
- Are secrets protected?
- Is user data encrypted?
- Are logs sanitized?
- Are errors safe?
- Are dependencies secure?
- Are third-party calls verified?

If any answer is "No," the feature is not production-ready.

---

# Security Commandments

Every engineer and AI agent shall:

1. Never trust user input.
2. Never expose secrets.
3. Never bypass authorization.
4. Never disable RLS.
5. Never commit credentials.
6. Never log sensitive data.
7. Always validate requests.
8. Always verify ownership.
9. Prefer least privilege.
10. Protect user trust above convenience.

---

# Relationship to Other Documents

This chapter complements:

- `engineering_patterns.md`
- `coding_standards.md`
- `testing_standards.md`
- `deployment.md`
- `system-architecture.md`

Together they define MAP's production security posture.

---