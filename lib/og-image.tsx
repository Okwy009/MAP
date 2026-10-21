import { ImageResponse } from "next/og";

/**
 * Social-share card (Open Graph + Twitter) rendered at build time in the
 * landing page's style. Used by app/opengraph-image.tsx and app/twitter-image.tsx.
 */

export const OG_SIZE = { width: 1200, height: 630 };

const INK = "#1E1A2E";
const LAVENDER = "#E9E4F1";
const SUN = "#F4C24F";
const CORAL_TEXT = "#C8532E";

const HEADLINE = "Stop restarting.";
const SUBHEAD = "Keep making it.";
const BODY = "One clear move a day for creators with day jobs.";
const BRAND = "My Accountability Partner";

/**
 * Satori can't read woff2, so ask Google Fonts for a TTF subset of just the
 * glyphs we draw. Returns null on any failure — the card then falls back to
 * the default font instead of breaking the build.
 */
async function loadGoogleFont(family: string, axes: string, text: string) {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family}:${axes}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
    if (!src) return null;
    const res = await fetch(src[1]);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export async function renderOgImage() {
  const [bold, italic, sans] = await Promise.all([
    loadGoogleFont("Fraunces", "wght@700", HEADLINE + BRAND),
    loadGoogleFont("Fraunces", "ital,wght@1,700", SUBHEAD),
    // Body line needs its own font: Satori otherwise borrows any glyph the
    // Fraunces subsets happen to contain, mixing fonts letter by letter.
    loadGoogleFont("DM+Sans", "wght@500", BODY),
  ]);

  const fonts = [
    ...(sans
      ? [{ name: "DM Sans", data: sans, weight: 500 as const, style: "normal" as const }]
      : []),
    ...(bold
      ? [{ name: "Fraunces", data: bold, weight: 700 as const, style: "normal" as const }]
      : []),
    ...(italic
      ? [{ name: "Fraunces", data: italic, weight: 700 as const, style: "italic" as const }]
      : []),
  ];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: LAVENDER,
        color: INK,
        padding: "64px 72px",
        position: "relative",
        fontFamily: "Fraunces",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -180,
          top: -200,
          width: 700,
          height: 700,
          borderRadius: 9999,
          border: `70px solid ${SUN}`,
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: SUN,
            display: "flex",
          }}
        />
        <div style={{ fontSize: 34, fontWeight: 700 }}>{BRAND}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 112, fontWeight: 700, lineHeight: 1, letterSpacing: -3 }}>
          {HEADLINE}
        </div>
        <div
          style={{
            fontSize: 112,
            fontWeight: 700,
            fontStyle: "italic",
            lineHeight: 1.05,
            letterSpacing: -3,
            color: CORAL_TEXT,
          }}
        >
          {SUBHEAD}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 34,
            fontFamily: "DM Sans",
            fontWeight: 500,
            opacity: 0.85,
          }}
        >
          {BODY}
        </div>
      </div>
    </div>,
    { ...OG_SIZE, fonts: fonts.length ? fonts : undefined }
  );
}
