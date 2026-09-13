# Product Requirements Document (PRD)

> Every feature in MAP begins with a PRD.
> Engineering should never begin without an approved PRD.

---

# PRD Information

**Title:** MAP-003b — Landing Page (Pre-Signup Marketing)

**Author:** MAP OS (Product Mode) — drafted for Founder review

**Date:** 2026-09-12

**Version:** 1.0

**Status:** Closed — Superseded (not built)

---

# Executive Summary

MAP currently has no landing page — `app/page.tsx` is a bare title with no explanation of what MAP is, who it's for, or why someone should sign up. This was flagged directly by the founder after observing the live signup flow: it was "too direct," asking for an email before explaining anything. This PRD scopes a real landing page that introduces MAP's value proposition before the signup/login screen, using the newly-defined 4-stage pricing model (pricing.md v3) to explain what a creator gets, starting free.

This is not part of the original MVP backlog (MAP-001 through MAP-00X) — it's a new item, surfaced by direct observation of the live product, and should be added to `mvp_backlog.md` accordingly.

---

# Problem Statement

- **What problem exists?** A visitor lands on MAP's homepage and sees nothing explaining the product — just a title. The path to signup has no context.
- **Who experiences it?** Every new visitor, before they ever create an account.
- **Why is it important?** A signup asked for without context is a weaker signup — someone who doesn't understand what they're agreeing to is more likely to churn immediately or never convert to a paid tier later.
- **How is this solved today?** It isn't — this is a confirmed, observed gap in the live product.

---

# Customer

**Primary User:** A visitor who has not yet created a MAP account — arriving via a link, search, or word of mouth, with no prior context on what MAP is.

**Jobs To Be Done:**

> "I want to quickly understand what this does and whether it's for me, before I decide to sign up."

---

# Desired Outcome

A visitor can read the landing page in under a minute and understand: what MAP does (reduces decision fatigue for creators via one clear next action), who it's for, that it's free to start, and what upgrading eventually unlocks — then sign up feeling informed, not cornered.

---

# Success Metrics

**Primary Metric:** Landing-page-to-signup conversion rate (visit → account created).

**Secondary Metrics:**
- Bounce rate on the landing page
- Time on page before clicking sign up
- Signup-to-Day-2-return rate (a proxy for whether expectations set on the landing page match reality)

---

# User Story

As a visitor who has never heard of MAP in detail,
I want to understand what it does and who it's for before signing up,
so that I can make an informed decision rather than being asked to commit blind.

---

# User Journey

**Happy Path**

Visitor arrives at MAP's root URL
↓ Sees a clear headline explaining the core value prop (one next action, not decision fatigue)
↓ Sees who MAP is for (creators struggling with consistency/publishing)
↓ Sees a short explanation of how it works (Decision Engine → daily focus, in plain language)
↓ Sees pricing framed as "start free" (Stage 1), with a brief mention that paid tiers exist for later
↓ Clicks a clear call-to-action ("Get started free" or similar)
↓ Lands on `/auth/signup`, now with context

**Failure Paths**

- Visitor doesn't understand the value prop and leaves — mitigated by keeping the headline concrete and specific, not vague marketing language.
- Visitor is confused about whether it's really free — mitigated by explicit "free" framing tied to the freemium decision, not just a generic "get started."

---

# Functional Requirements

**FR1**
The system shall replace the current bare-title homepage (`app/page.tsx`) with a real landing page containing: a headline, a brief explanation of the product, who it's for, and a call-to-action.

**FR2**
The system shall explain the "start free" model explicitly, consistent with the freemium pivot (decision_log.md, 2026-09-12) — visitors should understand they can begin without paying.

**FR3**
The system shall link the primary call-to-action to `/auth/signup`.

**FR4**
The system shall be a static page (no auth check, no DB calls) — consistent with keeping the public-facing entry point fast and simple.

