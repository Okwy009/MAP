"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { SUPPORT_EMAIL } from "@/lib/support";

const POLL_INTERVAL_MS = 4000;
const MAX_POLLS = 15; // ~1 minute, then stop bothering the server

/**
 * Fallback for the rare case a creator returns to MAP before their Gumroad
 * Ping has finished processing (IP-0002 task 9, revised scope).
 *
 * Gumroad Membership products don't support a custom post-purchase redirect,
 * so there's no "I just paid" signal in the URL — the founder's manual
 * "Continue to MAP" link on Gumroad's own confirmation page points at the
 * site root either way. This renders as an unobtrusive banner on /pricing
 * (where the access-gate sends any authenticated-but-unentitled visit) and
 * polls quietly; it does not assume the visitor actually just paid.
 */
export function PaymentPendingState() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    if (gaveUp) return;

    let polls = 0;

    const id = setInterval(async () => {
      setChecking(true);
      try {
        const res = await fetch("/api/subscription/status", { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as { entitled?: boolean };
          if (data.entitled) {
            clearInterval(id);
            router.replace("/");
            return;
          }
        }
      } catch {
        // Network hiccup — just try again next tick.
      } finally {
        setChecking(false);
      }

      polls += 1;
      if (polls >= MAX_POLLS) {
        setGaveUp(true);
        clearInterval(id);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(id);
  }, [gaveUp, router]);

  return (
    <div className="mb-10 rounded-lg border border-border bg-card p-4 text-center text-sm text-muted-foreground">
      {gaveUp ? (
        <>
          We haven&apos;t been able to confirm your purchase yet, but if Gumroad charged your card,
          you&apos;re not being charged again — this MAP-side confirmation can occasionally lag.
          Check your inbox for the Gumroad receipt as proof the charge went through. Still not
          unlocked after a few minutes? Email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
            {SUPPORT_EMAIL}
          </a>{" "}
          with your purchase email and we&apos;ll get you in manually.
        </>
      ) : (
        <>
          Just completed checkout on Gumroad?{" "}
          {checking
            ? "Checking now…"
            : "We're watching for confirmation — this updates automatically."}
        </>
      )}
    </div>
  );
}
