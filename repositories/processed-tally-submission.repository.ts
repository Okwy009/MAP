import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Idempotency ledger for Tally submissions (IP-0005 task 5), mirroring
 * `processed-sale.repository.ts` from MAP-002. RLS has no policies, so this
 * only works via the service-role client.
 */
export interface ProcessedTallySubmissionRepository {
  has(submissionId: string): Promise<boolean>;
  record(submissionId: string): Promise<void>;
}

export function createProcessedTallySubmissionRepository(
  client: SupabaseClient
): ProcessedTallySubmissionRepository {
  return {
    async has(submissionId) {
      const { data, error } = await client
        .from("processed_tally_submissions")
        .select("submission_id")
        .eq("submission_id", submissionId)
        .maybeSingle();

      if (error) {
        throw new Error(`processed_tally_submissions lookup failed: ${error.message}`);
      }
      return data !== null;
    },

    async record(submissionId) {
      const { error } = await client
        .from("processed_tally_submissions")
        .insert({ submission_id: submissionId });

      if (error) {
        // 23505 = unique_violation: a concurrent retry already recorded this
        // submission. That is the idempotent outcome, not a failure.
        if (error.code === "23505") return;
        throw new Error(`processed_tally_submissions insert failed: ${error.message}`);
      }
    },
  };
}
