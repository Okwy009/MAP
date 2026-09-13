/**
 * Tally webhook payload shape. Verified against Tally's own documentation
 * (developers.tally.so / tally.so/help/webhooks) — not guessed: the envelope
 * is `{ eventId, eventType, createdAt, data: { submissionId, formId, fields } }`;
 * each field is `{ key, label, type, value, options? }`, where `value` for a
 * choice-type field is an array of selected option IDs (even single-select)
 * and `options` is `{ id, text }[]`.
 */
export interface TallyOption {
  id: string;
  text: string;
}

export interface TallyField {
  key: string;
  label: string;
  type: string;
  value: unknown;
  options?: TallyOption[];
}

export interface TallyWebhookPayload {
  eventId: string;
  eventType: string;
  createdAt: string;
  data: {
    responseId: string;
    submissionId: string;
    respondentId: string;
    formId: string;
    fields: TallyField[];
  };
}
