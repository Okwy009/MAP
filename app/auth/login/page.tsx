import Link from "next/link";
import { login } from "@/app/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; sent?: string }>;
}) {
  const { message, sent } = await searchParams;

  if (sent) {
    return (
      <div className="w-full text-center">
        <div className="mb-8">
          <h1 className="mb-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Check your email
          </h1>
          <p className="text-map-ink/75">
            We&apos;ve sent you a sign-in link. Open it on this device to continue.
          </p>
        </div>
        <Link
          href="/auth/login"
          className="text-sm font-semibold text-map-coral-small underline decoration-map-sun decoration-2 underline-offset-4 hover:decoration-map-coral"
        >
          Use a different email
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Welcome back
        </h1>
        <p className="text-map-ink/75">Enter your email to sign in</p>
        {message && <p className="mt-4 text-sm font-medium text-red-700">{message}</p>}
      </div>
      <form action={login} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-full border-2 border-map-ink bg-white px-5 py-3 placeholder:text-map-ink/40 focus:outline-none focus:ring-4 focus:ring-map-sun"
            placeholder="you@example.com"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-full border-2 border-map-ink bg-map-coral py-3 font-semibold text-map-ink shadow-[4px_4px_0_#1E1A2E] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#1E1A2E]"
        >
          Send sign-in link
        </button>
      </form>
      <div className="mt-8 text-center">
        <p className="text-map-ink/75">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-map-coral-small underline decoration-map-sun decoration-2 underline-offset-4 hover:decoration-map-coral"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
