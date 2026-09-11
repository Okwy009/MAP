import Link from "next/link";
import { signup } from "@/app/actions/auth";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; sent?: string }>;
}) {
  const { message, sent } = await searchParams;

  if (sent) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent you a link to finish creating your account. Open it on this device to
            continue.
          </p>
        </div>
        <Link href="/auth/signup" className="text-sm text-primary hover:underline">
          Use a different email
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Create your account</h1>
        <p className="text-muted-foreground">Enter your email to get started</p>
        {message && <p className="mt-4 text-sm text-destructive">{message}</p>}
      </div>
      <form action={signup} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="you@example.com"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-primary py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Send sign-up link
        </button>
      </form>
      <div className="mt-8 text-center">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
