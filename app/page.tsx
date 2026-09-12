import Link from "next/link";

import { logout } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";

/**
 * Permanent home screen at "/" — shown every time, not a one-time welcome.
 * Auth-aware: signed-out visitors see branding + sign in/up; signed-in
 * creators see a greeting, a demo link, and their way into the app.
 */
export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="flex justify-end p-6">
          <Link href="/" className="text-lg font-bold">
            MAP
          </Link>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-md border border-input bg-background px-6 py-2 font-medium text-foreground transition-colors hover:bg-accent"
            >
              Sign Up
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const firstName = profile?.full_name?.trim().split(/\s+/)[0];
  const greeting = firstName ? `Welcome, ${firstName}` : "Welcome back";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex justify-end p-6">
        <Link href="/" className="text-lg font-bold">
          MAP
        </Link>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
        <h1 className="text-3xl font-bold">{greeting}</h1>
        <a
          href="https://www.youtube.com/watch?v=utOQLDqdWFA"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          First time? See Demo
        </a>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/tracker"
            className="rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go to Dashboard
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-md border border-input bg-background px-6 py-2 font-medium text-foreground transition-colors hover:bg-accent"
            >
              Log out
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
