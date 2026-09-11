import { TIER_VARIANT_LABELS } from "@/lib/gumroad";
import { SUPPORT_EMAIL } from "@/lib/support";
import type { Tier } from "@/types/subscription";

export interface PurchaseConfirmationInput {
  tier: Tier;
  /** Gumroad's own currency-formatted charge amount, e.g. "$19". */
  formattedPrice: string;
  /** Where "Continue to MAP" should point. */
  siteUrl: string;
}

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

/**
 * Purchase confirmation email (IP-0002 task 11 / FR9). Pure — no I/O, no
 * network. Tells the creator what they bought, what it cost, and gives them a
 * concrete way back into MAP and a way to reach a human if something's wrong.
 */
export function buildPurchaseConfirmationEmail(input: PurchaseConfirmationInput): EmailContent {
  const tierName = TIER_VARIANT_LABELS[input.tier];
  const price = input.formattedPrice;

  const subject = `You're in — your MAP ${tierName} plan is active`;

  const text = [
    `Hi,`,
    ``,
    `Your MAP ${tierName} plan (${price}/mo) is active — you're all set.`,
    ``,
    `Continue to MAP: ${input.siteUrl}`,
    ``,
    `Something looks wrong? Email ${SUPPORT_EMAIL} and we'll sort it out.`,
    ``,
    `— MAP`,
  ].join("\n");

  const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; color: #111111; line-height: 1.5;">
  <p>Hi,</p>
  <p>Your MAP <strong>${tierName}</strong> plan (<strong>${price}/mo</strong>) is active — you're all set.</p>
  <p style="margin: 24px 0;">
    <a href="${input.siteUrl}" style="background:#111111;color:#ffffff;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;font-weight:600;">
      Continue to MAP
    </a>
  </p>
  <p style="color:#666666;font-size:13px;">
    Something looks wrong? Email
    <a href="mailto:${SUPPORT_EMAIL}" style="color:#666666;">${SUPPORT_EMAIL}</a>
    and we'll sort it out.
  </p>
  <p>— MAP</p>
</div>
`.trim();

  return { subject, html, text };
}
