import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - api/webhooks/gumroad (Gumroad's Ping — unauthenticated by design,
     *   IP-0002 task 3; never had a session to refresh or gate)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|api/webhooks/gumroad|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
