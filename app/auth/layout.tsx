import { Logo, brandFontVars } from "@/components/brand/brand";

/**
 * Shared shell for /auth/* — same fixed brand palette as the landing page,
 * so going from "Join free" to the form doesn't feel like a different product.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${brandFontVars} relative flex min-h-screen flex-col overflow-hidden bg-map-lavender font-body text-map-ink`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-56 -top-44 h-[32rem] w-[32rem] rounded-full border-[44px] border-map-sun/80 sm:-right-40 sm:-top-56 sm:h-[44rem] sm:w-[44rem] sm:border-[60px]"
      />
      <header className="relative z-10 mx-auto w-full max-w-6xl px-4 py-5 sm:px-8 sm:py-7">
        <Logo />
      </header>
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16 pt-6 sm:p-6">
        <div className="w-full max-w-md rounded-3xl border-2 border-map-ink bg-white p-7 shadow-[8px_8px_0_#1E1A2E] sm:p-9">
          {children}
        </div>
      </main>
    </div>
  );
}
