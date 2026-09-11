/**
 * Pure routing rules for the auth + subscription gate (MAP-001 auth login/logout
 * redirects, MAP-002 / IP-0002 task 7 subscription check). No I/O, no
 * Next.js/Supabase imports, so the path-matching logic — the part most likely to
 * have an off-by-one bug — is directly unit-testable, independent of
 * `lib/supabase/middleware.ts`'s session plumbing.
 *
 * Gumroad's Ping (/api/webhooks/gumroad) never reaches this: it's excluded at
 * the middleware matcher level (middleware.ts) since it carries no session and
 * shouldn't pay for an auth round-trip at all.
 */

// Paths an authenticated-but-unpaid creator must still be able to reach.
const SUBSCRIPTION_GATE_EXEMPT_PREFIXES = ["/auth", "/api", "/pricing"];

export function isSubscriptionGateExempt(pathname: string): boolean {
  return SUBSCRIPTION_GATE_EXEMPT_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export type GateDecision =
  { action: "allow" } | { action: "redirect"; to: "/auth/login" | "/" | "/pricing" };

export function resolveGate(input: {
  pathname: string;
  isAuthenticated: boolean;
  /** Active subscription OR migrated_from_manual. Ignored for exempt paths. */
  isEntitled: boolean;
}): GateDecision {
  const { pathname, isAuthenticated, isEntitled } = input;

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

  // MAP-002 / IP-0002 task 7: authenticated but neither an active subscription
  // nor the free migrated_from_manual flag -> pricing, not the app.
  if (!isEntitled && !isSubscriptionGateExempt(pathname)) {
    return { action: "redirect", to: "/pricing" };
  }

  return { action: "allow" };
}
