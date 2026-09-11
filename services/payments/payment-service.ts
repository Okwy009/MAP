import type { EmailService } from "@/services/email/email-service";
import type { CreatorRepository } from "@/repositories/creator.repository";
import type { ProcessedSaleRepository } from "@/repositories/processed-sale.repository";
import type { SubscriptionRepository } from "@/repositories/subscription.repository";
import type { GumroadPing, PingResult } from "@/types/subscription";

import type { GumroadClient } from "./gumroad-client";
import type { PaymentDomainService } from "./payment-domain-service";

export interface PaymentServiceDeps {
  gumroadClient: GumroadClient;
  domain: PaymentDomainService;
  creators: CreatorRepository;
  subscriptions: SubscriptionRepository;
  processedSales: ProcessedSaleRepository;
  emails: EmailService;
  /** Base URL for the confirmation email's "Continue to MAP" link. */
  siteUrl: string;
}

export interface PaymentService {
  /**
   * Handles one Gumroad Ping: verifies the referenced sale server-to-server,
   * classifies it, and — for a verified purchase — creates/updates the buyer's
   * subscription and sends a confirmation email, or — for a verified
   * refund/dispute — revokes it (FR13). Marks the sale processed only after
   * the corresponding write succeeds.
   */
  handlePing(ping: GumroadPing): Promise<PingResult>;
}

export function createPaymentService(deps: PaymentServiceDeps): PaymentService {
  const { gumroadClient, domain, creators, subscriptions, processedSales, emails, siteUrl } = deps;

  async function handlePing(ping: GumroadPing): Promise<PingResult> {
    // --- Task 5: idempotency (FR6). Gumroad retries hourly for 3h on a non-200
    // and can also deliver the same Ping more than once. If we've already
    // finished this sale, acknowledge and stop. ---
    if (await processedSales.has(ping.saleId)) {
      return { outcome: "duplicate", saleId: ping.saleId };
    }

    // --- Task 4: verify-by-callback. The Ping is unsigned; this server-to-server
    // lookup is the only trust boundary for any access decision. ---
    const sale = await gumroadClient.getSale(ping.saleId);
    if (!sale) {
      return { outcome: "rejected", saleId: ping.saleId, reason: "sale_not_found" };
    }

    if (ping.test || sale.test) {
      return { outcome: "ignored_test", saleId: ping.saleId };
    }

    const result = domain.classifySale(sale);

    // --- Task 6: persist the subscription for a verified purchase, then (and
    // only then) mark the sale processed, so a sale is never recorded without
    // its subscription actually existing. ---
    if (result.outcome === "verified") {
      const creatorId = await creators.findIdByEmail(sale.email);
      if (!creatorId) {
        // PRD-0002 edge case: paid, but no MAP account for this email. Don't
        // record it — leave it replayable once the account exists / is fixed.
        return { outcome: "rejected", saleId: ping.saleId, reason: "no_matching_account" };
      }

      await subscriptions.upsertActive({
        creatorId,
        tier: result.tier,
        gumroadSaleId: sale.id,
        purchasedAt: sale.purchasedAt,
      });
      await processedSales.record(ping.saleId);

      // --- Task 11 (FR9): best-effort confirmation email. The purchase and
      // access grant above have already succeeded and been recorded — a
      // delivery failure here must NOT roll back the transaction or turn an
      // already-completed Ping into a 500 (idempotency would just no-op a
      // retry anyway, so there's nothing useful a retry would accomplish). ---
      let emailSent = false;
      try {
        await emails.sendPurchaseConfirmation({
          to: sale.email,
          tier: result.tier,
          formattedPrice: sale.formattedDisplayPrice,
          siteUrl,
        });
        emailSent = true;
      } catch {
        emailSent = false;
      }

      return { ...result, emailSent };
    }

    // --- Task 10 (FR13): a verified refund/dispute revokes access immediately,
    // no founder action required. Same order as the verified branch above —
    // persist first, record only after — so a refund Ping is never marked
    // processed without the subscription actually having been deactivated. A
    // sale_id that doesn't match any current subscription (e.g. it was already
    // superseded by a later purchase) is a no-op update, not an error: it must
    // never deactivate a creator's unrelated, currently-active subscription. ---
    if (result.outcome === "verified_refund") {
      await subscriptions.markInactiveBySaleId(sale.id);
      await processedSales.record(ping.saleId);
    }

    return result;
  }

  return { handlePing };
}
