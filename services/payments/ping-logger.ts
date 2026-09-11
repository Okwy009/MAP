import type { PingResult } from "@/types/subscription";

/**
 * Structured logging for the Gumroad Ping receiver (IP-0002 task 13 / FR10).
 * Never logs the Gumroad access token, the buyer's email, or the raw Ping
 * payload — only the sale_id and the already-computed verification result.
 */

/** A Ping that couldn't even be parsed, or was missing sale_id. Still "received" per FR10. */
export function logPingRejectedMalformed(reason: string): void {
  console.warn(`[gumroad-ping] rejected: ${reason}`);
}

/** The routine per-Ping outcome line: accepted/rejected/duplicate/etc. */
export function logPingResult(saleId: string, result: PingResult): void {
  const detail =
    result.outcome === "rejected"
      ? ` reason=${result.reason}`
      : result.outcome === "verified"
        ? ` emailSent=${result.emailSent}`
        : "";
  console.info(`[gumroad-ping] sale=${saleId} outcome=${result.outcome}${detail}`);

  // Escalated separately, deliberately — a verified purchase whose
  // confirmation email failed to send must not be invisible just because the
  // routine outcome line above still reads "verified" at info level.
  if (result.outcome === "verified" && result.emailSent === false) {
    console.warn(`[gumroad-ping-email-failure] sale=${saleId} confirmation email failed to send`);
  }
}

/** An unexpected failure (e.g. Gumroad API unreachable, DB write failed). */
export function logPingError(saleId: string, error: unknown): void {
  console.error(`[gumroad-ping] sale=${saleId} processing error`, error);
}
