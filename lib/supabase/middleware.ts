import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { isSubscriptionGateExempt, resolveGate } from "@/lib/access-gate";
import { getEntitlement } from "@/lib/entitlement";

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // Refresh session if expired.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = user !== null;
  // Skip the extra DB round-trip when the path doesn't need it (auth pages,
  // API routes, the pricing screen itself).
  const exempt = isSubscriptionGateExempt(pathname);
  const isEntitled =
    isAuthenticated && !exempt ? (await getEntitlement(supabase, user.id)).entitled : false;

  const decision = resolveGate({ pathname, isAuthenticated, isEntitled });

  if (decision.action === "redirect") {
    const url = request.nextUrl.clone();
    url.pathname = decision.to;
    return NextResponse.redirect(url);
  }

  return response;
}
