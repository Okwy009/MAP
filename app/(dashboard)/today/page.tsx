"use client";

import { useEffect, useState } from "react";

import type { Recommendation } from "@/types/recommendation";

/**
 * Real recommendation, replacing the placeholder cards (FR7). A real fetch to
 * GET /api/recommendation, per IP-0006 task 7 — client-rendered rather than
 * an RSC self-fetch, matching PaymentPendingState.tsx's existing pattern
 * (no cookie-forwarding boilerplate for a request the browser can just make
 * itself). No "Complete" button — deferred to MAP-008 per Founder decision.
 */
export default function TodayPage() {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/recommendation", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`status ${res.status}`);
        return res.json() as Promise<Recommendation>;
      })
      .then((data) => {
        if (!cancelled) setRecommendation(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">Today</h1>

      {failed ? (
        <div className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
          Couldn&apos;t load today&apos;s recommendation right now. Try refreshing the page.
        </div>
      ) : !recommendation ? (
        <div className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
          Loading today&apos;s recommendation…
        </div>
      ) : (
        <div className="space-y-4 rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">{recommendation.title}</h2>
          <p className="text-muted-foreground">{recommendation.description}</p>
          <p className="text-sm">
            <span className="font-medium">Estimated time:</span> {recommendation.estimatedDuration}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Why this matters:</span>{" "}
            {recommendation.reason}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Done when:</span>{" "}
            {recommendation.successCriteria}
          </p>
        </div>
      )}
    </div>
  );
}
