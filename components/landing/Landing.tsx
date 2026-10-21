import Link from "next/link";
import { DM_Mono, DM_Sans, Fraunces } from "next/font/google";
import { ArrowDownRight, ArrowUpRight, Menu, PenLine } from "lucide-react";

/**
 * Signed-out landing view for "/". Self-contained palette and fonts: it stays
 * light and on-brand regardless of the app's dark/light theme.
 */

const display = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-body" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-code" });

const DEMO_URL = "https://www.youtube.com/watch?v=utOQLDqdWFA";

function ArrowBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`flex h-7 w-7 items-center justify-center rounded-full bg-[#F4C24F] text-[#1E1A2E] ${className}`}
    >
      <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
    </span>
  );
}

export function Landing() {
  return (
    <div
      className={`${display.variable} ${sans.variable} ${mono.variable} relative min-h-screen overflow-hidden bg-[#E9E4F1] font-[family-name:var(--font-body)] text-[#1E1A2E]`}
    >
      {/* Decorative ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-48 -top-40 h-[34rem] w-[34rem] rounded-full border-[44px] border-[#F4C24F]/80 sm:-right-40 sm:-top-56 sm:h-[46rem] sm:w-[46rem] sm:border-[64px] lg:-right-24 lg:h-[52rem] lg:w-[52rem]"
      />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-5 sm:px-8 sm:py-7">
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F4C24F] sm:h-8 sm:w-8">
            <PenLine className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="whitespace-nowrap font-[family-name:var(--font-display)] text-[15px] font-semibold tracking-tight sm:text-lg">
            My Accountability Partner
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-5">
          <Link
            href="/auth/login"
            className="hidden text-sm font-medium underline-offset-4 hover:underline sm:inline"
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="flex items-center gap-2 whitespace-nowrap rounded-full bg-[#1E1A2E] px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 sm:py-1.5 sm:pl-4 sm:pr-1.5"
          >
            Join free
            <ArrowBadge className="hidden sm:flex" />
          </Link>
          <details className="relative sm:hidden">
            <summary
              aria-label="Menu"
              className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-[#1E1A2E]/15 bg-white/50 [&::-webkit-details-marker]:hidden"
            >
              <Menu className="h-4 w-4" />
            </summary>
            <div className="absolute right-0 mt-2 flex w-44 flex-col rounded-2xl border border-[#1E1A2E]/10 bg-white p-2 text-sm shadow-lg">
              <Link href="/auth/login" className="rounded-xl px-3 py-2 hover:bg-[#E9E4F1]">
                Log in
              </Link>
              <Link href="/auth/signup" className="rounded-xl px-3 py-2 hover:bg-[#E9E4F1]">
                Join free
              </Link>
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl px-3 py-2 hover:bg-[#E9E4F1]"
              >
                See how it works
              </a>
            </div>
          </details>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-8 sm:pt-20 lg:pt-28">
        <p className="flex items-center gap-3 font-[family-name:var(--font-code)] text-[11px] uppercase tracking-[0.2em] text-[#EE7A55] sm:text-xs">
          <span aria-hidden className="h-px w-10 bg-[#EE7A55]" />A creative accountability system
        </p>

        <h1 className="mt-5 font-[family-name:var(--font-display)] text-[2.6rem] font-bold leading-[0.95] tracking-[-0.03em] sm:text-7xl lg:text-8xl">
          Make the thing.
          <span className="block italic text-[#EE7A55]">Keep making it.</span>
        </h1>

        <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#1E1A2E]/80 sm:text-xl">
          My Accountability Partner turns the loud pile of ideas in your head into one clear next
          move—so your best work gets made, not just mentally rehearsed.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-5">
          <Link
            href="/auth/signup"
            className="flex items-center gap-3 rounded-full border-2 border-[#1E1A2E] bg-[#EE7A55] py-2 pl-6 pr-2 font-semibold shadow-[4px_4px_0_#1E1A2E] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#1E1A2E]"
          >
            Join free
            <ArrowBadge className="h-8 w-8" />
          </Link>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-semibold underline decoration-[#F4C24F] decoration-[3px] underline-offset-[6px] hover:decoration-[#EE7A55]"
          >
            See how it works
            <ArrowDownRight className="h-4 w-4" strokeWidth={2.5} />
          </a>
        </div>

        <p className="mt-12 font-[family-name:var(--font-code)] text-[11px] uppercase tracking-[0.15em] text-[#1E1A2E]/55 sm:text-xs">
          For the half-finished, highly opinionated, still-showing-up.
        </p>
      </main>
    </div>
  );
}
