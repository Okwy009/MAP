import { Resend } from "resend";

import { getResendConfig } from "@/lib/resend";

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface EmailClient {
  send(message: EmailMessage): Promise<void>;
}

/**
 * Thin wrapper around the Resend SDK. No business rules here — it only turns
 * a message into an API call. Config is resolved lazily inside send(), not at
 * construction, so building this client never throws for Pings that don't end
 * up sending anything.
 */
export function createResendClient(): EmailClient {
  return {
    async send(message) {
      const { apiKey, fromEmail } = getResendConfig();
      const resend = new Resend(apiKey);

      const { error } = await resend.emails.send({
        from: fromEmail,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
      });

      if (error) {
        throw new Error(`Resend send failed: ${error.message}`);
      }
    },
  };
}
