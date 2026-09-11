import { NextResponse } from "next/server";

import { getEntitlement } from "@/lib/entitlement";
import { createClient } from "@/lib/supabase/server";

/**
 * Current creator's own subscription status (IP-0002 API Requirements).
 * Session-cookie authenticated; RLS scopes every read to the caller's own rows.
 * Polled by PaymentPendingState (task 9) while a Ping is still in flight.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { entitled: false, reason: "unauthenticated", tier: null },
      { status: 401 }
    );
  }

  const entitlement = await getEntitlement(supabase, user.id);
  return NextResponse.json(entitlement);
}
