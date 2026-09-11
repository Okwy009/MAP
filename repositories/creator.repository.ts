import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Resolves a Gumroad buyer to their MAP account. `profiles` has no email column
 * (email lives on `auth.users`), and the Admin API has no get-by-email, so this
 * scans user pages — fine at MVP webhook volume (IP-0002).
 */
export interface CreatorRepository {
  /** Account id (= `profiles.id` = auth user id) for this email, or null if no account exists. */
  findIdByEmail(email: string): Promise<string | null>;
}

export function createCreatorRepository(client: SupabaseClient): CreatorRepository {
  return {
    async findIdByEmail(email) {
      const target = email.trim().toLowerCase();

      for (let page = 1; page <= 20; page++) {
        const { data, error } = await client.auth.admin.listUsers({ page, perPage: 200 });
        if (error) {
          throw new Error(`auth listUsers failed: ${error.message}`);
        }
        const users = data?.users ?? [];
        const match = users.find((u) => u.email?.toLowerCase() === target);
        if (match) return match.id;
        if (users.length < 200) return null;
      }
      return null;
    },
  };
}
