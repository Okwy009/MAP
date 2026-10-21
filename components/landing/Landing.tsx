import Link from "next/link";
import { ArrowDown, Clock, Menu } from "lucide-react";

import { ArrowBadge, Logo, brandFontVars } from "@/components/brand/brand";

/**
 * Signed-out landing page for "/". Fixed brand palette (`map-*` in
 * tailwind.config.ts): stays light regardless of the app's dark/light theme.
 *
 * Product claims here track what's actually built: the example card mirrors
 * the real `Recommendation` shape (services/decision-engine/rules/todays-post.ts),
 * and tracking is labelled "Coming soon" until /tracker is real.
 */

const DEMO_VIDEO_ID = "utOQLDqdWFA";

function JoinFreeButton() {
  return (
    <Link
      href="/auth/signup"
      className="inline-flex items-center gap-3 whitespace-nowrap rounded-full border-2 border-map-ink bg-map-coral py-2 pl-6 pr-2 font-semibold text-map-ink shadow-[4px_4px_0_#1E1A2E] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#1E1A2E]"
    >
      Join free
      <ArrowBadge className="h-8 w-8" />
    </Link>
  );
}

function Eyebrow({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <p
      className={`flex items-center gap-3 font-code text-[11px] uppercase tracking-[0.2em] sm:text-xs ${
        onDark ? "text-map-sun" : "text-map-coral-small"
      }`}
    >
      <span aria-hidden className={`h-px w-10 ${onDark ? "bg-map-sun" : "bg-map-coral-small"}`} />
      {children}
    </p>
  );
}

function ExampleMoveCard() {
  return (
    <figure className="relative mx-auto w-full max-w-md">
      <div className="rotate-[-1.5deg] rounded-3xl border-2 border-map-ink bg-white p-6 shadow-[8px_8px_0_#1E1A2E] sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <span className="font-code text-[11px] uppercase tracking-[0.18em] text-map-coral-small">
            Your move for today
          </span>
          <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-map-lavender px-3 py-1 text-xs font-semibold">
            <Clock className="h-3.5 w-3.5" />
            15–20 min
          </span>
        </div>
        <p className="mt-4 font-display text-[1.7rem] font-bold leading-tight tracking-tight">
          Here&apos;s your post for today.
        </p>
        <p className="mt-1 font-semibold">Write today&apos;s Substack post</p>
        <p className="mt-3 leading-relaxed text-map-ink/80">
          Draft a post about building in public for Substack, in a candid, practical tone.
        </p>
        <dl className="mt-5 space-y-3 border-t border-dashed border-map-ink/25 pt-4 text-sm">
          <div>
            <dt className="font-code text-[11px] uppercase tracking-[0.15em] text-map-ink/70">
              Why this, today
            </dt>
            <dd className="mt-1">
              Weekly posting keeps you moving toward your goal of 1,000 subscribers.
            </dd>
          </div>
          <div>
            <dt className="font-code text-[11px] uppercase tracking-[0.15em] text-map-ink/70">
              Done when
            </dt>
            <dd className="mt-1">One post drafted and ready to publish.</dd>
          </div>
        </dl>
      </div>
      <figcaption className="mt-5 text-center font-code text-[11px] uppercase tracking-[0.15em] text-map-ink/70">
        Example recommendation
      </figcaption>
    </figure>
  );
}

const STEPS = [
  {
    title: "Join free",
    body: "Just your email. We send you a link, so there's no password to forget.",
  },
  {
    title: "Tell MAP about your work",
    body: "A short setup form: where you post, what you write about, your tone and your goal. About 5–10 minutes.",
  },
  {
    title: "Get today's move",
    body: "Every day MAP gives you one thing to do, like “here's your post for today”, with how long it takes and why it matters.",
  },
  {
    title: "Track what's working",
    body: "See whether the work is moving you forward, not just keeping you busy.",
    soon: true,
  },
];

const FAMILIAR = [
  "“I know what I should be doing.”",
  "“I just don't keep doing it.”",
  "“I keep restarting.”",
];

