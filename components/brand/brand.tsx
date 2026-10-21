import Link from "next/link";
import { DM_Mono, DM_Sans, Fraunces } from "next/font/google";
import { ArrowUpRight, PenLine } from "lucide-react";

/**
 * Shared brand pieces for the public pages (landing + auth): fonts, logo, and
 * the arrow badge used on CTAs. Colours live in tailwind.config.ts (`map-*`).
 */

const display = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });
const code = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-code" });

/** Put on the outermost element of a branded page to make the font vars available. */
export const brandFontVars = `${display.variable} ${body.variable} ${code.variable}`;

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 sm:gap-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-map-sun sm:h-8 sm:w-8">
        <PenLine className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <span className="whitespace-nowrap font-display text-[15px] font-semibold tracking-tight sm:text-lg">
        My Accountability Partner
      </span>
    </Link>
  );
}

export function ArrowBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`flex h-7 w-7 items-center justify-center rounded-full bg-map-sun text-map-ink ${className}`}
    >
      <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
    </span>
  );
}
