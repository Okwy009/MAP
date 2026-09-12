/**
 * Pure routing rules for the MAP-001 auth login/logout redirects. No I/O, no
 * Next.js/Supabase imports, so the path-matching logic is directly
 * unit-testable, independent of `lib/supabase/middleware.ts`'s session plumbing.
 *
 * The MAP-002 subscription gate (redirect an unpaid creator to /pricing) was
 * removed here on the freemium pivot (decision_log.md "Freemium pivot" /
 * "MAP Experience stages", 2026-09-12): every authenticated creator is now
 * entitled by default at the free tier (see lib/entitlement.ts), so there is
 * no "unpaid, blocked" state left to gate on. /pricing is a voluntary upgrade
 * page now, reached by a normal link — never a redirect.
 *
 * Gumroad's Ping (/api/webhooks/gumroad) never reaches this: excluded at the
 * middleware matcher level (middleware.ts) since it carries no session.
 */

export type GateDecision = { action: "allow" } | { action: "redirect"; to: "/auth/login" | "/" };

export function resolveGate(input: { pathname: string; isAuthenticated: boolean }): GateDecision {
  const { pathname, isAuthenticated } = input;

  // MAP-001: no session at all.
  if (!isAuthenticated) {
    return pathname.startsWith("/auth")
      ? { action: "allow" }
      : { action: "redirect", to: "/auth/login" };
  }

  // MAP-001: logged-in creators shouldn't see the auth pages again.
  if (pathname.startsWith("/auth") && pathname !== "/auth/update-password") {
    return { action: "redirect", to: "/" };
  }

  return { action: "allow" };
}