export function Landing() {
  return (
    <div
      className={`${brandFontVars} min-h-screen overflow-x-hidden bg-map-lavender font-body text-map-ink`}
    >
      {/* ───────────── Hero ───────────── */}
      <section className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-56 -top-44 h-[32rem] w-[32rem] rounded-full border-[44px] border-map-sun/80 sm:-right-40 sm:-top-56 sm:h-[44rem] sm:w-[44rem] sm:border-[60px] lg:-right-28 lg:-top-24 lg:h-[50rem] lg:w-[50rem]"
        />

        <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-5 sm:px-8 sm:py-7">
          <Logo />
          <nav className="flex items-center gap-2 sm:gap-6">
            <a
              href="#how-it-works"
              className="hidden text-sm font-medium underline-offset-4 hover:underline md:inline"
            >
              How it works
            </a>
            <Link
              href="/auth/login"
              className="hidden text-sm font-medium underline-offset-4 hover:underline sm:inline"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="flex items-center gap-2 whitespace-nowrap rounded-full bg-map-ink px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 sm:py-1.5 sm:pl-4 sm:pr-1.5"
            >
              Join free
              <ArrowBadge className="hidden sm:flex" />
            </Link>
            <details className="relative sm:hidden">
              <summary
                aria-label="Menu"
                className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-map-ink/15 bg-white/60 [&::-webkit-details-marker]:hidden"
              >
                <Menu className="h-4 w-4" />
              </summary>
              <div className="absolute right-0 mt-2 flex w-44 flex-col rounded-2xl border border-map-ink/10 bg-white p-2 text-sm shadow-lg">
                <a href="#how-it-works" className="rounded-xl px-3 py-2 hover:bg-map-lavender">
                  How it works
                </a>
                <a href="#why" className="rounded-xl px-3 py-2 hover:bg-map-lavender">
                  Why MAP
                </a>
                <Link href="/auth/login" className="rounded-xl px-3 py-2 hover:bg-map-lavender">
                  Log in
                </Link>
              </div>
            </details>
          </nav>
        </header>

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-8 sm:px-8 sm:pt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10 lg:pb-28 lg:pt-20">
          <div>
            <Eyebrow>For creators with day jobs</Eyebrow>

            <h1 className="mt-5 font-display text-[2.6rem] font-bold leading-[0.95] tracking-[-0.03em] sm:text-7xl lg:text-6xl xl:text-[4.5rem]">
              Stop restarting.
              <span className="block italic text-map-coral-text">Keep making it.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-map-ink/85 sm:text-xl">
              MAP gives you one clear move a day, usually “here&apos;s your post for today”, so you
              keep showing up instead of starting over every Monday.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-5">
              <JoinFreeButton />
              <a
                href="#how-it-works"
                className="flex items-center gap-2 font-semibold underline decoration-map-sun decoration-[3px] underline-offset-[6px] hover:decoration-map-coral"
              >
                See how it works
                <ArrowDown className="h-4 w-4" strokeWidth={2.5} />
              </a>
            </div>

            <p className="mt-6 text-sm text-map-ink/75">Free for now. No card needed.</p>
          </div>

          <ExampleMoveCard />
        </div>
      </section>

      {/* ───────────── Why (founder note) ───────────── */}
      <section id="why" className="scroll-mt-6 bg-map-ink text-map-lavender">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:py-28">
          <div>
            <Eyebrow onDark>Why MAP exists</Eyebrow>
            <h2 className="mt-5 font-display text-4xl font-bold leading-[1.02] tracking-[-0.02em] sm:text-5xl">
              Consistency isn&apos;t enough
              <span className="block italic text-map-sun">if it&apos;s pointed the wrong way.</span>
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-map-lavender/85">
            <p>
              Imagine pouring water into a basket every day for six months, and wondering why
              consistency isn&apos;t helping you move a basket full of water from one point to
              another.
            </p>
            <p>
              Tracking is the same. You get to a point where you&apos;ve been putting in the work
              and getting little to no result. Not because you haven&apos;t been consistent, but
              because you&apos;ve been consistently moving the wrong way.
            </p>
            <p>
              That&apos;s why MAP helps with tracking. Not just to keep you consistent, but to keep
              you consistent with a feedback system you can sustain.
            </p>
            <p className="pt-2 font-code text-xs uppercase tracking-[0.18em] text-map-sun">
              — Data Frank, founder
            </p>
          </div>
        </div>
      </section>

      {/* ───────────── How it works ───────────── */}
      <section id="how-it-works" className="scroll-mt-6">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8 lg:py-28">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-display text-4xl font-bold leading-[1.02] tracking-[-0.02em] sm:text-5xl">
            One move a day.
            <span className="block italic text-map-coral-text">That&apos;s the whole system.</span>
          </h2>

          <div className="mt-12 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <ol className="space-y-8">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-map-ink bg-map-sun font-display text-lg font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="flex flex-wrap items-center gap-2 text-lg font-semibold">
                      {step.title}
                      {step.soon && (
                        <span className="rounded-full bg-map-ink px-2.5 py-0.5 font-code text-[10px] uppercase tracking-[0.15em] text-map-lavender">
                          Coming soon
                        </span>
                      )}
                    </h3>
                    <p className="mt-1 leading-relaxed text-map-ink/80">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div>
              <div className="aspect-video overflow-hidden rounded-3xl border-2 border-map-ink bg-map-ink shadow-[8px_8px_0_#1E1A2E]">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${DEMO_VIDEO_ID}?rel=0`}
                  title="MAP demo"
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="mt-5 font-code text-[11px] uppercase tracking-[0.15em] text-map-ink/70">
                Watch the demo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Who it's for ───────────── */}
      <section className="border-y-2 border-map-ink bg-map-sun">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8 lg:py-24">
          <p className="font-code text-[11px] uppercase tracking-[0.2em] sm:text-xs">
            Sound familiar?
          </p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {FAMILIAR.map((line) => (
              <li
                key={line}
                className="rounded-full border-2 border-map-ink bg-white px-5 py-2.5 font-display text-lg font-semibold italic sm:text-xl"
              >
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-2xl text-lg leading-relaxed sm:text-xl">
            MAP is built for creators with a busy job, a family and limited energy. You don&apos;t
            need more motivation or a bigger plan. You need today&apos;s next move, small enough to
            fit around everything else.
          </p>
        </div>
      </section>

      {/* ───────────── Final CTA ───────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-64 -left-48 h-[30rem] w-[30rem] rounded-full border-[40px] border-map-sun/80 sm:h-[38rem] sm:w-[38rem] sm:border-[56px]"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center sm:px-8 lg:py-32">
          <h2 className="font-display text-5xl font-bold leading-[0.95] tracking-[-0.03em] sm:text-7xl">
            Write. Build. Track.
            <span className="block italic text-map-coral-text">With MAP.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-lg text-map-ink/85">
            Free for now. No card needed. Setup takes about 10 minutes.
          </p>
          <div className="mt-9 flex justify-center">
            <JoinFreeButton />
          </div>
        </div>

        <footer className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-map-ink/15 px-4 py-8 text-sm sm:px-8">
          <Logo />
          <div className="flex items-center gap-6 text-map-ink/75">
            <Link href="/auth/login" className="hover:text-map-ink hover:underline">
              Log in
            </Link>
            <span>© {new Date().getFullYear()} My Accountability Partner</span>
          </div>
        </footer>
      </section>
    </div>
  );
}
