import type { Tier } from "@/types/subscription";

import type { EmailClient } from "./resend-client";
import { buildPurchaseConfirmationEmail } from "./templates/purchase-confirmation";

export interface SendPurchaseConfirmationInput {
  to: string;
  tier: Tier;
  formattedPrice: string;
  siteUrl: string;
}

export interface EmailService {
  sendPurchaseConfirmation(input: SendPurchaseConfirmationInput): Promise<void>;
}

/** Application service: builds the message, hands it to the integration client. */
export function createEmailService(client: EmailClient): EmailService {
  return {
    async sendPurchaseConfirmation({ to, tier, formattedPrice, siteUrl }) {
      const { subject, html, text } = buildPurchaseConfirmationEmail({
        tier,
        formattedPrice,
        siteUrl,
      });
      await client.send({ to, subject, html, text });
    },
  };
}
