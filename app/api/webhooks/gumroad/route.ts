import { NextResponse } from "next/server";

import { getGumroadConfig } from "@/lib/gumroad";
import { createServiceRoleClient } from "@/lib/supabase/service";
import { createCreatorRepository } from "@/repositories/creator.repository";
import { createProcessedSaleRepository } from "@/repositories/processed-sale.repository";
import { createSubscriptionRepository } from "@/repositories/subscription.repository";
import { createEmailService } from "@/services/email/email-service";
import { createResendClient } from "@/services/email/resend-client";
import { createGumroadClient } from "@/services/payments/gumroad-client";
import { createPaymentDomainService } from "@/services/payments/payment-domain-service";
import { createPaymentService } from "@/services/payments/payment-service";
import {
  logPingError,
  logPingRejectedMalformed,
  logPingResult,
} from "@/services/payments/ping-logger";
import type { GumroadPing } from "@/types/subscription";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function firstString(value: FormDataEntryValue | null): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

/**
 * Gumroad Ping receiver (IP-0002 task 3).
 *
 * Unauthenticated by nature. Trusts nothing in the body except which sale to go
 * verify. Returns 200 for any well-formed Ping that Gumroad should not retry;
 * non-2xx only for a malformed request or an unexpected error we want retried
 * (Gumroad retries hourly for 3 hours on a non-200).
 *
 * Logging (IP-0002 task 13 / FR10): every Ping received and its verification
 * result, without ever logging the Gumroad access token or the raw payload —
 * see services/payments/ping-logger.ts.
 */
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    logPingRejectedMalformed("malformed body");
    return new NextResponse("malformed body", { status: 400 });
  }

  const saleId = firstString(form.get("sale_id"));
  if (!saleId) {
    logPingRejectedMalformed("missing sale_id");
    return new NextResponse("missing sale_id", { status: 400 });
  }

  const ping: GumroadPing = {
    saleId,
    test: firstString(form.get("test")) === "true",
    subscriptionId: firstString(form.get("subscription_id")),
  };

  try {
    const config = getGumroadConfig();
    const supabase = createServiceRoleClient();
    const service = createPaymentService({
      gumroadClient: createGumroadClient(config),
      domain: createPaymentDomainService({
        productId: config.productId,
        tierVariantKey: config.tierVariantKey,
      }),
      creators: createCreatorRepository(supabase),
      subscriptions: createSubscriptionRepository(supabase),
      processedSales: createProcessedSaleRepository(supabase),
      emails: createEmailService(createResendClient()),
      siteUrl: SITE_URL,
    });

    const result = await service.handlePing(ping);
    logPingResult(ping.saleId, result);
    return NextResponse.json({ outcome: result.outcome });
  } catch (error) {
    logPingError(ping.saleId, error);
    return new NextResponse("processing error", { status: 500 });
  }
}
