export interface ResendConfig {
  apiKey: string;
  /** "Name <address@verified-domain>" or a bare address on a verified domain. */
  fromEmail: string;
}

/**
 * Reads Resend config from the environment. Throws on missing values — but
 * only ever called at the point of actually sending (see
 * services/email/resend-client.ts), never eagerly at request start, so a
 * missing/incomplete Resend setup never blocks unrelated Ping processing.
 *
 *   RESEND_API_KEY     — runtime only, never committed
 *   RESEND_FROM_EMAIL  — must be on a domain verified with Resend
 */
export function getResendConfig(): ResendConfig {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!fromEmail) {
    throw new Error("RESEND_FROM_EMAIL is not set");
  }

  return { apiKey, fromEmail };
}