**FR5**
The system shall be mobile-responsive, since a meaningful share of visitors will likely arrive via social links (per the multi-platform distribution direction in pricing.md v3).

Each requirement is specific, testable, and unambiguous.

---

# Non-Functional Requirements

**Performance:** Should load fast — this is the literal front door; a slow landing page directly costs conversions. Static rendering (no server calls), consistent with Next.js's default behavior for pages with no dynamic data.

**Accessibility:** Standard heading hierarchy, sufficient color contrast, readable at default zoom.

**Maintainability:** Copy should live in a way that's easy to iterate on (plain JSX text is fine at this stage — no CMS needed for a single static page).

---

# Acceptance Criteria

- Given a visitor with no account, When they visit MAP's root URL, Then they see a real landing page, not a bare title.
- Given the landing page, When a visitor reads it, Then they can identify what MAP does, who it's for, and that it's free to start, without needing to click anything else.
- Given the landing page's call-to-action, When clicked, Then the visitor lands on `/auth/signup`.
- Given the landing page, When viewed on a mobile-width screen, Then the layout remains readable and usable.

---

# UX Requirements

**Screens involved:** One page — the new homepage.

**Sections (suggested, not final copy):** Headline + subheadline, "how it works" (2-3 short beats matching the Decision Engine's actual flow: profile → recommendation → daily focus), "who it's for," pricing teaser (free-to-start, tiers exist), call-to-action.

**Tone:** Per `voice.md`/`brand.md` — should match MAP's established voice, not generic SaaS marketing language.

---

# AI Requirements

Does this feature use AI? **No.** Static marketing content, human-written (or founder-approved), consistent with AI's role being execution-support, not brand voice generation, per `system_architecture.md`'s AI Responsibilities list.

---

# Data Requirements

None. No database interaction — this is a static public page.

---

# API Requirements

None.

---

# Edge Cases

- An already-authenticated creator visits the root URL → should probably redirect to their dashboard rather than showing marketing copy meant for new visitors. (Open question below — not yet decided.)

---

# Risks

**Product Risk:** Weak or generic copy could underperform regardless of the page existing — the *content* matters more than the code here. Mitigation: treat copywriting as its own pass, not an afterthought bolted onto the build.

---

# Alternatives Considered

- **Leave the bare-title homepage as-is** — rejected; directly identified as a conversion risk from live observation.
- **Build a full multi-page marketing site** — rejected as over-scoped for MVP; a single well-written landing page is sufficient right now.

---

# Dependencies

**Internal dependencies:** None blocking — can be built independently of MAP-004.

**Content dependency:** Final copy should be reviewed against `voice.md` and `brand.md` before shipping — worth a founder pass on the actual words, not just the structure.

---

# Out of Scope

- A/B testing different headlines or layouts.
- A blog, testimonials section, or social proof (no real users to feature yet).
- SEO optimization beyond basic meta tags.

---

# Open Questions

| Question | Owner | Priority | Status |
|---|---|---|---|
| Should an already-authenticated creator visiting the root URL be redirected to their dashboard instead of seeing marketing copy? | Founder | Medium | Open |
| Who writes final copy — founder draft, or should this PRD's draft copy be used as a starting point for Claude Code to write, then founder-reviewed? | Founder | High | Open |

---

# Founder Decision

**Decision:** Closed — not built. Superseded by the auth-aware homepage fix (app/page.tsx, shipped 2026-09-12), which resolved the core problem this PRD was written for (the "too direct" signup experience with no context). A fuller standalone marketing/landing page may be revisited later if the homepage's minimal copy proves insufficient once MAP has more real traffic — but is not currently planned.

**Reasoning:** The immediate, concrete problem (a bare-title homepage with no context or navigation) was fixed directly and more urgently by the homepage auth-aware rebuild, which shipped faster and covers the practical need. The full marketing-page vision in this PRD (headline, "how it works," pricing teaser) remains a reasonable future idea but isn't the current priority.

**Date:** 2026-09-12

**Owner:** Founder
